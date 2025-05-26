import { defineConfig, ConfigEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Define a synchronous config function
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: true,
    },
    plugins: [
      react(),
      // lovable-tagger related plugin removed
    ].filter(Boolean), // filter(Boolean) might be removable if no other conditional plugins
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
