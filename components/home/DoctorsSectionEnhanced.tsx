"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaVideo, FaUser, FaSpinner, FaCalendarCheck } from 'react-icons/fa';

// Types
type DoctorSlot = {
  id: string;
  time: string;
  date: string;
  type: string;
};

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  available: boolean;
  availableSlots: DoctorSlot[];
  imageUrl?: string;
  bio?: string;
  education?: string[];
};

type BookingFormData = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  slotId: string;
  doctorId: number;
};

const DoctorsSectionEnhanced = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    phone: '',
    notes: '',
    slotId: '',
    doctorId: 0
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/doctors/list');
        const data = await response.json();
        
        if (data.success) {
          setDoctors(data.doctors);
        } else {
          setError('Failed to load doctors: ' + (data.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setError('Network error when fetching doctors. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);

  const handleSelectDoctor = (id: number) => {
    setSelectedDoctor(id === selectedDoctor ? null : id);
    setSelectedSlot(null);
  };

  const handleSelectSlot = (slotId: string, doctorId: number) => {
    setSelectedSlot(slotId);
    setFormData(prev => ({ ...prev, slotId, doctorId }));
    setShowBookingModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Call the booking API
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBookingSuccess(true);
        
        // Reset after showing success message
        setTimeout(() => {
          setShowBookingModal(false);
          setBookingSuccess(false);
          setSelectedSlot(null);
          setFormData({
            name: '',
            email: '',
            phone: '',
            notes: '',
            slotId: '',
            doctorId: 0
          });
        }, 3000);
      } else {
        alert('Booking failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('An error occurred during booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getSelectedDoctor = () => {
    return doctors.find(doctor => doctor.id === selectedDoctor);
  };

  const getSelectedSlotInfo = () => {
    const doctor = doctors.find(doc => doc.id === formData.doctorId);
    if (!doctor) return null;
    
    const slot = doctor.availableSlots.find(slot => slot.id === formData.slotId);
    return {
      doctor: doctor.name,
      specialty: doctor.specialty,
      date: slot ? formatDate(slot.date) : '',
      time: slot ? slot.time : '',
      type: slot ? slot.type : ''
    };
  };

  if (isLoading) {
    return (
      <section id="doctors" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <FaSpinner className="inline-block animate-spin text-primary text-3xl mb-4" />
          <p className="text-gray-600">Loading doctors...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="doctors" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg inline-block mb-4">
            <p>{error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="doctors" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Expert Doctor Consultations
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            Connect with top specialists through video calls or in-person appointments. Our network of certified doctors is available to provide personalized care.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <motion.div 
              key={doctor.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${
                selectedDoctor === doctor.id ? 'ring-2 ring-primary' : ''
              }`}
            >
              <div className="h-48 bg-gray-200 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center text-white text-xl font-medium">
                  {doctor.name}
                </div>
                {doctor.available ? (
                  <div className="absolute bottom-0 right-0 bg-green-500 text-white text-xs py-1 px-3 m-2 rounded-full">
                    Available Today
                  </div>
                ) : (
                  <div className="absolute bottom-0 right-0 bg-gray-500 text-white text-xs py-1 px-3 m-2 rounded-full">
                    Available Tomorrow
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold mb-1">{doctor.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{doctor.specialty}</p>
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {Array(5).fill(0).map((_, i) => (
                      <span key={i}>{i < Math.floor(doctor.rating) ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">{doctor.rating} ({doctor.reviews} reviews)</span>
                </div>
                
                {selectedDoctor === doctor.id ? (
                  <div className="space-y-2 mb-3">
                    <p className="text-sm font-medium text-gray-700">Available Slots:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {doctor.availableSlots.map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => handleSelectSlot(slot.id, doctor.id)}
                          className={`flex items-center justify-between text-sm py-2 px-3 rounded-md border ${
                            selectedSlot === slot.id
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <FaCalendarAlt className="mr-2" />
                            <span>{new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <div className="flex items-center">
                            <FaClock className="mr-1" />
                            <span>{slot.time}</span>
                          </div>
                          <div className="flex items-center text-xs">
                            {slot.type === 'video' ? <FaVideo className="mr-1" /> : <FaUser className="mr-1" />}
                            <span>{slot.type === 'video' ? 'Video' : 'In-person'}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedDoctor(null)}
                      className="w-full text-gray-500 text-sm py-1 hover:text-primary"
                    >
                      Hide slots
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={() => handleSelectDoctor(doctor.id)}
                    className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition duration-300"
                  >
                    View Available Slots
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <button className="bg-white border border-primary text-primary px-6 py-3 rounded font-medium hover:bg-blue-50 transition duration-300 inline-flex items-center">
            View All Doctors
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto"
            >
              <div className="p-6">
                {bookingSuccess ? (
                  <div className="text-center">
                    <div className="flex items-center justify-center w-20 h-20 mx-auto bg-green-100 rounded-full mb-6">
                      <FaCalendarCheck className="text-green-500 text-4xl" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Appointment Booked!</h3>
                    <p className="text-gray-600 mb-6">
                      Your appointment has been scheduled successfully. You will receive a confirmation email shortly.
                    </p>
                    <button
                      onClick={() => setShowBookingModal(false)}
                      className="bg-primary text-white px-6 py-2 rounded font-medium hover:bg-primary-dark transition duration-300"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Book Appointment</h3>
                      <button 
                        onClick={() => setShowBookingModal(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        &times;
                      </button>
                    </div>
                    
                    {getSelectedSlotInfo() && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="text-sm text-gray-700">
                          <p className="font-semibold text-gray-900">{getSelectedSlotInfo()?.doctor}</p>
                          <p className="text-gray-500 mb-2">{getSelectedSlotInfo()?.specialty}</p>
                          <div className="flex items-center mb-1">
                            <FaCalendarAlt className="text-gray-400 mr-2" />
                            <span>{getSelectedSlotInfo()?.date}</span>
                          </div>
                          <div className="flex items-center mb-1">
                            <FaClock className="text-gray-400 mr-2" />
                            <span>{getSelectedSlotInfo()?.time}</span>
                          </div>
                          <div className="flex items-center">
                            {getSelectedSlotInfo()?.type === 'video' ? (
                              <>
                                <FaVideo className="text-gray-400 mr-2" />
                                <span>Video Consultation</span>
                              </>
                            ) : (
                              <>
                                <FaUser className="text-gray-400 mr-2" />
                                <span>In-person Visit</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="John Doe"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="john.doe@example.com"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="(123) 456-7890"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Reason for Visit (Optional)
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                            placeholder="Briefly describe your symptoms or reason for consultation..."
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full flex justify-center items-center bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        >
                          {isSubmitting ? (
                            <>
                              <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                              Processing...
                            </>
                          ) : (
                            'Confirm Booking'
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsSectionEnhanced; 