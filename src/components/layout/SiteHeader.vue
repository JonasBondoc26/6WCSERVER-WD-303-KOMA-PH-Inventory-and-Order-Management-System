<template>
  <header class="site-header" :class="{ scrolled }">
    <div class="header-inner container">
      <button class="icon-btn menu-toggle" @click="menuOpen = true" aria-label="Open menu">
        <i class="fas fa-bars"></i>
      </button>

      <RouterLink to="/" class="logo" aria-label="KOMA PH home">
        <img src="../../assets/photos/KOMA Logo.png" alt="KOMA Clothing Co." />
      </RouterLink>

      <nav class="desktop-nav" aria-label="Main">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to">{{ link.label }}</RouterLink>
      </nav>

      <div class="header-actions">
        <div class="user-menu" ref="userMenuEl">
          <button
            class="icon-btn"
            :aria-expanded="userMenuOpen"
            aria-haspopup="true"
            aria-label="Account"
            @click="userMenuOpen = !userMenuOpen"
          >
            <i class="far fa-user"></i>
          </button>

          <transition name="pop">
            <div v-if="userMenuOpen" class="user-dropdown" role="menu">
              <template v-if="auth.isLoggedIn">
                <p class="greeting">Hi, {{ name || 'there' }}</p>
                <RouterLink to="/profile" role="menuitem">Profile</RouterLink>
                <RouterLink to="/myorders" role="menuitem">My Orders</RouterLink>
                <RouterLink to="/wishlist" role="menuitem">Wishlist</RouterLink>
                <button class="logout" role="menuitem" @click="handleLogout">Log Out</button>
              </template>
              <template v-else>
                <RouterLink to="/signin" role="menuitem">Sign In</RouterLink>
                <RouterLink to="/signup" role="menuitem">Create Account</RouterLink>
              </template>
            </div>
          </transition>
        </div>

        <button class="icon-btn" aria-label="Wishlist" @click="goToWishlist(router)">
          <i class="far fa-heart"></i>
        </button>

        <button class="icon-btn cart-btn" aria-label="Cart" @click="handleOrders">
          <i class="fas fa-shopping-bag"></i>
          <span v-if="cartCount" class="badge">{{ cartCount > 99 ? '99+' : cartCount }}</span>
        </button>
      </div>
    </div>

    <!-- Mobile drawer: teleported to <body> because the header's backdrop-filter
         would otherwise trap these fixed elements inside the 68px header -->
    <Teleport to="body">
    <transition name="fade">
      <div v-if="menuOpen" class="drawer-overlay" @click="menuOpen = false"></div>
    </transition>
    <aside class="mobile-drawer" :class="{ open: menuOpen }" aria-label="Mobile menu" :aria-hidden="!menuOpen">
      <div class="drawer-head">
        <img src="../../assets/photos/KOMA Logo.png" alt="KOMA" class="drawer-logo" />
        <button class="icon-btn" @click="menuOpen = false" aria-label="Close menu">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <nav class="drawer-nav" aria-label="Mobile">
        <RouterLink v-for="link in links" :key="link.to" :to="link.to">{{ link.label }}</RouterLink>
      </nav>

      <div class="drawer-account">
        <template v-if="auth.isLoggedIn">
          <p class="eyebrow">Signed in as {{ name || 'member' }}</p>
          <RouterLink to="/profile"><i class="far fa-user"></i> Profile</RouterLink>
          <RouterLink to="/myorders"><i class="fas fa-box-open"></i> My Orders</RouterLink>
          <RouterLink to="/wishlist"><i class="far fa-heart"></i> Wishlist</RouterLink>
          <button class="btn btn-outline btn-block" @click="handleLogout">Log Out</button>
        </template>
        <template v-else>
          <RouterLink to="/signin" class="btn btn-primary btn-block">Sign In</RouterLink>
          <RouterLink to="/signup" class="btn btn-outline btn-block">Create Account</RouterLink>
        </template>
      </div>
    </aside>
    </Teleport>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { auth, displayName } from '../../assets/js/store.js'
import { goToWishlist, logout, useCartSidebarLogic } from '../../assets/js/script.js'

const router = useRouter()
const route = useRoute()
const { cartItems, handleOrders } = useCartSidebarLogic(router)

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/shop', label: 'Shop' },
  { to: '/product', label: 'Product' },
  { to: '/feature', label: 'Feature' }
]

const menuOpen = ref(false)
const userMenuOpen = ref(false)
const userMenuEl = ref(null)
const scrolled = ref(false)

const name = computed(() => displayName())
const cartCount = computed(() =>
  auth.isLoggedIn ? cartItems.value.reduce((n, i) => n + (Number(i.quantity) || 1), 0) : 0
)

// close menus whenever the page changes
watch(() => route.fullPath, () => {
  menuOpen.value = false
  userMenuOpen.value = false
})

watch(menuOpen, (open) => document.body.classList.toggle('no-scroll', open))

function handleLogout() {
  userMenuOpen.value = false
  menuOpen.value = false
  logout(router)
}

function onDocClick(e) {
  if (userMenuEl.value && !userMenuEl.value.contains(e.target)) userMenuOpen.value = false
}

function onKey(e) {
  if (e.key === 'Escape') {
    menuOpen.value = false
    userMenuOpen.value = false
  }
}

function onScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKey)
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKey)
  window.removeEventListener('scroll', onScroll)
  document.body.classList.remove('no-scroll')
})
</script>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(244, 234, 234, 0.92);
  backdrop-filter: saturate(140%) blur(10px);
  -webkit-backdrop-filter: saturate(140%) blur(10px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.site-header.scrolled {
  border-bottom-color: var(--line);
  box-shadow: 0 2px 12px rgba(40, 23, 5, 0.05);
}

.header-inner {
  display: flex;
  align-items: center;
  gap: 24px;
  height: var(--header-h);
}

.logo img {
  height: 46px;
  width: auto;
  mix-blend-mode: multiply; /* hides the logo's white background */
}

.menu-toggle {
  display: none;
  margin-left: -10px;
}

/* ---------- desktop nav ---------- */
.desktop-nav {
  display: flex;
  gap: 4px;
  margin-right: auto;
}

.desktop-nav a {
  position: relative;
  padding: 8px 14px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--ink);
  opacity: 0.75;
  transition: opacity 0.2s ease;
}

.desktop-nav a::after {
  content: "";
  position: absolute;
  left: 14px;
  right: 14px;
  bottom: 2px;
  height: 2px;
  background: var(--ink);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}

.desktop-nav a:hover,
.desktop-nav a.router-link-exact-active {
  opacity: 1;
}

.desktop-nav a:hover::after,
.desktop-nav a.router-link-exact-active::after {
  transform: scaleX(1);
}

/* ---------- icons ---------- */
.header-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.cart-btn {
  position: relative;
}

.badge {
  position: absolute;
  top: 4px;
  right: 2px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 18px;
  text-align: center;
}

/* ---------- user dropdown ---------- */
.user-menu {
  position: relative;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  padding: 8px;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--line);
}

.user-dropdown .greeting {
  padding: 8px 12px 10px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-accent);
  font-size: 1.1rem;
  font-weight: 600;
}

.user-dropdown a,
.user-dropdown .logout {
  display: block;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 8px;
  background: none;
  text-align: left;
  text-decoration: none;
  font-size: 0.9rem;
  color: var(--ink);
}

.user-dropdown a:hover,
.user-dropdown .logout:hover {
  background: var(--bg);
}

.user-dropdown .logout {
  color: var(--danger);
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* ---------- mobile drawer ---------- */
.drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(20, 12, 4, 0.45);
}

.mobile-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 201;
  width: min(320px, 85vw);
  display: flex;
  flex-direction: column;
  padding: 16px 20px calc(24px + env(safe-area-inset-bottom));
  background: var(--bg);
  box-shadow: var(--shadow-lg);
  transform: translateX(-100%);
  visibility: hidden;
  transition: transform 0.3s ease, visibility 0.3s;
  overflow-y: auto;
}

.mobile-drawer.open {
  transform: translateX(0);
  visibility: visible;
}

.drawer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.drawer-logo {
  height: 40px;
  width: auto;
  mix-blend-mode: multiply;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
}

.drawer-nav a {
  padding: 14px 4px;
  border-bottom: 1px solid var(--line);
  font-family: var(--font-display);
  font-size: 1.35rem;
  text-decoration: none;
  color: var(--ink);
}

.drawer-nav a.router-link-exact-active {
  font-weight: 700;
}

.drawer-account {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: auto;
  padding-top: 32px;
}

.drawer-account > a:not(.btn) {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 4px;
  text-decoration: none;
  font-weight: 700;
}

.drawer-account i {
  width: 18px;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ---------- breakpoints ---------- */
@media (max-width: 900px) {
  .menu-toggle {
    display: inline-flex;
  }

  .desktop-nav {
    display: none;
  }

  .header-inner {
    gap: 8px;
  }

  .logo {
    margin-right: auto;
  }

  .logo img {
    height: 40px;
  }
}

@media (max-width: 420px) {
  /* account lives in the drawer on small phones */
  .user-menu {
    display: none;
  }
}
</style>
