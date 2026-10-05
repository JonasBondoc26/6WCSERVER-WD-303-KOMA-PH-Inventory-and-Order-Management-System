<template>
  <AccountLayout title="My Orders" :subtitle="isLoading ? '' : `${orders.length} order${orders.length === 1 ? '' : 's'}`">
    <div v-if="isLoading" class="loading card"><i class="fas fa-spinner fa-spin"></i> Loading…</div>

    <div v-else-if="!orders.length" class="empty-state card">
      <div class="icon"><i class="fas fa-box-open"></i></div>
      <h3>No orders yet</h3>
      <p>Your recent purchases will appear here.</p>
      <RouterLink to="/shop" class="btn btn-primary">Shop Now</RouterLink>
    </div>

    <div v-else class="order-list">
      <article
        v-for="(order, idx) in orders"
        :key="order.orderId || order._id || idx"
        class="order-card card"
        :class="{ open: openId === keyOf(order, idx) }"
      >
        <button class="order-summary" :aria-expanded="openId === keyOf(order, idx)" @click="toggle(order, idx)">
          <div class="order-main">
            <div class="order-id">Order {{ order.orderId || ('#KMP-' + (100 + idx)) }}</div>
            <div class="order-meta">
              <span>{{ formatDate(order.date) }}</span>
              <span>Total: <strong>{{ formatPrice(order.meta?.total ?? order.total) }}</strong></span>
              <span>{{ itemsOf(order).length || '—' }} item(s)</span>
            </div>
          </div>
          <span class="status-pill" :class="statusClass(order.status)">{{ order.status || 'Processing' }}</span>
          <i class="fas fa-chevron-down chevron"></i>
        </button>

        <div v-if="openId === keyOf(order, idx)" class="order-details">
          <div v-if="itemsOf(order).length" class="order-items">
            <div v-for="(it, i) in itemsOf(order)" :key="it.cartId || i" class="order-item">
              <img v-if="it.image" :src="it.image" :alt="it.name" loading="lazy" />
              <div class="grow">
                <div>{{ it.name }}</div>
                <div class="muted">Qty {{ it.quantity || 1 }} × {{ formatPrice(it.price) }}</div>
              </div>
              <strong>{{ formatPrice((Number(it.price) || 0) * (Number(it.quantity) || 1)) }}</strong>
            </div>
          </div>
          <p v-else class="order-items">{{ order.item || 'No item details saved for this order.' }}</p>

          <div v-if="order.meta?.shippingInfo" class="order-ship">
            <div><span>Ship to</span>{{ order.meta.shippingInfo.name }}</div>
            <div><span>Address</span>{{ order.meta.shippingInfo.address }}</div>
            <div><span>Payment</span>{{ paymentLabel(order.meta.paymentMethod) }}</div>
          </div>
        </div>
      </article>
    </div>
  </AccountLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AccountLayout from './layout/AccountLayout.vue'
import { getUserData, fetchOrders } from '../assets/js/script.js';

const router = useRouter();
const orders = ref([]);
const isLoading = ref(true);
const openId = ref(null);

function keyOf(order, idx) {
  return order.orderId || order._id || idx;
}

function toggle(order, idx) {
  const k = keyOf(order, idx);
  openId.value = openId.value === k ? null : k;
}

function itemsOf(order) {
  return Array.isArray(order.meta?.items) ? order.meta.items : [];
}

function statusClass(status) {
  const s = String(status || 'processing').toLowerCase();
  if (s.includes('processing')) return 'processing';
  if (s.includes('shipped')) return 'shipped';
  if (s.includes('delivered')) return 'delivered';
  return '';
}

function paymentLabel(m) {
  return { cod: 'Cash on Delivery', gcash: 'GCash', bank: 'Bank Transfer' }[m] || m || '—';
}

function formatDate(d) {
  const date = new Date(d);
  if (isNaN(date)) return d || '';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatPrice(p) {
  if (p == null || p === '') return '—';
  return `₱${Number(p).toLocaleString()}`;
}

async function loadOrders() {
  const info = getUserData();
  if (!info || !info.id) {
    router.push('/signin');
    return;
  }
  isLoading.value = true;
  orders.value = await fetchOrders(info.id);
  isLoading.value = false;
}

onMounted(loadOrders);
</script>

<style scoped>
@import "../assets/css/profile-style.css";
</style>
