import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const token = await getToken({ req });
    
    // Also check for Authorization header
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    
    if (token) {
      // If using Next Auth
      userId = token.sub;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      // If using custom token auth
      // In a real app, you would verify the JWT token here
      userId = 'user-123'; // Mock user ID for demo
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // In a real app, this would fetch the user's records from a database
    // For demo purposes, we'll return mock data
    const mockRecords = [
      {
        _id: 'rec-001',
        userId: userId,
        recordType: 'Blood Test',
        date: '2023-05-15',
        description: 'Complete Blood Count (CBC)',
        doctor: 'Dr. Jennifer Wilson',
        documentUrl: '/mockfiles/blood_test_cbc.pdf',
        createdAt: '2023-05-15T08:30:00Z'
      },
      {
        _id: 'rec-002',
        userId: userId,
        recordType: 'Prescription',
        date: '2023-04-28',
        description: 'Antibiotics Prescription',
        doctor: 'Dr. Robert Smith',
        documentUrl: '/mockfiles/prescription_antibiotics.pdf',
        createdAt: '2023-04-28T14:15:00Z'
      },
      {
        _id: 'rec-003',
        userId: userId,
        recordType: 'Vaccination',
        date: '2023-03-12',
        description: 'COVID-19 Booster',
        doctor: 'Dr. Maria Garcia',
        documentUrl: '/mockfiles/vaccination_covid_booster.pdf',
        createdAt: '2023-03-12T11:45:00Z'
      },
      {
        _id: 'rec-004',
        userId: userId,
        recordType: 'Health Check',
        date: '2023-02-05',
        description: 'Annual Physical Examination',
        doctor: 'Dr. David Kim',
        documentUrl: '/mockfiles/annual_physical.pdf',
        createdAt: '2023-02-05T09:00:00Z'
      }
    ];

    // Add a small delay to simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      records: mockRecords
    });

  } catch (error) {
    console.error('Error fetching health records:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch health records' 
      },
      { status: 500 }
    );
  }
} 