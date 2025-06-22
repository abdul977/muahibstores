import React, { useState, useEffect } from 'react';
import { X, Gift, MessageCircle, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { whatsappNumbersService } from '../services/whatsappNumbersService';
import { visitorTrackingService } from '../services/visitorTrackingService';

interface WhatsAppPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const WhatsAppPopup: React.FC<WhatsAppPopupProps> = ({ isOpen, onClose, onSuccess }) => {
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showThankYou, setShowThankYou] = useState(false);

  // Reset form when popup opens
  useEffect(() => {
    if (isOpen) {
      setWhatsappNumber('');
      setSubmitStatus('idle');
      setErrorMessage('');
      setShowThankYou(false);
    }
  }, [isOpen]);

  // Auto-close after success
  useEffect(() => {
    if (submitStatus === 'success' && showThankYou) {
      const timer = setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus, showThankYou, onClose, onSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!whatsappNumber.trim()) {
      setErrorMessage('Please enter your WhatsApp number');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await whatsappNumbersService.submitWhatsAppNumber({
        whatsappNumber: whatsappNumber.trim()
      });

      if (result.success) {
        setSubmitStatus('success');
        setShowThankYou(true);
        // Mark popup as shown in visitor tracking
        visitorTrackingService.markPopupShown();
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      setSubmitStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Mark popup as shown even if closed without submitting
    visitorTrackingService.markPopupShown();
    onClose();
  };

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format as Nigerian number
    if (digits.length <= 11) {
      if (digits.startsWith('0')) {
        // Format: 0801 234 5678
        return digits.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
      } else if (digits.length >= 10) {
        // Format: 801 234 5678
        return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
      }
    }
    return digits;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setWhatsappNumber(formatted);
    if (errorMessage) setErrorMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Close popup"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="bg-white bg-opacity-20 p-3 rounded-full">
              <Gift className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Welcome to Muahib Stores!</h2>
              <p className="text-green-100 text-sm">Get a surprise free gift! 🎁</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {showThankYou ? (
            // Thank you message
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You! 🎉</h3>
              <p className="text-gray-600 mb-4">
                Your WhatsApp number has been saved successfully. You're now eligible for a surprise free gift with any purchase!
              </p>
              <p className="text-sm text-gray-500">
                This popup will close automatically in a few seconds...
              </p>
            </div>
          ) : (
            // Form
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  🎁 Qualify for a FREE Gift!
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Welcome to Muahib Stores! We're excited to have you here. Share your WhatsApp number 
                  and get a <strong>surprise free gift</strong> with any purchase you make today!
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                    <MessageCircle className="inline h-4 w-4 mr-1" />
                    Your WhatsApp Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">+234</span>
                    </div>
                    <input
                      type="tel"
                      id="whatsapp"
                      value={whatsappNumber}
                      onChange={handlePhoneChange}
                      placeholder="801 234 5678"
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors ${
                        errorMessage ? 'border-red-300' : 'border-gray-300'
                      }`}
                      disabled={isSubmitting}
                    />
                  </div>
                  {errorMessage && (
                    <div className="mt-2 flex items-center text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errorMessage}
                    </div>
                  )}
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-1">What you get:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Surprise free gift with any purchase</li>
                    <li>• Exclusive deals and offers</li>
                    <li>• Priority customer support</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    disabled={isSubmitting}
                  >
                    Maybe Later
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !whatsappNumber.trim()}
                    className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Gift className="h-4 w-4" />
                        <span>Get My Gift!</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                We respect your privacy. Your number will only be used for order updates and exclusive offers.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppPopup;
