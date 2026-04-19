<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

useSeoMeta({
  title: 'KLHS - Kura Liquidity Health Score | Kura Finance',
  description: 'Collateral Lies, Credit History Doesn\'t. A Zero-Knowledge Credit Oracle Built for the Next Generation of DeFi Protocols. Stop over-collateralization. Start intelligent risk assessment.',
  keywords: 'KLHS, Kura Liquidity Health Score, DeFi credit scoring, zero-knowledge oracle, Web3 identity, hybrid finance, risk management',
  ogTitle: 'KLHS - Collateral Lies, Credit History Doesn\'t',
  ogDescription: 'A Zero-Knowledge Credit Oracle Built for the Next Generation of DeFi Protocols.',
  ogUrl: 'https://kura-finance.com/klhs',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'KLHS - Kura Liquidity Health Score'
});

const whyKLHS = [
  {
    icon: '🔍',
    title: 'Cross-Fi Utilization Check',
    description: 'Pure on-chain protocols can only see crypto assets. Kura integrates compliant APIs to access traditional fiat account balances (US top-tier banks). Real poverty with billions in chain assets becomes instantly detectable. Calculate true financial health with unparalleled precision.'
  },
  {
    icon: '📜',
    title: 'The 2-Year Liquidation Memory',
    description: 'Stop counting meaningless transfer counts. KLHS deeply tracks borrowing history and liquidation records across major lending protocols (Aave, Morpho). Addresses with excellent repayment history are the quality liquidity your protocol deserves.'
  },
  {
    icon: '🆔',
    title: 'DID-Backed Scoring',
    description: 'KLHS assigns maximum weight to addresses bound to Kura DID (KDID), Worldcoin, or Palau RNS.id. Dramatically increase the default cost for malicious actors. Eliminate the arbitrage space for throwaway sybil wallets.'
  }
];

const privacyPoints = [
  {
    title: 'For Users',
    content: 'Your real name, SSN, and bank account details never go on-chain and are never shared with third-party DeFi protocols. Build credit while maintaining absolute anonymity.'
  },
  {
    title: 'For Protocols',
    content: 'No need to handle sensitive personal data. When smart contracts call the KLHS oracle, we return only cryptographically-verified booleans or score bands. Example: "This wallet is backed by a single real human with KLHS liquidity health > 750."'
  }
];

const layers = [
  {
    icon: '🆔',
    title: 'Identity Layer',
    subtitle: 'The Absolute Defense with DID',
    description: 'Identity verification is the cornerstone of KLHS, determining the credit foundation for every user.',
    features: [
      {
        heading: 'Solving "Throwaway Identity" Risk',
        content: 'In DeFi, the maximum cost of defaulting is simply "abandoning that wallet." But if the wallet is bound to Palau RNS.id (government-backed) or Worldcoin (biometric), the default cost becomes social death in the real world.'
      },
      {
        heading: 'Sumsub as Fallback',
        content: 'For users without Web3 DID, Kura conducts KYC through Sumsub and issues proprietary Kura-DID. This positions Kura as a Web3 real-name authentication issuer, maximizing your commercial footprint.'
      }
    ]
  },
  {
    icon: '📊',
    title: 'Scoring Dimensions',
    subtitle: 'Dimensional Reduction Attack of TradFi Logic',
    description: 'Built on the essence of modern financial risk control, designed dimensions include:',
    features: [
      {
        heading: 'Redefining Credit Age',
        content: 'We abandon "first transfer" metrics and focus on "first Aave/Morpho lending interaction." This is precise because simple transfers don\'t represent credit—borrowing history does.'
      },
      {
        heading: 'The 2-Year Memory',
        content: 'Perfectly aligned with traditional FICO score treatment of bankruptcy or serious delinquency as credit blemishes.'
      },
      {
        heading: 'Ultimate Moat (Cross-Fi Utilization Rate)',
        content: 'Combine Plaid fiat account balances with on-chain loans to calculate "true capital utilization." This is KLHS\'s ultimate selling point! A user might show 90% collateralization on Aave (seemingly high-risk), but if Kura knows through Plaid that they have $100k sitting in Chase, that user\'s KLHS score remains exceptionally high—a "premium customer." Pure on-chain protocols can never calculate this data.'
      }
    ]
  },
  {
    icon: '⚙️',
    title: 'Technical Delivery',
    subtitle: 'ZK + Oracle Architecture',
    description: 'An elegant technical architecture that balances privacy and decentralized trust.',
    features: [
      {
        heading: 'Zero-Knowledge Proofs (zkTLS)',
        content: 'Kura acts as the Prover. When institutions (like a DeFi lending pool) query via API, we don\'t expose user Chase bank details. Instead, we generate a ZK Proof proving "this user\'s current KLHS score is greater than 750."'
      },
      {
        heading: 'Oracle Delivery',
        content: 'Via oracle networks (Chainlink Functions), we push the ZK-verified result directly into DeFi protocol smart contracts, triggering lower collateral requirements or higher borrowing limits.'
      }
    ]
  }
];
</script>

<template>
  <div class="w-full text-kura-text">
    <!-- Hero Section -->
    <section class="relative pt-20 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6">
      <div class="max-w-5xl mx-auto">
        <div class="text-center space-y-8">
          <div class="inline-block">
            <div class="px-4 py-2 rounded-full bg-kura-primary/10 border border-kura-primary/20">
              <p class="text-sm font-semibold text-kura-primary">Next-Generation DeFi Risk Management</p>
            </div>
          </div>

          <h1 class="text-5xl md:text-7xl font-black tracking-tight">
            <span class="bg-gradient-to-r from-kura-primary to-kura-secondary bg-clip-text text-transparent">
              Collateral Lies
            </span>
          </h1>

          <h2 class="text-4xl md:text-5xl font-bold text-kura-text-secondary">
            Credit History Doesn't
          </h2>

          <p class="text-lg md:text-xl text-kura-text-secondary max-w-3xl mx-auto leading-relaxed">
            A Zero-Knowledge Credit Oracle Built for the Next Generation of DeFi Protocols. 
            <span class="block mt-4 font-semibold text-kura-primary">Stop over-collateralization. Start intelligent risk assessment.</span>
          </p>

          <div class="pt-4">
            <a href="https://app.kura-finance.com" target="_blank" rel="noopener noreferrer" 
               class="inline-block px-8 py-4 rounded-lg bg-gradient-to-r from-kura-primary to-kura-secondary text-white font-semibold hover:shadow-lg hover:shadow-kura-primary/50 transition-all duration-300">
              Start Building with KLHS
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Problem Section: Why Over-collateralization Isn't Enough -->
    <section class="py-20 md:py-32 px-4 sm:px-6">
      <div class="max-w-5xl mx-auto">
        <div class="mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">
            🛑 Why Over-Collateralization Isn't Enough
          </h2>
          <p class="text-lg text-kura-text-secondary leading-relaxed mb-8">
            DeFi has always relied on "over-collateralization" as the sole safety net. But recent cross-chain bridge exploits and malicious asset minting have proven one thing: when protocols can only read "collateral balance," the system is dangerously fragile.
          </p>
          
          <div class="grid md:grid-cols-2 gap-8 mb-8">
            <div class="p-6 md:p-8 rounded-xl bg-kura-background-light border-2 border-kura-success/20">
              <div class="text-2xl mb-4">✅</div>
              <h3 class="text-xl font-bold mb-3">What Protocols Can't See</h3>
              <p class="text-kura-text-secondary">
                A whale with 3 years of excellent Aave repayment history, bound to real identity
              </p>
            </div>

            <div class="p-6 md:p-8 rounded-xl bg-kura-background-light border-2 border-kura-error/20">
              <div class="text-2xl mb-4">⚠️</div>
              <h3 class="text-xl font-bold mb-3">The Threat They Miss</h3>
              <p class="text-kura-text-secondary">
                A sybil wallet created 5 minutes ago, exploiting a vulnerability to drain the WETH pool
              </p>
            </div>
          </div>

          <div class="p-6 md:p-8 rounded-xl bg-kura-primary/10 border border-kura-primary/20">
            <p class="text-lg font-semibold text-kura-text">
              Without credit mechanisms, DeFi isn't decentralized—it's wasteful capital efficiency and indiscriminate risk exposure. Introducing credit scoring is the only path to give quality users higher LTV while locking out malicious attackers.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose KLHS -->
    <section class="py-20 md:py-32 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">
            🛡️ Why Choose Kura KLHS as Your Risk Defense Line?
          </h2>
          <p class="text-lg text-kura-text-secondary max-w-3xl mx-auto">
            Kura doesn't build a single-dimension on-chain score. We introduce Web3's first "Hybrid Finance Credit Oracle"—exclusive defensive data for DeFi protocols.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="(item, index) in whyKLHS" :key="index" 
               class="p-8 rounded-xl bg-kura-background-light border border-kura-border hover:border-kura-primary/50 transition-all duration-300">
            <div class="text-5xl mb-6">{{ item.icon }}</div>
            <h3 class="text-2xl font-bold mb-4">{{ item.title }}</h3>
            <p class="text-kura-text-secondary leading-relaxed">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Privacy & Trust Section -->
    <section class="py-20 md:py-32 px-4 sm:px-6 bg-kura-background-light">
      <div class="max-w-5xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">
            🤫 Privacy and Credit: A Perfect Balance
          </h2>
          <p class="text-lg text-kura-text-secondary mb-8">
            Building credit doesn't mean surrendering privacy. We understand Web3 users' absolute bottom line on data protection.
          </p>
          <p class="text-lg text-kura-text leading-relaxed mb-8">
            Kura uses cutting-edge <span class="font-semibold">Zero-Knowledge Proofs (ZK) and zkTLS technology</span>. When users bind fiat accounts and multiple wallets through Kura App to accumulate KLHS scores:
          </p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <div v-for="(point, index) in privacyPoints" :key="index" 
               class="p-8 rounded-xl bg-white border border-kura-border">
            <h3 class="text-2xl font-bold mb-4">{{ point.title }}</h3>
            <p class="text-kura-text-secondary leading-relaxed">
              {{ point.content }}
            </p>
          </div>
        </div>

        <div class="mt-12 p-8 rounded-xl bg-gradient-to-r from-kura-primary/10 to-kura-secondary/10 border border-kura-primary/20">
          <p class="text-lg text-kura-text leading-relaxed">
            <span class="font-bold text-kura-primary">This is a win-win:</span> Protocols get institutional-grade defense nets, while users unlock higher capital leverage while maintaining absolute anonymity with their excellent credit.
          </p>
        </div>
      </div>
    </section>

    <!-- Technical Deep Dive -->
    <section class="py-20 md:py-32 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto">
        <div v-for="(layer, index) in layers" :key="index" class="mb-20 md:mb-32 last:mb-0">
          <!-- Layer Header -->
          <div class="flex items-start gap-4 mb-12">
            <div class="text-5xl flex-shrink-0">{{ layer.icon }}</div>
            <div class="flex-1">
              <p class="text-sm font-semibold text-kura-primary uppercase tracking-wider mb-2">
                {{ layer.subtitle }}
              </p>
              <h2 class="text-4xl md:text-5xl font-bold mb-4">
                {{ layer.title }}
              </h2>
              <p class="text-lg text-kura-text-secondary">
                {{ layer.description }}
              </p>
            </div>
          </div>

          <!-- Layer Features -->
          <div class="space-y-6 ml-0 md:ml-20">
            <div v-for="(feature, featureIndex) in layer.features" :key="featureIndex" 
                 class="p-6 md:p-8 rounded-xl bg-kura-background-light border border-kura-border hover:border-kura-primary/30 transition-colors duration-300">
              <h3 class="text-xl md:text-2xl font-bold mb-3 text-kura-primary">
                {{ feature.heading }}
              </h3>
              <p class="text-base md:text-lg text-kura-text-secondary leading-relaxed">
                {{ feature.content }}
              </p>
            </div>
          </div>

          <!-- Divider -->
          <div v-if="index < layers.length - 1" class="mt-20 md:mt-32 h-px bg-gradient-to-r from-transparent via-kura-border to-transparent" />
        </div>
      </div>
    </section>

    <!-- Integration CTA Section -->
    <section class="py-20 md:py-32 px-4 sm:px-6">
      <div class="max-w-4xl mx-auto">
        <div class="text-center space-y-8 p-8 md:p-12 rounded-2xl bg-gradient-to-r from-kura-primary/10 to-kura-secondary/10 border border-kura-primary/20">
          <h2 class="text-4xl md:text-5xl font-bold">
            🚀 Integrate Kura API
          </h2>
          <p class="text-lg md:text-xl text-kura-text-secondary leading-relaxed">
            Redefine your protocol's capital efficiency. Stop letting bad coins drive out good ones. Integrate Kura Liquidity Health Score into your smart contracts and offer better borrowing rates to loyal users while minimizing protocol bad debt.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a href="https://docs.kura-finance.com" target="_blank" rel="noopener noreferrer" 
               class="px-8 py-4 rounded-lg bg-gradient-to-r from-kura-primary to-kura-secondary text-white font-semibold hover:shadow-lg hover:shadow-kura-primary/50 transition-all duration-300">
              View Developer Docs
            </a>
            <a href="mailto:hello@kura-finance.com" 
               class="px-8 py-4 rounded-lg border-2 border-kura-accent text-kura-accent font-semibold hover:bg-kura-accent/10 transition-colors duration-300">
              Schedule PoC Demo
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-20 md:py-32 px-4 sm:px-6">
      <div class="max-w-3xl mx-auto text-center space-y-8">
        <div class="space-y-4">
          <h2 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-kura-primary to-kura-secondary bg-clip-text text-transparent">
            Ready to Transform Your Protocol's Risk Management?
          </h2>
          <p class="text-lg text-kura-text-secondary">
            Start building with KLHS today. Give your users better rates. Protect your protocol.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a href="https://app.kura-finance.com" target="_blank" rel="noopener noreferrer" 
             class="px-8 py-4 rounded-lg bg-gradient-to-r from-kura-primary to-kura-secondary text-white font-semibold hover:shadow-lg hover:shadow-kura-primary/50 transition-all duration-300">
            Launch Dashboard
          </a>
          <NuxtLink to="/docs" class="px-8 py-4 rounded-lg border-2 border-kura-accent text-kura-accent font-semibold hover:bg-kura-accent/10 transition-colors duration-300">
            Learn More
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
