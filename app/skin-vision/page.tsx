'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiCheck, FiInfo, FiShield, FiClock, FiExternalLink, FiAlertTriangle } from 'react-icons/fi';
import Link from 'next/link';

interface AnalysisResult {
  success: boolean;
  analysis: {
    condition: string;
    confidence: number;
    recommendations: string[];
    severity: string;
    possibleCauses: string[];
  };
  error?: string;
}

export default function SkinVisionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEducationalContent, setShowEducationalContent] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSelectedImage(e.target.result as string);
          setAnalyzing(true);
          setError(null);
          
          // Now make the actual API call
          analyzeImage(file);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/diagnostics/skin-analysis', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error analyzing image:', err);
      setError('Failed to analyze the image. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    setSelectedFile(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getSeverityBgColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border border-red-200';
      case 'medium': return 'bg-yellow-50 border border-yellow-200';
      case 'low': return 'bg-green-50 border border-green-200';
      default: return 'bg-blue-50 border border-blue-200';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const toggleEducationalContent = () => {
    setShowEducationalContent(!showEducationalContent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
            Skin Vision <span className="text-primary">Analysis</span>
          </h1>
          <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl mx-auto">
            Our AI-powered skin analysis tool uses a ResNet deep learning model to help identify potential skin conditions from your photos.
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
            {!selectedImage ? (
              <div className="flex flex-col items-center">
                <div 
                  onClick={triggerFileInput}
                  className="w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                >
                  <FiUpload className="text-gray-400 w-12 h-12 mb-4" />
                  <p className="text-gray-500 mb-1">Upload a photo of your skin condition</p>
                  <p className="text-xs text-gray-400">JPG, PNG or JPEG (max. 5MB)</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/jpg" 
                    onChange={handleFileChange}
                  />
                </div>
                
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <FiShield className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Privacy First</h3>
                    <p className="text-gray-600 text-sm">Your images are processed securely and never stored without permission</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <FiClock className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Instant Results</h3>
                    <p className="text-gray-600 text-sm">Get quick analysis powered by our VGG16 deep learning model</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <FiInfo className="text-primary w-6 h-6" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">Not a Diagnosis</h3>
                    <p className="text-gray-600 text-sm">This tool provides information only - always consult a doctor</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/5">
                  <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-square relative">
                    <img 
                      src={selectedImage} 
                      alt="Uploaded skin" 
                      className="w-full h-full object-cover"
                    />
                    {analyzing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={resetAnalysis}
                    className="mt-4 w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Upload different image
                  </button>

                  {result && !analyzing && result.success && (
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 flex items-center justify-between">
                        <span>Confidence: {result.analysis.confidence}%</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="md:w-3/5">
                  {analyzing ? (
                    <div className="h-full flex flex-col items-center justify-center">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">Analyzing your image...</h3>
                      <p className="text-gray-600 mb-4">Our AI is processing your skin image</p>
                      <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-4">
                        <div className="bg-primary h-2.5 rounded-full animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center">
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 w-full">
                        <h3 className="font-medium">Analysis Error</h3>
                        <p className="text-sm">{error}</p>
                      </div>
                      <button
                        onClick={() => selectedFile && analyzeImage(selectedFile)}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : result && result.success ? (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        <h3 className="text-2xl font-medium text-gray-900">Analysis Results</h3>
                        <span className={`ml-auto px-3 py-1 text-sm font-medium rounded-full ${getSeverityColor(result.analysis.severity)}`}>
                          {result.analysis.condition}
                        </span>
                      </div>
                      
                      <div className={`mb-6 p-4 rounded-lg ${getSeverityBgColor(result.analysis.severity)}`}>
                        <h4 className="font-medium mb-1">{result.analysis.condition}</h4>
                        <div className="mb-3 flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className={`h-2.5 rounded-full ${getConfidenceColor(result.analysis.confidence)}`} 
                              style={{ width: `${result.analysis.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-sm whitespace-nowrap">{result.analysis.confidence}% confidence</span>
                        </div>
                        <p className="text-sm">
                          {result.analysis.recommendations[0]}
                        </p>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium mb-3">Recommendations</h4>
                        <ul className="space-y-2">
                          {result.analysis.recommendations.map((recommendation, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-gray-700">{recommendation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-medium mb-2">Possible Causes</h4>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          {result.analysis.possibleCauses.map((cause, index) => (
                            <li key={index}>{cause}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h4 className="font-medium flex items-center mb-2">
                          <FiInfo className="text-primary mr-2" />
                          Important Notice
                        </h4>
                        <p className="text-sm text-gray-700">
                          This analysis is provided for informational purposes only and should not be considered a medical diagnosis. 
                          Always consult with a qualified healthcare provider for proper evaluation.
                        </p>
                      </div>
                      
                      <div className="mt-auto">
                        <Link
                          href="/doctors"
                          className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-md transition-colors flex items-center justify-center mb-3"
                        >
                          <FiCheck className="mr-2" />
                          Book a Dermatologist Consultation
                        </Link>
                        <button
                          onClick={resetAnalysis}
                          className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Start New Analysis
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Understanding Skin Conditions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Common Benign Skin Conditions</h3>
                <p className="text-gray-600 mb-2">
                  Many skin growths are harmless and very common. These include moles, skin tags, seborrheic keratoses, and dermatofibromas.
                </p>
                <p className="text-gray-600">
                  While these conditions are typically benign, it's important to monitor any changes in size, shape, or color, as these could indicate a need for medical attention.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">When to See a Dermatologist</h3>
                <p className="text-gray-600 mb-3">
                  It's recommended to see a dermatologist if you notice any of the following:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>A growth that is changing in size, shape, or color</li>
                  <li>A spot that looks significantly different from other spots on your body</li>
                  <li>A growth that is asymmetrical, has irregular borders, multiple colors, or is larger than 6mm</li>
                  <li>A sore that doesn't heal</li>
                  <li>A growth that itches, bleeds, or is painful</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Prevention Tips</h3>
                <p className="text-gray-600 mb-3">
                  Protect your skin and reduce your risk of skin cancer with these prevention strategies:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Apply broad-spectrum sunscreen with SPF 30+ daily</li>
                  <li>Wear protective clothing, including hats and sunglasses</li>
                  <li>Seek shade, especially between 10am and 4pm</li>
                  <li>Avoid tanning beds and sunlamps</li>
                  <li>Perform regular skin self-examinations</li>
                  <li>Schedule annual skin cancer screenings with a dermatologist</li>
                </ul>
              </div>
              
              <div className="pt-2">
                <Link 
                  href="https://www.aad.org/public/diseases/skin-cancer" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary font-medium hover:underline flex items-center"
                >
                  Learn more from the American Academy of Dermatology
                  <FiExternalLink className="ml-2" />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl shadow-md p-6 relative">
                <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-2 mb-3">Upload Your Photo</h3>
                <p className="text-gray-600">
                  Take a clear, well-lit photo of your skin concern and upload it to our secure platform.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 relative">
                <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-2 mb-3">AI Analysis</h3>
                <p className="text-gray-600">
                  Our VGG16 deep learning model analyzes the image for patterns consistent with various skin conditions.
                </p>
              </div>
              
              <div className="bg-white rounded-xl shadow-md p-6 relative">
                <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-2 mb-3">Get Insights</h3>
                <p className="text-gray-600">
                  Receive an instant analysis with recommended next steps based on the AI's assessment.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}