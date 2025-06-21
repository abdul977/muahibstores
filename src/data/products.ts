import { Product } from '../types/Product';

export const products: Product[] = [
  {
    id: 'i20-ultra',
    name: 'i20 Ultra Smartwatch',
    price: 30000,
    image: 'https://images.pexels.com/photos/393047/pexels-photo-393047.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['7 Interchangeable Straps', 'AirPod Included', 'Screen Protector', 'Fitness Tracking'],
    whatsappLink: 'https://wa.me/2348144493361?text=I\'m%20interested%20in%20i20%20Ultra%20Smartwatch%0APrice:%20₦30,000%0AIncludes:%207%20straps,%20AirPod,%20screen%20protector',
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
    whatsappLink: 'https://wa.me/2348144493361?text=I\'m%20interested%20in%20MVP110%20Smartwatch%0APrice:%20₦25,000%0AIncludes:%202%20straps',
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
    whatsappLink: 'https://wa.me/2348144493361?text=I\'m%20interested%20in%20i60%20Ultra%20Smartwatch%0APrice:%20₦40,000%0AIncludes:%202%20smartwatches,%207%20straps,%20AirPod,%20charger',
    category: 'Smartwatch',
    isFeatured: true
  },
  {
    id: 'mvp135',
    name: 'MVP135 Power Bundle',
    price: 35000,
    image: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Smartwatch', 'Power Bank', 'Charger', '4 Straps'],
    whatsappLink: 'https://wa.me/2348144493361?text=I\'m%20interested%20in%20MVP135%20Smartwatch%0APrice:%20₦35,000%0AIncludes:%20smartwatch,%20power%20bank,%20charger,%204%20straps',
    category: 'Smartwatch',
    isFeatured: true
  },
  {
    id: '3in1-backpack',
    name: '3-in-1 Smart Backpack',
    price: 15000,
    image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['USB Charging Port', 'Anti-theft Design', 'Water Resistant', 'Laptop Compartment'],
    whatsappLink: 'https://wa.me/2348144493361?text=I\'m%20interested%20in%203-in-1%20Smart%20Backpack%0APrice:%20₦15,000%0AIncludes:%20USB%20port,%20anti-theft,%20water%20resistant',
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
    whatsappLink: 'https://wa.me/2348144493361?text=I\'m%20interested%20in%20Premium%20Wireless%20Earbuds%0APrice:%20₦18,000%0AIncludes:%20noise%20cancellation,%2024h%20battery',
    category: 'Audio'
  },
  {
    id: 'smartphone',
    name: 'Ultra Pro Smartphone',
    price: 120000,
    image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['128GB Storage', '48MP Camera', '5G Ready', 'Fast Charging'],
    whatsappLink: 'https://wa.me/2348144493361?text=I\'m%20interested%20in%20Ultra%20Pro%20Smartphone%0APrice:%20₦120,000%0AIncludes:%20128GB,%2048MP%20camera,%205G',
    category: 'Phone'
  },
  {
    id: 'kitchen-blender',
    name: 'Professional Kitchen Blender',
    price: 22000,
    image: 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['1000W Motor', 'Multiple Speeds', 'Glass Jar', '2 Year Warranty'],
    whatsappLink: 'https://wa.me/2348144493361?text=I\'m%20interested%20in%20Professional%20Kitchen%20Blender%0APrice:%20₦22,000%0AIncludes:%201000W%20motor,%20glass%20jar',
    category: 'Kitchen'
  }
];