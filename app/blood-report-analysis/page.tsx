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
  const [processingStage, setProcessingStage] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState<number>(0);

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

  // Helper function to parse blood report data (simulated)
  const parseBloodReport = async (file: File): Promise<any> => {
    // This function simulates extracting text from a PDF and parsing blood test values
    // In a real implementation, you would use a PDF parsing library like pdf.js
    
    console.log('Parsing blood report:', file.name);
    
    // Simulate PDF reading process with a loading delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // STEP 1: Simulate extracting raw text from the PDF
    // This would normally be done with a PDF parsing library
    const simulateExtractedText = () => {
      // Different simulated text based on filename to demonstrate different reports
      if (file.name.toLowerCase().includes('anemia')) {
        return `
          PATIENT: John Doe
          DATE: ${new Date().toLocaleDateString()}
          
          COMPLETE BLOOD COUNT
          Hemoglobin: 10.5 g/dL (13.5-17.5)
          Red Blood Cells: 4.1 x10^12/L (4.5-5.5)
          Hematocrit: 32% (38.8-50)
          MCV: 78 fL (80-100)
          MCH: 25.6 pg (27-33)
          Platelets: 245 x10^9/L (150-450)
          White Blood Cells: 7.2 x10^9/L (4.5-11.0)
          
          METABOLIC PANEL
          Cholesterol: 195 mg/dL (<200)
          Glucose: 88 mg/dL (70-99)
        `;
      } else if (file.name.toLowerCase().includes('cholesterol') || file.name.toLowerCase().includes('lipid')) {
        return `
          PATIENT: Jane Smith
          DATE: ${new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
          
          LIPID PANEL
          Cholesterol (Total): 245 mg/dL (<200)
          LDL Cholesterol: 162 mg/dL (<100)
          HDL Cholesterol: 48 mg/dL (>40)
          Triglycerides: 180 mg/dL (<150)
          
          COMPLETE BLOOD COUNT
          Hemoglobin: 14.2 g/dL (13.5-17.5)
          Red Blood Cells: 5.1 x10^12/L (4.5-5.5)
          Hematocrit: 42% (38.8-50)
          White Blood Cells: 6.8 x10^9/L (4.5-11.0)
          Platelets: 260 x10^9/L (150-450)
          
          METABOLIC PANEL
          Glucose (Fasting): 92 mg/dL (70-99)
        `;
      } else {
        return `
          PATIENT: ${file.name.split('.')[0] || 'Patient'}
          DATE: ${new Date().toLocaleDateString()}
          
          COMPLETE BLOOD COUNT
          Hemoglobin: 13.2 g/dL (13.5-17.5)
          Red Blood Cells: 4.9 x10^12/L (4.5-5.5)
          Hematocrit: 39% (38.8-50)
          MCV: 82 fL (80-100)
          MCH: 27 pg (27-33)
          Platelets: 250 x10^9/L (150-450)
          White Blood Cells: 7.5 x10^9/L (4.5-11.0)
          Neutrophils: 60% (40-75)
          Lymphocytes: 30% (20-45)
          Monocytes: 7% (2-10)
          Eosinophils: 2% (0-6)
          Basophils: 1% (0-2)
          
          LIPID PANEL
          Cholesterol (Total): 210 mg/dL (<200)
          LDL Cholesterol: 130 mg/dL (<100)
          HDL Cholesterol: 55 mg/dL (>40)
          Triglycerides: 150 mg/dL (<150)
          
          METABOLIC PANEL
          Glucose (Fasting): 95 mg/dL (70-99)
          Creatinine: 0.9 mg/dL (0.7-1.3)
          Urea: 15 mg/dL (7-20)
          Uric Acid: 5.5 mg/dL (3.5-7.2)
          Total Protein: 7.2 g/dL (6.4-8.3)
          Albumin: 4.5 g/dL (3.5-5.0)
          Bilirubin: 0.8 mg/dL (0.3-1.2)
          ALT: 25 U/L (0-35)
          AST: 22 U/L (0-35)
          Alkaline Phosphatase: 70 U/L (30-120)
          
          ELECTROLYTES
          Sodium: 140 mmol/L (135-145)
          Potassium: 4.2 mmol/L (3.5-5.1)
          Chloride: 102 mmol/L (96-106)
          Calcium: 9.5 mg/dL (8.5-10.5)
          
          IRON STUDIES
          Iron: 80 μg/dL (60-170)
          Ferritin: 100 ng/mL (30-400)
        `;
      }
    };
    
    // Get the simulated extracted text
    const extractedText = simulateExtractedText();
    console.log('Extracted text from PDF:', extractedText.substring(0, 100) + '...');
    
    // STEP 2: Parse the extracted text to find blood test values
    // This uses regex patterns to find test names, values, and reference ranges
    const parseExtractedText = (text: string) => {
      const parsedData: {[key: string]: string} = {};
      const patientInfo: {name?: string, date?: string} = {};
      
      // Extract patient name and date
      const patientMatch = text.match(/PATIENT:\s*([^\n]+)/);
      if (patientMatch && patientMatch[1]) {
        patientInfo.name = patientMatch[1].trim();
      }
      
      const dateMatch = text.match(/DATE:\s*([^\n]+)/);
      if (dateMatch && dateMatch[1]) {
        patientInfo.date = dateMatch[1].trim();
      }
      
      // Regex pattern to match test name, value, and reference range
      // Format: TestName: Value Unit (Min-Max)
      const testPattern = /([^:\n]+):\s*([\d.]+)\s*([^\s\(]+)\s*\(([^)]+)\)/g;
      let match;
      
      while ((match = testPattern.exec(text)) !== null) {
        const [_, testName, value, unit, referenceRange] = match;
        const normalizedName = testName.trim().toLowerCase().replace(/\s+/g, '');
        parsedData[normalizedName] = `${value} ${unit}`;
      }
      
      // Special case for tests with different formats (e.g., < value)
      const specialTestPattern = /([^:\n]+):\s*([\d.]+)\s*([^\s\(]+)\s*\(<\s*([\d.]+)\)/g;
      while ((match = specialTestPattern.exec(text)) !== null) {
        const [_, testName, value, unit, maxValue] = match;
        const normalizedName = testName.trim().toLowerCase().replace(/\s+/g, '');
        parsedData[normalizedName] = `${value} ${unit}`;
      }
      
      return { parsedData, patientInfo };
    };
    
    // Parse the text to get structured data
    const { parsedData, patientInfo } = parseExtractedText(extractedText);
    
    // Map the normalized keys to our standard keys for analysis
    const standardizedData: {[key: string]: string} = {};
    const keyMapping: {[key: string]: string} = {
      'hemoglobin': 'hemoglobin',
      'redbloodcells': 'redBloodCells',
      'hematocrit': 'hematocrit',
      'mcv': 'mcv',
      'mch': 'mch',
      'platelets': 'platelets',
      'whitebloodcells': 'whiteBloodCells',
      'neutrophils': 'neutrophils',
      'lymphocytes': 'lymphocytes',
      'monocytes': 'monocytes',
      'eosinophils': 'eosinophils',
      'basophils': 'basophils',
      'cholesterol(total)': 'cholesterol',
      'cholesterol': 'cholesterol',
      'ldlcholesterol': 'ldl',
      'hdlcholesterol': 'hdl',
      'triglycerides': 'triglycerides',
      'glucose(fasting)': 'glucose',
      'glucose': 'glucose',
      'creatinine': 'creatinine',
      'urea': 'urea',
      'uricacid': 'uricAcid',
      'totalprotein': 'totalProtein',
      'albumin': 'albumin',
      'bilirubin': 'bilirubin',
      'alt': 'alt',
      'ast': 'ast',
      'alkalinephosphatase': 'alp',
      'sodium': 'sodium',
      'potassium': 'potassium',
      'chloride': 'chloride',
      'calcium': 'calcium',
      'iron': 'iron',
      'ferritin': 'ferritin'
    };
    
    // Map the parsed data to our standard keys
    Object.entries(parsedData).forEach(([key, value]) => {
      if (keyMapping[key]) {
        standardizedData[keyMapping[key]] = value;
      }
    });
    
    console.log('Standardized data:', standardizedData);
    
    return {
      parsedData: standardizedData,
      reportDate: patientInfo.date || new Date().toISOString().split('T')[0],
      patientName: patientInfo.name
    };
  };

  // Function to analyze blood test values and generate recommendations
  const analyzeBloodValues = (parsedData: any) => {
    const abnormalValues: any[] = [];
    const normalValues: any[] = [];
    const healthInsights: string[] = [];
    const nutritionAdvice: string[] = [];
    const lifestyleRecommendations: string[] = [];
    
    // Reference ranges - these would normally come from a medical database
    const referenceRanges: { [key: string]: { min: number; max: number; unit: string; description: string } } = {
      hemoglobin: { min: 13.5, max: 17.5, unit: 'g/dL', description: 'Hemoglobin' },
      redBloodCells: { min: 4.5, max: 5.5, unit: 'x10^12/L', description: 'Red Blood Cells' },
      hematocrit: { min: 38.8, max: 50, unit: '%', description: 'Hematocrit' },
      mcv: { min: 80, max: 100, unit: 'fL', description: 'Mean Corpuscular Volume' },
      mch: { min: 27, max: 33, unit: 'pg', description: 'Mean Corpuscular Hemoglobin' },
      platelets: { min: 150, max: 450, unit: 'x10^9/L', description: 'Platelets' },
      whiteBloodCells: { min: 4.5, max: 11.0, unit: 'x10^9/L', description: 'White Blood Cells' },
      neutrophils: { min: 40, max: 75, unit: '%', description: 'Neutrophils' },
      lymphocytes: { min: 20, max: 45, unit: '%', description: 'Lymphocytes' },
      monocytes: { min: 2, max: 10, unit: '%', description: 'Monocytes' },
      eosinophils: { min: 0, max: 6, unit: '%', description: 'Eosinophils' },
      basophils: { min: 0, max: 2, unit: '%', description: 'Basophils' },
      cholesterol: { min: 0, max: 200, unit: 'mg/dL', description: 'Total Cholesterol' },
      ldl: { min: 0, max: 100, unit: 'mg/dL', description: 'LDL Cholesterol' },
      hdl: { min: 40, max: 60, unit: 'mg/dL', description: 'HDL Cholesterol' },
      triglycerides: { min: 0, max: 150, unit: 'mg/dL', description: 'Triglycerides' },
      glucose: { min: 70, max: 99, unit: 'mg/dL', description: 'Glucose (Fasting)' },
      creatinine: { min: 0.7, max: 1.3, unit: 'mg/dL', description: 'Creatinine' },
      urea: { min: 7, max: 20, unit: 'mg/dL', description: 'Urea' },
      uricAcid: { min: 3.5, max: 7.2, unit: 'mg/dL', description: 'Uric Acid' },
      totalProtein: { min: 6.4, max: 8.3, unit: 'g/dL', description: 'Total Protein' },
      albumin: { min: 3.5, max: 5.0, unit: 'g/dL', description: 'Albumin' },
      bilirubin: { min: 0.3, max: 1.2, unit: 'mg/dL', description: 'Total Bilirubin' },
      alt: { min: 0, max: 35, unit: 'U/L', description: 'ALT' },
      ast: { min: 0, max: 35, unit: 'U/L', description: 'AST' },
      alp: { min: 30, max: 120, unit: 'U/L', description: 'Alkaline Phosphatase' },
      sodium: { min: 135, max: 145, unit: 'mmol/L', description: 'Sodium' },
      potassium: { min: 3.5, max: 5.1, unit: 'mmol/L', description: 'Potassium' },
      chloride: { min: 96, max: 106, unit: 'mmol/L', description: 'Chloride' },
      calcium: { min: 8.5, max: 10.5, unit: 'mg/dL', description: 'Calcium' },
      iron: { min: 60, max: 170, unit: 'μg/dL', description: 'Iron' },
      ferritin: { min: 30, max: 400, unit: 'ng/mL', description: 'Ferritin' }
    };

    // Check each value against reference ranges
    Object.entries(parsedData).forEach(([key, value]) => {
      if (referenceRanges[key]) {
        const range = referenceRanges[key];
        const numericValue = parseFloat(String(value).replace(/[^\d.-]/g, ''));
        const referenceRangeStr = `${range.min}-${range.max} ${range.unit}`;
        const valueWithUnit = `${numericValue} ${range.unit}`;
        
        if (numericValue < range.min || numericValue > range.max) {
          // Determine severity
          let severity = 'Mild';
          let interpretation = '';
          let recommendation = '';
          
          // Logic for determining severity based on how far outside range
          const percentageOutside = numericValue < range.min 
            ? (range.min - numericValue) / range.min * 100 
            : (numericValue - range.max) / range.max * 100;
          
          if (percentageOutside > 30) {
            severity = 'Severe';
          } else if (percentageOutside > 15) {
            severity = 'Moderate';
          }
          
          // Specific interpretations and recommendations based on test
          switch (key) {
            case 'hemoglobin':
              if (numericValue < range.min) {
                interpretation = `Below normal range, indicating possible ${severity.toLowerCase()} anemia. This can cause fatigue, weakness, and reduced oxygen transport to tissues.`;
                recommendation = 'Consider increasing iron-rich foods in your diet such as red meat, spinach, beans, and fortified cereals. Vitamin C can help with iron absorption.';
                
                healthInsights.push('Your hemoglobin levels indicate anemia, which may cause fatigue and weakness');
                nutritionAdvice.push('Increase iron-rich foods like lean red meat, beans, and leafy greens to address anemia');
                nutritionAdvice.push('Include vitamin C sources with iron-rich foods to improve absorption');
                lifestyleRecommendations.push('Consider talking to your doctor about iron supplementation if dietary changes don\'t help');
              } else {
                interpretation = `Above normal range, which could indicate polycythemia or dehydration.`;
                recommendation = 'Ensure you stay well-hydrated and consult with your doctor to rule out underlying conditions.';
                
                healthInsights.push('Your elevated hemoglobin levels may be due to dehydration or other conditions');
                nutritionAdvice.push('Increase your daily water intake to maintain proper hydration');
              }
              break;
              
            case 'cholesterol':
              if (numericValue > range.max) {
                interpretation = `Above normal range, indicating high cholesterol. This increases your risk of heart disease and stroke.`;
                recommendation = 'Focus on a heart-healthy diet low in saturated fats. Regular exercise and weight management can help. Discuss with your doctor if medication might be necessary.';
                
                healthInsights.push('Your cholesterol levels are elevated, which increases risk for cardiovascular issues');
                nutritionAdvice.push('Reduce saturated fat intake from fried foods and full-fat dairy to help lower cholesterol');
                nutritionAdvice.push('Add more soluble fiber from oats, beans, and fruits to help reduce cholesterol absorption');
                lifestyleRecommendations.push('Incorporate regular aerobic exercise (30 minutes, 5 times a week) to help lower cholesterol');
              }
              break;
              
            case 'ldl':
              if (numericValue > range.max) {
                interpretation = `LDL (bad) cholesterol is elevated, contributing to increased cardiovascular risk.`;
                recommendation = 'Reduce saturated fat intake, increase soluble fiber, and consider plant sterols/stanols. Regular exercise is also beneficial for lowering LDL.';
                
                healthInsights.push('Your LDL (bad) cholesterol is particularly high and should be addressed promptly');
                nutritionAdvice.push('Consider adding plant sterols/stanols found in special margarines and supplements');
                nutritionAdvice.push('Include omega-3 fatty acids from fatty fish, walnuts, and flaxseeds for heart health');
              }
              break;
              
            case 'glucose':
              if (numericValue > range.max) {
                interpretation = numericValue > 125 
                  ? 'Significantly elevated fasting glucose indicates possible diabetes.' 
                  : 'Elevated fasting glucose indicates prediabetes, which increases your risk of developing type 2 diabetes.';
                recommendation = 'Focus on reducing simple carbohydrates and sugars in your diet. Regular exercise and weight management can help improve insulin sensitivity.';
                
                healthInsights.push('Your fasting glucose levels are elevated, suggesting prediabetes or potential diabetes');
                nutritionAdvice.push('Reduce refined carbohydrates and added sugars in your diet');
                nutritionAdvice.push('Focus on complex carbohydrates with high fiber content');
                lifestyleRecommendations.push('Regular exercise can help improve insulin sensitivity and regulate blood sugar');
              }
              break;
              
            default:
              interpretation = numericValue < range.min
                ? `Below normal range for ${range.description}.`
                : `Above normal range for ${range.description}.`;
              recommendation = 'Consider discussing these results with your healthcare provider.';
          }
          
          abnormalValues.push({
            name: range.description,
            value: valueWithUnit,
            referenceRange: referenceRangeStr,
            interpretation,
            severity,
            recommendation
          });
        } else {
          normalValues.push({
            name: range.description,
            value: valueWithUnit,
            referenceRange: referenceRangeStr
          });
        }
      }
    });
    
    // Add general health insights if not already added
    if (normalValues.length > 0 && !healthInsights.find(i => i.includes('normal ranges'))) {
      healthInsights.push(`${normalValues.length} values are within normal ranges, indicating good overall health in those areas`);
    }
    
    // Add general lifestyle recommendations if not already added
    if (!lifestyleRecommendations.find(r => r.includes('adequate sleep'))) {
      lifestyleRecommendations.push('Ensure adequate sleep (7-8 hours) to support overall health and recovery');
    }
    
    if (!lifestyleRecommendations.find(r => r.includes('well-hydrated'))) {
      lifestyleRecommendations.push('Stay well-hydrated throughout the day');
    }
    
    if (!lifestyleRecommendations.find(r => r.includes('stress'))) {
      lifestyleRecommendations.push('Consider stress reduction techniques to support overall health');
    }
    
    if (abnormalValues.find(v => v.name.includes('Cholesterol') || v.name.includes('LDL')) && 
        !lifestyleRecommendations.find(r => r.includes('smoking'))) {
      lifestyleRecommendations.push('If you smoke, consider a smoking cessation program as smoking worsens cardiovascular risk');
    }
    
    return {
      abnormalValues,
      normalValues,
      healthInsights,
      nutritionAdvice,
      lifestyleRecommendations
    };
  };

  const handleAnalyzeReport = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to analyze');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setProcessingStage('Preparing to analyze...');
    setProcessingProgress(10);

    try {
      // Get auth token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Update progress for PDF extraction
      setProcessingStage('Extracting data from PDF...');
      setProcessingProgress(30);
      
      // Parse the uploaded report (this would normally be done on the server)
      // Here we're simulating it client-side for the demo
      const extractedData = await parseBloodReport(selectedFile);
      
      // Update progress for analysis
      setProcessingStage('Analyzing blood test values...');
      setProcessingProgress(60);
      
      // Generate analysis based on the extracted data
      const analysis = analyzeBloodValues(extractedData.parsedData);
      
      // Update progress for finalizing
      setProcessingStage('Generating recommendations...');
      setProcessingProgress(80);
      
      // Combine everything into a complete analysis result
      const completeAnalysis = {
        reportDate: extractedData.reportDate,
        patientInfo: {
          name: extractedData.patientName || user?.name || 'Patient',
          age: '35', // In a real app, this would come from the user profile
          gender: 'Male' // In a real app, this would come from the user profile
        },
        ...analysis,
        trends: {
          available: false,
          message: 'Historical data not available. Upload more reports to track health trends over time.'
        }
      };

      console.log('Analysis complete:', completeAnalysis);
      
      // Final progress update
      setProcessingStage('Finalizing results...');
      setProcessingProgress(95);
      
      // Add a small delay to show the final progress state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set the result
      setAnalysisResult(completeAnalysis);
      
      // Calculate health score based on abnormal values
      setHealthScore(calculateHealthScore(completeAnalysis.abnormalValues));
      setIsUploading(false);
      setProcessingProgress(100);
      setProcessingStage('');
    } catch (error) {
      console.error('Error analyzing report:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to analyze the report. Please try again.');
      setIsUploading(false);
      setProcessingProgress(0);
      setProcessingStage('');
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

                <div className="mb-6 bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-amber-800 font-medium">
                        Demo Mode Active
                      </p>
                      <p className="text-sm text-amber-700 mt-1">
                        This demonstration simulates PDF extraction from blood reports. Try uploading any PDF file - the filename will affect the simulated results:
                      </p>
                      <ul className="text-xs text-amber-700 mt-2 ml-4 list-disc">
                        <li>Files with "anemia" in the name will simulate anemia test results</li>
                        <li>Files with "cholesterol" or "lipid" in the name will simulate high cholesterol results</li>
                        <li>Other filenames will simulate a comprehensive blood panel</li>
                      </ul>
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
                      <span>{processingStage || 'Analyzing Report...'}</span>
                      {processingProgress > 0 && (
                        <div className="absolute inset-x-0 bottom-0 h-1 bg-gray-200">
                          <div 
                            className="h-full bg-primary transition-all duration-300 ease-in-out"
                            style={{ width: `${processingProgress}%` }}
                          ></div>
                        </div>
                      )}
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