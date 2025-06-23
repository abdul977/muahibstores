import React from 'react';
import { FileText, Scale, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const TermsOfServicePage: React.FC = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: [
        'By accessing and using the Muahib Stores website and services, you accept and agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, please do not use our website or services.',
        'These terms apply to all visitors, users, and customers of our website.',
        'We reserve the right to update these terms at any time without prior notice.',
        'Your continued use of our services after changes constitutes acceptance of the new terms.'
      ]
    },
    {
      id: 'products-services',
      title: 'Products and Services',
      icon: FileText,
      content: [
        'We sell electronics, smartwatches, smartphones, audio devices, kitchen appliances, and accessories.',
        'All product descriptions, images, and specifications are provided for informational purposes.',
        'We strive for accuracy but do not guarantee that all information is complete or error-free.',
        'Product availability is subject to change without notice.',
        'We reserve the right to limit quantities and refuse service to anyone.',
        'Prices are subject to change without notice and are displayed in Nigerian Naira (₦).'
      ]
    },
    {
      id: 'ordering-payment',
      title: 'Ordering and Payment',
      icon: Scale,
      content: [
        'Orders can be placed through our website or WhatsApp.',
        'All orders are subject to acceptance and availability.',
        'We accept bank transfers, mobile money, and cash on delivery.',
        'Payment must be completed before order processing and shipment.',
        'We reserve the right to cancel orders for any reason, including pricing errors.',
        'Order confirmation does not guarantee product availability.',
        'Additional charges may apply for delivery to certain locations.'
      ]
    },
    {
      id: 'delivery-returns',
      title: 'Delivery and Returns',
      icon: Shield,
      content: [
        'We deliver nationwide across Nigeria with varying delivery times.',
        'Delivery times are estimates and not guaranteed.',
        'Risk of loss passes to you upon delivery to the specified address.',
        'You must inspect products upon delivery and report any issues immediately.',
        'Returns are accepted within 7 days of delivery for defective products only.',
        'Products must be in original condition with all packaging and accessories.',
        'Return shipping costs may be borne by the customer unless the product is defective.',
        'Refunds will be processed within 7-14 business days after return approval.'
      ]
    }
  ];

  const prohibitedUses = [
    'Using our website for any unlawful purpose or illegal activity',
    'Violating any local, state, national, or international law',
    'Transmitting or procuring harmful code, viruses, or malicious software',
    'Collecting or harvesting personal information from other users',
    'Impersonating any person or entity or misrepresenting your affiliation',
    'Interfering with or disrupting our website or servers',
    'Attempting to gain unauthorized access to our systems',
    'Using our website to spam or send unsolicited communications'
  ];

  const limitations = [
    'Product warranties are provided by manufacturers, not Muahib Stores',
    'We are not liable for indirect, incidental, or consequential damages',
    'Our liability is limited to the purchase price of the product',
    'We do not guarantee uninterrupted or error-free website operation',
    'Force majeure events may affect our ability to fulfill orders',
    'We are not responsible for third-party website content or services'
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Scale className="h-16 w-16 mx-auto mb-6" />
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Please read these terms carefully before using our website and services.
            </p>
            <p className="text-blue-200 mt-4">Last updated: January 2025</p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 p-8 rounded-lg mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Muahib Stores</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Service ("Terms") govern your use of the Muahib Stores website and services. 
              By accessing or using our website, you agree to be bound by these Terms. If you disagree with 
              any part of these terms, then you may not access our services.
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

          {/* Prohibited Uses */}
          <div className="mt-16 bg-red-50 p-8 rounded-lg border border-red-200">
            <div className="flex items-center mb-6">
              <XCircle className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Prohibited Uses</h2>
            </div>
            <p className="text-gray-700 mb-6">
              You may not use our website or services for any of the following purposes:
            </p>
            <ul className="space-y-3">
              {prohibitedUses.map((use, index) => (
                <li key={index} className="flex items-start">
                  <XCircle className="h-4 w-4 text-red-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{use}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* User Accounts */}
          <div className="mt-12 border-l-4 border-green-500 pl-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">User Responsibilities</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                When using our services, you are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the confidentiality of your account information</li>
                <li>Notifying us immediately of any unauthorized use</li>
                <li>Using our services in compliance with applicable laws</li>
                <li>Respecting the intellectual property rights of others</li>
              </ul>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Intellectual Property</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                The content on our website, including but not limited to text, graphics, logos, images, and software, 
                is the property of Muahib Stores or its content suppliers and is protected by copyright and other 
                intellectual property laws.
              </p>
              <p className="text-gray-700">
                You may not reproduce, distribute, modify, or create derivative works of our content without 
                express written permission.
              </p>
            </div>
          </div>

          {/* Disclaimers and Limitations */}
          <div className="mt-12 bg-yellow-50 p-8 rounded-lg border border-yellow-200">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Disclaimers and Limitations</h2>
            </div>
            <ul className="space-y-3">
              {limitations.map((limitation, index) => (
                <li key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span className="text-gray-700">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Governing Law */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Governing Law</h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. 
                Any disputes arising from these Terms or your use of our services shall be subject to the exclusive jurisdiction 
                of the courts of Nigeria.
              </p>
            </div>
          </div>

          {/* Termination */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Termination</h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                We may terminate or suspend your access to our services immediately, without prior notice or liability, 
                for any reason, including breach of these Terms.
              </p>
              <p className="text-gray-700">
                Upon termination, your right to use our services will cease immediately. All provisions of these Terms 
                that should survive termination shall survive, including ownership provisions, warranty disclaimers, 
                and limitations of liability.
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="mb-6">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2">
              <p>📧 Email: info@muahibstores.com</p>
              <p>📱 WhatsApp: +234 814 449 3361</p>
              <p>📍 Address: Abuja, Nigeria</p>
            </div>
          </div>

          {/* Agreement */}
          <div className="mt-12 text-center">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Agreement</h3>
              <p className="text-gray-700">
                By using our website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfServicePage;
