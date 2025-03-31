import { defineConfig, ConfigEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // Changed from @vitejs/plugin-react
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

// Define a synchronous config function
export default defineConfig(async ({ mode }: ConfigEnv): Promise<UserConfig> => {
  const tagger = await loadTagger();
  
  return {
    server: {
      host: "::",
      port: 8080,
      allowedHosts: true,
    },
    plugins: [
      react({
        // Add options for React 19 compatibility
        jsxImportSource: undefined,
        include: "**/*.tsx",
        babel: {
          presets: [],
          plugins: [],
          babelrc: false,
          configFile: false,
        }
      }),
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
