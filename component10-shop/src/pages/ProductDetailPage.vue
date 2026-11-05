<template>
  <div class="product-detail">
    <!-- สถานะกำลังโหลด -->
    <p v-if="loading" role="status" class="loading-state">⏳ กำลังโหลดรายละเอียดท่าออกกำลังกาย...</p>

    <!-- หน้าจอแสดงรายละเอียดท่าฝึก -->
    <section v-else-if="product" class="detail-card">
      <!-- แถบด้านบน: ปุ่มกลับ และปุ่มถูกใจ -->
      <div class="card-top-bar">
        <RouterLink to="/products" class="btn-back-top">
          ← กลับไปหน้ารายการ
        </RouterLink>
        <button type="button" class="btn-fav-top" @click="handleFavorite" title="ถูกใจ">
          ❤️ ถูกใจ
        </button>
      </div>

      <h1>{{ product.title }}</h1>

      <div class="image-box" v-if="product.image">
        <img :src="product.image" :alt="product.title" />
      </div>

      <!-- แถบข้อมูลสรุป (เวลา & ระดับความยาก) -->
      <div class="info-badges">
        <div class="time-info">
          <span>⏱️ ระยะเวลา:</span>
          <strong>{{ product.time }} นาที</strong>
        </div>
        <div class="level-info">
          <span>⚡ ระดับ:</span>
          <strong>เหมาะสำหรับผู้สูงอายุ / เริ่มต้น</strong>
        </div>
      </div>

      <!-- รายละเอียดหลัก -->
      <p v-if="product.desc" class="desc-info">
        📝 <strong>คำอธิบายท่าฝึก:</strong> {{ product.desc }}
      </p>

      <!-- เพิ่มเติม: ส่วนขั้นตอนการปฏิบัติเบื้องต้น -->
      <div class="guide-box">
        <h3>💡 ข้อแนะนำในการปฏิบัติ</h3>
        <ul>
          <li>หายใจเข้าและออกสม่ำเสมอ ขณะปฏิบัติท่าออกกำลังกาย</li>
          <li>หากรู้สึกเจ็บหรือแน่นหน้าอก ให้หยุดพักทันที</li>
          <li>ควรทำอย่างช้าๆ ไม่ต้องรีบเร่งเพื่อความปลอดภัยของข้อต่อ</li>
        </ul>
      </div>

      <!-- ปุ่มเพิ่มลงตะกร้า -->
      <button type="button" class="btn-buy" @click="buyNow">
        ➕ เพิ่มท่าออกกำลังกายลงในแผนฝึก
      </button>
    </section>

    <!-- กรณีไม่พบข้อมูล -->
    <section v-else class="not-found">
      <div class="not-found-icon">⚠️</div>
      <h2>ไม่พบข้อมูลท่าออกกำลังกาย</h2>
      <p>กรุณาตรวจสอบรหัสท่าออกกำลังกายอีกครั้ง หรืออาจไม่มีอยู่ในระบบ</p>

      <RouterLink to="/products" class="btn-back">
        กลับไปหน้ารายการท่าออกกำลังกาย
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { products, addToCart, loading, addFav } from '../store.js';

const route = useRoute();
const router = useRouter();

const product = computed(() => {
  return products.value.find(
    item => item.id === Number(route.params.id)
  );
});

function buyNow() {
  if (!product.value) return;

  addToCart({
    id: product.value.id,
    title: product.value.title,
    time: product.value.time,
    image: product.value.image
  });

  router.push('/cart');
}

function handleFavorite() {
  if (product.value && typeof addFav === 'function') {
    addFav(product.value.title);
  }
}
</script>

<style scoped>
.product-detail {
  max-width: 680px;
  margin: 40px auto;
  padding: 0 16px;
  font-family: system-ui, -apple-system, sans-serif;
}

.detail-card, .not-found {
  padding: 40px 36px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  text-align: center;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05), 0 8px 10px -6px rgba(15, 23, 42, 0.03);
  transition: all 0.3s ease;
}

/* แถบด้านบนการ์ด */
.card-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* ปุ่มกลับหน้ารายการด้านบน */
.btn-back-top {
  display: inline-flex;
  align-items: center;
  font-size: 1.05rem; 
  background: #eff6ff; 
  color: #1d4ed8; 
  padding: 10px 18px; 
  border-radius: 12px; 
  border: 1.5px solid #93c5fd; 
  font-weight: 700; 
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.1);
}

.btn-back-top:hover {
  background: #dbeafe;
  color: #1e40af;
  border-color: #3b82f6;
  transform: translateY(-1px);
}

.btn-fav-top {
  background: #fff1f2;
  border: 1px solid #fecdd3;
  color: #e11d48;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-fav-top:hover {
  background: #ffe4e6;
}

.detail-card h1 {
  color: #0f172a;
  font-size: 2rem; /* ขยายชื่อท่าให้ใหญ่ขึ้น */
  font-weight: 800;
  margin-top: 0;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
}

.image-box {
  margin: 20px 0 24px;
  overflow: hidden;
  border-radius: 16px;
  background: #f8fafc;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.image-box img {
  width: 100%;
  max-height: 360px;
  border-radius: 16px;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}

.image-box img:hover {
  transform: scale(1.02);
}

/* แถบข้อมูลสรุปคู่ (ขยายตัวหนังสือด้านในให้ใหญ่ขึ้นชัดเจน) */
.info-badges {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 20px 0;
}

.time-info, .level-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 1.05rem; /* ขยายตัวหนังสือป้ายบอกหัวข้อ */
  color: #334155;
  background: #f8fafc;
  padding: 16px;
  border-radius: 14px;
  border: 1.5px solid #cbd5e1;
}

.time-info strong, .level-info strong {
  color: #0f172a;
  font-weight: 800;
  font-size: 1.2rem; /* ขยายตัวเลขเวลาและข้อความระดับให้ใหญ่เด่นชัด */
}

.desc-info {
  color: #334155;
  line-height: 1.7;
  margin: 20px 0;
  background: #f8fafc;
  padding: 18px 22px;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  text-align: left;
  font-size: 1.1rem; /* ขยายคำอธิบายท่าฝึก */
}

/* เพิ่มเติม: ส่วนคำแนะนำย่อย (ขยายหัวข้อและเนื้อหาข้อความ) */
.guide-box {
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  border-radius: 14px;
  padding: 18px 22px;
  text-align: left;
  margin-bottom: 24px;
}

.guide-box h3 {
  font-size: 1.15rem; /* ขยายหัวข้อข้อแนะนำ */
  color: #166534;
  margin: 0 0 10px 0;
  font-weight: 700;
}

.guide-box ul {
  margin: 0;
  padding-left: 22px;
  font-size: 1.05rem; /* ขยายตัวหนังสือรายการข้อแนะนำ */
  color: #15803d;
  line-height: 1.6;
  font-weight: 500;
}

.btn-buy {
  width: 100%;
  padding: 16px 24px;
  border: none;
  border-radius: 14px;
  background: #2563eb;
  color: white;
  font-size: 1.15rem; /* ขยายปุ่มเพิ่มลงแผนฝึกให้ใหญ่ขึ้น */
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
  transition: all 0.2s ease;
}

.btn-buy:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.4);
}

.btn-buy:active {
  transform: translateY(0);
}

.loading-state {
  text-align: center;
  color: #64748b;
  padding: 60px 20px;
  font-size: 1.2rem;
  font-weight: 600;
}

.not-found-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.not-found h2 {
  color: #0f172a;
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.not-found p {
  color: #64748b;
  font-size: 1.05rem;
  margin-bottom: 24px;
}

.btn-back {
  display: inline-block;
  padding: 14px 26px;
  background: #2563eb;
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.05rem;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}
</style>