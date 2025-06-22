import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { productService } from '../../services/productService';
import { Product, ProductMedia } from '../../types/Product';
import MediaUpload from '../../components/admin/MediaUpload';

interface ProductFormData {
  name: string;
  price: number;
  originalPrice: number | null;
  image: string;
  media: ProductMedia;
  features: string[];
  description: string;
  whatsappLink: string;
  category: string;
  isNew: boolean;
  isFeatured: boolean;
  isHidden: boolean;
}

const ProductForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    originalPrice: null,
    image: '',
    media: { images: [], videos: [] },
    features: [],
    description: '',
    whatsappLink: '',
    category: '',
    isNew: false,
    isFeatured: false,
    isHidden: false,
  });

  const [newFeature, setNewFeature] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && id) {
      loadProduct(id);
    }
  }, [isEditing, id]);

  const loadProduct = async (productId: string) => {
    try {
      setLoading(true);
      const product = await productService.getProductById(productId);
      if (product) {
        setFormData({
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || null,
          image: product.image,
          media: product.media || { images: product.image ? [product.image] : [], videos: [] },
          features: product.features,
          description: product.description || '',
          whatsappLink: product.whatsappLink,
          category: product.category,
          isNew: product.isNew || false,
          isFeatured: product.isFeatured || false,
          isHidden: product.isHidden || false,
        });
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      const numValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMediaChange = (media: ProductMedia) => {
    setFormData(prev => ({
      ...prev,
      media,
      image: media.images[0] || '' // Update legacy image field for backward compatibility
    }));
    setErrors(prev => ({ ...prev, image: '', media: '' }));
  };

  const handleMediaError = (error: string) => {
    setErrors(prev => ({ ...prev, media: error }));
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.originalPrice && formData.originalPrice <= formData.price) {
      newErrors.originalPrice = 'Original price must be greater than current price';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (formData.features.length === 0) {
      newErrors.features = 'At least one feature is required';
    }

    if (!formData.whatsappLink.trim()) {
      newErrors.whatsappLink = 'WhatsApp link is required';
    }

    if (!formData.media.images.length) {
      newErrors.media = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitLoading(true);

      const productData: Omit<Product, 'id'> = {
        name: formData.name,
        price: formData.price,
        originalPrice: formData.originalPrice || undefined,
        image: formData.media.images[0] || '',
        media: formData.media,
        features: formData.features,
        description: formData.description,
        whatsappLink: formData.whatsappLink,
        category: formData.category,
        isNew: formData.isNew,
        isFeatured: formData.isFeatured,
        isHidden: formData.isHidden,
      };

      if (isEditing && id) {
        await productService.updateProduct(id, productData);
      } else {
        await productService.createProduct(productData);
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setErrors({ submit: 'Failed to save product. Please try again.' });
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update product information' : 'Create a new product for your store'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Information</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="lg:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.name ? 'border-red-300' : 'border-secondary-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Product Description */}
            <div className="lg:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Product Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.description ? 'border-red-300' : 'border-secondary-300'
                }`}
                placeholder="Enter a detailed description of the product for WhatsApp messages"
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              <p className="mt-1 text-sm text-gray-500">This description will be used in WhatsApp order messages</p>
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (₦) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.price ? 'border-red-300' : 'border-secondary-300'
                }`}
                placeholder="0.00"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>

            {/* Original Price */}
            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (₦)
              </label>
              <input
                type="number"
                id="originalPrice"
                name="originalPrice"
                value={formData.originalPrice || ''}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.originalPrice ? 'border-red-300' : 'border-secondary-300'
                }`}
                placeholder="0.00"
              />
              {errors.originalPrice && <p className="mt-1 text-sm text-red-600">{errors.originalPrice}</p>}
              <p className="mt-1 text-sm text-gray-500">Leave empty if no discount</p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.category ? 'border-red-300' : 'border-secondary-300'
                }`}
                placeholder="e.g., Smartwatch, Phone, Audio"
              />
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            {/* WhatsApp Link */}
            <div>
              <label htmlFor="whatsappLink" className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp Link *
              </label>
              <input
                type="url"
                id="whatsappLink"
                name="whatsappLink"
                value={formData.whatsappLink}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.whatsappLink ? 'border-red-300' : 'border-secondary-300'
                }`}
                placeholder="https://wa.me/..."
              />
              {errors.whatsappLink && <p className="mt-1 text-sm text-red-600">{errors.whatsappLink}</p>}
            </div>
          </div>

          {/* Status Checkboxes */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isFeatured"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                Featured Product
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isNew"
                name="isNew"
                checked={formData.isNew}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
              />
              <label htmlFor="isNew" className="ml-2 block text-sm text-gray-700">
                New Product
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isHidden"
                name="isHidden"
                checked={formData.isHidden}
                onChange={handleInputChange}
                className="h-4 w-4 text-accent-yellow focus:ring-accent-yellow border-secondary-300 rounded"
              />
              <label htmlFor="isHidden" className="ml-2 block text-sm text-gray-700">
                Hide from public view
                <span className="block text-xs text-gray-500">Product will not appear on the website</span>
              </label>
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Media</h2>

          <MediaUpload
            value={formData.media}
            onChange={handleMediaChange}
            onError={handleMediaError}
            required={true}
          />

          {errors.media && (
            <p className="mt-2 text-sm text-red-600">{errors.media}</p>
          )}
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Product Features</h2>

          <div className="space-y-4">
            {/* Add Feature */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter a product feature"
              />
              <button
                type="button"
                onClick={addFeature}
                className="w-full sm:w-auto px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                <Plus className="h-5 w-5 mr-2 sm:mr-0" />
                <span className="sm:hidden">Add Feature</span>
              </button>
            </div>

            {/* Features List */}
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{feature}</span>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {errors.features && <p className="text-sm text-red-600">{errors.features}</p>}

            {formData.features.length === 0 && (
              <p className="text-sm text-gray-500 italic">No features added yet</p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="w-full sm:w-auto px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitLoading}
            className="w-full sm:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {submitLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            )}
            {isEditing ? 'Update Product' : 'Create Product'}
          </button>
        </div>

        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.submit}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProductForm;
