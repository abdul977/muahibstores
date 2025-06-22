// Test the new "New Order" format
const testProduct = {
  name: '3 in 1 Multipurpose Bag',
  price: 15000,
  features: ['USB Charging Port', 'Anti-theft Design', 'Water Resistant', 'Laptop Compartment']
};

function generateNewOrderMessage(product) {
  const formattedPrice = new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(product.price).replace('NGN', '₦');

  const message = `🛍 New Order

Item: ${product.name}
Price: ${formattedPrice}
Features: ${product.features.join(', ')}

I'm interested in this product. Please provide more details and ordering information.`;

  return message;
}

const message = generateNewOrderMessage(testProduct);
console.log('New WhatsApp Message Format:');
console.log('============================');
console.log(message);

console.log('\nURL Encoded:');
console.log('============');
const encodedMessage = encodeURIComponent(message);
console.log(encodedMessage);
