export interface RetouchService {
  id: string
  name: string
  description: string
  shortDescription: string
  price: number
  turnaroundTime: string
  features: string[]
  popular?: boolean
  revisions: string
  category: 'basic' | 'standard' | 'premium' | 'custom'
}

export interface RetouchPortfolioItem {
  id: string
  title: string
  beforeImage: string
  afterImage: string
  category: string
  description: string
  techniques: string[]
}

export const retouchServices: RetouchService[] = [
  {
    id: 'basic-retouch',
    name: 'Basic Retouching',
    description: 'Essential retouching services including exposure correction, color grading, and basic skin smoothing. Perfect for photographers who need quick, professional results.',
    shortDescription: 'Essential retouching with color correction and basic skin smoothing',
    price: 15,
    revisions: '2',
    turnaroundTime: '24-48 hours',
    category: 'basic',
    features: [
      'Exposure & contrast adjustment',
      'Color correction & grading',
      'Basic skin smoothing',
      'Blemish removal',
      'Teeth whitening',
      'Eye enhancement',
      'Background cleanup'
    ]
  },
  {
    id: 'standard-retouch',
    name: 'Standard Retouching',
    description: 'Comprehensive retouching including advanced skin work, body contouring, and detailed enhancement. Our most popular package for wedding and portrait photographers.',
    shortDescription: 'Comprehensive retouching with advanced skin work and body contouring',
    price: 25,
    revisions: '3',
    turnaroundTime: '2-3 days',
    category: 'standard',
    popular: true,
    features: [
      'Everything in Basic package',
      'Advanced skin retouching',
      'Body contouring & slimming',
      'Hair enhancement',
      'Clothing adjustments',
      'Advanced color grading',
      'Selective lighting adjustments',
      'Background replacement (simple)'
    ]
  },
  {
    id: 'premium-retouch',
    name: 'Premium Retouching',
    description: 'High-end retouching with artistic enhancement, complex compositing, and magazine-quality results. Perfect for commercial and fashion photographers.',
    shortDescription: 'High-end retouching with artistic enhancement and compositing',
    price: 45,
    revisions: '5',
    turnaroundTime: '3-5 days',
    category: 'premium',
    features: [
      'Everything in Standard package',
      'Frequency separation technique',
      'Advanced compositing',
      'Complex background replacement',
      'Artistic color grading',
      'Dodge & burn enhancement',
      'Advanced body sculpting',
      'Hair replacement/enhancement',
      'Makeup enhancement',
      'Jewelry & accessory enhancement'
    ]
  },
  {
    id: 'custom-retouch',
    name: 'Custom Retouching',
    description: 'Tailored retouching solutions for unique projects. We work closely with you to achieve your specific vision and requirements.',
    shortDescription: 'Tailored retouching solutions for unique projects',
    price: 0, // Custom pricing
    revisions: 'Unlimited',
    turnaroundTime: 'Varies',
    category: 'custom',
    features: [
      'Custom consultation',
      'Unlimited revisions',
      'Complex compositing',
      'Creative manipulation',
      'Brand-specific styling',
      'Bulk pricing available',
      'Rush delivery options',
      'Dedicated project manager'
    ]
  }
]

export const retouchPortfolio: RetouchPortfolioItem[] = [
  {
    id: 'wedding-bride-1',
    title: 'Bridal Portrait Enhancement',
    beforeImage: '/home/elegant-bride-portrait.png',
    afterImage: '/home/elegant-bride-portrait.png',
    category: 'Wedding',
    description: 'Complete bridal portrait retouching including skin perfection, dress enhancement, and background cleanup.',
    techniques: ['Frequency Separation', 'Color Grading', 'Background Cleanup', 'Dress Enhancement']
  },
  {
    id: 'engagement-couple-1',
    title: 'Engagement Session Retouch',
    beforeImage: '/home/romantic-engagement-couple.jpg',
    afterImage: '/home/romantic-engagement-couple.jpg',
    category: 'Engagement',
    description: 'Natural skin retouching and color enhancement while maintaining authentic look.',
    techniques: ['Natural Skin Retouching', 'Color Correction', 'Eye Enhancement', 'Teeth Whitening']
  },
  {
    id: 'maternity-portrait-1',
    title: 'Maternity Portrait Perfection',
    beforeImage: '/home/beautiful-maternity-photo.png',
    afterImage: '/home/beautiful-maternity-photo.png',
    category: 'Maternity',
    description: 'Gentle retouching emphasizing the beauty of pregnancy with artistic color grading.',
    techniques: ['Gentle Skin Work', 'Body Contouring', 'Artistic Color Grading', 'Background Enhancement']
  },
  {
    id: 'fashion-portrait-1',
    title: 'Fashion Portrait Retouch',
    beforeImage: '/retouch/fashion-before.jpg',
    afterImage: '/retouch/fashion-after.jpg',
    category: 'Fashion',
    description: 'Sample before/after demonstration: skin refinement, color grading, and detail enhancement while keeping natural skin texture. Drag the slider to compare.',
    techniques: ['Frequency Separation', 'Color Grading', 'Skin Refinement', 'Detail Enhancement']
  }
]
