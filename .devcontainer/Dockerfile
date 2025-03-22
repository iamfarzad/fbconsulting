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

# Install SSL and Python dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get install -y --no-install-recommends \
        software-properties-common \
        build-essential \
        libssl-dev \
        libffi-dev \
        python3-dev \
        python3-pip \
    && add-apt-repository ppa:deadsnakes/ppa \
    && apt-get update \
    && apt-get install -y python3.12 python3.12-venv python3.12-dev python3.12-distutils \
    && ln -s /usr/bin/python3.12 /usr/local/bin/python3 \
    && ln -s /usr/bin/python3.12 /usr/local/bin/python \
    && curl -sS https://bootstrap.pypa.io/get-pip.py | python3.12 \
    && rm -rf /var/lib/apt/lists/*

# Create and activate virtual environment with Python 3.12
RUN python3.12 -m venv /workspace/venv
ENV PATH="/workspace/venv/bin:$PATH"
