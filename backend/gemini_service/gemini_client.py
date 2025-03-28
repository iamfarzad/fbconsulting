# backend/gemini_service/gemini_client.py
import google.generativeai as genai
from google.ai import generativelanguage as glm # For explicit types
from typing import Optional, Dict, Any, Callable, AsyncIterable, List
import asyncio
import json
import logging
import mimetypes # For guessing MIME types

logger = logging.getLogger(__name__)

# Supported MIME types for Gemini 1.5 Flash (adjust as needed based on model)
# Reference: https://ai.google.dev/gemini-api/docs/prompting_with_media#supported_files
SUPPORTED_MIME_TYPES = [
    "image/png", "image/jpeg", "image/webp", "image/heic", "image/heif",
    "video/mov", "video/mpeg", "video/mp4", "video/mpg", "video/avi", "video/wmv", "video/mpegps", "video/flv",
    "audio/aac", "audio/aiff", "audio/flac", "audio/mp3", "audio/mpeg", "audio/ogg", "audio/opus", "audio/wav", "audio/x-m4a",
    "text/plain", "text/html", "text/css", "text/javascript", "application/x-javascript",
    "text/x-typescript", "application/x-typescript", "text/x-python", "application/x-python-code",
    "text/x-java-source", "text/x-c", "text/x-csharp", "text/x-c++",
    "application/json", "application/pdf", "application/rtf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    # Add others if needed and supported
]

class GeminiClient:
    def __init__(self, api_key: str):
        try:
            genai.configure(api_key=api_key)
            self.client = genai.Client()
            self.session = None
            self.audio_callback = None
            self.voice_config = {"name": "Charon", "language": "en-US", "rate": 1.0, "pitch": 0.0}
        except Exception as e:
            logger.error(f"Failed to configure Gemini client: {e}", exc_info=True)
            raise # Re-raise exception after logging

    async def initialize_session(self, voice_name: str = "Charon", language: str = "en-US", rate: float = 1.0, pitch: float = 0.0):
        """Initialize a new live session with Gemini"""
        if self.session:
            logger.warning("Session already initialized. Closing existing session first.")
            await self.close()
        try:
            self.voice_config = {
                "name": voice_name,
                "language": language,
                "rate": max(0.25, min(4.0, rate)),
                "pitch": max(-20.0, min(20.0, pitch))
            }
            logger.info(f"Initializing live session with voice config: {self.voice_config}")
            config = {
                "response_modalities": ["TEXT", "AUDIO"],
                "speech_config": {
                    "voice_config": {"prebuilt_voice_config": {"voice_name": self.voice_config["name"]}}
                }
            }
            # Using gemini-1.5-flash for potential better multimodal support
            self.session = self.client.connect("gemini-1.5-flash", config)
            logger.info("Live session initialized successfully.")
            return True
        except Exception as e:
            logger.error(f"Session initialization failed: {str(e)}", exc_info=True)
            raise RuntimeError(f"Session initialization failed: {str(e)}")

    async def send_message(self,
                           text: Optional[str], # Text is now optional
                           role: str = "user",
                           enable_tts: bool = True,
                           files_data: Optional[List[Dict[str, Any]]] = None # List of dicts with mime_type, data (bytes), filename
                           ) -> AsyncIterable[Dict[str, Any]]:
        """Send message (text and/or files) using Gemini Live API and stream responses"""
        if not self.session:
            logger.error("Session not initialized for send_message")
            yield {"type": "error", "error": "Session not initialized"}
            return

        try:
            parts = []
            log_parts_summary = []

            # Add text part if provided
            if text:
                parts.append(glm.Part(text=text))
                log_parts_summary.append("text")

            # Add file parts if provided
            if files_data:
                for file_info in files_data:
                    mime_type = file_info.get("mime_type")
                    file_bytes = file_info.get("data")
                    filename = file_info.get("filename", "file")

                    # Validate MIME type
                    if not mime_type or mime_type not in SUPPORTED_MIME_TYPES:
                        # Attempt to guess type if missing and filename exists
                        if not mime_type and filename:
                            guessed_type, _ = mimetypes.guess_type(filename)
                            if guessed_type and guessed_type in SUPPORTED_MIME_TYPES:
                                mime_type = guessed_type
                                logger.info(f"Guessed supported MIME type '{mime_type}' for '{filename}'")
                            else:
                                logger.warning(f"Could not guess or unsupported MIME type for '{filename}'. Skipping file.")
                                yield {"type": "warning", "message": f"File '{filename}' skipped: Unsupported or unknown MIME type."}
                                continue
                        else:
                            logger.warning(f"Unsupported or missing MIME type ('{mime_type}') for '{filename}'. Skipping file.")
                            yield {"type": "warning", "message": f"File '{filename}' skipped: Unsupported or missing MIME type."}
                            continue

                    # Validate data
                    if not file_bytes or not isinstance(file_bytes, bytes):
                        logger.error(f"Invalid/missing file data for '{filename}'. Skipping file.")
                        yield {"type": "warning", "message": f"File '{filename}' skipped: Invalid data."}
                        continue

                    # Add validated file part
                    parts.append(glm.Part(inline_data=glm.Blob(mime_type=mime_type, data=file_bytes)))
                    log_parts_summary.append(f"file: {filename} ({mime_type}, {len(file_bytes)} bytes)")

            if not parts:
                logger.warning("Attempted to send message with no text and no valid files.")
                yield {"type": "error", "error": "Cannot send an empty message (no text or valid files)."}
                return

            logger.info(f"Sending message with parts: {log_parts_summary}")

            # Construct the request using the Parts
            request = {
                "contents": [{"parts": parts, "role": role}],
                "tools": [{ "function_declarations": [genai.protos.FunctionDeclaration(name="text_to_speech")]}] if enable_tts else []
                 # Note: Tool schema might need adjustment depending on exact API requirements
            }

            # Stream the response
            async for response in self.session.send_message_streaming(request):
                if response.text:
                    yield {"type": "text", "content": response.text, "role": "assistant"}

                if enable_tts and self.audio_callback and response.audio:
                    try:
                        await self.audio_callback(response.audio)
                        # Removed separate audio_chunk yield, callback handles sending
                    except Exception as audio_e:
                        logger.error(f"Audio callback failed: {str(audio_e)}", exc_info=True)
                        yield {"type": "error", "error": f"Audio processing failed: {str(audio_e)}"}
            
            # Send final completion marker
            yield {"type": "complete", "role": "assistant"}

        except Exception as e:
            logger.exception(f"Message processing failed: {str(e)}")
            yield {"type": "error", "error": f"Message processing failed: {str(e)}"}

    def set_audio_callback(self, callback: Callable):
        self.audio_callback = callback

    async def update_voice_settings(self, voice_name: Optional[str] = None, language: Optional[str] = None, rate: Optional[float] = None, pitch: Optional[float] = None):
        logger.warning("Updating voice settings might require re-initializing the session.")
        if voice_name: self.voice_config["name"] = voice_name
        if language: self.voice_config["language"] = language
        if rate is not None: self.voice_config["rate"] = max(0.25, min(4.0, rate))
        if pitch is not None: self.voice_config["pitch"] = max(-20.0, min(20.0, pitch))
        logger.info(f"Updated voice config (requires session restart to apply): {self.voice_config}")

    async def close(self):
        if self.session:
            try:
                self.session.close()
                logger.info("Live session closed")
            except Exception as e:
                logger.error(f"Error closing session: {e}", exc_info=True)
            finally:
                self.session = None # Ensure session is marked as None even if close fails

