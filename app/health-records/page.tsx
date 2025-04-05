'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

interface HealthRecord {
  _id: string;
  userId: string;
  recordType: string;
  date: string;
  description: string;
  doctor: string;
  documentUrl?: string;
  createdAt: string;
}

export default function HealthRecordsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?callbackUrl=/health-records');
      return;
    }

    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/health-records');
        
        if (!response.ok) {
          throw new Error('Failed to fetch health records');
        }
        
        const data = await response.json();
        setRecords(data.records || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        console.error('Error fetching health records:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">My Health Records</h1>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your health records...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <p>{error}</p>
        </div>
      ) : records.length === 0 ? (
        <div className="bg-blue-50 text-blue-700 p-8 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-2">No Health Records Found</h3>
          <p>You don't have any health records in our system yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {records.map((record) => (
            <div key={record._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 bg-primary text-white">
                <h3 className="font-bold text-lg">{record.recordType}</h3>
                <p className="text-sm opacity-90">{new Date(record.date).toLocaleDateString()}</p>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">{record.description}</p>
                <div className="text-sm text-gray-500">
                  <p><span className="font-medium">Doctor:</span> {record.doctor}</p>
                </div>
                {record.documentUrl && (
                  <a 
                    href={record.documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    View Document
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 