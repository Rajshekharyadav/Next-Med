'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { Loader2, AlertCircle, Upload, FileText, Trash2, ChevronDown, ChevronUp, Calendar, TrendingUp, Coffee } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BloodReportAnalysisPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    abnormalValues: true,
    healthInsights: true,
    nutritionAdvice: true,
    trends: false
  });

  // Redirect if not authenticated
  if (!isAuthenticated && typeof window !== 'undefined') {
    router.push('/login?callbackUrl=/blood-report-analysis');
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      // Check if file is PDF
      if (file.type !== 'application/pdf') {
        setUploadError('Please upload a PDF file');
        return;
      }
      // Check if file size is less than 10MB
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size should be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setUploadError('');
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type !== 'application/pdf') {
        setUploadError('Please upload a PDF file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('File size should be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setUploadError('');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleAnalyzeReport = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to analyze');
      return;
    }

    setIsUploading(true);
    setUploadError('');

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Create form data to send the file
      const formData = new FormData();
      formData.append('file', selectedFile);

      // In a production app, call your API endpoint
      // For now, we'll simulate a response with a timeout
      // Uncomment the fetch code below when you're ready to use the real API
      /*
      const response = await fetch('/api/blood-report/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze the report');
      }

      setAnalysisResult(data.analysis);
      */
      
      // Simulate API call with a timeout (remove this in production)
      setTimeout(() => {
        // Mock response data
        const mockAnalysis = {
          reportDate: '2023-04-15',
          patientInfo: {
            name: user?.name || 'Patient',
            age: '35',
            gender: 'Male'
          },
          abnormalValues: [
            {
              name: 'Hemoglobin',
              value: '11.2 g/dL',
              referenceRange: '13.5-17.5 g/dL',
              interpretation: 'Below normal range, indicating possible mild anemia',
              severity: 'Mild',
              recommendation: 'Consider dietary changes to increase iron intake'
            },
            {
              name: 'Cholesterol (Total)',
              value: '245 mg/dL',
              referenceRange: '< 200 mg/dL',
              interpretation: 'Above normal range, indicating high cholesterol',
              severity: 'Moderate',
              recommendation: 'Dietary modifications and possibly medication if recommended by your doctor'
            }
          ],
          normalValues: [
            { name: 'White Blood Cells', value: '7.5 x10^9/L', referenceRange: '4.5-11.0 x10^9/L' },
            { name: 'Platelets', value: '250 x10^9/L', referenceRange: '150-450 x10^9/L' },
            { name: 'Glucose (Fasting)', value: '92 mg/dL', referenceRange: '70-99 mg/dL' }
          ],
          healthInsights: [
            'Your hemoglobin levels indicate mild anemia, which may cause fatigue and weakness',
            'Your cholesterol levels are elevated, which increases risk for cardiovascular issues',
            'All other values are within normal ranges, indicating good overall health in those areas'
          ],
          nutritionAdvice: [
            'Increase iron-rich foods like lean red meat, beans, and leafy greens to address anemia',
            'Reduce saturated fat intake from fried foods and full-fat dairy to help lower cholesterol',
            'Add more soluble fiber from oats, beans, and fruits to help reduce cholesterol absorption',
            'Consider adding plant sterols/stanols found in special margarines and supplements'
          ],
          lifestyleRecommendations: [
            'Incorporate regular aerobic exercise (30 minutes, 5 times a week) to help lower cholesterol',
            'Consider stress reduction techniques as stress can affect both anemia and cholesterol levels',
            'Ensure adequate sleep (7-8 hours) to support overall health and recovery',
            'Stay well-hydrated throughout the day'
          ],
          trends: {
            available: false,
            message: 'Historical data not available. Upload more reports to track health trends over time.'
          }
        };

        setAnalysisResult(mockAnalysis);
        setIsUploading(false);
      }, 2000);
    } catch (error) {
      console.error('Error analyzing report:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to analyze the report. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800">Blood Report Analysis</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-2">
            Upload your blood test reports and get detailed explanations and health insights in plain language
          </p>
        </motion.div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">AI-Powered Blood Test Analysis</h2>
                <p className="text-blue-100">
                  Get comprehensive insights from your blood test results with our advanced AI analysis
                </p>
              </div>
              <FileText className="h-10 w-10 text-blue-200 flex-shrink-0" />
            </div>
          </div>
          
          <div className="p-6 md:p-8">
            {!analysisResult ? (
              <div>
                <div className="mb-8 bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-700 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-blue-800 font-medium">
                        Upload your blood test report (PDF format only)
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        Your data is securely processed and not shared with third parties
                      </p>
                    </div>
                  </div>
                </div>

                <div 
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    uploadError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-blue-50'
                  }`}
                  onClick={handleBrowseClick}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="application/pdf" 
                    className="hidden" 
                  />
                  
                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <FileText className="h-12 w-12 text-primary mb-2" />
                      <p className="text-lg font-medium text-gray-800 mb-1">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500 mb-3">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                        className="flex items-center text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        <span>Remove</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-lg font-medium text-gray-700 mb-1">
                        Drag and drop your blood test report here
                      </p>
                      <p className="text-sm text-gray-500 mb-3">
                        or click to browse
                      </p>
                      <p className="text-xs text-gray-400">
                        Supports PDF up to 10MB
                      </p>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <div className="mt-3 text-red-600 flex items-start">
                    <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <button
                  onClick={handleAnalyzeReport}
                  disabled={!selectedFile || isUploading}
                  className={`mt-6 w-full flex items-center justify-center p-4 rounded-lg font-medium transition-all ${
                    !selectedFile || isUploading
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-primary text-white hover:bg-blue-600 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Analyzing Report...</span>
                    </>
                  ) : (
                    <span>Analyze Report</span>
                  )}
                </button>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="analysis-results"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
                    <p className="text-gray-500 text-sm flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      Report Date: {analysisResult.reportDate}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAnalysisResult(null);
                      setSelectedFile(null);
                    }}
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    New Analysis
                  </button>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                  <h3 className="font-medium text-blue-800 mb-1">Patient Information</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name: </span>
                      <span className="text-gray-800">{analysisResult.patientInfo.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Age: </span>
                      <span className="text-gray-800">{analysisResult.patientInfo.age}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Gender: </span>
                      <span className="text-gray-800">{analysisResult.patientInfo.gender}</span>
                    </div>
                  </div>
                </div>

                {/* Abnormal Values Section */}
                <div className="mb-6 border rounded-lg overflow-hidden">
                  <button 
                    className="w-full flex justify-between items-center p-4 bg-amber-50 text-amber-800 font-medium"
                    onClick={() => toggleSection('abnormalValues')}
                  >
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      <span>Abnormal Values Requiring Attention</span>
                    </div>
                    {expandedSections.abnormalValues ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>

                  {expandedSections.abnormalValues && (
                    <div className="p-4">
                      {analysisResult.abnormalValues.map((item: any, index: number) => (
                        <div key={index} className="mb-4 last:mb-0 p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                          <div className="flex justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{item.name}</h4>
                              <p className="text-sm text-gray-700 mt-1">
                                Value: <span className="font-medium text-amber-700">{item.value}</span> 
                                <span className="mx-1">|</span>
                                Reference: <span className="text-gray-600">{item.referenceRange}</span>
                              </p>
                            </div>
                            <div className={`px-2 py-1 text-xs font-medium rounded-full self-start ${
                              item.severity === 'Mild' ? 'bg-yellow-100 text-yellow-800' :
                              item.severity === 'Moderate' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {item.severity}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">{item.interpretation}</p>
                          <p className="text-sm text-gray-700 mt-2">
                            <span className="font-medium">Recommendation:</span> {item.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Health Insights Section */}
                <div className="mb-6 border rounded-lg overflow-hidden">
                  <button 
                    className="w-full flex justify-between items-center p-4 bg-blue-50 text-blue-800 font-medium"
                    onClick={() => toggleSection('healthInsights')}
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      <span>Health Insights</span>
                    </div>
                    {expandedSections.healthInsights ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>

                  {expandedSections.healthInsights && (
                    <div className="p-4">
                      <ul className="list-disc pl-5 space-y-2">
                        {analysisResult.healthInsights.map((insight: string, index: number) => (
                          <li key={index} className="text-gray-700">{insight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Nutrition & Lifestyle Advice */}
                <div className="mb-6 border rounded-lg overflow-hidden">
                  <button 
                    className="w-full flex justify-between items-center p-4 bg-green-50 text-green-800 font-medium"
                    onClick={() => toggleSection('nutritionAdvice')}
                  >
                    <div className="flex items-center">
                      <Coffee className="h-5 w-5 mr-2" />
                      <span>Nutrition & Lifestyle Recommendations</span>
                    </div>
                    {expandedSections.nutritionAdvice ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>

                  {expandedSections.nutritionAdvice && (
                    <div className="p-4">
                      <h4 className="font-medium text-gray-800 mb-2">Nutrition Advice</h4>
                      <ul className="list-disc pl-5 space-y-2 mb-4">
                        {analysisResult.nutritionAdvice.map((advice: string, index: number) => (
                          <li key={index} className="text-gray-700">{advice}</li>
                        ))}
                      </ul>

                      <h4 className="font-medium text-gray-800 mb-2">Lifestyle Recommendations</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        {analysisResult.lifestyleRecommendations.map((recommendation: string, index: number) => (
                          <li key={index} className="text-gray-700">{recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Health Trends */}
                <div className="mb-6 border rounded-lg overflow-hidden">
                  <button 
                    className="w-full flex justify-between items-center p-4 bg-purple-50 text-purple-800 font-medium"
                    onClick={() => toggleSection('trends')}
                  >
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      <span>Health Trends Over Time</span>
                    </div>
                    {expandedSections.trends ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>

                  {expandedSections.trends && (
                    <div className="p-4">
                      {analysisResult.trends.available ? (
                        <div>
                          {/* Trend visualization would go here */}
                          <p>Charts and trends visualization</p>
                        </div>
                      ) : (
                        <div className="text-center py-6 px-4 bg-gray-50 rounded-lg">
                          <TrendingUp className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">{analysisResult.trends.message}</p>
                          <button className="mt-3 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Upload Previous Reports
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button className="flex-1 bg-primary text-white p-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Download Full Report
                  </button>
                  
                  <button className="flex-1 bg-gray-100 text-gray-800 p-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Share with Doctor
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 