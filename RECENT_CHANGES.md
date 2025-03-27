# Recent Configuration Changes

## Python Runtime & Build Settings
1. Unified Python version to 3.12
   - Updated vercel.json build configuration
   - Added runtime.txt specification
   - Removed conflicting vercel.config.json

## Dependencies
2. Synchronized requirements.txt across all services:
   - Root requirements.txt
   - api/gemini/requirements.txt
   - api/gemini_image/requirements.txt
   - api/gemini_document/requirements.txt

## Configuration
3. Updated Vercel Configuration
   - Added proper build settings
   - Fixed invalid JSON schema properties (removed fluidCompute)
   - Set memory and duration limits

## Documentation
4. Added API Documentation
   - Created api/README.md
   - Documented deployment configuration
   - Added environment variable requirements

## Directory Structure
5. Organized Project Structure
   - Core Gemini endpoints in api/gemini/
   - Image processing in api/gemini_image/
   - Document processing in api/gemini_document/

## Test Environment
6. Fixed CI Test Environment
   - Added Puppeteer dependencies to GitHub Actions workflow
   - Configured Puppeteer for CI environment
   - Fixed type issues in test setup
   - Added proper browser launch configuration for headless testing

7. Enhanced Test Configuration
   - Updated vitest configuration for proper CI support
   - Added environment test suite
   - Fixed dependency issues with @vitejs/plugin-react-swc
   - Added support for both local and CI test environments
   - Configured GitHub Actions to run tests on main and development branches
