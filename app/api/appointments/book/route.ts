import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

// Import the doctors array to access doctor information
import { doctors } from '../../../data/doctors';

// Add dynamic route configuration
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { doctorId, slotId, name, email, phone, notes } = data;

    // In a real implementation, this would:
    // 1. Validate the input data
    // 2. Check availability of the slot
    // 3. Reserve the slot in the database
    // 4. Send confirmation emails/notifications
    // 5. Return booking confirmation

    // Validation (basic example)
    if (!doctorId || !slotId || !name || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the doctor in our mock data
    const doctor = doctors.find(doc => doc.id === parseInt(doctorId));
    
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Simulating processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate a booking reference
    const bookingReference = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Parse date and time from slotId (format: YYYY-MM-DD-HHMM-doctorId)
    const slotParts = slotId.split('-');
    const date = `${slotParts[0]}-${slotParts[1]}-${slotParts[2]}`;
    
    // Default to current date + 2 days if we can't parse the date
    const appointmentDate = date || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Default time or extract from slot
    let appointmentTime = "10:00 AM";
    if (slotParts.length > 3) {
      // Convert HHMM to HH:MM AM/PM
      const timeNum = parseInt(slotParts[3]);
      if (!isNaN(timeNum)) {
        const hours = Math.floor(timeNum / 100);
        const minutes = timeNum % 100;
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
        appointmentTime = `${displayHours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;
      }
    }
    
    // Store appointment in database
    const client = await clientPromise;
    const db = client.db('nextmed');
    
    const appointmentRecord = {
      reference: bookingReference,
      status: "confirmed",
      doctorId,
      slotId,
      patient: {
        name,
        email,
        phone
      },
      notes: notes || "",
      doctor: {
        name: doctor.name,
        specialty: doctor.specialty,
        imageUrl: doctor.imageUrl
      },
      appointmentDetails: {
        date: appointmentDate,
        time: appointmentTime,
        type: "video"
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await db.collection('appointments').insertOne(appointmentRecord);
    
    // Return response
    return NextResponse.json({
      success: true,
      booking: appointmentRecord,
      message: "Your appointment has been successfully booked. A confirmation email has been sent to your email address."
    });
  } catch (error) {
    console.error('Error in appointment booking:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to book appointment' },
      { status: 500 }
    );
  }
}