
import { defineConfig, ConfigEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Use dynamic import for ESM modules in development
const loadTagger = async () => {
  if (process.env.NODE_ENV === 'development') {
    try {
      // Use dynamic import to handle ESM module
      const taggerModule = await import("lovable-tagger").catch(() => null);
      return taggerModule?.componentTagger ? taggerModule.componentTagger() : null;
    } catch (e) {
      console.warn('Failed to load lovable-tagger:', e);
      return null;
    }
  }
  return null;
};

export default defineConfig(async ({ mode }: ConfigEnv): Promise<UserConfig> => {
  const tagger = await loadTagger();
  
  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: 'all', // This allows any host to connect, including lovableproject.com
    },
    plugins: [
      react(),
      // Only include tagger in development and only if it loaded successfully
      mode === 'development' && tagger,
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Keep essential environment variables
    envPrefix: ['VITE_', 'AZURE_', 'ELEVENLABS_', 'GOOGLE_'],
    build: {
      sourcemap: true,
    }
  };
});
