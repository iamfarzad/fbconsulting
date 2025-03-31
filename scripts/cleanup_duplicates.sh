#!/bin/bash

echo "Checking for any remaining duplicate files..."

# Define patterns to search for
PATTERNS=(
  "*WebSocket*.ts"
  "*Voice*.ts"
  "*Audio*.ts"
  "Unified*.tsx"
)

# Search for potential duplicates
for pattern in "${PATTERNS[@]}"; do
  echo "Checking for $pattern..."
  find src -type f -name "$pattern" -not -path "*/VoiceUI.tsx" -not -path "*/VoicePanel.tsx" -not -path "*/VoiceDemo.tsx"
done

echo "Only keeping core voice components:"
echo "- src/components/VoiceUI.tsx"
echo "- src/components/voice/VoicePanel.tsx"
echo "- src/components/VoiceDemo.tsx"
echo "- src/types/voice.ts"

echo "Cleanup script completed!"
