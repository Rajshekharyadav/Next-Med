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
    // Get the session token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('next-auth.session-token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('nextmed');
    const records = db.collection('medicalRecords');
    
    // In a real app, verify the token and get the user ID
    // For now, we'll use a demo user ID
    const userId = '65c0f0f0f0f0f0f0f0f0f0f0';
    
    // Fetch records for this user
    const userRecords = await records
      .find({ userId: new ObjectId(userId) })
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