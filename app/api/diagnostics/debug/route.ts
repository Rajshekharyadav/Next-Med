import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../../../../lib/tokenUtils';
import mongoose from 'mongoose';
import { isValidObjectId } from 'mongoose';
import crypto from 'crypto';

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
    
    console.log('Debug endpoint - Authenticated user ID:', userId);

    // Parse request body
    const body = await req.json();
    const { symptoms, additionalInfo } = body;

    // Process user ID for consistency with analyze endpoint
    // No need to validate as strictly for debug endpoint
    let userIdForResponse = userId;
    // Create a deterministic ID if needed
    if (!isValidObjectId(userId)) {
      userIdForResponse = crypto.createHash('md5').update(userId).digest('hex').substring(0, 24);
    }

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json(
        { error: 'Please provide at least one symptom' },
        { status: 400 }
      );
    }

    // Create a mock AI response based on the symptoms provided
    let responseConditions = [];
    
    // Add relevant mock conditions based on the symptoms
    if (symptoms.some(s => s.toLowerCase().includes('cough') || 
                       s.toLowerCase().includes('sneez') || 
                       s.toLowerCase().includes('congest') || 
                       s.toLowerCase().includes('throat'))) {
      responseConditions.push({
        name: "Common Cold",
        probability: 0.85,
        description: "A viral infection of the upper respiratory tract. Common symptoms include runny nose, sneezing, cough, and sore throat."
      });
      
      responseConditions.push({
        name: "Seasonal Allergies",
        probability: 0.65,
        description: "An allergic response to pollen or other seasonal allergens, causing sneezing, congestion, and irritation."
      });
      
      responseConditions.push({
        name: "COVID-19",
        probability: 0.45,
        description: "A respiratory illness caused by the SARS-CoV-2 virus, with symptoms ranging from mild to severe including fever, cough, and fatigue."
      });
    }
    
    if (symptoms.some(s => s.toLowerCase().includes('head') || s.toLowerCase().includes('pain'))) {
      responseConditions.push({
        name: "Tension Headache",
        probability: 0.78,
        description: "A common type of headache characterized by mild to moderate pain, often described as feeling like a tight band around the head."
      });
      
      responseConditions.push({
        name: "Migraine",
        probability: 0.52,
        description: "A neurological condition characterized by severe, throbbing headache, often accompanied by nausea, vomiting, and sensitivity to light and sound."
      });
    }
    
    if (symptoms.some(s => s.toLowerCase().includes('stomach') || 
                       s.toLowerCase().includes('nausea') || 
                       s.toLowerCase().includes('vomit') ||
                       s.toLowerCase().includes('diarrhea'))) {
      responseConditions.push({
        name: "Gastroenteritis",
        probability: 0.82,
        description: "An intestinal infection causing stomach pain, diarrhea, nausea, and vomiting, often due to a virus or bacterial infection."
      });
      
      responseConditions.push({
        name: "Food Poisoning",
        probability: 0.68,
        description: "Illness caused by eating contaminated food, resulting in symptoms like nausea, vomiting, and diarrhea."
      });
    }
    
    // If no specific conditions were matched, provide generic ones
    if (responseConditions.length === 0) {
      responseConditions = [
        {
          name: "Common Cold",
          probability: 0.75,
          description: "A viral infection of the upper respiratory tract. Common symptoms include runny nose, sneezing, cough, and sore throat."
        },
        {
          name: "General Fatigue",
          probability: 0.60,
          description: "A state of tiredness that can be caused by overwork, stress, or an underlying medical condition."
        },
        {
          name: "Minor Viral Infection",
          probability: 0.55,
          description: "A general viral infection causing mild symptoms that typically resolve on their own with rest and hydration."
        }
      ];
    }
    
    const mockResponse = {
      possibleConditions: responseConditions,
      recommendedActions: [
        "Rest and stay hydrated",
        "Take over-the-counter medicines as needed for symptom relief",
        "Monitor your symptoms for any changes",
        "Consider a telemedicine appointment if symptoms worsen or persist",
        "Practice good hygiene to prevent spreading illness to others"
      ],
      disclaimer: "This is a test response for your selected symptoms: " + symptoms.join(", ") + ". This analysis is for informational purposes only and does not constitute medical advice or diagnosis. Always consult with qualified healthcare professionals."
    };

    // Return the mock diagnosis results
    return NextResponse.json({
      success: true,
      diagnosisId: "debug-" + userIdForResponse.substring(0, 8),
      userId: userIdForResponse,
      prediction: mockResponse
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Debug API error' },
      { status: 500 }
    );
  }
} 