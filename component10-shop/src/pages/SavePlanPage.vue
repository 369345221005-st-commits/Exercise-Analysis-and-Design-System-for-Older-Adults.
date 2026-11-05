<template>
  <div class="save-plan-page">
    <div class="plan-card">
      <!-- ส่วนหัวสีฟ้าอ่อน -->
      <div class="card-header">
        <h1>🗓️ บันทึกแผนการออกกำลังกายประจำวัน</h1>
      </div>

      <div class="card-body">
        <p class="subtitle">
          บันทึกตารางการฝึก สภาพร่างกาย และผลการปฏิบัติเพื่อติดตามพัฒนาการสุขภาพอย่างใกล้ชิด
        </p>

        <!-- สรุปข้อมูลจากตารางสะสมปัจจุบัน -->
        <div class="summary-box">
          <div class="summary-header">
            <h3>📊 สรุปตารางฝึกที่เลือกไว้ในปัจจุบัน</h3>
            <span class="badge-time">{{ netTotal }} นาที</span>
          </div>

          <div v-if="cart.length === 0" class="empty-cart-note">
            ⚠️ ยังไม่มีรายการท่าฝึกในตารางสะสม (<router-link to="/products">ไปเลือกท่าฝึก</router-link>)
          </div>

          <ul v-else class="selected-list">
            <li v-for="(item, idx) in cart" :key="idx">
              <span>🏋️ {{ item.title }}</span>
              <strong>⏱️ {{ item.time }} นาที</strong>
            </li>
          </ul>
        </div>

        <!-- ฟอร์มกรอกข้อมูลบันทึกประจำวัน -->
        <form @submit.prevent="handleSavePlan" class="plan-form">
          <div class="form-grid">
            <!-- วันที่บันทึก -->
            <div class="form-group">
              <label for="plan-date">📅 วันที่ปฏิบัติกิจกรรม *</label>
              <input
                id="plan-date"
                v-model="planDate"
                type="date"
                required
                class="custom-input"
              />
            </div>

            <!-- ช่วงเวลาที่ฝึก -->
            <div class="form-group">
              <label for="plan-time-slot">⏰ ช่วงเวลาที่ฝึก *</label>
              <select id="plan-time-slot" v-model="timeSlot" class="custom-select">
                <option value="morning">🌅 ตอนเช้า (06.00 - 09.00 น.)</option>
                <option value="afternoon">☀️ ตอนบ่าย (15.00 - 17.00 น.)</option>
                <option value="evening">🌆 ตอนเย็น (17.00 - 19.00 น.)</option>
              </select>
            </div>
          </div>

          <!-- สภาพร่างกายก่อน/หลังฝึก -->
          <div class="form-group">
            <label for="feeling">😊 สภาพร่างกายและความรู้สึกขณะฝึก</label>
            <select id="feeling" v-model="feeling" class="custom-select">
              <option value="fresh">😄 สดชื่น กระปรี้กระเปร่า ไม่รู้สึกเหนื่อยเกินไป</option>
              <option value="normal">🙂 ปกติ เหนื่อยกำลังพอดี</option>
              <option value="tired">ปวดตึงกล้ามเนื้อเล็กน้อย ควรพักผ่อน</option>
              <option value="exhausted">เหนื่อยหอบ/วิกฤต ควรลดเวลาลง</option>
            </select>
          </div>

          <!-- หมายเหตุเพิ่มเติม -->
          <div class="form-group">
            <label for="notes">📝 บันทึกเพิ่มเติม หรือข้อสังเกตความผิดปกติ</label>
            <textarea
              id="notes"
              v-model="notes"
              rows="3"
              placeholder="เช่น ดื่มน้ำตามปกติ ข้อเข่าไม่มีอาการปวด สามารถทำครบทุกท่า..."
              class="custom-textarea"
            ></textarea>
          </div>

          <!-- ข้อความแจ้งเตือนสถานะ -->
          <p v-if="saveMessage" class="status-alert" role="status">
            {{ saveMessage }}
          </p>

          <!-- ปุ่มการทำงาน -->
          <div class="action-buttons">
            <button type="submit" class="btn-save-submit" :disabled="isSaving || cart.length === 0">
              {{ isSaving ? '⏳ กำลังบันทึก...' : '💾 บันทึกแผนการฝึกประจำวันนี้' }}
            </button>
            <router-link to="/cart" class="btn-back">
              ← กลับไปหน้าตารางสะสม
            </router-link>
          </div>
        </form>

        <!-- ประวัติการบันทึกย้อนหลัง (ถ้ามี) -->
        <div v-if="savedLogs.length > 0" class="history-section">
          <h3>📜 ประวัติการบันทึกล่าสุด</h3>
          <div class="history-list">
            <div v-for="(log, i) in savedLogs" :key="i" class="history-item">
              <div class="history-top">
                <span class="history-date">📅 {{ log.date }} ({{ getSlotText(log.timeSlot) }})</span>
                <span class="history-time">⏱️ รวม {{ log.totalMinutes }} นาที ({{ log.itemCount }} ท่า)</span>
              </div>
              <p class="history-feeling">💬 ความรู้สึก: {{ getFeelingText(log.feeling) }}</p>
              <p v-if="log.notes" class="history-note">📌 หมายเหตุ: {{ log.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { cart, netTotal, itemCount } from '../store.js';

const planDate = ref(new Date().toISOString().split('T')[0]);
const timeSlot = ref('morning');
const feeling = ref('fresh');
const notes = ref('');
const isSaving = ref(false);
const saveMessage = ref('');
const savedLogs = ref([]);

// โหลดประวัติที่บันทึกไว้ใน LocalStorage (ถ้ามี)
onMounted(() => {
  const localData = localStorage.getItem('senior_exercise_logs');
  if (localData) {
    try {
      savedLogs.value = JSON.parse(localData);
    } catch (e) {
      console.error(e);
    }
  }
});

function handleSavePlan() {
  if (cart.value.length === 0) {
    saveMessage.value = '❌ กรุณาเลือกท่าออกกำลังกายใส่ตารางสะสมก่อนทำการบันทึก';
    return;
  }

  isSaving.value = true;
  saveMessage.value = '';

  const newLog = {
    date: planDate.value,
    timeSlot: timeSlot.value,
    feeling: feeling.value,
    notes: notes.value,
    totalMinutes: netTotal.value,
    itemCount: itemCount.value,
    exercises: cart.value.map(item => item.title),
    createdAt: new Date().toLocaleString('th-TH')
  };

  setTimeout(() => {
    savedLogs.value.unshift(newLog);
    localStorage.setItem('senior_exercise_logs', JSON.stringify(savedLogs.value));
    
    isSaving.value = false;
    saveMessage.value = '✅ บันทึกแผนการออกกำลังกายประจำวันเรียบร้อยแล้ว!';
    notes.value = '';
  }, 600);
}

function getSlotText(slot) {
  if (slot === 'morning') return 'เช้า';
  if (slot === 'afternoon') return 'บ่าย';
  return 'เย็น';
}

function getFeelingText(f) {
  if (f === 'fresh') return 'สดชื่น กระปรี้กระเปร่า';
  if (f === 'normal') return 'ปกติ เหนื่อยกำลังดี';
  if (f === 'tired') return 'ปวดตึงกล้ามเนื้อเล็กน้อย';
  return 'เหนื่อยหอบง่าย';
}
</script>

<style scoped>
.save-plan-page {
  max-width: 720px;
  margin: 30px auto;
  padding: 0 16px;
  font-family: system-ui, -apple-system, sans-serif;
}

.plan-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #bae6fd;
  box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.15);
}

.card-header {
  background: #38bdf8; /* 🌊 สีฟ้าอ่อน */
  padding: 20px 28px;
  color: #0f172a;
}

.card-header h1 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
}

.card-body {
  padding: 28px;
  background-color: #fdfbf7; /* 🍦 สีครีมละมุน */
}

.subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin-top: 0;
  margin-bottom: 24px;
  line-height: 1.5;
}

/* กล่องสรุปท่าฝึกที่เลือก */
.summary-box {
  background: #ffffff;
  border: 1px solid #bae6fd;
  border-radius: 14px;
  padding: 18px 20px;
  margin-bottom: 24px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.summary-header h3 {
  margin: 0;
  font-size: 1.05rem;
  color: #0369a1;
  font-weight: 700;
}

.badge-time {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0284c7;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.9rem;
}

.empty-cart-note {
  color: #d97706;
  font-size: 0.9rem;
  font-weight: 600;
}

.empty-cart-note a {
  color: #0284c7;
  text-decoration: underline;
}

.selected-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.selected-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #334155;
}

/* ฟอร์ม */
.plan-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
}

.custom-input, .custom-select, .custom-textarea {
  padding: 12px 14px;
  border: 1.5px solid #cbd5e1;
  border-radius: 10px;
  background: #ffffff;
  font-size: 0.95rem;
  color: #0f172a;
  outline: none;
  font-family: inherit;
}

.custom-input:focus, .custom-select:focus, .custom-textarea:focus {
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
}

.status-alert {
  margin: 0;
  padding: 12px 16px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.9rem;
  text-align: center;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.btn-save-submit {
  width: 100%;
  padding: 14px;
  background: #0284c7;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
  transition: all 0.2s ease;
}

.btn-save-submit:hover:not(:disabled) {
  background: #0369a1;
  transform: translateY(-1px);
}

.btn-save-submit:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-back {
  text-align: center;
  color: #64748b;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 6px 0;
}

.btn-back:hover {
  color: #0284c7;
}

/* ประวัติการบันทึกย้อนหลัง */
.history-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 2px dashed #bae6fd;
}

.history-section h3 {
  margin: 0 0 16px 0;
  font-size: 1.05rem;
  color: #0369a1;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
}

.history-top {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 0.9rem;
  color: #0f172a;
  margin-bottom: 6px;
}

.history-feeling, .history-note {
  margin: 4px 0 0 0;
  font-size: 0.85rem;
  color: #475569;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>