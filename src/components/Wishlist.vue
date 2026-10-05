<template>
  <AccountLayout title="Your Wishlist" :subtitle="isLoading ? '' : `${wishlist.length} item${wishlist.length === 1 ? '' : 's'} saved`">
    <div v-if="isLoading" class="loading card"><i class="fas fa-spinner fa-spin"></i> Loading…</div>

    <div v-else-if="!wishlist.length" class="empty-state card">
      <div class="icon"><i class="far fa-heart"></i></div>
      <h3>Your wishlist is empty</h3>
      <p>Tap the heart on products to save them for later.</p>
      <RouterLink to="/shop" class="btn btn-primary">Shop Now</RouterLink>
    </div>

    <div v-else class="product-grid">
      <article v-for="(item, index) in wishlist" :key="item.productId || index" class="product-card card">
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
  </AccountLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AccountLayout from './layout/AccountLayout.vue'
import { getUserData, fetchWishlist, removeWishlist, addToCart, reloadWishlist, useCartSidebarLogic } from '../assets/js/script.js'
import { toast } from '../assets/js/store.js'

const router = useRouter()
const { openSidebar } = useCartSidebarLogic(router)
const wishlist = ref([])
const isLoading = ref(true)
const userId = ref(null)
const noImage = new URL('../assets/photos/product3.png', import.meta.url).href

function formatPrice(p) {
  if (p == null) return ''
  return `₱${Number(p).toLocaleString()}`
}

async function loadWishlist() {
  const info = getUserData()
  if (!info || !info.id) {
    router.push('/signin')
    return
  }
  userId.value = info.id
  isLoading.value = true
  wishlist.value = await fetchWishlist(userId.value)
  isLoading.value = false
}

async function handleRemove(item) {
  if (!userId.value) return
  try {
    await removeWishlist(userId.value, item.productId)
    wishlist.value = wishlist.value.filter(w => w.productId !== item.productId)
    reloadWishlist(userId.value).catch(() => {})
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

onMounted(loadWishlist)
</script>

<style scoped>
@import "../assets/css/profile-style.css";
</style>
