# Migrating from OpenAI to Google Gemini API

This document outlines the changes made to switch the NextMed application's AI diagnosis feature from OpenAI to Google's Gemini API.

## Changes Made

1. **API Integration**:
   - Replaced OpenAI SDK with Google Generative AI SDK
   - Updated API endpoint to use Gemini-specific parameters and methods
   - Added JSON extraction logic to handle Gemini responses

2. **Environment Variables**:
   - Added new `GEMINI_API_KEY` environment variable
   - Commented out the previous `OPENAI_API_KEY` variable

3. **User Interface**:
   - Added Gemini branding to the AI diagnosis page
   - Created an information page about setting up Gemini API
   - Added a "Learn more" link to access information about the API

4. **Documentation**:
   - Updated README to reflect the change to Gemini API
   - Added instructions for obtaining a Gemini API key

## How to Complete the Migration

1. **Install the Google Generative AI SDK**:
   ```bash
   npm install @google/generative-ai
   ```

2. **Update Environment Variables**:
   - Create a Gemini API key at [Google AI Studio](https://aistudio.google.com/)
   - Update your `.env.local` file:
     ```
     # Comment out or remove OpenAI key
     # OPENAI_API_KEY=your_openai_api_key_here
     
     # Add Gemini API key
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

3. **Test the Integration**:
   - Run the application with `npm run dev`
   - Navigate to the AI Diagnosis page
   - Submit a symptom analysis request to verify it works with Gemini

## Benefits of the Migration

1. **Access to Google's Latest AI Models**:
   - Gemini offers state-of-the-art medical symptom analysis
   - Regular model updates with the latest medical information

2. **Cost Management**:
   - Gemini offers a generous free tier for development
   - Potentially lower costs for production use

3. **API Features**:
   - Streamlined API for chat-based interactions
   - Strong performance on medical diagnostic tasks
   
## Troubleshooting

If you encounter issues with the Gemini integration:

1. Verify your API key is correct and active
2. Check that the JSON parsing logic is handling the response correctly
3. Review Google's documentation for any API changes
4. Ensure you're using the latest version of the SDK 