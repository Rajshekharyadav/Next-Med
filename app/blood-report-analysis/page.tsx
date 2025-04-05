'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { 
  Loader2, 
  AlertCircle, 
  Upload, 
  FileText, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Calendar, 
  TrendingUp, 
  Coffee,
  Activity,
  Heart,
  Droplet,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock chart components instead of using Chart.js directly
// This avoids the dependency errors while maintaining the visualization functionality
const MockDoughnut = ({ 
  data, 
  options 
}: { 
  data: { 
    labels: string[]; 
    datasets: { 
      data: number[]; 
      backgroundColor: string[]; 
      borderWidth: number; 
      circumference: number; 
      rotation: number; 
    }[] 
  }; 
  options: any 
}) => {
  // Calculate the percentage to display as an arc
  const percentage = data.datasets[0].data[0];
  const color = data.datasets[0].backgroundColor[0];
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-36 h-36 rounded-full border-8 border-gray-100 relative">
        <div 
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            clipPath: `polygon(50% 50%, 0 0, ${percentage <= 50 ? percentage * 2 : 100}% 0)`
          }}
        >
          <div className="w-full h-full bg-gray-100" />
        </div>
        <div 
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            clipPath: percentage > 50 
              ? `polygon(50% 50%, 100% 0, 100% ${(percentage - 50) * 2}%, 50% 50%)` 
              : 'none'
          }}
        >
          <div className="w-full h-full bg-gray-100" />
        </div>
        
        {/* Apply the colored arc overlay */}
        <div 
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            clipPath: `polygon(50% 50%, 0 0, ${percentage <= 50 ? percentage * 2 : 100}% 0)`
          }}
        >
          <div className="w-full h-full" style={{ backgroundColor: color }} />
        </div>
        <div 
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            clipPath: percentage > 50 
              ? `polygon(50% 50%, 100% 0, 100% ${(percentage - 50) * 2}%, 50% 50%)` 
              : 'none'
          }}
        >
          <div className="w-full h-full" style={{ backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
};

const MockBar = ({ 
  data, 
  options 
}: { 
  data: { 
    labels: string[]; 
    datasets: { 
      label: string; 
      data: number[]; 
      backgroundColor: string[]; 
      borderWidth: number; 
      barThickness: number; 
    }[] 
  }; 
  options: any 
}) => {
  const value = data.datasets[0].data[0];
  const referenceValue = data.datasets[0].data[1];
  const valueColor = data.datasets[0].backgroundColor[0];
  const referenceColor = data.datasets[0].backgroundColor[1];
  
  // Min/max values from options or defaults
  const min = options?.scales?.x?.min || 0;
  const max = options?.scales?.x?.max || 200;
  const range = max - min;
  
  // Calculate widths for bars as percentages
  const valueWidth = ((value - min) / range) * 100;
  const referenceWidth = ((referenceValue - min) / range) * 100;
  
  return (
    <div className="w-full h-full py-2">
      <div className="flex flex-col gap-2 w-full">
        <div className="text-xs text-gray-600 mb-1 flex justify-between">
          <span>{min}</span>
          <span>{max}</span>
        </div>
        
        {/* Value bar */}
        <div className="h-6 bg-gray-100 rounded-full w-full overflow-hidden relative">
          <div 
            className="h-full rounded-full" 
            style={{ 
              width: `${valueWidth}%`, 
              backgroundColor: valueColor 
            }}
          ></div>
          <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center px-3">
            <span className="text-xs font-medium text-white drop-shadow-md">
              Your value: {value}
            </span>
          </div>
        </div>
        
        {/* Reference range */}
        <div className="h-6 bg-gray-100 rounded-full w-full overflow-hidden relative">
          <div 
            className="h-full rounded-full" 
            style={{ 
              width: `${referenceWidth}%`, 
              backgroundColor: referenceColor 
            }}
          ></div>
          <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center px-3">
            <span className="text-xs font-medium text-white drop-shadow-md">
              Reference: {referenceValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper for calculating health score
const calculateHealthScore = (abnormalValues: any[]) => {
  if (!abnormalValues?.length) return 95;
  
  // Base score starts at 100
  let score = 100;
  
  // Deduct points based on severity
  abnormalValues.forEach(value => {
    if (value.severity === 'Mild') score -= 5;
    else if (value.severity === 'Moderate') score -= 10;
    else if (value.severity === 'Severe') score -= 20;
  });
  
  // Ensure score doesn't go below 0
  return Math.max(score, 0);
};

// Visualization components
const HealthScoreGauge = ({ score }: { score: number }) => {
  const data = {
    labels: ['Health Score', 'Remaining'],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [
          score > 80 ? '#10B981' : score > 60 ? '#FBBF24' : '#EF4444',
          '#E5E7EB'
        ],
        borderWidth: 0,
        circumference: 180,
        rotation: -90,
      }
    ]
  };

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="relative h-40 flex items-center justify-center">
      <div className="w-full h-full">
        <MockDoughnut data={data} options={options} />
      </div>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-sm text-gray-500">Health Score</span>
      </div>
    </div>
  );
};

const BloodValueComparisonChart = ({ value, name, referenceMin, referenceMax }: { 
  value: number, 
  name: string, 
  referenceMin: number, 
  referenceMax: number 
}) => {
  // Extract the numeric value
  const numValue = parseFloat(value.toString());
  
  // Create normalized values for visualization
  const min = Math.min(referenceMin * 0.8, numValue * 0.8);
  const max = Math.max(referenceMax * 1.2, numValue * 1.2);
  
  const data = {
    labels: ['Your Value', 'Normal Range'],
    datasets: [
      {
        label: name,
        data: [numValue, (referenceMin + referenceMax) / 2],
        backgroundColor: [
          numValue < referenceMin || numValue > referenceMax ? '#EF4444' : '#10B981',
          '#3B82F6'
        ],
        borderWidth: 0,
        barThickness: 30
      }
    ]
  };

  const options = {
    indexAxis: 'y' as const,
    scales: {
      x: {
        min: min,
        max: max,
        grid: {
          display: true
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      annotation: {
        annotations: {
          box1: {
            type: 'box',
            xMin: referenceMin,
            xMax: referenceMax,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderColor: 'rgba(59, 130, 246, 0.5)',
            borderWidth: 1
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="h-24 w-full">
      <MockBar data={data} options={options} />
    </div>
  );
};

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
    trends: false,
    visualization: true
  });
  const [healthScore, setHealthScore] = useState<number>(0);

  // Add chart registration
  useEffect(() => {
    // This would initialize Chart.js
  }, []);

  // Calculate health score when analysis results change
  useEffect(() => {
    if (analysisResult) {
      setHealthScore(calculateHealthScore(analysisResult.abnormalValues));
    }
  }, [analysisResult]);

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
              interpretation: 'Below normal range, indicating possible mild anemia. This can cause fatigue, weakness, and reduced oxygen transport to tissues.',
              severity: 'Mild',
              recommendation: 'Consider increasing iron-rich foods in your diet such as red meat, spinach, beans, and fortified cereals. Vitamin C can help with iron absorption.'
            },
            {
              name: 'Cholesterol (Total)',
              value: '245 mg/dL',
              referenceRange: '< 200 mg/dL',
              interpretation: 'Above normal range, indicating high cholesterol. This increases your risk of heart disease and stroke.',
              severity: 'Moderate',
              recommendation: 'Focus on a heart-healthy diet low in saturated fats. Regular exercise and weight management can help. Discuss with your doctor if medication might be necessary.'
            },
            {
              name: 'LDL Cholesterol',
              value: '162 mg/dL',
              referenceRange: '< 100 mg/dL',
              interpretation: 'LDL (bad) cholesterol is significantly elevated, contributing to your high total cholesterol and increasing cardiovascular risk.',
              severity: 'Moderate',
              recommendation: 'Reduce saturated fat intake, increase soluble fiber, and consider plant sterols/stanols. Regular exercise is also beneficial for lowering LDL.'
            }
          ],
          normalValues: [
            { name: 'White Blood Cells', value: '7.5 x10^9/L', referenceRange: '4.5-11.0 x10^9/L' },
            { name: 'Platelets', value: '250 x10^9/L', referenceRange: '150-450 x10^9/L' },
            { name: 'Glucose (Fasting)', value: '92 mg/dL', referenceRange: '70-99 mg/dL' },
            { name: 'HDL Cholesterol', value: '48 mg/dL', referenceRange: '> 40 mg/dL' },
            { name: 'Creatinine', value: '0.9 mg/dL', referenceRange: '0.7-1.3 mg/dL' }
          ],
          healthInsights: [
            'Your hemoglobin levels indicate mild anemia, which may cause fatigue and weakness',
            'Your cholesterol levels are elevated, which increases risk for cardiovascular issues',
            'Your LDL (bad) cholesterol is particularly high and should be addressed promptly',
            'All kidney function markers are normal, indicating good kidney health',
            'Blood sugar levels are within normal range, suggesting no immediate concerns for diabetes'
          ],
          nutritionAdvice: [
            'Increase iron-rich foods like lean red meat, beans, and leafy greens to address anemia',
            'Reduce saturated fat intake from fried foods and full-fat dairy to help lower cholesterol',
            'Add more soluble fiber from oats, beans, and fruits to help reduce cholesterol absorption',
            'Consider adding plant sterols/stanols found in special margarines and supplements',
            'Include omega-3 fatty acids from fatty fish, walnuts, and flaxseeds for heart health'
          ],
          lifestyleRecommendations: [
            'Incorporate regular aerobic exercise (30 minutes, 5 times a week) to help lower cholesterol',
            'Consider stress reduction techniques as stress can affect both anemia and cholesterol levels',
            'Ensure adequate sleep (7-8 hours) to support overall health and recovery',
            'Stay well-hydrated throughout the day',
            'If you smoke, consider a smoking cessation program as smoking worsens cardiovascular risk'
          ],
          trends: {
            available: false,
            message: 'Historical data not available. Upload more reports to track health trends over time.'
          }
        };

        setAnalysisResult(mockAnalysis);
        // Calculate health score based on abnormal values
        setHealthScore(calculateHealthScore(mockAnalysis.abnormalValues));
        setIsUploading(false);
      }, 2000);
    } catch (error) {
      console.error('Error analyzing report:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to analyze the report. Please try again.');
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-indigo-50 via-blue-50 to-white min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Blood Report Analysis</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Advanced AI-powered analysis of your blood test results with personalized insights and recommendations
          </p>
        </motion.div>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">AI-Powered Blood Test Analysis</h2>
                <p className="text-blue-100">
                  Get comprehensive insights from your blood test results with our advanced AI analysis
                </p>
              </div>
              <Activity className="h-10 w-10 text-blue-200 flex-shrink-0" />
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
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    uploadError ? 'border-red-300 bg-red-50' : 'border-blue-300 bg-blue-50/50 hover:border-primary hover:bg-blue-50'
                  }`}
                  onClick={handleBrowseClick}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <motion.div 
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
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
                        <FileText className="h-16 w-16 text-primary mb-3" />
                        <p className="text-lg font-medium text-gray-800 mb-1">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500 mb-3">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile();
                          }}
                          className="flex items-center text-red-600 hover:text-red-800 mt-2 px-3 py-1 border border-red-200 rounded-full"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          <span>Remove</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-16 w-16 text-blue-500 mb-3" />
                        <p className="text-xl font-medium text-gray-700 mb-2">
                          Drag and drop your blood test report here
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          or click to browse
                        </p>
                        <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-xs">
                          Supports PDF up to 10MB
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {uploadError && (
                  <div className="mt-3 text-red-600 flex items-start bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                    <>
                      <Activity className="mr-2 h-5 w-5" />
                      <span>Analyze Report</span>
                    </>
                  )}
                </motion.button>
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
                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg transition-colors flex items-center"
                    onClick={() => {
                      setAnalysisResult(null);
                      setSelectedFile(null);
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    New Analysis
                  </button>
                </div>

                {/* Health Score Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-1">
                      <h3 className="font-medium text-gray-800 mb-3 text-center">Health Score</h3>
                      <HealthScoreGauge score={healthScore} />
                    </div>
                    <div className="col-span-2 flex flex-col justify-center">
                      <div className="bg-white p-4 rounded-lg border border-gray-100">
                        <h3 className="font-medium text-gray-800 mb-2">Patient Information</h3>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Name: </span>
                            <span className="text-gray-800 font-medium">{analysisResult.patientInfo.name}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Age: </span>
                            <span className="text-gray-800 font-medium">{analysisResult.patientInfo.age}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Gender: </span>
                            <span className="text-gray-800 font-medium">{analysisResult.patientInfo.gender}</span>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <h4 className="text-sm font-medium text-gray-700 mb-1">Health Summary</h4>
                          <p className="text-sm text-gray-600">
                            {healthScore > 80 
                              ? 'Your overall health indicators are good with minor areas for improvement.' 
                              : healthScore > 60 
                                ? 'Your health indicators show some areas that need attention.' 
                                : 'Your health indicators suggest multiple areas requiring medical attention.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Data Visualization Section */}
                <div className="mb-6 border rounded-lg overflow-hidden">
                  <button 
                    className="w-full flex justify-between items-center p-4 bg-indigo-50 text-indigo-800 font-medium"
                    onClick={() => toggleSection('visualization')}
                  >
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 mr-2" />
                      <span>Blood Values Visualization</span>
                    </div>
                    {expandedSections.visualization ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>

                  {expandedSections.visualization && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 gap-6">
                        {analysisResult.abnormalValues.map((item: any, index: number) => {
                          // Extract numeric value and reference range
                          const valueNum = parseFloat(item.value.replace(/[^\d.-]/g, ''));
                          const rangeMatch = item.referenceRange.match(/([0-9.]+)-([0-9.]+)/);
                          const rangeLessThan = item.referenceRange.match(/< ([0-9.]+)/);
                          
                          let minVal = 0;
                          let maxVal = 0;
                          
                          if (rangeMatch) {
                            minVal = parseFloat(rangeMatch[1]);
                            maxVal = parseFloat(rangeMatch[2]);
                          } else if (rangeLessThan) {
                            minVal = 0;
                            maxVal = parseFloat(rangeLessThan[1]);
                          }
                          
                          return (
                            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-medium text-gray-800">{item.name}</h4>
                                <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  item.severity === 'Mild' ? 'bg-yellow-100 text-yellow-800' :
                                  item.severity === 'Moderate' ? 'bg-orange-100 text-orange-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {item.severity}
                                </div>
                              </div>
                              <div className="mb-4">
                                <span className="text-sm text-gray-500">Your Value: </span>
                                <span className="text-sm font-medium text-red-600">{item.value}</span>
                                <span className="text-sm text-gray-500 ml-2">Reference: </span>
                                <span className="text-sm text-gray-600">{item.referenceRange}</span>
                              </div>
                              {(minVal > 0 || maxVal > 0) && (
                                <BloodValueComparisonChart 
                                  name={item.name} 
                                  value={valueNum}
                                  referenceMin={minVal} 
                                  referenceMax={maxVal} 
                                />
                              )}
                              <p className="text-sm text-gray-700 mt-3">
                                {item.interpretation}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
                        <div key={index} className="mb-4 last:mb-0 p-4 bg-amber-50/50 rounded-lg border border-amber-100">
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
                          <p className="text-sm text-gray-700 mt-3">{item.interpretation}</p>
                          <div className="mt-3 pt-3 border-t border-amber-100">
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Recommendation:</span> {item.recommendation}
                            </p>
                          </div>
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
                      <Heart className="h-5 w-5 mr-2" />
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysisResult.healthInsights.map((insight: string, index: number) => (
                          <div key={index} className="p-4 bg-blue-50/30 rounded-lg border border-blue-100">
                            <div className="flex">
                              <div className="bg-blue-100 text-blue-600 p-2 rounded-full mr-3 flex-shrink-0">
                                <Award className="h-5 w-5" />
                              </div>
                              <p className="text-gray-700">{insight}</p>
                            </div>
                          </div>
                        ))}
                      </div>
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                            <Droplet className="h-5 w-5 mr-2 text-green-600" />
                            Nutrition Advice
                          </h4>
                          <div className="space-y-2">
                            {analysisResult.nutritionAdvice.map((advice: string, index: number) => (
                              <div key={index} className="p-3 bg-green-50/30 rounded-lg border border-green-100 flex items-start">
                                <div className="bg-green-100 text-green-600 p-1 rounded-full mr-2 mt-0.5 flex-shrink-0 h-5 w-5 flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                <p className="text-gray-700 text-sm">{advice}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                            <Activity className="h-5 w-5 mr-2 text-blue-600" />
                            Lifestyle Recommendations
                          </h4>
                          <div className="space-y-2">
                            {analysisResult.lifestyleRecommendations.map((recommendation: string, index: number) => (
                              <div key={index} className="p-3 bg-blue-50/30 rounded-lg border border-blue-100 flex items-start">
                                <div className="bg-blue-100 text-blue-600 p-1 rounded-full mr-2 mt-0.5 flex-shrink-0 h-5 w-5 flex items-center justify-center text-xs font-bold">
                                  {index + 1}
                                </div>
                                <p className="text-gray-700 text-sm">{recommendation}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
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
                        <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
                          <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4 max-w-md mx-auto">{analysisResult.trends.message}</p>
                          <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="mt-3 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors inline-flex items-center"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Previous Reports
                          </motion.button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-primary text-white p-4 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center shadow-md"
                  >
                    <FileText className="h-5 w-5 mr-2" />
                    Download Full Report
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-indigo-50 text-indigo-700 p-4 rounded-lg font-medium hover:bg-indigo-100 transition-colors flex items-center justify-center border border-indigo-200"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Share with Doctor
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 