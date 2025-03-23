# Use multi-stage build for optimized image size
FROM python:3.12-slim as builder

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Final stage
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages

# Copy application code
COPY . .

# Create directories for logs and audio files
RUN mkdir -p logs debug_output test_audio_output

# Environment variables
ENV HOST=0.0.0.0
ENV PORT=8000
ENV LOG_LEVEL=INFO
ENV ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000"
ENV DEFAULT_VOICE=Charon
ENV DEFAULT_LANGUAGE=en-US
ENV WS_PING_INTERVAL=30
ENV WS_PING_TIMEOUT=10
ENV PYTHONUNBUFFERED=1
ENV GOOGLE_API_KEY=${GOOGLE_API_KEY}

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Expose port
EXPOSE 8000

# Run application
CMD ["python", "start_local.py"]
