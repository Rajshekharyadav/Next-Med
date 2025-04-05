import { NextResponse } from 'next/server';

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

    // Simulating processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate a booking reference
    const bookingReference = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    
    // Mock response
    return NextResponse.json({
      success: true,
      booking: {
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
        // In a real app, these would come from the database based on doctorId and slotId
        doctor: {
          name: doctorId === 1 ? "Dr. Jennifer Wilson" : 
                doctorId === 2 ? "Dr. Robert Smith" : 
                doctorId === 3 ? "Dr. Maria Garcia" : "Dr. David Kim",
          specialty: doctorId === 1 ? "Cardiologist" : 
                    doctorId === 2 ? "Neurologist" : 
                    doctorId === 3 ? "Dermatologist" : "Orthopedic Surgeon"
        },
        appointmentDetails: {
          date: "2023-07-15",  // Would be from the real slot in a real app
          time: "10:00 AM",    // Would be from the real slot in a real app
          type: "video"        // Would be from the real slot in a real app
        }
      },
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