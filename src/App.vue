<script setup>
import { RouterLink, RouterView } from 'vue-router'
const canSell = localStorage.getItem('canSell');
</script>

<template>
  <div id="app">
    <nav v-if="!['login', 'register', 'checkOut'].includes($route.name)"
      class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <router-link class="nav-link" :to="{ name: 'home' }">
          <img src="/logo-payment-gateway.png" height="30" alt="Logo" loading="lazy" />
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'home' }">Home</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'transactions' }">Transactions</router-link>
            </li>
            <li class="nav-item" v-if="canSell == 'true'">
              <router-link class="nav-link" :to="{ name: 'productList' }">Products</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" :to="{ name: 'login' }" @click="logout">Cerrar sesión</router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>

  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: ''
    }
  },
  methods: {
    logout() {
      localStorage.clear();
    },
  },
};
</script>