import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    const requiresPermission = to.matched.some(record => record.meta.requiresPermission);
    const hasToken = localStorage.getItem('authToken');
    const canSell = localStorage.getItem('canSell') === 'true'; // Convertir a booleano

    if (requiresAuth && !hasToken) {
      next('/login');
    } else if (requiresPermission && (!canSell || canSell == 'false')) {
      next('/');
    } else {
      next();
    }
});


app.use(router)

app.mount('#app')
