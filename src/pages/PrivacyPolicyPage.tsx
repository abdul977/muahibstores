import React from 'react';
import { Shield, Eye, Lock, Users, FileText, AlertCircle } from 'lucide-react';

const PrivacyPolicyPage: React.FC = () => {
  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: FileText,
      content: [
        'Personal Information: Name, email address, phone number, and delivery address when you place an order or contact us.',
        'Payment Information: We do not store payment details. All transactions are processed securely through trusted payment processors.',
        'Usage Information: How you interact with our website, including pages visited and products viewed.',
        'Device Information: Browser type, IP address, and device information for security and optimization purposes.',
        'Communication Records: Records of your communications with us for customer service purposes.'
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: Users,
      content: [
        'Process and fulfill your orders and deliver products to you.',
        'Communicate with you about your orders, including order confirmations and delivery updates.',
        'Provide customer support and respond to your inquiries.',
        'Send you promotional offers and updates about new products (with your consent).',
        'Improve our website, products, and services based on your feedback and usage patterns.',
        'Prevent fraud and ensure the security of our platform.',
        'Comply with legal obligations and resolve disputes.'
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: Eye,
      content: [
        'We do not sell, trade, or rent your personal information to third parties.',
        'We may share information with trusted service providers who help us operate our business (delivery services, payment processors).',
        'We may disclose information when required by law or to protect our rights and safety.',
        'In the event of a business transfer, customer information may be transferred as part of the transaction.',
        'We may share aggregated, non-personally identifiable information for business purposes.'
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: Lock,
      content: [
        'We implement appropriate technical and organizational measures to protect your personal information.',
        'All sensitive information is transmitted using SSL encryption technology.',
        'We regularly review and update our security practices to ensure data protection.',
        'Access to personal information is restricted to authorized personnel only.',
        'We conduct regular security audits and vulnerability assessments.',
        'In case of a data breach, we will notify affected users and relevant authorities as required by law.'
      ]
    }
  ];

  const rights = [
    'Access: Request a copy of the personal information we hold about you.',
    'Correction: Request correction of inaccurate or incomplete information.',
    'Deletion: Request deletion of your personal information (subject to legal requirements).',
    'Portability: Request transfer of your data to another service provider.',
    'Objection: Object to certain types of processing of your personal information.',
    'Restriction: Request restriction of processing in certain circumstances.',
    'Withdrawal: Withdraw consent for marketing communications at any time.'
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Shield className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
            <p className="text-blue-200 mt-4">Last updated: January 2025</p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 p-8 rounded-lg mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              At Muahib Stores, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website 
              or make a purchase from us. By using our services, you agree to the collection and use of information in accordance 
              with this policy.
            </p>
          </div>

          {/* Main Sections */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={section.id} className="border-l-4 border-blue-500 pl-8">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <section.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Your Rights */}
          <div className="mt-16 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rights</h2>
            <p className="text-gray-700 mb-6">
              You have certain rights regarding your personal information. These rights may vary depending on your location:
            </p>
            <ul className="space-y-3">
              {rights.map((right, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{right}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cookies */}
          <div className="mt-12 border-l-4 border-yellow-500 pl-8">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-yellow-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Cookies and Tracking</h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience and analyze website traffic. 
                Cookies are small data files stored on your device that help us remember your preferences and improve our services.
              </p>
              <p>
                <strong>Types of cookies we use:</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Essential cookies: Required for basic website functionality</li>
                <li>Analytics cookies: Help us understand how visitors use our website</li>
                <li>Preference cookies: Remember your settings and preferences</li>
                <li>Marketing cookies: Used to deliver relevant advertisements</li>
              </ul>
              <p>
                You can control cookie settings through your browser preferences. However, disabling certain cookies may affect 
                website functionality.
              </p>
            </div>
          </div>

          {/* Third-Party Services */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Third-Party Services</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                We may use third-party services to enhance our operations. These services have their own privacy policies:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• <strong>Payment Processors:</strong> For secure payment processing</li>
                <li>• <strong>Delivery Services:</strong> For order fulfillment and shipping</li>
                <li>• <strong>Analytics Services:</strong> For website performance analysis</li>
                <li>• <strong>Communication Tools:</strong> For customer support and notifications</li>
              </ul>
            </div>
          </div>

          {/* Data Retention */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Retention</h2>
            <div className="bg-blue-50 p-6 rounded-lg">
              <p className="text-gray-700">
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy, 
                comply with legal obligations, resolve disputes, and enforce our agreements. When information is no longer needed, 
                we securely delete or anonymize it.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Questions About This Policy?</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy or how we handle your personal information, 
              please don't hesitate to contact us:
            </p>
            <div className="space-y-2">
              <p>📧 Email: info@muahibstores.com</p>
              <p>📱 WhatsApp: +234 814 449 3361</p>
              <p>📍 Address: Abuja, Nigeria</p>
            </div>
          </div>

          {/* Updates */}
          <div className="mt-12 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Policy Updates</h3>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this policy 
                periodically for any changes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;
