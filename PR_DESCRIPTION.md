# Gemini Feature Consolidation

This PR consolidates all Gemini-related code into a cohesive feature module under `src/features/gemini`.

## Changes

### File Structure Changes
- Created new feature directory: `src/features/gemini/`
- Organized code into subdirectories:
  - `config/` - Configuration components
  - `hooks/` - Custom hooks
  - `services/` - Core services
  - `types/` - TypeScript types

### Code Consolidation
- Moved and consolidated duplicated code from:
  - `src/services/gemini`
  - `src/services/chat`
  - `src/services/copilot`
  - `src/hooks/gemini`
  - `src/components/copilot/core`

### Import Updates
- Updated all imports to use the new consolidated paths
- Created barrel files for clean exports
- Simplified imports through main feature index

## Testing
- Ensure all Gemini functionality continues to work
- Verify chat features are working
- Test audio and multimodal features
- Check configuration components

## Migration Guide
For any components using the old imports:

```typescript
// Old imports
import { useGeminiService } from "src/hooks/gemini/useGeminiService";
import { GoogleGenAIAdapter } from "src/services/copilot/googleGenAIAdapter";

// New imports
import { useGeminiService, GeminiAdapter } from "@/features/gemini";
```

## Next Steps
- [ ] Remove any remaining dead code
- [ ] Update documentation
- [ ] Add tests for consolidated features
