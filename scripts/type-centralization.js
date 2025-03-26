/**
 * Type Centralization Helper
 * 
 * This script helps identify types that should be centralized in the src/types directory.
 * It does not automatically move the types but provides a report of types defined outside 
 * the types directory.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define the types we want to centralize
const coreTypes = [
  'AIMessage',
  'Message',
  'ChatMessage',
  'LeadInfo',
  'PersonaData',
  'GeminiConfig',
  'VoiceConfig',
  'ChatState',
  'UIChatState',
  'MessageFeedback',
];

// Directory to scan (excluding node_modules and build directories)
const rootDir = path.resolve(__dirname, '..');

// Prepare output report
let report = '# Type Centralization Report\n\n';
report += 'The following types should be moved to appropriate files in src/types/:\n\n';

// For each type, find where it's defined outside src/types directory
for (const typeName of coreTypes) {
  try {
    // Use grep to find type definitions
    const grepResult = execSync(
      `grep -r "type ${typeName}" --include="*.ts" --include="*.tsx" ${rootDir}/src | grep -v "src/types/"`,
      { encoding: 'utf8' }
    );
    
    if (grepResult.trim()) {
      report += `## ${typeName}\n\n`;
      report += 'Found in:\n';
      
      grepResult.split('\n').forEach(line => {
        if (line.trim()) {
          report += `- ${line.split(':')[0]}\n`;
        }
      });
      
      report += '\n';
    }
  } catch (error) {
    // If grep returns no results, that's fine
    if (error.status !== 1) {
      console.error(`Error searching for ${typeName}:`, error);
    }
  }
}

// Suggest new type file organization
report += '## Suggested Type File Organization\n\n';
report += '```\n';
report += 'src/types/\n';
report += '  ├── chat.ts        // AIMessage, Message, ChatMessage, MessageFeedback\n';
report += '  ├── voice.ts       // VoiceConfig, SpeechRecognitionState\n';
report += '  ├── gemini.ts      // GeminiConfig, GeminiResponse\n';
report += '  ├── ui.ts          // UIChatState, UIComponents\n';
report += '  ├── persona.ts     // PersonaData\n';
report += '  └── lead.ts        // LeadInfo\n';
report += '```\n\n';

report += '## Next Steps\n\n';
report += '1. Create the type files suggested above\n';
report += '2. Move each type to its appropriate file\n';
report += '3. Update imports across the codebase\n';
report += '4. Test the application to ensure nothing breaks\n';

// Write the report
fs.writeFileSync(path.join(rootDir, 'type-centralization-report.md'), report);
console.log('Type centralization report generated: type-centralization-report.md');
