<template>
  <section class="admin-panel">
    <h1>🏋️ หลังบ้านเฉพาะผู้ดูแลระบบ (Admin)</h1>
    
    <!-- การ์ดสรุปสถิติทั่วไป -->
    <div class="info-card">
      <div class="stat-box">
        <span class="stat-label">จำนวนท่าฝึกในระบบ</span>
        <span class="stat-value">{{ products.length }} รายการ</span>
      </div>
      <div class="stat-box highlight">
        <span class="stat-label">เวลารวมในแผนปฏิบัติ</span>
        <span class="stat-value text-green">{{ netTotal }} นาที</span>
      </div>
    </div>

    <!-- ฟอร์มเพิ่มท่าฝึกใหม่ -->
    <div class="form-section-card">
      <h2>➕ เพิ่มท่าออกกำลังกายใหม่</h2>

      <form @submit.prevent="submitProduct" class="admin-form">
        <div class="form-row">
          <p class="form-field flex-2">
            <label for="new-title">ชื่อท่าออกกำลังกาย *</label>
            <input id="new-title" v-model.trim="newTitle" required placeholder="ระบุชื่อท่าฝึก...">
          </p>
          
          <p class="form-field flex-1">
            <label for="new-time">เวลาฝึก (นาที) *</label>
            <input id="new-time" v-model.number="newTime" type="number" min="0" required placeholder="10">
          </p>
        </div>
        
        <p class="form-field">
          <label for="new-image">ลิงก์รูปภาพตัวอย่าง (URL)</label>
          <input id="new-image" v-model.trim="newImage" type="url" placeholder="https://...">
        </p>

        <button type="submit" class="btn-submit" :disabled="saving">
          {{ saving ? 'กำลังบันทึก...' : '💾 บันทึกท่าฝึกใหม่' }}
        </button>
      </form>
    </div>

    <p v-if="formMsg" class="form-msg" :class="{ 'is-error': isErrorMsg }" role="status" aria-live="polite">
      {{ formMsg }}
    </p>

    <!-- ตารางจัดการแก้ไขเวลารายการท่าฝึก -->
    <div class="table-section-card">
      <h2>⚙️ แก้ไขเวลารายการท่าฝึก</h2>
      <div class="table-container">
        <table class="admin-table">
          <caption>ท่าออกกำลังกายทั้งหมด {{ products.length }} รายการ</caption>
          <thead>
            <tr>
              <th scope="col" class="th-title">ชื่อท่าฝึก</th>
              <th scope="col" class="th-time">เวลาที่กำหนด</th>
              <th scope="col" class="th-actions">เครื่องมือจัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td class="td-title">{{ p.title }}</td>
              <td class="td-time"><span class="time-badge">{{ p.time }} นาที</span></td>
              <td class="td-actions">
                <div class="btn-group">
                  <button class="btn-action btn-add" @click="changeTime(p, 10)" :aria-label="'เพิ่มเวลา ' + p.title + ' 10 นาที'">+10</button>
                  <button class="btn-action btn-sub" @click="changeTime(p, -10)" :disabled="p.time <= 0" :aria-label="'ลดเวลา ' + p.title + ' 10 นาที'">-10</button>
                  <button class="btn-action btn-edit" @click="setTime(p)" :aria-label="'ตั้งเวลา ' + p.title">✏️ ตั้งเวลา</button>
                  <button class="btn-action btn-delete" @click="removeProduct(p)" :aria-label="'ลบ ' + p.title">🗑️ ลบ</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { 
  products, netTotal, addProduct, updateTime, deleteProduct 
} from '../store.js';

const newTitle = ref('');
const newTime = ref(10);
const newImage = ref('');
const saving = ref(false); 
const formMsg = ref('');

const isErrorMsg = computed(() => formMsg.value.startsWith('❌'));

async function submitProduct() {
  saving.value = true;
  const titleAdded = newTitle.value;
  const problem = await addProduct({ title: titleAdded, time: newTime.value, image: newImage.value });
  saving.value = false;

  if (problem) {
    formMsg.value = '❌ บันทึกไม่สำเร็จ: ' + problem;
    return;
  }

  formMsg.value = `✅ เพิ่ม "${titleAdded}" แล้ว`;
  newTitle.value = ''; 
  newTime.value = 10;
  newImage.value = '';
}

async function changeTime(p, step) {
  const updatedTime = Math.max(0, p.time + step);
  if (updatedTime === p.time) return;

  const problem = await updateTime(p.id, updatedTime);
  formMsg.value = problem ? '❌ แก้ไม่สำเร็จ: ' + problem : `✅ ${p.title} เวลาใหม่ ${updatedTime} นาที`;
}

async function setTime(p) {
  const text = prompt(`เวลาใหม่ของ ${p.title} (นาที)`, p.time);
  if (text === null) return;                  
  const updatedTime = Number(text);
  if (!Number.isInteger(updatedTime) || updatedTime < 0) {
    formMsg.value = '❌ เวลาต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป';
    return;
  }
  const problem = await updateTime(p.id, updatedTime);
  formMsg.value = problem ? '❌ แก้ไม่สำเร็จ: ' + problem : `✅ ${p.title} เวลาใหม่ ${updatedTime} นาที`;
}

async function removeProduct(p) {
  if (!confirm(`ลบ "${p.title}" ออกจากระบบจริงไหม?`)) return;
  const problem = await deleteProduct(p.id);
  formMsg.value = problem ? '❌ ลบไม่สำเร็จ: ' + problem : `🗑️ ลบ ${p.title} แล้ว`;
}
</script>

<style scoped>
.admin-panel {
  padding: 24px;
  background: #fdfbf7;
  border-radius: 16px;
  max-width: 900px;
  margin: 24px auto;
  font-family: system-ui, -apple-system, sans-serif;
}

h1 {
  color: #0f172a;
  margin: 0 0 20px 0;
  font-size: 1.4rem;
  font-weight: 700;
}

.info-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-box {
  background: #ffffff;
  border-radius: 12px;
  padding: 18px 20px;
  border: 1px solid #bae6fd;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.05);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-box.highlight {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.stat-value {
  font-size: 1.35rem;
  color: #0f172a;
  font-weight: 800;
}

.text-green {
  color: #059669;
}

.form-section-card, .table-section-card {
  background: #ffffff;
  border: 1px solid #bae6fd;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.05);
}

h2 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0369a1;
  margin: 0 0 16px 0;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.flex-2 { flex: 2; }
.flex-1 { flex: 1; }

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
}

.form-field label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
}

.form-field input {
  padding: 12px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  font-size: 0.95rem;
  color: #0f172a;
  background-color: #ffffff;
  outline: none;
}

.form-field input:focus {
  border-color: #0284c7;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.2);
}

.btn-submit {
  padding: 12px 20px;
  background: #0284c7;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
  transition: background 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background: #0369a1;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-msg {
  margin-bottom: 20px;
  padding: 12px 16px;
  border-radius: 10px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
  font-size: 0.9rem;
  font-weight: 700;
  transition: all 0.2s ease;
}

.form-msg.is-error {
  background: #fef2f2;
  border-color: #fee2e2;
  color: #dc2626;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
  white-space: nowrap;
}

.admin-table caption {
  caption-side: top;
  text-align: left;
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 8px;
}

.admin-table thead {
  background-color: #f0f9ff;
  border-bottom: 1px solid #bae6fd;
}

.admin-table th {
  padding: 12px 16px;
  font-weight: 700;
  color: #0369a1;
}

.admin-table td {
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
  vertical-align: middle;
}

.td-title {
  font-weight: 700;
}

.time-badge {
  display: inline-block;
  background-color: #f0f9ff;
  color: #0369a1;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
  border: 1px solid #bae6fd;
}

.btn-group {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
}

.btn-action {
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.825rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid #cbd5e1;
  transition: background 0.2s;
  white-space: nowrap;
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-add, .btn-sub {
  background-color: #f8fafc;
  color: #334155;
}

.btn-edit {
  background-color: #fefce8;
  color: #ca8a04;
  border-color: #fef08a;
}

.btn-delete {
  background-color: #fef2f2;
  color: #dc2626;
  border-color: #fee2e2;
}

@media (max-width: 640px) {
  .admin-panel {
    padding: 16px;
    margin: 12px auto;
  }

  .form-section-card, .table-section-card {
    padding: 16px;
  }

  .info-card {
    grid-template-columns: 1fr;
  }

  .form-row {
    flex-direction: column;
    gap: 16px;
  }

  .admin-table th, .admin-table td {
    padding: 10px 12px;
  }

  .btn-action {
    padding: 5px 8px;
    font-size: 0.78rem;
  }
}
</style>