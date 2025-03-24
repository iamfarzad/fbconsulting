const fs = require('fs');
const path = require('path');

// Files that should be in the root directory only
const rootOnlyFiles = [
  'vercel.json',
  '.env',
  'package.json',
  'tsconfig.json'
];

// Directories to scan for misplaced config files
const dirsToScan = [
  'src',
  'src/hooks',
  'src/components',
  'api'
];

console.log('🧹 Cleaning up misplaced configuration files...');

// Check each directory for misplaced config files
dirsToScan.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  
  if (fs.existsSync(dirPath) && fs.lstatSync(dirPath).isDirectory()) {
    console.log(`\nScanning ${dir}...`);
    
    const files = fs.readdirSync(dirPath);
    
    rootOnlyFiles.forEach(configFile => {
      if (files.includes(configFile)) {
        const misplacedPath = path.join(dirPath, configFile);
        console.log(`⚠️ Found misplaced: ${misplacedPath}`);
        
        try {
          const content = fs.readFileSync(misplacedPath, 'utf8');
          console.log(`- Content preview: ${content.substring(0, 50)}...`);
          
          // Create backup before removing
          const backupPath = path.join(process.cwd(), 'deprecated_backup', `${dir.replace(/\//g, '_')}_${configFile}`);
          fs.mkdirSync(path.dirname(backupPath), { recursive: true });
          fs.writeFileSync(backupPath, content);
          console.log(`✅ Backed up to: ${backupPath}`);
          
          // Remove the misplaced file
          fs.unlinkSync(misplacedPath);
          console.log(`✅ Removed misplaced file: ${misplacedPath}`);
        } catch (error) {
          console.log(`❌ Error handling ${misplacedPath}: ${error.message}`);
        }
      }
    });
  }
});

console.log('\n✅ Cleanup complete! All configuration files should now be in their correct locations.');
```

To run this cleanup script:
node scripts/cleanup-config.js
