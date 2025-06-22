// Enhanced media item interface for unlimited media with ordering
export interface MediaItem {
  id: string; // Unique identifier for the media item
  type: 'image' | 'video' | 'youtube'; // Type of media
  url: string; // URL or path to the media
  order: number; // Order position for display
  title?: string; // Optional title for the media item
  thumbnail?: string; // Optional thumbnail URL (useful for videos)
}

// Legacy interface for backward compatibility
export interface ProductMedia {
  images: string[]; // Array of up to 3 image URLs (legacy)
  videos: string[]; // Array of video URLs (legacy)
}

// Enhanced media interface for unlimited media
export interface EnhancedProductMedia {
  items: MediaItem[]; // Unlimited ordered media items
  // Legacy fields for backward compatibility
  images?: string[];
  videos?: string[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string; // Keep for backward compatibility - will be first image
  media?: ProductMedia; // Legacy media structure for backward compatibility
  enhancedMedia?: EnhancedProductMedia; // New enhanced media structure with unlimited items
  features: string[];
  description?: string; // Product description for WhatsApp messages
  whatsappLink: string;
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isHidden?: boolean; // New field to hide products (out of stock, etc.)
}

// Extended type for admin operations that includes database UUID
export interface ProductWithUUID extends Product {
  uuid?: string; // Database UUID for internal operations
}

// Utility functions for media handling
export const MediaUtils = {
  // Generate unique ID for media items
  generateMediaId: (): string => {
    return `media_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  },

  // Convert legacy media to enhanced media structure
  legacyToEnhanced: (media?: ProductMedia): EnhancedProductMedia => {
    const items: MediaItem[] = [];
    let order = 0;

    // Add images
    if (media?.images) {
      media.images.forEach((url) => {
        items.push({
          id: MediaUtils.generateMediaId(),
          type: 'image',
          url,
          order: order++
        });
      });
    }

    // Add videos
    if (media?.videos) {
      media.videos.forEach((url) => {
        items.push({
          id: MediaUtils.generateMediaId(),
          type: 'video',
          url,
          order: order++
        });
      });
    }

    return {
      items: items.sort((a, b) => a.order - b.order),
      images: media?.images || [],
      videos: media?.videos || []
    };
  },

  // Convert enhanced media to legacy format for backward compatibility
  enhancedToLegacy: (enhancedMedia?: EnhancedProductMedia): ProductMedia => {
    if (!enhancedMedia) {
      return { images: [], videos: [] };
    }

    const images = enhancedMedia.items
      .filter(item => item.type === 'image')
      .sort((a, b) => a.order - b.order)
      .map(item => item.url);

    const videos = enhancedMedia.items
      .filter(item => item.type === 'video')
      .sort((a, b) => a.order - b.order)
      .map(item => item.url);

    return { images, videos };
  },

  // Get all media items in order
  getAllMediaInOrder: (product: Product): MediaItem[] => {
    if (product.enhancedMedia?.items) {
      return [...product.enhancedMedia.items].sort((a, b) => a.order - b.order);
    }

    // Fallback to legacy media
    const legacyMedia = MediaUtils.legacyToEnhanced(product.media);
    return legacyMedia.items;
  },

  // Validate YouTube URL
  isValidYouTubeUrl: (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    return youtubeRegex.test(url);
  },

  // Extract YouTube video ID
  getYouTubeVideoId: (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  },

  // Get YouTube thumbnail URL
  getYouTubeThumbnail: (url: string): string => {
    const videoId = MediaUtils.getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '';
  }
};