import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { headers } from 'next/headers';

// Add dynamic route configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const headersList = headers();
    const token = headersList.get('Authorization')?.split('Bearer ')[1];

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('nextmed');
    const records = db.collection('healthRecords');

    // Extract user ID from token or session
    // For demo, we'll get the first user's records
    const userRecords = await records
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: userRecords
    });
  } catch (error) {
    console.error('Error fetching health records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch health records' },
      { status: 500 }
    );
  }
}