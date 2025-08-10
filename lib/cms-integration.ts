// CMS Integration Layer - Ready for Sanity, Contentful, or custom backend

export interface CMSPhoto {
  id: string
  url: string
  alt: string
  title?: string
  description?: string
  metadata: {
    date?: string
    location?: string
    tags?: string[]
    featured?: boolean
    order?: number
    dimensions?: {
      width: number
      height: number
    }
    fileSize?: number
  }
  category: string
  uploadedAt: string
}

export interface CMSGalleryCategory {
  id: string
  title: string
  description: string
  heroImage: string
  slug: string
  photos: CMSPhoto[]
  totalPhotos: number
}

// Mock CMS functions - replace with actual CMS integration
export class CMSService {
  // Fetch photos for a specific category with pagination
  static async getPhotosByCategory(
    category: string, 
    page: number = 1, 
    limit: number = 12
  ): Promise<{ photos: CMSPhoto[], hasMore: boolean, total: number }> {
    // This would connect to your actual CMS
    // Example for Sanity:
    // const query = `*[_type == "photo" && category == $category] | order(order asc, uploadedAt desc) [$start...$end]`
    // const photos = await sanityClient.fetch(query, { category, start: (page - 1) * limit, end: page * limit })
    
    return {
      photos: [],
      hasMore: false,
      total: 0
    }
  }

  // Upload new photo
  static async uploadPhoto(
    file: File, 
    metadata: Partial<CMSPhoto>
  ): Promise<CMSPhoto> {
    // Handle file upload to cloud storage (Cloudinary, AWS S3, etc.)
    // Save metadata to CMS
    throw new Error('CMS integration not implemented')
  }

  // Update photo metadata
  static async updatePhoto(
    photoId: string, 
    updates: Partial<CMSPhoto>
  ): Promise<CMSPhoto> {
    // Update photo in CMS
    throw new Error('CMS integration not implemented')
  }

  // Delete photo
  static async deletePhoto(photoId: string): Promise<void> {
    // Delete from CMS and cloud storage
    throw new Error('CMS integration not implemented')
  }

  // Get all categories
  static async getCategories(): Promise<CMSGalleryCategory[]> {
    // Fetch categories from CMS
    return []
  }

  // Bulk operations
  static async bulkUpdatePhotos(
    photoIds: string[], 
    updates: Partial<CMSPhoto>
  ): Promise<void> {
    // Bulk update photos in CMS
    throw new Error('CMS integration not implemented')
  }
}

// Sanity.io integration example
export const sanityConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
}

// Contentful integration example
export const contentfulConfig = {
  spaceId: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master',
}
