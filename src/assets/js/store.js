// Small shared reactive state: auth status + toast notifications.
import { reactive } from 'vue'

// ---------------- Auth ----------------

function readAuth() {
  let user = null
  try { user = JSON.parse(localStorage.getItem('currentUser') || 'null') } catch { user = null }
  if (user && user.user) user = user.user
  return {
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
    user: user || null
  }
}

export const auth = reactive(readAuth())

// Re-read login state from localStorage (call after login / logout / profile update)
export function refreshAuth() {
  Object.assign(auth, readAuth())
}

window.addEventListener('storage', (e) => {
  if (['isLoggedIn', 'currentUser'].includes(e.key)) refreshAuth()
})

export function displayName(user = auth.user) {
  if (!user) return ''
  return user.firstName || user.username || ''
}

// ---------------- Toasts ----------------

export const toasts = reactive([])
let toastId = 0

// type: 'success' | 'error' | 'info'
export function toast(message, type = 'success', timeout = 3000) {
  const id = ++toastId
  toasts.push({ id, message, type })
  setTimeout(() => dismissToast(id), timeout)
}

export function dismissToast(id) {
  const i = toasts.findIndex(t => t.id === id)
  if (i !== -1) toasts.splice(i, 1)
}
