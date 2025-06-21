import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          original_id: string | null;
          name: string;
          price: number;
          original_price: number | null;
          image_url: string | null;
          image_urls: string[] | null; // Array of up to 3 image URLs
          video_url: string | null;    // Optional video URL
          features: string[];
          description: string | null;  // Product description
          whatsapp_link: string;
          category: string;
          is_new: boolean;
          is_featured: boolean;
          is_hidden: boolean;          // New field to hide products
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          original_id?: string | null;
          name: string;
          price: number;
          original_price?: number | null;
          image_url?: string | null;
          image_urls?: string[] | null;
          video_url?: string | null;
          features: string[];
          description?: string | null;
          whatsapp_link: string;
          category: string;
          is_new?: boolean;
          is_featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          original_price?: number | null;
          image_url?: string | null;
          features?: string[];
          description?: string | null;
          whatsapp_link?: string;
          category?: string;
          is_new?: boolean;
          is_featured?: boolean;
          updated_at?: string;
        };
      };
    };
  };
}
