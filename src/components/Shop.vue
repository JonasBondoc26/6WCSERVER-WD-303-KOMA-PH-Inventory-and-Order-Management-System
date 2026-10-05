<template>
  <div class="shop-page">
    <template v-for="collection in collections" :key="collection.id">
      <section class="banner container" :class="[collection.id, { 'title-in-image': collection.titleInImage }]">
        <div class="banner-inner">
          <img :src="collection.banner" :alt="collection.title + ' banner'" :loading="collection.id === 'v1' ? 'eager' : 'lazy'" />
          <div v-if="!collection.titleInImage" class="banner-text">
            <span class="brand">KOMA</span>
            <h2>{{ collection.title }}</h2>
            <p>{{ collection.tagline }}</p>
          </div>
        </div>
      </section>

      <section class="container products">
        <div class="products-head">
          <h3>{{ collection.title }}</h3>
          <span>{{ collection.items.length }} items</span>
        </div>

        <div class="product-grid" :class="collection.id">
          <article v-for="product in collection.items" :key="product.id" class="product-card">
            <div class="media">
              <img :src="product.image" :alt="product.name" loading="lazy" />
              <button
                class="wish-btn"
                :class="{ active: isIn(product.id) }"
                :aria-label="isIn(product.id) ? 'Remove from wishlist' : 'Add to wishlist'"
                :aria-pressed="isIn(product.id)"
                @click="toggleWishlistClick(product)"
              >
                <i :class="isIn(product.id) ? 'fas fa-heart' : 'far fa-heart'"></i>
              </button>
            </div>

            <div class="info">
              <h4>{{ product.name }}</h4>
              <p class="price">₱{{ product.price.toLocaleString() }}</p>
            </div>

            <button class="btn btn-primary btn-block buy-btn" :disabled="adding === product.id" @click="handleBuyNowClick(product)">
              <i v-if="adding === product.id" class="fas fa-spinner fa-spin"></i>
              <template v-else>Add to Cart</template>
            </button>
          </article>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import {
  handleBuyNow,
  useCartSidebarLogic,
  v1Products,
  driftProducts,
  reloadWishlist,
  toggleWishlist
} from '../assets/js/script.js'
import { auth, toast } from '../assets/js/store.js'

const router = useRouter()
const { openSidebar } = useCartSidebarLogic(router)

const collections = [
  {
    id: 'v1',
    title: 'V1 Collection',
    tagline: 'The foundation. Heavyweight essentials in onyx and grey.',
    banner: new URL('../assets/photos/unnamed.png', import.meta.url).href,
    items: v1Products
  },
  {
    id: 'drift',
    title: 'Drift Collection',
    tagline: 'Movement, freedom and everyday moments.',
    banner: new URL('../assets/photos/Gemini_Generated_Image_54ga2b54ga2b54ga.png', import.meta.url).href,
    titleInImage: true, // the photo already says "DRIFT COLLECTION"
    items: driftProducts
  }
]

// wishlist reactive snapshot (array of ids)
const wishlistIds = ref([])
const adding = ref(null)

async function loadWishlist() {
  await reloadWishlist()
  try {
    const parsed = JSON.parse(localStorage.getItem('userWishlist') || '[]')
    wishlistIds.value = Array.isArray(parsed) ? parsed : []
  } catch {
    wishlistIds.value = []
  }
}

onMounted(() => {
  loadWishlist()
  window.addEventListener('koma_wishlist_updated', loadWishlist)
})

onBeforeUnmount(() => {
  window.removeEventListener('koma_wishlist_updated', loadWishlist)
})

function isIn(id) {
  return !!id && wishlistIds.value.includes(id)
}

async function toggleWishlistClick(product) {
  if (!auth.isLoggedIn) {
    toast('Sign in to save items to your wishlist', 'info')
    router.push({ path: '/signin', query: { redirect: '/shop' } })
    return
  }
  const added = await toggleWishlist(router, product)
  await loadWishlist()
  toast(added ? `${product.name} saved to wishlist` : 'Removed from wishlist')
}

async function handleBuyNowClick(product) {
  if (!auth.isLoggedIn) {
    toast('Sign in to start shopping', 'info')
    router.push({ path: '/signin', query: { redirect: '/shop' } })
    return
  }
  adding.value = product.id
  try {
    await handleBuyNow(router, product)
    toast(`${product.name} added to cart`)
    openSidebar()
  } finally {
    adding.value = null
  }
}
</script>

<style scoped>
@import "../assets/css/shop-style.css";
</style>
