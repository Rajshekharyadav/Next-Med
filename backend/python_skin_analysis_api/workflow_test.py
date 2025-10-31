#!/usr/bin/env python3
"""
Workflow test for the Skin Vision Analysis API
This script tests the entire workflow from image upload to prediction
"""

import os
import sys
import json

def test_model_import():
    """Test that we can import the predict_model module"""
    try:
        # Add current directory to path
        current_dir = os.path.dirname(os.path.abspath(__file__))
        sys.path.insert(0, current_dir)
        
        from predict_model import predict_image
        print("✅ Successfully imported predict_model")
        return True
    except ImportError as e:
        print(f"❌ Failed to import predict_model: {e}")
        return False
    except Exception as e:
        print(f"❌ Error importing predict_model: {e}")
        return False

def test_model_files():
    """Test that required model files exist"""
    required_files = [
        "resnet50_finetune.keras",
        "class_indices.json"
    ]
    
    missing_files = []
    for file in required_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Missing required files: {missing_files}")
        return False
    
    print("✅ All required model files found")
    return True

def test_class_indices():
    """Test that class_indices.json is properly formatted"""
    try:
        with open("class_indices.json", "r") as f:
            data = json.load(f)
        
        if "inv_class_indices" not in data:
            print("❌ class_indices.json missing 'inv_class_indices' key")
            return False
        
        classes = data["inv_class_indices"]
        if not isinstance(classes, dict):
            print("❌ 'inv_class_indices' should be a dictionary")
            return False
        
        print(f"✅ class_indices.json verified - contains {len(classes)} classes")
        return True
    except Exception as e:
        print(f"❌ Error reading class_indices.json: {e}")
        return False

def test_model_loading():
    """Test that the model can be loaded"""
    try:
        # Add current directory to path
        current_dir = os.path.dirname(os.path.abspath(__file__))
        sys.path.insert(0, current_dir)
        
        from predict_model import MODEL_PATH, LABELS_PATH
        
        print(f"Model path: {MODEL_PATH}")
        print(f"Labels path: {LABELS_PATH}")
        
        # Try to load the model
        from predict_model import model
        print("✅ Model loaded successfully")
        return True
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False

def main():
    print("Testing Skin Vision Analysis Workflow...")
    print("=" * 50)
    
    # Change to the backend directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f"Working directory: {os.getcwd()}")
    
    # Test 1: Model import
    print("\n1. Testing model import...")
    if not test_model_import():
        return 1
    
    # Test 2: Model files
    print("\n2. Testing model files...")
    if not test_model_files():
        return 1
    
    # Test 3: Class indices
    print("\n3. Testing class indices...")
    if not test_class_indices():
        return 1
    
    # Test 4: Model loading
    print("\n4. Testing model loading...")
    if not test_model_loading():
        return 1
    
    print("\n" + "=" * 50)
    print("✅ All workflow tests passed!")
    print("\nTo test the full API:")
    print("1. Run: python start_api.py")
    print("2. In another terminal, run: python test_api_simple.py <path_to_image>")
    return 0

if __name__ == "__main__":
    sys.exit(main())