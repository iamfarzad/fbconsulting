# Use multi-stage build for optimized image size
FROM python:3.12-slim as builder

# Set working directory
WORKDIR /app

# Install system dependencies for building wheels if necessary (curl for any build-time fetches if needed)
RUN apt-get update && apt-get install -y --no-install-recommends     curl     && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
# Using --only-binary=:all: to prefer wheels and fail if not available for some packages
RUN pip install --no-cache-dir --only-binary=:all: -r requirements.txt

# Final stage
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install runtime system dependencies (curl for healthcheck)
RUN apt-get update && apt-get install -y --no-install-recommends     curl     && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages

# Copy application code - Only essential files for runtime
COPY requirements.txt requirements.txt # Copied again for reference, could be skipped
COPY main.py main.py
COPY gemini_client.py gemini_client.py
# .env file should be handled via runtime environment variables or secrets, not copied.

# Create directory for logs
RUN mkdir -p logs

# Environment variables (GOOGLE_API_KEY should be injected at runtime, not hardcoded)
ENV HOST=0.0.0.0
ENV PORT=8000
ENV LOG_LEVEL=INFO
ENV ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3000" # Adjust as needed for production
ENV DEFAULT_VOICE=Charon
ENV DEFAULT_LANGUAGE=en-US
ENV WS_PING_INTERVAL=30
ENV WS_PING_TIMEOUT=10
ENV PYTHONUNBUFFERED=1
# ENV GOOGLE_API_KEY="" # Set this in your runtime environment (e.g., Cloud Run, Kubernetes)

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3     CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Expose port
EXPOSE 8000

# Run application using uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
