import { ref, computed, watch } from 'vue';
import { supabase } from './supabase.js';

// ==========================================
// 1. STATE หลักสำหรับสินค้า/ท่าฝึก และ ตะกร้า
// ==========================================
export const products = ref([]);    
export const loading = ref(true);  
export const errorMsg = ref('');
export const cart = ref([]);
export const favCount = ref(0);
export const notice = ref('');
export const TARGET_TIME = 60;

// Computed Properties สำหรับคำนวณเวลาและโบนัส
export const itemCount = computed(() => cart.value.length);
export const totalTime = computed(() => cart.value.reduce((sum, item) => sum + Number(item.time || 0), 0));
export const averageTime = computed(() => { 
  if (itemCount.value === 0) return 0; 
  return Math.round(totalTime.value / itemCount.value);
});
export const remaining = computed(() => Math.max(0, TARGET_TIME - totalTime.value));
export const progress = computed(() => Math.min(100, Math.round((totalTime.value / TARGET_TIME) * 100)));
export const discount = computed(() => totalTime.value >= 30 ? 5 : 0);
export const netTotal = computed(() => Math.max(0, totalTime.value - discount.value));

// แจ้งเตือนเมื่อสะสมเวลาครบ 30 นาที
watch(totalTime, (newVal, oldVal) => {
  if (newVal >= 30 && oldVal < 30) {
    notice.value = '🎉 ออกกำลังกายครบ 30 นาทีแล้ว!';
  } else if (newVal < 30 && oldVal >= 30) {
    notice.value = '💪 เวลารวมต่ำกว่า 30 นาที';
  }
});

// ฟังก์ชันจัดการตารางสะสมท่าฝึก (Cart Management)
export function addToCart(product) { 
  cart.value.push(product); 
}

export function removeFromCart(index) {
  if (index >= 0 && index < cart.value.length) {
    cart.value.splice(index, 1);
  }
}

export function addFav() { 
  favCount.value++; 
}

export function clearCart() {
  cart.value = [];
  notice.value = '';
}

// ==========================================
// 2. การดึงและจัดการข้อมูลท่าฝึก (Products API)
// ==========================================
export async function loadProducts() {
  if (products.value.length === 0) loading.value = true;   
  errorMsg.value = '';
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('time');

  if (error) {
    errorMsg.value = 'โหลดไม่สำเร็จ กรุณาลองใหม่';
    console.error(error);   
  } else {
    products.value = data || [];
  }
  loading.value = false;
}

export async function addProduct(newItem) {
  const { error } = await supabase.from('products').insert(newItem);
  if (error) return error.message;
  await loadProducts();  
  return '';
}

export async function updateTime(id, newTime) {
  const { data, error } = await supabase
    .from('products')
    .update({ time: newTime }) 
    .eq('id', id)            
    .select();
  if (error) return error.message;
  if (!data || data.length === 0) return 'ไม่มีสิทธิ์แก้ไข (ยังไม่ได้ล็อกอิน?) หรือไม่พบสินค้า';
  await loadProducts();
  return '';
}

export async function deleteProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .delete()
    .eq('id', id)            
    .select();
  if (error) return error.message;
  if (!data || data.length === 0) return 'ไม่มีสิทธิ์ลบ (ยังไม่ได้ล็อกอิน?) หรือไม่พบสินค้า';
  await loadProducts();
  return '';
}

// ==========================================
// 3. ระบบแบบประเมินสุขภาพ (Assessments DB)
// ==========================================
export const assessments = ref(
  JSON.parse(localStorage.getItem('senior_assessments_db') || '[]')
);

// โหลดรายการแบบประเมินจาก Supabase (ถ้ามีตาราง assessments) หรือ LocalStorage
export async function loadAssessments() {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      assessments.value = data;
      localStorage.setItem('senior_assessments_db', JSON.stringify(data));
      return;
    }
  } catch (e) {
    console.log('ใช้ข้อมูลแบบประเมินจาก LocalStorage สำรอง');
  }

  const localData = localStorage.getItem('senior_assessments_db');
  if (localData) {
    try { assessments.value = JSON.parse(localData); } catch (e) {}
  }
}

// บันทึก/ส่งแบบประเมินใหม่
export async function submitAssessment(data) {
  const newRecord = {
    id: Date.now(),
    date: new Date().toLocaleString('th-TH'),
    ageGroup: data.ageGroup,
    energyLevel: data.energyLevel,
    energyText: data.energyText,
    q1: data.q1 === 'yes' ? 'มีอาการ' : 'ไม่มีอาการ',
    q2: data.q2 === 'yes' ? 'มีปัญหา' : 'ปกติ',
    q3: data.q3 === 'yes' ? 'มีโรคประจำตัว' : 'ไม่มี',
    recommendation: data.recommendationText,
    hasWarning: data.hasWarning
  };

  // 1. บันทึกลง LocalState ทันที
  assessments.value.unshift(newRecord);
  localStorage.setItem('senior_assessments_db', JSON.stringify(assessments.value));

  // 2. พยายามส่งไปยัง Supabase (ถ้ามีตาราง)
  try {
    await supabase.from('assessments').insert({
      age_group: data.ageGroup,
      energy_level: data.energyLevel,
      q1: newRecord.q1,
      q2: newRecord.q2,
      q3: newRecord.q3,
      recommendation: newRecord.recommendation,
      has_warning: newRecord.hasWarning
    });
  } catch (e) {
    console.error('บันทึกผ่าน LocalStorage สำเร็จแล้ว');
  }

  return true;
}

// ลบแบบประเมินสำหรับ Admin
export async function deleteAssessment(id) {
  assessments.value = assessments.value.filter(item => item.id !== id);
  localStorage.setItem('senior_assessments_db', JSON.stringify(assessments.value));

  try {
    await supabase.from('assessments').delete().eq('id', id);
  } catch (e) {}
}

// ==========================================
// 4. REALTIME LISTENER & AUTHENTICATION
// ==========================================
export const liveMsg = ref('');    
let channel = null;

export function startRealtime() {
  if (channel) return;   
  channel = supabase
    .channel('products-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      () => {
        liveMsg.value = '🔔 มีการอัปเดต – แสดงข้อมูลล่าสุดแล้ว';
        setTimeout(() => { liveMsg.value = ''; }, 5000);
        loadProducts();
      }
    )
    .subscribe();
}

export function stopRealtime() {
  if (channel) {
    supabase.removeChannel(channel);    
    channel = null;
  }
}

// ระบบระบุตัวตนผู้ใช้ (Authentication)
export const user = ref(null);  

export const authReady = supabase.auth.getSession().then(({ data }) => {
  user.value = data.session?.user ?? null;
});

supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user ?? null;
});

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' : '';
}

export async function signOut() {
  await supabase.auth.signOut();
}