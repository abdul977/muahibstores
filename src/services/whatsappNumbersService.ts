import { supabase } from '../lib/supabase';
import { visitorTrackingService, DeviceInfo } from './visitorTrackingService';

export interface WhatsAppNumberEntry {
  id: string;
  whatsapp_number: string;
  country_code: string;
  source_page: string;
  source_url: string;
  user_agent: string;
  ip_address?: string;
  browser_fingerprint: string;
  referrer: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  device_type: string;
  is_mobile: boolean;
  created_at: string;
  updated_at: string;
}

export interface WhatsAppSubmissionData {
  whatsappNumber: string;
  countryCode?: string;
}

export interface WhatsAppNumbersStats {
  totalNumbers: number;
  todayNumbers: number;
  weekNumbers: number;
  monthNumbers: number;
  mobilePercentage: number;
  topSources: Array<{ source: string; count: number }>;
  recentSubmissions: WhatsAppNumberEntry[];
}

export interface WhatsAppNumbersFilters {
  dateFrom?: string;
  dateTo?: string;
  sourcePage?: string;
  deviceType?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

class WhatsAppNumbersService {
  /**
   * Validate WhatsApp number format
   */
  validateWhatsAppNumber(number: string, countryCode: string = '+234'): { isValid: boolean; error?: string; formattedNumber?: string } {
    // Remove all non-digit characters except +
    const cleanNumber = number.replace(/[^\d+]/g, '');
    
    // Check if it starts with country code
    let formattedNumber = cleanNumber;
    if (!cleanNumber.startsWith('+')) {
      // If no country code, add default
      if (cleanNumber.startsWith('0')) {
        // Remove leading 0 and add country code
        formattedNumber = countryCode + cleanNumber.substring(1);
      } else if (cleanNumber.startsWith('234')) {
        // Already has 234, just add +
        formattedNumber = '+' + cleanNumber;
      } else {
        // Add full country code
        formattedNumber = countryCode + cleanNumber;
      }
    }

    // Validate Nigerian number format (+234XXXXXXXXXX)
    const nigerianPattern = /^\+234[789][01]\d{8}$/;
    
    if (!nigerianPattern.test(formattedNumber)) {
      return {
        isValid: false,
        error: 'Please enter a valid Nigerian WhatsApp number (e.g., 08012345678 or +2348012345678)'
      };
    }

    return {
      isValid: true,
      formattedNumber
    };
  }

  /**
   * Submit WhatsApp number
   */
  async submitWhatsAppNumber(data: WhatsAppSubmissionData): Promise<{ success: boolean; error?: string }> {
    try {
      // Validate the number
      const validation = this.validateWhatsAppNumber(data.whatsappNumber, data.countryCode);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Get visitor and device information
      const visitorStats = visitorTrackingService.getVisitorStats();
      const deviceInfo = visitorStats.deviceInfo;
      const pageInfo = visitorStats.pageInfo;
      const utmParams = visitorStats.utmParams;

      // Prepare submission data
      const submissionData = {
        whatsapp_number: validation.formattedNumber!,
        country_code: data.countryCode || '+234',
        source_page: pageInfo.pathname,
        source_url: pageInfo.url,
        user_agent: deviceInfo.userAgent,
        browser_fingerprint: visitorStats.visitorInfo.browserFingerprint,
        referrer: pageInfo.referrer,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
        device_type: deviceInfo.deviceType,
        is_mobile: deviceInfo.isMobile
      };

      // Check if this number was already submitted recently (within 24 hours)
      const { data: existingEntries, error: checkError } = await supabase
        .from('visitor_whatsapp_numbers')
        .select('id, created_at')
        .eq('whatsapp_number', validation.formattedNumber)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .limit(1);

      if (checkError) {
        console.error('Error checking existing entries:', checkError);
        return { success: false, error: 'Failed to validate submission. Please try again.' };
      }

      if (existingEntries && existingEntries.length > 0) {
        return { success: false, error: 'This WhatsApp number was already submitted recently.' };
      }

      // Insert the new entry
      const { error: insertError } = await supabase
        .from('visitor_whatsapp_numbers')
        .insert([submissionData]);

      if (insertError) {
        console.error('Error inserting WhatsApp number:', insertError);
        return { success: false, error: 'Failed to save your WhatsApp number. Please try again.' };
      }

      // Mark as submitted in visitor tracking
      visitorTrackingService.markWhatsAppSubmitted();

      return { success: true };
    } catch (error) {
      console.error('Error submitting WhatsApp number:', error);
      return { success: false, error: 'An unexpected error occurred. Please try again.' };
    }
  }

  /**
   * Get WhatsApp numbers with filters and pagination
   */
  async getWhatsAppNumbers(filters: WhatsAppNumbersFilters = {}): Promise<{
    data: WhatsAppNumberEntry[];
    total: number;
    error?: string;
  }> {
    try {
      let query = supabase
        .from('visitor_whatsapp_numbers')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }
      if (filters.sourcePage) {
        query = query.eq('source_page', filters.sourcePage);
      }
      if (filters.deviceType) {
        query = query.eq('device_type', filters.deviceType);
      }
      if (filters.search) {
        query = query.or(`whatsapp_number.ilike.%${filters.search}%,source_page.ilike.%${filters.search}%`);
      }

      // Apply pagination
      if (filters.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1);
      } else if (filters.limit) {
        query = query.limit(filters.limit);
      }

      // Order by created_at descending
      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        console.error('Error fetching WhatsApp numbers:', error);
        return { data: [], total: 0, error: 'Failed to fetch WhatsApp numbers' };
      }

      return {
        data: data || [],
        total: count || 0
      };
    } catch (error) {
      console.error('Error in getWhatsAppNumbers:', error);
      return { data: [], total: 0, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Get WhatsApp numbers statistics
   */
  async getWhatsAppNumbersStats(): Promise<WhatsAppNumbersStats> {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get total count
      const { count: totalNumbers } = await supabase
        .from('visitor_whatsapp_numbers')
        .select('*', { count: 'exact', head: true });

      // Get today's count
      const { count: todayNumbers } = await supabase
        .from('visitor_whatsapp_numbers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Get week count
      const { count: weekNumbers } = await supabase
        .from('visitor_whatsapp_numbers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      // Get month count
      const { count: monthNumbers } = await supabase
        .from('visitor_whatsapp_numbers')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthAgo.toISOString());

      // Get mobile percentage
      const { count: mobileCount } = await supabase
        .from('visitor_whatsapp_numbers')
        .select('*', { count: 'exact', head: true })
        .eq('is_mobile', true);

      const mobilePercentage = totalNumbers ? Math.round((mobileCount || 0) / totalNumbers * 100) : 0;

      // Get top sources
      const { data: sourcesData } = await supabase
        .from('visitor_whatsapp_numbers')
        .select('source_page')
        .limit(1000);

      const sourceCounts: { [key: string]: number } = {};
      sourcesData?.forEach(entry => {
        sourceCounts[entry.source_page] = (sourceCounts[entry.source_page] || 0) + 1;
      });

      const topSources = Object.entries(sourceCounts)
        .map(([source, count]) => ({ source, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Get recent submissions
      const { data: recentSubmissions } = await supabase
        .from('visitor_whatsapp_numbers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      return {
        totalNumbers: totalNumbers || 0,
        todayNumbers: todayNumbers || 0,
        weekNumbers: weekNumbers || 0,
        monthNumbers: monthNumbers || 0,
        mobilePercentage,
        topSources,
        recentSubmissions: recentSubmissions || []
      };
    } catch (error) {
      console.error('Error getting WhatsApp numbers stats:', error);
      return {
        totalNumbers: 0,
        todayNumbers: 0,
        weekNumbers: 0,
        monthNumbers: 0,
        mobilePercentage: 0,
        topSources: [],
        recentSubmissions: []
      };
    }
  }

  /**
   * Export WhatsApp numbers to CSV format
   */
  async exportWhatsAppNumbers(filters: WhatsAppNumbersFilters = {}): Promise<string> {
    const { data } = await this.getWhatsAppNumbers({ ...filters, limit: 10000 });
    
    const headers = [
      'WhatsApp Number',
      'Country Code',
      'Source Page',
      'Device Type',
      'Is Mobile',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign',
      'Referrer',
      'Created At'
    ];

    const csvRows = [
      headers.join(','),
      ...data.map(entry => [
        entry.whatsapp_number,
        entry.country_code,
        entry.source_page,
        entry.device_type,
        entry.is_mobile ? 'Yes' : 'No',
        entry.utm_source || '',
        entry.utm_medium || '',
        entry.utm_campaign || '',
        entry.referrer,
        new Date(entry.created_at).toLocaleString()
      ].map(field => `"${field}"`).join(','))
    ];

    return csvRows.join('\n');
  }

  /**
   * Delete a WhatsApp number entry
   */
  async deleteWhatsAppNumber(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('visitor_whatsapp_numbers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting WhatsApp number:', error);
        return { success: false, error: 'Failed to delete entry' };
      }

      return { success: true };
    } catch (error) {
      console.error('Error in deleteWhatsAppNumber:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }
}

export const whatsappNumbersService = new WhatsAppNumbersService();
