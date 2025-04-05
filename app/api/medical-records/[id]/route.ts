import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';
import fs from 'fs';
import { unlink } from 'fs/promises';

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
    
    // Find the record to ensure it belongs to the user
    const recordToDelete = await records.findOne({
      _id: new ObjectId(recordId),
      userId: new ObjectId(userId)
    });
    
    if (!recordToDelete) {
      return NextResponse.json(
        { error: 'Record not found or access denied' },
        { status: 404 }
      );
    }
    
    // Delete the file from disk if it exists
    if (recordToDelete.filePath) {
      try {
        await unlink(recordToDelete.filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
        // Continue with removing database entry even if file deletion fails
      }
    }
    
    // Delete the record from the database
    await records.deleteOne({ _id: new ObjectId(recordId) });
    
    return NextResponse.json({
      success: true,
      message: 'Record deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting medical record:', error);
    return NextResponse.json(
      { error: 'Failed to delete record' },
      { status: 500 }
    );
  }
} 