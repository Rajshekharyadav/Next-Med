// This script checks if MongoDB is running locally
// Run with: node scripts/check-mongodb.js

const { MongoClient } = require('mongodb');
const { execSync } = require('child_process');
const os = require('os');

// Local MongoDB connection string
const uri = 'mongodb://localhost:27017';

async function checkMongoDBStatus() {
  console.log('Checking MongoDB installation status...');
  
  // Try to detect MongoDB installation
  let isInstalled = false;
  try {
    if (os.platform() === 'win32') {
      // Windows
      try {
        execSync('mongod --version', { stdio: 'ignore' });
        isInstalled = true;
      } catch (e) {
        // Check common installation paths
        try {
          execSync('"C:\\Program Files\\MongoDB\\Server\\5.0\\bin\\mongod" --version', { stdio: 'ignore' });
          isInstalled = true;
        } catch (e2) {
          isInstalled = false;
        }
      }
    } else {
      // Linux/Mac
      try {
        execSync('mongod --version', { stdio: 'ignore' });
        isInstalled = true;
      } catch (e) {
        isInstalled = false;
      }
    }

    if (isInstalled) {
      console.log('✅ MongoDB is installed on your system');
    } else {
      console.log('❌ MongoDB does not appear to be installed');
      console.log('\nPlease install MongoDB:');
      console.log('1. Download from: https://www.mongodb.com/try/download/community');
      console.log('2. Follow installation instructions for your operating system');
      return;
    }
  } catch (error) {
    console.log('❌ Could not determine if MongoDB is installed');
  }

  // Check if MongoDB is running
  console.log('Checking if MongoDB server is running...');
  
  try {
    const client = new MongoClient(uri, { 
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('✅ MongoDB server is running');
    await client.close();
  } catch (error) {
    console.log('❌ MongoDB server is not running or not accessible');
    console.log('\nTo start MongoDB:');
    
    if (os.platform() === 'win32') {
      console.log('1. Open Services (services.msc)');
      console.log('2. Find "MongoDB Server" and start it');
      console.log('   OR');
      console.log('1. Run Command Prompt as Administrator');
      console.log('2. Run: net start MongoDB');
    } else if (os.platform() === 'darwin') {
      console.log('Run: brew services start mongodb-community');
    } else {
      console.log('Run: sudo systemctl start mongod');
    }
    
    return;
  }

  console.log('\nYour MongoDB is properly set up and running!');
  console.log('You can now run: npm run dev');
}

checkMongoDBStatus(); 