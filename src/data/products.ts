import { Product } from '../types/Product';
import { generateProductInquiryMessage, generateWhatsAppLink } from '../utils/whatsappMessage';

export const products: Product[] = [
  {
    id: 'i20-ultra',
    name: 'i20 Ultra Smartwatch',
    price: 30000,
    image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['7 Interchangeable Straps', 'AirPod Included', 'Screen Protector', 'Fitness Tracking'],
    description: 'The i20 Ultra Smartwatch combines cutting-edge technology with premium design, featuring comprehensive fitness tracking, seamless connectivity, and exceptional battery life for the modern lifestyle.',
    whatsappLink: '',
    category: 'Smartwatch',
    isFeatured: true,
    isNew: true
  },
  {
    id: 'mvp110',
    name: 'MVP110 Smartwatch',
    price: 25000,
    image: 'https://images.pexels.com/photos/1034130/pexels-photo-1034130.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['2 Interchangeable Straps', 'Basic Package', 'Heart Rate Monitor', 'Water Resistant'],
    description: 'The MVP110 Smartwatch offers essential smart features with reliable performance, perfect for those seeking quality and functionality at an affordable price point.',
    whatsappLink: '',
    category: 'Smartwatch',
    isFeatured: true
  },
  {
    id: 'i60-ultra',
    name: 'i60 Ultra Dual Pack',
    price: 40000,
    originalPrice: 50000,
    image: 'https://images.pexels.com/photos/1034130/pexels-photo-1034130.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['2 Smartwatches', '7 Straps', 'AirPod Included', 'Charger Included'],
    description: 'The i60 Ultra Dual Pack provides exceptional value with two premium smartwatches, complete accessories, and advanced features for couples or those who want a backup device.',
    whatsappLink: '',
    category: 'Smartwatch',
    isFeatured: true
  },
  {
    id: 'mvp135',
    name: 'MVP135 Power Bundle',
    price: 35000,
    image: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Smartwatch', 'Power Bank', 'Charger', '4 Straps'],
    description: 'The MVP135 Power Bundle combines a feature-rich smartwatch with a portable power bank, ensuring you stay connected and powered throughout your busy day.',
    whatsappLink: '',
    category: 'Smartwatch',
    isFeatured: true
  },
  {
    id: '3in1-backpack',
    name: '3 in 1 Multipurpose Bag',
    price: 15000,
    image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['USB Charging Port', 'Anti-theft Design', 'Water Resistant', 'Laptop Compartment'],
    description: 'Our 3-in-1 Multipurpose Bag offers unparalleled versatility and style, making it the perfect companion for all your daily activities.',
    whatsappLink: '',
    category: 'Accessories',
    isNew: true
  },
  {
    id: 'wireless-earbuds',
    name: 'Premium Wireless Earbuds',
    price: 18000,
    originalPrice: 25000,
    image: 'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Noise Cancellation', '24H Battery Life', 'Touch Controls', 'Wireless Charging'],
    description: 'Experience premium audio quality with our wireless earbuds featuring advanced noise cancellation, extended battery life, and seamless connectivity for the ultimate listening experience.',
    whatsappLink: '',
    category: 'Audio'
  },
  {
    id: 'smartphone',
    name: 'Ultra Pro Smartphone',
    price: 120000,
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['128GB Storage', '48MP Camera', '5G Ready', 'Fast Charging'],
    description: 'The Ultra Pro Smartphone delivers flagship performance with cutting-edge camera technology, lightning-fast 5G connectivity, and premium build quality for the discerning user.',
    whatsappLink: '',
    category: 'Phone'
  },
  {
    id: 'kitchen-blender',
    name: 'Professional Kitchen Blender',
    price: 22000,
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['1000W Motor', 'Multiple Speeds', 'Glass Jar', '2 Year Warranty'],
    description: 'The Professional Kitchen Blender combines powerful performance with durable construction, perfect for creating smoothies, soups, and culinary masterpieces with ease.',
    whatsappLink: '',
    category: 'Kitchen'
  }
];

// Generate WhatsApp links for all products using the new message format
const WHATSAPP_PHONE_NUMBER = '2348144493361';

products.forEach(product => {
  if (product.description) {
    const message = generateProductInquiryMessage(product);
    product.whatsappLink = generateWhatsAppLink(WHATSAPP_PHONE_NUMBER, message);
    console.log(`Generated WhatsApp link for ${product.name}:`, product.whatsappLink.substring(0, 100) + '...');
  }
});