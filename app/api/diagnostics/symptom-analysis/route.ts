import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { symptoms } = data;

    // In a real implementation, this would:
    // 1. Process the symptom text with a medical AI model
    // 2. Generate preliminary diagnosis and recommendations
    // 3. Return structured analysis

    // Simulating processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simple keyword-based mock response (would be much more sophisticated in real app)
    let response = {
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
      response.analysis.urgency = symptomsLower.includes("high fever") ? "medium" : "low";
    }
    
    if (symptomsLower.includes("cough")) {
      response.analysis.possibleConditions.push(
        "Common cold",
        "Bronchitis",
        "Allergies"
      );
      response.analysis.recommendedActions.push(
        "Stay hydrated",
        "Use honey for soothing (if over 1 year old)",
        "Consider over-the-counter cough suppressants"
      );
    }
    
    if (symptomsLower.includes("chest pain") || symptomsLower.includes("difficulty breathing")) {
      response.analysis.possibleConditions.push(
        "Anxiety",
        "Respiratory infection",
        "Cardiac issues"
      );
      response.analysis.recommendedActions.push(
        "Seek immediate medical attention",
        "Call emergency services if severe"
      );
      response.analysis.urgency = "high";
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
      { success: false, error: 'Failed to analyze symptoms' },
      { status: 500 }
    );
  }
} 