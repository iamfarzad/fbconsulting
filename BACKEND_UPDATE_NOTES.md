
# Backend Update for Frontend Integration

## Backend Changes (v0.2.0)

- ✨ **Multimodal Support Added:** The backend now accepts messages with text and/or files (images, PDFs, etc.).
- ⚙️ **Internal Refinements:** Further improvements to WebSocket handling and logging.

## Frontend Implementation Status

(As previously described by lovable.dev - thank you!)

1. **WebSocket Connection Manager**:
   - Connection establishment with unique client IDs
   - Automatic reconnection with backoff
   - Ping/pong keep-alive mechanisms (20-25 second interval as recommended)
   - Proper error handling and connection status display

2. **Real-time Chat UI**:
   - Message sending and receiving 
   - Typing indicators
   - Connection status indicators
   - Error handling and retry mechanisms

3. **Audio Streaming Support**:
   - Binary audio chunk processing
   - Audio playback with progress tracking
   - Play/pause/stop controls
   - Audio queue management

---

## Using Multimodal Input

To send files (images, PDFs, etc.) along with optional text, use the following JSON message format over the WebSocket:

```json
{
  "type": "multimodal_message",
  "text": "Optional description of the files or question.",
  "files": [
    {
      "mime_type": "image/jpeg", // Correct MIME type (e.g., image/png, application/pdf)
      "data": "BASE64_ENCODED_FILE_DATA", // File content as base64 string
      "filename": "optional_image_name.jpg" // Optional filename
    }
    // Add more file objects here if needed
  ],
  "role": "user", // Optional
  "enableTTS": true // Optional
}
```

**Key Points:**
- `type` must be `"multimodal_message"`.
- `files` is a list and must contain at least one file object.
- `files[n].data` **must** be a valid Base64 encoded string of the file content.
- `files[n].mime_type` should be accurate (e.g., `image/jpeg`, `application/pdf`). The backend uses `gemini-1.5-flash` which supports a wide range, including common image, audio, video, and document types (PDF, DOCX, etc.). Unsupported types will be skipped with a warning message sent back.
- `text` is optional when sending files.

## Previous Q&A Summary

- **Max Message Length:** No strict backend limit, but UI limits (e.g., 5k-10k chars) recommended. Gemini API has token limits.
- **Ping Interval:** Client ping every 20-25 seconds is recommended.
- **Rate Limiting:** None implemented in the backend itself, but be mindful of underlying Google Gemini API limits.
- **Text Messages:** Still supported using `{"type": "text_message", "text": "..."}`.

---

## Frontend Next Steps (from lovable.dev)

1. Voice input support
2. Improved error recovery
3. File/image attachment support (using the new `multimodal_message` format)
4. Enhanced UI/UX for audio playback

Let us know if you have issues implementing the multimodal message sending!
