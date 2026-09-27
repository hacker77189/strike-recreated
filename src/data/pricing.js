// Membership pricing — exact values, gradients and borders from the source spec.
// Durations drive the dynamic price selector; index 2 (4 Years) is the default.

export const PLANS = [
  {
    id: 'plus',
    theme: 'silver',
    name: 'Strike Plus',
    badge: null,
    // Banner shown at the top of the card. Served from /public.
    image: 'public/membership/plus.png',
    desc: 'All existing Strike courses with access for your selected duration.',
    // exact card styling
    cardGradient: 'linear-gradient(160deg, rgb(20,20,20) 0%, rgb(10,10,10) 100%)',
    cardBorder: 'rgba(255,255,255,0.1)',
    defaultDuration: 2,
    durations: [
      { label: '2 Years', price: '8,999', was: '14,999', off: '40%' },
      { label: '3 Years', price: '10,499', was: '17,499', off: '40%' },
      { label: '4 Years', price: '12,499', was: '19,999', off: '38%', popular: true },
    ],
    features: [
      'All current courses included',
      'HD recordings',
      'Live class access during plan',
      'Notes',
      'Resume Review',
      'Certificates',
      'System Design Platform',
      'DSA Platform',
      'Coder Arena Platform',
    ],
    cta: 'Get Strike Plus',
  },
  {
    id: 'ultra',
    theme: 'gold',
    name: 'Strike Ultra',
    badge: 'BEST VALUE',
    image: 'public/membership/ultra.png',
    desc: 'This plan includes all existing courses, plus upcoming courses for your selected duration.',
    cardGradient: 'linear-gradient(160deg, rgb(28,18,0) 0%, rgb(18,13,0) 50%, rgb(10,8,0) 100%)',
    cardBorder: 'rgba(212,160,23,0.3)',
    defaultDuration: 2,
    durations: [
      { label: '2 Years', price: '9,999', was: '18,999', off: '47%' },
      { label: '3 Years', price: '11,499', was: '21,999', off: '48%' },
      { label: '4 Years', price: '13,499', was: '24,999', off: '46%', popular: true },
    ],
    features: [
      'Everything in Strike Plus',
      'Upcoming batches included',
      'Coder Arena Platform',
      'Certificates',
      'Resume Review',
      'Notes',
      'System Design Platform',
      'DSA platform',
    ],
    cta: 'Get Strike Ultra',
  },
]
