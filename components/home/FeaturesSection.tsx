import { FiUsers, FiCalendar, FiVideo, FiFileText, FiClock, FiAward } from 'react-icons/fi';

const features = [
  {
    id: 1,
    title: 'Expert Doctors',
    description: 'Connect with certified specialists across various medical fields with years of experience.',
    icon: <FiUsers className="text-primary" size={32} />,
  },
  {
    id: 2,
    title: 'Easy Appointments',
    description: 'Book, reschedule, or cancel appointments with just a few clicks anytime.',
    icon: <FiCalendar className="text-primary" size={32} />,
  },
  {
    id: 3,
    title: 'Video Consultations',
    description: 'Get medical advice and prescriptions without leaving your home via secure video calls.',
    icon: <FiVideo className="text-primary" size={32} />,
  },
  {
    id: 4,
    title: 'Digital Prescriptions',
    description: 'Receive and access your prescriptions digitally, with reminders for medication.',
    icon: <FiFileText className="text-primary" size={32} />,
  },
  {
    id: 5,
    title: '24/7 Support',
    description: 'Round-the-clock customer service for any queries or emergencies.',
    icon: <FiClock className="text-primary" size={32} />,
  },
  {
    id: 6,
    title: 'Quality Care',
    description: 'High-standard medical care with personalized attention for every patient.',
    icon: <FiAward className="text-primary" size={32} />,
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-heading">Why Choose NextMed</h2>
          <p className="text-lg text-text-light">
            We combine medical expertise with innovative technology to provide you with exceptional healthcare services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="card hover:-translate-y-1 flex flex-col items-start"
            >
              <div className="bg-blue-50 p-3 rounded-lg mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-text-dark">
                {feature.title}
              </h3>
              <p className="text-text-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 