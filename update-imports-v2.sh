#!/bin/bash

echo "Finding files with Gemini-related imports..."

# Find all TypeScript/TSX files that need updating
FOUND_FILES=$(find src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "from.*[@/]\(services\|hooks\|components\)/\(gemini\|chat\|copilot\)" {} \;)

for file in $FOUND_FILES; do
  echo "Updating imports in $file"
  
  # Create a backup
  cp "$file" "$file.bak"
  
  # Update all import paths
  sed -i '' \
    -e 's|from ".*\/services\/gemini|from "@/features/gemini/services|g' \
    -e 's|from ".*\/services\/chat|from "@/features/gemini/types|g' \
    -e 's|from ".*\/services\/copilot|from "@/features/gemini/services|g' \
    -e 's|from ".*\/hooks\/gemini|from "@/features/gemini/hooks|g' \
    -e 's|from ".*\/components\/copilot\/core|from "@/features/gemini/config|g' \
    -e 's|from ".*\/components\/copilot\/providers|from "@/features/gemini/config|g' \
    "$file"
    
  # Compare files to see if changes were made
  if ! cmp -s "$file" "$file.bak"; then
    echo "✓ Updated $file"
  else
    echo "- No changes needed in $file"
  fi
  
  # Remove backup
  rm "$file.bak"
done

echo "Import updates complete"
