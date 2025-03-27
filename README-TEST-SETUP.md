# Test Environment Setup

## Prerequisites

For running tests locally:

- **macOS**: Make sure Google Chrome is installed in `/Applications/Google Chrome.app/`
- **Linux/Windows**: Chrome or Chromium should be available in your system PATH

## Environment-specific Configuration

The test setup automatically detects your environment and uses appropriate configurations:

### CI Environment
- Uses headless browser with sandbox disabled
- Relies on installed Chrome/Chromium from GitHub Actions workflow

### Local Development
- On macOS: Uses installed Google Chrome
- On other platforms: Uses system's default Chrome/Chromium
- Runs in headless mode by default

## Running Tests

```bash
# Run tests
npm test

# Run tests with watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Troubleshooting

If you encounter browser-related errors:

1. For macOS users:
   - Ensure Google Chrome is installed in the default location
   - If using a different browser location, modify `src/test/setup.ts`

2. For Linux users:
   - Install Chrome or Chromium: `sudo apt-get install chromium-browser`

3. For Windows users:
   - Ensure Chrome is installed and available in your PATH

If issues persist, check the [Puppeteer troubleshooting guide](https://pptr.dev/troubleshooting).
