# NextMed - Advanced Healthcare Platform

NextMed is a comprehensive healthcare platform that connects patients with healthcare providers, facilitates appointment booking, tracks health records, and now provides AI-powered symptom analysis.

## Features

- User authentication and profile management
- Appointment scheduling with healthcare providers
- Health records management
- AI-powered symptom analysis and condition prediction using Google's Gemini API
- Responsive design for desktop and mobile devices

## New Feature: AI Symptom Analysis with Gemini

The AI Symptom Analysis feature allows users to:

1. Select from common symptoms or add custom symptoms
2. Provide additional context about their condition
3. Receive AI-powered analysis of possible conditions using Google's Gemini AI
4. Get recommendations for next steps
5. Book appointments with relevant specialists based on the analysis

### How It Works

The AI Symptom Analysis uses Google's Gemini AI to analyze the symptoms provided by the user and generate insights about possible conditions. The system:

- Analyzes the combination of symptoms
- Considers symptom severity and duration
- Matches patterns against a medical knowledge base
- Provides probability-based predictions of possible conditions
- Suggests appropriate next steps for the user

### Important Disclaimer

The AI Symptom Analysis is for informational purposes only and does not constitute professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions you may have regarding a medical condition.

## Environment Setup

To run this application, you need to set up the following environment variables in a `.env.local` file:

```
# MongoDB Connection
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

To obtain a Gemini API key, visit [Google AI Studio](https://aistudio.google.com/) and create an API key in your account.

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables as described above
4. Run the development server:
   ```
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- Next.js (App Router)
- TypeScript
- MongoDB
- Tailwind CSS
- Google Gemini AI API
- NextAuth.js for authentication

## License

This project is licensed under the MIT License - see the LICENSE file for details. 