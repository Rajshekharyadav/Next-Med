'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Loader2, AlertCircle, Check, AlertTriangle, Search, X, Tag, Plus, Clock, ArrowRight, UserRound } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Categorized symptoms for better organization
const SYMPTOM_CATEGORIES = {
  'General': ['Fever', 'Fatigue', 'Weakness', 'Weight loss', 'Weight gain', 'Chills', 'Night sweats'],
  'Head & Neurological': ['Headache', 'Dizziness', 'Blurred vision', 'Memory problems', 'Confusion', 'Fainting'],
  'Respiratory': ['Cough', 'Shortness of breath', 'Wheezing', 'Sore throat', 'Runny nose', 'Congestion', 'Sneezing'],
  'Cardiovascular': ['Chest pain', 'Palpitations', 'Irregular heartbeat', 'Leg swelling', 'High blood pressure'],
  'Gastrointestinal': ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal pain', 'Bloating', 'Heartburn'],
  'Musculoskeletal': ['Back pain', 'Joint pain', 'Muscle pain', 'Stiffness', 'Swelling in joints'],
  'Skin': ['Rash', 'Itching', 'Hives', 'Skin discoloration', 'Dry skin', 'Excessive sweating'],
  'Psychological': ['Anxiety', 'Depression', 'Insomnia', 'Mood swings', 'Irritability', 'Stress'],
};

export default function AIDiagnosisPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('General');
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [useDebugEndpoint, setUseDebugEndpoint] = useState(true); // Set to true for testing

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      router.push('/login?callbackUrl=/ai-diagnosis');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated && typeof window !== 'undefined') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  const handleSymptomToggle = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
      
      // Add to recent searches if not already there
      if (!recentSearches.includes(symptom)) {
        const updatedRecentSearches = [symptom, ...recentSearches.slice(0, 4)];
        setRecentSearches(updatedRecentSearches);
      }
    }
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom && !selectedSymptoms.includes(customSymptom)) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom]);
      
      // Add to recent searches
      if (!recentSearches.includes(customSymptom)) {
        const updatedRecentSearches = [customSymptom, ...recentSearches.slice(0, 4)];
        setRecentSearches(updatedRecentSearches);
      }
      
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
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Use the debug endpoint for now to avoid Gemini API issues
      const response = await fetch(useDebugEndpoint ? '/api/diagnostics/debug' : '/api/diagnostics/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user._id,
          symptoms: selectedSymptoms,
          additionalInfo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API error response:', data);
        
        // Check for specific error suggestion
        if (data.suggestion) {
          if (!useDebugEndpoint) {
            // Switch to debug mode automatically if suggestion indicates we should
            setUseDebugEndpoint(true);
            throw new Error(`${data.error || 'Server error'}: ${data.details || ''} - Automatically switching to debug mode.`);
          } else {
            throw new Error(`${data.error || 'Server error'}: ${data.details || ''}`);
          }
        } else {
          throw new Error(data.error || 'Something went wrong with the analysis');
        }
      }

      if (!data || !data.prediction) {
        throw new Error('Invalid response format from the API');
      }

      setDiagnosisResult(data);
    } catch (err: any) {
      console.error('Diagnosis error:', err);
      setError(err.message || 'Failed to get diagnosis. Please try again.');
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

  // Filter symptoms based on search query
  const getFilteredSymptoms = () => {
    if (!searchQuery) return [];
    
    const allSymptoms = Object.values(SYMPTOM_CATEGORIES).flat();
    return allSymptoms.filter(symptom => 
      symptom.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get symptoms for active category
  const getActiveCategorySymptoms = () => {
    try {
      return SYMPTOM_CATEGORIES[activeCategory as keyof typeof SYMPTOM_CATEGORIES] || [];
    } catch (error) {
      console.error('Error getting category symptoms:', error);
      return [];
    }
  };

  const filteredSymptoms = getFilteredSymptoms();

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <img 
              src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-advanced.max-1200x1200.jpg" 
              alt="Google Gemini Logo" 
              className="h-10 w-10 mr-3"
            />
            <h1 className="text-4xl font-bold text-gray-800">AI Symptom Analysis</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get instant insights about your health symptoms using Google's advanced Gemini AI technology
          </p>
        </motion.div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-start">
              <div className="mr-6">
                <h2 className="text-2xl font-bold mb-2">How It Works</h2>
                <p className="text-blue-100">
                  Describe your symptoms to receive AI-powered analysis of possible conditions and recommended actions.
                </p>
              </div>
              <AlertCircle className="h-10 w-10 text-blue-200 flex-shrink-0" />
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="mb-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center">
                <img 
                  src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-advanced.max-1200x1200.jpg" 
                  alt="Google Gemini Logo" 
                  className="h-6 w-6 mr-3"
                />
                <div>
                  <p className="text-blue-800 font-medium">
                    Powered by Google's Gemini AI - advanced medical symptom analysis
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    For educational purposes only. Not a substitute for professional medical advice.
                    <Link href="/ai-diagnosis/api-info" className="ml-2 underline">
                      Learn more
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {!diagnosisResult ? (
              <motion.form 
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <Tag className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-xl font-bold text-gray-800">What symptoms are you experiencing?</h3>
                  </div>
                  
                  {/* Search and recent searches */}
                  <div className="mb-6">
                    <div className="relative mb-2">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setIsSearching(e.target.value.length > 0);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setSearchQuery('');
                            setIsSearching(false);
                          }
                        }}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        placeholder="Search for symptoms..."
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchQuery('');
                            setIsSearching(false);
                          }}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        </button>
                      )}
                    </div>
                    
                    {!isSearching && recentSearches.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>Recent searches:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((term) => (
                            <button
                              key={term}
                              type="button"
                              onClick={() => handleSymptomToggle(term)}
                              className={`px-3 py-1 rounded-full text-sm ${
                                selectedSymptoms.includes(term)
                                  ? 'bg-primary text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {term}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Filtered search results */}
                  {isSearching && (
                    <AnimatePresence>
                      <motion.div 
                        key="search-results"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-6"
                      >
                        <p className="text-sm text-gray-500 mb-2">Search results:</p>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredSymptoms.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {filteredSymptoms.map((symptom) => (
                                <motion.div
                                  key={symptom}
                                  initial={{ opacity: 0, scale: 0.95 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                  onClick={() => handleSymptomToggle(symptom)}
                                  className={`
                                    cursor-pointer rounded-lg p-3 flex items-center transition-all
                                    ${
                                      selectedSymptoms.includes(symptom)
                                        ? 'bg-primary text-white'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                                    }
                                  `}
                                >
                                  {selectedSymptoms.includes(symptom) ? (
                                    <Check className="h-4 w-4 mr-2 flex-shrink-0" />
                                  ) : (
                                    <Plus className="h-4 w-4 mr-2 flex-shrink-0" />
                                  )}
                                  <span>{symptom}</span>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 bg-gray-50 rounded-lg">
                              <p className="text-gray-500">No symptoms found. Try adding a custom symptom.</p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )}
                  
                  {/* Category selector */}
                  {!isSearching && (
                    <>
                      <div className="mb-4 overflow-x-auto">
                        <div className="flex space-x-2 pb-2">
                          {Object.keys(SYMPTOM_CATEGORIES).map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => setActiveCategory(category)}
                              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                                activeCategory === category
                                  ? 'bg-primary text-white font-medium shadow-md'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-700 mb-3">{activeCategory} Symptoms:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {getActiveCategorySymptoms().map((symptom) => (
                            <motion.div
                              key={symptom}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSymptomToggle(symptom)}
                              className={`
                                cursor-pointer rounded-lg p-3 flex items-center justify-between transition-all
                                ${
                                  selectedSymptoms.includes(symptom)
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white border border-gray-200 hover:border-primary hover:shadow-sm text-gray-800'
                                }
                              `}
                            >
                              <span>{symptom}</span>
                              {selectedSymptoms.includes(symptom) ? (
                                <Check className="h-5 w-5 flex-shrink-0" />
                              ) : (
                                <Plus className="h-5 w-5 text-gray-400 flex-shrink-0" />
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {/* Custom symptom entry */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Don't see your symptom? Add it here:
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={customSymptom}
                        onChange={(e) => setCustomSymptom(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && customSymptom.trim()) {
                            e.preventDefault();
                            handleAddCustomSymptom();
                          }
                        }}
                        className="flex-1 rounded-l-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        placeholder="Enter custom symptom"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSymptom}
                        disabled={!customSymptom}
                        className="bg-primary text-white px-4 rounded-r-lg flex items-center disabled:opacity-50 transition-all"
                      >
                        <Plus className="h-5 w-5 mr-1" />
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Selected symptoms display */}
                {selectedSymptoms.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg"
                  >
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Your selected symptoms ({selectedSymptoms.length}):
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSymptoms.map((symptom) => (
                        <motion.div
                          key={symptom}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          layout
                          className="bg-white text-primary px-3 py-2 rounded-full flex items-center border border-primary/30 shadow-sm"
                        >
                          <span>{symptom}</span>
                          <button
                            type="button"
                            onClick={() => handleSymptomToggle(symptom)}
                            className="ml-2 rounded-full bg-gray-100 p-1 hover:bg-gray-200 transition-colors"
                          >
                            <X className="h-3 w-3 text-gray-600" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Additional information */}
                <div className="mb-6">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-primary mr-2" />
                    <label className="block text-lg font-medium text-gray-800">
                      Additional details (optional):
                    </label>
                  </div>
                  <textarea
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 p-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Provide any additional details about your symptoms, how long you've had them, medical history, etc."
                    rows={4}
                  />
                </div>

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-start"
                  >
                    <AlertCircle className="mr-3 h-5 w-5 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-medium mb-1">{error}</p>
                      {error.includes('Invalid user ID format') && (
                        <p className="text-sm mt-1">
                          There appears to be an issue with your user ID format. This can happen when your account was created 
                          with a non-MongoDB compatible ID. Please use debug mode to test the application.
                        </p>
                      )}
                      {(error.includes('debug mode') || error.includes('Invalid user ID format') || error.includes('Database')) && !useDebugEndpoint && (
                        <div className="mt-2 flex items-center text-sm">
                          <button
                            type="button"
                            onClick={() => setUseDebugEndpoint(true)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                          >
                            Enable Debug Mode
                          </button>
                          <span className="ml-2">to test with sample data instead</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Debug mode toggle - visible in all environments */}
                <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useDebugEndpoint}
                      onChange={(e) => setUseDebugEndpoint(e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm text-yellow-800">
                      Debug Mode: {useDebugEndpoint ? 'ON (Using mock data)' : 'OFF (Using real API)'}
                    </span>
                  </label>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading || selectedSymptoms.length === 0}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    w-full flex items-center justify-center p-4 rounded-lg font-medium
                    transition-all ${
                      selectedSymptoms.length === 0
                        ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                        : 'bg-primary text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Analyzing with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze My Symptoms</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </motion.button>
              </motion.form>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="diagnosis-results"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <img 
                      src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-advanced.max-1200x1200.jpg" 
                      alt="Google Gemini Logo" 
                      className="h-6 w-6 mr-2"
                    />
                    <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
                  </div>
                  <button
                    onClick={resetForm}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Analysis
                  </button>
                </div>

                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="text-amber-500 mr-3 h-6 w-6 flex-shrink-0 mt-1" />
                    <p className="text-amber-800">
                      <span className="font-bold block mb-1">Important Disclaimer:</span>
                      {diagnosisResult.prediction.disclaimer || 
                        "This analysis is for informational purposes only and does not constitute medical advice or diagnosis. Always consult with qualified healthcare professionals for proper medical advice, diagnosis, and treatment."}
                    </p>
                  </div>
                </div>

                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Possible Conditions:</h3>
                  <div className="space-y-4">
                    {diagnosisResult.prediction.possibleConditions.map((condition: any, index: number) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-lg font-medium text-gray-800">{condition.name}</h4>
                          <div 
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              condition.probability > 0.7
                                ? 'bg-green-100 text-green-800'
                                : condition.probability > 0.4
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-orange-100 text-orange-800'
                            }`}
                          >
                            {Math.round(condition.probability * 100)}% match
                          </div>
                        </div>
                        <p className="text-gray-700">{condition.description}</p>
                        
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              condition.probability > 0.7
                                ? 'bg-green-500'
                                : condition.probability > 0.4
                                ? 'bg-yellow-500'
                                : 'bg-orange-500'
                            }`} 
                            style={{width: `${Math.round(condition.probability * 100)}%`}}
                          ></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h3 className="text-xl font-semibold mb-4 text-gray-800">Recommended Actions:</h3>
                  <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                    <ul className="space-y-4">
                      {diagnosisResult.prediction.recommendedActions.map((action: string, index: number) => (
                        <motion.li 
                          key={index} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className="flex items-start bg-white p-3 rounded-lg shadow-sm"
                        >
                          <Check className="text-green-600 mr-3 h-5 w-5 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-800">{action}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <button
                    onClick={() => router.push('/appointment')}
                    className="flex-1 bg-primary text-white p-4 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <UserRound className="h-5 w-5 mr-2" />
                    Book Doctor Appointment
                  </button>
                  
                  <button
                    onClick={resetForm}
                    className="flex-1 bg-gray-100 text-gray-800 p-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Start New Analysis
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 