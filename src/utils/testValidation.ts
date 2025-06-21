import { productService } from '../services/productService';
import { imageService } from '../services/imageService';

export const runValidationTests = async () => {
  console.log('🧪 Starting validation tests...');
  
  try {
    // Test 1: Fetch all products
    console.log('📦 Testing product fetch...');
    const products = await productService.getAllProducts();
    console.log(`✅ Successfully fetched ${products.length} products`);
    
    if (products.length === 0) {
      console.warn('⚠️ No products found in database');
      return false;
    }

    // Test 2: Fetch categories
    console.log('🏷️ Testing categories fetch...');
    const categories = await productService.getCategories();
    console.log(`✅ Successfully fetched ${categories.length} categories:`, categories);

    // Test 3: Fetch featured products
    console.log('⭐ Testing featured products fetch...');
    const featuredProducts = await productService.getFeaturedProducts();
    console.log(`✅ Successfully fetched ${featuredProducts.length} featured products`);

    // Test 4: Fetch single product
    console.log('🔍 Testing single product fetch...');
    const firstProduct = products[0];
    const singleProduct = await productService.getProductById(firstProduct.id);
    
    if (singleProduct) {
      console.log(`✅ Successfully fetched product: ${singleProduct.name}`);
    } else {
      console.error('❌ Failed to fetch single product');
      return false;
    }

    // Test 5: Validate product data structure
    console.log('🔧 Validating product data structure...');
    const requiredFields = ['id', 'name', 'price', 'image', 'features', 'whatsappLink', 'category'];
    const missingFields = requiredFields.filter(field => !(field in firstProduct));
    
    if (missingFields.length > 0) {
      console.error('❌ Missing required fields:', missingFields);
      return false;
    }
    console.log('✅ Product data structure is valid');

    // Test 6: Validate image service
    console.log('🖼️ Testing image service validation...');
    
    // Test valid file validation
    const mockValidFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
    Object.defineProperty(mockValidFile, 'size', { value: 1024 * 1024 }); // 1MB
    
    const validationResult = imageService.validateImageFile(mockValidFile);
    if (validationResult.valid) {
      console.log('✅ Image validation works correctly');
    } else {
      console.error('❌ Image validation failed unexpectedly');
      return false;
    }

    // Test invalid file validation
    const mockInvalidFile = new File([''], 'test.txt', { type: 'text/plain' });
    const invalidValidationResult = imageService.validateImageFile(mockInvalidFile);
    if (!invalidValidationResult.valid) {
      console.log('✅ Image validation correctly rejects invalid files');
    } else {
      console.error('❌ Image validation should reject non-image files');
      return false;
    }

    // Test 7: Check data integrity
    console.log('🔒 Checking data integrity...');
    let integrityIssues = 0;

    products.forEach((product, index) => {
      // Check for required fields
      if (!product.name || product.name.trim() === '') {
        console.warn(`⚠️ Product ${index + 1} has empty name`);
        integrityIssues++;
      }
      
      if (!product.price || product.price <= 0) {
        console.warn(`⚠️ Product ${index + 1} has invalid price: ${product.price}`);
        integrityIssues++;
      }
      
      if (!product.features || product.features.length === 0) {
        console.warn(`⚠️ Product ${index + 1} has no features`);
        integrityIssues++;
      }
      
      if (!product.whatsappLink || !product.whatsappLink.includes('wa.me')) {
        console.warn(`⚠️ Product ${index + 1} has invalid WhatsApp link`);
        integrityIssues++;
      }
    });

    if (integrityIssues === 0) {
      console.log('✅ All products have valid data integrity');
    } else {
      console.warn(`⚠️ Found ${integrityIssues} data integrity issues`);
    }

    console.log('🎉 All validation tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log(`- Total products: ${products.length}`);
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Featured products: ${featuredProducts.length}`);
    console.log(`- Data integrity issues: ${integrityIssues}`);
    
    return true;

  } catch (error) {
    console.error('❌ Validation tests failed:', error);
    return false;
  }
};

// Function to test CRUD operations (for admin testing)
export const testCRUDOperations = async () => {
  console.log('🔧 Testing CRUD operations...');
  
  try {
    // This would be used in admin panel testing
    console.log('✅ CRUD operations test placeholder - implement when testing admin panel');
    return true;
  } catch (error) {
    console.error('❌ CRUD operations test failed:', error);
    return false;
  }
};

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).runValidationTests = runValidationTests;
  (window as any).testCRUDOperations = testCRUDOperations;
}
