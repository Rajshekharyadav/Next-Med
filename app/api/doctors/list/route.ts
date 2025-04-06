import { NextResponse } from 'next/server';
import { doctors } from '../../../data/doctors';

export async function GET(request: Request) {
  // Add query parameters support for filtering doctors
  const { searchParams } = new URL(request.url);
  const specialty = searchParams.get('specialty');
  const availableOnly = searchParams.get('availableOnly') === 'true';
  
  let filteredDoctors = [...doctors];
  
  // Filter by specialty if provided
  if (specialty) {
    filteredDoctors = filteredDoctors.filter(
      doctor => doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
  }
  
  // Filter by availability if requested
  if (availableOnly) {
    filteredDoctors = filteredDoctors.filter(doctor => doctor.available);
  }
  
  return NextResponse.json({ success: true, doctors: filteredDoctors });
}

export async function POST(request: Request) {
  try {
    const { doctorId } = await request.json();
    
    // Find the requested doctor
    const doctor = doctors.find(doc => doc.id === doctorId);
    
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      doctor: doctor
    });
  } catch (error) {
    console.error('Error fetching doctor details:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch doctor details' },
      { status: 500 }
    );
  }
} 