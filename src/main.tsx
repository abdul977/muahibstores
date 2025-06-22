import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import validation tests for development
import { runValidationTests } from './utils/testValidation';
import { testWhatsAppPopup } from './utils/testWhatsAppPopup';

// Run validation tests in development
if (import.meta.env.DEV) {
  setTimeout(() => {
    runValidationTests().then(success => {
      if (success) {
        console.log('🎉 All systems operational!');
      } else {
        console.error('❌ Some validation tests failed');
      }
    });

    // Run WhatsApp popup tests
    setTimeout(() => {
      testWhatsAppPopup();
    }, 1000);
  }, 2000); // Wait 2 seconds for app to initialize
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
