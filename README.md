# Muahib Stores - E-commerce Platform with Supabase Integration

A modern e-commerce platform built with React, TypeScript, and Supabase, featuring a complete admin dashboard for product management.

## 🚀 Features

### Frontend (Customer-facing)
- **Product Catalog**: Browse all products with filtering and search
- **Product Details**: Detailed product pages with features and pricing
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **WhatsApp Integration**: Direct ordering through WhatsApp

### Admin Dashboard
- **Product Management**: Full CRUD operations for products
- **Image Upload**: Direct image upload to Supabase Storage
- **Authentication**: Secure admin login system
- **Real-time Data**: Live updates from Supabase database
- **Responsive Interface**: Mobile-friendly admin panel

### Backend Integration
- **Supabase Database**: PostgreSQL database with real-time capabilities
- **Supabase Storage**: Cloud storage for product images
- **MCP Server Integration**: Model Context Protocol for database operations

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage)
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Integration**: Supabase MCP Server

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   The application is pre-configured with Supabase credentials in `.env`:
   ```
   VITE_SUPABASE_URL=https://ttcapwgcfadajcoljuuk.supabase.co
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   - Frontend: `http://localhost:5174`
   - Admin Panel: `http://localhost:5174/admin`

## 🔐 Admin Access

### Login Credentials
- **Email**: `admin@muahibstores.com`
- **Password**: `admin123`

### Admin Features
- **Dashboard**: Overview of products, categories, and statistics
- **Product Management**: Add, edit, delete products
- **Image Upload**: Drag-and-drop image upload with preview
- **Real-time Updates**: Changes reflect immediately

## 📊 Database Schema

### Products Table
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_id VARCHAR(100) UNIQUE,
  name VARCHAR(255) NOT NULL,
  price INTEGER NOT NULL,
  original_price INTEGER,
  image_url TEXT,
  features TEXT[] NOT NULL DEFAULT '{}',
  whatsapp_link TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  is_new BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket
- **Bucket Name**: `product-images`
- **Public Access**: Enabled for product images
- **File Types**: JPEG, PNG, WebP, GIF
- **Size Limit**: 5MB per file

## 🧪 Testing

The application includes automated validation tests that run in development mode:

### Validation Tests
- ✅ Product data fetching
- ✅ Category retrieval
- ✅ Featured products filtering
- ✅ Single product lookup
- ✅ Data structure validation
- ✅ Image upload validation
- ✅ Data integrity checks

### Manual Testing Checklist

#### Frontend Testing
- [ ] Homepage loads with featured products
- [ ] Products page shows all products with filters
- [ ] Product detail pages display correctly
- [ ] Search functionality works
- [ ] Category filtering works
- [ ] WhatsApp links open correctly
- [ ] Responsive design on mobile

#### Admin Testing
- [ ] Admin login works with correct credentials
- [ ] Admin login rejects incorrect credentials
- [ ] Dashboard shows correct statistics
- [ ] Product list displays all products
- [ ] Add new product form works
- [ ] Edit existing product works
- [ ] Delete product works
- [ ] Image upload works
- [ ] Form validation works
- [ ] Logout functionality works

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   └── ...
├── pages/              # Page components
│   ├── admin/          # Admin pages
│   └── ...
├── services/           # API service layers
├── contexts/           # React contexts
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── lib/                # Third-party library configs
```

### Key Services
- **productService**: CRUD operations for products
- **imageService**: Image upload and validation
- **AuthContext**: Authentication state management

### Adding New Features
1. Create new components in appropriate directories
2. Add new routes to `App.tsx`
3. Update types in `src/types/`
4. Add service functions if needed
5. Test thoroughly

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Ensure all environment variables are set in production:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📝 API Documentation

### Product Service Methods
- `getAllProducts()`: Fetch all products
- `getProductById(id)`: Fetch single product
- `getProductsByCategory(category)`: Filter by category
- `getFeaturedProducts()`: Get featured products
- `createProduct(product)`: Add new product
- `updateProduct(id, updates)`: Update existing product
- `deleteProduct(id)`: Remove product
- `searchProducts(query)`: Search products
- `getCategories()`: Get all categories

### Image Service Methods
- `uploadImage(file, folder)`: Upload image to storage
- `deleteImage(path)`: Remove image from storage
- `validateImageFile(file)`: Validate image file
- `getPublicUrl(path)`: Get public URL for image

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Check the console for validation test results
- Review the Supabase dashboard for database issues
- Check network requests in browser dev tools
- Verify environment variables are set correctly

---

**Built with ❤️ using React, TypeScript, and Supabase**
