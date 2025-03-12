
/**
 * MCP Client Service
 * Handles API communication with Smithery.ai MCP servers
 */

import { Context } from '../core/types';

// API configuration for MCP servers
interface MCPServerConfig {
  baseUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

// Response from MCP server queries
export interface MCPServerResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Context for MCP client operations
export interface MCPClientContext extends Context {
  servers: Record<string, MCPServerConfig>;
  defaultTimeout: number;
}

// Default configuration for MCP client
const DEFAULT_CONFIG: MCPClientContext = {
  servers: {
    linkedIn: {
      baseUrl: 'https://smithery.ai/server/mcp-linkedin',
      headers: {
        'Content-Type': 'application/json',
      }
    },
    webResearch: {
      baseUrl: 'https://smithery.ai/server/@chuanmingliu/mcp-webresearch',
      headers: {
        'Content-Type': 'application/json',
      }
    },
    browserbase: {
      baseUrl: 'https://smithery.ai/server/browserbase',
      headers: {
        'Content-Type': 'application/json',
      }
    },
    beyond: {
      baseUrl: 'https://smithery.ai/server/beyond',
      headers: {
        'Content-Type': 'application/json',
      }
    }
  },
  defaultTimeout: 30000, // 30 seconds
};

/**
 * MCP Client class for interacting with Smithery.ai MCP servers
 */
export class MCPClient {
  private context: MCPClientContext;

  constructor(context: Partial<MCPClientContext> = {}) {
    this.context = {
      ...DEFAULT_CONFIG,
      ...context,
      servers: {
        ...DEFAULT_CONFIG.servers,
        ...(context.servers || {})
      }
    };
  }

  /**
   * Set API key for a specific server
   */
  public setApiKey(serverName: string, apiKey: string): void {
    if (this.context.servers[serverName]) {
      this.context.servers[serverName].apiKey = apiKey;
    } else {
      console.warn(`Server "${serverName}" not found in configuration`);
    }
  }

  /**
   * Make a request to a MCP server
   */
  public async request<T = any>(
    serverName: string,
    endpoint: string,
    payload: any,
    options: RequestInit = {}
  ): Promise<MCPServerResponse<T>> {
    const server = this.context.servers[serverName];
    
    if (!server) {
      return {
        success: false,
        error: `Server "${serverName}" not found in configuration`
      };
    }

    const url = `${server.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...server.headers,
          ...(server.apiKey ? { 'Authorization': `Bearer ${server.apiKey}` } : {}),
        },
        body: JSON.stringify(payload),
        signal: options.signal || 
          AbortSignal.timeout(options.signal ? undefined : this.context.defaultTimeout),
        ...options
      });

      if (!response.ok) {
        return {
          success: false,
          error: `HTTP error ${response.status}: ${response.statusText}`
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      };
    }
  }

  /**
   * Query LinkedIn profile data
   */
  public async queryLinkedIn(profileUrl: string): Promise<MCPServerResponse> {
    return this.request('linkedIn', '/query', {
      profile_url: profileUrl
    });
  }

  /**
   * Research website content
   */
  public async researchWebsite(websiteUrl: string, query?: string): Promise<MCPServerResponse> {
    return this.request('webResearch', '/search', {
      url: websiteUrl,
      query: query || 'company information, size, industry, services'
    });
  }

  /**
   * Take screenshot of a website using browserbase
   */
  public async takeWebsiteScreenshot(websiteUrl: string): Promise<MCPServerResponse> {
    return this.request('browserbase', '/screenshot', {
      url: websiteUrl
    });
  }

  /**
   * Get social data using beyond MCP
   */
  public async getSocialData(profileId: string, platform: 'linkedin' | 'twitter' = 'linkedin'): Promise<MCPServerResponse> {
    return this.request('beyond', '/social/profile', {
      platform,
      profile_id: profileId
    });
  }
}

// Export singleton instance with default configuration
export const mcpClient = new MCPClient();
