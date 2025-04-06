// Mock data for doctors
export const doctors = [
  {
    id: 1,
    name: 'Dr. Jennifer Wilson',
    specialty: 'Cardiologist',
    rating: 4.9,
    reviews: 125,
    available: true,
    imageUrl: 'https://randomuser.me/api/portraits/women/52.jpg',
    bio: 'Dr. Jennifer Wilson is a board-certified cardiologist with over 15 years of experience in diagnosing and treating heart conditions. She specializes in preventive cardiology and heart disease management.',
    education: [
      'MD, Harvard Medical School',
      'Residency in Internal Medicine, Massachusetts General Hospital',
      'Fellowship in Cardiology, Cleveland Clinic'
    ],
    availableSlots: [
      { id: 'jw-1', time: '9:00 AM', date: '2023-07-15', type: 'video' },
      { id: 'jw-2', time: '11:30 AM', date: '2023-07-15', type: 'in-person' },
      { id: 'jw-3', time: '2:00 PM', date: '2023-07-16', type: 'video' },
      { id: 'jw-4', time: '4:30 PM', date: '2023-07-16', type: 'in-person' },
    ]
  },
  {
    id: 2,
    name: 'Dr. Robert Smith',
    specialty: 'Neurologist',
    rating: 4.8,
    reviews: 98,
    available: true,
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    bio: 'Dr. Robert Smith is a neurologist who specializes in the diagnosis and treatment of disorders affecting the brain, spinal cord, and peripheral nerves. He has particular expertise in headache management and stroke prevention.',
    education: [
      'MD, Johns Hopkins University School of Medicine',
      'Residency in Neurology, Mayo Clinic',
      'Fellowship in Neurophysiology, UCSF Medical Center'
    ],
    availableSlots: [
      { id: 'rs-1', time: '10:00 AM', date: '2023-07-15', type: 'video' },
      { id: 'rs-2', time: '1:30 PM', date: '2023-07-15', type: 'in-person' },
      { id: 'rs-3', time: '3:00 PM', date: '2023-07-16', type: 'video' },
      { id: 'rs-4', time: '5:30 PM', date: '2023-07-16', type: 'in-person' },
    ]
  },
  {
    id: 3,
    name: 'Dr. Maria Garcia',
    specialty: 'Dermatologist',
    rating: 4.9,
    reviews: 156,
    available: true,
    imageUrl: 'https://randomuser.me/api/portraits/women/23.jpg',
    bio: 'Dr. Maria Garcia is a board-certified dermatologist with expertise in medical, surgical, and cosmetic dermatology. She specializes in skin cancer detection and treatment, acne management, and anti-aging procedures.',
    education: [
      'MD, Stanford University School of Medicine',
      'Residency in Dermatology, New York University',
      'Fellowship in Dermatologic Surgery, Memorial Sloan Kettering'
    ],
    availableSlots: [
      { id: 'mg-1', time: '8:30 AM', date: '2023-07-15', type: 'video' },
      { id: 'mg-2', time: '12:00 PM', date: '2023-07-15', type: 'in-person' },
      { id: 'mg-3', time: '9:00 AM', date: '2023-07-16', type: 'video' },
      { id: 'mg-4', time: '3:30 PM', date: '2023-07-16', type: 'in-person' },
    ]
  },
  {
    id: 4,
    name: 'Dr. David Kim',
    specialty: 'Orthopedic Surgeon',
    rating: 4.7,
    reviews: 87,
    available: false,
    imageUrl: 'https://randomuser.me/api/portraits/men/46.jpg',
    bio: 'Dr. David Kim is an orthopedic surgeon specializing in sports medicine and joint replacement surgery. He has worked with professional athletes and has expertise in minimally invasive surgical techniques.',
    education: [
      'MD, University of Pennsylvania School of Medicine',
      'Residency in Orthopedic Surgery, Hospital for Special Surgery',
      'Fellowship in Sports Medicine, Andrews Sports Medicine & Orthopaedic Center'
    ],
    availableSlots: [
      { id: 'dk-1', time: '11:00 AM', date: '2023-07-17', type: 'video' },
      { id: 'dk-2', time: '2:30 PM', date: '2023-07-17', type: 'in-person' },
      { id: 'dk-3', time: '10:00 AM', date: '2023-07-18', type: 'video' },
      { id: 'dk-4', time: '4:00 PM', date: '2023-07-18', type: 'in-person' },
    ]
  }
]; 