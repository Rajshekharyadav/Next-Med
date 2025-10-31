# Skin Vision Analysis Integration Guide

This document explains how the skin vision analysis feature has been integrated into the NextMed application.

## Architecture Overview

The skin vision analysis feature consists of three main components:

1. **Next.js Frontend** (`app/skin-vision/page.tsx`): The user interface where users can upload skin images
2. **Next.js API Route** (`app/api/diagnostics/skin-analysis/route.ts`): Acts as a proxy between the frontend and Python backend
3. **Python FastAPI Service** (`backend/python_skin_analysis_api/main.py`): The actual AI model that processes images

## Data Flow

1. User uploads an image through the skin vision page
2. The frontend sends the image to the Next.js API route (`/api/diagnostics/skin-analysis`)
3. The Next.js API route forwards the image to the Python FastAPI service
4. The Python service processes the image using the VGG16 model
5. Results are sent back through the chain to the frontend for display

## Files Modified

### 1. `app/api/diagnostics/skin-analysis/route.ts`

- Removed hardcoded mock analysis
- Added logic to forward image files to the Python API
- Implemented error handling with fallback to mock data

### 2. `app/skin-vision/page.tsx`

- Updated to correctly await and process actual API responses
- Removed setTimeout and hardcoded setAnalysis calls
- Updated UI to match the new API response structure

### 3. `backend/python_skin_analysis_api/main.py` (New)

- Created a FastAPI service that exposes the skin analysis model
- Implemented CORS to allow requests from the Next.js frontend
- Added `/predict-skin-lesion` endpoint for image analysis
- Included proper error handling and response formatting

## Setup Instructions

### Running the Python API

1. Navigate to the backend directory:
   ```bash
   cd backend/python_skin_analysis_api
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the API server:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Running the Next.js Application

In the project root directory:
```bash
npm run dev
```

Both services need to be running simultaneously for the skin vision feature to work properly.

## API Endpoints

### Python FastAPI Endpoints

- `POST /predict-skin-lesion`: Accepts an image file and returns analysis results

### Next.js API Routes

- `POST /api/diagnostics/skin-analysis`: Proxy endpoint that forwards requests to the Python API

## Response Format

The Python API returns analysis results in the following format:

```json
{
  "success": true,
  "analysis": {
    "condition": "Benign/Malignant",
    "confidence": 95.5,
    "recommendations": ["Recommendation 1", "Recommendation 2"],
    "severity": "low/medium/high",
    "possibleCauses": ["Cause 1", "Cause 2"]
  }
}
```

## Error Handling

- If the Python API is unavailable, the Next.js API route falls back to mock data
- Proper error messages are displayed to users when analysis fails
- File type validation is performed on uploaded images

## Future Improvements

1. Replace the base VGG16 model with a trained skin analysis model
2. Add image preprocessing for better analysis accuracy
3. Implement model caching for improved performance
4. Add authentication and rate limiting to the Python API
5. Implement proper logging and monitoring