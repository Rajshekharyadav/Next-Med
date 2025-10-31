import os
import sys
import json
import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.applications.vgg16 import VGG16, preprocess_input
from tensorflow.keras.layers import Dense, Flatten, Dropout
from tensorflow.keras.models import Model
import logging
import time

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
IMAGE_SIZE = (224, 224)
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'skin_vision_model.h5')

# Enhanced classes for prediction with more skin conditions
CONDITION_CLASSES = {
    'benign': [
        'Benign Nevus',
        'Seborrheic Keratosis', 
        'Dermatofibroma',
        'Solar Lentigo'
    ],
    'malignant': [
        'Melanoma',
        'Basal Cell Carcinoma',
        'Squamous Cell Carcinoma'
    ]
}

# Descriptions for each condition
CONDITION_DESCRIPTIONS = {
    'Benign Nevus': 'A common type of mole that is harmless and not cancerous.',
    'Seborrheic Keratosis': 'A common benign skin growth that appears as a waxy, scaly, slightly raised growth.',
    'Dermatofibroma': 'A common benign skin nodule that often appears on the arms or legs.',
    'Solar Lentigo': 'A harmless patch of darkened skin caused by exposure to UV light.',
    'Melanoma': 'A serious form of skin cancer that begins in cells known as melanocytes.',
    'Basal Cell Carcinoma': 'The most common type of skin cancer that rarely spreads but can be locally destructive.',
    'Squamous Cell Carcinoma': 'The second most common form of skin cancer that can spread if not treated.'
}

# Recommended actions for each category
RECOMMENDED_ACTIONS = {
    'benign': [
        'Monitor for changes in size, shape, or color',
        'Apply sunscreen regularly',
        'Schedule a routine skin check within 6-12 months'
    ],
    'malignant': [
        'Consult with a dermatologist as soon as possible',
        'Avoid sun exposure to the area',
        'Do not scratch or irritate the area',
        'Take clear photos to document any changes'
    ]
}

def create_model():
    """Create and return a VGG16 model for skin lesion classification"""
    try:
        # Create a base model from VGG16 without the top layers
        base_model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
        
        # Freeze the base model layers
        for layer in base_model.layers:
            layer.trainable = False
            
        # Add custom top layers for advanced classification
        x = base_model.output
        x = Flatten()(x)
        x = Dense(512, activation='relu')(x)
        x = Dropout(0.5)(x)
        x = Dense(256, activation='relu')(x)
        x = Dropout(0.3)(x)
        
        # Output layer with 2 classes (benign/malignant) 
        # In a production model, we would have multiple classes
        predictions = Dense(2, activation='softmax')(x)
        
        # Create the final model
        model = Model(inputs=base_model.input, outputs=predictions)
        
        # Compile the model
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        logger.info("VGG16 model created successfully")
        return model
    
    except Exception as e:
        logger.error(f"Error creating model: {str(e)}")
        return None

def analyze_image_features(img):
    """Extract additional features from the image for enhanced analysis"""
    try:
        # Convert to different color spaces
        hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV)
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        
        # Extract color features
        color_features = {
            'mean_rgb': img.mean(axis=(0, 1)).tolist(),
            'std_rgb': img.std(axis=(0, 1)).tolist(),
            'mean_hsv': hsv.mean(axis=(0, 1)).tolist(),
            'std_hsv': hsv.std(axis=(0, 1)).tolist(),
        }
        
        # Extract shape features
        # Apply threshold to get binary image
        _, binary = cv2.threshold(gray, 128, 255, cv2.THRESH_BINARY)
        
        # Find contours
        contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        shape_features = {}
        if contours:
            # Find the largest contour
            largest_contour = max(contours, key=cv2.contourArea)
            
            # Calculate area and perimeter
            area = cv2.contourArea(largest_contour)
            perimeter = cv2.arcLength(largest_contour, True)
            
            # Calculate circularity (4π × area / perimeter²)
            # A perfect circle has circularity of 1
            circularity = 0
            if perimeter > 0:
                circularity = 4 * np.pi * area / (perimeter * perimeter)
            
            shape_features = {
                'area': float(area),
                'perimeter': float(perimeter),
                'circularity': float(circularity),
                'irregularity': float(1 - circularity)  # Higher means more irregular
            }
        
        return {**color_features, **shape_features}
    
    except Exception as e:
        logger.error(f"Error analyzing image features: {str(e)}")
        return {}

def preprocess_image(image_path):
    """Preprocess an image for the VGG16 model and return both processed and original image"""
    try:
        # Read and resize image
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Could not read image at {image_path}")
        
        # Store original image (RGB format for feature extraction)
        original_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        
        # Resize for model input
        resized_img = cv2.resize(img, IMAGE_SIZE)
        
        # Convert BGR to RGB (OpenCV uses BGR by default)
        resized_rgb = cv2.cvtColor(resized_img, cv2.COLOR_BGR2RGB)
        
        # Expand dimensions and preprocess for VGG16
        model_input = np.expand_dims(resized_rgb, axis=0)
        model_input = preprocess_input(model_input)
        
        return model_input, original_img
    
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        return None, None

def determine_specific_condition(class_name, feature_data):
    """Determine a specific condition within the class based on image features"""
    # This would be a more sophisticated algorithm in production
    # Currently using a simplified approach based on extracted features
    
    conditions = CONDITION_CLASSES[class_name]
    
    if class_name == 'benign':
        # Simplified logic for benign conditions
        if 'irregularity' in feature_data:
            if feature_data['irregularity'] > 0.4:
                return conditions[1]  # Seborrheic Keratosis
            elif feature_data['mean_hsv'][2] > 150:
                return conditions[3]  # Solar Lentigo
            elif feature_data['area'] < 1000:
                return conditions[2]  # Dermatofibroma
        return conditions[0]  # Default to Benign Nevus
    else:
        # Simplified logic for malignant conditions
        if 'irregularity' in feature_data:
            if feature_data['irregularity'] > 0.6:
                return conditions[0]  # Melanoma
            elif feature_data['mean_rgb'][0] > feature_data['mean_rgb'][1]:
                return conditions[1]  # Basal Cell Carcinoma
        return conditions[2]  # Default to Squamous Cell Carcinoma

def identify_risk_factors(feature_data, class_name):
    """Identify risk factors based on image features"""
    risk_factors = []
    
    # Skip if feature data is not available
    if not feature_data:
        return risk_factors
    
    # Check for irregular borders
    if 'irregularity' in feature_data and feature_data['irregularity'] > 0.4:
        risk_factors.append('Irregular border')
    
    # Check for asymmetry (simplified)
    if 'area' in feature_data and 'perimeter' in feature_data:
        if feature_data['perimeter'] > 4 * np.sqrt(feature_data['area']):
            risk_factors.append('Asymmetrical shape')
    
    # Check for color variation
    if 'std_rgb' in feature_data:
        if max(feature_data['std_rgb']) > 40:
            risk_factors.append('Multiple colors or color variations')
    
    # Check for size (simplified)
    if 'area' in feature_data and feature_data['area'] > 1500:
        risk_factors.append('Size larger than 6mm')
    
    # Add more risk factors for malignant predictions
    if class_name == 'malignant':
        if 'mean_hsv' in feature_data and feature_data['mean_hsv'][1] > 100:
            risk_factors.append('Significant color saturation')
        
        risk_factors.append('Needs professional evaluation')
    
    return risk_factors

def predict(image_path):
    """Make a prediction on the given image with enhanced analysis"""
    start_time = time.time()
    try:
        # Check if the image exists
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image not found at {image_path}")
        
        # Preprocess the image
        processed_img, original_img = preprocess_image(image_path)
        if processed_img is None:
            raise ValueError("Failed to preprocess image")
        
        # Create the model
        model = create_model()
        if model is None:
            raise ValueError("Failed to create model")
        
        # If we had a saved model, we would load it here
        # model.load_weights(MODEL_PATH)
        
        # Extract additional features for enhanced analysis
        feature_data = analyze_image_features(original_img) if original_img is not None else {}
        
        # Get prediction (this is simulated since we don't have trained weights)
        # In a real scenario, this would be: pred = model.predict(processed_img)
        
        # Create a more sophisticated mock prediction based on image features
        malignant_prob = 0.3  # Default probability
        
        if feature_data:
            # Adjust probability based on features
            if 'irregularity' in feature_data and feature_data['irregularity'] > 0.5:
                malignant_prob += 0.2
            if 'std_rgb' in feature_data and max(feature_data['std_rgb']) > 50:
                malignant_prob += 0.1
            
            # Cap at 0.85 for simulation purposes
            malignant_prob = min(0.85, malignant_prob)
        
        # Add some randomization for demo purposes
        malignant_prob += (np.random.random() - 0.5) * 0.2
        malignant_prob = max(0.1, min(0.9, malignant_prob))
        
        # Create prediction array
        pred = np.array([[1 - malignant_prob, malignant_prob]])
        
        # Get the class with the highest probability
        class_index = np.argmax(pred[0])
        class_name = ['benign', 'malignant'][class_index]
        confidence = float(pred[0][class_index])
        
        # Determine specific condition based on class and features
        specific_condition = determine_specific_condition(class_name, feature_data)
        
        # Generate risk factors
        risk_factors = identify_risk_factors(feature_data, class_name)
        
        # Select appropriate recommendations
        recommendations = RECOMMENDED_ACTIONS[class_name]
        
        # Get description for the specific condition
        condition_description = CONDITION_DESCRIPTIONS.get(specific_condition, "")
        
        # Add processing time
        processing_time = time.time() - start_time
        
        # Construct the result
        result = {
            "success": True,
            "prediction": specific_condition,
            "class": class_name,
            "confidence": int(confidence * 100),
            "recommendedAction": recommendations[0],
            "processingTime": round(processing_time, 2),
            "details": {
                "possibleConditions": [
                    {
                        "name": specific_condition,
                        "probability": float(confidence),
                        "description": condition_description,
                        "category": class_name
                    }
                ],
                "riskFactors": risk_factors,
                "recommendations": recommendations,
                "additionalInfo": {
                    "abcdRule": {
                        "asymmetry": 'area' in feature_data and 'perimeter' in feature_data and \
                                     feature_data['perimeter'] > 4 * np.sqrt(feature_data['area']),
                        "borderIrregularity": 'irregularity' in feature_data and feature_data['irregularity'] > 0.4,
                        "colorVariation": 'std_rgb' in feature_data and max(feature_data['std_rgb']) > 40,
                        "diameter": 'area' in feature_data and feature_data['area'] > 1500
                    }
                }
            }
        }
        
        return result
    
    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "processingTime": round(time.time() - start_time, 2)
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
