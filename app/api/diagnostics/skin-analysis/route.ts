import { NextResponse } from 'next/server';
import { predict } from '@/lib/ml-models/skin_vision_model';
import fs from 'fs';
import path from 'path';
import { unlink } from 'fs/promises';

// Add dynamic route configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Parse the uploaded image from the form data
    const formData = await request.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image provided' },
        { status: 400 }
      );
    }

    // Save the uploaded file temporarily
    const tempDir = path.join(process.cwd(), 'uploads');
    try {
      await fs.promises.mkdir(tempDir, { recursive: true });
    } catch (error) {
      console.error('Error creating temp directory:', error);
    }

    const tempFilePath = path.join(tempDir, `${Date.now()}-${file.name}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(tempFilePath, buffer);

    try {
      // Call the AI model for prediction using VGG16
      const analysis = await predict(tempFilePath);

      // Clean up the temporary file
      await unlink(tempFilePath);

      return NextResponse.json({
        success: true,
        analysis
      });
    } catch (error) {
      // Clean up on error
      try {
        await unlink(tempFilePath);
      } catch (unlinkError) {
        console.error('Error deleting temp file:', unlinkError);
      }
      throw error;
    }
  } catch (error) {
    console.error('Error analyzing skin image:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to analyze image'
      },
      { status: 500 }
    );
  }
}