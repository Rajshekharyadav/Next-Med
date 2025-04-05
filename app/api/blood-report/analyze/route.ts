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
    
    // For this example, we'll return mock data
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