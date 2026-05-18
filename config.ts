// config.ts - PredictEarn Configuration

export const APP_CONFIG = {
    // Brand
    name: 'PredictEarn',
    domain: 'predictearn.xyz',
    tagline: 'Predict. Bet. Earn.',
    description: 'The first on-chain prediction market on Celo. Bet on sports, entertainment, crypto & more.',
    
    // Colors
    colors: {
      acid: '#C8FF00',        // Primary accent
      ink: '#060809',         // Dark background
      card: '#131619',        // Card background
      red: '#FF3B30',         // Live indicator
      text: 'rgba(255,255,255,0.88)',
      muted: 'rgba(239, 236, 236, 0.42)',
      line: 'rgba(241, 240, 240, 0.06)',
      line2: 'rgba(255,255,255,0.11)',
    },
  
    // Fonts
    fonts: {
      headline: "'Bebas Neue', sans-serif",
      body: "'DM Sans', sans-serif",
      mono: "'Space Mono', monospace",
    },
  
    // Network
    network: {
      name: 'Celo',
      chainId: 42220,
      currency: 'cUSD',
      rpcUrl: 'https://forno.celo.org',
    },
  
    // Pages
    pages: {
      waitlist: '/',
      play: '/play',
      leaderboard: '/leaderboard',
    },
  
    // Features
    features: [
      { icon: '⚡', name: 'Lightning Fast', sub: 'Instant settlement' },
      { icon: '🏆', name: 'Leaderboard', sub: 'Climb ranks' },
      { icon: '💵', name: 'cUSD Payouts', sub: 'Instant claims' },
      { icon: '🔒', name: 'Non-Custodial', sub: 'Your keys' },
      { icon: '🌍', name: '100+ Markets', sub: 'Global events' },
      { icon: '📊', name: 'Live Odds', sub: 'Real-time' },
    ],
  
    // Categories
    categories: [
      { id: 'sports', label: '⚽ Sports' },
      { id: 'entertainment', label: '🎬 Entertainment' },
      { id: 'crypto', label: '₿ Crypto' },
      { id: 'other', label: '🎯 Other' },
    ],
  
    // Launch
    launchDate: 'Q2 2025',
    status: 'Waitlist Open',
  
    // Social
    socials: {
      twitter: 'https://twitter.com/predictearn',
      discord: 'https://discord.gg/predictearn',
      docs: 'https://docs.predictearn.xyz',
    },
  }
  
  // Metadata for Next.js
  export const METADATA = {
    title: 'PredictEarn - Decentralized Prediction Markets',
    description: 'Bet on sports, entertainment, crypto & more. Real-time odds, instant payouts on Celo.',
    keywords: ['prediction', 'betting', 'crypto', 'celo', 'defi', 'sports', 'odds'],
    authors: [{ name: 'PredictEarn Team' }],
    creator: 'PredictEarn',
    openGraph: {
      type: 'website',
      url: 'https://predictearn.xyz',
      title: 'PredictEarn - Decentralized Prediction Markets',
      description: 'Bet on sports, entertainment, crypto & more. Real-time odds, instant payouts on Celo.',
      images: [
        {
          url: 'https://predictearn.xyz/og-image.png',
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PredictEarn',
      description: 'Decentralized Prediction Markets',
      images: ['https://predictearn.xyz/twitter-image.png'],
    },
  }
  
  // Event data structure
  export interface Event {
    id: number
    title: string
    league: string
    odds: number[]
    time: string
    live: boolean
  }
  
  // Bet structure
  export interface Bet {
    event: Event
    odds: number
    amount: number
    wallet: string
    timestamp: number
    potentialWin: number
  }
  
  // User/Referral structure
  export interface User {
    email: string
    refCode: string
    createdAt: number
    referredBy?: string
    referralCount: number
    position: number
  }
  
  export default APP_CONFIG