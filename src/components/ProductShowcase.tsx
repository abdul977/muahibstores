import React, { useState, useEffect } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import ProductCard from './ProductCard';
import { productService } from '../services/productService';
import { Product } from '../types/Product';

const ProductShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'masonry' | 'grid'>('masonry');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);

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
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const featuredProducts = products.filter(p => p.isFeatured);

  if (loading) {
    return (
      <section id="products" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Products Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Smartwatch Collection
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our premium smartwatch collection with exclusive bundles and accessories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className="h-full"
              />
            ))}
          </div>
        </div>

        {/* All Products Section */}
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                All Products
              </h2>
              <p className="text-gray-600">
                Browse our complete collection of electronics and gadgets
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'masonry' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-300'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className={`${
            viewMode === 'masonry' 
              ? 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          }`}>
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                className={viewMode === 'masonry' ? 'break-inside-avoid mb-6' : ''}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;