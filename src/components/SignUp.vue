<template>
  <div class="auth-wrapper">
    <div class="auth-card reverse">
      <div class="auth-right">
        <div class="overlay">
          <h3>Join the KOMA Community</h3>
          <p>Redefining streetwear from Pampanga to the world.</p>
        </div>
      </div>

      <div class="auth-left">
        <router-link to="/" class="auth-logo-link" aria-label="Back to home">
          <img src="../assets/photos/KOMA Logo.png" alt="KOMA Logo" class="auth-logo" />
        </router-link>

        <h1>Create Account</h1>
        <p class="auth-tagline">It only takes a minute.</p>

        <form class="auth-form" @submit.prevent="handleSignUp">
          <div class="form-row">
            <div class="floating-group">
              <input type="text" id="firstName" v-model.trim="firstName" placeholder=" " autocomplete="given-name" required />
              <label for="firstName">First Name</label>
            </div>
            <div class="floating-group">
              <input type="text" id="lastName" v-model.trim="lastName" placeholder=" " autocomplete="family-name" required />
              <label for="lastName">Last Name</label>
            </div>
          </div>

          <div class="form-row">
            <fieldset class="form-group">
              <legend>Gender</legend>
              <div class="gender-group">
                <label><input type="radio" value="Male" v-model="gender" /> Male</label>
                <label><input type="radio" value="Female" v-model="gender" /> Female</label>
              </div>
            </fieldset>

            <div class="form-group">
              <label for="dob">Date of Birth</label>
              <input id="dob" type="date" v-model="dob" :max="today" required />
            </div>
          </div>

          <div class="floating-group">
            <input id="address" type="text" v-model.trim="address" placeholder=" " autocomplete="street-address" required />
            <label for="address">Address</label>
          </div>

          <div class="form-row">
            <div class="floating-group">
              <input id="contact" type="tel" v-model.trim="contact" placeholder=" " autocomplete="tel" inputmode="tel" required />
              <label for="contact">Contact No.</label>
            </div>

            <div class="floating-group">
              <input id="email" type="email" v-model.trim="email" placeholder=" " autocomplete="email" required />
              <label for="email">Email</label>
            </div>
          </div>

          <div class="form-row">
            <div class="floating-group">
              <input id="username" type="text" v-model.trim="username" placeholder=" " autocomplete="username" required />
              <label for="username">Username</label>
            </div>

            <div class="floating-group">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder=" "
                autocomplete="new-password"
                minlength="6"
                required
              />
              <label for="password">Password</label>
              <button type="button" class="peek" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                <i :class="showPassword ? 'far fa-eye-slash' : 'far fa-eye'"></i>
              </button>
            </div>
          </div>

          <p v-if="error" class="form-error" role="alert">{{ error }}</p>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            <i v-if="loading" class="fas fa-spinner fa-spin"></i>
            {{ loading ? 'Creating account…' : 'Sign Up' }}
          </button>

          <p class="switch-link">
            Already a member? <router-link to="/signin">Sign In</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from '../assets/js/store.js'

const API_URL = import.meta.env.VITE_API_URL

export default {
  name: "SignUpPage",
  data() {
    return {
      firstName: "",
      lastName: "",
      gender: "",
      dob: "",
      address: "",
      contact: "",
      email: "",
      username: "",
      password: "",
      showPassword: false,
      loading: false,
      error: "",
      today: new Date().toISOString().slice(0, 10),
    };
  },
  methods: {
    async handleSignUp() {
      this.error = "";
      if (this.password.length < 6) {
        this.error = "Password must be at least 6 characters.";
        return;
      }

      this.loading = true;
      try {
        const res = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
            dob: this.dob,
            address: this.address,
            contact: this.contact,
            email: this.email,
            username: this.username,
            password: this.password,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          toast("Account created! You can sign in now.");
          this.$router.push("/signin");
        } else {
          this.error = data.message || data.error || "Failed to register.";
        }
      } catch (err) {
        console.error(err);
        this.error = "Can't reach the server right now. Please try again in a moment.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
@import "../assets/css/login-style.css";
</style>
