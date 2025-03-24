#!/bin/bash

echo "Searching for conflicting route files..."

# Find any route.ts files
TS_ROUTES=$(find /Users/farzad/windsurf_projects/fbconsulting -name "route.ts" | grep -v "node_modules")

# Display what we found
if [ -n "$TS_ROUTES" ]; then
  echo "Found the following TypeScript route files that may conflict:"
  echo "$TS_ROUTES"
  
  echo "Moving conflicting TypeScript routes to backup files..."
  for file in $TS_ROUTES; do
    mv "$file" "${file}.bak"
    echo "Moved $file to ${file}.bak"
  done
else
  echo "No conflicting TypeScript route files found."
fi

echo "Cleanup completed!"
