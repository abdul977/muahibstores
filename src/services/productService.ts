import { supabase } from '../lib/supabase';
import { Product, ProductMedia, EnhancedProductMedia, MediaUtils } from '../types/Product';

// Database row type (matches Supabase schema)
interface ProductRow {
  id: string;
  original_id: string | null;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  image_urls: string[] | null;
  video_urls: string[] | null;
  ordered_media: any[] | null; // New enhanced media structure
  features: string[];
  description: string | null;
  whatsapp_link: string;
  category: string;
  is_new: boolean;
  is_featured: boolean;
  is_hidden: boolean;
  created_at: string;
  updated_at: string;
}

// Convert database row to frontend Product type
const mapRowToProduct = (row: ProductRow): Product => {
  // Create legacy media object from old fields for backward compatibility
  const legacyMedia: ProductMedia = {
    images: row.image_urls && row.image_urls.length > 0
      ? row.image_urls
      : row.image_url
        ? [row.image_url]
        : [],
    videos: row.video_urls || []
  };

  // Create enhanced media object from ordered_media field
  let enhancedMedia: EnhancedProductMedia | undefined;
  if (row.ordered_media && Array.isArray(row.ordered_media) && row.ordered_media.length > 0) {
    enhancedMedia = {
      items: row.ordered_media.map((item: any) => ({
        id: item.id || MediaUtils.generateMediaId(),
        type: item.type || 'image',
        url: item.url || '',
        order: item.order || 0,
        title: item.title,
        thumbnail: item.thumbnail
      })).sort((a: any, b: any) => a.order - b.order),
      // Keep legacy fields for backward compatibility
      images: legacyMedia.images,
      videos: legacyMedia.videos
    };
  } else if (legacyMedia.images.length > 0 || legacyMedia.videos.length > 0) {
    // Convert legacy media to enhanced format
    enhancedMedia = MediaUtils.legacyToEnhanced(legacyMedia);
  }

  return {
    id: row.original_id || row.id,
    name: row.name,
    price: row.price,
    originalPrice: row.original_price || undefined,
    image: enhancedMedia?.items.find(item => item.type === 'image')?.url || legacyMedia.images[0] || '',
    media: legacyMedia, // Keep for backward compatibility
    enhancedMedia,
    features: row.features,
    description: row.description || undefined,
    whatsappLink: row.whatsapp_link,
    category: row.category,
    isNew: row.is_new,
    isFeatured: row.is_featured,
    isHidden: row.is_hidden,
  };
};

// Convert frontend Product to database insert format
const mapProductToInsert = (product: Omit<Product, 'id'> & { id?: string }) => {
  // Determine which media structure to use
  const enhancedMedia = product.enhancedMedia;
  const legacyMedia = product.media;

  // Get legacy arrays for backward compatibility
  let images: string[] = [];
  let videos: string[] = [];

  if (enhancedMedia?.items && enhancedMedia.items.length > 0) {
    // Use enhanced media structure
    images = enhancedMedia.items
      .filter(item => item.type === 'image')
      .sort((a, b) => a.order - b.order)
      .map(item => item.url);

    videos = enhancedMedia.items
      .filter(item => item.type === 'video')
      .sort((a, b) => a.order - b.order)
      .map(item => item.url);
  } else if (legacyMedia) {
    // Fallback to legacy media
    images = legacyMedia.images || [];
    videos = legacyMedia.videos || [];
  } else if (product.image) {
    // Fallback to single image field
    images = [product.image];
  }

  return {
    original_id: product.id,
    name: product.name,
    price: product.price,
    original_price: product.originalPrice || null,
    image_url: images[0] || null, // First image for backward compatibility
    image_urls: images,
    video_urls: videos,
    ordered_media: enhancedMedia?.items || null,
    features: product.features,
    description: product.description || null,
    whatsapp_link: product.whatsappLink,
    category: product.category,
    is_new: product.isNew || false,
    is_featured: product.isFeatured || false,
    is_hidden: product.isHidden || false,
  };
};

export const productService = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch products: ${error.message}`);
    }

    return data.map(mapRowToProduct);
  },

  // Get product by ID (using original_id)
  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('original_id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      throw new Error(`Failed to fetch product: ${error.message}`);
    }

    return mapRowToProduct(data);
  },

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch products by category: ${error.message}`);
    }

    return data.map(mapRowToProduct);
  },

  // Get featured products
  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch featured products: ${error.message}`);
    }

    return data.map(mapRowToProduct);
  },

  // Create new product
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const insertData = mapProductToInsert(product);
    
    const { data, error } = await supabase
      .from('products')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }

    return mapRowToProduct(data);
  },

  // Update product
  async updateProduct(id: string, updates: Partial<Omit<Product, 'id'>>): Promise<Product> {
    const updateData = mapProductToInsert({ id, ...updates } as Product);
    delete updateData.original_id; // Don't update the original_id
    
    const { data, error } = await supabase
      .from('products')
      .update(updateData)
      .eq('original_id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }

    return mapRowToProduct(data);
  },

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('original_id', id);

    if (error) {
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  },

  // Search products
  async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%, features.cs.{${query}}`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to search products: ${error.message}`);
    }

    return data.map(mapRowToProduct);
  },

  // Get all categories
  async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('products')
      .select('category')
      .order('category');

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    const categories = [...new Set(data.map(item => item.category))];
    return categories;
  },

  // Get only visible products (for public pages)
  async getVisibleProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch visible products: ${error.message}`);
    }

    return data.map(mapRowToProduct);
  },

  // Get visible products by category
  async getVisibleProductsByCategory(category: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch visible products by category: ${error.message}`);
    }

    return data.map(mapRowToProduct);
  },

  // Toggle product visibility
  async toggleProductVisibility(id: string): Promise<Product> {
    // First get the current product to know its current state
    const currentProduct = await this.getProductById(id);
    if (!currentProduct) {
      throw new Error('Product not found');
    }

    const newHiddenState = !currentProduct.isHidden;

    const { data, error } = await supabase
      .from('products')
      .update({ is_hidden: newHiddenState })
      .eq('original_id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to toggle product visibility: ${error.message}`);
    }

    return mapRowToProduct(data);
  },

  // Bulk toggle visibility for multiple products
  async bulkToggleVisibility(ids: string[], isHidden: boolean): Promise<void> {
    const { error } = await supabase
      .from('products')
      .update({ is_hidden: isHidden })
      .in('original_id', ids);

    if (error) {
      throw new Error(`Failed to bulk toggle visibility: ${error.message}`);
    }
  },
};
