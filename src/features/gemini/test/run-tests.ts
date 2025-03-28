import { run } from 'vitest/node';

async function runTests() {
  try {
    const result = await run({
      include: ['src/features/gemini/test/**/*.test.ts'],
      coverage: {
        reporter: ['text', 'json', 'html'],
        exclude: ['**/node_modules/**', '**/test/**']
      },
      environment: 'jsdom'
    });

    if (result.errors.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Test runner error:', error);
    process.exit(1);
  }
}

runTests();
