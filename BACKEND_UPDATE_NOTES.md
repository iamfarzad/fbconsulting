
# Backend Update for Frontend Integration

## Backend Changes (v0.2.0)

- ✨ **Multimodal Support Added:** The backend now accepts messages with text and/or files (images, PDFs, etc.). See format below.
- ⚙️ **Internal Refinements:** Further improvements to WebSocket handling and logging.
- ✅ **Environment Stable:** Backend runs reliably in IDX.

## Frontend Build Troubleshooting (In Progress)

We noticed the frontend build (`npm run dev`) is encountering PostCSS errors related to using `@apply` within base CSS layers (`src/styles/base.css`). This seems to be an issue with how PostCSS/Tailwind resolves utilities that depend on CSS variables or responsive modifiers inside `@layer base`.

**Recent Fixes Pushed:**
- Corrected `postcss.config.cjs` to use `@tailwindcss/postcss`.
- Attempted to replace problematic `@apply` rules in `src/styles/base.css` and `src/styles/voice-ui.css` with direct CSS or media queries.
- **Latest Attempt (Just Pushed):** Removed most `@apply` rules for typography (h1-h4, p, etc.) from `@layer base` in `src/styles/base.css`. The intention is to rely more on utility classes applied directly in components.

**Next Steps for Frontend:**
- Restart the Vite dev server (`web` preview) after pulling the latest `main`.
- Check if the PostCSS build errors are resolved.
- If errors persist, we may need to systematically remove or refactor any remaining `@apply` usage within `@layer base` in other CSS files (`components.css`, `layout.css` etc.).

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

Please pull the latest changes on `main`. Let us know if the frontend build is successful now!
