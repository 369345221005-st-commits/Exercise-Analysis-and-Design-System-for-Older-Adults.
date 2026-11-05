<template>
  <section class="login-box">
    <h1>เข้าสู่ระบบผู้ดูแล</h1>
    <form @submit.prevent="login">
      <p>
        <label for="email">อีเมล</label>
        <input id="email" v-model.trim="email" type="email" autocomplete="username" required>
      </p>
      <p>
        <label for="password">รหัสผ่าน</label>
        <input id="password" v-model="password" :type="showPw ? 'text' : 'password'" autocomplete="current-password" required>
       <button type="button" class="btn-toggle" @click="showPw = !showPw" :aria-pressed="showPw">
         {{ showPw ? '🙈 ซ่อนรหัส' : '👁️ แสดงรหัส' }}
       </button>
      </p>
      <button type="submit" class="btn-submit" :disabled="busy">
        {{ busy ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
      </button>
    </form>
    
    <p role="alert">{{ message }}</p>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { signIn } from '../store.js';

const email = ref('');
const password = ref('');
const busy = ref(false);     
const message = ref('');
const showPw = ref(false);
const router = useRouter();

async function login() {
  busy.value = true;
  message.value = await signIn(email.value, password.value);
  busy.value = false;
  if (!message.value) router.push('/admin');   
}
</script>

<style scoped>
.login-box {
  max-width: 480px;
  width: 90%;
  margin: 50px auto;
  padding: 40px;
  background-color: #fdfbf7; /* 🍦 ครีมละมุน */
  border: 2px solid #bae6fd;
  border-radius: 16px;
  box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.15);
  box-sizing: border-box;
}

h1 {
  margin: 0 0 28px 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #0369a1;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
}

p {
  margin: 0 0 20px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

label {
  font-weight: 600;
  font-size: 0.95rem;
  color: #334155;
}

input {
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid #cbd5e1;
  border-radius: 10px;
  background-color: #ffffff;
  color: #0f172a;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #0284c7;
  box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.2);
}

.btn-toggle {
  background: none;
  border: none;
  color: #0284c7;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  align-self: flex-end;
  padding: 0;
  margin-top: 4px;
  width: auto;
  box-shadow: none;
}

.btn-submit {
  margin-top: 8px;
  width: 100%;
  padding: 14px;
  font-size: 1.05rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #0284c7;
  border: 2px solid #0369a1;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(2, 132, 199, 0.2);
}

.btn-submit:hover:not(:disabled) {
  background-color: #0369a1;
}

p[role="alert"]:not(:empty) {
  margin-top: 20px;
  padding: 12px 16px;
  background-color: #fef2f2;
  border: 1.5px solid #fca5a5;
  border-left: 5px solid #ef4444;
  color: #991b1b;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
}
</style>