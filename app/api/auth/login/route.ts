import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { cookies } from 'next/headers';

// Add dynamic route configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    console.log('Received login request for:', body.email);
    
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    try {
      // Connect to MongoDB
      console.log('Connecting to MongoDB...');
      const client = await clientPromise;
      console.log('Connected to MongoDB successfully');
      
      const db = client.db('nextmed');
      const users = db.collection('users');

      // Find user by email
      console.log('Looking up user:', email);
      const user = await users.findOne({ email });
      if (!user) {
        console.log('User not found');
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Verify password
      console.log('Verifying password...');
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log('Invalid password');
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      console.log('Login successful for user:', email);
      
      // Generate a mock token (in a real app, use JWT)
      const token = `mock_jwt_token_${Math.random().toString(36).substring(2)}`;

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      // Set cookies for authentication
      const cookieStore = cookies();
      
      // Store user info in a cookie (in production, you'd likely only store the user ID)
      cookieStore.set({
        name: 'user',
        value: JSON.stringify(userWithoutPassword),
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      
      // Also set a non-httpOnly cookie for client-side access
      cookieStore.set({
        name: 'user-data',
        value: JSON.stringify({
          _id: userWithoutPassword._id,
          name: userWithoutPassword.name,
          email: userWithoutPassword.email,
        }),
        httpOnly: false, // Make it accessible to JavaScript
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      
      // Store token in a cookie
      cookieStore.set({
        name: 'auth-token',
        value: token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: userWithoutPassword,
        token: token
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Login error:', error);
    
    // More specific error handling
    if (error.name === 'SyntaxError') {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}