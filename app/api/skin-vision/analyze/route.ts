import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    // Increase the response limit for larger payloads
    responseLimit: '8mb',
    // Increase the body parser size limit for larger images
    bodyParser: {
      sizeLimit: '8mb',
    },
  },
};

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

// Map of condition names to descriptions for type safety
const conditionDescriptions: Record<string, string> = {
  'Benign Nevus': 'A common type of mole that is harmless and not cancerous.',
  'Seborrheic Keratosis': 'A common benign skin growth that appears as a waxy, scaly, slightly raised growth.',
  'Dermatofibroma': 'A common benign skin nodule that often appears on the arms or legs.',
  'Solar Lentigo': 'A harmless patch of darkened skin caused by exposure to UV light.',
  'Melanoma': 'A serious form of skin cancer that begins in cells known as melanocytes.',
  'Basal Cell Carcinoma': 'The most common type of skin cancer that rarely spreads but can be locally destructive.',
  'Squamous Cell Carcinoma': 'The second most common form of skin cancer that can spread if not treated.'
};

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    // Get the uploaded file from form data
    const formData = await req.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No image file provided',
          processingTime: (Date.now() - startTime) / 1000 
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid file type. Please upload an image.',
          processingTime: (Date.now() - startTime) / 1000 
        },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'File size exceeds 5MB limit',
          processingTime: (Date.now() - startTime) / 1000 
        },
        { status: 400 }
      );
    }

    // Extract metadata from the image if available
    const metadata = {
      fileType: file.type,
      fileSize: file.size,
      fileName: file.name,
      analyzedAt: new Date().toISOString(),
    };

    // In development or when Python/TensorFlow is not available, use mock data
    const useMockData = process.env.NODE_ENV === 'development' || process.env.USE_MOCK_SKIN_VISION === 'true';
    
    if (useMockData) {
      console.log('Using mock data for skin vision analysis');
      return mockSkinVisionResponse(metadata);
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save the uploaded file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${uuidv4()}.${file.name.split('.').pop()}`;
    const filePath = join(uploadsDir, fileName);
    await writeFile(filePath, buffer);

    console.log(`Image saved to ${filePath}`);

    // Call the Python script with the image file path
    try {
      const result = await runPythonScript(filePath);
      
      // Add metadata to the result
      const enhancedResult: AnalysisResult = {
        ...result,
        metadata: metadata
      };
      
      // Clean up the temporary file
      try {
        await writeFile(filePath, Buffer.from('')); // Clear file contents
      } catch (err) {
        console.error('Error cleaning up file:', err);
      }
      
      return NextResponse.json(enhancedResult);
    } catch (error) {
      console.error('Error in Python script:', error);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Error processing image with AI model',
          processingTime: (Date.now() - startTime) / 1000,
          metadata: metadata
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error processing skin image:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process the image',
        processingTime: (Date.now() - startTime) / 1000
      },
      { status: 500 }
    );
  }
}

/**
 * Run the Python script for skin analysis
 */
async function runPythonScript(imagePath: string): Promise<AnalysisResult> {
  return new Promise((resolve, reject) => {
    const pythonScript = join(process.cwd(), 'skin_vision_model.py');
    
    console.log(`Running Python script: ${pythonScript} with image: ${imagePath}`);
    
    const pythonProcess = spawn('python', [pythonScript, imagePath]);
    
    let outputData = '';
    let errorData = '';
    
    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
      console.error(`Python error: ${data.toString()}`);
    });
    
    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python process exited with code ${code}: ${errorData}`));
      }
      
      try {
        const result = JSON.parse(outputData);
        resolve(result);
      } catch (error) {
        reject(new Error(`Failed to parse Python output: ${outputData}`));
      }
    });
  });
}

/**
 * Generate a mock response for testing with enhanced details
 */
function mockSkinVisionResponse(metadata?: any): Promise<NextResponse> {
  // Determine if the result should be benign or malignant
  const isMalignant = Math.random() > 0.7;
  const confidence = Math.floor(Math.random() * 30 + 70);
  
  // Select specific condition based on category
  const conditions = {
    'benign': [
      'Benign Nevus',
      'Seborrheic Keratosis', 
      'Dermatofibroma',
      'Solar Lentigo'
    ],
    'malignant': [
      'Melanoma',
      'Basal Cell Carcinoma',
      'Squamous Cell Carcinoma'
    ]
  };
  
  const classType = isMalignant ? 'malignant' : 'benign';
  const conditionList = conditions[classType];
  const conditionIndex = Math.floor(Math.random() * conditionList.length);
  const selectedCondition = conditionList[conditionIndex];
  
  // Get descriptions for the conditions
  const selectedDescription = conditionDescriptions[selectedCondition] || '';
  const secondaryCondition = isMalignant ? 'Benign Nevus' : 'Basal Cell Carcinoma';
  const secondaryDescription = conditionDescriptions[secondaryCondition] || '';
  
  // Recommendations based on category
  const recommendations = {
    'benign': [
      'Monitor for changes in size, shape, or color',
      'Apply sunscreen regularly',
      'Schedule a routine skin check within 6-12 months'
    ],
    'malignant': [
      'Consult with a dermatologist as soon as possible',
      'Avoid sun exposure to the area',
      'Do not scratch or irritate the area',
      'Take clear photos to document any changes'
    ]
  };
  
  // Risk factors - randomly include some for benign, include more for malignant
  const potentialRiskFactors = [
    'Irregular border',
    'Asymmetrical shape',
    'Multiple colors or color variations',
    'Size larger than 6mm',
    'Significant color saturation'
  ];
  
  // Include more risk factors for malignant conditions
  let riskFactors = potentialRiskFactors.filter(() => isMalignant || Math.random() > 0.7);
  
  // Always add this for malignant conditions
  if (isMalignant) {
    riskFactors.push('Needs professional evaluation');
  }
  
  // Create ABCD rule assessment
  const abcdRule = {
    asymmetry: isMalignant || Math.random() > 0.7,
    borderIrregularity: isMalignant || Math.random() > 0.8,
    colorVariation: isMalignant || Math.random() > 0.75,
    diameter: isMalignant || Math.random() > 0.85
  };
  
  const mockAnalysisResult: AnalysisResult = {
    success: true,
    prediction: selectedCondition,
    class: classType,
    confidence: confidence,
    recommendedAction: recommendations[classType][0],
    processingTime: Math.random() * 1.5 + 0.5, // Random processing time between 0.5-2 seconds
    details: {
      possibleConditions: [
        {
          name: selectedCondition,
          probability: confidence / 100,
          description: selectedDescription,
          category: classType
        },
        // Add a secondary condition with lower probability
        {
          name: secondaryCondition,
          probability: Math.random() * 0.3, // 0-30%
          description: secondaryDescription,
          category: isMalignant ? 'benign' : 'malignant'
        }
      ],
      riskFactors: riskFactors,
      recommendations: recommendations[classType],
      additionalInfo: {
        abcdRule: abcdRule
      }
    },
    metadata: metadata || {}
  };

  // Add a slight delay to simulate processing
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(NextResponse.json(mockAnalysisResult));
    }, 2000); // Longer delay for more realistic feel
  });
} 