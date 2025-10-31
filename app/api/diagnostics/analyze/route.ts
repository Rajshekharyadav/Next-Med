import { NextRequest, NextResponse } from 'next/server';
import Diagnosis from '@/models/Diagnosis';
import dbConnect from '../../../../lib/dbConnect';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { verifyToken } from '../../../../lib/tokenUtils';
import mongoose from 'mongoose';
import { isValidObjectId } from 'mongoose';
import crypto from 'crypto';

// Define interfaces for the AI response
interface Condition {
  name: string;
  probability: number;
  description: string;
}

interface DiagnosisResponse {
  possibleConditions: Condition[];
  recommendedActions: string[];
  disclaimer: string;
}

interface DiagnosisRequestBody {
  symptoms: string[];
  additionalInfo?: string;
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-pro",
  generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 1024,
  },
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    }
  ]
});

// Medical knowledge prompt to guide the AI
const MEDICAL_PROMPT = `
You are an AI medical assistant designed to analyze patient symptoms. 
Based on the symptoms provided, suggest possible conditions, their likelihood, 
a brief description of each condition, and recommended next steps.

Important disclaimers:
1. This is not a medical diagnosis but a preliminary analysis
2. Always consult with healthcare professionals for proper diagnosis and treatment
3. Seek immediate medical attention for severe or life-threatening symptoms

VERY IMPORTANT: You must ONLY respond with valid JSON. Do not include any text before or after the JSON.
Do not include markdown formatting, backticks, or any explanatory text. Your entire response should be
parseable as a single JSON object matching exactly the following structure:

{
  "possibleConditions": [
    {
      "name": "Condition name",
      "probability": 0.5,  // a number between 0.0 and 1.0 representing likelihood
      "description": "Brief description of the condition"
    },
    // Additional conditions...
  ],
  "recommendedActions": [
    "Action 1", 
    "Action 2",
    // Additional recommendations...
  ],
  "disclaimer": "This is not a medical diagnosis. Please consult with a healthcare professional."
}

Make sure to only provide conditions that are medically plausible given the symptoms.
For probability values, use numbers between 0 and 1, not percentages or strings.
The entire response must be valid JSON that can be parsed with JSON.parse().
`;

export async function POST(req: NextRequest) {
  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const userId = await verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Convert userId to MongoDB ObjectId
    let userObjectId: mongoose.Types.ObjectId;
    try {
      userObjectId = new mongoose.Types.ObjectId(userId);
    } catch (error) {
      return NextResponse.json({
        error: 'Invalid user ID format',
        details: 'User ID could not be converted to valid database ID'
      }, { status: 400 });
    }

    // Database connection
    try {
      await dbConnect();
    } catch (error) {
      console.error('Database connection error:', error);
      return NextResponse.json({
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 });
    }

    // Request body validation
    let requestBody: DiagnosisRequestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      return NextResponse.json({ 
        error: 'Invalid request body',
        details: 'Request body must be valid JSON'
      }, { status: 400 });
    }

    if (!requestBody.symptoms?.length) {
      return NextResponse.json({
        error: 'Invalid request',
        details: 'Please provide at least one symptom'
      }, { status: 400 });
    }

    // Environment variables check
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        error: 'Server configuration error',
        details: 'API key is not configured'
      }, { status: 500 });
    }

    // Generate AI response
    try {
      const result = await model.generateContent([
        MEDICAL_PROMPT,
        `Patient symptoms: ${requestBody.symptoms.join(', ')}\nAdditional information: ${requestBody.additionalInfo || 'None provided'}\n\nBased on these symptoms, analyze and provide possible conditions, their likelihood, and recommended actions.`
      ]);

      const responseText = result.response.text();
      const aiResponse = parseAIResponse(responseText);

      // Save diagnosis to database
      const diagnosis = await Diagnosis.create({
        userId: userObjectId,
        symptoms: requestBody.symptoms,
        additionalInfo: requestBody.additionalInfo || '',
        aiPrediction: aiResponse
      });

      return NextResponse.json({
        success: true,
        diagnosisId: diagnosis._id,
        prediction: aiResponse
      });

    } catch (error) {
      console.error('AI analysis error:', error);
      return NextResponse.json({
        error: 'AI analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function parseAIResponse(responseText: string): DiagnosisResponse {
  try {
    // Try direct parsing first
    try {
      const parsed = JSON.parse(responseText) as DiagnosisResponse;
      validateDiagnosisResponse(parsed);
      return normalizeResponse(parsed);
    } catch (directParseError) {
      // If direct parsing fails, try to extract JSON from text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to extract JSON from AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]) as DiagnosisResponse;
      validateDiagnosisResponse(parsed);
      return normalizeResponse(parsed);
    }
  } catch (error) {
    throw new Error(`Failed to parse AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function validateDiagnosisResponse(response: any): asserts response is DiagnosisResponse {
  if (!response.possibleConditions || !Array.isArray(response.possibleConditions)) {
    throw new Error('Invalid response: missing or invalid possibleConditions');
  }
  if (!response.recommendedActions || !Array.isArray(response.recommendedActions)) {
    throw new Error('Invalid response: missing or invalid recommendedActions');
  }
  if (typeof response.disclaimer !== 'string') {
    throw new Error('Invalid response: missing or invalid disclaimer');
  }
}

function normalizeResponse(response: DiagnosisResponse): DiagnosisResponse {
  return {
    ...response,
    possibleConditions: response.possibleConditions.map(condition => ({
      ...condition,
      probability: typeof condition.probability === 'string' 
        ? parseFloat(condition.probability) 
        : condition.probability
    }))
  };
}