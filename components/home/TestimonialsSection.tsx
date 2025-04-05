"use client";

import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Patient',
    testimonial:
      'NextMed has truly transformed my healthcare experience. The doctors are attentive, appointments are easy to schedule, and the video consultations save me so much time. I\'ve recommended it to all my family members!',
    avatar: '/avatars/avatar-1.jpg', // We would use real images here
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'Patient',
    testimonial:
      'As someone with a chronic condition, having access to my medical records and being able to consult with specialists easily has been life-changing. The doctors at NextMed really listen and take the time to address all my concerns.',
    avatar: '/avatars/avatar-2.jpg',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Patient',
    testimonial:
      'I was skeptical about online consultations at first, but NextMed exceeded my expectations. The platform is user-friendly, and the doctors are just as thorough and caring as they would be in person. Highly recommend!',
    avatar: '/avatars/avatar-3.jpg',
    rating: 4,
  },
];

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section className="py-16 bg-blue-50">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="section-heading">What Our Patients Say</h2>
          <p className="text-lg text-text-light">
            Read testimonials from patients who have experienced the NextMed difference.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Avatar */}
              <div className="mx-auto md:mx-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-300 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                  {testimonials[currentTestimonial].name.charAt(0)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`${
                        i < testimonials[currentTestimonial].rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      } w-5 h-5`}
                    />
                  ))}
                </div>

                <blockquote className="text-lg italic text-text-dark mb-6">
                  "{testimonials[currentTestimonial].testimonial}"
                </blockquote>

                <div>
                  <p className="font-semibold text-text-dark">
                    {testimonials[currentTestimonial].name}
                  </p>
                  <p className="text-text-light">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center mt-8 gap-4">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-blue-50 transition"
              aria-label="Previous testimonial"
            >
              <FiChevronLeft size={24} className="text-primary" />
            </button>
            
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    currentTestimonial === index
                      ? 'bg-primary scale-125'
                      : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-white shadow-md hover:bg-blue-50 transition"
              aria-label="Next testimonial"
            >
              <FiChevronRight size={24} className="text-primary" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 