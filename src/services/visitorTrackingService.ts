/**
 * Service for tracking first-time visitors and managing popup display
 */

export interface VisitorInfo {
  isFirstTime: boolean;
  visitCount: number;
  firstVisitDate: string;
  lastVisitDate: string;
  hasSeenPopup: boolean;
  popupShownDate?: string;
  whatsappSubmitted: boolean;
  whatsappSubmittedDate?: string;
  browserFingerprint: string;
}

export interface DeviceInfo {
  userAgent: string;
  isMobile: boolean;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  screenWidth: number;
  screenHeight: number;
  timezone: string;
}

class VisitorTrackingService {
  private readonly STORAGE_KEY = 'muahib_visitor_info';
  private readonly POPUP_COOLDOWN_DAYS = 30; // Show popup again after 30 days if not submitted

  /**
   * Generate a simple browser fingerprint
   */
  private generateBrowserFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Get device information
   */
  getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    if (/iPad|Android(?!.*Mobile)/i.test(userAgent)) {
      deviceType = 'tablet';
    } else if (isMobile) {
      deviceType = 'mobile';
    }

    return {
      userAgent,
      isMobile,
      deviceType,
      screenWidth: screen.width,
      screenHeight: screen.height,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }

  /**
   * Get current visitor information
   */
  getVisitorInfo(): VisitorInfo {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as VisitorInfo;
        // Update last visit date
        parsed.lastVisitDate = new Date().toISOString();
        parsed.visitCount += 1;
        this.saveVisitorInfo(parsed);
        return parsed;
      }
    } catch (error) {
      console.warn('Error reading visitor info from localStorage:', error);
    }

    // First-time visitor
    const newVisitorInfo: VisitorInfo = {
      isFirstTime: true,
      visitCount: 1,
      firstVisitDate: new Date().toISOString(),
      lastVisitDate: new Date().toISOString(),
      hasSeenPopup: false,
      whatsappSubmitted: false,
      browserFingerprint: this.generateBrowserFingerprint()
    };

    this.saveVisitorInfo(newVisitorInfo);
    return newVisitorInfo;
  }

  /**
   * Save visitor information to localStorage
   */
  private saveVisitorInfo(info: VisitorInfo): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(info));
    } catch (error) {
      console.warn('Error saving visitor info to localStorage:', error);
    }
  }

  /**
   * Check if popup should be shown
   */
  shouldShowPopup(): boolean {
    const visitorInfo = this.getVisitorInfo();
    
    // Don't show if WhatsApp already submitted
    if (visitorInfo.whatsappSubmitted) {
      return false;
    }

    // Don't show if popup was shown recently (within cooldown period)
    if (visitorInfo.hasSeenPopup && visitorInfo.popupShownDate) {
      const popupDate = new Date(visitorInfo.popupShownDate);
      const daysSincePopup = (Date.now() - popupDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSincePopup < this.POPUP_COOLDOWN_DAYS) {
        return false;
      }
    }

    return true;
  }

  /**
   * Mark popup as shown
   */
  markPopupShown(): void {
    const visitorInfo = this.getVisitorInfo();
    visitorInfo.hasSeenPopup = true;
    visitorInfo.popupShownDate = new Date().toISOString();
    visitorInfo.isFirstTime = false;
    this.saveVisitorInfo(visitorInfo);
  }

  /**
   * Mark WhatsApp number as submitted
   */
  markWhatsAppSubmitted(): void {
    const visitorInfo = this.getVisitorInfo();
    visitorInfo.whatsappSubmitted = true;
    visitorInfo.whatsappSubmittedDate = new Date().toISOString();
    visitorInfo.isFirstTime = false;
    this.saveVisitorInfo(visitorInfo);
  }

  /**
   * Get page information for tracking
   */
  getPageInfo() {
    return {
      url: window.location.href,
      pathname: window.location.pathname,
      referrer: document.referrer || 'direct',
      title: document.title
    };
  }

  /**
   * Get UTM parameters from URL
   */
  getUTMParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      utm_source: urlParams.get('utm_source'),
      utm_medium: urlParams.get('utm_medium'),
      utm_campaign: urlParams.get('utm_campaign'),
      utm_term: urlParams.get('utm_term'),
      utm_content: urlParams.get('utm_content')
    };
  }

  /**
   * Reset visitor tracking (for testing purposes)
   */
  resetVisitorTracking(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.warn('Error resetting visitor tracking:', error);
    }
  }

  /**
   * Get visitor statistics for admin
   */
  getVisitorStats() {
    const visitorInfo = this.getVisitorInfo();
    const deviceInfo = this.getDeviceInfo();
    const pageInfo = this.getPageInfo();
    const utmParams = this.getUTMParameters();

    return {
      visitorInfo,
      deviceInfo,
      pageInfo,
      utmParams
    };
  }
}

export const visitorTrackingService = new VisitorTrackingService();
