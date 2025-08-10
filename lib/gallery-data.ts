// Enhanced photo interface with metadata
export interface PhotoMetadata {
  id: string
  src: string
  alt: string
  title?: string
  description?: string
  date?: string
  location?: string
  tags?: string[]
  featured?: boolean
  order?: number
  uploadedAt: string
  fileSize?: number
  dimensions?: {
    width: number
    height: number
  }
}

export interface GalleryCategory {
  id: string
  title: string
  description: string
  heroImage: string
  photos: PhotoMetadata[]
  totalPhotos: number
}

// This will be replaced by CMS data in production
export const galleryData: Record<string, GalleryCategory> = {
  weddings: {
    id: 'weddings',
    title: 'Weddings',
    description: 'Capturing the magic of your special day with timeless elegance and authentic emotion.',
    heroImage: '/wedding-dance-sunset.png',
    totalPhotos: 0,
    photos: [
      {
        id: 'w1',
        src: '/elegant-bride-portrait.png',
        alt: 'Elegant bride portrait',
        title: 'Bridal Portrait',
        description: 'A stunning bridal portrait capturing the elegance and beauty of the bride',
        date: '2024-06-15',
        location: 'South Jersey',
        tags: ['bride', 'portrait', 'elegant'],
        featured: true,
        order: 1,
        uploadedAt: '2024-01-15T10:00:00Z',
        dimensions: { width: 800, height: 1200 }
      },
      {
        id: 'w2',
        src: '/wedding-dance-sunset.png',
        alt: 'Wedding dance at sunset',
        title: 'First Dance',
        description: 'Romantic first dance captured during golden hour',
        date: '2024-06-15',
        location: 'South Jersey',
        tags: ['dance', 'sunset', 'romantic'],
        featured: false,
        order: 2,
        uploadedAt: '2024-01-15T10:05:00Z',
        dimensions: { width: 1200, height: 800 }
      }
    ]
  },
  engagement: {
    id: 'engagement',
    title: 'Engagement',
    description: 'Celebrating your love story with romantic and playful engagement photography.',
    heroImage: '/romantic-engagement-couple.png',
    totalPhotos: 0,
    photos: [
      {
        id: 'e1',
        src: '/romantic-engagement-couple.png',
        alt: 'Romantic engagement couple',
        title: 'Romantic Moment',
        description: 'A tender moment between the engaged couple',
        date: '2024-05-20',
        location: 'Princeton, NJ',
        tags: ['couple', 'romantic', 'engagement'],
        featured: true,
        order: 1,
        uploadedAt: '2024-01-10T14:00:00Z',
        dimensions: { width: 1200, height: 800 }
      }
    ]
  },
  maternity: {
    id: 'maternity',
    title: 'Maternity',
    description: 'Documenting the beautiful journey of motherhood with grace and artistry.',
    heroImage: '/beautiful-maternity-photo.png',
    totalPhotos: 0,
    photos: [
      {
        id: 'm1',
        src: '/beautiful-maternity-photo.png',
        alt: 'Beautiful maternity photo',
        title: 'Expecting Mother',
        description: 'Beautiful maternity portrait celebrating motherhood',
        date: '2024-04-10',
        location: 'Camden, NJ',
        tags: ['maternity', 'portrait', 'motherhood'],
        featured: true,
        order: 1,
        uploadedAt: '2024-01-05T16:00:00Z',
        dimensions: { width: 800, height: 1200 }
      }
    ]
  },
  minis: {
    id: 'minis',
    title: 'Mini Sessions',
    description: 'Quick and beautiful photography sessions perfect for families and couples.',
    heroImage: '/family-mini-session.png',
    totalPhotos: 0,
    photos: []
  },
  'holiday-minis': {
    id: 'holiday-minis',
    title: 'Holiday Mini Sessions',
    description: 'Festive and magical holiday photography sessions for the whole family.',
    heroImage: '/holiday-family-session.png',
    totalPhotos: 0,
    photos: []
  }
}
