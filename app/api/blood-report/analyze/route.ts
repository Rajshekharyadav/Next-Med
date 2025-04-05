import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/tokenUtils';

// Define interfaces for the blood report analysis response
interface BloodTestValue {
  name: string;
  value: string;
  referenceRange: string;
  interpretation?: string;
  severity?: string;
  recommendation?: string;
}

interface BloodReportAnalysis {
  reportDate: string;
  patientInfo: {
    name: string;
    age: string;
    gender: string;
  };
  abnormalValues: BloodTestValue[];
  normalValues: BloodTestValue[];
  healthInsights: string[];
  nutritionAdvice: string[];
  lifestyleRecommendations: string[];
  trends: {
    available: boolean;
    message?: string;
    historicalData?: {
      dates: string[];
      values: {
        name: string;
        data: number[];
      }[];
    };
  };
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication from Authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    
    // Verify the token
    const userId = await verifyToken(token);
    
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Process the uploaded file
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    // Validate file type
    if (!file.type.includes('pdf')) {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }
    
    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
    }
    
    // Here, in a real implementation, you would:
    // 1. Save the file to a storage service or extract text with a PDF parser
    // 2. Process the report content with a specialized AI model
    // 3. Generate insights based on the blood test values
    
    // For this example, we'll return enhanced mock data
    const mockAnalysis: BloodReportAnalysis = {
      reportDate: new Date().toISOString().split('T')[0],
      patientInfo: {
        name: 'Patient Name', // In a real app, you would get this from the user profile
        age: '35',
        gender: 'Male',
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

    // Add a small delay to simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      analysis: mockAnalysis
    });
  } catch (error) {
    console.error('Blood report analysis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to analyze blood report' },
      { status: 500 }
    );
  }
} 