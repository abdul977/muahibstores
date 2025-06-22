import { supabase } from '../lib/supabase';
import { MediaUtils } from '../types/Product';

export interface UploadResult {
  url: string;
  path: string;
}

export interface VideoUploadResult extends UploadResult {
  thumbnail?: string;
}

export interface YouTubeValidationResult {
  valid: boolean;
  videoId?: string;
  thumbnailUrl?: string;
  embedUrl?: string;
  error?: string;
}

export const imageService = {
  // Upload image to Supabase Storage
  async uploadImage(file: File, folder: string = 'products'): Promise<UploadResult> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      return {
        url: urlData.publicUrl,
        path: data.path
      };
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Delete image from Supabase Storage
  async deleteImage(url: string): Promise<void> {
    try {
      const path = this.extractPathFromUrl(url);
      if (!path) {
        console.warn('Could not extract path from URL, skipping deletion:', url);
        return; // Don't throw error, just skip deletion
      }

      const { error } = await supabase.storage
        .from('product-images')
        .remove([path]);

      if (error) {
        console.warn('Storage deletion failed:', error.message);
        // Don't throw error for storage deletion failures
        return;
      }
    } catch (error) {
      console.warn('Image delete error:', error);
      // Don't throw error, just log warning
    }
  },

  // Delete video from Supabase Storage
  async deleteVideo(url: string): Promise<void> {
    try {
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/videos\/(.+)$/);
      if (!pathMatch) {
        console.warn('Could not extract path from video URL, skipping deletion:', url);
        return; // Don't throw error, just skip deletion
      }

      const { error } = await supabase.storage
        .from('videos')
        .remove([pathMatch[1]]);

      if (error) {
        console.warn('Video storage deletion failed:', error.message);
        // Don't throw error for storage deletion failures
        return;
      }
    } catch (error) {
      console.warn('Video delete error:', error);
      // Don't throw error, just log warning
    }
  },

  // Get public URL for an image
  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(path);
    
    return data.publicUrl;
  },

  // Validate image file
  validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size too large. Please upload images smaller than 5MB.'
      };
    }

    return { valid: true };
  },

  // Upload video to Supabase Storage
  async uploadVideo(file: File, folder: string = 'products'): Promise<VideoUploadResult> {
    try {
      // Validate video file
      const validation = this.validateVideoFile(file);
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid video file');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw new Error(`Video upload failed: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('videos')
        .getPublicUrl(data.path);

      return {
        url: urlData.publicUrl,
        path: data.path
      };
    } catch (error) {
      console.error('Video upload error:', error);
      throw new Error(`Failed to upload video: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Validate video file
  validateVideoFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 50 * 1024 * 1024; // 50MB
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid video type. Please upload MP4, WebM, OGG, AVI, or MOV videos.'
      };
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'Video file too large. Please upload videos smaller than 50MB.'
      };
    }

    return { valid: true };
  },

  // Validate and process YouTube URL
  validateYouTubeUrl(url: string): YouTubeValidationResult {
    try {
      if (!url || typeof url !== 'string') {
        return {
          valid: false,
          error: 'Please provide a valid YouTube URL'
        };
      }

      const videoId = MediaUtils.getYouTubeVideoId(url);
      if (!videoId) {
        return {
          valid: false,
          error: 'Invalid YouTube URL. Please use a valid YouTube video link.'
        };
      }

      const thumbnailUrl = MediaUtils.getYouTubeThumbnail(url);
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;

      return {
        valid: true,
        videoId,
        thumbnailUrl,
        embedUrl
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Failed to validate YouTube URL'
      };
    }
  },

  // Extract path from Supabase Storage URL
  extractPathFromUrl(url: string): string | null {
    try {
      // Handle both full URLs and relative paths
      if (!url) return null;

      // If it's already a path (not a full URL), return as is
      if (!url.startsWith('http')) {
        return url.startsWith('products/') ? url : `products/${url}`;
      }

      const urlObj = new URL(url);

      // Try different URL patterns that Supabase might use
      const patterns = [
        /\/storage\/v1\/object\/public\/product-images\/(.+)$/,
        /\/object\/public\/product-images\/(.+)$/,
        /\/product-images\/(.+)$/
      ];

      for (const pattern of patterns) {
        const match = urlObj.pathname.match(pattern);
        if (match) {
          return match[1];
        }
      }

      return null;
    } catch {
      return null;
    }
  }
};
