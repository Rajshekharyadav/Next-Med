import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = cookies();
    
    // Clear all auth-related cookies
    cookieStore.set({
      name: 'user',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0, // Expire immediately
    });
    
    cookieStore.set({
      name: 'user-data',
      value: '',
      httpOnly: false,
      path: '/',
      maxAge: 0, // Expire immediately
    });
    
    cookieStore.set({
      name: 'auth-token',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0, // Expire immediately
    });
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
} 