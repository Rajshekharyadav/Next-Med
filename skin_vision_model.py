import os
import sys
import json
import numpy as np
import cv2
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image
import os

# This is a simplified version that creates a basic VGG16 model for demonstration
# In a real scenario, you would load your trained skin analysis model

def create_skin_model():
    """
    Create a VGG16-based model for skin analysis
    """
    # Create a simple VGG16-based model for demonstration
    base_model = tf.keras.applications.VGG16(
        weights='imagenet',
        include_top=False,
        input_shape=(224, 224, 3)
    )
    
    # Freeze the base model
    base_model.trainable = False
    
    # Add custom classifier on top
    inputs = tf.keras.Input(shape=(224, 224, 3))
    x = base_model(inputs, training=False)
    x = tf.keras.layers.GlobalAveragePooling2D()(x)
    x = tf.keras.layers.Dropout(0.2)(x)
    outputs = tf.keras.layers.Dense(2, activation='softmax')(x)  # Binary classification
    
    model = tf.keras.Model(inputs, outputs)
    return model

def preprocess_image(image_path):
    """
    Preprocess an image for model prediction
    """
    # Load image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not load image from {image_path}")
    
    # Resize to 224x224 (VGG16 input size)
    img_resized = cv2.resize(img, (224, 224))
    
    # Normalize pixel values to [0, 1]
    img_normalized = img_resized.astype(np.float32) / 255.0
    
    # Expand dimensions to match model input (batch_size, height, width, channels)
    img_batch = np.expand_dims(img_normalized, axis=0)
    
    return img_batch

def predict_skin_condition(image_path, model=None):
    """
    Predict skin condition from an image file
    """
    if model is None:
        model = create_skin_model()
    
    # Preprocess the image
    processed_img = preprocess_image(image_path)
    
    # Make prediction
    predictions = model.predict(processed_img)
    
    # Get the predicted class and confidence
    predicted_class_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][predicted_class_idx])
    
    # Map class indices to labels
    class_labels = ["Benign", "Malignant"]
    predicted_label = class_labels[predicted_class_idx]
    
    return {
        "prediction": predicted_label,
        "confidence": confidence,
        "class_index": int(predicted_class_idx)
    }

# Example usage
if __name__ == "__main__":
    # This would be used for testing
    try:
        # Create model
        model = create_skin_model()
        print("Model created successfully")
        
        # If you have a test image, you can test prediction
        # result = predict_skin_condition("path/to/test/image.jpg", model)
        # print("Prediction result:", result)
        
    except Exception as e:
        print(f"Error: {str(e)}")
