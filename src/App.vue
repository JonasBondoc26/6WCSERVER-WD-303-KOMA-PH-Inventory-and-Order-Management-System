<template>
  <SiteHeader v-if="!route.meta.bare" />
  <main id="main">
    <router-view />
  </main>
  <SiteFooter v-if="!route.meta.bare" />
  <CartDrawer />
  <ToastHost />
</template>

<script setup>
import { useRoute } from 'vue-router'
import SiteHeader from './components/layout/SiteHeader.vue'
import SiteFooter from './components/layout/SiteFooter.vue'
import CartDrawer from './components/layout/CartDrawer.vue'
import ToastHost from './components/layout/ToastHost.vue'

const route = useRoute()
</script>
