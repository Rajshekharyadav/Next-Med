import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

// Add dynamic route configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// GET: Fetch user's medical records
export async function GET(request: Request) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('nextmed');
    const records = db.collection('medicalRecords');
    
    // For demo purposes, fetch all records for demo-user
    // In production, use proper authentication
    const userRecords = await records
      .find({ userId: 'demo-user' })
      .sort({ uploadDate: -1 })
      .toArray();
    
    return NextResponse.json({ records: userRecords });
  } catch (error: any) {
    console.error('Error fetching medical records:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medical records' },
      { status: 500 }
    );
  }
}