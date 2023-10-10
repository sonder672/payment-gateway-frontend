import { createRouter, createWebHistory } from 'vue-router'
import ProductListView from '@/components/APIConsumers/Product/ProductList.vue';
import LoginView from '@/components/APIConsumers/User/Login.vue';
import RegisterView from '@/components/APIConsumers/User/Register.vue';
import CheckOutView from '@/components/APIConsumers/Purchase/CheckOut.vue';
import HomeView from '@/components/APIConsumers/Home.vue';
import TransactionsView from '@/components/APIConsumers/User/Transactions.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/products',
      name: 'productList',
      component: ProductListView,
      meta: { requiresAuth: true, requiresPermission: true }
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: TransactionsView,
      meta: { requiresAuth: true }
    },
    {
      path: '/checkout/:productId',
      name: 'checkOut',
      component: CheckOutView
    },
  ]
})

export default router