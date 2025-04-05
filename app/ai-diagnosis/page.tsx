'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Loader2, AlertCircle, Check, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

// Common symptoms for the form
const COMMON_SYMPTOMS = [
  'Fever', 'Cough', 'Headache', 'Fatigue', 'Shortness of breath',
  'Nausea', 'Vomiting', 'Diarrhea', 'Abdominal pain', 'Chest pain',
  'Back pain', 'Joint pain', 'Muscle pain', 'Rash', 'Sore throat',
  'Runny nose', 'Congestion', 'Dizziness', 'Blurred vision'
];

export default function AIDiagnosisPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    router.push('/login?callbackUrl=/ai-diagnosis');
    return null;
  }

  const handleSymptomToggle = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom && !selectedSymptoms.includes(customSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom]);
      setCustomSymptom('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom');
      return;
    }

    if (!user?._id) {
      setError('User information is missing. Please log in again.');
      return;
    }

    setLoading(true);
    setError('');
    setDiagnosisResult(null);

    try {
      const response = await fetch('/api/diagnostics/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user._id,
          symptoms: selectedSymptoms,
          additionalInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setDiagnosisResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to get diagnosis');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedSymptoms([]);
    setAdditionalInfo('');
    setDiagnosisResult(null);
    setError('');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 text-primary">AI Symptom Analysis</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            This tool uses Google's Gemini AI to analyze your symptoms and provide possible conditions
            that might be causing them. Please note that this is not a medical diagnosis, and you should
            always consult with a healthcare professional.
          </p>
          <div className="flex items-center bg-blue-50 p-4 rounded-md text-blue-800">
            <AlertCircle className="mr-2 h-5 w-5" />
            <p className="text-sm">
              In case of emergency, call your local emergency services immediately.
            </p>
          </div>
          <div className="mt-4 flex items-center bg-green-50 p-4 rounded-md text-green-800">
            <img 
              src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-advanced.max-1200x1200.jpg" 
              alt="Google Gemini Logo" 
              className="h-5 w-5 mr-2"
            />
            <p className="text-sm">
              Powered by Google's Gemini AI - advanced medical symptom analysis 
              <Link href="/ai-diagnosis/api-info" className="ml-2 underline">
                Learn more
              </Link>
            </p>
          </div>
        </div>

        {!diagnosisResult ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-lg font-medium mb-3">
                Select your symptoms:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {COMMON_SYMPTOMS.map((symptom) => (
                  <div
                    key={symptom}
                    onClick={() => handleSymptomToggle(symptom)}
                    className={`
                      cursor-pointer rounded-md p-3 transition-colors
                      ${
                        selectedSymptoms.includes(symptom)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }
                    `}
                  >
                    {symptom}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">
                Add custom symptom:
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  className="flex-1 rounded-l-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter symptom"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSymptom}
                  disabled={!customSymptom}
                  className="bg-primary text-white px-4 rounded-r-md disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>

            {selectedSymptoms.length > 0 && (
              <div className="mb-6">
                <label className="block text-lg font-medium mb-2">
                  Selected symptoms:
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map((symptom) => (
                    <div
                      key={symptom}
                      className="bg-primary text-white px-3 py-2 rounded-full flex items-center"
                    >
                      <span>{symptom}</span>
                      <button
                        type="button"
                        onClick={() => handleSymptomToggle(symptom)}
                        className="ml-2 rounded-full bg-primary-dark p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-lg font-medium mb-2">
                Additional information:
              </label>
              <textarea
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Provide any additional details about your symptoms, medical history, etc."
                rows={4}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-md flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || selectedSymptoms.length === 0}
              className="w-full bg-primary text-white p-4 rounded-md font-medium hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Symptoms...
                </span>
              ) : (
                'Analyze Symptoms'
              )}
            </button>
          </form>
        ) : (
          <div className="diagnosis-results">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Analysis Results</h2>
              <button
                onClick={resetForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Start New Analysis
              </button>
            </div>

            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="text-amber-500 mr-3 h-6 w-6 flex-shrink-0 mt-1" />
                <p className="text-amber-800">
                  <span className="font-bold block mb-1">Important Disclaimer:</span>
                  {diagnosisResult.prediction.disclaimer || 
                    "This analysis is for informational purposes only and does not constitute medical advice or diagnosis. Always consult with qualified healthcare professionals for proper medical advice, diagnosis, and treatment."}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Possible Conditions:</h3>
              <div className="space-y-4">
                {diagnosisResult.prediction.possibleConditions.map((condition: any, index: number) => (
                  <div key={index} className="bg-white border rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-lg font-medium">{condition.name}</h4>
                      <div className="bg-gray-100 px-2 py-1 rounded-full text-sm">
                        {Math.round(condition.probability * 100)}% match
                      </div>
                    </div>
                    <p className="text-gray-700">{condition.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Recommended Actions:</h3>
              <ul className="bg-green-50 rounded-lg p-4 space-y-2">
                {diagnosisResult.prediction.recommendedActions.map((action: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-600 mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => router.push('/appointment')}
              className="w-full bg-primary text-white p-4 rounded-md font-medium hover:bg-primary-dark transition-colors"
            >
              Book Appointment with Doctor
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 