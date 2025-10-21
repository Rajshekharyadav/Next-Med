# Skin Vision Analysis Python API

This directory contains the Python FastAPI service that exposes the ResNet-50 skin analysis model as a REST API.

## Prerequisites

Before running the API, ensure you have the following files in this directory:
- `resnet50_finetune.keras` - The trained ResNet-50 model
- `class_indices.json` - The class labels mapping file

## Setup Instructions

### Option 1: Using the startup script (Recommended)

1. **Navigate to the backend directory:**
   ```bash
   cd backend/python_skin_analysis_api
   ```

2. **Run the startup script:**
   ```bash
   python start_api.py
   ```

The startup script will automatically check for dependencies and install any missing ones.

### Option 2: Manual setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend/python_skin_analysis_api
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install the required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the API server:**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`.

## API Endpoints

### POST /predict-skin-lesion

Accepts an image file and returns skin analysis predictions.

**Request:**
- Form data with a file field named `file`

**Response:**
```json
{
  "success": true,
  "analysis": {
    "condition": "Acne",
    "confidence": 95.5,
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "severity": "Medium",
    "possibleCauses": ["Cause 1", "Cause 2"]
  }
}
```

## Integration with Next.js Frontend

The Next.js application makes requests to this API through the `/api/diagnostics/skin-analysis` endpoint, which acts as a proxy to this Python service.

## Model Information

- Uses a fine-tuned ResNet-50 model for skin disease classification
- Supports 21 different skin conditions
- Provides confidence scores and medical recommendations for each condition
- Includes a comprehensive knowledge base with treatment recommendations and possible causes

## Notes

- The model files (`resnet50_finetune.keras` and `class_indices.json`) must be present in this directory
- Ensure the Python API is running on port 8000 for proper integration with the Next.js frontend
- The API includes CORS configuration to allow requests from the Next.js frontend