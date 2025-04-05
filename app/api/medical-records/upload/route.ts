import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';

// Helper to ensure uploads directory exists
async function ensureUploadsDir() {
  const dir = path.join(process.cwd(), 'public', 'uploads');
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    console.error('Error creating uploads directory:', error);
  }
  return dir;
}

// POST: Upload a medical record
export async function POST(request: Request) {
  try {
    // In a real app, you would authenticate with JWT
    // For now, we'll get the user from a cookie
    const cookieStore = cookies();
    const userCookie = cookieStore.get('user');
    
    if (!userCookie || !userCookie.value) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    // Parse user data from cookie
    let userData;
    try {
      userData = JSON.parse(userCookie.value);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid user data' },
        { status: 401 }
      );
    }
    
    const userId = userData._id;
    
    // Parse form data (including file)
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const recordType = formData.get('recordType') as string;
    const description = formData.get('description') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, PNG, DOC, or DOCX files are allowed.' },
        { status: 400 }
      );
    }
    
    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }
    
    // Create unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExtension}`;
    
    // Save file to disk
    const uploadDir = await ensureUploadsDir();
    const filePath = path.join(uploadDir, uniqueFilename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    
    // Save record to database
    const client = await clientPromise;
    const db = client.db('nextmed');
    const records = db.collection('medicalRecords');
    
    const newRecord = {
      userId: new ObjectId(userId),
      fileName: file.name,
      fileType: file.type,
      recordType,
      description,
      uploadDate: new Date(),
      fileUrl: `/uploads/${uniqueFilename}`,
      filePath: filePath,
    };
    
    const result = await records.insertOne(newRecord);
    
    return NextResponse.json({
      success: true,
      recordId: result.insertedId,
      message: 'Record uploaded successfully'
    });
  } catch (error: any) {
    console.error('Error uploading medical record:', error);
    return NextResponse.json(
      { error: 'Failed to upload record' },
      { status: 500 }
    );
  }
} 