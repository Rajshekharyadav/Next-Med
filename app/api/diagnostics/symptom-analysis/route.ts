import { NextResponse } from 'next/server';

// Add dynamic route configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface SymptomAnalysis {
  possibleConditions: string[];
  recommendedActions: string[];
  urgency: "low" | "medium" | "high";
  disclaimer: string;
}

interface AnalysisResponse {
  success: boolean;
  analysis: SymptomAnalysis;
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { symptoms } = data;

    if (!symptoms) {
      return NextResponse.json(
        { success: false, error: "No symptoms provided" },
        { status: 400 }
      );
    }

    // In a real implementation, this would:
    // 1. Process the symptom text with a medical AI model
    // 2. Generate preliminary diagnosis and recommendations
    // 3. Return structured analysis

    // Simulating processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Initialize response with proper typing
    let response: AnalysisResponse = {
      success: true,
      analysis: {
        possibleConditions: [],
        recommendedActions: [],
        urgency: "low",
        disclaimer: "This is not a medical diagnosis. Please consult with a healthcare professional for proper evaluation."
      }
    };

    // Very simple keyword matching for demo purposes
    const symptomsLower = symptoms.toLowerCase();
    
    if (symptomsLower.includes("headache")) {
      response.analysis.possibleConditions.push(
        "Tension headache", 
        "Migraine",
        "Dehydration"
      );
      response.analysis.recommendedActions.push(
        "Rest in a quiet, dark room",
        "Stay hydrated",
        "Take over-the-counter pain relievers as directed"
      );
    }
    
    if (symptomsLower.includes("fever") || symptomsLower.includes("temperature")) {
      response.analysis.possibleConditions.push(
        "Common cold",
        "Influenza",
        "Infection"
      );
      response.analysis.recommendedActions.push(
        "Rest and stay hydrated",
        "Take fever-reducing medication as directed",
        "Monitor temperature"
      );
      response.analysis.urgency = "medium";
    }

    // Update urgency based on symptoms
    if (symptomsLower.includes("severe") || 
        symptomsLower.includes("unbearable") || 
        symptomsLower.includes("emergency")) {
      response.analysis.urgency = "high";
      response.analysis.recommendedActions.unshift(
        "Consider seeking immediate medical attention"
      );
    }

    // Default response if no specific symptoms matched
    if (response.analysis.possibleConditions.length === 0) {
      response.analysis.possibleConditions.push(
        "Multiple possibilities based on provided symptoms"
      );
      response.analysis.recommendedActions.push(
        "Consult with a healthcare provider for proper evaluation",
        "Monitor symptoms and note any changes"
      );
    }

    // Add referral to doctor if urgency is medium or high
    if (response.analysis.urgency !== "low") {
      response.analysis.recommendedActions.push("Schedule a consultation with a doctor");
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in symptom analysis:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to analyze symptoms',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}