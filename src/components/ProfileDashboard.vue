<template>
  <AccountLayout :title="`Hi, ${profile.firstName || profile.username || 'there'}`" subtitle="Manage your details, orders and saved items.">
    <section class="stats">
      <div class="stat card">
        <div>
          <div class="stat-label">Total Orders</div>
          <div class="stat-value">{{ orders.length }}</div>
        </div>
        <i class="fas fa-box-open"></i>
      </div>
      <div class="stat card">
        <div>
          <div class="stat-label">Wishlist Items</div>
          <div class="stat-value">{{ wishlist.length }}</div>
        </div>
        <i class="fas fa-heart"></i>
      </div>
      <div class="stat card">
        <div>
          <div class="stat-label">Total Spent</div>
          <div class="stat-value">{{ formatPrice(totalSpent) }}</div>
        </div>
        <i class="fas fa-receipt"></i>
      </div>
    </section>

    <!-- Profile -->
    <section class="panel card">
      <div class="panel-head">
        <h2>Profile Information</h2>
        <button v-if="!editing" class="btn btn-ghost btn-sm" @click="startEdit"><i class="fas fa-pen"></i> Edit</button>
      </div>

      <dl v-if="!editing" class="info-list">
        <div><dt>Name</dt><dd>{{ [profile.firstName, profile.lastName].filter(Boolean).join(' ') || '—' }}</dd></div>
        <div><dt>Username</dt><dd>{{ profile.username || '—' }}</dd></div>
        <div><dt>Email</dt><dd>{{ profile.email || '—' }}</dd></div>
        <div><dt>Contact</dt><dd>{{ profile.contact || '—' }}</dd></div>
        <div class="full"><dt>Address</dt><dd>{{ profile.address || '—' }}</dd></div>
      </dl>

      <form v-else class="profile-form" @submit.prevent="saveProfile">
        <label class="field"><span>First name</span><input class="input" v-model.trim="form.firstName" autocomplete="given-name" /></label>
        <label class="field"><span>Last name</span><input class="input" v-model.trim="form.lastName" autocomplete="family-name" /></label>
        <label class="field"><span>Email</span><input class="input" v-model.trim="form.email" type="email" autocomplete="email" /></label>
        <label class="field"><span>Contact</span><input class="input" v-model.trim="form.contact" type="tel" autocomplete="tel" /></label>
        <label class="field"><span>Username</span><input class="input" v-model.trim="form.username" autocomplete="username" /></label>
        <label class="field"><span>New password</span><input class="input" v-model="form.password" type="password" placeholder="Leave blank to keep" autocomplete="new-password" /></label>
        <label class="field full"><span>Address</span><input class="input" v-model.trim="form.address" autocomplete="street-address" /></label>
        <div class="form-actions">
          <button type="button" class="btn btn-ghost" @click="cancelEdit">Cancel</button>
          <button type="submit" class="btn btn-primary" :disabled="saving">{{ saving ? 'Saving…' : 'Save Changes' }}</button>
        </div>
      </form>
    </section>

    <!-- Recent orders -->
    <section class="panel card">
      <div class="panel-head">
        <h2>Recent Orders</h2>
        <RouterLink v-if="orders.length" to="/myorders">View all</RouterLink>
      </div>
      <div v-if="orders.length" class="recent">
        <div v-for="(o, idx) in orders.slice(0, 3)" :key="o.orderId || idx" class="recent-row">
          <div>
            <strong>{{ o.orderId || ('#KMP-' + (100 + idx)) }}</strong>
            <span class="muted">{{ formatDate(o.date) }} · {{ formatPrice(o.meta?.total) }}</span>
          </div>
          <span class="status-pill" :class="statusClass(o.status)">{{ o.status || 'Processing' }}</span>
        </div>
      </div>
      <p v-else class="muted-text">No orders yet. <RouterLink to="/shop">Start shopping</RouterLink></p>
    </section>

    <!-- Wishlist preview -->
    <section class="panel card">
      <div class="panel-head">
        <h2>Saved Items</h2>
        <RouterLink v-if="wishlist.length" to="/wishlist">View all</RouterLink>
      </div>
      <div v-if="wishlist.length" class="product-grid">
        <article v-for="(item, index) in wishlist.slice(0, 4)" :key="item.productId || index" class="product-card card">
          <div class="media">
            <img :src="item.image || noImage" :alt="item.name" loading="lazy" />
          </div>
          <div class="body">
            <h3 class="name">{{ item.name }}</h3>
            <span class="price">{{ formatPrice(item.price) }}</span>
            <div class="actions">
              <button class="btn btn-primary btn-sm" @click="handleAddToCart(item)">Add to Cart</button>
              <button class="square-btn" @click="handleRemove(item)" aria-label="Remove from wishlist">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </article>
      </div>
      <p v-else class="muted-text">Tap the heart on products to save them for later.</p>
    </section>
  </AccountLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AccountLayout from './layout/AccountLayout.vue'
import { getUserData, fetchWishlist, fetchOrders, removeWishlist, addToCart, reloadWishlist, useCartSidebarLogic } from '../assets/js/script.js'
import { refreshAuth, toast } from '../assets/js/store.js'
const API_URL = import.meta.env.VITE_API_URL

const router = useRouter()
const { openSidebar } = useCartSidebarLogic(router)
const wishlist = ref([])
const orders = ref([])
const noImage = new URL('../assets/photos/product3.png', import.meta.url).href

const profile = ref({})
const editing = ref(false)
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  contact: '',
  address: '',
  username: '',
  password: ''
})
const saving = ref(false)

const totalSpent = computed(() =>
  orders.value.reduce((s, o) => s + (Number(o.meta?.total) || 0), 0)
)

function statusClass(status) {
  const s = String(status || 'processing').toLowerCase()
  if (s.includes('processing')) return 'processing'
  if (s.includes('shipped')) return 'shipped'
  if (s.includes('delivered')) return 'delivered'
  return ''
}

function formatDate(d) {
  const date = new Date(d)
  if (isNaN(date)) return d || ''
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function formatPrice(p) {
  if (p == null) return '₱0'
  return `₱${Number(p).toLocaleString()}`
}

async function loadProfileData() {
  const info = getUserData()
  if (!info) return
  profile.value = info.user || {}

  if (info.id) {
    const [w, o] = await Promise.all([fetchWishlist(info.id), fetchOrders(info.id)])
    wishlist.value = w
    orders.value = o
  }
}

function startEdit() {
  editing.value = true
  for (const k of ['firstName', 'lastName', 'email', 'contact', 'address', 'username']) {
    form.value[k] = profile.value[k] || ''
  }
  form.value.password = ''
}

function cancelEdit() {
  editing.value = false
  form.value.password = ''
}

async function saveProfile() {
  const info = getUserData()
  const id = info && info.id
  if (!id) {
    router.push('/signin')
    return
  }
  saving.value = true
  try {
    const payload = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      contact: form.value.contact,
      address: form.value.address,
      username: form.value.username
    }
    if (form.value.password && form.value.password.trim()) payload.password = form.value.password

    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.message || 'Failed to update profile')
    }
    const data = await res.json()
    const updated = data.user
    // update localStorage to keep UI helpers in sync
    try {
      localStorage.setItem('currentUser', JSON.stringify(updated))
      localStorage.setItem('loggedInUser', JSON.stringify(updated))
      if (updated._id || updated.id) localStorage.setItem('userId', updated._id || updated.id)
      if (updated.username) localStorage.setItem('username', updated.firstName || updated.username)
      if (updated.email) localStorage.setItem('email', updated.email)
    } catch (e) { /* ignore storage errors */ }
    refreshAuth()

    editing.value = false
    await loadProfileData()
    toast('Profile updated')
  } catch (e) {
    console.error(e)
    toast(e.message || 'Could not update profile.', 'error')
  } finally {
    saving.value = false
  }
}

async function handleRemove(item) {
  const info = getUserData()
  const id = info && info.id
  if (!id) return
  try {
    await removeWishlist(id, item.productId)
    wishlist.value = wishlist.value.filter(w => w.productId !== item.productId)
    reloadWishlist(id).catch(() => {})
    toast('Removed from wishlist')
  } catch (e) {
    console.error(e)
    toast('Could not remove item from wishlist.', 'error')
  }
}

async function handleAddToCart(item) {
  const ok = await addToCart({ ...item, id: item.productId })
  if (ok) {
    toast(`${item.name} added to cart`)
    openSidebar()
  } else {
    toast('Could not add to cart.', 'error')
  }
}

onMounted(loadProfileData)
</script>

<style scoped>
@import "../assets/css/profile-style.css";

.info-list .full {
  grid-column: 1 / -1;
}

.muted-text {
  color: var(--muted);
}

.muted-text a {
  font-weight: 700;
  color: var(--ink);
}
</style>
