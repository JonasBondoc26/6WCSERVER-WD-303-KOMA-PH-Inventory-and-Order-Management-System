import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Index.vue'
import { refreshAuth } from '../assets/js/store.js'

// meta.bare  -> page renders without the site header/footer
// meta.auth  -> page needs a signed-in user
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home, meta: { title: 'Filipino Streetwear' } },
    { path: '/about', name: 'About', component: () => import('../components/About.vue'), meta: { title: 'About' } },
    { path: '/shop', name: 'Shop', component: () => import('../components/Shop.vue'), meta: { title: 'Shop' } },
    { path: '/feature', name: 'Feature', component: () => import('../components/Feature.vue'), meta: { title: 'Featured Collections' } },
    { path: '/product', name: 'Product', component: () => import('../components/Product.vue'), meta: { title: 'Products' } },
    { path: '/signin', name: 'SignIn', component: () => import('../components/SignIn.vue'), meta: { title: 'Sign In', bare: true } },
    { path: '/signup', name: 'SignUp', component: () => import('../components/SignUp.vue'), meta: { title: 'Create Account', bare: true } },
    { path: '/profile', name: 'ProfileDashboard', component: () => import('../components/ProfileDashboard.vue'), meta: { title: 'My Profile', auth: true } },
    { path: '/myorders', name: 'MyOrders', component: () => import('../components/MyOrders.vue'), meta: { title: 'My Orders', auth: true } },
    { path: '/wishlist', name: 'Wishlist', component: () => import('../components/Wishlist.vue'), meta: { title: 'Wishlist', auth: true } },
    { path: '/checkout', name: 'Checkout', component: () => import('../components/Checkout.vue'), meta: { title: 'Checkout', auth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  refreshAuth()
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true'
  if (to.meta.auth && !loggedIn) return { path: '/signin', query: { redirect: to.fullPath } }
  if ((to.name === 'SignIn' || to.name === 'SignUp') && loggedIn) return { path: '/profile' }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | KOMA PH` : 'KOMA PH'
})

export default router
