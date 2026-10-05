<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-left">
        <router-link to="/" class="auth-logo-link" aria-label="Back to home">
          <img src="../assets/photos/KOMA Logo.png" alt="KOMA Logo" class="auth-logo" />
        </router-link>

        <h1>Welcome Back</h1>
        <p class="auth-tagline">Keep on moving ahead — log in and join the movement.</p>

        <form class="auth-form" @submit.prevent="handleLogin" novalidate>
          <div class="floating-group">
            <input id="login-user" type="text" v-model.trim="username" placeholder=" " autocomplete="username" required />
            <label for="login-user">Username or Email</label>
          </div>

          <div class="floating-group">
            <input
              id="login-pass"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder=" "
              autocomplete="current-password"
              required
            />
            <label for="login-pass">Password</label>
            <button type="button" class="peek" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
              <i :class="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
            </button>
          </div>

          <p v-if="error" class="form-error" role="alert">{{ error }}</p>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            {{ loading ? 'Signing in…' : 'Sign In' }}
          </button>

          <p class="switch-link">
            New here? <router-link to="/signup">Create an account</router-link>
          </p>
        </form>
      </div>

      <div class="auth-right">
        <div class="overlay">
          <h3>Filipino Streetwear</h3>
          <p>Made with pride. Made for the grind.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { refreshAuth, toast } from '../assets/js/store.js'

const API_URL = import.meta.env.VITE_API_URL

export default {
  name: "SignInPage",
  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      loading: false,
      error: "",
    };
  },
  methods: {
    async handleLogin() {
      this.error = "";
      if (!this.username || !this.password) {
        this.error = "Please enter your username and password.";
        return;
      }

      this.loading = true;
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          // Persist useful keys for other parts of the app
          const user = data.user || {};
          const id = user._id || user.id || '';

          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('username', user.firstName || user.username || '');
          localStorage.setItem('userId', id);
          // store a canonical user object for helpers that attempt to parse it
          localStorage.setItem('currentUser', JSON.stringify(user));
          // some components check this key
          localStorage.setItem('loggedInUser', JSON.stringify(user));
          refreshAuth();
          window.dispatchEvent(new Event('koma_cart_updated'));

          toast(`Welcome back, ${user.firstName || user.username || 'User'}!`);
          const redirect = typeof this.$route.query.redirect === 'string' ? this.$route.query.redirect : '/';
          this.$router.push(redirect.startsWith('/') ? redirect : '/');
        } else {
          this.error = data.message || data.error || "Login failed.";
        }
      } catch (err) {
        console.error(err);
        this.error = "Can't reach the server right now. Please try again in a moment.";
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>

<style scoped>
@import "../assets/css/login-style.css";
</style>
