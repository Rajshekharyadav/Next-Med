#!/usr/bin/env python3
"""
Startup script for the Skin Vision Analysis API
This script ensures all dependencies are installed and starts the API server
"""

import subprocess
import sys
import os

def check_and_install_dependencies():
    """Check if required packages are installed, install if missing"""
    required_packages = [
        "fastapi",
        "uvicorn",
        "tensorflow",
        "python-multipart"
    ]
    
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package} is already installed")
        except ImportError:
            print(f"Installing {package}...")
            subprocess.check_call([sys.executable, "-m", "pip", "install", package])

def check_model_files():
    """Check if model files exist in the current directory"""
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, "resnet50_finetune.keras")
    labels_path = os.path.join(current_dir, "class_indices.json")
    
    if not os.path.exists(model_path):
        print(f"❌ Model file not found: {model_path}")
        return False
        
    if not os.path.exists(labels_path):
        print(f"❌ Labels file not found: {labels_path}")
        return False
        
    print("✅ All model files found")
    return True

def main():
    print("Starting Skin Vision Analysis API setup...")
    
    # Check model files
    if not check_model_files():
        print("Please ensure resnet50_finetune.keras and class_indices.json are in the current directory")
        return 1
    
    # Check and install dependencies
    try:
        check_and_install_dependencies()
    except Exception as e:
        print(f"Error installing dependencies: {e}")
        return 1
    
    # Start the API server
    print("\n🚀 Starting API server...")
    print("The API will be available at http://localhost:8000")
    
    try:
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000",
            "--reload"
        ], cwd=os.path.dirname(os.path.abspath(__file__)))
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")
    except Exception as e:
        print(f"Error starting server: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())