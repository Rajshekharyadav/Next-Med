'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestDBPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Testing database connection...');
  const [error, setError] = useState('');
  const [suggestion, setSuggestion] = useState('');

  useEffect(() => {
    async function testConnection() {
      try {
        const response = await fetch('/api/test-db');
        const data = await response.json();
        
        if (response.ok) {
          setStatus('success');
          setMessage(data.message || 'Connection successful');
        } else {
          setStatus('error');
          setMessage(data.message || 'Connection failed');
          setError(data.error || 'Unknown error');
          setSuggestion(data.suggestion || '');
        }
      } catch (err: any) {
        setStatus('error');
        setMessage('Failed to test connection');
        setError(err.message);
      }
    }
    
    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Database Connection Test</h1>
        
        <div className={`p-4 mb-4 rounded-md ${
          status === 'loading' ? 'bg-blue-50 text-blue-700' :
          status === 'success' ? 'bg-green-50 text-green-700' :
          'bg-red-50 text-red-700'
        }`}>
          <div className="flex items-center">
            {status === 'loading' && (
              <div className="mr-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            )}
            
            {status === 'success' && (
              <div className="mr-2">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            {status === 'error' && (
              <div className="mr-2">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            
            <p>{message}</p>
          </div>
          
          {error && (
            <div className="mt-2 ml-7">
              <p className="font-medium">Error: {error}</p>
            </div>
          )}
          
          {suggestion && (
            <div className="mt-2 ml-7">
              <p>Suggestion: {suggestion}</p>
            </div>
          )}
        </div>
        
        {status === 'error' && (
          <div className="mt-4 p-4 bg-yellow-50 text-yellow-700 rounded-md">
            <h2 className="font-medium mb-2">Troubleshooting Tips:</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check your MongoDB connection string in .env.local file</li>
              <li>Make sure username and password are correct</li>
              <li>Special characters in the password must be URL-encoded (% followed by hex code)</li>
              <li>Verify the MongoDB server is running and accessible</li>
              <li>Check if you need to whitelist your IP address in MongoDB Atlas</li>
            </ul>
          </div>
        )}
        
        <div className="mt-6 flex justify-center">
          <Link href="/" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 