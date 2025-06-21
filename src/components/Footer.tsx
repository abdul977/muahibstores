import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  CreditCard,
  Smartphone,
  Shield,
  Truck
} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated with Latest Deals</h3>
            <p className="text-blue-100 mb-6">Get exclusive offers and new product announcements</p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold text-blue-400 mb-4">Muahib Stores</h3>
              <p className="text-gray-300 mb-6">
                Your trusted partner for premium electronics, smartwatches, and home essentials. 
                Quality products at unbeatable prices.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#products" className="text-gray-300 hover:text-white transition-colors">
                    Products
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            {/* Product Categories */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Product Categories</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Smartwatches
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Smartphones
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Audio Devices
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Kitchen Appliances
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors">
                    Accessories
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Information</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-blue-400 mr-3" />
                  <span className="text-gray-300">+234 814 449 3361</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-blue-400 mr-3" />
                  <span className="text-gray-300">info@muahibstores.com</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-400 mr-3 mt-1" />
                  <span className="text-gray-300">
                    Lagos, Nigeria
                  </span>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-6">
                <a
                  href="https://wa.me/2348144493361"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Smartphone className="h-5 w-5" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 text-green-400 mb-2" />
              <span className="text-sm text-gray-300">Secure Shopping</span>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="h-8 w-8 text-blue-400 mb-2" />
              <span className="text-sm text-gray-300">Fast Delivery</span>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 text-purple-400 mb-2" />
              <span className="text-sm text-gray-300">24/7 Support</span>
            </div>
            <div className="flex flex-col items-center">
              <CreditCard className="h-8 w-8 text-yellow-400 mb-2" />
              <span className="text-sm text-gray-300">Flexible Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h5 className="text-sm font-semibold text-gray-400 mb-3">Accepted Payment Methods</h5>
            <div className="flex justify-center space-x-4 text-gray-400">
              <span className="bg-gray-800 px-3 py-1 rounded text-sm">Bank Transfer</span>
              <span className="bg-gray-800 px-3 py-1 rounded text-sm">Cash on Delivery</span>
              <span className="bg-gray-800 px-3 py-1 rounded text-sm">Mobile Money</span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 text-sm">
            <p>&copy; 2025 Muahib Stores. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;