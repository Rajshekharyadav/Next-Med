"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaUpload, FaCheckCircle, FaSpinner } from 'react-icons/fa';

// Types for analysis results
type SkinAnalysisResult = {
  condition: string;
  confidence: number;
  recommendations: string[];
  severity: string;
  possibleCauses: string[];
};

type BloodAnalysisResult = {
  summary: string;
  abnormalValues: {
    test: string;
    value: string;
    normalRange: string;
    interpretation: string;
    severity: string;
  }[];
  normalValues: {
    test: string;
    value: string;
    normalRange: string;
    interpretation: string;
  }[];
  recommendations: string[];
};

type SymptomAnalysisResult = {
  possibleConditions: string[];
  recommendedActions: string[];
  urgency: string;
  disclaimer: string;
};

const AIDiagnosticsSection = () => {
  // States for file uploads and analysis
  const [skinImage, setSkinImage] = useState<File | null>(null);
  const [bloodReport, setBloodReport] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<{skin: boolean, blood: boolean, general: boolean}>({
    skin: false,
    blood: false,
    general: false
  });
  const [generalSymptoms, setGeneralSymptoms] = useState<string>('');
  
  // States for analysis results
  const [skinResult, setSkinResult] = useState<SkinAnalysisResult | null>(null);
  const [bloodResult, setBloodResult] = useState<BloodAnalysisResult | null>(null);
  const [symptomResult, setSymptomResult] = useState<SymptomAnalysisResult | null>(null);
  const [showResults, setShowResults] = useState<{skin: boolean, blood: boolean, general: boolean}>({
    skin: false,
    blood: false, 
    general: false
  });

  // Handlers for file uploads
  const handleSkinUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSkinImage(e.target.files[0]);
      setSkinResult(null);
      setShowResults(prev => ({...prev, skin: false}));
    }
  };

  const handleBloodReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBloodReport(e.target.files[0]);
      setBloodResult(null);
      setShowResults(prev => ({...prev, blood: false}));
    }
  };

  // Function to analyze skin image with API
  const analyzeSkin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!skinImage) return;
    
    setIsAnalyzing(prev => ({ ...prev, skin: true }));
    
    try {
      // In a real implementation, this would upload the file
      // For demo purposes, we'll just make the API call without the actual file
      const response = await fetch('/api/diagnostics/skin-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: skinImage.name }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSkinResult(data.analysis);
        setShowResults(prev => ({...prev, skin: true}));
      } else {
        alert('Analysis failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error analyzing skin image:', error);
      alert('An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(prev => ({ ...prev, skin: false }));
    }
  };

  // Function to analyze blood report with API
  const analyzeBloodReport = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!bloodReport) return;
    
    setIsAnalyzing(prev => ({ ...prev, blood: true }));
    
    try {
      // In a real implementation, this would upload the file
      // For demo purposes, we'll just make the API call without the actual file
      const response = await fetch('/api/diagnostics/blood-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename: bloodReport.name }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBloodResult(data.analysis);
        setShowResults(prev => ({...prev, blood: true}));
      } else {
        alert('Analysis failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error analyzing blood report:', error);
      alert('An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(prev => ({ ...prev, blood: false }));
    }
  };

  // Function to analyze symptoms with API
  const startGeneralConsultation = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!generalSymptoms.trim()) return;
    
    setIsAnalyzing(prev => ({ ...prev, general: true }));
    
    try {
      const response = await fetch('/api/diagnostics/symptom-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: generalSymptoms }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSymptomResult(data.analysis);
        setShowResults(prev => ({...prev, general: true}));
      } else {
        alert('Analysis failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      alert('An error occurred during analysis. Please try again.');
    } finally {
      setIsAnalyzing(prev => ({ ...prev, general: false }));
    }
  };

  const resetAnalysis = (type: 'skin' | 'blood' | 'general') => {
    if (type === 'skin') {
      setSkinImage(null);
      setSkinResult(null);
      setShowResults(prev => ({...prev, skin: false}));
    } else if (type === 'blood') {
      setBloodReport(null);
      setBloodResult(null);
      setShowResults(prev => ({...prev, blood: false}));
    } else if (type === 'general') {
      setGeneralSymptoms('');
      setSymptomResult(null);
      setShowResults(prev => ({...prev, general: false}));
    }
  };

  return (
    <section id="ai-diagnostics" className="py-16 modern-bg overflow-x-hidden">
      <div className="container mx-auto px-4 overflow-x-hidden">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            AI-Powered Diagnostic Services
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 mb-6"
          >
            Leverage cutting-edge artificial intelligence for fast, accurate, and convenient health assessments without leaving your home.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-effect p-4 inline-block mx-auto"
          >
            <div className="flex items-center justify-center">
              <Image 
                src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-advanced.max-1200x1200.jpg" 
                alt="Google Gemini Logo" 
                width={24}
                height={24}
                className="mr-3"
                priority
              />
              <span className="font-medium text-blue-800">New!</span>
              <span className="mx-2 text-gray-700">Try our advanced</span>
              <a 
                href="/ai-diagnosis" 
                className="text-primary font-bold hover:underline flex items-center"
              >
                AI Symptom Analysis
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Skin Vision */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card overflow-hidden"
          >
            <div className="h-48 bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
              Skin Vision
            </div>
            <div className="p-6">
              {showResults.skin && skinResult ? (
                <>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Analysis Results</h3>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-gray-800">Detected Condition:</p>
                    <p className="text-primary font-medium text-lg">{skinResult.condition}</p>
                    <p className="text-sm text-gray-500">Confidence: {Math.round(skinResult.confidence * 100)}%</p>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-800 mb-2">Possible Causes:</p>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      {skinResult.possibleCauses.map((cause, idx) => (
                        <li key={idx}>{cause}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-800 mb-2">Recommendations:</p>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      {skinResult.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => resetAnalysis('skin')}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition duration-300 mt-4 mb-2"
                  >
                    Start New Analysis
                  </button>
                  
                  <a 
                    href="/skin-vision" 
                    className="w-full flex justify-center items-center py-2 mt-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    Try Skin Vision Advanced
                  </a>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">AI Skin Analysis</h3>
                  <p className="text-gray-600 mb-4">Upload photos of your skin conditions and receive AI-powered analysis and recommendations within minutes.</p>
                  <ul className="text-gray-600 mb-6 space-y-2">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Acne & Rash Detection
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Potential Melanoma Screening
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Personalized Care Recommendations
                    </li>
                  </ul>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload skin photo
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSkinUpload}
                      className="w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>

                  <button 
                    onClick={analyzeSkin}
                    disabled={!skinImage || isAnalyzing.skin}
                    className={`w-full flex justify-center items-center py-2 rounded transition duration-300 mb-2 ${
                      !skinImage ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    {isAnalyzing.skin ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : skinImage ? (
                      <>
                        <FaCheckCircle className="mr-2" />
                        Analyze Your Skin
                      </>
                    ) : (
                      <>
                        <FaUpload className="mr-2" />
                        Upload Photo First
                      </>
                    )}
                  </button>
                  
                  <a 
                    href="/skin-vision" 
                    className="w-full flex justify-center items-center py-2 mt-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    Try Skin Vision Advanced
                  </a>
                </>
              )}
            </div>
          </motion.div>
          
          {/* Blood Report Analysis */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card overflow-hidden"
          >
            <div className="h-48 bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
              Blood Report Analysis
            </div>
            <div className="p-6">
              {showResults.blood && bloodResult ? (
                <>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Report Analysis</h3>
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-gray-800">Summary:</p>
                    <p className="text-gray-700">{bloodResult.summary}</p>
                  </div>
                  
                  {bloodResult.abnormalValues.length > 0 && (
                    <div className="mb-4">
                      <p className="font-medium text-gray-800 mb-2">Abnormal Values:</p>
                      <div className="space-y-2">
                        {bloodResult.abnormalValues.map((item, idx) => (
                          <div key={idx} className="p-2 bg-yellow-50 rounded border border-yellow-100">
                            <p className="font-medium text-gray-800">{item.test}: <span className="text-red-600">{item.value}</span></p>
                            <p className="text-sm text-gray-600">Normal Range: {item.normalRange}</p>
                            <p className="text-sm text-gray-700">{item.interpretation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-800 mb-2">Recommendations:</p>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      {bloodResult.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => resetAnalysis('blood')}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition duration-300 mt-4"
                  >
                    Start New Analysis
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">AI Blood Report Interpretation</h3>
                  <p className="text-gray-600 mb-4">Upload your blood test reports and get detailed explanations and health insights in plain language.</p>
                  <ul className="text-gray-600 mb-6 space-y-2">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Comprehensive Analysis
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Health Trend Tracking
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Nutrition & Lifestyle Advice
                    </li>
                  </ul>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload blood report
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleBloodReportUpload}
                      className="w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                  </div>

                  <button 
                    onClick={analyzeBloodReport}
                    disabled={!bloodReport || isAnalyzing.blood}
                    className={`w-full flex justify-center items-center py-2 rounded transition duration-300 ${
                      !bloodReport ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    {isAnalyzing.blood ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : bloodReport ? (
                      <>
                        <FaCheckCircle className="mr-2" />
                        Analyze Your Report
                      </>
                    ) : (
                      <>
                        <FaUpload className="mr-2" />
                        Upload Report First
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
          
          {/* General AI Diagnosis */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card overflow-hidden"
          >
            <div className="h-48 bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
              AI Diagnosis
            </div>
            <div className="p-6">
              {showResults.general && symptomResult ? (
                <>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">Symptom Analysis</h3>
                  
                  {symptomResult.urgency === "high" && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                      <p className="font-bold">Urgent Attention Needed</p>
                      <p className="text-sm">Your symptoms may require immediate medical attention.</p>
                    </div>
                  )}
                  
                  {symptomResult.urgency === "medium" && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                      <p className="font-bold">Medical Attention Recommended</p>
                      <p className="text-sm">Your symptoms suggest you should consult with a healthcare provider.</p>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-800 mb-2">Possible Conditions:</p>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      {symptomResult.possibleConditions.map((condition, idx) => (
                        <li key={idx}>{condition}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <p className="font-medium text-gray-800 mb-2">Recommended Actions:</p>
                    <ul className="list-disc pl-5 text-gray-600 space-y-1">
                      {symptomResult.recommendedActions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="text-xs text-gray-500 italic mb-4">
                    {symptomResult.disclaimer}
                  </div>
                  
                  {symptomResult.urgency !== "low" && (
                    <button 
                      className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition duration-300 mb-2"
                    >
                      Book Doctor Appointment
                    </button>
                  )}
                  
                  <button 
                    onClick={() => resetAnalysis('general')}
                    className="w-full bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200 transition duration-300"
                  >
                    Start New Consultation
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">General Health Assessment</h3>
                  <p className="text-gray-600 mb-4">Describe your symptoms and medical history to receive AI-powered preliminary diagnosis and next steps.</p>
                  <ul className="text-gray-600 mb-6 space-y-2">
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Symptom Analysis
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Treatment Suggestions
                    </li>
                    <li className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                      Doctor Referral When Needed
                    </li>
                  </ul>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Describe your symptoms
                    </label>
                    <textarea
                      value={generalSymptoms}
                      onChange={(e) => setGeneralSymptoms(e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 resize-none"
                      placeholder="Example: I've had a headache for 3 days, slight fever, and my throat hurts when I swallow."
                    ></textarea>
                  </div>

                  <button 
                    onClick={startGeneralConsultation}
                    disabled={!generalSymptoms.trim() || isAnalyzing.general}
                    className={`w-full flex justify-center items-center py-2 rounded transition duration-300 ${
                      !generalSymptoms.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-dark'
                    }`}
                  >
                    {isAnalyzing.general ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      'Start AI Consultation'
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIDiagnosticsSection;