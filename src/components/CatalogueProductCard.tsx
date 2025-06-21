import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Star, Tag, Eye } from 'lucide-react';
import { Product } from '../types/Product';

interface CatalogueProductCardProps {
  product: Product;
  className?: string;
}

const CatalogueProductCard: React.FC<CatalogueProductCardProps> = ({ product, className = '' }) => {
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
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 ${className}`}>
      {/* Product Image */}
      <div className="relative overflow-hidden group bg-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              NEW
            </div>
          )}
          {product.originalPrice && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
              <Tag className="h-3 w-3 mr-1" />
              {calculateDiscount(product.originalPrice, product.price)}% OFF
            </div>
          )}
        </div>

        {/* Hover Overlay */}
        <Link
          to={`/product/${product.id}`}
          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <div className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-lg">
            <Eye className="h-5 w-5" />
            <span>View Details</span>
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Category and Rating */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full font-semibold">
            {product.category}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1 font-medium">4.8</span>
          </div>
        </div>

        {/* Product Name */}
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 hover:text-green-600 transition-colors cursor-pointer leading-tight">
            {product.name}
          </h3>
        </Link>

        {/* Features */}
        <ul className="space-y-1 mb-4">
          {product.features.slice(0, 2).map((feature, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
              {feature}
            </li>
          ))}
        </ul>

        {/* Price Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-2xl font-black text-red-500">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.originalPrice && (
            <div className="text-sm text-green-600 font-bold">
              Save {formatPrice(product.originalPrice - product.price)}
            </div>
          )}
        </div>

        {/* WhatsApp Button */}
        <a
          href={product.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105 shadow-lg"
        >
          <MessageCircle className="h-5 w-5" />
          <span>ORDER NOW</span>
        </a>
      </div>
    </div>
  );
};

export default CatalogueProductCard;
