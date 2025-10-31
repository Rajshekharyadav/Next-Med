import sys
import json
from pathlib import Path
import numpy as np
from PIL import Image
import tensorflow as tf

def load_and_preprocess_image(image_path):
    img = Image.open(image_path)
    img = img.resize((224, 224))  # VGG16 input size
    img_array = np.array(img)
    img_array = img_array / 255.0  # Normalize
    return np.expand_dims(img_array, axis=0)

def predict_image(image_path):
    try:
        # Load and preprocess the image
        processed_image = load_and_preprocess_image(image_path)
        
        # For demo purposes, return a mock prediction
        # In production, you would load your trained model here
        classes = ['benign', 'malignant']
        mock_prediction = {
            'prediction': 'benign',
            'confidence': 0.92,
            'class': 'benign_nevus'
        }
        
        print(json.dumps(mock_prediction))
        sys.stdout.flush()
        return 0
    except Exception as e:
        print(json.dumps({'error': str(e)}), file=sys.stderr)
        return 1

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print(json.dumps({'error': 'Image path not provided'}), file=sys.stderr)
        sys.exit(1)
        
    image_path = sys.argv[1]
    if not Path(image_path).exists():
        print(json.dumps({'error': f'Image not found: {image_path}'}), file=sys.stderr)
        sys.exit(1)
        
    sys.exit(predict_image(image_path))
