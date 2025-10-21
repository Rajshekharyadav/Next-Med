# NextMed - Advanced Healthcare Platform with AI Integration

NextMed is a modern healthcare platform that combines traditional healthcare services with cutting-edge AI diagnostics, telemedicine, and health record management. This project demonstrates a fully functional frontend with API integrations.

## Features

### AI Diagnostic Services
- **Skin Vision (AI Skin Analysis)**: Upload skin photos and receive AI-powered analysis and recommendations for skin conditions
- **Blood Report Analysis**: Upload blood test reports and get detailed interpretations in plain language
- **General AI Diagnosis**: Describe symptoms and receive preliminary diagnoses with recommended actions

### Health Records Management
- Securely store and access all your medical documents in one place
- Interactive health dashboard showing medical records, prescriptions, and vaccination history
- File upload system for adding new health records
- View history and details of past medical records

### Doctor Consultations
- Browse and filter available doctors by specialty
- Real-time available appointment slot viewing
- Appointment booking system for both video and in-person consultations
- Doctor profiles with education, specialties, ratings, and availability

### Responsive UI
- Modern, responsive design created with Tailwind CSS
- Smooth animations and transitions using Framer Motion
- Interactive UI elements for enhanced user experience
- Support for all device sizes from mobile to desktop

## Backend APIs (Mock Implementation)

The project includes several mock API routes to simulate a fully functional backend:

- `/api/diagnostics/skin-analysis`: Processes skin images and returns analysis
- `/api/diagnostics/blood-analysis`: Analyzes blood reports and provides interpretations
- `/api/diagnostics/symptom-analysis`: Processes text descriptions of symptoms for AI diagnosis
- `/api/health-records/upload`: Handles file uploads for health records
- `/api/doctors/list`: Returns lists of available doctors with filtering options
- `/api/appointments/book`: Handles appointment bookings

## Technologies Used

- **Next.js**: React framework for server-rendered React applications
- **React**: JavaScript library for building user interfaces
- **TypeScript**: Typed superset of JavaScript for better code quality
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **React Icons**: Icon library for React applications
- **API Routes**: Next.js API routes for backend functionality

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Python 3.8 or later (for AI services)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/next-med.git
cd next-med
```

2. Install frontend dependencies:
```bash
npm install
# or
yarn install
```

3. Set up the Python AI service:
```bash
cd backend/python_skin_analysis_api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Running the Application

1. Start the Python AI service:
```bash
# From backend/python_skin_analysis_api directory
python start_api.py
```

2. In a new terminal, start the Next.js development server:
```bash
# From the project root directory
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app`: Next.js app directory with page components and routes
- `/components`: Reusable React components
- `/components/home`: Home page specific components
- `/components/layout`: Layout components like header and footer
- `/app/api`: API routes for backend functionality
- `/backend/python_skin_analysis_api`: Python FastAPI service for AI skin analysis
- `/public`: Static assets like images

## Skin Vision Analysis Feature

The skin vision analysis feature uses a ResNet-50 deep learning model to analyze skin images. The implementation consists of:

1. A Python FastAPI service that exposes the AI model as a REST API
2. A Next.js API route that acts as a proxy to the Python service
3. A frontend interface in the skin vision page

The model supports 21 different skin conditions and provides confidence scores along with medical recommendations for each condition.

For detailed information about the integration, see [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md).

## Future Enhancements

- User authentication and authorization
- Integration with real AI models for diagnostics
- Real-time video consultation capabilities
- Mobile application using React Native
- Integration with real EHR (Electronic Health Records) systems

## License

This project is licensed under the MIT License - see the LICENSE file for details.