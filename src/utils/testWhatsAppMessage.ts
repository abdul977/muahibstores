import { generateOrderWhatsAppMessage, generateProductInquiryMessage, generateOrderId } from './whatsappMessage';
import { Product } from '../types/Product';

// Test the WhatsApp message generation
export const testWhatsAppMessages = () => {
  console.log('🧪 Testing WhatsApp Message Generation');
  console.log('=====================================');

  // Test Order Message Generation
  console.log('\n📱 Testing Order Message:');
  const orderDetails = {
    orderId: '#MH-CVCPT3YV-2MV8',
    itemName: '3 in 1 Multipurpose Bag',
    quantity: 1,
    totalAmount: 15000,
    productDescription: 'Our 3-in-1 Multipurpose Bag offers unparalleled versatility and style, making it the perfect companion for all your daily activities.',
    customerName: 'abdul977',
    customerLocation: 'Nigeria',
    deliveryOption: 'Delivery'
  };

  const orderMessage = generateOrderWhatsAppMessage(orderDetails);
  console.log(orderMessage);

  // Test Product Inquiry Message Generation
  console.log('\n📱 Testing Product Inquiry Message:');
  const testProduct: Product = {
    id: '3in1-backpack',
    name: '3 in 1 Multipurpose Bag',
    price: 15000,
    image: '',
    features: ['USB Charging Port', 'Anti-theft Design', 'Water Resistant', 'Laptop Compartment'],
    description: 'Our 3-in-1 Multipurpose Bag offers unparalleled versatility and style, making it the perfect companion for all your daily activities.',
    whatsappLink: '',
    category: 'Accessories'
  };

  const inquiryMessage = generateProductInquiryMessage(testProduct);
  console.log(inquiryMessage);

  // Test Order ID Generation
  console.log('\n🆔 Testing Order ID Generation:');
  for (let i = 0; i < 5; i++) {
    console.log(generateOrderId());
  }

  console.log('\n✅ WhatsApp Message Tests Complete!');
};

// Run the test if this file is executed directly
if (typeof window === 'undefined') {
  testWhatsAppMessages();
}
