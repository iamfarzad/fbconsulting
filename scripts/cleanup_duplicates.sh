#!/bin/bash

echo "Starting duplicate files cleanup..."

# Create backup directory structure
mkdir -p ./backup_before_cleanup/src/hooks/gemini
mkdir -p ./backup_before_cleanup/src/components/gemini
mkdir -p ./backup_before_cleanup/src/services/gemini
mkdir -p ./backup_before_cleanup/api/gemini
mkdir -p ./backup_before_cleanup/src/features/gemini/hooks
mkdir -p ./backup_before_cleanup/src/pages/api/gemini
mkdir -p ./backup_before_cleanup/lib

# Backup files before deletion - Original duplicates
cp -v ./src/hooks/gemini/index.ts ./backup_before_cleanup/src/hooks/gemini/ 2>/dev/null || echo "File not found: ./src/hooks/gemini/index.ts"
cp -v ./src/hooks/gemini/useGeminiInitialization.ts ./backup_before_cleanup/src/hooks/gemini/ 2>/dev/null || echo "File not found: ./src/hooks/gemini/useGeminiInitialization.ts"
cp -v ./src/components/gemini/GeminiClient.tsx ./backup_before_cleanup/src/components/gemini/ 2>/dev/null || echo "File not found: ./src/components/gemini/GeminiClient.tsx"

# Backup files before deletion - Old/backup files
cp -v ./src/services/gemini/audio.ts.old ./backup_before_cleanup/src/services/gemini/ 2>/dev/null || echo "File not found: ./src/services/gemini/audio.ts.old"
cp -v ./src/features/gemini/hooks/useGeminiAudioPlayback.ts.old ./backup_before_cleanup/src/features/gemini/hooks/ 2>/dev/null || echo "File not found: ./src/features/gemini/hooks/useGeminiAudioPlayback.ts.old"
cp -v ./api/gemini/route.ts.bak ./backup_before_cleanup/api/gemini/ 2>/dev/null || echo "File not found: ./api/gemini/route.ts.bak"

# Additional duplicated functionality files
cp -v ./src/pages/api/gemini/transcribe.ts ./backup_before_cleanup/src/pages/api/gemini/ 2>/dev/null || echo "File not found: ./src/pages/api/gemini/transcribe.ts"
cp -v ./lib/geminiClient.ts ./backup_before_cleanup/lib/ 2>/dev/null || echo "File not found: ./lib/geminiClient.ts"

echo "Backups created in ./backup_before_cleanup/"

# Delete duplicate implementation files
echo "Deleting duplicate Gemini implementation files..."
rm -v ./src/hooks/gemini/index.ts 2>/dev/null || echo "File not found: ./src/hooks/gemini/index.ts"
rm -v ./src/hooks/gemini/useGeminiInitialization.ts 2>/dev/null || echo "File not found: ./src/hooks/gemini/useGeminiInitialization.ts"
rm -v ./src/components/gemini/GeminiClient.tsx 2>/dev/null || echo "File not found: ./src/components/gemini/GeminiClient.tsx"

# Delete backup/old files
echo "Deleting backup/old files..."
rm -v ./src/services/gemini/audio.ts.old 2>/dev/null || echo "File not found: ./src/services/gemini/audio.ts.old"
rm -v ./src/features/gemini/hooks/useGeminiAudioPlayback.ts.old 2>/dev/null || echo "File not found: ./src/features/gemini/hooks/useGeminiAudioPlayback.ts.old" 
rm -v ./api/gemini/route.ts.bak 2>/dev/null || echo "File not found: ./api/gemini/route.ts.bak"

# Delete additional duplicated functionality files
echo "Deleting additional duplicated functionality files..."
rm -v ./src/pages/api/gemini/transcribe.ts 2>/dev/null || echo "File not found: ./src/pages/api/gemini/transcribe.ts"
rm -v ./lib/geminiClient.ts 2>/dev/null || echo "File not found: ./lib/geminiClient.ts"

# Cleanup empty directories
find ./src -type d -empty -delete

echo "Cleanup complete!"
echo "If you need to restore any files, they are available in the ./backup_before_cleanup/ directory."
