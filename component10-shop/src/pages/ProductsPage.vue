<template>
  <div class="page-container">
    <!-- กรอบหลักแสดงรายการท่าฝึก -->
    <div class="main-card">
      <!-- แถบส่วนหัวสีฟ้า (เพิ่มปุ่มไปตารางสะสมที่มุมบนขวา) -->
      <div class="card-header">
        <h2>🏋️ รายการท่าออกกำลังกาย ({{ products.length }} รายการ)</h2>
        <RouterLink to="/cart" class="btn-saved-table">
          หน้าถัดไป →
        </RouterLink>
      </div>

      <div class="card-body">
        <p v-if="loading" role="status" class="status-msg">⏳ กำลังโหลดท่าฝึก...</p>
        
        <div v-else-if="errorMsg" role="alert" class="error-box">
          <p>{{ errorMsg }}</p>
          <button @click="loadProducts" class="btn-retry">ลองใหม่</button>
        </div>

        <!-- รายการการ์ดแสดงผล Grid -->
        <div v-else class="product-grid">
          <ProductCard
            v-for="item in products"
            :key="item.id"
            :id="item.id"
            :title="item.title"
            :time="item.time"
            :image="item.image"
            :desc="item.desc"
            :category="item.category || 'ยืดหยุ่น'"
            @add="addToCart"
            @favorite="addFav"
          />
        </div>
      </div>

      <!-- แถบคำแนะนำด้านล่างสุด -->
      <div class="card-footer-note">
        <span class="note-text">💡 <strong>คำแนะนำ:</strong> ผู้สูงอายุควรเริ่มจากวันละ 1-2 ท่า ท่าละ 10-15 นาทีตามสภาพร่างกาย</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';

import {
  products,
  addToCart,
  addFav,
  loading,
  errorMsg,
  loadProducts
} from '../store.js';
</script>

<style scoped>
.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 40px;
  font-family: system-ui, -apple-system, sans-serif;
}

/* การ์ดกล่องใหญ่ */
.main-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08);
}

/* ส่วนหัวสีฟ้า (จัดวางแบบ Flex ให้หัวข้ออยู่ซ้าย และปุ่มไปตารางสะสมอยู่ขวา) */
.card-header {
  background: #1d4ed8;
  padding: 24px 28px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

/* ปรับขนาดตัวหนังสือคำว่า "รายการท่าออกกำลังกาย (X รายการ)" ให้ใหญ่และเด่นชัดขึ้น */
.card-header h2 {
  margin: 0;
  font-size: 1.6rem; 
  font-weight: 800;   
  letter-spacing: -0.01em;
  color: #ffffff;    
}

/* สไตล์ปุ่มไปตารางสะสม (มุมบนขวา) */
.btn-saved-table {
  background: #ffffff;
  color: #1d4ed8;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-saved-table:hover {
  background: #f8fafc;
  color: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.15);
}

.card-body {
  padding: 24px;
}

/* จัดการ์ดในรูปแบบ Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.status-msg {
  text-align: center;
  color: #475569;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 40px 0;
}

.error-box {
  padding: 16px;
  background: #fef2f2;
  border-radius: 8px;
  color: #991b1b;
  text-align: center;
}

.btn-retry {
  margin-top: 8px;
  padding: 6px 14px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}

/* แถบคำแนะนำด้านล่างสุด */
.card-footer-note {
  background: #f1f5f9;
  border-top: 1.5px solid #cbd5e1;
  padding: 20px 28px;
}

.note-text {
  font-size: 1.05rem;
  color: #1e293b;
  font-weight: 500;
  line-height: 1.5;
  display: block;
}
</style>