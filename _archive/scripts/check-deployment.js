const fs = require('fs');
const path = require('path');

// Paths to check
const criticalFiles = [
  'api/gemini/audio.py',
  'src/hooks/useGeminiAudio.ts',
  'src/components/copilot/GeminiCopilotProvider.tsx',
  'vercel.json'
];

// Environment variables to check
const requiredEnvVars = [
  'GOOGLE_API_KEY'
];

console.log('🔍 Checking deployment readiness...');

// Check for critical files
console.log('\n📁 Checking critical files:');
const missingFiles = [];
criticalFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    missingFiles.push(filePath);
    console.log(`❌ Missing: ${filePath}`);
  } else {
    console.log(`✅ Found: ${filePath}`);
  }
});

// Check for environment variables
console.log('\n🔐 Checking environment variables:');
const missingEnvVars = [];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    missingEnvVars.push(envVar);
    console.log(`❌ Missing: ${envVar} (will be provided by Vercel secret)`);
  } else {
    console.log(`✅ Found: ${envVar}`);
  }
});

// Check Vercel configuration
console.log('\n⚙️ Checking Vercel configuration:');
let vercelConfig;
try {
  vercelConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'vercel.json'), 'utf8'));
  console.log('✅ vercel.json is valid JSON');
  
  // Check for API routes
  if (vercelConfig.routes && vercelConfig.routes.some(r => r.src && r.src.includes('/api/'))) {
    console.log('✅ API routes are configured');
  } else {
    console.log('❌ API routes not configured correctly');
  }
  
  // Check for Python runtime
  if (vercelConfig.functions && vercelConfig.functions['api/**/*.py']) {
    console.log('✅ Python runtime is configured');
  } else {
    console.log('❌ Python runtime not configured');
  }

  // Check for env variables
  if (vercelConfig.env && vercelConfig.env.GOOGLE_API_KEY) {
    console.log('✅ Environment variables referenced in config');
  } else {
    console.log('❌ Missing environment variable references');
  }
} catch (error) {
  console.log(`❌ Error reading or parsing vercel.json: ${error.message}`);
}

// Check for misplaced configuration files
console.log('\n🧹 Checking for misplaced configuration files:');
const misplacedConfigFiles = [
  'src/hooks/vercel.json'
];

misplacedConfigFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`⚠️ Found misplaced config: ${filePath}`);
    try {
      fs.unlinkSync(fullPath);
      console.log(`✅ Removed misplaced file: ${filePath}`);
    } catch (error) {
      console.log(`❌ Failed to remove ${filePath}: ${error.message}`);
    }
  } else {
    console.log(`✅ No misplaced config at: ${filePath}`);
  }
});

// Create a README for deployment
try {
  const deploymentReadme = `# Deployment Guide

## Prerequisites
- A Vercel account
- GitHub repository connected to Vercel
- Google API key stored as a Vercel secret

## Steps
1. Push code to GitHub
2. In Vercel dashboard, create a new project from the repository
3. Add environment variable:
   - GOOGLE_API_KEY (set to your Google Gemini Pro API key)
4. Deploy!

## Troubleshooting
- If audio doesn't work, check that the Python runtime is working
- Verify API routes are correctly configured
- Check browser console for any errors
`;

  fs.writeFileSync(path.join(process.cwd(), 'DEPLOYMENT.md'), deploymentReadme);
  console.log('✅ Created DEPLOYMENT.md guide');
} catch (error) {
  console.log(`❌ Error creating deployment guide: ${error.message}`);
}

// Summary
console.log('\n📊 Deployment Readiness Summary:');
if (missingFiles.length === 0 && vercelConfig) {
  console.log('✅ Configuration looks good! Ready to deploy to Vercel.');
  console.log('📝 See DEPLOYMENT.md for deployment instructions.');
} else {
  console.log('❌ Some checks failed. Please address the issues before deploying:');
  if (missingFiles.length > 0) {
    console.log(`  - Missing ${missingFiles.length} critical files`);
  }
  if (!vercelConfig) {
    console.log('  - Invalid Vercel configuration');
  }
}
