'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiCheck, FiInfo, FiShield, FiClock, FiExternalLink, FiAlertTriangle } from 'react-icons/fi';
import Link from 'next/link';

interface AnalysisResult {
  success: boolean;
  prediction: string;
  class: string;
  confidence: number;
  recommendedAction: string;
  processingTime?: number;
  error?: string;
  metadata?: Record<string, any>;
  details?: {
    possibleConditions: Array<{
      name: string;
      probability: number;
      description: string;
      category: string;
    }>;
    riskFactors: string[];
    recommendations: string[];
    additionalInfo?: {
      abcdRule: {
        asymmetry: boolean;
        borderIrregularity: boolean;
        colorVariation: boolean;
        diameter: boolean;
      }
    }
  };
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
      
      const response = await fetch('/api/skin-vision/analyze', {
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

  const calculateTotalScore = () => {
    if (!result?.details?.additionalInfo?.abcdRule) return 0;
    
    const { asymmetry, borderIrregularity, colorVariation, diameter } = result.details.additionalInfo.abcdRule;
    let score = 0;
    if (asymmetry) score += 1;
    if (borderIrregularity) score += 1;
    if (colorVariation) score += 1;
    if (diameter) score += 1;
    return score;
  };

  const getScoreColor = (score: number) => {
    if (score <= 1) return 'text-green-600';
    if (score === 2) return 'text-yellow-600';
    if (score === 3) return 'text-orange-500';
    return 'text-red-600';
  };

  const getScoreText = (score: number) => {
    if (score <= 1) return 'Low concern';
    if (score === 2) return 'Monitor';
    if (score === 3) return 'Moderate concern';
    return 'High concern';
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
            Our AI-powered skin analysis tool uses VGG16 deep learning to help identify potential skin conditions from your photos.
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

                  {result && !analyzing && (
                    <div className="mt-4">
                      <div className="text-xs text-gray-500 flex items-center justify-between">
                        <span>Processed in {result.processingTime?.toFixed(2) || '0.00'}s</span>
                        <span>Confidence: {result.confidence}%</span>
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
                  ) : result ? (
                    <div className="h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        <h3 className="text-2xl font-medium text-gray-900">Analysis Results</h3>
                        <span className={`ml-auto px-3 py-1 text-sm font-medium rounded-full ${
                          result.class === 'malignant' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {result.class === 'malignant' ? 'Potential Concern' : 'Likely Benign'}
                        </span>
                      </div>
                      
                      <div className={`mb-6 p-4 rounded-lg ${
                        result.class === 'malignant' 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-green-50 border border-green-200'
                      }`}>
                        <h4 className="font-medium mb-1">{result.prediction}</h4>
                        <div className="mb-3 flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                            <div 
                              className={`h-2.5 rounded-full ${
                                result.class === 'malignant' 
                                  ? 'bg-red-500' 
                                  : 'bg-green-500'
                              }`} 
                              style={{ width: `${result.confidence}%` }}
                            ></div>
                          </div>
                          <span className="text-sm whitespace-nowrap">{result.confidence}% confidence</span>
                        </div>
                        <p className="text-sm">
                          {result.recommendedAction}
                        </p>
                      </div>
                      
                      {result.details && (
                        <>
                          <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                              <h4 className="font-medium">ABCD Assessment</h4>
                              <button 
                                onClick={toggleEducationalContent}
                                className="text-primary text-sm flex items-center hover:underline"
                              >
                                {showEducationalContent ? 'Hide' : 'Learn more'} 
                                <FiInfo size={14} className="ml-1" />
                              </button>
                            </div>
                            
                            {showEducationalContent && (
                              <div className="bg-blue-50 p-3 rounded-lg mb-3 text-sm">
                                <p className="mb-2 font-medium">The ABCD Rule for Skin Cancer Detection:</p>
                                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                  <li><span className="font-medium">A</span>symmetry: One half of the spot is different from the other half</li>
                                  <li><span className="font-medium">B</span>order: Irregular, ragged, notched, or blurred edges</li>
                                  <li><span className="font-medium">C</span>olor: Variety of colors or uneven distribution of color</li>
                                  <li><span className="font-medium">D</span>iameter: Larger than 6mm (about the size of a pencil eraser)</li>
                                </ul>
                              </div>
                            )}
                            
                            {result.details.additionalInfo?.abcdRule && (
                              <div className="grid grid-cols-2 gap-3 mb-3">
                                <div className={`p-3 rounded-lg ${result.details.additionalInfo.abcdRule.asymmetry ? 'bg-red-50' : 'bg-green-50'}`}>
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">Asymmetry</span>
                                    <span className={result.details.additionalInfo.abcdRule.asymmetry ? 'text-red-600' : 'text-green-600'}>
                                      {result.details.additionalInfo.abcdRule.asymmetry ? 'Present' : 'Not Detected'}
                                    </span>
                                  </div>
                                </div>
                                <div className={`p-3 rounded-lg ${result.details.additionalInfo.abcdRule.borderIrregularity ? 'bg-red-50' : 'bg-green-50'}`}>
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">Border Irregularity</span>
                                    <span className={result.details.additionalInfo.abcdRule.borderIrregularity ? 'text-red-600' : 'text-green-600'}>
                                      {result.details.additionalInfo.abcdRule.borderIrregularity ? 'Present' : 'Not Detected'}
                                    </span>
                                  </div>
                                </div>
                                <div className={`p-3 rounded-lg ${result.details.additionalInfo.abcdRule.colorVariation ? 'bg-red-50' : 'bg-green-50'}`}>
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">Color Variation</span>
                                    <span className={result.details.additionalInfo.abcdRule.colorVariation ? 'text-red-600' : 'text-green-600'}>
                                      {result.details.additionalInfo.abcdRule.colorVariation ? 'Present' : 'Not Detected'}
                                    </span>
                                  </div>
                                </div>
                                <div className={`p-3 rounded-lg ${result.details.additionalInfo.abcdRule.diameter ? 'bg-red-50' : 'bg-green-50'}`}>
                                  <div className="flex justify-between items-center">
                                    <span className="font-medium">Diameter &gt;6mm</span>
                                    <span className={result.details.additionalInfo.abcdRule.diameter ? 'text-red-600' : 'text-green-600'}>
                                      {result.details.additionalInfo.abcdRule.diameter ? 'Present' : 'Not Detected'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {result.details.additionalInfo?.abcdRule && (
                              <div className={`p-3 rounded-lg text-center ${
                                calculateTotalScore() >= 3 ? 'bg-red-50' : calculateTotalScore() >= 1 ? 'bg-yellow-50' : 'bg-green-50'
                              }`}>
                                <div className="text-sm text-gray-700">ABCD Total Score</div>
                                <div className={`text-2xl font-bold ${getScoreColor(calculateTotalScore())}`}>
                                  {calculateTotalScore()}/4
                                </div>
                                <div className="text-sm font-medium mt-1">
                                  {getScoreText(calculateTotalScore())}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="mb-6">
                            <h4 className="font-medium mb-3">Possible Conditions</h4>
                            <div className="space-y-3">
                              {result.details.possibleConditions.map((condition, index) => (
                                <div key={index} className={`p-3 rounded-lg ${
                                  condition.category === 'malignant' ? 'bg-red-50 border border-red-100' : 'bg-gray-50 border border-gray-100'
                                }`}>
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium flex items-center">
                                      {condition.name}
                                      {condition.category === 'malignant' && (
                                        <FiAlertTriangle className="ml-2 text-amber-500" />
                                      )}
                                    </span>
                                    <span className="text-sm text-gray-500">{Math.round(condition.probability * 100)}%</span>
                                  </div>
                                  <p className="text-sm text-gray-600">{condition.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {result.details.riskFactors.length > 0 && (
                            <div className="mb-6">
                              <h4 className="font-medium mb-2">Identified Risk Factors</h4>
                              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                                {result.details.riskFactors.map((factor, index) => (
                                  <li key={index}>{factor}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <div className="mb-6">
                            <h4 className="font-medium mb-2">Recommendations</h4>
                            <ul className="space-y-2">
                              {result.details.recommendations.map((recommendation, index) => (
                                <li key={index} className="flex items-start">
                                  <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="text-gray-700">{recommendation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </>
                      )}
                      
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