# Dev Container for FB Consulting Project

This Dev Container configuration provides a consistent development environment for both React/TypeScript frontend and Python backend development.

## What's Included

### Frontend Environment
- Node.js 18
- NPM (latest version)
- React/TypeScript extensions
- Tailwind CSS IntelliSense

### Backend Environment
- Python 3.x with pip
- Virtual environment
- Python extensions for VS Code
- Auto-installs requirements.txt

## Getting Started

To use this Dev Container:

1. Install [Docker](https://www.docker.com/products/docker-desktop) on your machine
2. Install the [VS Code Remote - Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
3. Open this project in VS Code
4. When prompted, click "Reopen in Container" or run the "Remote-Containers: Reopen in Container" command from the VS Code command palette

## Using the Dev Container

- The development server will be accessible at http://localhost:8080
- Run `npm run dev` to start the development server
- All VS Code settings and extensions are configured for React and TypeScript development

## Post-Setup
The container will automatically:
1. Create a Python virtual environment
2. Install Python dependencies from requirements.txt
3. Install Node.js dependencies from package.json

## Customizing

You can customize this configuration by editing the following files:
- `.devcontainer/devcontainer.json` - Container settings and VS Code configuration
- `.devcontainer/Dockerfile` - Base image and environment setup
