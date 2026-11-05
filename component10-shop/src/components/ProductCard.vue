<template>
  <article class="card">
    <div v-if="props.image" class="card-image-wrapper">
      <img :src="props.image" :alt="props.title" class="card-image" />
    </div>
    
    <div class="card-content">
      <h3 class="card-title">{{ props.title }}</h3>
      <p class="card-time">⏱️ เวลา <strong>{{ props.time }}</strong> นาที</p>
      <p class="desc">{{ props.desc }}</p>
    </div>

    <div class="card-actions">
      <router-link :to="'/product/' + props.id" class="btn-detail">ดูรายละเอียด</router-link>
      <div class="btn-group">
        <button class="btn-add" @click="emit('add', { id: props.id, title: props.title, time: props.time })">
          🛒 เพิ่ม
        </button>
        <button class="btn-fav" @click="emit('favorite', props.title)" title="ถูกใจ">
          ❤️
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  time: { type: Number, default: 0 },
  image: { type: String, default: '' },
  desc: { type: String, default: '' },
});

const emit = defineEmits(['add', 'favorite']);
</script>

<style scoped>
.card {
  background: #f8fafc; /* เปลี่ยนเป็นพื้นหลังสีหม่นพรีเมียม (Slate-50) */
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.25s ease;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
}

.card:hover {
  transform: translateY(-4px);
  background: #ffffff; /* เมื่อเอาเมาส์ชี้จะสว่างขึ้น */
  box-shadow: 0 12px 24px -6px rgba(15, 23, 42, 0.08);
  border-color: #cbd5e1;
}

/* ปรับปรุงกรอบรูปให้จัดวางตรงกลางสมบูรณ์แบบ */
.card-image-wrapper {
  width: 100%;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 14px;
  background: #edf2f7;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px; /* เพิ่มระยะขอบด้านใน */
  box-sizing: border-box;
}

/* ปรับรูปไม่ให้บิดเบี้ยว พอดีกรอบและอยู่ตรงกลาง */
.card-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain; /* ป้องกันรูปเบี้ยว รักษาอัตราส่วนเดิม */
  display: block;
  margin: 0 auto;
}

.card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px 0;
}

.card-time {
  font-size: 0.88rem;
  color: #64748b;
  margin: 0 0 8px 0;
}

.desc {
  font-size: 0.88rem;
  color: #475569;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.card-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid #e2e8f0; /* เส้นคั่นกลมกลืนกับกรอบ */
  padding-top: 12px;
}

.btn-detail {
  text-align: center;
  font-size: 0.88rem;
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
  padding: 4px 0;
  transition: color 0.2s;
}

.btn-detail:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.btn-add {
  flex: 1;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 9px 12px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #1d4ed8;
}

.btn-fav {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 9px 12px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.btn-fav:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
}
</style>