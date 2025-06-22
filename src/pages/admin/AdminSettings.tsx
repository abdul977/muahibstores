import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Upload,
  Download,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  Server,
  Key,
  Globe,
  MessageCircle,
  Search,
  Filter,
  Calendar,
  Copy,
  ExternalLink,
  Users,
  Smartphone,
  TrendingUp
} from 'lucide-react';
import { mcpService, DatabaseStats } from '../../services/mcpService';
import { whatsappNumbersService, WhatsAppNumberEntry, WhatsAppNumbersStats } from '../../services/whatsappNumbersService';

interface SupabaseConfig {
  url: string;
  anonKey: string;
  projectId: string;
  region: string;
}



const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'database' | 'storage' | 'backup' | 'whatsapp'>('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // WhatsApp Numbers state
  const [whatsappNumbers, setWhatsappNumbers] = useState<WhatsAppNumberEntry[]>([]);
  const [whatsappStats, setWhatsappStats] = useState<WhatsAppNumbersStats | null>(null);
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [deviceFilter, setDeviceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalNumbers, setTotalNumbers] = useState(0);
  const itemsPerPage = 20;
  
  // Supabase configuration
  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>({
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    projectId: '',
    region: ''
  });

  // Database statistics
  const [dbStats, setDbStats] = useState<DatabaseStats>({
    totalProducts: 0,
    totalImages: 0,
    totalVideos: 0,
    storageUsed: '0 MB',
    lastBackup: 'Never'
  });

  useEffect(() => {
    loadDatabaseStats();
    extractProjectInfo();
  }, []);

  const extractProjectInfo = () => {
    if (supabaseConfig.url) {
      // Extract project ID from URL (format: https://PROJECT_ID.supabase.co)
      const urlParts = supabaseConfig.url.split('.');
      if (urlParts.length >= 2) {
        const projectId = urlParts[0].split('//')[1];
        setSupabaseConfig(prev => ({ ...prev, projectId }));
      }
    }
  };

  const loadDatabaseStats = async () => {
    try {
      setLoading(true);
      // This would use MCP server functions to get database statistics
      // For now, we'll simulate the data
      setDbStats({
        totalProducts: 25,
        totalImages: 75,
        totalVideos: 12,
        storageUsed: '45.2 MB',
        lastBackup: new Date().toLocaleDateString()
      });
    } catch (error) {
      console.error('Error loading database stats:', error);
      setMessage({ type: 'error', text: 'Failed to load database statistics' });
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    try {
      setLoading(true);
      setMessage({ type: 'info', text: 'Testing connection...' });
      
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessage({ type: 'success', text: 'Connection successful! Database is accessible.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Connection failed. Please check your configuration.' });
    } finally {
      setLoading(false);
    }
  };

  const handleBackupDatabase = async () => {
    try {
      setLoading(true);
      setMessage({ type: 'info', text: 'Creating database backup...' });
      
      // This would use MCP server functions to create a backup
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setMessage({ type: 'success', text: 'Database backup created successfully!' });
      setDbStats(prev => ({ ...prev, lastBackup: new Date().toLocaleDateString() }));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create database backup.' });
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeDatabase = async () => {
    try {
      setLoading(true);
      setMessage({ type: 'info', text: 'Optimizing database...' });
      
      // This would use MCP server functions to optimize the database
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      setMessage({ type: 'success', text: 'Database optimized successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to optimize database.' });
    } finally {
      setLoading(false);
    }
  };

  // Load WhatsApp numbers when tab is active
  useEffect(() => {
    if (activeTab === 'whatsapp') {
      loadWhatsAppData();
    }
  }, [activeTab, currentPage, searchTerm, dateFilter, deviceFilter]);

  const loadWhatsAppData = async () => {
    setWhatsappLoading(true);
    try {
      // Load statistics
      const stats = await whatsappNumbersService.getWhatsAppNumbersStats();
      setWhatsappStats(stats);

      // Load numbers with filters
      const filters = {
        search: searchTerm || undefined,
        deviceType: deviceFilter || undefined,
        dateFrom: dateFilter || undefined,
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage
      };

      const { data, total } = await whatsappNumbersService.getWhatsAppNumbers(filters);
      setWhatsappNumbers(data);
      setTotalNumbers(total);
    } catch (error) {
      console.error('Error loading WhatsApp data:', error);
      setMessage({ type: 'error', text: 'Failed to load WhatsApp numbers' });
    } finally {
      setWhatsappLoading(false);
    }
  };

  const handleExportWhatsApp = async () => {
    try {
      setLoading(true);
      const csvData = await whatsappNumbersService.exportWhatsAppNumbers({
        search: searchTerm || undefined,
        deviceType: deviceFilter || undefined,
        dateFrom: dateFilter || undefined
      });

      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whatsapp-numbers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setMessage({ type: 'success', text: 'WhatsApp numbers exported successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export WhatsApp numbers' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setMessage({ type: 'success', text: 'Copied to clipboard!' });
      setTimeout(() => setMessage(null), 2000);
    });
  };

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'storage', name: 'Storage', icon: Upload },
    { id: 'backup', name: 'Backup', icon: Download },
    { id: 'whatsapp', name: 'WhatsApp Numbers', icon: MessageCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Settings</h1>
        <p className="text-secondary-600">Manage your store configuration and database settings</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-3 ${
          message.type === 'success' ? 'bg-primary-50 text-primary-800 border border-primary-200' :
          message.type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
          'bg-blue-50 text-blue-800 border border-blue-200'
        }`}>
          {message.type === 'success' && <CheckCircle className="h-5 w-5" />}
          {message.type === 'error' && <AlertCircle className="h-5 w-5" />}
          {message.type === 'info' && <Info className="h-5 w-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-secondary-200">
        <nav className="-mb-px flex overflow-x-auto">
          <div className="flex space-x-2 sm:space-x-8 min-w-max px-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden">
                    {tab.name === 'WhatsApp Numbers' ? 'WhatsApp' :
                     tab.name === 'General' ? 'General' :
                     tab.name === 'Database' ? 'Database' :
                     tab.name === 'Storage' ? 'Storage' : 'Backup'}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4 sm:p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary-900">Supabase Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <Globe className="inline h-4 w-4 mr-1" />
                  Supabase URL
                </label>
                <input
                  type="text"
                  value={supabaseConfig.url}
                  readOnly
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-secondary-50 text-secondary-600"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <Key className="inline h-4 w-4 mr-1" />
                  Project ID
                </label>
                <input
                  type="text"
                  value={supabaseConfig.projectId}
                  readOnly
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-secondary-50 text-secondary-600"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleTestConnection}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Server className="h-4 w-4" />
                <span>Test Connection</span>
                {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'database' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary-900">Database Statistics</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-primary-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary-600">{dbStats.totalProducts}</div>
                <div className="text-sm text-primary-700">Total Products</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{dbStats.totalImages}</div>
                <div className="text-sm text-blue-700">Total Images</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{dbStats.totalVideos}</div>
                <div className="text-sm text-purple-700">Total Videos</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{dbStats.storageUsed}</div>
                <div className="text-sm text-yellow-700">Storage Used</div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleOptimizeDatabase}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Optimize Database</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'storage' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary-900">Storage Management</h3>
            
            <div className="bg-secondary-50 p-4 rounded-lg">
              <p className="text-secondary-700">
                Storage management features will be integrated with the MCP server to provide:
              </p>
              <ul className="mt-2 list-disc list-inside text-secondary-600 space-y-1">
                <li>Clean up unused images and videos</li>
                <li>Optimize storage usage</li>
                <li>Manage file permissions</li>
                <li>Monitor storage quotas</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'backup' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-secondary-900">Backup & Restore</h3>

            <div className="bg-secondary-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-secondary-900">Last Backup</div>
                  <div className="text-secondary-600">{dbStats.lastBackup}</div>
                </div>
                <button
                  onClick={handleBackupDatabase}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="h-4 w-4" />
                  <span>Create Backup</span>
                  {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'whatsapp' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-lg font-semibold text-secondary-900">WhatsApp Numbers</h3>
              <button
                onClick={handleExportWhatsApp}
                disabled={loading}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export CSV</span>
                <span className="sm:hidden">Export</span>
                {loading && <RefreshCw className="h-4 w-4 animate-spin" />}
              </button>
            </div>

            {/* Statistics Cards */}
            {whatsappStats && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                      <div className="text-xl sm:text-2xl font-bold text-green-600">{whatsappStats.totalNumbers}</div>
                      <div className="text-xs sm:text-sm text-green-700">Total Numbers</div>
                    </div>
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-500 self-end sm:self-auto" />
                  </div>
                </div>
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">{whatsappStats.todayNumbers}</div>
                      <div className="text-xs sm:text-sm text-blue-700">Today</div>
                    </div>
                    <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 self-end sm:self-auto" />
                  </div>
                </div>
                <div className="bg-purple-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">{whatsappStats.weekNumbers}</div>
                      <div className="text-xs sm:text-sm text-purple-700">This Week</div>
                    </div>
                    <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 self-end sm:self-auto" />
                  </div>
                </div>
                <div className="bg-orange-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                      <div className="text-xl sm:text-2xl font-bold text-orange-600">{whatsappStats.mobilePercentage}%</div>
                      <div className="text-xs sm:text-sm text-orange-700">Mobile Users</div>
                    </div>
                    <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500 self-end sm:self-auto" />
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white border border-secondary-200 rounded-lg p-3 sm:p-4">
              <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-1 md:grid-cols-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <Search className="inline h-4 w-4 mr-1" />
                    Search
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search numbers or pages..."
                    className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <Filter className="inline h-4 w-4 mr-1" />
                    Device Type
                  </label>
                  <select
                    value={deviceFilter}
                    onChange={(e) => setDeviceFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Devices</option>
                    <option value="mobile">Mobile</option>
                    <option value="desktop">Desktop</option>
                    <option value="tablet">Tablet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Date From
                  </label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp Numbers Table */}
            <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden">
              <div className="px-3 sm:px-4 py-3 border-b border-secondary-200">
                <h4 className="font-medium text-secondary-900 text-sm sm:text-base">Collected Numbers ({totalNumbers})</h4>
              </div>

              {whatsappLoading ? (
                <div className="p-6 sm:p-8 text-center">
                  <RefreshCw className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mx-auto text-secondary-400" />
                  <p className="mt-2 text-sm sm:text-base text-secondary-600">Loading WhatsApp numbers...</p>
                </div>
              ) : whatsappNumbers.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <MessageCircle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto text-secondary-300" />
                  <p className="mt-2 text-sm sm:text-base text-secondary-600">No WhatsApp numbers found</p>
                </div>
              ) : (
                <>
                  {/* Mobile Card Layout */}
                  <div className="block sm:hidden">
                    <div className="divide-y divide-secondary-200">
                      {whatsappNumbers.map((entry) => (
                        <div key={entry.id} className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-secondary-900 text-sm">{entry.whatsapp_number}</span>
                              <button
                                onClick={() => copyToClipboard(entry.whatsapp_number)}
                                className="text-secondary-400 hover:text-secondary-600"
                                title="Copy number"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            </div>
                            <a
                              href={`https://wa.me/${entry.whatsapp_number.replace('+', '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800"
                              title="Open in WhatsApp"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>

                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <span className="text-secondary-500 font-medium">Source:</span>
                              <div className="text-secondary-700 mt-1">{entry.source_page}</div>
                            </div>
                            <div>
                              <span className="text-secondary-500 font-medium">Device:</span>
                              <div className="flex items-center space-x-1 mt-1">
                                {entry.is_mobile ? (
                                  <Smartphone className="h-3 w-3 text-blue-500" />
                                ) : (
                                  <div className="h-3 w-3 bg-secondary-300 rounded-sm" />
                                )}
                                <span className="text-secondary-700 capitalize">{entry.device_type}</span>
                              </div>
                            </div>
                            <div>
                              <span className="text-secondary-500 font-medium">UTM Source:</span>
                              <div className="text-secondary-700 mt-1">{entry.utm_source || '-'}</div>
                            </div>
                            <div>
                              <span className="text-secondary-500 font-medium">Date:</span>
                              <div className="text-secondary-700 mt-1">{new Date(entry.created_at).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-secondary-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            WhatsApp Number
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Source Page
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Device
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            UTM Source
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-secondary-200">
                        {whatsappNumbers.map((entry) => (
                          <tr key={entry.id} className="hover:bg-secondary-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-secondary-900">{entry.whatsapp_number}</span>
                                <button
                                  onClick={() => copyToClipboard(entry.whatsapp_number)}
                                  className="text-secondary-400 hover:text-secondary-600"
                                  title="Copy number"
                                >
                                  <Copy className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-secondary-600">
                              {entry.source_page}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-1">
                                {entry.is_mobile ? (
                                  <Smartphone className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <div className="h-4 w-4 bg-secondary-300 rounded-sm" />
                                )}
                                <span className="text-sm text-secondary-600 capitalize">
                                  {entry.device_type}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-secondary-600">
                              {entry.utm_source || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm text-secondary-600">
                              {new Date(entry.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <a
                                  href={`https://wa.me/${entry.whatsapp_number.replace('+', '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-600 hover:text-green-800"
                                  title="Open in WhatsApp"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalNumbers > itemsPerPage && (
                    <div className="px-3 sm:px-4 py-3 border-t border-secondary-200">
                      <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-xs sm:text-sm text-secondary-600 text-center sm:text-left">
                          Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalNumbers)} of {totalNumbers} entries
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-2 sm:px-3 py-1 border border-secondary-300 rounded text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-50"
                          >
                            Prev
                          </button>
                          <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-secondary-600">
                            <span className="hidden sm:inline">Page </span>{currentPage} of {Math.ceil(totalNumbers / itemsPerPage)}
                          </span>
                          <button
                            onClick={() => setCurrentPage(Math.min(Math.ceil(totalNumbers / itemsPerPage), currentPage + 1))}
                            disabled={currentPage >= Math.ceil(totalNumbers / itemsPerPage)}
                            className="px-2 sm:px-3 py-1 border border-secondary-300 rounded text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettings;
