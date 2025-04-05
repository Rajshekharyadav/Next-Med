// This script sets up a local MongoDB database for testing
// Run with: node scripts/setup-local-mongodb.js

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Local MongoDB connection string
const uri = 'mongodb://localhost:27017/nextmed';

async function setupMockDatabase() {
  console.log('Setting up local MongoDB for testing...');
  
  try {
    // Connect to MongoDB
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to local MongoDB');
    
    // Get database and collections
    const db = client.db('nextmed');
    const users = db.collection('users');
    
    // Clear existing users
    await users.deleteMany({});
    console.log('Cleared existing users');
    
    // Create a test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    await users.insertOne({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      phone: '123-456-7890',
      dateOfBirth: '1990-01-01',
      gender: 'male',
      address: {
        street: '123 Main St',
        city: 'Anytown',
        state: 'State',
        zipCode: '12345',
        country: 'Country'
      },
      medicalHistory: {
        conditions: [],
        allergies: [],
        medications: []
      },
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Created test user:');
    console.log('- Email: test@example.com');
    console.log('- Password: password123');
    
    // Close connection
    await client.close();
    console.log('Local MongoDB setup complete');
    
    console.log('\nTo start the application with local MongoDB:');
    console.log('1. Make sure MongoDB is running on your system');
    console.log('2. Run: npm run dev');
    console.log('3. Browse to: http://localhost:3000/test-db');
    
  } catch (error) {
    console.error('Error setting up local MongoDB:', error);
    console.log('\nTROUBLESHOOTING:');
    console.log('1. Make sure MongoDB is installed and running on your system');
    console.log('2. If not installed, download from: https://www.mongodb.com/try/download/community');
    console.log('3. Start MongoDB service');
  }
}

setupMockDatabase(); 