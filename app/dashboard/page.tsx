"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiUpload, FiFile, FiAlertCircle, FiCheckCircle, FiTrash2, FiDownload, FiCalendar, FiActivity, FiHeart } from 'react-icons/fi';
import { useAuth } from '@/app/context/AuthContext';

// Define record types
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

  // Protected route - redirect if not authenticated
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
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    // Create form data for file upload
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

      // Reset form and update records list
      setSelectedFile(null);
      setFormData({
        recordType: RECORD_TYPES[0],
        description: '',
      });
      setUploadSuccess(true);
      
      // Refetch records to show the newly uploaded one
      fetchRecords();
      
      // Clear file input
      const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Failed to upload file. Please try again.');
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

      // Update records list
      setRecords(records.filter(record => record._id !== recordId));
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Failed to delete record. Please try again.');
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Health Dashboard</h1>
            <p className="text-gray-600 mb-6">
              Manage your health records, appointments, and medical information in one place
            </p>
            
            {/* Dashboard Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('records')}
                  className={`${
                    activeTab === 'records'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <FiFile className="mr-2" /> Medical Records
                </button>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className={`${
                    activeTab === 'appointments'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <FiCalendar className="mr-2" /> Appointments
                </button>
                <button
                  onClick={() => setActiveTab('health')}
                  className={`${
                    activeTab === 'health'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <FiActivity className="mr-2" /> Health Statistics
                </button>
              </nav>
            </div>
            
            {/* Records Tab Content */}
            {activeTab === 'records' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Your Medical Documents</h2>
                    
                    {/* Records List */}
                    {records.length === 0 ? (
                      <div className="bg-white shadow-sm rounded-lg p-6 text-center">
                        <FiFile className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records yet</h3>
                        <p className="text-gray-500 mb-4">
                          Upload your first medical document to keep it safely stored and accessible.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {records.map((record) => (
                          <div key={record._id} className="bg-white shadow-sm rounded-lg p-4 flex items-start border border-gray-100">
                            <div className="rounded-full bg-blue-50 p-3 mr-4">
                              <FiFile className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="text-base font-medium text-gray-900 mb-1 truncate">{record.fileName}</h3>
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {record.recordType}
                                  </span>
                                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{record.description}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <a
                                    href={record.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary-dark p-1 rounded-full bg-blue-50"
                                    title="View Document"
                                  >
                                    <FiDownload className="h-5 w-5" />
                                  </a>
                                  <button
                                    onClick={() => handleDeleteRecord(record._id)}
                                    className="text-red-600 hover:text-red-900 p-1 rounded-full bg-red-50"
                                    title="Delete Document"
                                  >
                                    <FiTrash2 className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                              <div className="mt-2 text-xs text-gray-500">
                                Uploaded on {new Date(record.uploadDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Upload Form */}
                  <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-100">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Upload New Document</h2>
                    
                    {uploadError && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FiAlertCircle className="h-5 w-5 text-red-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">{uploadError}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {uploadSuccess && (
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FiCheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-green-700">Document uploaded successfully!</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fileUpload">
                          Select File
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                              <label htmlFor="fileUpload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark">
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
                            <p className="text-xs text-gray-500">
                              PDF, PNG, JPG, DOCX up to 10MB
                            </p>
                            {selectedFile && (
                              <p className="text-sm text-primary mt-2">
                                <FiFile className="inline-block mr-1" /> {selectedFile.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="recordType">
                          Document Type
                        </label>
                        <select
                          id="recordType"
                          name="recordType"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                          value={formData.recordType}
                          onChange={handleInputChange}
                        >
                          {RECORD_TYPES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-sm"
                          placeholder="Add details about this document"
                          value={formData.description}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <span className="spinner inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2 align-[-0.125em]"></span>
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
            )}
            
            {/* Appointments Tab Content */}
            {activeTab === 'appointments' && (
              <div className="bg-white shadow-sm rounded-lg p-6 text-center border border-gray-100">
                <FiCalendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Appointments Coming Soon</h3>
                <p className="text-gray-500 mb-4">
                  We're working on this feature. Soon you'll be able to view and schedule appointments.
                </p>
                <button 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={() => router.push('/appointment')}
                >
                  Go to Appointment Booking
                </button>
              </div>
            )}
            
            {/* Health Stats Tab Content */}
            {activeTab === 'health' && (
              <div className="bg-white shadow-sm rounded-lg p-6 text-center border border-gray-100">
                <FiHeart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Health Statistics Coming Soon</h3>
                <p className="text-gray-500 mb-4">
                  Track your vital statistics, medication compliance, and health trends.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthDashboard; 