'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

interface HealthRecord {
  _id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  recordType: string;
  description: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
}

interface AppointmentRecord {
  _id: string;
  reference: string;
  status: string;
  patient: {
    name: string;
    email: string;
    phone: string;
  };
  doctor: {
    name: string;
    specialty: string;
    imageUrl?: string;
  };
  appointmentDetails: {
    date: string;
    time: string;
    type: string;
  };
  notes: string;
  createdAt: string;
}

export default function HealthRecordsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [error, setError] = useState('');
  const [appointmentsError, setAppointmentsError] = useState('');
  const [activeTab, setActiveTab] = useState('records');

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/medical-records');
        
        if (!response.ok) {
          throw new Error('Failed to fetch health records');
        }
        
        const data = await response.json();
        console.log('Health records data:', data);
        setRecords(data.records || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching health records:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await fetch('/api/appointments');
        
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        
        const data = await response.json();
        console.log('Appointments data:', data);
        setAppointments(data.appointments || []);
      } catch (err: any) {
        setAppointmentsError(err.message || 'An error occurred');
        console.error('Error fetching appointments:', err);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    fetchRecords();
    fetchAppointments();
  }, []);

  if (!isAuthenticated) {
    return null;
  }

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
        <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-600/40 shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-emerald-500/10 animate-pulse"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold text-white">My Health Records</h1>
            <p className="text-gray-300 mt-2">Manage and view your medical documents and appointments</p>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="bg-gray-800/70 backdrop-blur-sm rounded-xl p-4 mb-6 border border-gray-600/40 shadow-sm">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('records')}
              className={`${
                activeTab === 'records'
                  ? 'bg-teal-600 text-white shadow-lg border-teal-500'
                  : 'bg-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-600 border-gray-600'
              } px-6 py-3 rounded-lg font-medium text-sm flex items-center border backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}
            >
              Medical Records
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`${
                activeTab === 'appointments'
                  ? 'bg-teal-600 text-white shadow-lg border-teal-500'
                  : 'bg-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-600 border-gray-600'
              } px-6 py-3 rounded-lg font-medium text-sm flex items-center border backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}
            >
              Appointment Records
            </button>
          </nav>
        </div>
      
        {activeTab === 'records' && (
          <>
            {loading ? (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-600/40 shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400 mx-auto"></div>
                <p className="mt-4 text-gray-300">Loading your health records...</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-xl p-6">
                <p className="text-red-300">{error}</p>
                {error.includes('login') && (
                  <button 
                    onClick={() => router.push('/login?callbackUrl=/health-records')}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
                  >
                    Login
                  </button>
                )}
              </div>
            ) : records.length === 0 ? (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-600/40 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-r from-teal-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" /></svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Health Records Found</h3>
                  <p className="text-gray-300">You don't have any health records in our system yet.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {records.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()).map((record) => (
                  <div key={record._id} className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-600/40 hover:bg-gray-700/80 hover:shadow-xl transition-all duration-300 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 animate-pulse"></div>
                    <div className="relative z-10">
                      <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-blue-600">
                        <h3 className="font-bold text-lg text-white">{record.recordType}</h3>
                        <p className="text-sm text-teal-100">{new Date(record.uploadDate).toLocaleDateString()}</p>
                      </div>
                      <div className="p-6">
                        <h4 className="font-medium text-white mb-2">{record.fileName}</h4>
                        <p className="text-gray-300 mb-4">{record.description}</p>
                        <div className="text-sm text-gray-400 mb-4">
                          <p><span className="font-medium text-gray-300">File Type:</span> {record.fileType}</p>
                          <p><span className="font-medium text-gray-300">Size:</span> {(record.fileSize / 1024).toFixed(1)} KB</p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <a 
                            href={record.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-teal-600 to-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-teal-700 hover:to-blue-700 transition-all duration-300 text-center"
                          >
                            View Document
                          </a>
                          <span className="inline-block bg-emerald-900/30 text-emerald-300 px-3 py-2 rounded-lg text-xs font-medium border border-emerald-700/30 text-center">
                            Uploaded: {new Date(record.uploadDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        
        {activeTab === 'appointments' && (
          <>
            {appointmentsLoading ? (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-600/40 shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-400 mx-auto"></div>
                <p className="mt-4 text-gray-300">Loading your appointments...</p>
              </div>
            ) : appointmentsError ? (
              <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-xl p-6">
                <p className="text-red-300">{appointmentsError}</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-600/40 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-r from-teal-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Appointments Found</h3>
                  <p className="text-gray-300">You don't have any appointment records yet.</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {appointments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((appointment) => (
                  <div key={appointment._id} className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-600/40 hover:bg-gray-700/80 hover:shadow-xl transition-all duration-300 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-blue-500/10 animate-pulse"></div>
                    <div className="relative z-10">
                      <div className="px-6 py-4 bg-gradient-to-r from-teal-600 to-blue-600">
                        <h3 className="font-bold text-lg text-white">{appointment.doctor.name}</h3>
                        <p className="text-sm text-teal-100">{appointment.doctor.specialty}</p>
                      </div>
                      <div className="p-6">
                        <div className="mb-4">
                          <p className="text-sm text-gray-400 mb-1">Appointment Date & Time</p>
                          <p className="font-medium text-white">{new Date(appointment.appointmentDetails.date).toLocaleDateString()} at {appointment.appointmentDetails.time}</p>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-400 mb-1">Patient</p>
                          <p className="text-white">{appointment.patient.name}</p>
                          <p className="text-gray-300 text-sm">{appointment.patient.email}</p>
                        </div>
                        {appointment.notes && (
                          <div className="mb-4">
                            <p className="text-sm text-gray-400 mb-1">Notes</p>
                            <p className="text-gray-300 text-sm">{appointment.notes}</p>
                          </div>
                        )}
                        <div className="flex flex-col space-y-2">
                          <span className={`inline-block px-3 py-2 rounded-lg text-xs font-medium text-center ${
                            appointment.status === 'confirmed' 
                              ? 'bg-emerald-900/30 text-emerald-300 border border-emerald-700/30'
                              : 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/30'
                          }`}>
                            Status: {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                          <span className="inline-block bg-blue-900/30 text-blue-300 px-3 py-2 rounded-lg text-xs font-medium border border-blue-700/30 text-center">
                            Ref: {appointment.reference}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}