"use client";

import Link from 'next/link';
import { FiUsers, FiCalendar, FiVideo, FiFileText, FiClock, FiAward, FiCamera } from 'react-icons/fi';

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
    title: 'Skin Vision Analysis',
    description: 'Get AI-powered analysis of skin conditions by uploading photos for fast assessment.',
    icon: <FiCamera className="text-primary" size={32} />,
    link: '/skin-vision',
  },
  {
    id: 6,
    title: '24/7 Support',
    description: 'Round-the-clock customer service for any queries or emergencies.',
    icon: <FiClock className="text-primary" size={32} />,
  },
  {
    id: 7,
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
                {feature.link && (
                  <span className="ml-2 inline-block">
                    <Link href={feature.link} className="inline-flex items-center text-primary text-sm font-medium">
                      Try now
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </span>
                )}
              </h3>
              <p className="text-text-light">
                {feature.description}
              </p>
              {feature.link && (
                <Link href={feature.link} className="mt-auto pt-3 inline-flex items-center text-primary font-medium hover:underline">
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 