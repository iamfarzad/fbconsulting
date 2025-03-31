#!/bin/bash

echo "Checking for any remaining duplicate files..."

# Define core components that should be kept
CORE_COMPONENTS=(
  "./src/components/VoiceUI.tsx"
  "./src/components/voice/VoicePanel.tsx"
  "./src/components/VoiceDemo.tsx"
  "./src/types/voice.ts"
)

# Function to check if path is a core component
is_core_component() {
  local check_path=$1
  for core in "${CORE_COMPONENTS[@]}"; do
    if [[ "$check_path" == "$core" ]]; then
      return 0
    fi
  done
  return 1
}

echo -e "\nSearching for potential duplicate files..."

# Check for WebSocket files
echo -e "\nChecking WebSocket files:"
find src -type f -name "*WebSocket*.ts" -o -name "*WebSocket*.tsx" 2>/dev/null

# Check for Voice files
echo -e "\nChecking Voice files:"
find src -type f -name "*Voice*.ts" -o -name "*Voice*.tsx" 2>/dev/null | while read -r file; do
  if ! is_core_component "$file"; then
    echo "Potential duplicate: $file"
  fi
done

# Check for Audio files
echo -e "\nChecking Audio files:"
find src -type f -name "*Audio*.ts" -o -name "*Audio*.tsx" 2>/dev/null

# Check for Unified files
echo -e "\nChecking Unified files:"
find src -type f -name "Unified*.ts" -o -name "Unified*.tsx" 2>/dev/null

echo -e "\nCore components that should be kept:"
printf '%s\n' "${CORE_COMPONENTS[@]}"

echo -e "\nCleanup check completed!"
