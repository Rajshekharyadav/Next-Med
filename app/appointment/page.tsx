"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiCalendar, FiClock, FiUser, FiMessageSquare, FiArrowLeft } from 'react-icons/fi';

interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  available: boolean;
  imageUrl: string;
}

const AppointmentPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM'
  ];

  // Generate date options for next 7 days
  const dateOptions = [];
  for (let i = 1; i <= 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    dateOptions.push({
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
    });
  }

  // Check if user is logged in
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
      const userData = JSON.parse(user);
      setFormData(prev => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || ''
      }));
    }
  }, []);

  // Fetch doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/doctors/list');
        const data = await response.json();
        
        if (data.success) {
          console.log('Loaded doctors:', data.doctors);
          setDoctors(data.doctors);
        } else {
          setError('Failed to load doctors');
          console.error('Failed to load doctors:', data.error);
        }
      } catch (error) {
        setError('Network error when fetching doctors');
        console.error('Network error when fetching doctors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError('Please select a doctor, date, and time');
      return;
    }
    
    if (!formData.name || !formData.email || !formData.phone) {
      setError('Please provide your name, email, and phone number');
      return;
    }
    
    setIsSubmitting(true);
    
    // Format the slotId
    const timeValue = selectedTime.replace(/[:\s]/g, ''); // Remove colons and spaces
    const slotId = `${selectedDate}-${timeValue}-${selectedDoctor}`;
    
    console.log('Booking appointment with:', {
      doctorId: selectedDoctor,
      slotId: slotId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone
    });
    
    try {
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          slotId: slotId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes
        }),
      });
      
      const data = await response.json();
      console.log('Appointment booking response:', data);
      
      if (data.success) {
        setSuccess('Your appointment has been successfully booked! Check your email for confirmation details.');
        // Reset form
        setSelectedDoctor(null);
        setSelectedDate('');
        setSelectedTime('');
        setFormData(prev => ({
          ...prev,
          notes: ''
        }));
      } else {
        setError(data.error || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Find doctor by ID
  const getDoctor = (id: number): Doctor | null => {
    return doctors.find(doc => doc.id === id) || null;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 py-8 relative overflow-hidden">
      {/* Animated Medical Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-8 h-8 text-teal-400/20 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <div className="absolute top-32 right-20 w-6 h-6 text-blue-400/30 animate-pulse" style={{animationDelay: '1s'}}>
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 8h2v8H4V8zm3 0h2v8H7V8zm3 0h2v8h-2V8z"/></svg>
        </div>
        <div className="absolute bottom-20 left-1/4 w-10 h-10 text-emerald-400/20 animate-spin" style={{animationDelay: '2s', animationDuration: '8s'}}>
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        </div>
        <div className="absolute top-1/2 right-10 w-7 h-7 text-cyan-400/25 animate-bounce" style={{animationDelay: '0.5s', animationDuration: '4s'}}>
          <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </div>
        <div className="absolute bottom-32 right-1/3 w-5 h-5 text-blue-500/25 animate-pulse" style={{animationDelay: '1.5s'}}>
          <svg fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
        </div>
        <div className="absolute top-20 left-1/3 w-4 h-4 text-emerald-500/30 animate-ping" style={{animationDelay: '2.5s'}}>
          <svg fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/></svg>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-600/40 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-emerald-500/10 animate-pulse"></div>
            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-4">
                <FiArrowLeft className="mr-2" />
                Back to Home
              </Link>
              <h1 className="text-3xl font-bold text-white">Book an Appointment</h1>
              <p className="text-gray-300 mt-2">
                Select a doctor, date, and time to schedule your consultation
              </p>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-xl p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="bg-green-900/30 backdrop-blur-sm border border-green-700/50 rounded-xl p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-300">{success}</p>
                </div>
              </div>
            </div>
          )}
          
          {!isLoggedIn && (
            <div className="bg-blue-900/30 backdrop-blur-sm border border-blue-700/50 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-300">
                    <Link href="/login" className="font-medium underline text-blue-400 hover:text-blue-300">Login</Link> or <Link href="/signup" className="font-medium underline text-blue-400 hover:text-blue-300">create an account</Link> to manage your appointments more easily.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-600/40 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 animate-pulse"></div>
            <div className="relative z-10">
            {/* Doctor Selection */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4V6C15 7.1 14.1 8 13 8H11C9.9 8 9 7.1 9 6V4L3 7V9H21ZM12 8C13.1 8 14 8.9 14 10V22H10V10C10 8.9 10.9 8 12 8Z"/></svg>
                </div>
                <h2 className="text-xl font-semibold text-white">Select Your Doctor</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading ? (
                  <div className="col-span-2 flex justify-center py-8">
                    <svg className="animate-spin h-8 w-8 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  doctors.map((doctor) => (
                    <div
                      key={doctor.id}
                      className={`border rounded-xl p-6 cursor-pointer transition-all duration-300 backdrop-blur-sm relative overflow-hidden group ${
                        selectedDoctor === doctor.id
                          ? 'border-teal-400 bg-gradient-to-br from-teal-600/30 to-blue-600/20 shadow-lg shadow-teal-500/20'
                          : 'border-gray-600/50 bg-gray-700/30 hover:border-teal-400/70 hover:bg-gray-600/40 hover:shadow-lg hover:shadow-teal-500/10'
                      }`}
                      onClick={() => setSelectedDoctor(doctor.id)}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 4V6C15 7.1 14.1 8 13 8H11C9.9 8 9 7.1 9 6V4L3 7V9H21ZM12 8C13.1 8 14 8.9 14 10V22H10V10C10 8.9 10.9 8 12 8Z"/></svg>
                          </div>
                          {selectedDoctor === doctor.id && (
                            <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                            </div>
                          )}
                        </div>
                        <h3 className="font-semibold text-white text-lg mb-1">{doctor.name}</h3>
                        <p className="text-sm text-teal-300 mb-3 font-medium">{doctor.specialty}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-yellow-400 text-sm">
                            {'★'.repeat(Math.floor(doctor.rating))}
                            {'☆'.repeat(5 - Math.floor(doctor.rating))}
                            <span className="text-gray-400 ml-2 text-xs">({doctor.reviews})</span>
                          </div>
                          <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">Available</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Date and Time Selection */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <FiCalendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Choose Date & Time</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/40 hover:border-gray-500/60 transition-all duration-300">
                  <label htmlFor="date" className="block text-white font-medium mb-3 flex items-center">
                    <FiCalendar className="w-4 h-4 mr-2 text-teal-400" />
                    Select Date
                  </label>
                  <div className="relative">
                    <select
                      id="date"
                      className="appearance-none block w-full px-4 py-3 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      disabled={!selectedDoctor}
                    >
                      <option value="">Choose your preferred date</option>
                      {dateOptions.map((date) => (
                        <option key={date.value} value={date.value}>
                          {date.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/40 hover:border-gray-500/60 transition-all duration-300">
                  <label htmlFor="time" className="block text-white font-medium mb-3 flex items-center">
                    <FiClock className="w-4 h-4 mr-2 text-blue-400" />
                    Select Time
                  </label>
                  <div className="relative">
                    <select
                      id="time"
                      className="appearance-none block w-full px-4 py-3 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-300"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      disabled={!selectedDate}
                    >
                      <option value="">Choose your preferred time</option>
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Your Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/40 hover:border-gray-500/60 transition-all duration-300">
                  <label htmlFor="name" className="block text-white text-sm font-medium mb-3 flex items-center">
                    <FiUser className="w-4 h-4 mr-2 text-purple-400" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 transition-all duration-300"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/40 hover:border-gray-500/60 transition-all duration-300">
                  <label htmlFor="phone" className="block text-white text-sm font-medium mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-400" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/></svg>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="appearance-none block w-full px-4 py-3 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 transition-all duration-300"
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6 bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/40 hover:border-gray-500/60 transition-all duration-300">
                <label htmlFor="email" className="block text-white text-sm font-medium mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/></svg>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-4 py-3 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 transition-all duration-300"
                  placeholder="your@email.com"
                  required
                />
              </div>
              
              <div className="bg-gray-700/30 backdrop-blur-sm rounded-xl p-4 border border-gray-600/40 hover:border-gray-500/60 transition-all duration-300">
                <label htmlFor="notes" className="block text-white text-sm font-medium mb-3 flex items-center">
                  <FiMessageSquare className="w-4 h-4 mr-2 text-yellow-400" />
                  Reason for Visit <span className="text-gray-400 text-xs ml-1">(Optional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={4}
                  className="appearance-none block w-full px-4 py-3 border border-gray-600/50 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 placeholder-gray-400 transition-all duration-300 resize-none"
                  placeholder="Please describe your symptoms or reason for the appointment..."
                />
              </div>
            </div>
            
            {/* Appointment Summary */}
            {selectedDoctor && selectedDate && selectedTime && (
              <div className="mb-8 p-6 bg-gradient-to-r from-teal-900/40 to-blue-900/40 backdrop-blur-sm border border-teal-500/30 rounded-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white">Appointment Summary</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Doctor</div>
                      <div className="text-white font-medium">{getDoctor(selectedDoctor)?.name || 'Selected Doctor'}</div>
                      <div className="text-teal-300 text-sm">{getDoctor(selectedDoctor)?.specialty || 'Specialist'}</div>
                    </div>
                    <div className="bg-gray-800/30 rounded-lg p-3">
                      <div className="text-gray-400 text-xs uppercase tracking-wide mb-1">Date & Time</div>
                      <div className="text-white font-medium">{dateOptions.find(d => d.value === selectedDate)?.label || selectedDate}</div>
                      <div className="text-blue-300 text-sm">{selectedTime}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-teal-700 hover:via-blue-700 hover:to-purple-700 transition-all duration-300 flex justify-center items-center shadow-xl hover:shadow-2xl hover:shadow-teal-500/20 transform hover:-translate-y-1 font-semibold text-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Your Appointment...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      Confirm Appointment
                    </>
                  )}
                </div>
              </button>
            </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;