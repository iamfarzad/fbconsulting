# Dev Container for FB Consulting Project

This Dev Container configuration provides a consistent development environment for both React/TypeScript frontend and Python backend development, with special support for Gemini AI audio integration.

## What's Included

### Frontend Environment
- Node.js 20
- NPM (latest version)
- React/TypeScript extensions
- Tailwind CSS IntelliSense
- Audio playback and streaming support

### Backend Environment
- Python 3.9 with pip
- Google Generative AI SDK
- FastAPI for API endpoints
- Audio processing capabilities

### AI Features
- Gemini Pro integration
- Text-to-Speech capabilities
- Interactive voice UI

## Getting Started

To use this Dev Container:

1. Install [Docker](https://www.docker.com/products/docker-desktop) on your machine
2. Install the [VS Code Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. Open this project in VS Code
4. When prompted, click "Reopen in Container" or run the "Remote-Containers: Reopen in Container" command from the VS Code command palette
5. Ensure your `.env` file has the necessary `GOOGLE_API_KEY` for Gemini API access

## Using the Dev Container

- The development server will be accessible at http://localhost:5173
- Run `npm run dev` to start the development server
- Run `npm run api:python` to start the Python API server
- Run `npm run dev:all` to start both servers together

## Audio Implementation

The project implements audio capabilities through:
- `/api/gemini/audio.py` - Text-to-speech API endpoint
- `src/hooks/useGeminiAudio.ts` - Client-side audio hook
- Audio streaming with proper browser playback

## Troubleshooting

If you encounter issues with Vite or other dependencies:
1. Run `node scripts/fix-vite.js` to diagnose and fix common Vite issues
2. Run `node scripts/cleanup-config.js` to fix any misplaced configuration files
3. Check your environment variables with `node scripts/check-deployment.js`

## Customizing

You can customize this configuration by editing the following files:
- `.devcontainer/devcontainer.json` - Container settings and VS Code configuration
- `.devcontainer/Dockerfile` - Base image and environment setup

## Docker Setup in GitHub Codespaces

Docker-in-Docker is already configured for GitHub Codespaces. You can verify it's working with:
```sh
docker version
docker run hello-world
```
