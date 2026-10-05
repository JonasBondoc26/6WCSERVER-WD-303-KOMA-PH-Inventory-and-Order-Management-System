<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="brand">
        <RouterLink to="/" aria-label="KOMA PH home">
          <img src="../../assets/photos/KOMA Logo.png" alt="KOMA Clothing Co." />
        </RouterLink>
        <p>Filipino streetwear made with pride in Pampanga. Keep on moving ahead.</p>
      </div>

      <nav class="footer-links" aria-label="Footer">
        <h3>Explore</h3>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/shop">Shop</RouterLink>
        <RouterLink to="/product">Product</RouterLink>
        <RouterLink to="/feature">Feature</RouterLink>
      </nav>

      <div class="footer-links">
        <h3>Account</h3>
        <RouterLink to="/profile">Profile</RouterLink>
        <RouterLink to="/myorders">My Orders</RouterLink>
        <RouterLink to="/wishlist">Wishlist</RouterLink>
      </div>

      <div class="social">
        <h3>Follow Us</h3>
        <div class="social-icons">
          <a href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {{ year }} KOMA PH. All rights reserved.</p>
    </div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.site-footer {
  background: var(--bg);
  border-top: 1px solid var(--line);
  padding-top: 56px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 40px;
}

.brand img {
  height: 52px;
  width: auto;
  mix-blend-mode: multiply;
  margin-bottom: 12px;
}

.brand p {
  max-width: 300px;
  color: var(--muted);
  font-size: 0.95rem;
}

h3 {
  margin-bottom: 14px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-links a {
  width: fit-content;
  font-size: 0.95rem;
  text-decoration: none;
  color: var(--ink);
}

.footer-links a:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.social-icons {
  display: flex;
  gap: 10px;
}

.social-icons a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid var(--ink);
  border-radius: 50%;
  text-decoration: none;
  color: var(--ink);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.social-icons a:hover {
  background: var(--ink);
  color: #fff;
}

.footer-bottom {
  padding: 18px var(--gutter) calc(18px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--line);
  text-align: center;
  font-size: 0.85rem;
  color: var(--muted);
}

@media (max-width: 860px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 32px 24px;
  }

  .brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 420px) {
  .site-footer {
    padding-top: 40px;
  }
}
</style>
