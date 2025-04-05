import { NextRequest, NextResponse } from 'next/server';
import Diagnosis from '@/models/Diagnosis';
import dbConnect from '@/lib/dbConnect';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Medical knowledge prompt to guide the AI
const MEDICAL_PROMPT = `
You are an AI medical assistant designed to analyze patient symptoms. 
Based on the symptoms provided, suggest possible conditions, their likelihood, 
a brief description of each condition, and recommended next steps.

Important disclaimers:
1. This is not a medical diagnosis but a preliminary analysis
2. Always consult with healthcare professionals for proper diagnosis and treatment
3. Seek immediate medical attention for severe or life-threatening symptoms

Provide your response in the following JSON format:
{
  "possibleConditions": [
    {
      "name": "Condition name",
      "probability": 0.0-1.0,
      "description": "Brief description of the condition"
    }
  ],
  "recommendedActions": ["Action 1", "Action 2"],
  "disclaimer": "Medical disclaimer text"
}
`;

export async function POST(req: NextRequest) {
  try {
    // Connect to the database
    await dbConnect();

    // Verify authentication from JWT token in cookies
    const authToken = req.cookies.get('authToken')?.value;
    
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await req.json();
    const { symptoms, additionalInfo, userId } = body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one symptom' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Prepare the prompt for Gemini
    const userPrompt = `
      Patient symptoms: ${symptoms.join(', ')}
      Additional information: ${additionalInfo || 'None provided'}
      
      Based on these symptoms, analyze and provide possible conditions, their likelihood, and recommended actions.
    `;

    // Set up a chat session with system prompt and user input
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: MEDICAL_PROMPT }] },
        { role: "model", parts: [{ text: "I understand. I'll analyze patient symptoms and provide analysis in the requested JSON format with possible conditions, their likelihood, descriptions, and recommended actions." }] }
      ],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      }
    });

    // Send the user's symptoms to analyze
    const result = await chat.sendMessage(userPrompt);
    const responseText = result.response.text();

    // Extract the JSON from the response (Gemini might return extra text around the JSON)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to get properly formatted response from Gemini');
    }

    // Parse the AI response
    const aiResponse = JSON.parse(jsonMatch[0]);

    // Create a new diagnosis record
    const diagnosis = await Diagnosis.create({
      userId,
      symptoms,
      additionalInfo: additionalInfo || '',
      aiPrediction: aiResponse
    });

    // Return the diagnosis results
    return NextResponse.json({
      success: true,
      diagnosisId: diagnosis._id,
      prediction: aiResponse
    });
  } catch (error) {
    console.error('AI Diagnosis error:', error);
    return NextResponse.json(
      { error: 'Failed to process diagnosis request' },
      { status: 500 }
    );
  }
} 