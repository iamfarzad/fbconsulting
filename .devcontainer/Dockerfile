FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Set working directory
WORKDIR /app

# Install global dependencies
RUN npm install -g npm@latest

# Install git for version control
RUN apt-get update && apt-get install -y git

# Set environment variables
ENV NODE_ENV=development

# Create a non-root user with sudo access
RUN groupadd --gid 1000 node \
    && useradd --uid 1000 --gid node --shell /bin/bash --create-home node \
    && apt-get install -y sudo \
    && echo node ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node

# Set the user
USER node

# Set the working directory permissions
RUN mkdir -p /app && chown -R node:node /app
