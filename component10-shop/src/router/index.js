import { createRouter, createWebHistory } from "vue-router";
import HomePage from '../pages/HomePage.vue';
import ProductsPage from "../pages/ProductsPage.vue";
import CartPage from "../pages/CartPage.vue";
import ProductDetailPage from '../pages/ProductDetailPage.vue';
import AdminPage from '../pages/AdminPage.vue'; 
import LoginPage from '../pages/LoginPage.vue';
import { user, authReady } from '../store.js';
import AssessmentPage from '../pages/AssessmentPage.vue';
import SavePlanPage from '../pages/SavePlanPage.vue';
import ImpactPage from '../pages/ImpactPage.vue'; // 1. Import เพิ่มตรงนี้

const routes = [
    { path: '/', component: HomePage },
    { path: '/products', component: ProductsPage },
    { path: '/assessment', component: AssessmentPage },
    { path: '/product/:id', component: ProductDetailPage },
    { path: '/cart', component: CartPage },
    { path: '/login', component: LoginPage },
    { path: '/admin', component: AdminPage, meta: { requiresLogin: true } },
    { path: '/save-plan', component: SavePlanPage },
    { path: '/impact', component: ImpactPage }, // 2. เพิ่ม Route ตรงนี้
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to) => {
   if (to.meta.requiresLogin) {
     await authReady;                             
     if (!user.value) return '/login';             
   }
});

router.afterEach(() => {
  document.getElementById('main')?.focus();
});

export default router;