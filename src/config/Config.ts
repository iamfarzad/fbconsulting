
/**
 * Application configuration singleton
 */
export class Config {
  private static instance: Config;
  
  // API configuration
  readonly api = {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    wsBaseUrl: import.meta.env.VITE_WS_BASE_URL || this.getDefaultWsUrl(),
    timeout: 30000,
    healthCheck: '/health',
    gemini: {
      chat: '/gemini/main',
      audio: '/gemini/audio',
      stream: '/gemini/stream',
      vision: '/gemini/vision'
    },
    websocket: {
      reconnectAttempts: 3,
      reconnectInterval: 2000,
      pingInterval: 30000
    }
  };
  
  // Feature flags
  readonly features = {
    voiceEnabled: true,
    analyticsEnabled: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    debugMode: import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true'
  };
  
  // Environment checks
  readonly environment = {
    isDev: import.meta.env.DEV === true,
    isProd: import.meta.env.PROD === true,
    mode: import.meta.env.MODE,
    buildTime: import.meta.env.VITE_BUILD_TIME || 'unknown',
    version: import.meta.env.VITE_APP_VERSION || '0.0.0'
  };
  
  private constructor() {
    // Initialize env-specific configuration
    if (this.environment.isDev) {
      console.log('Running in development mode');
    }
    
    // Log configuration for debug mode
    if (this.features.debugMode) {
      console.log('Config initialized:', {
        api: { ...this.api, wsBaseUrl: this.api.wsBaseUrl },
        features: this.features,
        environment: this.environment
      });
    }
  }
  
  /**
   * Get the singleton instance
   */
  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
  
  /**
   * Get a reasonable default WebSocket URL based on the current window location
   */
  private getDefaultWsUrl(): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/api`;
  }
  
  /**
   * Get API key from environment or local storage
   */
  public getApiKey(provider: string = 'gemini'): string | null {
    let apiKey = null;
    
    // Check environment variables first
    switch (provider.toLowerCase()) {
      case 'gemini':
      case 'google':
        apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY || null;
        break;
      case 'openai':
        apiKey = import.meta.env.VITE_OPENAI_API_KEY || null;
        break;
      case 'anthropic':
        apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || null;
        break;
    }
    
    // If no API key in environment, check localStorage
    if (!apiKey) {
      try {
        const storedConfig = localStorage.getItem(`${provider.toUpperCase()}_CONFIG`);
        if (storedConfig) {
          const config = JSON.parse(storedConfig);
          apiKey = config.apiKey || null;
        }
      } catch (e) {
        console.error(`Error retrieving ${provider} API key from localStorage:`, e);
      }
    }
    
    return apiKey;
  }
  
  /**
   * Save API key to localStorage
   */
  public saveApiKey(provider: string, apiKey: string, additionalConfig: Record<string, any> = {}): void {
    try {
      localStorage.setItem(`${provider.toUpperCase()}_CONFIG`, JSON.stringify({
        apiKey,
        ...additionalConfig,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error(`Error saving ${provider} API key to localStorage:`, e);
    }
  }
}

// Export singleton instance
export const config = Config.getInstance();
