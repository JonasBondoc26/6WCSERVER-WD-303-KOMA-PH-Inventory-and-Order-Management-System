<template>
  <transition name="fade">
    <div v-if="isCartSidebarOpen" class="cart-overlay" @click="closeSidebar"></div>
  </transition>

  <aside class="cart-drawer" :class="{ open: isCartSidebarOpen }" aria-label="Shopping cart" :aria-hidden="!isCartSidebarOpen">
    <div class="drawer-header">
      <h2>Your Cart <span>({{ itemCount }})</span></h2>
      <button class="icon-btn" @click="closeSidebar" aria-label="Close cart">
        <i class="fas fa-times"></i>
      </button>
    </div>

    <div v-if="!cartItems.length" class="empty">
      <i class="fas fa-shopping-bag"></i>
      <p>Your cart is empty.</p>
      <RouterLink to="/shop" class="btn btn-primary" @click="closeSidebar">Start Shopping</RouterLink>
    </div>

    <ul v-else class="items">
      <li v-for="item in cartItems" :key="item.cartId || item.id" class="item">
        <img :src="item.image" :alt="item.name" loading="lazy" />
        <div class="item-body">
          <div class="item-top">
            <p class="item-name">{{ item.name }}</p>
            <button class="remove" @click="removeItem(item)" aria-label="Remove item">
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
          <p class="item-price">{{ formatPrice(item.price) }}</p>
          <div class="qty">
            <button @click="decrement(item)" aria-label="Decrease quantity">−</button>
            <span>{{ item.quantity || 1 }}</span>
            <button @click="increment(item)" aria-label="Increase quantity">+</button>
          </div>
        </div>
      </li>
    </ul>

    <div v-if="cartItems.length" class="drawer-footer">
      <div class="subtotal">
        <span>Subtotal</span>
        <strong>{{ formatPrice(subtotal) }}</strong>
      </div>
      <button class="btn btn-primary btn-block" @click="goToCheckoutPage">Proceed to Checkout</button>
      <button class="btn btn-ghost btn-block" @click="goToOrdersPage">View My Orders</button>
    </div>
  </aside>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCartSidebarLogic, updateCartItemQuantity, removeCartItem } from '../../assets/js/script.js'

const router = useRouter()
const {
  isCartSidebarOpen,
  cartItems,
  closeSidebar,
  goToCheckoutPage,
  goToOrdersPage,
  reloadCart
} = useCartSidebarLogic(router)

const itemCount = computed(() => cartItems.value.reduce((n, i) => n + (Number(i.quantity) || 1), 0))
const subtotal = computed(() =>
  cartItems.value.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0)
)

watch(isCartSidebarOpen, (open) => document.body.classList.toggle('no-scroll', open))

function formatPrice(p) {
  return `₱${Number(p || 0).toLocaleString()}`
}

async function increment(item) {
  await updateCartItemQuantity(item.cartId, +1)
  reloadCart()
}

async function decrement(item) {
  if (Number(item.quantity || 1) <= 1) await removeCartItem(item.cartId)
  else await updateCartItemQuantity(item.cartId, -1)
  reloadCart()
}

async function removeItem(item) {
  await removeCartItem(item.cartId)
  reloadCart()
}
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(20, 12, 4, 0.45);
}

.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 301;
  width: min(400px, 100vw);
  display: flex;
  flex-direction: column;
  background: #fff;
  box-shadow: var(--shadow-lg);
  transform: translateX(100%);
  visibility: hidden;
  transition: transform 0.3s ease, visibility 0.3s;
}

.cart-drawer.open {
  transform: translateX(0);
  visibility: visible;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 14px 24px;
  border-bottom: 1px solid var(--line);
}

.drawer-header h2 {
  font-family: var(--font-display);
  font-size: 1.3rem;
}

.drawer-header h2 span {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--muted);
}

.empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 32px;
  text-align: center;
  color: var(--muted);
}

.empty i {
  font-size: 2.5rem;
  opacity: 0.3;
}

.items {
  flex: 1;
  overflow-y: auto;
  padding: 8px 24px;
}

.item {
  display: flex;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid var(--line);
}

.item:last-child {
  border-bottom: none;
}

.item img {
  width: 84px;
  height: 84px;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: 8px;
  background: var(--bg);
}

.item-body {
  flex: 1;
  min-width: 0;
}

.item-top {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.item-name {
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.3;
}

.remove {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  margin: -6px -6px 0 0;
  border: none;
  border-radius: 50%;
  background: none;
  color: var(--muted);
}

.remove:hover {
  color: var(--danger);
  background: #FEF2F2;
}

.item-price {
  margin: 4px 0 10px;
  color: var(--muted);
  font-size: 0.9rem;
}

.qty {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 999px;
}

.qty button {
  width: 34px;
  height: 34px;
  border: none;
  background: none;
  font-size: 1.1rem;
  line-height: 1;
}

.qty button:hover {
  background: var(--bg);
  border-radius: 50%;
}

.qty span {
  min-width: 28px;
  text-align: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.drawer-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 24px calc(18px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--line);
  background: #fff;
}

.subtotal {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
  font-size: 1.05rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 480px) {
  .drawer-header { padding-left: 16px; }
  .items { padding-inline: 16px; }
  .drawer-footer { padding-inline: 16px; }
}
</style>
