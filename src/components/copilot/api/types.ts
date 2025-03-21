// API Response Types
export interface StreamResponse {
  type: 'text' | 'error' | 'connection';
  content?: string;
  status?: 'connected' | 'error';
  error?: string;
}

export interface AudioResponse {
  type: 'audio';
  status: 'success' | 'error';
  data?: Blob;
  error?: string;
}

export interface VisionResponse {
  type: 'vision_response';
  content: string;
  error?: string;
}

// API Request Types
export interface ChatRequest {
  type: 'chat';
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: number;
  }>;
}

export interface AudioRequest {
  type: 'audio';
  text: string;
  config?: {
    voice: string;
    pitch?: number;
    rate?: number;
    volume?: number;
  };
}

export interface VisionRequest {
  type: 'vision';
  image_data: string; // base64 encoded image
  query: string;
}

// Websocket Message Types
export type WebSocketRequest = ChatRequest | AudioRequest | VisionRequest;
export type WebSocketResponse = StreamResponse | AudioResponse | VisionResponse;

// Fluid Compute Configuration
export interface FluidComputeConfig {
  memory?: number;
  maxDuration?: number;
  runtime?: string;
  fluidCompute?: boolean;
}

// API Error Types
export interface APIError {
  status: number;
  message: string;
  details?: Record<string, unknown>;
}

// Health Check Response
export interface HealthCheckResponse {
  status: boolean;
  message: string;
  version?: string;
  models?: string[];
}
