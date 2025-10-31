from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os
import sys
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Skin Vision Analysis API")

# Add CORS middleware to allow requests from Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Try to import the prediction function from your model
try:
    # The model files are in the same directory as this script
    current_dir = os.path.dirname(os.path.abspath(__file__))
    sys.path.append(current_dir)
    
    from predict_model import predict_image
    MODEL_AVAILABLE = True
    logger.info("ML Model loaded successfully")
except ImportError as e:
    logging.error(f"Could not import predict_model: {e}")
    MODEL_AVAILABLE = False

@app.get("/")
async def root():
    return {"message": "Skin Vision Analysis API"}

@app.post("/predict-skin-lesion")
async def predict_skin_lesion(file: UploadFile = File(...)):
    """
    Predict skin lesion from uploaded image file
    """
    if not MODEL_AVAILABLE:
        raise HTTPException(status_code=500, detail="ML Model not available")
    
    # Create a temporary file to save the uploaded image
    temp_file_path = f"temp_{file.filename}"
    
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image file
        image_bytes = await file.read()
        
        # Save image to temporary file
        with open(temp_file_path, "wb") as f:
            f.write(image_bytes)
        
        # Use your prediction function
        result = predict_image(temp_file_path)
        
        # Return the result
        if "success" in result and result["success"]:
            return JSONResponse(content=result)
        else:
            raise HTTPException(status_code=500, detail=result.get("error", "Unknown error occurred"))
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in predict_skin_lesion: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")
    finally:
        # Clean up temporary file if it exists
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)