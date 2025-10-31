# Skin Vision Analysis Backend Workflow

This document explains the complete workflow of the skin vision analysis backend.

## Directory Structure

All backend files are located in `backend/python_skin_analysis_api/`:

```
backend/python_skin_analysis_api/
├── class_indices.json          # Skin condition class labels
├── main.py                     # FastAPI application entry point
├── predict_model.py            # Model prediction logic
├── requirements.txt            # Python dependencies
├── resnet50_finetune.keras     # Trained ResNet-50 model
├── start_api.py                # Startup script
├── test_api.rest               # REST client test file
├── test_api_simple.py          # Simple API test script
├── workflow_test.py            # Workflow verification script
└── WORKFLOW.md                 # This file
```

## Workflow Steps

### 1. Model Files
- `resnet50_finetune.keras`: The trained ResNet-50 model file
- `class_indices.json`: JSON file mapping class indices to skin condition names
- `predict_model.py`: Contains the prediction logic and knowledge base

### 2. FastAPI Application (`main.py`)
1. **Imports and Setup**:
   - Import FastAPI and required modules
   - Configure CORS to allow requests from Next.js frontend
   - Import the `predict_image` function from `predict_model.py`

2. **Endpoints**:
   - `GET /`: Root endpoint returning a welcome message
   - `POST /predict-skin-lesion`: Main prediction endpoint

3. **Prediction Endpoint Workflow**:
   - Receive uploaded image file
   - Validate file type (must be an image)
   - Save image to temporary file
   - Call `predict_image()` function from `predict_model.py`
   - Return JSON response with prediction results
   - Clean up temporary file

### 3. Prediction Logic (`predict_model.py`)
1. **Model Loading**:
   - Load `resnet50_finetune.keras` model using TensorFlow
   - Load `class_indices.json` to map predictions to condition names

2. **Knowledge Base**:
   - Contains medical information for each skin condition
   - Includes recommendations, severity levels, and possible causes

3. **Prediction Function** (`predict_image`):
   - Load and preprocess the input image
   - Run prediction using the ResNet-50 model
   - Process the output to get the predicted class and confidence
   - Look up condition information in the knowledge base
   - Return structured JSON response

### 4. Integration with Next.js Frontend
1. **Frontend Upload**:
   - User uploads image through `/skin-vision` page
   - Image is sent to Next.js API route `/api/diagnostics/skin-analysis`

2. **Next.js API Route**:
   - Receives image from frontend
   - Forwards image to Python backend at `http://localhost:8000/predict-skin-lesion`
   - Returns Python backend response to frontend

3. **Frontend Display**:
   - Receives JSON response with prediction results
   - Displays condition, confidence, recommendations, and possible causes

## Testing the Backend

### 1. Workflow Verification
```bash
cd backend/python_skin_analysis_api
python workflow_test.py
```

### 2. API Testing
```bash
cd backend/python_skin_analysis_api
python start_api.py
# In another terminal:
python test_api_simple.py <path_to_test_image>
```

### 3. Manual API Testing
Use the `test_api.rest` file with VS Code's REST Client extension.

## Dependencies

Python dependencies are listed in `requirements.txt`:
- fastapi
- uvicorn[standard]
- tensorflow
- python-multipart

Install with:
```bash
pip install -r requirements.txt
```

## Starting the Backend

### Option 1: Using the startup script (Recommended)
```bash
cd backend/python_skin_analysis_api
python start_api.py
```

### Option 2: Manual start
```bash
cd backend/python_skin_analysis_api
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`.