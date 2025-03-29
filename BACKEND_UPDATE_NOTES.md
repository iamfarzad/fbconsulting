
# Backend Update for Frontend Integration

## Backend Changes (v0.2.0)

- ✨ **Multimodal Support Added:** The backend now accepts messages with text and/or files (images, PDFs, etc.). See format below.
- ⚙️ **Internal Refinements:** Further improvements to WebSocket handling and logging.
- ✅ **Environment Stable:** Backend runs reliably in IDX.

## Frontend Build Troubleshooting (In Progress)

We identified that PostCSS errors were occurring due to complex `@apply` usage in global CSS files (like `base.css`, `voice-ui.css`, `glassmorphism.css`). Using `@apply` with CSS variables, opacity modifiers, responsive modifiers, or custom classes within these files seems problematic for the build process.

**Recent Fixes Pushed:**
- Corrected `postcss.config.cjs` to use `@tailwindcss/postcss`.
- Replaced most `@apply` rules in `src/styles/base.css` with direct CSS or media queries.
- Replaced most `@apply` rules in `src/styles/voice-ui.css` with direct CSS.
- **Latest Fix (Just Pushed):** Refactored `src/styles/glassmorphism.css`: renamed `.glassmorphism` to `.glassmorphism-base` and removed the `.frosted-glass` and `.glass-card` classes that used `@apply glassmorphism`.

**Action Required for Frontend:**
- Pull the latest `main` branch.
- **Update Components:** Search the frontend codebase for usages of the CSS classes `frosted-glass` and `glass-card`. Replace them by applying utility classes directly in the components. You might use the `.glassmorphism-base` class along with other utilities like `rounded-xl`, `p-6`, `border`, `border-white/10`, etc., as needed.
  *Example: `<div className="frosted-glass">` might become `<div className="glassmorphism-base rounded-xl border border-white/10">`.*
- **Restart & Check:** Restart the Vite dev server (`web` preview) and verify if the build errors are resolved.

## Using Multimodal Input

(Format definition as before...)

```json
{
  "type": "multimodal_message",
  "text": "Optional description...",
  "files": [
    {
      "mime_type": "image/jpeg", 
      "data": "BASE64_ENCODED_FILE_DATA", 
      "filename": "optional_image_name.jpg"
    }
  ],
  "role": "user", 
  "enableTTS": true 
}
```

**Key Points:**
(Details as before...)

## Previous Q&A Summary

(Summary as before...)

---

Please update components as described above after pulling. Let us know the build status!
