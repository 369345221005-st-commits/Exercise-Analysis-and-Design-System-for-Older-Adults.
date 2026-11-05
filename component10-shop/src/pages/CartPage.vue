<template>
  <div class="cart-container">
    <div class="cart-card">
      <div class="card-header">
        <div class="header-title">
          <span>🛒 แผนและตารางสะสมเวลาออกกำลังกาย</span>
        </div>
        <div class="header-badge">
          เลือกไว้ {{ itemCount }} ท่า
        </div>
      </div>

      <div class="card-body">
        <div class="cart-content">
          <p v-if="itemCount === 0" class="empty-state">
            <span>🧘</span> ยังไม่มีท่าออกกำลังกายในตาราง
          </p>
          <ul v-else class="cart-list">
            <li v-for="(item, index) in cart" :key="index" class="cart-item">
              <span class="item-title">#{{ index + 1 }} 🏋️ {{ item.title }}</span>
              <span class="item-time">⏱️ {{ item.time }} นาที</span>
            </li>
          </ul>
        </div>

        <div class="exercise-summary">
          <h3 class="summary-title">📊 สรุปเวลารวมและสถิติ</h3>

          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">❤️ ถูกใจรวม</span>
              <span class="stat-value text-red">{{ favCount }} ครั้ง</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">จำนวนท่าฝึก</span>
              <span class="stat-value">{{ itemCount }} ท่า</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">⏱️ เวลารวมดิบ</span>
              <span class="stat-value text-blue">{{ totalTime }} นาที</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">⏰ เฉลี่ยต่อท่า</span>
              <span class="stat-value">{{ averageTime }} นาที</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">🎯 เป้าหมายสูงสุด</span>
              <span class="stat-value">{{ TARGET_TIME }} นาที</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">⌛ เวลาขาดเป้าหมาย</span>
              <span class="stat-value text-amber">{{ remaining }} นาที</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">🎁 โบนัสเวลาพักยืดข้อ</span>
              <span class="stat-value text-green">{{ discount }} นาที</span>
            </div>
            <div class="stat-item primary">
              <span class="stat-label">✅ เวลาสุทธิปฏิบัติจริง</span>
              <span class="stat-value text-blue-bold">{{ netTotal }} นาที</span>
            </div>
          </div>

          <div class="progress-section">
            <div class="progress-header">
              <span>ความคืบหน้าเข้าสู่เป้าหมาย ({{ TARGET_TIME }} นาที)</span>
              <strong>{{ progress }}%</strong>
            </div>
            <progress :value="progress" max="100"></progress>
          </div>

          <div class="notice-box">
            💪 สะสมแล้ว {{ totalTime }} นาที ขาดอีกเพียง {{ Math.max(0, 30 - totalTime) }} นาทีจะบรรลุขั้นต่ำสำหรับสุขภาพที่ดี
          </div>

          <div class="button-group">
            <button class="btn-clear" @click="clearCart">
              🗑️ ล้างตารางแผนฝึก
            </button>

            <button class="btn-save" @click="router.push('/save-plan')">
  💾 บันทึกแผนตารางประจำวัน
</button>

            <button class="btn-continue" @click="router.push('/products')">
              ← เลือกท่าฝึกเพิ่ม
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  cart, itemCount, totalTime, averageTime, TARGET_TIME,
  discount, netTotal, progress, remaining, favCount, clearCart
} from '../store.js';

const router = useRouter()

function savePlan() {
  alert('✅ บันทึกแผนตารางออกกำลังกายประจำวันเรียบร้อยแล้ว!');
}
</script>

<style scoped>
.cart-container {
  max-width: 780px;
  margin: 24px auto;
  padding: 0 16px;
  font-family: system-ui, -apple-system, sans-serif;
}

.cart-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #bae6fd;
  box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.15);
}

.card-header {
  background: #38bdf8; /* 🌊 ฟ้าอ่อน */
  padding: 18px 24px;
  color: #0f172a;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-title {
  font-size: 1.15rem;
  font-weight: 700;
}

.header-badge {
  background: rgba(255, 255, 255, 0.6);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  color: #0369a1;
}

.card-body {
  padding: 24px;
  background-color: #fdfbf7; /* 🍦 ครีมละมุน */
}

.cart-content {
  margin-bottom: 24px;
}

.empty-state {
  text-align: center;
  color: #64748b;
  font-size: 1rem;
  padding: 32px 16px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
  margin: 0;
}

.cart-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.item-title {
  font-weight: 700;
  color: #0f172a;
}

.item-time {
  color: #0284c7;
  font-weight: 700;
  background: #f0f9ff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.875rem;
  border: 1px solid #bae6fd;
}

.summary-title {
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  color: #0369a1;
  font-weight: 700;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.stat-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 12px 14px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-item.primary {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
}

.stat-value {
  font-weight: 800;
  font-size: 1.15rem;
  color: #0f172a;
}

.text-red { color: #dc2626; }
.text-blue { color: #0284c7; }
.text-amber { color: #d97706; }
.text-green { color: #059669; }
.text-blue-bold { color: #059669; font-size: 1.2rem; }

.progress-section {
  margin: 20px 0;
  background: #ffffff;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #334155;
  font-weight: 600;
  margin-bottom: 10px;
}

progress {
  width: 100%;
  height: 14px;
  border-radius: 10px;
  overflow: hidden;
  border: none;
  background-color: #e2e8f0;
}

progress::-webkit-progress-bar {
  background-color: #e2e8f0;
  border-radius: 10px;
}

progress::-webkit-progress-value {
  background: linear-gradient(90deg, #38bdf8 0%, #0284c7 100%);
  border-radius: 10px;
}

.notice-box {
  margin: 20px 0;
  padding: 16px 20px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 700;
  text-align: center;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 24px;
}

.button-group button {
  flex: 1;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.925rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
}

.btn-clear {
  background: #fef2f2;
  border: 1px solid #fca5a5 !important;
  color: #dc2626;
}

.btn-save {
  background: #059669;
  color: #ffffff;
}

.btn-continue {
  background: #0f172a;
  color: #ffffff;
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .button-group {
    flex-direction: column;
  }
}
</style>