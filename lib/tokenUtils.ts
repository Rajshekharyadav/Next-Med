// This module provides utility functions for working with JWT tokens

import dbConnect from './dbConnect';
import { ObjectId } from 'mongodb';

/**
 * Verifies a user token and retrieves the associated user ID
 * 
 * @param token The JWT token to verify
 * @returns The user ID if valid, null otherwise
 */
export async function verifyToken(token: string): Promise<string | null> {
  try {
    // Simple token verification (in a real app, you would verify JWT signature)
    if (!token || token.trim() === '') {
      return null;
    }
    
    // Since we're using a simple token authentication system,
    // we'll just check if the token exists in the system
    // In a real app, you would decode and verify the JWT signature
    
    // For now, we'll just validate the token is not empty and return it
    // Assuming the token is the user ID
    return token;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
} 