<template>
  <div class="home-container">
    <section class="hero-banner">
      <div class="hero-content">
        <span class="hero-badge">💪 Healthy Life & Fitness for Seniors</span>
        <h1>ระบบวิเคราะห์และออกแบบ<br />การออกกำลังกายผู้สูงอายุ</h1>
        <p class="hero-description">
          สนับสนุนให้ทุกคนมีสุขภาพดี เริ่มต้นประเมินความพร้อมและออกแบบตารางออกกำลังกายที่เหมาะกับคุณได้ง่ายๆ วันนี้
        </p>

        <div class="hero-actions">
          <router-link to="/products" class="btn-primary" aria-label="ดูรายการท่าออกกำลังกายทั้งหมด">
            🏋️ ดูท่าออกกำลังกายทั้งหมด
          </router-link>
          
          <router-link to="/assessment" class="btn-assessment" aria-label="ทำแบบประเมินสุขภาพผู้สูงอายุ">
            📋 ทำแบบประเมินสุขภาพ
          </router-link>
        </div>
      </div>
    </section>

    <section class="stats-overview-grid" aria-label="สรุปสถิติทั่วไป">
      <div class="stat-card">
        <div class="stat-icon" aria-hidden="true">🏃</div>
        <div class="stat-number">{{ products.length }}</div>
        <div class="stat-label">ท่าฝึกในระบบ</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" aria-hidden="true">❤️</div>
        <div class="stat-number text-red">{{ favCount }}</div>
        <div class="stat-label">ถูกใจสะสม</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" aria-hidden="true">🎯</div>
        <div class="stat-number text-blue">{{ TARGET_TIME }} นาที</div>
        <div class="stat-label">เป้าหมายประจำวัน</div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" aria-hidden="true">🛒</div>
        <div class="stat-number text-green">{{ itemCount }} ท่า</div>
        <div class="stat-label">เลือกในแผน</div>
      </div>
    </section>

    <section class="steps-section">
      <div class="steps-card">
        <div class="steps-header">
          <h2>🏋️ ขั้นตอนการออกแบบการฝึกสำหรับผู้สูงอายุ</h2>
        </div>
        <ol class="steps-body">
          <li class="step-item">
            <span class="step-num">1.</span>
            <div class="step-text">
              <strong>ทำแบบประเมินสุขภาพเบื้องต้น:</strong> เช็คอายุ ระดับความเหนื่อย และข้อจำกัดทางกายภาพ
            </div>
          </li>

          <li class="step-item">
            <span class="step-num">2.</span>
            <div class="step-text">
              <strong>เลือกท่าฝึกที่ปลอดภัย:</strong> เน้นยืดเหยียดเบาๆ และบริหารความแข็งแรงโดยไม่หักโหม
            </div>
          </li>

          <li class="step-item">
            <span class="step-num">3.</span>
            <div class="step-text">
              <strong>สะสมเวลาวันละ 20-30 นาที:</strong> ทยอยฝึกครั้งละ 10-15 นาที สามารถพักระหว่างท่าได้
            </div>
          </li>

          <li class="step-item">
            <span class="step-num">4.</span>
            <div class="step-text">
              <strong>ติดตามและประเมินผล:</strong> ดูเวลารวมสุทธิและการตอบรับของร่างกายอย่างสม่ำเสมอ
            </div>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

<script setup>
import { products, favCount, TARGET_TIME, itemCount } from '../store.js';
</script>

<style scoped>
.home-container {
  max-width: 1000px;
  margin: 0 auto;
  padding-bottom: 40px;
  font-family: system-ui, -apple-system, sans-serif;
}

.hero-banner {
  position: relative;
  background: linear-gradient(135deg, #0284c7 0%, #38bdf8 50%, #bae6fd 100%);
  border-radius: 24px;
  padding: 50px 40px;
  color: #0f172a;
  overflow: hidden;
  box-shadow: 0 14px 30px -10px rgba(56, 189, 248, 0.3);
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.4);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 700px;
  margin: 0 auto; /* จัดให้อยู่กลางเมื่อสกรีนเล็ก */
}

.hero-badge {
  display: inline-block;
  background: #fefae0;
  border: 1px solid #fde047;
  color: #854d0e;
  font-size: 0.9rem;
  font-weight: 700;
  padding: 8px 16px;
  border-radius: 30px;
  margin-bottom: 20px;
  white-space: normal; /* ป้องกันป้ายดันขอบจอในมือถือที่หน้าจอแคบมาก */
  text-align: center;
}

.hero-banner h1 {
  font-size: 2.35rem;
  font-weight: 800;
  line-height: 1.25;
  margin: 0 0 16px 0;
  color: #0f172a;
}

.hero-description {
  font-size: 1.15rem;
  color: #1e293b;
  line-height: 1.6;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #0f172a;
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  padding: 14px 26px;
  border-radius: 14px;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.2);
  transition: all 0.25s ease;
}

.btn-primary:hover {
  background: #1e293b;
  transform: translateY(-2px);
}

.btn-assessment {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #fefae0;
  border: 1.5px solid #eab308;
  color: #713f12;
  font-size: 1.05rem;
  font-weight: 700;
  padding: 14px 26px;
  border-radius: 14px;
  text-decoration: none;
  transition: all 0.25s ease;
}

.btn-assessment:hover {
  background: #fef9c3;
  transform: translateY(-2px);
}

.stats-overview-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.03);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.stat-icon {
  font-size: 1.8rem;
  margin-bottom: 4px;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.text-red { color: #dc2626; }
.text-blue { color: #0284c7; }
.text-green { color: #059669; }

.steps-section {
  margin-top: 24px;
}

.steps-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.05);
}

.steps-header {
  background: #38bdf8;
  padding: 18px 24px;
  color: #0f172a;
}

.steps-header h2 {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
}

.steps-body {
  padding: 24px;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fdfbf7;
  border: 1px solid #e2e8f0;
  padding: 16px 20px;
  border-radius: 12px;
}

.step-num {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0284c7;
  min-width: 24px;
}

.step-text {
  font-size: 0.95rem;
  color: #334155;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .stats-overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 📱 ปรับแต่งสำหรับโทรศัพท์เคลื่อนที่โดยเฉพาะ */
@media (max-width: 640px) {
  .hero-banner {
    padding: 32px 20px;
    border-radius: 18px;
    text-align: center;
  }

  .hero-badge {
    font-size: 0.8rem;
    padding: 6px 14px;
    margin-bottom: 14px;
    line-height: 1.4;
  }

  .hero-banner h1 {
    font-size: 1.55rem;
    line-height: 1.35;
    margin-bottom: 14px;
  }

  /* ปรับแท็ก <br> ให้ไม่ตัดบรรทัดแปลกๆ ในมือถือ */
  .hero-banner h1 br {
    display: inline;
    content: ' ';
  }

  .hero-description {
    font-size: 0.95rem;
    line-height: 1.55;
    margin-bottom: 24px;
  }

  .hero-actions {
    flex-direction: column;
    gap: 10px;
  }

  .btn-primary, .btn-assessment {
    width: 100%;
    padding: 12px 16px;
    font-size: 0.95rem;
    box-sizing: border-box;
  }

  .stats-overview-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .stat-card {
    padding: 14px 10px;
  }
}
</style>