import { Product } from '../types/Product';

interface OrderDetails {
  orderId: string;
  itemName: string;
  quantity: number;
  totalAmount: number;
  productDescription: string;
  customerName?: string;
  customerLocation?: string;
  deliveryOption?: string;
}

/**
 * Generates a WhatsApp message template for orders
 */
export const generateOrderWhatsAppMessage = (orderDetails: OrderDetails): string => {
  const {
    orderId,
    itemName,
    quantity,
    totalAmount,
    productDescription,
    customerName = 'Customer',
    customerLocation = 'Nigeria',
    deliveryOption = 'Delivery'
  } = orderDetails;

  // Format the total amount with Nigerian Naira symbol
  const formattedAmount = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(totalAmount).replace('NGN', '₦');

  const message = `🛍 New Order ${orderId}

Item: ${itemName}
Quantity: ${quantity}
Total Amount: ${formattedAmount}

Product Description: ${productDescription}

Customer Details:
Name: ${customerName}
Location: ${customerLocation}
Delivery Option: ${deliveryOption}

Note: For deliveries outside Abuja, payment must be made before delivery.`;

  return message;
};

/**
 * Generates a simple product inquiry WhatsApp message for product browsing
 */
export const generateProductInquiryMessage = (product: Product): string => {
  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(product.price).replace('NGN', '₦');

  const message = `🛍 Product Inquiry

Item: ${product.name}
Price: ${formattedPrice}
Features: ${product.features.join(', ')}

I'm interested in this product. Please provide more details and ordering information.`;

  return message;
};

/**
 * URL encodes a WhatsApp message for use in wa.me links
 */
export const encodeWhatsAppMessage = (message: string): string => {
  return encodeURIComponent(message);
};

/**
 * Generates a complete WhatsApp link with pre-filled message
 */
export const generateWhatsAppLink = (phoneNumber: string, message: string): string => {
  const encodedMessage = encodeWhatsAppMessage(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

/**
 * Generates a random order ID in the format #MH-XXXXXXX-XXX
 */
export const generateOrderId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const part1 = Array.from({ length: 7 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const part2 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `#MH-${part1}-${part2}`;
};
