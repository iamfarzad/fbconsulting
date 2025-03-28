{ pkgs }:
let
  # Use python311 and add back all required packages
  pythonEnv = pkgs.python311.withPackages (ps: [
    # Core service
    ps.pip
    ps.fastapi
    ps.uvicorn
    ps.starlette
    ps.h11
    ps.websockets
    ps.python-dotenv
    ps.google-generativeai
    ps.pydantic

    # Audio
    ps.pydub

    # Utilities
    ps.python-multipart
    ps.aiofiles

    # Logging
    ps.structlog
    ps.python-json-logger

    # Misc/Dependencies
    ps.flask
    ps.setuptools
    ps.wheel
    ps.werkzeug

    # Testing
    ps.pytest
    ps.pytest-asyncio
    ps.httpx
  ]);
in
{
  channel = "stable-24.05"; # Semicolon

  packages = [
    pkgs.nodejs_20
    pkgs.ffmpeg
    pythonEnv
  ]; # Semicolon

  # Re-enable extensions
  idx.extensions = [
    "svelte.svelte-vscode"
    "vue.volar"
  ]; # Semicolon

  # Re-enable previews
  idx.previews = {
    previews = {
      web = {
        command = [ "npm" "run" "dev" "--" "--port" "$PORT" "--host" "0.0.0.0" ];
        manager = "web";
      }; # Semicolon
      backend = {
        command = [ "python3" "backend/gemini_service/main.py" ];
        manager = "web"; # Changed from terminal to web
      };
    };
  };
}
