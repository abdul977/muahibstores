import { supabase } from '../lib/supabase';

export interface UploadResult {
  url: string;
  path: string;
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
  async deleteImage(path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('product-images')
        .remove([path]);

      if (error) {
        throw new Error(`Delete failed: ${error.message}`);
      }
    } catch (error) {
      console.error('Image delete error:', error);
      throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

  // Extract path from Supabase Storage URL
  extractPathFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/product-images\/(.+)$/);
      return pathMatch ? pathMatch[1] : null;
    } catch {
      return null;
    }
  }
};
