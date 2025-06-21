import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Star, Tag, Shield, Truck, RefreshCw } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types/Product';
import ImageCarousel from '../components/ImageCarousel';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) {
        setError('Product ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const productData = await productService.getProductById(id);

        if (!productData) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        setProduct(productData);

        // Load related products
        const related = await productService.getProductsByCategory(productData.category);
        setRelatedProducts(related.filter(p => p.id !== productData.id).slice(0, 4));

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price).replace('NGN', '₦');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading product...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state or product not found
  if (error || !product) {
    return <Navigate to="/products" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Media Carousel */}
          <div className="space-y-4">
            <div className="relative group">
              <ImageCarousel
                images={product.media?.images || (product.image ? [product.image] : [])}
                video={product.media?.video}
                className="w-full h-96"
                autoPlay={true}
                autoPlayInterval={5000}
                showControls={true}
                showDots={true}
              />
              {product.isNew && (
                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                  NEW
                </div>
              )}
              {product.originalPrice && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center z-10">
                  <Tag className="h-4 w-4 mr-1" />
                  SALE
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category and Rating */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600 ml-2">4.8 (124 reviews)</span>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <div className="text-lg text-green-600 font-medium">
                  Save {formatPrice(product.originalPrice - product.price)} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                </div>
              )}
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-200">
              <div className="text-center">
                <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Secure Payment</div>
                <div className="text-xs text-gray-500">100% Protected</div>
              </div>
              <div className="text-center">
                <Truck className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Fast Delivery</div>
                <div className="text-xs text-gray-500">2-3 Days</div>
              </div>
              <div className="text-center">
                <RefreshCw className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Easy Returns</div>
                <div className="text-xs text-gray-500">7 Day Policy</div>
              </div>
            </div>

            {/* WhatsApp Button */}
            <a
              href={product.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105 shadow-lg"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="text-lg">Order via WhatsApp</span>
            </a>

            <div className="text-sm text-gray-600 text-center">
              Click to chat with us on WhatsApp for instant ordering and support
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="text-lg font-bold text-gray-900">
                      {formatPrice(relatedProduct.price)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
