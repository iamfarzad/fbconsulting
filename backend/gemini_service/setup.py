import subprocess
import sys
import time

# List of required packages
packages = [
    "fastapi>=0.104.1",
    "uvicorn>=0.24.0",
    "python-dotenv>=1.0.0",
    "websockets>=12.0",
    "google-generativeai>=0.3.2",
    "pydantic>=2.0.0"
]

def install_packages():
    print("Installing required packages...")
    for package in packages:
        print(f"Installing {package}...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", package, "--disable-pip-version-check"])
            print(f"Successfully installed {package}")
        except Exception as e:
            print(f"Error installing {package}: {e}")
            return False
        time.sleep(1)  # Add a small delay between installations
    
    print("All packages installed successfully!")
    return True

if __name__ == "__main__":
    if install_packages():
        print("\nSetup complete! You can now run the server with: python main.py")
    else:
        print("\nSetup failed. Please check the errors above.")
