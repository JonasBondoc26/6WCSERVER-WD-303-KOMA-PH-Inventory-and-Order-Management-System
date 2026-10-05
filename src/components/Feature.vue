<template>
  <div class="feature-page">
    <div class="container feature-wrapper">
      <header class="intro">
        <h1>Featured Collections</h1>
        <p class="subtitle">A look back at our most iconic drops and collaborations.</p>
      </header>

      <div class="top-grid">
        <figure class="tile">
          <img src="../assets/photos/F1.jpg" alt="V1 Collection" />
        </figure>
        <figure class="tile">
          <img src="../assets/photos/F2.jpg" alt="Drift Collection" />
        </figure>
        <figure class="tile">
          <img src="../assets/photos/F3.jpg" alt="KOMA lookbook" loading="lazy" />
        </figure>
      </div>

      <p class="intro-text">
        The Drift Collection explores movement, freedom, and everyday moments — crafted with timeless streetwear designs.
      </p>

      <figure class="tile wide">
        <img src="../assets/photos/F4.jpg" alt="The V1 Collection: the foundation" loading="lazy" />
      </figure>

      <div class="main-text">
        <p class="eyebrow">Our Inaugural Collection</p>
        <h2>Built for motion. Made to last.</h2>
        <p class="body">
          Crafted from a heavyweight cotton blend engineered for lasting comfort and shape retention. Reinforced
          stitching throughout for enduring street performance.
        </p>
      </div>

      <div class="bottom-grid">
        <figure class="tile">
          <img src="../assets/photos/F5.jpg" alt="DRIFT: movement and color" loading="lazy" />
        </figure>
        <figure class="tile">
          <img src="../assets/photos/F6.jpg" alt="DRIFT close-up" loading="lazy" />
        </figure>
        <div class="cta-wrap">
          <RouterLink to="/shop" class="btn btn-primary">Explore All Collections</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
@import "../assets/css/feature-style.css";
</style>
