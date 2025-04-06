# NextMed AI-powered Healthcare Platform

NextMed is an advanced healthcare platform leveraging AI technologies to provide comprehensive health services, including skin condition analysis, blood report interpretation, AI-powered diagnostics, and doctor consultations.

## Key Features

- **Skin Vision Analysis**: AI-powered skin condition detection using VGG16 neural network
- **Blood Report Analysis**: Automated interpretation of blood test results
- **AI Diagnostics**: Intelligent symptom analysis and health recommendations
- **Doctor Consultations**: Connect with healthcare professionals
- **Health Records**: Securely store and manage your medical history

## Technologies

- **Frontend**: Next.js, React, TailwindCSS, Framer Motion
- **Backend**: Next.js API Routes
- **AI/ML**: TensorFlow, VGG16, Python
- **Database**: MongoDB (for user data and health records)

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Python 3.8+ (for AI models)
- MongoDB (for production)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/your-username/nextmed.git
   cd nextmed
   ```

2. Install JavaScript dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Install Python dependencies for AI models
   ```
   pip install -r requirements.txt
   ```

4. Environment setup
   Create a `.env.local` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   USE_MOCK_SKIN_VISION=true  # Set to false to use the actual Python model
   ```

5. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

## Skin Vision AI Model

The Skin Vision feature uses a VGG16-based deep learning model to analyze skin conditions from uploaded photos.

### Model Training

The model was trained on dermatological image datasets to classify skin conditions into benign and potentially malignant categories. The VGG16 architecture was used with transfer learning to leverage pre-trained weights.

To train your own model:

1. Collect a dataset of classified skin condition images
2. Run the training script:
   ```
   python train_skin_vision_model.py --dataset_path /path/to/dataset --epochs 20
   ```

3. The trained model will be saved to the `models` directory

### Using the Skin Vision Feature

1. Navigate to the Skin Vision page
2. Upload a clear image of the skin condition
3. The AI will analyze the image and provide results
4. Follow the recommended actions based on the analysis

## License

MIT 