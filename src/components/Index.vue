<template>
  <div class="home">
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-text">
          <span class="eyebrow">Keep On Moving Ahead</span>
          <h1>Filipino<br />Streetwear<br />Redefined</h1>
          <p>Minimal, comfortable pieces made with pride in Pampanga — for the movers, the dreamers and the grinders.</p>
          <div class="hero-actions">
            <RouterLink to="/shop" class="btn btn-primary">Shop Now</RouterLink>
            <RouterLink to="/feature" class="btn btn-outline">View Collections</RouterLink>
          </div>
        </div>

        <div class="hero-media">
          <img src="../assets/photos/Ate.png" alt="Model wearing an oversized KOMA tee" fetchpriority="high" />
        </div>
      </div>
    </section>

    <section class="about section">
      <div class="container about-inner">
        <span class="eyebrow">Our Story</span>
        <h2 class="section-heading">About KOMA PH</h2>
        <p>
          KOMA PH is a local streetwear brand blending modern fashion and Filipino identity.
          We focus on comfort, minimalist style, and sustainability — made with passion in Pampanga.
        </p>
        <RouterLink to="/about" class="btn btn-outline">Learn More</RouterLink>
      </div>
    </section>

    <section class="arrivals section">
      <div class="container">
        <div class="arrivals-head">
          <h2 class="section-heading">New Arrivals</h2>
          <RouterLink to="/shop" class="see-all">View all <i class="fas fa-arrow-right"></i></RouterLink>
        </div>

        <div class="arrivals-grid">
          <RouterLink to="/shop" class="arrival-card">
            <img src="../assets/photos/P1.jpg" alt="Black KOMA embroidered sweatshirt" loading="lazy" />
          </RouterLink>
          <RouterLink to="/shop" class="arrival-card">
            <img src="../assets/photos/P2.jpg" alt="Brown KOMA Drift t-shirt, back view" loading="lazy" />
          </RouterLink>
          <RouterLink to="/shop" class="arrival-card">
            <img src="../assets/photos/P3.jpg" alt="Black KOMA oversized hoodie" loading="lazy" />
          </RouterLink>
        </div>

        <div class="arrivals-cta">
          <RouterLink to="/shop" class="btn btn-light">View All Products</RouterLink>
        </div>
      </div>
    </section>

    <section class="testimonials section">
      <div class="container">
        <h2 class="section-heading">What People Say</h2>
        <div class="testimonial-grid">
          <figure class="testimonial card">
            <i class="fas fa-quote-left"></i>
            <blockquote>Love the fit and quality. Proud to wear local!</blockquote>
            <figcaption>@juanstyle</figcaption>
          </figure>
          <figure class="testimonial card">
            <i class="fas fa-quote-left"></i>
            <blockquote>Smooth transaction! Shirt fits perfectly.</blockquote>
            <figcaption>@maria.ph</figcaption>
          </figure>
          <figure class="testimonial card">
            <i class="fas fa-quote-left"></i>
            <blockquote>Comfy fabric and fast delivery.</blockquote>
            <figcaption>@trendscout</figcaption>
          </figure>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
@import "../assets/css/Index-style.css";
</style>
