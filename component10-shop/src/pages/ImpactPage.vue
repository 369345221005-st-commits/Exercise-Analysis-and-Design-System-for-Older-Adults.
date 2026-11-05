<template>
  <div class="impact-container">
    <!-- 1. หัวข้อหลัก -->
    <h1 class="title">สรุปผลกระทบและการเก็บหลักฐาน (Impact)</h1>

    <!-- 2. การ์ดนับสถิติ 2 ช่อง -->
    <div class="stats-grid">
      <!-- กล่องฟ้า: จำนวนผู้ให้ฟีดแบ็กทั้งหมด -->
      <div class="stats-card blue-card">
        <h3 class="card-title blue-text">จำนวนผู้ให้ฟีดแบ็กทั้งหมด</h3>
        <p class="count-number blue-number">{{ totalCount }} คน</p>
      </div>

      <!-- กล่องเขียว: จำนวนคนที่ยินยอมให้เผยแพร่ -->
      <div class="stats-card green-card">
        <h3 class="card-title green-text">จำนวนคนที่ยินยอมให้เผยแพร่</h3>
        <p class="count-number green-number">{{ consentedCount }} คน</p>
      </div>
    </div>

    <!-- 3. หัวข้อย่อยความคิดเห็น -->
    <h2 class="sub-title">ความคิดเห็นจากผู้ใช้งาน (User Quotes & Proofs)</h2>

    <!-- 4. รายการการ์ดแสดงรูปภาพและข้อความ (เรียงลำดับ U1, U2, U3...) -->
    <div v-if="displayList.length > 0" class="quotes-grid">
      <div 
        v-for="item in displayList" 
        :key="item.id" 
        class="quote-card"
      >
        <!-- ส่วนรูปภาพหลักฐาน -->
        <div class="image-wrapper">
          <img 
            :src="`/${item.user_code}.jpg`" 
            :alt="`รูปภาพหลักฐาน (${item.user_code})`"
            class="proof-image"
            @error="(e) => handleImageError(e, item.user_code)"
          />
        </div>

        <!-- ส่วนข้อมูลล่างของการ์ด -->
        <div class="quote-content">
          <!-- ส่วนรหัส และป้ายสีเขียวยินยอมให้ใช้คำพูดในการทำรายงาน -->
          <div class="user-header">
            <div class="user-id-group">
              <span class="user-label">รหัส:</span>
              <span class="user-code-text">{{ item.user_code }}</span>
            </div>
            
            <div class="consent-badge">
              ยินยอมให้ใช้คำพูดในการทำ<br />รายงาน
            </div>
          </div>

          <!-- ส่วนข้อความ Quote พร้อมเส้นแถบสีฟ้าด้านข้าง -->
          <div v-if="item.quote" class="quote-body">
            <div class="quote-line"></div>
            <p class="quote-text">
              "{{ cleanQuote(item.quote) }}"
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      ยังไม่มีข้อมูลที่บันทึกไว้ในระบบ
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase.js' // ปรับ path ตามโครงสร้างโปรเจกต์ของคุณ

const totalCount = ref(0)
const consentedCount = ref(0)
const displayList = ref([])

// ตัดเครื่องหมายอัญประกาศซ้ำซ้อน
const cleanQuote = (text) => {
  if (!text) return ''
  return text.replace(/^"|"$/g, '').trim()
}

const fetchImpactData = async () => {
  try {
    const { data, error } = await supabase
      .from('impact_log')
      .select('*')

    if (error) throw error

    const logs = data || []
    totalCount.value = logs.length
    consentedCount.value = logs.length

    // *** ฟังก์ชันเรียงลำดับ user_code (เช่น U1, U2, U3 หรือ B1, B2, B3) จากน้อยไปมาก ***
    const sortedLogs = [...logs].sort((a, b) => {
      return (a.user_code || '').localeCompare(b.user_code || '', undefined, {
        numeric: true,
        sensitivity: 'base'
      })
    })

    displayList.value = sortedLogs

  } catch (err) {
    console.error('Error fetching impact data:', err.message)
  }
}

// กรณีไม่พบรูปภาพใน public/ ให้ซ่อน img แล้วแสดงข้อความรูปภาพหลักฐานสำรอง
const handleImageError = (e, userCode) => {
  e.target.style.display = 'none'
  const parent = e.target.parentElement
  if (parent && !parent.querySelector('.fallback-text')) {
    const fallbackSpan = document.createElement('span')
    fallbackSpan.className = 'fallback-text'
    fallbackSpan.innerText = `รูปภาพหลักฐาน (${userCode})`
    parent.appendChild(fallbackSpan)
  }
}

onMounted(() => {
  fetchImpactData()
})
</script>

<style scoped>
.impact-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1f2937;
}

/* หัวข้อหลัก */
.title {
  text-align: center;
  font-size: 2.2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 2rem;
}

/* การ์ดสถิติ */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
}

.stats-card {
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
}

.blue-card {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
}
.blue-text { color: #1e40af; }
.blue-number { color: #1e3a8a; }

.green-card {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
}
.green-text { color: #166534; }
.green-number { color: #14532d; }

.card-title {
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.count-number {
  font-size: 2.75rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.2;
}

/* หัวข้อย่อย */
.sub-title {
  text-align: center;
  font-size: 1.35rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

/* Grid การ์ดรายการ */
.quotes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1.5rem;
}

.quote-card {
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  overflow: hidden;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
}

/* กรอบรูปภาพ */
.image-wrapper {
  width: 100%;
  height: 200px;
  background-color: #f3f4f6;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.proof-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  display: block;
}

:deep(.fallback-text) {
  color: #6b7280;
  font-size: 0.95rem;
}

/* ส่วนเนื้อหาการ์ดล่าง */
.quote-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* รหัส และ แท็กยินยอม */
.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-id-group {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: #111827;
}

.user-code-text {
  font-size: 1.1rem;
  font-weight: 800;
  color: #111827;
}

/* ป้ายสีเขียวยินยอมให้ใช้คำพูดในการทำรายงาน */
.consent-badge {
  background-color: #d1fae5;
  color: #065f46;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.4rem 0.75rem;
  border-radius: 12px;
  text-align: center;
  line-height: 1.3;
}

/* ข้อความโควทพร้อมเส้นสีฟ้าด้านข้าง */
.quote-body {
  display: flex;
  align-items: stretch;
  gap: 0.75rem;
  margin-top: 0.25rem;
}

.quote-line {
  width: 3px;
  background-color: #2563eb;
  border-radius: 2px;
  flex-shrink: 0;
}

.quote-text {
  font-size: 0.925rem;
  color: #374151;
  line-height: 1.5;
  margin: 0;
  font-style: normal;
}

.no-data {
  text-align: center;
  color: #6b7280;
  padding: 3rem;
}
</style>