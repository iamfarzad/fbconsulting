#!/bin/bash

FILES_TO_UPDATE=(
  "src/components/copilot/GeminiCopilot.tsx"
  "src/components/copilot/GeminiChat.tsx"
  "src/components/copilot/GeminiCopilotProvider.tsx"
  "src/hooks/useGeminiAPI.ts"
  "src/hooks/useGeminiService.ts"
  "src/components/hero/HeroChat.tsx"
  "src/components/chat/UnifiedChat.tsx"
)

for file in "${FILES_TO_UPDATE[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # First create the temp file with updates
    cat > temp_file << EOL
import { 
  GeminiAdapter,
  GeminiConfig,
  useGeminiMessageSubmission,
  useGeminiInitialization,
  useGeminiAudio,
} from '@/features/gemini';
EOL
    
    # Append the rest of the original file, skipping old imports
    sed '/^import.*gemini/d' "$file" >> temp_file
    
    # Replace the original file
    mv temp_file "$file"
    echo "✓ Updated $file"
  fi
done

# Create an index.ts file for the feature
cat > src/features/gemini/index.ts << EOL
// Core exports
export * from './services/geminiAdapter';
export * from './services/initialize';
export * from './services/formatters';

// Config exports
export * from './config/GeminiConfig';

// Hook exports
export * from './hooks/useGeminiMessageSubmission';
export * from './hooks/useGeminiInitialization';
export * from './hooks/useGeminiAudio';

// Type exports
export * from './types';
EOL

echo "Migration complete"
