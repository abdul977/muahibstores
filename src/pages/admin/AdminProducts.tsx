import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Star,
  Tag
} from 'lucide-react';
import { productService } from '../../services/productService';
import { Product } from '../../types/Product';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [visibilityLoading, setVisibilityLoading] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getAllProducts(),
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

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.features.some(feature => 
          feature.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setDeleteLoading(productId);
      await productService.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleToggleVisibility = async (productId: string) => {
    try {
      setVisibilityLoading(productId);
      const updatedProduct = await productService.toggleProductVisibility(productId);

      // Update the product in the local state
      setProducts(products.map(p =>
        p.id === productId ? updatedProduct : p
      ));
    } catch (error) {
      console.error('Error toggling product visibility:', error);
      alert('Failed to toggle product visibility. Please try again.');
    } finally {
      setVisibilityLoading(null);
    }
  };

  const handleBulkVisibilityToggle = async (isHidden: boolean) => {
    if (selectedProducts.length === 0) {
      alert('Please select products to modify.');
      return;
    }

    const action = isHidden ? 'hide' : 'show';
    if (!confirm(`Are you sure you want to ${action} ${selectedProducts.length} selected product(s)?`)) {
      return;
    }

    try {
      setBulkActionLoading(true);
      await productService.bulkToggleVisibility(selectedProducts, isHidden);

      // Update the products in local state
      setProducts(products.map(p =>
        selectedProducts.includes(p.id) ? { ...p, isHidden } : p
      ));

      setSelectedProducts([]);
    } catch (error) {
      console.error('Error with bulk visibility toggle:', error);
      alert('Failed to update product visibility. Please try again.');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price).replace('NGN', '₦');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Bulk Actions */}
          {selectedProducts.length > 0 && (
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-600">
                {selectedProducts.length} selected
              </span>
              <button
                onClick={() => handleBulkVisibilityToggle(true)}
                disabled={bulkActionLoading}
                className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Hide
              </button>
              <button
                onClick={() => handleBulkVisibilityToggle(false)}
                disabled={bulkActionLoading}
                className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
              >
                Show
              </button>
            </div>
          )}
          <Link
            to="/admin/products/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

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
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className={`hover:bg-gray-50 ${product.isHidden ? 'opacity-60 bg-gray-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        className={`h-12 w-12 rounded-lg object-cover ${product.isHidden ? 'grayscale' : ''}`}
                        src={product.image}
                        alt={product.name}
                      />
                      <div className="ml-4">
                        <div className={`text-sm font-medium ${product.isHidden ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.features.slice(0, 2).join(', ')}
                          {product.features.length > 2 && '...'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatPrice(product.price)}
                    </div>
                    {product.originalPrice && (
                      <div className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-2">
                      {product.isHidden && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Hidden
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </span>
                      )}
                      {product.isNew && (
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          <Tag className="h-3 w-3 mr-1" />
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {/* Visibility Toggle */}
                      <button
                        onClick={() => handleToggleVisibility(product.id)}
                        disabled={visibilityLoading === product.id}
                        className={`p-1 transition-colors ${
                          product.isHidden
                            ? 'text-orange-600 hover:text-orange-700'
                            : 'text-green-600 hover:text-green-700'
                        } disabled:opacity-50`}
                        title={product.isHidden ? 'Show product' : 'Hide product'}
                      >
                        {visibilityLoading === product.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        ) : product.isHidden ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>

                      <Link
                        to={`/product/${product.id}`}
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={deleteLoading === product.id}
                        className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50"
                        title="Delete"
                      >
                        {deleteLoading === product.id ? (
                          <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
