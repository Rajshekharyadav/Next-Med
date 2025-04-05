"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BrainCircuit, BadgePlus, Sparkles, Clipboard, BarChart4 } from 'lucide-react';

const GeminiFeatureSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Column: Text and CTA */}
          <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <img 
                  src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-advanced.max-1200x1200.jpg" 
                  alt="Google Gemini Logo" 
                  className="h-8 w-8 mr-3"
                />
                <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  Powered by Google's Gemini AI
                </span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                AI Symptom Analysis <span className="text-primary">with Gemini</span>
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                Experience the next generation of medical symptom analysis using Google's advanced Gemini AI model. 
                Simply describe your symptoms, and receive instant insights about possible conditions.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="flex items-start">
                  <BrainCircuit className="text-primary h-5 w-5 mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium text-gray-900">Intelligent Analysis</h3>
                    <p className="text-sm text-gray-600">Powered by Google's latest AI models</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Sparkles className="text-primary h-5 w-5 mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium text-gray-900">Comprehensive Results</h3>
                    <p className="text-sm text-gray-600">Detailed analysis with probability ratings</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clipboard className="text-primary h-5 w-5 mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium text-gray-900">Actionable Insights</h3>
                    <p className="text-sm text-gray-600">Get recommended next steps</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <BarChart4 className="text-primary h-5 w-5 mt-1 mr-2" />
                  <div>
                    <h3 className="font-medium text-gray-900">Private & Secure</h3>
                    <p className="text-sm text-gray-600">Your health data stays protected</p>
                  </div>
                </div>
              </div>
              
              <Link href="/ai-diagnosis" className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-blue-600 inline-block">
                Try AI Symptom Analysis Now
              </Link>
            </motion.div>
          </div>
          
          {/* Right Column: Image/Illustration */}
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative bg-white rounded-lg shadow-xl overflow-hidden p-6 border border-gray-100">
              <div className="absolute -right-12 -top-12 h-32 w-32 bg-blue-50 rounded-full"></div>
              <div className="absolute -left-12 -bottom-12 h-24 w-24 bg-blue-50 rounded-full"></div>
              
              <div className="relative z-10">
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="font-medium text-primary mb-2">Your Symptoms</h4>
                  <p className="text-gray-700 text-sm mb-3">Fever, fatigue, headache, and dry cough for 3 days</p>
                  
                  <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 inline-block">
                    Analyzing with Gemini AI...
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h4 className="font-medium text-primary mb-2">Possible Conditions</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-700">Common Cold</span>
                        <span className="text-sm text-gray-500">75% match</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-700">Seasonal Flu</span>
                        <span className="text-sm text-gray-500">65% match</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '65%'}}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-700">COVID-19</span>
                        <span className="text-sm text-gray-500">45% match</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{width: '45%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-right">
                    <span className="text-xs text-blue-700 hover:underline cursor-pointer">
                      View full analysis →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GeminiFeatureSection; 