import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { mkdir, writeFile } from 'fs/promises';

// Add dynamic route configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface MedicalRecord {
  userId: string;
  fileName: string;
  filePath: string;
  description: string;
  recordType: string;
  fileSize: number;
  fileType: string;
  uploadDate: Date;
}

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
    const cookieStore = cookies();
    const token = cookieStore.get('next-auth.session-token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const uploadedFile = formData.get('file') as File | null;
    const description = formData.get('description') as string | null;
    const recordType = formData.get('recordType') as string | null;

    if (!uploadedFile || !(uploadedFile instanceof File)) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!description || !recordType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save file locally for demo
    const uploadsDir = await ensureUploadsDir();
    const fileName = `${Date.now()}-${uploadedFile.name}`;
    const filePath = path.join(uploadsDir, fileName);
    
    const buffer = Buffer.from(await uploadedFile.arrayBuffer());
    await writeFile(filePath, buffer);

    // Save record to database
    const client = await clientPromise;
    const db = client.db('nextmed');
    const records = db.collection<MedicalRecord>('medicalRecords');

    const newRecord: MedicalRecord = {
      userId: 'demo-user', // In real app, get from authenticated session
      fileName: uploadedFile.name,
      filePath,
      description,
      recordType,
      fileSize: uploadedFile.size,
      fileType: uploadedFile.type,
      uploadDate: new Date(),
    };

    await records.insertOne(newRecord);

    return NextResponse.json({
      success: true,
      record: {
        ...newRecord,
        filePath: `/uploads/${fileName}` // Public URL
      }
    });

  } catch (error) {
    console.error('Error uploading medical record:', error);
    return NextResponse.json(
      { error: 'Failed to upload medical record' },
      { status: 500 }
    );
  }
}