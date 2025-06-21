import { supabase } from '../lib/supabase';
import { Product, ProductMedia } from '../types/Product';

// Database row type (matches Supabase schema)
interface ProductRow {
  id: string;
  original_id: string | null;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  image_urls: string[] | null;
  video_url: string | null;
  features: string[];
  whatsapp_link: string;
  category: string;
  is_new: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// Convert database row to frontend Product type
const mapRowToProduct = (row: ProductRow): Product => {
  // Create media object from new fields, fallback to legacy image field
  const media: ProductMedia = {
    images: row.image_urls && row.image_urls.length > 0
      ? row.image_urls
      : row.image_url
        ? [row.image_url]
        : [],
    video: row.video_url || undefined
  };

  return {
    id: row.original_id || row.id,
    name: row.name,
    price: row.price,
    originalPrice: row.original_price || undefined,
    image: media.images[0] || '', // First image for backward compatibility
    media,
    features: row.features,
    whatsappLink: row.whatsapp_link,
    category: row.category,
    isNew: row.is_new,
    isFeatured: row.is_featured,
  };
};

// Convert frontend Product to database insert format
const mapProductToInsert = (product: Omit<Product, 'id'> & { id?: string }) => ({
  original_id: product.id,
  name: product.name,
  price: product.price,
  original_price: product.originalPrice || null,
  image_url: product.media?.images[0] || product.image || null, // Use first image from media or fallback
  image_urls: product.media?.images || (product.image ? [product.image] : []),
  video_url: product.media?.video || null,
  features: product.features,
  whatsapp_link: product.whatsappLink,
  category: product.category,
  is_new: product.isNew || false,
  is_featured: product.isFeatured || false,
});

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
};
