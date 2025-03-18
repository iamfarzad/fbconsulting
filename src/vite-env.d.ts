
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_COPILOT_RUNTIME_URL: string;
  readonly VITE_EMAIL_SERVICE_API_KEY: string;
  readonly VITE_LEAD_CAPTURE_ENDPOINT: string;
  // Add other environment variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
