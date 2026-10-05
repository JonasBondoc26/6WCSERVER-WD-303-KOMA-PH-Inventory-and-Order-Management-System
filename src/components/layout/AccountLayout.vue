<template>
  <div class="account container">
    <aside class="account-nav">
      <div class="who">
        <div class="avatar" aria-hidden="true">{{ initials }}</div>
        <div class="who-text">
          <strong>{{ fullName || 'My Account' }}</strong>
          <span>{{ auth.user?.email || '' }}</span>
        </div>
      </div>

      <nav aria-label="Account">
        <RouterLink to="/profile"><i class="far fa-user"></i><span>Profile</span></RouterLink>
        <RouterLink to="/myorders"><i class="fas fa-box-open"></i><span>My Orders</span></RouterLink>
        <RouterLink to="/wishlist"><i class="far fa-heart"></i><span>Wishlist</span></RouterLink>
        <button class="logout" @click="logout(router)"><i class="fas fa-sign-out-alt"></i><span>Log Out</span></button>
      </nav>
    </aside>

    <section class="account-main">
      <header class="account-head">
        <div>
          <h1>{{ title }}</h1>
          <p v-if="subtitle">{{ subtitle }}</p>
        </div>
        <slot name="actions">
          <RouterLink to="/shop" class="btn btn-outline btn-sm">Continue Shopping</RouterLink>
        </slot>
      </header>

      <slot />
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../../assets/js/store.js'
import { logout } from '../../assets/js/script.js'

defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})

const router = useRouter()

const fullName = computed(() => {
  const u = auth.user || {}
  return [u.firstName, u.lastName].filter(Boolean).join(' ') || u.username || ''
})

const initials = computed(() => {
  const u = auth.user || {}
  const s = ((u.firstName || '')[0] || '') + ((u.lastName || '')[0] || '')
  return (s || (u.username || 'K')[0]).toUpperCase()
})
</script>

<style scoped>
.account {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  align-items: start;
  gap: 32px;
  padding-block: clamp(24px, 5vw, 56px) var(--section-y);
}

/* ---------- side nav ---------- */
.account-nav {
  position: sticky;
  top: calc(var(--header-h) + 20px);
  padding: 20px;
  background: var(--surface);
  border-radius: var(--radius);
  border: 1px solid rgba(40, 23, 5, 0.06);
  box-shadow: var(--shadow-sm);
}

.who {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 18px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--line);
}

.avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--ink);
  color: #fff;
  font-family: var(--font-display);
  font-size: 1.1rem;
}

.who-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.who-text strong {
  font-size: 0.95rem;
  line-height: 1.3;
}

.who-text span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.8rem;
  color: var(--muted);
}

nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

nav a,
nav .logout {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 11px 12px;
  border: none;
  border-radius: 8px;
  background: none;
  font-size: 0.92rem;
  font-weight: 700;
  text-align: left;
  text-decoration: none;
  color: var(--ink-soft);
  transition: background-color 0.15s ease, color 0.15s ease;
}

nav i {
  width: 18px;
  text-align: center;
}

nav a:hover,
nav .logout:hover {
  background: var(--bg);
}

nav a.router-link-exact-active {
  background: var(--ink);
  color: #fff;
}

nav .logout {
  margin-top: 8px;
  color: var(--danger);
}

/* ---------- main ---------- */
.account-main {
  min-width: 0;
}

.account-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.account-head h1 {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 4vw, 2.25rem);
}

.account-head p {
  margin-top: 4px;
  color: var(--muted);
  font-size: 0.9rem;
}

/* ---------- responsive ---------- */
@media (max-width: 860px) {
  .account {
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
  }

  .account-nav {
    min-width: 0;
    position: static;
    padding: 0;
    background: none;
    border: none;
    box-shadow: none;
  }

  .who {
    display: none;
  }

  /* horizontal, swipeable tab bar */
  nav {
    flex-direction: row;
    gap: 8px;
    overflow-x: auto;
    margin-inline: calc(var(--gutter) * -1);
    padding: 2px var(--gutter);
    scrollbar-width: none;
  }

  nav::-webkit-scrollbar {
    display: none;
  }

  nav a,
  nav .logout {
    flex-shrink: 0;
    width: auto;
    padding: 9px 16px;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: var(--surface);
    font-size: 0.85rem;
    white-space: nowrap;
  }

  nav a.router-link-exact-active {
    border-color: var(--ink);
  }

  nav .logout {
    margin-top: 0;
  }
}

@media (max-width: 520px) {
  .account-head {
    flex-direction: column;
    align-items: flex-start;
  }

  .account-head :deep(.btn) {
    width: 100%;
  }
}
</style>
