import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.resnet import preprocess_input
import numpy as np
import json
import os
import sys

# Model files are now in the same directory as this script
MODEL_PATH = 'resnet50_finetune.keras'
LABELS_PATH = 'class_indices.json'

# --- 1. Load Model and Labels ---

# Check if files exist
if not os.path.exists(MODEL_PATH):
    print(f"Error: Model file not found at {MODEL_PATH}")
    exit()
if not os.path.exists(LABELS_PATH):
    print(f"Error: Labels file not found at {LABELS_PATH}")
    exit()

# Load the model
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ ResNet-50 Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    exit()

# Load the class labels (using the inverted map from the notebook)
try:
    with open(LABELS_PATH, 'r') as f:
        class_labels = json.load(f)['inv_class_indices'] # e.g., {"0": "acne", "1": "rosacea", ...}
    print("✅ Class labels loaded.")
except Exception as e:
    print(f"Error loading {LABELS_PATH}. Make sure it contains 'inv_class_indices'. Error: {e}")
    exit()

# --- 2. Hardcoded Knowledge Base ---

KNOWLEDGE_BASE = {
    "Acne": {
        "recommendations": [
            "Wash the affected area twice daily with a gentle cleanser; avoid abrasive scrubs.",
            "Use topical treatments (benzoyl peroxide, topical retinoids) as recommended; consult a pharmacist or clinician for prescription options."
        ],
        "severity": "Medium",
        "possibleCauses": [
            "Blocked hair follicles and sebaceous glands",
            "Increased sebum production (hormonal influence)",
            "Bacterial overgrowth (Cutibacterium acnes) and inflammation"
        ],
        "source": "NHS (Acne)"
    },

    "Rosacea": {
        "recommendations": [
            "Identify and avoid personal triggers (heat, spicy foods, alcohol, sun exposure).",
            "Use gentle skincare and broad-spectrum sunscreen daily; topical or oral meds from a GP/dermatologist can control flare-ups."
        ],
        "severity": "Medium",
        "possibleCauses": [
            "Chronic inflammatory condition (exact cause unknown)",
            "Abnormal blood vessel reactivity and possible Demodex involvement",
            "Genetic and environmental triggers"
        ],
        "source": "NHS (Rosacea)"
    },

    "Psoriasis": {
        "recommendations": [
            "Keep skin moisturized; use topical corticosteroids or vitamin-D analogues for flares as advised by a clinician.",
            "Phototherapy or systemic/biologic treatments may be needed for moderate–severe disease under specialist care."
        ],
        "severity": "High (can be high for widespread or systemic disease)",
        "possibleCauses": [
            "Immune-mediated (T-cell driven) acceleration of skin cell turnover",
            "Genetic predisposition and environmental triggers (infections, stress, meds)"
        ],
        "source": "Mayo Clinic (Psoriasis)"
    },

    "Warts": {
        "recommendations": [
            "Most warts resolve spontaneously; topical treatments (salicylic acid), cryotherapy or clinic removal are options.",
            "Avoid direct contact with others' warts and do not pick at warts to reduce spread and scarring."
        ],
        "severity": "Low",
        "possibleCauses": [
            "Human papillomavirus (HPV) infection (many strains; different strains cause different wart types)"
        ],
        "source": "NHS / Cleveland Clinic (Warts)"
    },

    "Vitiligo": {
        "recommendations": [
            "See a dermatologist for options — topical corticosteroids, topical JAK inhibitors (where approved), or light therapy may help repigment some areas.",
            "Use sunscreen and cosmetics (camouflage) to protect depigmented areas and reduce contrast."
        ],
        "severity": "Medium (primarily cosmetic but psychosocial impact can be high)",
        "possibleCauses": [
            "Autoimmune destruction or dysfunction of melanocytes",
            "Genetic susceptibility and possible triggering events (stress, trauma, sunburn)"
        ],
        "source": "Mayo Clinic (Vitiligo)"
    },

    "Vasculitis": {
        "recommendations": [
            "Seek medical evaluation (some forms are serious and require systemic treatment).",
            "Treatment depends on type — may include corticosteroids and immunosuppression under specialist supervision."
        ],
        "severity": "High (many forms can damage organs if untreated)",
        "possibleCauses": [
            "Immune-mediated inflammation of blood vessels (various triggers)",
            "Associations with infections, medications, or autoimmune disease"
        ],
        "source": "Mayo Clinic (Vasculitis)"
    },

    "Vascular_Tumors": {
        "recommendations": [
            "Consult a clinician — many (e.g., infantile hemangiomas) are observed; treat if fast-growing, ulcerating, or function-threatening (beta blockers, laser).",
            "Large or midline lesions require specialist assessment."
        ],
        "severity": "Medium (variable; some benign/self-resolving, some need treatment)",
        "possibleCauses": [
            "Abnormal localized growth of blood vessels (often developmental)",
            "Genetic and developmental factors"
        ],
        "source": "Mayo Clinic (Hemangioma)"
    },

    "Tinea": {
        "recommendations": [
            "Keep the area clean and dry; topical antifungal creams (e.g., terbinafine, clotrimazole) are first-line for skin ringworm.",
            "For toenail or extensive infections, oral antifungals prescribed by a clinician may be necessary."
        ],
        "severity": "Low (common and usually treatable), higher risk if diabetic or immunosuppressed",
        "possibleCauses": [
            "Dermatophyte fungi (Trichophyton, Microsporum, Epidermophyton)",
            "Spread by skin-to-skin contact, animals, shared objects or surfaces"
        ],
        "source": "CDC (Tinea / Ringworm)"
    },

    "Sun_Sunlight_Damage": {
        "recommendations": [
            "Wear broad-spectrum sunscreen daily (SPF 30+), cover up, and avoid peak sun hours.",
            "Have suspicious or changing spots checked by a clinician; regular self-skin exams help early detection."
        ],
        "severity": "Medium (chronic sun damage increases risk of skin cancers; severity depends on extent and lesion type)",
        "possibleCauses": [
            "Cumulative UV radiation exposure causing DNA damage in skin cells"
        ],
        "source": "Cancer Society / NHS (Sun damage & prevention)"
    },

    "SkinCancer": {
        "recommendations": [
            "See a clinician promptly for any new, changing, bleeding, or non-healing lesion — early detection improves outcomes.",
            "Practice sun-protection and regular skin checks; suspicious moles may require biopsy/excision."
        ],
        "severity": "High (can be life-threatening for melanoma; early treatment is critical)",
        "possibleCauses": [
            "UV radiation (sun/tanning beds), genetic predisposition, immunosuppression"
        ],
        "source": "American Cancer Society / Cancer Research UK (Skin cancer signs)"
    },

    "Seaborrh_Keratoses": {
        "recommendations": [
            "Seborrhoeic keratoses are benign; removal is not required but can be done for cosmetic reasons (cryotherapy, curettage, laser).",
            "See a clinician if a lesion changes appearance — any changing pigmented lesion should be checked."
        ],
        "severity": "Low (benign)",
        "possibleCauses": [
            "Age-related proliferation of epidermal cells; often familial"
        ],
        "source": "British Association of Dermatologists / NHS (Seborrhoeic keratosis)"
    },

    "Moles": {
        "recommendations": [
            "Monitor moles for ABCDE changes (Asymmetry, Border irregularity, Color variation, Diameter, Evolution) and get new/changing moles checked.",
            "Photograph lesions you're tracking and report changes promptly to a clinician."
        ],
        "severity": "Low for common moles; high concern if suspicious for melanoma",
        "possibleCauses": [
            "Local clusters of melanocytes; influenced by genetics and UV exposure"
        ],
        "source": "National Cancer Institute / Cancer Research UK (Moles & melanoma)"
    },

    "Lupus": {
        "recommendations": [
            "Any persistent or photosensitive rash or systemic symptoms merits specialist assessment (rheumatology/dermatology).",
            "Sun protection and specialist-directed systemic or topical therapies are common parts of management."
        ],
        "severity": "High (systemic lupus can affect organs; cutaneous lupus may signal systemic disease)",
        "possibleCauses": [
            "Autoimmune processes, genetic predisposition, environmental triggers (sun exposure, meds)"
        ],
        "source": "Mayo Clinic (Lupus)"
    },

    "Lichen": {
        "recommendations": [
            "Topical steroids and symptomatic measures (emollients, antihistamines for itch) are commonly used; most cases improve over months.",
            "Refer to dermatology if widespread, mucosal, or persistent."
        ],
        "severity": "Medium (usually self-limited but can be uncomfortable)",
        "possibleCauses": [
            "Immune-mediated reaction; exact triggers often unknown"
        ],
        "source": "NHS (Lichen planus)"
    },

    "Infestions_Bites": {
        "recommendations": [
            "Clean the area; for itching use topical anti-itch creams or oral antihistamines; seek care if signs of infection or severe reaction.",
            "For suspected scabies or lice, follow recommended treatment regimens and treat close contacts if indicated."
        ],
        "severity": "Low for simple bites; high if allergic reaction or secondary infection occurs",
        "possibleCauses": [
            "Insect bites (mosquito, flea), mites (scabies), lice; local reactions and secondary infection"
        ],
        "source": "NHS / CDC (Insect bites & stings guidance)"
    },

    "Eczema": {
        "recommendations": [
            "Daily emollient use (moisturizers) is the cornerstone; topical corticosteroids treat flares and identify and avoid triggers.",
            "Severe or refractory cases may need specialist input, phototherapy, or systemic agents."
        ],
        "severity": "Medium (can be severe for widespread or infected eczema)",
        "possibleCauses": [
            "Atopic tendency (genetic), skin barrier dysfunction, environmental triggers/allergens"
        ],
        "source": "NHS (Atopic eczema)"
    },

    "DrugEruption": {
        "recommendations": [
            "If a new rash appears after starting a medication, contact a clinician — stop suspected drugs only after medical advice.",
            "Severe drug eruptions require urgent medical care (some can be life-threatening)."
        ],
        "severity": "Medium (most are self-limited) to High (rare severe reactions like SJS/TEN)",
        "possibleCauses": [
            "Immune reaction to a medication or its metabolites"
        ],
        "source": "Review: Cutaneous adverse drug reactions (NCBI/PubMed)"
    },

    "Candidiasis": {
        "recommendations": [
            "Keep affected areas clean and dry; topical antifungal creams (e.g., nystatin, clotrimazole) commonly treat skin yeast infections.",
            "Oral/systemic antifungals are used for extensive or recurrent infections and in immunocompromised patients."
        ],
        "severity": "Low for uncomplicated skin candidiasis; can be serious if invasive in immunocompromised",
        "possibleCauses": [
            "Overgrowth of Candida species (yeast) in warm, moist areas; risk factors include diabetes and immunosuppression"
        ],
        "source": "CDC (Candidiasis)"
    },

    "Bullous": {
        "recommendations": [
            "Seek dermatologist evaluation for blistering diseases; corticosteroids and immunosuppression are common treatments for autoimmune blistering disorders.",
            "Protect blisters, avoid infection, and follow specialist treatment plans."
        ],
        "severity": "High (bullous autoimmune diseases can be extensive and need specialist care)",
        "possibleCauses": [
            "Autoimmune attack on skin adhesion molecules (e.g., bullous pemphigoid, pemphigus vulgaris)",
        ],
        "source": "Mayo Clinic (Bullous pemphigoid)"
    },

    "Benign_tumors": {
        "recommendations": [
            "Most benign skin tumors are harmless; see a clinician if they change or cause symptoms.",
            "Removal options are available for cosmetic or symptomatic lesions."
        ],
        "severity": "Low",
        "possibleCauses": [
            "Varied: cysts, lipomas, benign adnexal tumors — often related to local cell proliferation or genetics"
        ],
        "source": "General dermatology references (NHS / Mayo Clinic)"
    },

    "Actintic_Keratosis": {
        "recommendations": [
            "Actinic (solar) keratoses can be precancerous — have suspicious or persistent rough, scaly patches checked and treated (cryotherapy, topical treatments).",
            "Reduce sun exposure and use sunscreen to help prevent new lesions."
        ],
        "severity": "Medium (precancerous — risk of progression to squamous cell carcinoma if untreated)",
        "possibleCauses": [
            "Chronic UV radiation damage leading to abnormal skin cell growth"
        ],
        "source": "NHS / Cancer Research UK (Actinic keratosis)"
    }
}


# --- 3. Define Prediction Function ---

def predict_image(image_path):
    """Predict skin condition from image and return JSON response"""
    if not os.path.exists(image_path):
        return {
            "success": False,
            "error": f"Test image not found at {image_path}"
        }

    try:
        # Load and preprocess the image
        img = image.load_img(image_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array_expanded = np.expand_dims(img_array, axis=0)
        img_ready = preprocess_input(img_array_expanded)
        
        # Make prediction
        prediction = model.predict(img_ready, verbose=0)
        
        # Process output
        class_index = np.argmax(prediction[0])
        class_name = class_labels.get(str(class_index), "Unknown") 
        confidence = float(prediction[0][class_index] * 100)

        # Build the JSON output
        if class_name in KNOWLEDGE_BASE:
            # It's a known skin condition
            data = KNOWLEDGE_BASE[class_name]
            return {
                "success": True,
                "analysis": {
                    "condition": class_name,
                    "confidence": round(confidence, 2),
                    "recommendations": data["recommendations"],
                    "severity": data["severity"],
                    "possibleCauses": data["possibleCauses"]
                }
            }
        
        elif class_name == "Unknown_Normal" or class_name == "Unknown":
            # It's the "Unknown" class
            return {
                "success": True,
                "analysis": {
                    "condition": "Unknown",
                    "confidence": round(confidence, 2),
                    "recommendations": [
                        "This image does not appear to be one of the known skin conditions.",
                        "Please try again with a clear photo of the affected area."
                    ],
                    "severity": "None",
                    "possibleCauses": ["Image is not a skin condition", "Blurry or unclear photo"]
                }
            }
        
        else:
            # It's a class we forgot to add to the KNOWLEDGE_BASE
            return {
                "success": False,
                "error": f"Data for class '{class_name}' not found in KNOWLEDGE_BASE. Please update the script."
            }

    except Exception as e:
        # Handle errors
        return {
            "success": False,
            "error": f"An error occurred during prediction: {str(e)}"
        }


# If this script is run directly, process the image file passed as argument
if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python predict_model.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    result = predict_image(image_path)
    print(json.dumps(result, indent=2))