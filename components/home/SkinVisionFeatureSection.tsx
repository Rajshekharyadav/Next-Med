"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCamera, FiShield, FiClock, FiCheckCircle } from 'react-icons/fi';

const SkinVisionFeatureSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
              NEW FEATURE
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              AI-Powered Skin Condition Analysis
            </h2>
            <p className="text-lg text-gray-600">
              Upload photos of your skin concerns and get instant AI analysis, recommendations, and next steps—all from the comfort of your home.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex">
                <div className="mr-3 mt-1">
                  <FiShield className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Privacy First</h3>
                  <p className="text-gray-600 text-sm">Your data is always secure and private</p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-3 mt-1">
                  <FiClock className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Results in Seconds</h3>
                  <p className="text-gray-600 text-sm">No waiting for appointments</p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-3 mt-1">
                  <FiCamera className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Simple to Use</h3>
                  <p className="text-gray-600 text-sm">Just upload a photo and get analysis</p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-3 mt-1">
                  <FiCheckCircle className="text-primary text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Expert Follow-up</h3>
                  <p className="text-gray-600 text-sm">Connect with doctors if needed</p>
                </div>
              </div>
            </div>
            <div className="pt-4">
              <Link 
                href="/skin-vision" 
                className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
              >
                Try Skin Vision Advanced
              </Link>
              <Link
                href="#ai-diagnostics"
                className="inline-block ml-4 text-primary hover:text-primary-dark font-medium py-3 transition duration-300"
              >
                Learn More
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden shadow-2xl"
          >
            <div className="relative">
              {/* Main image */}
              <img 
                src="https://img.freepik.com/free-photo/dermatologist-examining-patient-s-skin_23-2149213503.jpg" 
                alt="Skin Analysis with AI" 
                className="w-full h-auto object-cover rounded-t-xl"
              />
              
              {/* Overlay with demo analysis */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900/90 to-blue-900/40 p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-semibold">Skin Analysis Results</div>
                  <div className="text-xs bg-green-500 px-2 py-1 rounded font-medium">97% Confidence</div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium">Detected:</span>
                  <span className="bg-white/20 px-2 py-1 rounded">Mild Eczema</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommendations</h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Use a mild, fragrance-free moisturizer regularly
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Avoid hot water and harsh soaps when bathing
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Consider consulting with a dermatologist for treatment options
                  </li>
                </ul>
              </div>
              <Link 
                href="/skin-vision" 
                className="text-blue-600 font-semibold flex items-center hover:text-blue-800"
              >
                Analyze your skin now
                <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SkinVisionFeatureSection; 