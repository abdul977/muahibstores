import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Star, Tag, Eye } from 'lucide-react';
import { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price).replace('NGN', '₦');
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ${className}`}>
      {/* Product Image */}
      <div className="relative overflow-hidden group">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
        />
        {product.isNew && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            NEW
          </div>
        )}
        {product.originalPrice && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            <Tag className="h-3 w-3 mr-1" />
            SALE
          </div>
        )}
        {/* View Details Overlay */}
        <Link
          to={`/product/${product.id}`}
          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <div className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">4.8</span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>

        {/* Features */}
        <ul className="space-y-1 mb-4">
          {product.features.slice(0, 3).map((feature, index) => (
            <li key={index} className="text-sm text-gray-600 flex items-center">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
              {feature}
            </li>
          ))}
        </ul>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {product.originalPrice && (
            <div className="text-sm text-green-600 font-medium">
              Save {formatPrice(product.originalPrice - product.price)}
            </div>
          )}
        </div>

        {/* WhatsApp Button */}
        <a
          href={product.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 transform hover:scale-105"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Order via WhatsApp</span>
        </a>
      </div>
    </div>
  );
};

export default ProductCard;