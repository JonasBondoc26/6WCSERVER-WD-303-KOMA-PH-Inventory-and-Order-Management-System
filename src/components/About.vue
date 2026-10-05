<template>
  <div class="about-page">
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-text">
          <span class="eyebrow">Est. Pampanga, PH</span>
          <h1>About KOMA PH</h1>
          <p>
            Founded with passion and driven by creativity, KOMA PH is a Filipino streetwear brand redefining modern
            style and local pride. We create clothing that tells stories — made for dreamers, movers, and changemakers.
            Each piece represents the perfect blend of comfort, culture, and confidence.
          </p>
          <RouterLink to="/shop" class="btn btn-light">Shop Our Collection</RouterLink>
        </div>

        <div class="hero-media">
          <img src="../assets/photos/About hero.jpg" alt="KOMA PH streetwear" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container narrow">
        <h2 class="section-heading">Our Core Values</h2>

        <div class="values-grid">
          <article v-for="(v, i) in values" :key="v.title" class="value-card card">
            <span class="value-num">0{{ i + 1 }}</span>
            <h3>{{ v.title }}</h3>
            <p>{{ v.text }}</p>
          </article>
        </div>

        <p class="tagline">
          At KOMA PH, we're more than just a brand — we're a community that celebrates style, creativity, and
          self-expression. Join us on this exciting journey and discover your next favorite look.
        </p>
      </div>
    </section>

    <section class="section story">
      <div class="container narrow story-grid">
        <article>
          <h2 class="section-heading">The KOMA Lifestyle</h2>
          <p>
            Living the KOMA lifestyle means owning your voice, expressing yourself, and moving with purpose. Our pieces
            are made for movement — from city streets to campus walks, late-night sessions to early grind. We dress the
            doers, the creators, the dreamers.
          </p>
          <p>
            We believe fashion isn't about fitting in — it's about standing tall in who you are. Wear what speaks for
            you, not what silences you. That's the KOMA way.
          </p>
        </article>

        <article>
          <h2 class="section-heading">What Makes Us Different</h2>
          <p>
            We don't follow trends — we set them. KOMA PH is a space for those who dare to create their own path. We
            design for those who aren't afraid to stand out, speak up, and show out. We're not just about clothes —
            we're about culture, connection, and confidence.
          </p>
          <p>
            With every drop, every release, and every campaign, we're redefining what it means to be a local streetwear
            brand. Bold looks, limited runs, no fluff — just real style for real people.
          </p>
        </article>
      </div>
    </section>

    <section class="cta section">
      <div class="container">
        <h2>Be bold. Be real. Be KOMA PH.</h2>
        <RouterLink to="/shop" class="btn btn-primary">Explore Our Products</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
const values = [
  { title: 'Quality First', text: 'We prioritize high standards in every fabric, stitch, and finish — because you deserve nothing less than the best.' },
  { title: 'Customer Focus', text: 'Your satisfaction is our mission. We listen, adapt, and constantly improve to meet your needs and exceed expectations.' },
  { title: 'Sustainability', text: 'We believe in fashion that respects the planet — striving for eco-friendly practices in sourcing and packaging.' },
  { title: 'Community First', text: "We're powered by people. Our community guides our journey, not the other way around." }
]
</script>

<style scoped>
@import "../assets/css/about-style.css";
</style>
