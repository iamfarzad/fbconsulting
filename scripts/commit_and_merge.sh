#!/bin/bash

# Make the script executable if it's not already
chmod +x scripts/cleanup_duplicates.sh

# Add the cleanup script to git
git add scripts/cleanup_duplicates.sh

# Commit the changes
git commit -m "Add script to cleanup duplicate Gemini implementation files"

# If you want to merge to a specific branch (e.g., main or master)
# Uncomment and modify the following lines as needed:
# git checkout main
# git merge --no-ff -m "Merge duplicate code cleanup script" HEAD@{1}

echo "Commit complete! You can now push these changes or merge them to your target branch."
echo "To push to origin: git push origin <your-branch-name>"
