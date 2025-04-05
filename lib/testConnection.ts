import { MongoClient } from 'mongodb';

async function testMongoDBConnection(uri: string) {
  console.log('Testing MongoDB connection...');
  
  try {
    // Create a new client
    const client = new MongoClient(uri, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000
    });
    
    // Connect to the MongoDB server
    console.log('Attempting to connect...');
    await client.connect();
    console.log('Connected successfully to MongoDB server');
    
    // Verify we can access a database
    const db = client.db();
    await db.command({ ping: 1 });
    console.log(`Successfully pinged database`);
    
    // Try to list collections if possible
    try {
      const collections = await db.listCollections().toArray();
      console.log(`Collections in database: ${collections.length}`);
    } catch (err) {
      console.log('Could not list collections (may require additional permissions)');
    }
    
    // Close the connection
    await client.close();
    console.log('Connection closed');
    
    return true;
  } catch (err) {
    console.error('Connection test failed:', err);
    return false;
  }
}

export default testMongoDBConnection; 