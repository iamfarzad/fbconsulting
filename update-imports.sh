#!/bin/bash

# Common files to update
FILES_TO_UPDATE=(
  "src/components/gemini/GeminiClient.tsx"
  "src/components/copilot/providers/GeminiProvider.tsx"
  "src/components/copilot/GeminiCopilot.tsx"
  "src/components/copilot/GeminiChat.tsx"
  "src/hooks/useGeminiService.ts"
  "src/hooks/useGeminiAPI.ts"
  "src/components/chat/UnifiedChat.tsx"
)

for file in "${FILES_TO_UPDATE[@]}"; do
  if [ -f "$file" ]; then
    # Update import paths
    sed -i '' \
      -e 's|from ".*\/services\/gemini|from "@/features/gemini/services|g' \
      -e 's|from ".*\/services\/chat|from "@/features/gemini/types|g' \
      -e 's|from ".*\/services\/copilot|from "@/features/gemini/services|g' \
      -e 's|from ".*\/hooks\/gemini|from "@/features/gemini/hooks|g' \
      -e 's|from ".*\/components\/copilot\/core|from "@/features/gemini/config|g' \
      "$file"
    echo "Updated imports in $file"
  fi
done
