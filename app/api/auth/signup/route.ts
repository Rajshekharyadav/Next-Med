import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { IUserInput } from '@/models/User';

// Add dynamic route configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    console.log('Received signup request:', { ...body, password: '[REDACTED]' });
    
    const { name, email, password, phone, dateOfBirth, gender, address } = body;

    // Validate required fields
    if (!name || !email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
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

      // Check if user already exists
      console.log('Checking if user exists:', email);
      const existingUser = await users.findOne({ email });
      if (existingUser) {
        console.log('User already exists');
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 400 }
        );
      }

      // Hash password
      console.log('Hashing password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user object
      const user = {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
        address: address || {
          street: null,
          city: null,
          state: null,
          zipCode: null,
          country: null
        },
        medicalHistory: {
          conditions: [],
          allergies: [],
          medications: []
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Insert user into database
      console.log('Inserting user into database...');
      const result = await users.insertOne(user);
      console.log('User created with ID:', result.insertedId);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json({
        success: true,
        message: 'User registered successfully',
        user: userWithoutPassword
      });
    } catch (dbError: any) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    
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