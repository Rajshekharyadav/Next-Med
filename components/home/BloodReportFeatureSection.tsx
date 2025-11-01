"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaFlask, FaHeartbeat, FaChartLine, FaUserMd } from 'react-icons/fa';

const BloodReportFeatureSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-blue-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-white mb-4"
            style={{textShadow: '0 0 15px rgba(78, 78, 231, 0.5)'}}
          >
            AI Blood Report Analysis
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-blue-100"
          >
            Get detailed insights from your blood test reports with our advanced AI analysis.
            Upload your reports and receive comprehensive interpretations, personalized recommendations,
            and health trends tracking.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left side - Feature description */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-semibold text-white mb-6">
              Understand Your Health Like Never Before
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-start">
                <div className="bg-primary text-white p-3 rounded-full mr-4">
                  <FaFlask size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Comprehensive Analysis</h4>
                  <p className="text-blue-200">Get detailed explanations of abnormal values and what they mean for your health</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary text-white p-3 rounded-full mr-4">
                  <FaHeartbeat size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Health Insights</h4>
                  <p className="text-gray-600">Receive personalized interpretations of your blood results from our AI</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary text-white p-3 rounded-full mr-4">
                  <FaChartLine size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Track Health Trends</h4>
                  <p className="text-gray-600">Monitor changes in your biomarkers over time to understand health patterns</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-primary text-white p-3 rounded-full mr-4">
                  <FaUserMd size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">Nutrition & Lifestyle Advice</h4>
                  <p className="text-gray-600">Get personalized recommendations based on your blood test results</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link 
                href="/blood-report-analysis"
                className="dark-glass-button hover:bg-blue-700/30 text-white font-medium py-3 px-8 rounded-md inline-flex items-center transition-colors duration-300"
              >
                Try Blood Report Analysis
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* Right side - Blood Report Analysis Demo/Screenshot */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="dark-glass-card p-6 rounded-xl"
          >
            <div className="dark-glass p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center border-b border-blue-400/20 pb-3 mb-3">
                <h4 className="font-semibold text-white">Blood Report Analysis</h4>
                <span className="bg-blue-900/50 text-blue-200 text-xs font-medium px-2.5 py-0.5 rounded backdrop-blur-sm">AI Powered</span>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-red-900/20 border border-red-400/30 rounded-md">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">Hemoglobin</span>
                    <span className="text-red-300 font-medium">11.2 g/dL</span>
                  </div>
                  <p className="text-sm text-red-200 mt-1">Below reference range (13.5-17.5 g/dL)</p>
                  <p className="text-sm text-white mt-2">
                    <span className="font-medium">Analysis:</span> Indicates mild anemia, which may cause fatigue and weakness
                  </p>
                </div>
                
                <div className="p-3 bg-yellow-900/20 border border-yellow-400/30 rounded-md">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">Total Cholesterol</span>
                    <span className="text-yellow-300 font-medium">215 mg/dL</span>
                  </div>
                  <p className="text-sm text-yellow-200 mt-1">Above reference range (≤200 mg/dL)</p>
                  <p className="text-sm text-white mt-2">
                    <span className="font-medium">Analysis:</span> Borderline high, consider dietary changes
                  </p>
                </div>
                
                <div className="mt-4 p-3 border border-blue-400/20 rounded-md bg-blue-900/20">
                  <h5 className="font-medium text-white mb-2">Health Insights</h5>
                  <p className="text-sm text-blue-200">Your blood work suggests mild anemia and borderline high cholesterol. Consider dietary improvements rich in iron and lower in saturated fats.</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Link 
                  href="/blood-report-analysis"
                  className="text-blue-300 hover:text-blue-100 font-medium text-sm inline-flex items-center"
                >
                  View Full Analysis
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BloodReportFeatureSection;