import { whatsappNumbersService } from '../services/whatsappNumbersService';
import { visitorTrackingService } from '../services/visitorTrackingService';

/**
 * Test WhatsApp popup functionality
 */
export const testWhatsAppPopup = () => {
  console.log('🧪 Testing WhatsApp Popup System');
  console.log('==================================');

  // Test WhatsApp number validation
  console.log('\n📱 Testing WhatsApp Number Validation:');
  
  const testNumbers = [
    '08012345678',
    '8012345678',
    '+2348012345678',
    '2348012345678',
    '0701234567',  // Invalid - too short
    '080123456789', // Invalid - too long
    '05012345678',  // Invalid - wrong prefix
    '+2347012345678', // Valid
    '+2349012345678', // Valid
  ];

  testNumbers.forEach(number => {
    const result = whatsappNumbersService.validateWhatsAppNumber(number);
    console.log(`${number} -> ${result.isValid ? '✅ Valid' : '❌ Invalid'}: ${result.formattedNumber || result.error}`);
  });

  // Test visitor tracking
  console.log('\n👤 Testing Visitor Tracking:');
  
  const visitorInfo = visitorTrackingService.getVisitorInfo();
  console.log('Visitor Info:', {
    isFirstTime: visitorInfo.isFirstTime,
    visitCount: visitorInfo.visitCount,
    hasSeenPopup: visitorInfo.hasSeenPopup,
    whatsappSubmitted: visitorInfo.whatsappSubmitted
  });

  const shouldShow = visitorTrackingService.shouldShowPopup();
  console.log(`Should show popup: ${shouldShow ? '✅ Yes' : '❌ No'}`);

  // Test device info
  console.log('\n📱 Testing Device Detection:');
  const deviceInfo = visitorTrackingService.getDeviceInfo();
  console.log('Device Info:', {
    deviceType: deviceInfo.deviceType,
    isMobile: deviceInfo.isMobile,
    screenSize: `${deviceInfo.screenWidth}x${deviceInfo.screenHeight}`,
    timezone: deviceInfo.timezone
  });

  // Test page info
  console.log('\n📄 Testing Page Info:');
  const pageInfo = visitorTrackingService.getPageInfo();
  console.log('Page Info:', pageInfo);

  // Test UTM parameters
  console.log('\n🔗 Testing UTM Parameters:');
  const utmParams = visitorTrackingService.getUTMParameters();
  console.log('UTM Parameters:', utmParams);

  console.log('\n✅ WhatsApp Popup System Tests Complete!');
};

/**
 * Reset visitor tracking for testing
 */
export const resetVisitorTracking = () => {
  visitorTrackingService.resetVisitorTracking();
  console.log('🔄 Visitor tracking reset - popup will show again on next page load');
};

/**
 * Simulate WhatsApp submission for testing
 */
export const simulateWhatsAppSubmission = async (testNumber: string = '08012345678') => {
  console.log(`🧪 Simulating WhatsApp submission with number: ${testNumber}`);
  
  try {
    const result = await whatsappNumbersService.submitWhatsAppNumber({
      whatsappNumber: testNumber
    });
    
    if (result.success) {
      console.log('✅ WhatsApp number submitted successfully!');
    } else {
      console.log('❌ Submission failed:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('❌ Error during submission:', error);
    return { success: false, error: 'Test submission failed' };
  }
};

// Make functions available globally for browser console testing
if (typeof window !== 'undefined') {
  (window as any).testWhatsAppPopup = testWhatsAppPopup;
  (window as any).resetVisitorTracking = resetVisitorTracking;
  (window as any).simulateWhatsAppSubmission = simulateWhatsAppSubmission;
}
