'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GeminiAPIInfoPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login?callbackUrl=/ai-diagnosis/api-info');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-primary">Setting Up Google Gemini API</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="prose prose-lg max-w-none">
          <p>
            NextMed uses Google's Gemini AI for symptom analysis and health insights. To use this feature,
            you need to set up a Gemini API key in your environment.
          </p>

          <h2 className="text-xl font-semibold mt-6 mb-4">How to Get a Gemini API Key</h2>
          
          <ol className="list-decimal list-inside space-y-3">
            <li>Visit <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google AI Studio</a></li>
            <li>Sign in with your Google account</li>
            <li>Navigate to the "API keys" section in your account</li>
            <li>Click "Create API Key" and follow the instructions</li>
            <li>Copy your new API key</li>
            <li>Add it to your .env.local file as GEMINI_API_KEY=your_api_key_here</li>
          </ol>

          <h2 className="text-xl font-semibold mt-6 mb-4">Benefits of Gemini AI</h2>
          
          <ul className="list-disc list-inside space-y-2">
            <li>Advanced medical pattern recognition</li>
            <li>Trained on a diverse range of medical data</li>
            <li>Designed to provide balanced and thoughtful health insights</li>
            <li>Regularly updated with the latest medical information</li>
            <li>Provides nuanced probability ratings for potential conditions</li>
          </ul>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
            <h3 className="text-lg font-medium mb-2 text-amber-800">Important Note</h3>
            <p className="text-amber-800">
              The API key provides access to Google's powerful AI models. Keep your API key secure and never share it publicly.
              The free tier of Gemini API has certain usage limits - consult the Google AI documentation for details.
            </p>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/ai-diagnosis"
              className="inline-block bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary-dark transition-colors"
            >
              Return to AI Diagnosis
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 