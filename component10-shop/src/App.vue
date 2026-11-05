<template>
  <div class="app-container">
    <header class="app-header-banner">
      <div class="banner-content">
        <span class="banner-title">👵👴 ระบบวิเคราะห์และออกแบบการออกกำลังกาย สำหรับผู้สูงอายุ</span>
      </div>
    </header>

    <header class="navbar-wrapper">
      <nav aria-label="เมนูหลัก" class="nav-container">
        <div class="nav-links">
          <router-link to="/">หน้าแรก</router-link>
          <router-link to="/products">รายการฝึก</router-link>
          <router-link to="/cart">ตารางสะสม ({{ itemCount }})</router-link>
          <router-link v-if="user" to="/admin">หลังบ้านผู้ดูแล</router-link>
        </div>

        <div class="nav-right">
          <router-link v-if="!user" to="/login" class="btn-login">เข้าสู่ระบบ</router-link>
          <span v-else class="user-box">
            <span class="user-email">👤 {{ user.email }}</span>
            <button @click="logout" class="btn-logout">ออกจากระบบ</button>
          </span>
        </div>
      </nav>
    </header>

    <p v-if="liveMsg" class="live" role="status" aria-live="polite">{{ liveMsg }}</p>

    <main id="main" tabindex="-1">
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="footer-content">
        <p class="copyright">
          ระบบวิเคราะห์และออกแบบการออกกำลังกายสำหรับผู้สูงอายุ © 2026
        </p>
        <p class="subtext">
          เพื่อส่งเสริมสุขภาพ ของผู้สูงวัยอย่างปลอดภัย
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  itemCount, loadProducts, liveMsg, startRealtime, stopRealtime,
  user, signOut,
} from './store.js';

const router = useRouter();

async function logout() {
  await signOut();
  router.push('/'); 
}

onMounted(() => {
  loadProducts();
  startRealtime();
});

onUnmounted(stopRealtime);
</script>

<style>
body {
  margin: 0;
  background-color: #fdfbf7;
  color: #1e293b;
  font-family: system-ui, -apple-system, sans-serif;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header-banner {
  background-color: #38bdf8;
  color: #ffffff;
  padding: 14px 20px;
  box-shadow: 0 2px 8px rgba(56, 189, 248, 0.25);
}

.banner-content {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 12px;
}

.banner-title {
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.navbar-wrapper {
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1100px;
  margin: 0 auto;
  padding: 12px 0;
  flex-wrap: wrap; /* ปรับให้ยืดหยุ่นขึ้นเมื่อขึ้นบรรทัดใหม่ */
  gap: 12px;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap; /* อนุญาตให้ปุ่มเมนูสลับบรรทัดสม่ำเสมอ */
}

.nav-right {
  display: flex;
  align-items: center;
}

nav a {
  padding: 8px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: #475569;
  font-weight: 600;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  font-size: 0.925rem;
  white-space: nowrap;
  transition: all 0.2s ease;
}

nav a:hover {
  background: #f0f9ff;
  color: #0284c7;
  border-color: #bae6fd;
}

nav a.router-link-exact-active {
  background: #0284c7;
  color: #ffffff;
  border-color: #0369a1;
  box-shadow: 0 2px 6px rgba(2, 132, 199, 0.25);
}

.btn-login {
  background-color: #f0f9ff;
  color: #0284c7 !important;
  border-color: #bae6fd !important;
}

.user-box {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  background-color: #f8fafc;
  font-weight: 600;
  color: #334155;
  font-size: 0.875rem;
}

.user-email {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px; /* จำกัดความยาวอีเมลไม่ให้ดันขอบจอ */
}

.btn-logout {
  padding: 4px 10px;
  border: 1px solid #fca5a5;
  background-color: #fee2e2;
  color: #dc2626;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.btn-logout:hover {
  background-color: #dc2626;
  color: #ffffff;
}

.live {
  max-width: 1000px;
  margin: 16px auto 0;
  padding: 12px 18px;
  background: #f0f9ff;
  border: 2px solid #bae6fd;
  border-left: 6px solid #0284c7;
  color: #0369a1;
  border-radius: 8px;
  font-weight: 600;
}

main {
  flex: 1;
  width: 100%;
  max-width: 1000px;
  margin: 20px auto 40px;
  padding: 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  box-sizing: border-box;
}

main:focus { outline: none; }

.app-footer {
  background-color: #0f172a;
  color: #ffffff;
  padding: 24px 20px;
  text-align: center;
  margin-top: auto;
  border-top: 1px solid #1e293b;
}

.footer-content {
  max-width: 1000px;
  margin: 0 auto;
}

.copyright {
  font-size: 0.95rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  color: #f8fafc;
}

.subtext {
  font-size: 0.85rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.5;
}

/* 📱 Responsive สำหรับโทรศัพท์ */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .nav-links {
    justify-content: center;
  }

  .nav-right {
    justify-content: center;
    width: 100%;
  }

  .user-box {
    width: 100%;
    justify-content: space-between;
    box-sizing: border-box;
  }

  .user-email {
    max-width: 100%;
  }

  .banner-title {
    font-size: 0.95rem;
  }
}
</style>