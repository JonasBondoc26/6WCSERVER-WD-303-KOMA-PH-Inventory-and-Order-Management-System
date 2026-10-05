<template>
  <div class="product-page">
    <section class="hero">
      <div class="hero-overlay">
        <img src="../assets/photos/KOMA logo white.png" alt="KOMA" class="hero-logo" />
        <RouterLink to="/shop" class="btn btn-light">Shop Now</RouterLink>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2 class="section-heading">New Arrival</h2>

        <div class="arrival-gallery">
          <RouterLink v-for="item in arrivals" :key="item.alt" to="/shop" class="tile">
            <img :src="item.src" :alt="item.alt" loading="lazy" />
          </RouterLink>
        </div>

        <p class="arrival-text">Keep on moving ahead — good things happen slowly.</p>
        <div class="center">
          <RouterLink to="/shop" class="btn btn-outline">Go To Shop</RouterLink>
        </div>
      </div>
    </section>

    <section class="section available">
      <div class="container">
        <h2 class="section-heading">Product Available</h2>

        <div class="product-grid">
          <RouterLink v-for="item in products" :key="item.alt" to="/shop" class="tile">
            <img :src="item.src" :alt="item.alt" loading="lazy" />
          </RouterLink>
        </div>

        <div class="center">
          <RouterLink to="/shop" class="btn btn-primary">Go To Shop</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const img = (name) => new URL(`../assets/photos/${name}`, import.meta.url).href

const arrivals = [
  { src: img('arrival1.png'), alt: 'Brown shirt' },
  { src: img('arrival2.png'), alt: 'Olive shirt' },
  { src: img('arrival3.png'), alt: 'Black shirt' }
]

const products = [
  { src: img('product1.png'), alt: 'Black jacket' },
  { src: img('product2.png'), alt: 'White shirt' },
  { src: img('product3.png'), alt: 'Black hoodie' },
  { src: img('product4.png'), alt: 'Black shorts' },
  { src: img('product5.png'), alt: 'Cap' },
  { src: img('product6.png'), alt: 'Gray jacket' },
  { src: img('product7.png'), alt: 'Green shirt' },
  { src: img('product8.png'), alt: 'Black pants' }
]
</script>

<style scoped>
@import "../assets/css/product-style.css";
</style>
