import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

// GET: Fetch user's medical records
export async function GET(request: Request) {
  try {
    // In a real app, you would authenticate the user with JWT
    // For now, we'll get the user from a cookie or localStorage
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
    
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('nextmed');
    const records = db.collection('medicalRecords');
    
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