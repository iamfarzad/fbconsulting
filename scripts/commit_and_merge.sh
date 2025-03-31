#!/bin/bash

# Check if cleanup was successful
if [ ! -d "./backup_before_cleanup" ]; then
  echo "No backup directory found. Have you run the cleanup script yet?"
  read -p "Do you want to run the cleanup script first? (y/n): " run_cleanup
  if [[ "$run_cleanup" == "y" || "$run_cleanup" == "Y" ]]; then
    ./scripts/cleanup_duplicates.sh
    # Exit if cleanup was aborted
    if [ $? -ne 0 ]; then
      echo "Commit aborted because cleanup was aborted or failed."
      exit 1
    fi
  fi
fi

# Make the script executable if it's not already
chmod +x scripts/cleanup_duplicates.sh

# Add the cleanup script to git
git add scripts/cleanup_duplicates.sh scripts/commit_and_merge.sh

# Check for any deleted files that need to be included in the commit
echo "Checking for deleted files to include in commit..."
DELETED_FILES=$(git status --porcelain | grep '^ D' | awk '{print $2}')

if [ -n "$DELETED_FILES" ]; then
  echo "Adding deleted files to commit:"
  echo "$DELETED_FILES"
  git add --all
fi

# Commit the changes
git commit -m "Add script to cleanup duplicate Gemini files

- Removes deprecated implementation files in src/hooks/gemini
- Removes duplicate GeminiClient component  
- Cleans up .old and .bak files
- Consolidates duplicate type definitions
- Removes lib/geminiClient.ts in favor of feature module implementation
- Updates directory structure to reflect features/gemini as the single source of truth"

# If you want to merge to a specific branch (e.g., main or master)
# Uncomment and modify the following lines as needed:
# git checkout main
# git merge --no-ff -m "Merge duplicate code cleanup script" HEAD@{1}

echo "Commit complete! You can now push these changes or merge them to your target branch."
echo "To push to origin: git push origin <your-branch-name>"

# Remind to test the application
echo ""
echo "REMINDER: Make sure to test the application thoroughly after cleanup!"
echo "If you encounter any issues, restore from backup: cp -R ./backup_before_cleanup/* ./"
