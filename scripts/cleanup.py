import os
import shutil
import logging
from typing import List, Dict

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Files to be removed
DEPRECATED_FILES = {
    "copilot_providers": [
        "src/components/copilot/CopilotProvider.tsx",
        "src/components/copilot/providers/CopilotProvider.tsx",
    ],
    "chat_services": [
        "src/services/chat/chatServiceFactory.ts",
        "src/services/chat/googleGenAIService.ts",
        "src/hooks/useUnifiedChat.ts",
    ],
    "test_pages": [
        "src/pages/TestGoogleAI.tsx",
        "src/pages/TestUnifiedChat.tsx",
        "src/pages/TestMCP.tsx",
        "src/pages/TestPage.tsx",
        "src/pages/AIDemo.tsx",
    ],
    "test_files": [
        "src/test/TestGeminiChat.test.tsx",
        "fbconsulting/src/test/TestGeminiChat.test.tsx",
    ],
    "audio": [
        "api/gemini/tts.py",
    ]
}

def backup_file(file_path: str, backup_dir: str = "deprecated_backup") -> bool:
    """Backup a file before removal"""
    try:
        if not os.path.exists(file_path):
            logger.warning(f"File not found: {file_path}")
            return False
            
        os.makedirs(backup_dir, exist_ok=True)
        backup_path = os.path.join(backup_dir, file_path.replace('/', '_'))
        shutil.copy2(file_path, backup_path)
        logger.info(f"Backed up: {file_path} -> {backup_path}")
        return True
    except Exception as e:
        logger.error(f"Backup failed for {file_path}: {e}")
        return False

def remove_file(file_path: str) -> bool:
    """Safely remove a file"""
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            logger.info(f"Removed: {file_path}")
            return True
        return False
    except Exception as e:
        logger.error(f"Failed to remove {file_path}: {e}")
        return False

def main():
    """Main cleanup function"""
    backup_success = []
    removed_files = []
    
    # First backup all files
    for category, files in DEPRECATED_FILES.items():
        logger.info(f"\nProcessing category: {category}")
        for file_path in files:
            if backup_file(file_path):
                backup_success.append(file_path)
    
    # Then remove files that were successfully backed up
    for file_path in backup_success:
        if remove_file(file_path):
            removed_files.append(file_path)
    
    # Summary
    logger.info("\nCleanup Summary:")
    logger.info(f"Total files processed: {len(DEPRECATED_FILES)}")
    logger.info(f"Successfully backed up: {len(backup_success)}")
    logger.info(f"Successfully removed: {len(removed_files)}")

    # Note: Use environment variables for sensitive information

if __name__ == "__main__":
    main()
