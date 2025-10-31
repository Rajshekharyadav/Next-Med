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

# Load the pre-trained VGG16 model
def create_model():
    """Create and return a VGG16 model for skin lesion classification"""
    try:
        # Create a base model from VGG16 without the top layers
        base_model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
        
        # Freeze only the first few layers
        for layer in base_model.layers[:15]:  # Freeze first 15 layers
            layer.trainable = False
        for layer in base_model.layers[15:]:  # Make remaining layers trainable
            layer.trainable = True
            
        # Add custom top layers for skin condition classification
        x = base_model.output
        x = Flatten()(x)
        x = Dense(1024, activation='relu')(x)
        x = Dropout(0.5)(x)
        x = Dense(512, activation='relu')(x)
        x = Dropout(0.3)(x)
        x = Dense(256, activation='relu')(x)
        x = Dropout(0.2)(x)
        
        # Output layer with 2 classes (benign/malignant) 
        predictions = Dense(2, activation='softmax')(x)
        
        # Create the final model
        model = Model(inputs=base_model.input, outputs=predictions)
        
        # Compile the model with appropriate parameters
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        # Load pre-trained weights if they exist
        if os.path.exists(MODEL_PATH):
            try:
                model.load_weights(MODEL_PATH)
                logger.info("Successfully loaded pre-trained weights")
            except Exception as e:
                logger.error(f"Error loading weights: {str(e)}")
        else:
            logger.warning("No pre-trained weights found. Model will give random predictions without training.")
        
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
        
        # Extract texture features using GLCM
        # This is a simplification - full GLCM would be more complex
        texture_features = {}
        try:
            from skimage.feature import graycomatrix, graycoprops
            
            # Quantize the image to fewer gray levels to calculate GLCM
            gray_quantized = np.uint8(gray / 16) * 16
            
            # Calculate GLCM
            distances = [1]  # Distance between pixels
            angles = [0, np.pi/4, np.pi/2, 3*np.pi/4]  # Different angles for GLCM
            glcm = graycomatrix(gray_quantized, distances, angles, 
                                levels=16, symmetric=True, normed=True)
            
            # Calculate GLCM properties
            contrast = graycoprops(glcm, 'contrast').mean()
            dissimilarity = graycoprops(glcm, 'dissimilarity').mean()
            homogeneity = graycoprops(glcm, 'homogeneity').mean()
            energy = graycoprops(glcm, 'energy').mean()
            correlation = graycoprops(glcm, 'correlation').mean()
            
            texture_features = {
                'contrast': float(contrast),
                'dissimilarity': float(dissimilarity),
                'homogeneity': float(homogeneity),
                'energy': float(energy),
                'correlation': float(correlation)
            }
        except ImportError:
            logger.warning("skimage not available, skipping texture feature extraction")
            
        # Extract shape features
        # Apply threshold to get binary image
        _, binary = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)
        
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
            
            # Calculate compactness
            compactness = 0
            if area > 0:
                compactness = np.square(perimeter) / (4 * np.pi * area)
            
            # Calculate elliptical measures
            try:
                ellipse = cv2.fitEllipse(largest_contour)
                major_axis = max(ellipse[1][0], ellipse[1][1])
                minor_axis = min(ellipse[1][0], ellipse[1][1])
                eccentricity = 0
                if major_axis > 0:
                    eccentricity = np.sqrt(1 - (minor_axis/major_axis)**2)
            except:
                major_axis = 0
                minor_axis = 0
                eccentricity = 0
            
            # Calculate asymmetry
            moments = cv2.moments(largest_contour)
            hu_moments = cv2.HuMoments(moments).flatten()
            asymmetry = hu_moments[0]  # First Hu moment as a simple asymmetry measure
            
            shape_features = {
                'area': float(area),
                'perimeter': float(perimeter),
                'circularity': float(circularity),
                'irregularity': float(1 - circularity),  # Higher means more irregular
                'compactness': float(compactness),
                'eccentricity': float(eccentricity),
                'asymmetry': float(asymmetry),
                'major_axis': float(major_axis),
                'minor_axis': float(minor_axis)
            }
        
        # Combine all features
        features = {**color_features, **texture_features, **shape_features}
        return features
    
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

def determine_specific_condition(class_name, feature_data, vgg_features):
    """Determine a specific condition within the class based on image features"""    
    conditions = CONDITION_CLASSES[class_name]
    
    # Combine manual features with VGG extracted features for better classification
    combined_features = {**feature_data}
    if 'activations' in vgg_features:
        # Use VGG activations to influence the decision
        combined_features['vgg_activations'] = vgg_features['activations']
    
    if class_name == 'benign':
        # Enhanced logic for benign conditions using image features
        if 'irregularity' in combined_features:
            # Check for seborrheic keratosis
            if combined_features['irregularity'] > 0.4 and 'energy' in combined_features and combined_features['energy'] < 0.1:
                return conditions[1]  # Seborrheic Keratosis
            
            # Check for solar lentigo (sun spots)
            if 'mean_hsv' in combined_features and combined_features['mean_hsv'][2] > 150:
                if 'std_rgb' in combined_features and max(combined_features['std_rgb']) < 30:
                    return conditions[3]  # Solar Lentigo
            
            # Check for dermatofibroma
            if 'compactness' in combined_features and combined_features['compactness'] > 1.2:
                if 'area' in combined_features and combined_features['area'] < 1000:
                    return conditions[2]  # Dermatofibroma
        
        # Default to benign nevus for most regular, uniform patterns
        return conditions[0]  # Benign Nevus
    else:
        # Enhanced logic for malignant conditions
        if 'irregularity' in combined_features:
            # Melanoma typically has high irregularity and color variation
            if combined_features['irregularity'] > 0.6:
                if 'std_rgb' in combined_features and max(combined_features['std_rgb']) > 45:
                    return conditions[0]  # Melanoma
            
            # Basal Cell Carcinoma often has certain color characteristics
            if 'mean_rgb' in combined_features:
                if (combined_features['mean_rgb'][0] > combined_features['mean_rgb'][1] and 
                    'compactness' in combined_features and combined_features['compactness'] > 1.4):
                    return conditions[1]  # Basal Cell Carcinoma
        
        # Default to Squamous Cell Carcinoma for other patterns
        return conditions[2]  # Squamous Cell Carcinoma

def extract_vgg_features(model, processed_img):
    """
    Extract features from various layers of VGG16 to better understand the image
    """
    try:
        # Use an intermediate layer to get features
        intermediate_layer_model = Model(inputs=model.input, 
                                         outputs=model.get_layer('block5_conv3').output)
        
        # Get activations
        activations = intermediate_layer_model.predict(processed_img)
        
        # Global Average Pooling for feature reduction
        pooled_activations = np.mean(activations, axis=(1, 2))
        
        return {
            'activations': pooled_activations.tolist(),
            'max_activation': float(np.max(activations)),
            'std_activation': float(np.std(activations))
        }
    except Exception as e:
        logger.error(f"Error extracting VGG features: {str(e)}")
        return {}

def identify_risk_factors(feature_data, vgg_features, class_name):
    """Identify risk factors based on image features and VGG16 activations"""
    risk_factors = []
    
    # Skip if feature data is not available
    if not feature_data:
        return risk_factors
    
    # Check for irregular borders using shape features
    if 'irregularity' in feature_data:
        if feature_data['irregularity'] > 0.4:
            risk_factors.append('Irregular border')
        elif feature_data['irregularity'] > 0.3:
            risk_factors.append('Slightly irregular border')
    
    # Check for asymmetry using shape features
    if 'asymmetry' in feature_data:
        if feature_data['asymmetry'] < 0.1:  # Lower Hu moment values indicate more asymmetry
            risk_factors.append('Asymmetrical shape')
    elif 'area' in feature_data and 'perimeter' in feature_data:
        if feature_data['perimeter'] > 4 * np.sqrt(feature_data['area']):
            risk_factors.append('Asymmetrical shape')
    
    # Check for color variation
    if 'std_rgb' in feature_data:
        if max(feature_data['std_rgb']) > 40:
            risk_factors.append('Multiple colors or color variations')
        elif max(feature_data['std_rgb']) > 25:
            risk_factors.append('Some color variation')
    
    # Check for size (simplified)
    if 'area' in feature_data:
        if feature_data['area'] > 1500:
            risk_factors.append('Size larger than 6mm')
        elif feature_data['area'] > 1000:
            risk_factors.append('Size approaching 6mm')
    
    # Use texture features if available
    if 'contrast' in feature_data and feature_data['contrast'] > 0.5:
        risk_factors.append('High contrast pattern')
    
    if 'homogeneity' in feature_data and feature_data['homogeneity'] < 0.5:
        risk_factors.append('Uneven texture')
    
    # Add more risk factors for malignant predictions
    if class_name == 'malignant':
        if 'mean_hsv' in feature_data and feature_data['mean_hsv'][1] > 100:
            risk_factors.append('Significant color saturation')
        
        # Use VGG features if available
        if vgg_features and 'max_activation' in vgg_features and vgg_features['max_activation'] > 100:
            risk_factors.append('Strong activation pattern detected by neural network')
        
        risk_factors.append('Needs professional evaluation')
    
    return risk_factors

def predict_from_features(model, processed_img, feature_data):
    """Use VGG16 model and extracted features to make an informed prediction"""
    try:
        # Extract features from VGG16 model
        vgg_features = extract_vgg_features(model, processed_img)
        
        # Get predictions from the model if weights exist
        if os.path.exists(MODEL_PATH):
            pred = model.predict(processed_img, verbose=0)
            return pred, vgg_features
        
        # Fallback to feature-based prediction if no model weights
        logger.warning("No trained weights found - using feature-based prediction")
        malignant_prob = 0.5  # Start with uncertain prediction
        benign_prob = 0.5
        
        if feature_data:
            # Adjust probabilities based on key features
            if 'irregularity' in feature_data:
                if feature_data['irregularity'] > 0.6:
                    malignant_prob = 0.7
                    benign_prob = 0.3
                elif feature_data['irregularity'] > 0.4:
                    malignant_prob = 0.6
                    benign_prob = 0.4
            
            if 'asymmetry' in feature_data and feature_data['asymmetry'] < 0.1:
                malignant_prob = max(malignant_prob, 0.65)
                benign_prob = min(benign_prob, 0.35)
            
            if 'std_rgb' in feature_data and max(feature_data['std_rgb']) > 45:
                malignant_prob = max(malignant_prob, 0.6)
                benign_prob = min(benign_prob, 0.4)
        
        # Create prediction array
        pred = np.array([[benign_prob, malignant_prob]])
        
        return pred, vgg_features
    
    except Exception as e:
        logger.error(f"Error making model prediction: {str(e)}")
        return np.array([[0.5, 0.5]]), {}  # Return uncertain prediction

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
        
        # Extract additional features for enhanced analysis
        feature_data = analyze_image_features(original_img) if original_img is not None else {}
        
        # Get prediction using the model and extracted features
        pred, vgg_features = predict_from_features(model, processed_img, feature_data)
        
        # Get the class with the highest probability
        class_index = np.argmax(pred[0])
        class_name = ['benign', 'malignant'][class_index]
        confidence = float(pred[0][class_index])
        
        # Determine specific condition based on class and features
        specific_condition = determine_specific_condition(class_name, feature_data, vgg_features)
        
        # Generate risk factors
        risk_factors = identify_risk_factors(feature_data, vgg_features, class_name)
        
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
                        "asymmetry": 'asymmetry' in feature_data and feature_data['asymmetry'] < 0.1 or 
                                     ('area' in feature_data and 'perimeter' in feature_data and 
                                      feature_data['perimeter'] > 4 * np.sqrt(feature_data['area'])),
                        "borderIrregularity": 'irregularity' in feature_data and feature_data['irregularity'] > 0.4,
                        "colorVariation": 'std_rgb' in feature_data and max(feature_data['std_rgb']) > 35,
                        "diameter": 'area' in feature_data and feature_data['area'] > 1000
                    }
                }
            }
        }
        
        # Include a second possible condition with lower probability if available
        if class_name == 'malignant':
            # For malignant predictions, include most likely benign condition
            benign_condition = determine_specific_condition('benign', feature_data, vgg_features)
            result["details"]["possibleConditions"].append({
                "name": benign_condition,
                "probability": float(pred[0][0]),  # Benign probability
                "description": CONDITION_DESCRIPTIONS.get(benign_condition, ""),
                "category": "benign"
            })
        else:
            # For benign predictions, include most likely malignant condition
            malignant_condition = determine_specific_condition('malignant', feature_data, vgg_features)
            result["details"]["possibleConditions"].append({
                "name": malignant_condition,
                "probability": float(pred[0][1]),  # Malignant probability
                "description": CONDITION_DESCRIPTIONS.get(malignant_condition, ""),
                "category": "malignant"
            })
        
        # Include some diagnostic metrics
        result["details"]["diagnosticMetrics"] = {
            "featureCount": len(feature_data),
            "keyFeatures": {k: feature_data[k] for k in ['irregularity', 'asymmetry', 'area'] 
                           if k in feature_data}
        }
        
        return result
    
    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "processingTime": round(time.time() - start_time, 2)
        }

def main():
    """Main function to handle command line arguments"""
    try:
        # Get the image path from command line arguments
        if len(sys.argv) < 2:
            logger.error("No image path provided")
            sys.exit(1)
            
        image_path = sys.argv[1]
        logger.info(f"Processing image: {image_path}")
        
        # Make a prediction
        result = predict(image_path)
        
        # Print the result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        logger.error(f"Error in main function: {str(e)}")
        print(json.dumps({
            "success": False,
            "error": str(e)
        }))
        sys.exit(1)

if __name__ == "__main__":
    main() 