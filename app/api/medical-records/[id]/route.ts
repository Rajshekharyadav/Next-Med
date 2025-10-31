import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import fs from 'fs';
import { unlink } from 'fs/promises';

// Add dynamic route configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// DELETE: Remove a medical record
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const recordId = params.id;
    
    if (!recordId || !ObjectId.isValid(recordId)) {
      return NextResponse.json(
        { error: 'Invalid record ID' },
        { status: 400 }
      );
    }
    
    // Authenticate user
    const cookieStore = cookies();
    const token = cookieStore.get('next-auth.session-token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('nextmed');
    const records = db.collection('medicalRecords');

    // Find the record first to get file path
    const record = await records.findOne({ _id: new ObjectId(recordId) });

    if (!record) {
      return NextResponse.json(
        { error: 'Record not found' },
        { status: 404 }
      );
    }

    // Delete file if exists
    if (record.filePath && fs.existsSync(record.filePath)) {
      await unlink(record.filePath);
    }

    // Delete record from database
    await records.deleteOne({ _id: new ObjectId(recordId) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    return NextResponse.json(
      { error: 'Failed to delete medical record' },
      { status: 500 }
    );
  }
}