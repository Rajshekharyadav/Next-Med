import { NextResponse } from 'next/server';
import testMongoDBConnection from '@/lib/testConnection';

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'MongoDB URI not configured' }, 
        { status: 500 }
      );
    }

    const uri = process.env.MONGODB_URI;
    console.log('Testing connection with URI:', uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));
    
    const connectionSuccessful = await testMongoDBConnection(uri);
    
    if (connectionSuccessful) {
      return NextResponse.json({ 
        success: true, 
        message: 'MongoDB connection successful' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'MongoDB connection failed. Check server logs for details.',
        suggestion: 'Please verify your MongoDB credentials and network connectivity.'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error testing MongoDB connection:', error);
    return NextResponse.json(
      { 
        error: 'Failed to test MongoDB connection',
        message: error.message,
        suggestion: 'Please check the connection string format and credentials'
      },
      { status: 500 }
    );
  }
} 