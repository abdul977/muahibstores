import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Star, Tag, Shield, Truck, RefreshCw, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { productService } from '../services/productService';
import { Product } from '../types/Product';

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

        // Load related products (only visible ones)
        const related = await productService.getVisibleProductsByCategory(productData.category);
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

  // Reset image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!product) return;

      const media = getProductMedia();
      if (media.length <= 1) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPreviousImage();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNextImage();
          break;
        case 'Home':
          event.preventDefault();
          setCurrentImageIndex(0);
          break;
        case 'End':
          event.preventDefault();
          setCurrentImageIndex(media.length - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [product, currentImageIndex]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price).replace('NGN', '₦');
  };

  // Get all available media (images + video) for the product
  const getProductMedia = () => {
    if (!product) return [];
    const media = [];

    // Add images
    const images = product.media?.images || (product.image ? [product.image] : []);
    images.forEach(url => media.push({ type: 'image' as const, url }));

    // Add video if available
    if (product.media?.video) {
      media.push({ type: 'video' as const, url: product.media.video });
    }

    return media;
  };

  // Get all available images for the product (for backward compatibility)
  const getProductImages = () => {
    if (!product) return [];
    return product.media?.images || (product.image ? [product.image] : []);
  };

  // Handle thumbnail click
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Navigate to previous media
  const goToPreviousImage = () => {
    const media = getProductMedia();
    setCurrentImageIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  // Navigate to next media
  const goToNextImage = () => {
    const media = getProductMedia();
    setCurrentImageIndex((prev) => (prev + 1) % media.length);
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
          {/* Product Media Display */}
          <div className="space-y-4">
            {(() => {
              const media = getProductMedia();
              const currentMedia = media[currentImageIndex] || media[0];

              return (
                <div className="space-y-4">
                  {/* Main Media Display - Portrait Orientation */}
                  <div className="relative group">
                    <div className="relative w-full bg-white rounded-lg shadow-lg overflow-hidden" style={{ aspectRatio: '3/4' }}>
                      {currentMedia && (
                        <>
                          {currentMedia.type === 'image' ? (
                            <img
                              src={currentMedia.url}
                              alt={`${product.name} - Image ${currentImageIndex + 1}`}
                              className="w-full h-full object-cover transition-opacity duration-300"
                            />
                          ) : (
                            <video
                              src={currentMedia.url}
                              controls
                              className="w-full h-full object-cover"
                              poster={getProductImages()[0]} // Use first image as poster if available
                            />
                          )}
                        </>
                      )}

                      {/* Navigation Arrows - Only show if more than 1 media item */}
                      {media.length > 1 && (
                        <>
                          <button
                            onClick={goToPreviousImage}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                            aria-label="Previous image"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          <button
                            onClick={goToNextImage}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                            aria-label="Next image"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </>
                      )}

                      {/* Product Badges */}
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

                      {/* Media Counter */}
                      {media.length > 1 && (
                        <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
                          {currentImageIndex + 1} / {media.length}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Navigation - Only show if more than 1 media item */}
                  {media.length > 1 && (
                    <div className="relative">
                      <div className="flex justify-center space-x-2 overflow-hidden">
                        {/* Show up to 3 thumbnails, centered around current media */}
                        {(() => {
                          let startIndex = 0;
                          let endIndex = Math.min(3, media.length);

                          // If more than 3 media items, center around current item
                          if (media.length > 3) {
                            startIndex = Math.max(0, currentImageIndex - 1);
                            endIndex = Math.min(media.length, startIndex + 3);

                            // Adjust if we're near the end
                            if (endIndex === media.length) {
                              startIndex = Math.max(0, endIndex - 3);
                            }
                          }

                          return media.slice(startIndex, endIndex).map((mediaItem, index) => {
                            const actualIndex = startIndex + index;
                            return (
                              <button
                                key={actualIndex}
                                onClick={() => handleThumbnailClick(actualIndex)}
                                className={`relative w-12 h-16 sm:w-16 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                                  actualIndex === currentImageIndex
                                    ? 'border-blue-500 ring-2 ring-blue-200 scale-105'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                aria-label={`View ${mediaItem.type} ${actualIndex + 1}`}
                              >
                                {mediaItem.type === 'image' ? (
                                  <img
                                    src={mediaItem.url}
                                    alt={`${product.name} thumbnail ${actualIndex + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="relative w-full h-full bg-gray-900">
                                    <video
                                      src={mediaItem.url}
                                      className="w-full h-full object-cover"
                                      muted
                                    />
                                    {/* Video play icon overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                      <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
                                        <Play className="w-3 h-3 text-gray-800 fill-current ml-0.5" />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {actualIndex === currentImageIndex && (
                                  <div className="absolute inset-0 bg-blue-500/20"></div>
                                )}
                              </button>
                            );
                          });
                        })()}
                      </div>

                      {/* Navigation dots for more than 3 media items */}
                      {media.length > 3 && (
                        <div className="flex justify-center mt-2 space-x-1">
                          {media.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => handleThumbnailClick(index)}
                              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                index === currentImageIndex
                                  ? 'bg-blue-500 scale-125'
                                  : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                              aria-label={`Go to ${media[index].type} ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
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
