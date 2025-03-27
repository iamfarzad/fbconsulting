import uvicorn
import os
from dotenv import load_dotenv
import logging

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('gemini_service.log')
        ]
    )

def main():
    # Load environment variables
    load_dotenv()

    # Set up logging
    setup_logging()
    logger = logging.getLogger(__name__)

    # Check for required environment variables
    required_vars = ['GOOGLE_API_KEY']
    missing_vars = [var for var in required_vars if not os.getenv(var)]
    if missing_vars:
        logger.error(f"Missing required environment variables: {', '.join(missing_vars)}")
        logger.error("Please check your .env file")
        return

    # Get configuration from environment with defaults
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 8000))
    # Disable reload for production deployment in Cloud Run
    reload = False 

    logger.info(f"Starting Gemini Service on {host}:{port}")
    logger.info(f"Auto-reload: {reload}")

    # Start the server
    try:
        uvicorn.run(
            "main:app",
            host=host,
            port=port,
            reload=reload,
            log_level="info"
        )
    except Exception as e:
        logger.error(f"Failed to start server: {e}")

if __name__ == "__main__":
    main()
