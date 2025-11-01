import Link from 'next/link';

export default function DoctorsPage() {
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      experience: '15 years',
      image: '/doctors/dr-johnson.jpg',
      rating: 4.9,
      available: true,
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Neurology',
      experience: '12 years',
      image: '/doctors/dr-chen.jpg',
      rating: 4.8,
      available: true,
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrics',
      experience: '10 years',
      image: '/doctors/dr-rodriguez.jpg',
      rating: 4.9,
      available: false,
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Orthopedics',
      experience: '18 years',
      image: '/doctors/dr-wilson.jpg',
      rating: 4.7,
      available: true,
    },
    {
      id: 5,
      name: 'Dr. Lisa Patel',
      specialty: 'Dermatology',
      experience: '8 years',
      image: '/doctors/dr-patel.jpg',
      rating: 4.8,
      available: true,
    },
    {
      id: 6,
      name: 'Dr. Robert Kim',
      specialty: 'Internal Medicine',
      experience: '14 years',
      image: '/doctors/dr-kim.jpg',
      rating: 4.9,
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Hero Section */}
      <div className="dark-glass py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Our Doctors</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Meet our team of experienced and dedicated healthcare professionals.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="dark-glass-card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="specialty" className="block text-sm font-medium text-white mb-1">
                Specialty
              </label>
              <select
                id="specialty"
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="">All Specialties</option>
                <option value="cardiology">Cardiology</option>
                <option value="neurology">Neurology</option>
                <option value="pediatrics">Pediatrics</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="dermatology">Dermatology</option>
                <option value="internal-medicine">Internal Medicine</option>
              </select>
            </div>
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-white mb-1">
                Availability
              </label>
              <select
                id="availability"
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="">All</option>
                <option value="available">Available Now</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-white mb-1">
                Minimum Rating
              </label>
              <select
                id="rating"
                className="w-full px-4 py-2 border border-gray-700 bg-gray-800/50 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              >
                <option value="">Any Rating</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="3.5">3.5+ Stars</option>
              </select>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="dark-glass-card overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-24 h-24 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{doctor.name}</h3>
                    <p className="text-blue-400 font-medium">{doctor.specialty}</p>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-1 text-gray-600">{doctor.rating}</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{doctor.experience} of experience</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {doctor.available ? 'Available' : 'Unavailable'}
                  </span>
                  <Link
                    href={`/appointment?doctor=${doctor.id}`}
                    className="dark-glass-button text-white px-4 py-2 rounded-md transition-colors"
                  >
                    Book Appointment
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}