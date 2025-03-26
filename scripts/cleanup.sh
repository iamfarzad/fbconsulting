#!/bin/bash

echo "Starting codebase cleanup operations..."

# Create backup branch
echo "Creating backup branch..."
git checkout -b backup/pre-cleanup
git push origin backup/pre-cleanup
git checkout -

# Remove deprecated directories
echo "Removing deprecated directories..."
if [ -d "deprecated_backup" ]; then
  git rm -r deprecated_backup
  echo "Removed deprecated_backup directory"
fi

# Remove duplicate email service if it exists
if [ -f "src/services/email/emailService.ts" ] && [ -f "src/services/emailService.ts" ]; then
  echo "Found duplicate email service, removing..."
  git rm src/services/email/emailService.ts
fi

# Remove unused test pages
echo "Removing unused test pages..."
UNUSED_PAGES=(
  "src/pages/AIDemo.tsx"
  "src/pages/TestPage.tsx"
  "src/pages/TestMCP.tsx"
  "src/pages/TestGoogleAI.tsx"
  "src/pages/TestUnifiedChat.tsx"
)

for page in "${UNUSED_PAGES[@]}"; do
  if [ -f "$page" ]; then
    git rm "$page"
    echo "Removed $page"
  fi
done

# Identify potential duplicate components
echo "Identifying potential duplicate components (review needed):"
find src/components -name "*.tsx" | sort | grep -i "chat\|message\|input" | tee duplicate_candidates.txt

echo "Cleanup script completed. Please review duplicate_candidates.txt for potential component consolidation."
echo "Next steps: Manually review and consolidate duplicate components."
