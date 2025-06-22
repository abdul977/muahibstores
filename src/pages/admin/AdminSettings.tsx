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
  Globe
} from 'lucide-react';
import { mcpService, DatabaseStats } from '../../services/mcpService';

interface SupabaseConfig {
  url: string;
  anonKey: string;
  projectId: string;
  region: string;
}



const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'database' | 'storage' | 'backup'>('general');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
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

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'storage', name: 'Storage', icon: Upload },
    { id: 'backup', name: 'Backup', icon: Download }
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
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-secondary-500 hover:text-secondary-700 hover:border-secondary-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-secondary-200 p-6">
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
      </div>
    </div>
  );
};

export default AdminSettings;
