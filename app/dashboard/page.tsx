"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUpload, FiFile, FiAlertCircle, FiCheckCircle, FiTrash2, FiDownload, FiCalendar, FiActivity, FiHeart } from 'react-icons/fi';
import { useAuth } from '@/app/context/AuthContext';

const RECORD_TYPES = [
  'Medical Report',
  'Lab Test Result',
  'Prescription',
  'X-Ray/Scan',
  'Vaccination Record',
  'Insurance Document',
  'Other',
];

interface MedicalRecord {
  _id: string;
  userId: string;
  fileName: string;
  fileType: string;
  recordType: string;
  description: string;
  uploadDate: Date;
  fileUrl: string;
  fileSize: number;
}

const HealthDashboard = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('records');
  const [formData, setFormData] = useState({
    recordType: RECORD_TYPES[0],
    description: '',
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?from=/dashboard');
    } else if (isAuthenticated) {
      fetchRecords();
    }
  }, [isAuthenticated, loading, router]);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/medical-records');
      if (!response.ok) {
        throw new Error('Failed to fetch records');
      }
      const data = await response.json();
      setRecords(data.records || []);
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setUploadError('');
    setUploadSuccess(false);
    
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }
    
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setUploadError('Please upload a valid file type (PDF, JPG, PNG, DOC, DOCX)');
      return;
    }

    setIsUploading(true);

    const uploadData = new FormData();
    uploadData.append('file', selectedFile);
    uploadData.append('recordType', formData.recordType);
    uploadData.append('description', formData.description);

    try {
      const response = await fetch('/api/medical-records/upload', {
        method: 'POST',
        body: uploadData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result = await response.json();
      
      setSelectedFile(null);
      setFormData({
        recordType: RECORD_TYPES[0],
        description: '',
      });
      setUploadSuccess(true);
      
      const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
      await fetchRecords();
      
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload file. Please check your connection and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    try {
      const response = await fetch(`/api/medical-records/${recordId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete record');
      }

      setRecords(records.filter(record => record._id !== recordId));
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete record. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
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
        <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-blue-500/10 to-emerald-500/10 animate-pulse"></div>
          <div className="relative px-6 py-8 z-10">
            <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-600/40 shadow-lg">
              <h1 className="text-3xl font-bold text-white mb-2">
                Your Health Dashboard
              </h1>
              <p className="text-gray-300 text-lg">
                Manage your health records, appointments, and medical information in one place
              </p>
            </div>
            
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
                  <FiFile className="mr-2" /> Medical Records
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`${
                    activeTab === 'appointments'
                      ? 'bg-teal-600 text-white shadow-lg border-teal-500'
                      : 'bg-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-600 border-gray-600'
                  } px-6 py-3 rounded-lg font-medium text-sm flex items-center border backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}
                >
                  <FiCalendar className="mr-2" /> Appointments
                </button>
                <button
                  onClick={() => setActiveTab('health')}
                  className={`${
                    activeTab === 'health'
                      ? 'bg-teal-600 text-white shadow-lg border-teal-500'
                      : 'bg-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-600 border-gray-600'
                  } px-6 py-3 rounded-lg font-medium text-sm flex items-center border backdrop-blur-sm transition-all duration-300 hover:shadow-lg`}
                >
                  <FiActivity className="mr-2" /> Health Statistics
                </button>
              </nav>
            </div>
            
            {activeTab === 'records' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 shadow-lg">
                      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <FiFile className="w-4 h-4 text-white" />
                        </div>
                        Your Medical Documents
                      </h2>
                      
                      {records.length === 0 ? (
                        <div className="bg-gray-700/50 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-600/40">
                          <div className="bg-gradient-to-r from-teal-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FiFile className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-2">No medical records yet</h3>
                          <p className="text-gray-300 mb-4">
                            Upload your first medical document to keep it safely stored and accessible.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {records.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()).map((record) => (
                            <div key={record._id} className="bg-white/90 backdrop-blur-sm rounded-xl p-6 flex items-start border border-teal-200/40 hover:bg-white hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-r from-teal-100/20 to-blue-100/20 animate-pulse"></div>
                              <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-full p-3 mr-4 relative z-10">
                                <FiFile className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0 relative z-10">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-teal-800 mb-2 truncate">{record.fileName}</h3>
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-teal-100 to-blue-100 text-teal-800 border border-teal-200 mb-3">
                                      {record.recordType}
                                    </span>
                                    <p className="text-sm text-teal-700 mb-3">{record.description}</p>
                                    <div className="text-xs text-teal-600">
                                      <span>Uploaded on {new Date(record.uploadDate).toLocaleDateString()}</span>
                                      <span className="mx-2">•</span>
                                      <span>{(record.fileSize / 1024).toFixed(1)} KB</span>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2 ml-4">
                                    <a
                                      href={record.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-300 hover:text-white p-2 rounded-full bg-gray-600/50 hover:bg-gray-600 backdrop-blur-sm border border-gray-500 transition-all duration-300 hover:shadow-lg"
                                      title="View Document"
                                    >
                                      <FiDownload className="h-4 w-4" />
                                    </a>
                                    <button
                                      onClick={() => handleDeleteRecord(record._id)}
                                      className="text-red-400 hover:text-red-300 p-2 rounded-full bg-red-900/30 hover:bg-red-900/50 backdrop-blur-sm border border-red-700/50 transition-all duration-300 hover:shadow-lg"
                                      title="Delete Document"
                                    >
                                      <FiTrash2 className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-600/50 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/10 animate-pulse"></div>
                    <div className="relative z-10">
                      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <FiUpload className="w-4 h-4 text-white" />
                        </div>
                        Upload New Document
                      </h2>
                      
                      {uploadError && (
                        <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/50 rounded-lg p-4 mb-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <FiAlertCircle className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-red-300">{uploadError}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {uploadSuccess && (
                        <div className="bg-green-900/30 backdrop-blur-sm border border-green-700/50 rounded-lg p-4 mb-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <FiCheckCircle className="h-5 w-5 text-green-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-green-300">Document uploaded successfully!</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-white mb-2" htmlFor="fileUpload">
                            Select File
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600/50 border-dashed rounded-xl bg-gray-700/30 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300">
                            <div className="space-y-1 text-center">
                              <div className="bg-gradient-to-r from-teal-500 to-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                                <FiUpload className="h-6 w-6 text-white" />
                              </div>
                              <div className="flex text-sm text-gray-300">
                                <label htmlFor="fileUpload" className="relative cursor-pointer bg-gray-600 backdrop-blur-sm rounded-lg px-3 py-1 font-medium text-white hover:bg-gray-500 transition-all duration-300">
                                  <span>Upload a file</span>
                                  <input 
                                    id="fileUpload" 
                                    name="fileUpload" 
                                    type="file" 
                                    className="sr-only" 
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-400">
                                PDF, PNG, JPG, DOCX up to 10MB
                              </p>
                              {selectedFile && (
                                <div className="bg-gray-700 backdrop-blur-sm rounded-lg p-2 mt-3 border border-gray-600">
                                  <p className="text-sm text-white flex items-center justify-center">
                                    <FiFile className="inline-block mr-2" /> {selectedFile.name}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-white mb-2" htmlFor="recordType">
                            Document Type
                          </label>
                          <select
                            id="recordType"
                            name="recordType"
                            className="mt-1 block w-full py-3 px-4 border border-gray-600 bg-gray-700/80 backdrop-blur-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white text-sm"
                            value={formData.recordType}
                            onChange={handleInputChange}
                          >
                            {RECORD_TYPES.map((type) => (
                              <option key={type} value={type} className="bg-gray-800 text-white">
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-white mb-2" htmlFor="description">
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            className="mt-1 block w-full py-3 px-4 border border-gray-600 bg-gray-700/80 backdrop-blur-sm rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-white text-sm placeholder-gray-400"
                            placeholder="Add details about this document"
                            value={formData.description}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 px-6 rounded-lg hover:from-teal-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
                                Uploading...
                              </>
                            ) : (
                              'Upload Document'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'appointments' && (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-600/50 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-blue-500/10 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-r from-teal-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiCalendar className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Appointments Coming Soon</h3>
                  <p className="text-gray-300 mb-6 text-lg">
                    We're working on this feature. Soon you'll be able to view and schedule appointments.
                  </p>
                  <button 
                    className="inline-flex items-center px-6 py-3 border border-gray-600 text-sm font-medium rounded-lg shadow-lg text-white bg-gray-700/50 backdrop-blur-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all duration-300"
                    onClick={() => router.push('/appointment')}
                  >
                    Go to Appointment Booking
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'health' && (
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-8 text-center border border-gray-600/50 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 animate-pulse"></div>
                <div className="relative z-10">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FiHeart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Health Statistics Coming Soon</h3>
                  <p className="text-gray-300 mb-4 text-lg">
                    Track your vital statistics, medication compliance, and health trends.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthDashboard;