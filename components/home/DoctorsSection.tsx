import Link from 'next/link';
import { FiArrowRight, FiStar } from 'react-icons/fi';

const doctors = [
  {
    id: 1,
    name: 'Dr. Jennifer Wilson',
    specialty: 'Cardiologist',
    rating: 4.9,
    reviews: 124,
    image: '/doctors/doctor-1.jpg', // We would use real images here
    availability: 'Available Today',
  },
  {
    id: 2,
    name: 'Dr. Robert Smith',
    specialty: 'Neurologist',
    rating: 4.8,
    reviews: 98,
    image: '/doctors/doctor-2.jpg',
    availability: 'Available Tomorrow',
  },
  {
    id: 3,
    name: 'Dr. Maria Garcia',
    specialty: 'Pediatrician',
    rating: 4.9,
    reviews: 156,
    image: '/doctors/doctor-3.jpg',
    availability: 'Available Today',
  },
  {
    id: 4,
    name: 'Dr. David Kim',
    specialty: 'Orthopedic Surgeon',
    rating: 4.7,
    reviews: 87,
    image: '/doctors/doctor-4.jpg',
    availability: 'Available Today',
  },
];

const DoctorsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl mb-6 md:mb-0">
            <h2 className="section-heading">Meet Our Expert Doctors</h2>
            <p className="text-lg text-text-light">
              Our team of highly qualified medical professionals are here to provide you with the best healthcare services.
            </p>
          </div>
          <Link href="/doctors" className="flex items-center text-primary font-semibold group">
            View All Doctors
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor) => (
            <Link href={`/doctors/${doctor.id}`} key={doctor.id}>
              <div className="card hover:-translate-y-1 cursor-pointer h-full flex flex-col">
                {/* Doctor Image */}
                <div className="mb-4 rounded-lg overflow-hidden h-56 bg-gray-200">
                  {/* We'd use real images here with Next.js Image component */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                    <span className="text-white font-medium">Dr. {doctor.name.split(' ')[1]} Photo</span>
                  </div>
                </div>
                
                {/* Doctor Info */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-text-dark">{doctor.name}</h3>
                  <p className="text-sm text-text-light mb-2">{doctor.specialty}</p>
                  
                  <div className="flex items-center mb-3">
                    <FiStar className="text-yellow-400 fill-current mr-1" />
                    <span className="text-sm font-medium">{doctor.rating}</span>
                    <span className="text-sm text-text-light ml-1">
                      ({doctor.reviews} reviews)
                    </span>
                  </div>
                  
                  <div className="mt-auto">
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">
                      {doctor.availability}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection; 