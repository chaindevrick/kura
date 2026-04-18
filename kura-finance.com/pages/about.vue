<template>
  <div class="about-container text-white">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="space-y-6">
        <h1 class="hero-title">
          Bridging the Gap Between Web3 and Traditional Finance
        </h1>
        <p class="hero-subtitle">
          We don't follow trends, we only build and invest in practical tools we use every day.
        </p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="mission-section">
      <h2 class="mission-title">Our Mission: Bridging the Gap Between Web3 and Traditional Finance</h2>
      <p class="mission-text">
        At Kura Finance, we believe that managing your assets across decentralized protocols and traditional bank accounts shouldn't require a dozen open tabs and complex spreadsheets. Our mission is to build the most intuitive, unified financial dashboard for the modern digital citizen.
      </p>
    </section>

    <!-- Built for Utility Section -->
    <section class="utility-section">
      <h2 class="utility-title">Built for Utility, Not Speculation</h2>
      <p class="utility-text">
        We approach the Web3 and FinTech space with a builder's mindset. We are not day traders, nor do we build tools for short-term arbitrage. Our philosophy is simple: we look at what brings genuine value, we use the products ourselves, and we build infrastructure that we actually want to stick with for the long haul. Kura Finance was born out of this exact necessity—a practical solution for real-world financial management.
      </p>
    </section>

    <!-- Forward-Looking Innovation Section -->
    <section class="innovation-section">
      <h2 class="innovation-title">Forward-Looking Innovation</h2>
      <p class="innovation-text">
        Beyond data aggregation, we are constantly exploring how blockchain technology can solve traditional pain points. With our upcoming blockchain notary features, we aim to leverage the immutability of decentralized networks to provide secure, verifiable proof of existence for critical legal and business documents.
      </p>
    </section>

    <!-- Join the Journey Section -->
    <section class="join-section">
      <h2 class="join-title">Join the Journey</h2>
      <p class="join-text">
        Whether you are a developer, a freelancer, or an enterprise managing cross-border assets, Kura Finance is designed to bring clarity to your financial truth.
      </p>
    </section>

    <!-- Founder Section -->
    <section class="founder-section">
      <div class="founder-card">
        <div class="quote-accent"></div>
        <div class="flex flex-col md:flex-row gap-8 md:gap-12">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <img 
              src="~/assets/avatar.jpg" 
              alt="Rick Weng, Founder" 
              class="w-32 h-32 md:w-40 md:h-40 rounded-2xl object-cover border-2 border-kura-primary/30"
            />
          </div>
          <!-- Content -->
          <div class="flex-1 space-y-5">
            <h2 class="founder-heading">A Note from the Founder</h2>
            <p class="founder-text">
              When I started navigating the intersection of Web3 and traditional finance, I hit a wall. The industry is full of noise, chaos, and obsession with quick money. But as a developer managing cross-border assets, I don't need another complex trading terminal—I just need clarity.
            </p>
            <p class="founder-text">
              I'm not a day trader, and I certainly don't call myself an arbitrageur. My philosophy is rooted in pure pragmatism: I observe markets, use products myself, and only commit to those that genuinely solve problems.
            </p>
            <p class="founder-text">
              Kura Finance was born to solve my own pain point—getting my financial stack in order. It's infrastructure designed for developers, digital nomads, and enterprises that value signal over noise.
            </p>
            <div class="signature">
              <span class="name">Rick Weng</span>
              <span class="title">Founder, Kura Finance</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="timeline-section">
      <h2 class="section-label">The Evolution</h2>
      <div class="timeline-wrapper">
        <div class="timeline">
          <div
            v-for="(item, index) in milestones"
            :key="index"
            class="timeline-item"
          >
            <div class="timeline-marker"></div>
            <div class="timeline-content-wrapper">
              <div class="timeline-header">
                <h3 class="timeline-title">{{ item.title }}</h3>
                <span class="timeline-time">{{ item.time }}</span>
              </div>
              <p class="timeline-description">{{ item.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust Footer -->
    <section class="trust-footer">
      <div class="trust-card">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 class="trust-title">Built with Transparency</h3>
            <p class="trust-desc">Learn how we safeguard your data compliance and security within the US legal framework.</p>
          </div>
          <NuxtLink to="/compliance" class="whitespace-nowrap px-6 py-2 bg-kura-primary hover:bg-kura-primary-light text-white font-semibold rounded-lg transition-colors">
            Visit Trust Center
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const milestones = reactive([
  {
    time: 'Phase 1: The Catalyst',
    title: 'A Fragmented Financial Truth',
    content: 'Facing financial data scattered across banks and multiple Web3 wallets, we decided to build a clean interface focused on practical integration, rejecting complexity and redundancy.',
    type: 'info'
  },
  {
    time: 'Phase 2: Building the Foundation',
    title: 'Bridging Fiat & On-Chain Data',
    content: 'Through integrating cutting-edge technology, we created a unified dashboard capable of securely reading on-chain assets while connecting traditional financial data.',
    type: 'success'
  },
  {
    time: 'Phase 3: The Horizon',
    title: 'Immutable Proof of Existence',
    content: 'In the future, we will launch a decentralized blockchain-based notary platform providing immutable timestamps and digital fingerprints for critical legal documents.',
    type: 'warning'
  }
])
</script>

<style scoped>
.about-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 24px;
}

/* Hero Section */
.hero-section {
  text-align: center;
  margin-bottom: 120px;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 3.5rem);
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(135deg, #fff 0%, #888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #a0a0a0;
  max-width: 600px;
  margin: 0 auto;
}

/* Mission Section */
.mission-section {
  margin-bottom: 100px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.mission-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.mission-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #c8c8c8;
  margin: 0;
}

/* Utility Section */
.utility-section {
  margin-bottom: 100px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.utility-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.utility-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #c8c8c8;
  margin: 0;
}

/* Innovation Section */
.innovation-section {
  margin-bottom: 100px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
}

.innovation-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.innovation-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #c8c8c8;
  margin: 0;
}

/* Join Section */
.join-section {
  margin-bottom: 100px;
  padding: 40px;
  background: rgba(24, 160, 88, 0.05);
  border: 1px solid rgba(24, 160, 88, 0.2);
  border-radius: 12px;
}

.join-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #ffffff;
}

.join-text {
  font-size: 1.05rem;
  line-height: 1.8;
  color: #c8c8c8;
  margin: 0;
}

/* Founder Section */
.founder-section {
  margin-bottom: 160px;
}

.founder-card {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  padding: 48px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.quote-accent {
  position: absolute;
  left: 0;
  top: 48px;
  width: 4px;
  height: 80px;
  background: #18a058;
  border-radius: 2px;
}

.founder-heading {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.founder-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #d1d1d1;
}

.signature {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
}

.signature .name {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Georgia', serif;
  font-style: italic;
  color: #ffffff;
}

.signature .title {
  color: #777;
  font-size: 0.9rem;
  letter-spacing: 1px;
}

/* Timeline Section */
.timeline-section {
  margin-bottom: 160px;
}

.section-label {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 64px;
  font-weight: 700;
}

.timeline-wrapper {
  max-width: 600px;
  margin: 0 auto;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #18a058, transparent);
}

.timeline-item {
  position: relative;
  margin-bottom: 40px;
}

.timeline-marker {
  position: absolute;
  left: -36px;
  top: 0;
  width: 12px;
  height: 12px;
  background: #18a058;
  border-radius: 50%;
  border: 3px solid #0f172a;
}

.timeline-content-wrapper {
  padding-bottom: 16px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 16px;
}

.timeline-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.timeline-time {
  font-size: 0.9rem;
  color: #18a058;
  font-weight: 500;
  white-space: nowrap;
}

.timeline-description {
  color: #999;
  line-height: 1.6;
  margin: 0;
}

/* Trust Card */
.trust-footer {
  margin-bottom: 120px;
}

.trust-card {
  border-radius: 12px;
  background: rgba(24, 160, 88, 0.05);
  border: 1px solid rgba(24, 160, 88, 0.2);
  padding: 32px;
}

.trust-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  color: #ffffff;
}

.trust-desc {
  color: #777;
  margin: 8px 0 0 0;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .about-container {
    padding: 60px 16px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-section {
    margin-bottom: 80px;
  }

  .mission-section,
  .utility-section,
  .innovation-section,
  .join-section {
    margin-bottom: 60px;
    padding: 24px;
  }

  .mission-title,
  .utility-title,
  .innovation-title,
  .join-title {
    font-size: 1.5rem;
  }

  .mission-text,
  .utility-text,
  .innovation-text,
  .join-text {
    font-size: 0.95rem;
  }

  .founder-card {
    padding: 24px;
  }

  .section-label {
    font-size: 1.75rem;
    margin-bottom: 40px;
  }

  .founder-section {
    margin-bottom: 100px;
  }

  .timeline-section {
    margin-bottom: 100px;
  }

  .trust-card {
    padding: 24px;
  }

  .trust-title {
    font-size: 1rem;
  }
}
</style>
