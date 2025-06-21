import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Search, Tag, Star, MessageCircle, Phone } from 'lucide-react';
import CatalogueProductCard from '../components/CatalogueProductCard';
import { productService } from '../services/productService';
import { Product } from '../types/Product';

const ProductsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products and categories on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          productService.getVisibleProducts(),
          productService.getCategories()
        ]);

        setProducts(productsData);
        setCategories(['All', ...categoriesData]);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Products</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price).replace('NGN', '₦');
  };

  const calculateDiscount = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header with Green Theme */}
      <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-white">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 mb-6">
              <Tag className="h-5 w-5 mr-2" />
              <span className="font-semibold">ELECTRONIC DISCOUNT CATALOGUE</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-4">
              <span className="text-white">ELECTRONIC</span><br />
              <span className="text-green-200">DISCOUNT</span><br />
              <span className="text-white">CATALOGUE</span>
            </h1>
            <div className="inline-flex items-center bg-green-400 text-green-900 px-8 py-4 rounded-2xl font-bold text-2xl mb-6 shadow-xl">
              <span className="text-4xl mr-2">50%</span>
              <span>DISCOUNT</span>
            </div>
            <p className="text-xl text-green-100 max-w-2xl mx-auto">
              Limited time offer on premium electronics, smart devices, and accessories
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-green-300/20 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => {
                    console.log('Grid button clicked');
                    setViewMode('grid');
                  }}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-green-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                  title="Grid View"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    console.log('Masonry button clicked');
                    setViewMode('masonry');
                  }}
                  className={`p-3 rounded-lg transition-all duration-200 ${
                    viewMode === 'masonry'
                      ? 'bg-green-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                  title="Masonry View"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
            {searchTerm && ` for "${searchTerm}"`}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            <span className="ml-4 text-blue-600">View: {viewMode}</span>
          </div>
        </div>

        {/* Featured Products Section */}
        {filteredProducts.filter(p => p.isFeatured).length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                LIMITED OFFERS
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.filter(p => p.isFeatured).slice(0, 3).map((product, index) => (
                <div key={product.id} className="relative">
                  {/* Catalogue-style Product Card */}
                  <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-3xl p-6 text-white relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-white text-green-600 px-3 py-1 rounded-full text-sm font-bold">
                      {product.originalPrice ? `${calculateDiscount(product.originalPrice, product.price)}%` : '50%'} OFF
                    </div>

                    <div className="relative z-10">
                      <div className="text-sm font-semibold mb-2 opacity-90">LIMITED OFFER</div>
                      <h3 className="text-2xl font-black mb-4 leading-tight">
                        {product.name.toUpperCase()}
                      </h3>

                      <div className="mb-6">
                        <div className="text-3xl font-black text-red-400">
                          {formatPrice(product.price)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-lg line-through opacity-75">
                            {formatPrice(product.originalPrice)}
                          </div>
                        )}
                      </div>

                      <p className="text-sm opacity-90 mb-6 leading-relaxed">
                        {product.features.slice(0, 2).join(', ')}. Premium quality with warranty included.
                      </p>

                      <a
                        href={product.whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors"
                      >
                        <MessageCircle className="h-5 w-5 mr-2" />
                        ORDER NOW
                      </a>
                    </div>

                    {/* Product Image */}
                    <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-20">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-20 h-20 bg-white/10 rounded-full -translate-x-10 -translate-y-10"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full translate-x-16 translate-y-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Products Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">
            ALL PRODUCTS
          </h2>
          <div className="text-center mb-4">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
              viewMode === 'grid'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              Current Layout: {viewMode.toUpperCase()}
            </span>
          </div>
          <div className={`${
            viewMode === 'masonry'
              ? 'flex flex-wrap gap-6 border-4 border-blue-300 p-4 rounded-lg'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 border-4 border-green-300 p-4 rounded-lg'
          }`}>
            {filteredProducts.map((product) => (
              <CatalogueProductCard
                key={product.id}
                product={product}
                className={viewMode === 'masonry' ? 'break-inside-avoid mb-6' : ''}
              />
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action Footer */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-3xl p-8 text-white text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">THANK YOU.</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="bg-green-400 rounded-full p-3 mr-4">
                <MessageCircle className="h-6 w-6 text-green-900" />
              </div>
              <div className="text-left">
                <div className="font-bold">CONTACT US</div>
                <div className="text-green-100">+234-814-449-3361</div>
              </div>
            </div>

            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
              <div className="bg-green-400 rounded-full p-3 mr-4">
                <Star className="h-6 w-6 text-green-900" />
              </div>
              <div className="text-left">
                <div className="font-bold">VISIT OUR WEBSITE</div>
                <div className="text-green-100">www.muahibstores.com</div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button className="bg-green-400 text-green-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-green-300 transition-colors">
              SHOP NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
