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
  probability: number | string;
  description: string;
}

interface DiagnosisResponse {
  possibleConditions: Condition[];
  recommendedActions: string[];
  disclaimer: string;
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
    // Connect to the database
    console.log('Connecting to MongoDB...');
    try {
      const db = await dbConnect();
      console.log('MongoDB connection established');
    } catch (dbConnectError) {
      console.error('Failed to connect to MongoDB:', dbConnectError);
      
      // Include debug information in the response
      return NextResponse.json(
        { 
          error: 'Database connection error', 
          details: `Could not connect to MongoDB. Error: ${dbConnectError instanceof Error ? dbConnectError.message : 'Unknown error'}`, 
          suggestion: 'Please enable debug mode in the UI to test without a database, or check your MongoDB setup. For local development, make sure MongoDB is installed and running on your machine.',
          help: 'You can download MongoDB Community Edition from https://www.mongodb.com/try/download/community',
          userIdProvided: userId,
          isValidObjectIdFormat: isValidObjectId(userId)
        },
        { status: 500 }
      );
    }

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
    
    console.log('Authenticated user ID:', userId);
    
    // Convert regular userId to ObjectId format if needed
    let userObjectId: string | mongoose.Types.ObjectId = userId;
    
    // Check if userId is already in ObjectId format
    if (isValidObjectId(userId)) {
      console.log('User ID is already in valid ObjectId format');
    } else {
      console.log('User ID is not in ObjectId format, creating a deterministic ObjectId');
      // Create a deterministic ObjectId from the userId string
      // This ensures the same userId always maps to the same ObjectId
      const hash = crypto.createHash('md5').update(userId).digest('hex').substring(0, 24);
      userObjectId = hash;
      console.log('Generated ObjectId:', userObjectId);
    }
    
    // Validate the final ObjectId
    if (!isValidObjectId(userObjectId)) {
      console.error('Invalid MongoDB ObjectId:', userObjectId);
      return NextResponse.json({ error: 'Invalid user ID format' }, { status: 400 });
    }
    
    // Parse request body
    const body = await req.json();
    const { symptoms, additionalInfo } = body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one symptom' },
        { status: 400 }
      );
    }

    // Check if essential environment variables are available
    if (!process.env.MONGODB_URI) {
      console.error('Missing MONGODB_URI environment variable');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('Missing GEMINI_API_KEY environment variable');
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      );
    }

    try {
      // Send the user's symptoms to analyze
      console.log('Sending request to Gemini API...');
      try {
        // For more reliable JSON parsing, instruct model to respond with structured content
        const result = await model.generateContent([
          MEDICAL_PROMPT,
          `Patient symptoms: ${symptoms.join(', ')}\nAdditional information: ${additionalInfo || 'None provided'}\n\nBased on these symptoms, analyze and provide possible conditions, their likelihood, and recommended actions.`
        ]);
        
        console.log('Received response from Gemini API');
        const responseText = result.response.text();
        
        // Extract the JSON from the response (Gemini might return extra text around the JSON)
        let aiResponse: DiagnosisResponse;
        try {
          // First try direct parsing
          try {
            aiResponse = JSON.parse(responseText) as DiagnosisResponse;
          } catch (directParseError) {
            // If direct parsing fails, try to extract JSON from text
            console.log('Direct JSON parsing failed, attempting to extract JSON');
            
            // Look for the JSON object pattern
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
              console.error('Failed to extract JSON from Gemini response');
              console.error('Raw response:', responseText);
              throw new Error('Failed to get properly formatted response from Gemini');
            }
            
            // Try to parse the extracted JSON
            aiResponse = JSON.parse(jsonMatch[0]) as DiagnosisResponse;
          }
          
          // Validate the response structure
          if (!aiResponse.possibleConditions || !Array.isArray(aiResponse.possibleConditions) || 
              !aiResponse.recommendedActions || !Array.isArray(aiResponse.recommendedActions)) {
            console.error('Invalid response structure from Gemini API');
            console.error('Response received:', JSON.stringify(aiResponse));
            throw new Error('Invalid response structure from Gemini API');
          }
          
          // Ensure proper type for probability
          aiResponse.possibleConditions = aiResponse.possibleConditions.map((condition: Condition) => ({
            ...condition,
            probability: typeof condition.probability === 'string' 
              ? parseFloat(condition.probability) 
              : condition.probability
          }));
          
        } catch (parseError) {
          console.error('JSON parsing error:', parseError);
          console.error('Raw response text:', responseText);
          throw new Error('Failed to parse Gemini response');
        }

        // Create a new diagnosis record
        try {
          // Convert userId to ObjectId
          const mongoObjectId = new mongoose.Types.ObjectId(userObjectId);
          
          const diagnosis = await Diagnosis.create({
            userId: mongoObjectId,
            symptoms,
            additionalInfo: additionalInfo || '',
            aiPrediction: aiResponse
          });

          console.log('Diagnosis created successfully with ID:', diagnosis._id);

          // Return the diagnosis results
          return NextResponse.json({
            success: true,
            diagnosisId: diagnosis._id,
            prediction: aiResponse
          });
        } catch (error: unknown) {
          console.error('Database error creating diagnosis:', error);
          
          // Define a type guard for validation errors
          const isValidationError = (err: unknown): err is { 
            name: string;
            message: string;
            errors?: Record<string, { message: string }>;
          } => {
            return (
              typeof err === 'object' && 
              err !== null && 
              'name' in err && 
              err.name === 'ValidationError'
            );
          };
          
          // Check for common MongoDB validation errors
          if (isValidationError(error)) {
            console.error('MongoDB validation error:', error.message);
            
            // Check which field is failing validation
            const validationErrors = error.errors 
              ? Object.keys(error.errors)
                  .map(field => `${field}: ${error.errors?.[field].message}`)
                  .join(', ')
              : 'Unknown validation error';
            
            console.error('Validation errors:', validationErrors);
            
            // Log the data that's being sent to help debug
            console.error('Data being sent:', {
              userId,
              symptomsCount: symptoms?.length,
              additionalInfoLength: additionalInfo?.length,
              aiPredictionStructure: aiResponse ? 
                `possibleConditions: ${aiResponse.possibleConditions?.length}, recommendedActions: ${aiResponse.recommendedActions?.length}` : 
                'null'
            });
            
            return NextResponse.json(
              { error: 'Validation error when saving diagnosis', details: validationErrors },
              { status: 400 }
            );
          }
          
          const errorMessage = error instanceof Error ? error.message : 'Unknown database error';
          throw new Error('Failed to save diagnosis to database: ' + errorMessage);
        }
      } catch (error) {
        console.error('Gemini API error:', error);
        
        // Provide a fallback message with instructions
        return NextResponse.json(
          { 
            error: 'Gemini API error: ' + (error instanceof Error ? error.message : 'Unknown error'),
            details: 'Please try using the debug endpoint instead by checking the Debug Mode checkbox.'
          },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error('AI Diagnosis error:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to process diagnosis request' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('AI Diagnosis error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process diagnosis request' },
      { status: 500 }
    );
  }
} 