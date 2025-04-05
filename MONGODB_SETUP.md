# Setting up MongoDB for NextMed

This guide will help you set up MongoDB locally for the NextMed application.

## Network Timeout Issue

You're experiencing a timeout issue when connecting to MongoDB Atlas. This is likely due to:
- Network connectivity issues
- Firewall restrictions
- VPN or proxy settings
- MongoDB Atlas IP whitelist restrictions

To solve this, we'll use a local MongoDB instance instead.

## Installing MongoDB Locally (Windows)

1. **Download MongoDB Community Server**
   - Go to: https://www.mongodb.com/try/download/community
   - Select your platform (Windows)
   - Download the MSI installer

2. **Install MongoDB**
   - Run the MSI installer
   - Choose "Complete" installation
   - Install MongoDB as a service (recommended)
   - Complete the installation

3. **Verify MongoDB is Running**
   - Open Command Prompt and run: `mongod --version`
   - This should display the MongoDB version

4. **Check MongoDB Service**
   - Press `Win + R`, type `services.msc` and press Enter
   - Look for "MongoDB Server" in the list
   - Make sure its status is "Running"
   - If not, right-click it and select "Start"

## Setting up Test Data

1. **Run the setup script**
   ```
   npx powershell -ExecutionPolicy Bypass -Command "node scripts/check-mongodb.js"
   ```

2. **If MongoDB is running**, run:
   ```
   npx powershell -ExecutionPolicy Bypass -Command "node scripts/setup-local-mongodb.js"
   ```

3. **Start the application**
   ```
   npx powershell -ExecutionPolicy Bypass -Command "npm run dev"
   ```

4. **Test the connection**
   - Visit: http://localhost:3000/test-db
   - You should see a success message

## Test User Credentials

Once you've run the setup script, you can use these credentials:
- Email: test@example.com
- Password: password123

## Alternative Options

If you cannot install MongoDB locally:

1. **Use MongoDB Atlas with a different account**
   - Create a new MongoDB Atlas account
   - Create a new cluster with a simple password (no special characters)
   - Update the connection string in `.env.local`

2. **Use MongoDB Cloud Sandbox**
   - Create a free MongoDB Atlas account
   - Create a shared cluster (free tier)
   - Get your connection string and update `.env.local`
   - Add your IP address to the IP Access List 