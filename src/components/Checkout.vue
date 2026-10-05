<template>
  <div class="checkout container">
    <RouterLink to="/shop" class="back"><i class="fas fa-arrow-left"></i> Continue shopping</RouterLink>
    <h1>Checkout</h1>

    <div v-if="!cartItems.length && !isSubmitting" class="empty card">
      <i class="fas fa-shopping-bag"></i>
      <h2>Your cart is empty</h2>
      <p>Add a few pieces before checking out.</p>
      <RouterLink to="/shop" class="btn btn-primary">Shop Now</RouterLink>
    </div>

    <section v-else class="checkout-grid">
      <form class="shipping card" @submit.prevent="placeOrder">
        <h2>Shipping Information</h2>

        <label class="field">
          <span>Full name</span>
          <input class="input" v-model.trim="form.name" type="text" autocomplete="name" required />
        </label>

        <label class="field">
          <span>Contact number</span>
          <input class="input" v-model.trim="form.contact" type="tel" inputmode="tel" autocomplete="tel" required />
        </label>

        <label class="field">
          <span>Shipping address</span>
          <textarea class="input" v-model.trim="form.address" rows="3" autocomplete="street-address" required></textarea>
        </label>

        <fieldset class="payment">
          <legend class="field-label">Payment method</legend>
          <label v-for="m in paymentMethods" :key="m.value" class="pay-option" :class="{ selected: form.paymentMethod === m.value }">
            <input type="radio" name="payment" :value="m.value" v-model="form.paymentMethod" />
            <i :class="m.icon"></i>
            <span>{{ m.label }}</span>
          </label>
        </fieldset>

        <button class="btn btn-primary btn-block place-btn" type="submit" :disabled="isSubmitting || !cartItems.length">
          <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
          {{ isSubmitting ? 'Placing order…' : `Place Order · ${formatPrice(total)}` }}
        </button>
      </form>

      <aside class="summary card">
        <h2>Order Summary</h2>

        <ul class="items">
          <li v-for="item in cartItems" :key="item.cartId" class="item">
            <img v-if="item.image" :src="item.image" :alt="item.name" />
            <div class="item-body">
              <div class="title-row">
                <span class="name">{{ item.name }}</span>
                <span class="price">{{ formatPrice((Number(item.price) || 0) * (Number(item.quantity) || 1)) }}</span>
              </div>
              <div class="controls-row">
                <div class="qty">
                  <button type="button" @click="decrement(item)" aria-label="Decrease quantity">−</button>
                  <span>{{ item.quantity || 1 }}</span>
                  <button type="button" @click="increment(item)" aria-label="Increase quantity">+</button>
                </div>
                <button type="button" class="remove-link" @click="removeItem(item)">Remove</button>
              </div>
            </div>
          </li>
        </ul>

        <div class="totals">
          <div class="row"><span>Subtotal</span><span>{{ formatPrice(subtotal) }}</span></div>
          <div class="row"><span>Shipping</span><span>{{ formatPrice(shipping) }}</span></div>
          <div class="row total"><span>Total</span><span>{{ formatPrice(total) }}</span></div>
        </div>
      </aside>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  useCartSidebarLogic,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  getUserData
} from '../assets/js/script.js'
import { toast } from '../assets/js/store.js'

const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const { cartItems, reloadCart } = useCartSidebarLogic(router)

const paymentMethods = [
  { value: 'cod', label: 'Cash on Delivery', icon: 'fas fa-money-bill-wave' },
  { value: 'gcash', label: 'GCash', icon: 'fas fa-mobile-alt' },
  { value: 'bank', label: 'Bank Transfer', icon: 'fas fa-university' }
]

// Form state
const form = ref({
  name: '',
  contact: '',
  address: '',
  paymentMethod: 'cod'
})

const isSubmitting = ref(false)
const shipping = ref(60) // flat shipping fee

onMounted(() => {
  reloadCart()
  // prefill from the signed-in user's saved details
  const info = getUserData()
  if (info && info.user) {
    const u = info.user
    form.value.name = (u.firstName && u.lastName) ? `${u.firstName} ${u.lastName}` : (u.username || '')
    form.value.contact = u.contact || u.phone || ''
    form.value.address = u.address || ''
  }
})

const subtotal = computed(() =>
  (cartItems.value || []).reduce((s, it) => s + (Number(it.price || 0) * (Number(it.quantity || 1))), 0)
)

const total = computed(() => subtotal.value + (Number(shipping.value) || 0))

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

async function placeOrder() {
  const info = getUserData()
  if (!info || !info.id) {
    router.push({ path: '/signin', query: { redirect: '/checkout' } })
    return
  }

  if (!cartItems.value.length) {
    toast('Your cart is empty.', 'error')
    return
  }

  if (!form.value.name || !form.value.address || !form.value.contact) {
    toast('Please fill in your shipping information.', 'error')
    return
  }

  isSubmitting.value = true

  try {
    const payload = {
      orderId: `KMP-${Date.now().toString().slice(-6)}`,
      item: `Order of ${cartItems.value.length} item(s)`,
      status: 'Processing',
      meta: {
        total: total.value,
        subtotal: subtotal.value,
        shipping: shipping.value,
        items: cartItems.value,
        shippingInfo: { ...form.value },
        paymentMethod: form.value.paymentMethod
      }
    }

    const res = await fetch(`${API_URL}/users/${info.id}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'Failed to place order')
    }

    // empty the cart on the server too, otherwise the items come back on reload
    await clearCart()

    toast('Order placed successfully!')
    router.push('/myorders')
  } catch (e) {
    console.error('placeOrder error:', e)
    toast('Could not place order. Try again later.', 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.checkout {
  max-width: 1100px;
  padding-block: clamp(24px, 4vw, 48px) var(--section-y);
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  color: var(--muted);
}

.back:hover {
  color: var(--ink);
}

h1 {
  margin: 12px 0 24px;
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.5rem);
}

h2 {
  margin-bottom: 18px;
  font-family: var(--font-serif);
  font-size: 1.25rem;
}

.empty {
  padding: 56px 24px;
  text-align: center;
}

.empty i {
  font-size: 2.5rem;
  opacity: 0.25;
  margin-bottom: 16px;
}

.empty h2 {
  margin-bottom: 6px;
}

.empty p {
  margin-bottom: 20px;
  color: var(--muted);
}

.checkout-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 400px;
  align-items: start;
  gap: 24px;
}

.shipping,
.summary {
  padding: clamp(18px, 3vw, 28px);
}

.shipping {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.shipping h2 {
  margin-bottom: 2px;
}

/* ---------- payment ---------- */
.payment {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 0;
  padding: 0;
  border: none;
}

.payment legend {
  margin-bottom: 8px;
}

.pay-option {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 8px;
  border: 1px solid #CFC5BF;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.pay-option input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.pay-option i {
  font-size: 1.2rem;
  color: var(--muted);
}

.pay-option.selected {
  border-color: var(--ink);
  background: var(--bg);
  box-shadow: inset 0 0 0 1px var(--ink);
}

.pay-option.selected i {
  color: var(--ink);
}

.pay-option:has(input:focus-visible) {
  outline: 2px solid var(--ink);
  outline-offset: 2px;
}

.place-btn {
  min-height: 52px;
  margin-top: 6px;
}

/* ---------- summary ---------- */
.summary {
  position: sticky;
  top: calc(var(--header-h) + 20px);
}

.items {
  display: flex;
  flex-direction: column;
  max-height: 380px;
  overflow-y: auto;
}

.item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}

.item:first-child {
  padding-top: 0;
}

.item img {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 8px;
  object-fit: cover;
  background: var(--bg);
}

.item-body {
  flex: 1;
  min-width: 0;
}

.title-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.name {
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.3;
}

.price {
  flex-shrink: 0;
  font-size: 0.9rem;
  font-weight: 700;
}

.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.qty {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--line);
  border-radius: 999px;
}

.qty button {
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  font-size: 1rem;
}

.qty span {
  min-width: 24px;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 700;
}

.remove-link {
  border: none;
  background: none;
  font-size: 0.8rem;
  color: var(--danger);
}

.totals {
  margin-top: 16px;
}

.totals .row {
  display: flex;
  justify-content: space-between;
  margin: 6px 0;
  color: var(--ink-soft);
  font-size: 0.95rem;
}

.totals .total {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--ink);
}

/* ---------- responsive ---------- */
@media (max-width: 920px) {
  .checkout-grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .summary {
    position: static;
    order: -1;
  }

  .items {
    max-height: none;
  }
}

@media (max-width: 480px) {
  .payment {
    grid-template-columns: minmax(0, 1fr);
  }

  .pay-option {
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
    padding: 14px;
  }
}
</style>
