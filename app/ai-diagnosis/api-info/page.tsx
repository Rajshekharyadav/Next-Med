'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function GeminiAPIInfoPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push('/login?callbackUrl=/ai-diagnosis/api-info');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to login...</p>
      </div>
    );
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
            <li>
              Visit{' '}
              <Link href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Google AI Studio
              </Link>
            </li>
            <li>Sign in with your Google account</li>
            <li>Click on "Get API key" in the top navigation</li>
            <li>Create a new API key or use an existing one</li>
            <li>Copy your API key</li>
          </ol>

          <h2 className="text-xl font-semibold mt-8 mb-4">Setting Up Your Environment</h2>
          
          <ol className="list-decimal list-inside space-y-3">
            <li>Create a <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file in your project root</li>
            <li>Add the following line: <code className="bg-gray-100 px-2 py-1 rounded">GEMINI_API_KEY=your_api_key_here</code></li>
            <li>Replace <code className="bg-gray-100 px-2 py-1 rounded">your_api_key_here</code> with your actual API key</li>
            <li>Restart your development server</li>
          </ol>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Important Notes</h3>
            <ul className="list-disc list-inside text-blue-600 space-y-2">
              <li>Keep your API key secret and never commit it to version control</li>
              <li>The free tier has usage limits - check Google's documentation for details</li>
              <li>Consider implementing rate limiting for production use</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}