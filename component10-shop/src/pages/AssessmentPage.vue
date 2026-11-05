<template>
  <div class="assessment-page">
    <div class="assessment-card">
      <div class="card-header">
        <h1>📋 แบบประเมินสุขภาพผู้สูงอายุเพื่อจัดตารางฝึก</h1>
      </div>

      <div class="card-body">
        <p class="subtitle">กรอกข้อมูลทั่วไปและตอบคำถามสั้นๆ เพื่อให้ระบบคำนวณและแนะนำท่าออกกำลังกายที่ปลอดภัย</p>

        <!-- 🏷️ ข้อมูลทั่วไป -->
        <div class="section-title">👤 ข้อมูลทั่วไปของผู้ฝึก</div>
        
        <div class="form-row-grid">
          <div class="form-field">
            <label for="age">ช่วงอายุของท่าน</label>
            <select id="age" v-model="ageGroup" class="custom-select">
              <option value="60-69">60 - 69 ปี (วัยต้น)</option>
              <option value="70-79">70 - 79 ปี (วัยกลาง)</option>
              <option value="80+">80 ปีขึ้นไป (วัยอาวุโส)</option>
            </select>
          </div>

          <div class="form-field">
            <label for="energy">ระดับความรู้สึกเหนื่อยง่ายโดยปกติ</label>
            <select id="energy" v-model="energyLevel" class="custom-select">
              <option value="normal">ปกติ มีแรงดี</option>
              <option value="tired">เหนื่อยง่ายกว่าปกติเล็กน้อย</option>
              <option value="exhausted">เหนื่อยหอบง่าย อ่อนเพลียบ่อย</option>
            </select>
          </div>
        </div>

        <div class="section-title" style="margin-top: 24px;">🩺 คำถามประเมินความพร้อมทางสุขภาพ</div>

        <!-- ข้อที่ 1 -->
        <div class="question-item">
          <h2>1. ท่านมีอาการปวดข้อเข่า ข้อเสื่อม หรือข้อต่อหรือไม่?</h2>
          <div class="radio-group" role="radiogroup" aria-label="คำถามข้อที่ 1">
            <label class="radio-label">
              <input type="radio" name="q1" v-model="q1" value="yes" />
              <span>มีอาการ</span>
            </label>
            <label class="radio-label">
              <input type="radio" name="q1" v-model="q1" value="no" />
              <span>ไม่มีอาการ</span>
            </label>
          </div>
        </div>

        <!-- ข้อที่ 2 -->
        <div class="question-item">
          <h2>2. ท่านเคยมีอาการมึนศีรษะ เซ หรือหกล้มในรอบ 6 เดือนหรือไม่?</h2>
          <div class="radio-group" role="radiogroup" aria-label="คำถามข้อที่ 2">
            <label class="radio-label">
              <input type="radio" name="q2" v-model="q2" value="yes" />
              <span>มีปัญหา</span>
            </label>
            <label class="radio-label">
              <input type="radio" name="q2" v-model="q2" value="no" />
              <span>ปกติ</span>
            </label>
          </div>
        </div>

        <!-- ข้อที่ 3 -->
        <div class="question-item">
          <h2>3. ท่านมีโรคความดันโลหิตสูง หรือโรคหัวใจหรือไม่?</h2>
          <div class="radio-group" role="radiogroup" aria-label="คำถามข้อที่ 3">
            <label class="radio-label">
              <input type="radio" name="q3" v-model="q3" value="yes" />
              <span>มีโรคประจำตัว</span>
            </label>
            <label class="radio-label">
              <input type="radio" name="q3" v-model="q3" value="no" />
              <span>ไม่มี</span>
            </label>
          </div>
        </div>

        <!-- ผลลัพธ์คำแนะนำจากการประเมิน -->
        <div class="recommendation-box">
          <h3>💡 คำแนะนำจากระบบวิเคราะห์:</h3>
          
          <div class="result-card" :class="hasWarnings ? 'is-warning' : 'is-safe'">
            <p><strong>โปรไฟล์ผู้ฝึก:</strong> ช่วงอายุ {{ ageGroup }} ปี | สภาพความเหนื่อย: {{ energyText }}</p>
            <p style="margin-top: 8px;">{{ recommendation.text }}</p>
          </div>

          <!-- ข้อความแจ้งเตือนเมื่อกดบันทึก -->
          <p v-if="submitMsg" class="submit-msg" role="status" aria-live="polite">
            {{ submitMsg }}
          </p>

          <div class="action-footer">
            <button 
              type="button" 
              class="btn-send-assessment" 
              @click="handleSend" 
              :disabled="submitted"
            >
              {{ submitted ? '✅ ส่งแบบประเมินเรียบร้อยแล้ว' : '📩 ส่งแบบประเมินสุขภาพ' }}
            </button>
            <router-link to="/products" class="btn-navigate">
              ไปเลือกท่าฝึกตามคำแนะนำ →
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { submitAssessment } from '../store.js';

const ageGroup = ref('60-69');
const energyLevel = ref('normal');
const q1 = ref('no');
const q2 = ref('no');
const q3 = ref('no');
const submitted = ref(false);
const submitMsg = ref('');

const energyText = computed(() => {
  if (energyLevel.value === 'normal') return 'ปกติ มีแรงดี';
  if (energyLevel.value === 'tired') return 'เหนื่อยง่ายเล็กน้อย';
  return 'เหนื่อยหอบง่าย';
});

const hasWarnings = computed(() => {
  return (
    ageGroup.value === '80+' ||
    energyLevel.value === 'exhausted' ||
    q1.value === 'yes' ||
    q2.value === 'yes' ||
    q3.value === 'yes'
  );
});

// ระบบวิเคราะห์คำแนะนำอัตโนมัติตามข้อมูลทั่วไปและคำตอบ
const recommendation = computed(() => {
  const warningMsg = [];

  if (ageGroup.value === '80+') warningMsg.push('เน้นการเคลื่อนไหวช้าๆ และมีผู้ดูแลใกล้ชิด');
  if (energyLevel.value === 'exhausted') warningMsg.push('จำกัดเวลาฝึกให้สั้นลงและพักบ่อยๆ');
  if (q1.value === 'yes') warningMsg.push('เน้นท่าฝึกที่ไม่กระทบข้อเข่าหรือข้อต่อ');
  if (q2.value === 'yes') warningMsg.push('เน้นท่าฝึกที่มีเก้าอี้พยุงเพื่อป้องกันการล้ม');
  if (q3.value === 'yes') warningMsg.push('ควบคุมอัตราการหายใจและความแรงในการฝึก');

  if (warningMsg.length > 0) {
    return {
      text: `⚠️ ข้อควรระวัง: ${warningMsg.join(' • ')} ควรออกกำลังกายด้วยความระมัดระวัง ไม่หักโหม`
    };
  }

  return {
    text: '✅ ร่างกายพร้อมฝึก: สามารถเลือกฝึกได้ตามเป้าหมายเวลา 20-30 นาทีประจำวันอย่างปลอดภัย'
  };
});

async function handleSend() {
  await submitAssessment({
    ageGroup: ageGroup.value,
    energyLevel: energyLevel.value,
    energyText: energyText.value,
    q1: q1.value,
    q2: q2.value,
    q3: q3.value,
    recommendationText: recommendation.value.text,
    hasWarning: hasWarnings.value
  });

  submitted.value = true;
  submitMsg.value = '✅ บันทึกแบบประเมินลงในระบบเรียบร้อยแล้ว!';
}
</script>

<style scoped>
.assessment-page {
  max-width: 680px;
  margin: 30px auto;
  padding: 0 16px;
  font-family: system-ui, -apple-system, sans-serif;
}

.assessment-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.15);
  border: 1px solid #bae6fd;
}

.card-header {
  background: #38bdf8;
  padding: 20px 28px;
  color: #0f172a;
}

.card-header h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-body {
  padding: 28px;
  background-color: #fdfbf7;
}

.subtitle {
  color: #64748b;
  font-size: 0.925rem;
  margin-top: 0;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0369a1;
  margin-bottom: 12px;
}

.form-row-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  background: #ffffff;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
}

.custom-select {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  font-size: 0.9rem;
  color: #0f172a;
  outline: none;
}

.custom-select:focus {
  border-color: #0284c7;
  background: #ffffff;
}

.question-item {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px 24px;
  margin-bottom: 16px;
}

.question-item h2 {
  font-size: 1.05rem;
  color: #0f172a;
  margin: 0 0 14px 0;
  font-weight: 700;
  line-height: 1.5;
}

.radio-group {
  display: flex;
  gap: 24px;
  align-items: center;
}

.radio-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  color: #334155;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
}

.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  accent-color: #0284c7;
  cursor: pointer;
}

.recommendation-box {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 14px;
  padding: 20px;
  margin-top: 24px;
}

.recommendation-box h3 {
  margin: 0 0 12px 0;
  font-size: 1.05rem;
  color: #0369a1;
  font-weight: 700;
}

.result-card {
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 16px;
  border: 1px solid;
  transition: all 0.25s ease;
}

.result-card.is-warning {
  background-color: #fffbeb;
  border-color: #fde68a;
  color: #92400e;
}

.result-card.is-safe {
  background-color: #f0fdf4;
  border-color: #bbf7d0;
  color: #166534;
}

.result-card p {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.6;
}

.submit-msg {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-weight: 700;
  margin-bottom: 14px;
  font-size: 0.9rem;
}

.action-footer {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.btn-send-assessment {
  width: 100%;
  padding: 12px 20px;
  background: #0284c7;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
  transition: all 0.2s ease;
}

.btn-send-assessment:hover:not(:disabled) {
  background: #0369a1;
  transform: translateY(-1px);
}

.btn-send-assessment:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-navigate {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #0284c7;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.btn-navigate:hover {
  background: #e0f2fe;
  color: #0369a1;
}

@media (max-width: 480px) {
  .card-body {
    padding: 20px 16px;
  }
  .form-row-grid {
    grid-template-columns: 1fr;
  }
  .radio-group {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>