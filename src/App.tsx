import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
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
          <Route path="/" element={
            <div className="min-h-screen bg-white">
              <Header />
              <main>
                <HomePage />
              </main>
              <Footer />
            </div>
          } />

          <Route path="/products" element={
            <div className="min-h-screen bg-white">
              <Header />
              <main>
                <ProductsPage />
              </main>
              <Footer />
            </div>
          } />

          <Route path="/product/:id" element={
            <div className="min-h-screen bg-white">
              <Header />
              <main>
                <ProductDetailPage />
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;