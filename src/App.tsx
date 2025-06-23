import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import CategoryPage from './pages/CategoryPage';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import ProductForm from './pages/admin/ProductForm';
import AdminSettings from './pages/admin/AdminSettings';
import AdminLogin from './pages/admin/AdminLogin';
import ProtectedRoute from './components/admin/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import WhatsAppPopup from './components/WhatsAppPopup';
import { visitorTrackingService } from './services/visitorTrackingService';

// Component to handle popup logic
const PopupManager: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Don't show popup on admin pages
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    // Check if popup should be shown after a short delay
    const timer = setTimeout(() => {
      if (visitorTrackingService.shouldShowPopup()) {
        setShowPopup(true);
      }
    }, 2000); // Show popup after 2 seconds

    return () => clearTimeout(timer);
  }, [location.pathname]);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handlePopupSuccess = () => {
    setShowPopup(false);
  };

  return (
    <WhatsAppPopup
      isOpen={showPopup}
      onClose={handleClosePopup}
      onSuccess={handlePopupSuccess}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <PopupManager />
        <Routes>
          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Public Routes with Layout */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
          <Route path="/product/:id" element={<Layout><ProductDetailPage /></Layout>} />
          <Route path="/about" element={<Layout><AboutPage /></Layout>} />
          <Route path="/contact" element={<Layout><ContactPage /></Layout>} />
          <Route path="/privacy-policy" element={<Layout><PrivacyPolicyPage /></Layout>} />
          <Route path="/terms-of-service" element={<Layout><TermsOfServicePage /></Layout>} />
          <Route path="/category/:category" element={<Layout><CategoryPage /></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;