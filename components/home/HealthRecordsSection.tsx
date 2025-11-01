"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaFileMedical, FaFilePrescription, FaSyringe, FaChartLine } from 'react-icons/fa';

// Mock data for health records
const mockHealthRecords = [
  {
    id: 1,
    type: 'Blood Test',
    title: 'Complete Blood Count (CBC)',
    doctor: 'Dr. Jennifer Wilson',
    date: '2023-05-15',
    icon: <FaFileMedical className="text-blue-500" />
  },
  {
    id: 2,
    type: 'Prescription',
    title: 'Antibiotics Prescription',
    doctor: 'Dr. Robert Smith',
    date: '2023-04-28',
    icon: <FaFilePrescription className="text-purple-500" />
  },
  {
    id: 3,
    type: 'Vaccination',
    title: 'COVID-19 Booster',
    doctor: 'Dr. Maria Garcia',
    date: '2023-03-12',
    icon: <FaSyringe className="text-green-500" />
  },
  {
    id: 4,
    type: 'Health Check',
    title: 'Annual Physical Examination',
    doctor: 'Dr. David Kim',
    date: '2023-02-05',
    icon: <FaChartLine className="text-orange-500" />
  }
];

const HealthRecordsSection = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...filesArray]);
      
      // Simulate upload process
      setIsUploading(true);
      setTimeout(() => {
        setIsUploading(false);
        alert(`${filesArray.length} file(s) uploaded successfully. In a real application, these would be securely stored in your health record.`);
      }, 2000);
    }
  };

  const handleViewRecord = (id: number) => {
    setSelectedRecord(id);
    // In a real app, this would fetch detailed record data
    setTimeout(() => {
      alert(`Viewing detailed record #${id}. In a real application, this would display the complete medical record.`);
      setSelectedRecord(null);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section id="health-records" className="py-16 bg-gradient-to-br from-gray-900 to-blue-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="dark-glass-card p-8">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-blue-400/20">
                <h3 className="text-xl font-bold text-white">Your Health Dashboard</h3>
                <span className="text-sm bg-blue-900/50 text-blue-200 py-1 px-3 rounded-full backdrop-blur-sm">Demo View</span>
              </div>
              
              <div className="space-y-4">
                {mockHealthRecords.map(record => (
                  <div 
                    key={record.id} 
                    className={`flex items-center justify-between p-3 rounded-lg border border-blue-400/20 hover:bg-blue-800/30 transition cursor-pointer ${
                      selectedRecord === record.id ? 'bg-blue-800/40 border-blue-300/30' : ''
                    }`}
                    onClick={() => handleViewRecord(record.id)}
                  >
                    <div className="flex items-center">
                      <div className="rounded-full bg-blue-900/50 p-2 mr-3">
                        {record.icon}
                      </div>
                      <div>
                        <p className="font-medium text-white">{record.title}</p>
                        <p className="text-sm text-blue-200">{record.doctor}</p>
                      </div>
                    </div>
                    <div className="text-sm text-blue-200">{formatDate(record.date)}</div>
                  </div>
                ))}

                {uploadedFiles.map((file, index) => (
                  <div key={`uploaded-${index}`} className="flex items-center justify-between p-3 rounded-lg border border-green-400/30 bg-green-900/20">
                    <div className="flex items-center">
                      <div className="rounded-full bg-green-900/40 p-2 mr-3">
                        <FaFileMedical className="text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-sm text-green-200">Uploaded just now</p>
                      </div>
                    </div>
                    <div className="text-sm text-green-300">New</div>
                  </div>
                ))}

                {isUploading && (
                  <div className="flex items-center justify-between p-3 rounded-lg border border-blue-400/30 bg-blue-900/30">
                    <div className="flex items-center">
                      <div className="rounded-full bg-blue-800/50 p-2 mr-3">
                        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-white">Uploading files...</p>
                        <p className="text-sm text-blue-200">Please wait</p>
                      </div>
                    </div>
                    <div className="text-sm text-blue-300">Processing</div>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <div className="mb-4">
                  <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-blue-400/30 rounded-lg cursor-pointer hover:bg-blue-800/20 transition-all duration-300">
                    <div className="flex flex-col items-center">
                      <FaCloudUploadAlt className="w-8 h-8 text-blue-300 mb-2" />
                      <span className="font-medium text-blue-100">Upload new health records</span>
                      <span className="text-xs text-blue-200">(PDF, JPG, or PNG)</span>
                      <input 
                        type="file" 
                        className="hidden" 
                        multiple 
                        accept=".pdf,.jpg,.jpeg,.png" 
                        onChange={handleFileUpload}
                      />
                    </div>
                  </label>
                </div>
                <button className="w-full dark-glass-button text-white py-2 rounded hover:bg-blue-700/30 transition duration-300">
                  View Full Health Records
                </button>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-white mb-6" style={{textShadow: '0 0 15px rgba(78, 78, 231, 0.5)'}}>Your Complete Health Records in One Place</h2>
            <p className="text-lg text-blue-100 mb-6">
              Securely store and access all your medical records, prescriptions, test results, and vaccination history in one centralized digital platform.
            </p>
            
            <ul className="space-y-4 mb-8">
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <svg className="w-6 h-6 text-blue-300 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-blue-100">Secure & encrypted cloud storage for all medical documents</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <svg className="w-6 h-6 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-gray-700">Easy sharing with healthcare providers</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <svg className="w-6 h-6 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-gray-700">Health trends & insights from your medical history</span>
              </motion.li>
              <motion.li 
                className="flex items-start"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <svg className="w-6 h-6 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-gray-700">Medication & appointment reminders</span>
              </motion.li>
            </ul>
            
            <div className="p-4 dark-glass-card rounded-lg text-blue-100">
              <h4 className="font-bold mb-2">Privacy & Security</h4>
              <p className="text-sm">
                Your health data is stored with bank-level encryption. Only you control who can access your records, and we maintain detailed access logs for your security.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HealthRecordsSection;