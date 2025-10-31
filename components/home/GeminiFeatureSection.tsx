"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BrainCircuit, BadgePlus, Sparkles, Clipboard, BarChart4 } from 'lucide-react';

const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.5,
      delay: 0.1 * custom
    }
  })
};

const pulseAnimation = {
  initial: { scale: 1, opacity: 0.7 },
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const analyzeAnimation = {
  initial: { width: "0%" },
  animate: { 
    width: "100%",
    transition: { 
      duration: 1.5,
      ease: "easeInOut"
    }
  }
};

const GeminiFeatureSection = () => {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Background elements */}
      <motion.div 
        className="absolute -top-20 -right-20 w-64 h-64 bg-blue-200/40 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Column: Text and CTA */}
          <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="flex items-center mb-4"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <motion.img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s" 
                  alt="Google Gemini Logo" 
                  className="h-8 w-8 mr-3"
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <motion.span 
                  className="text-sm font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                  whileHover={{ backgroundColor: "#dbeafe", y: -2 }}
                >
                  Based on LLM Model
                </motion.span>
              </motion.div>
              
              <motion.h2 
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                AI Symptom Analysis <motion.span 
                  className="text-primary relative inline-block"
                  animate={{
                    color: ["#3b82f6", "#4f46e5", "#3b82f6"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >with LLM Model</motion.span>
              </motion.h2>
              
              <motion.p 
                className="text-lg text-gray-600 mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Experience the next generation of medical symptom analysis using Google's advanced Gemini AI model. 
                Simply describe your symptoms, and receive instant insights about possible conditions.
              </motion.p>
              
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                <motion.div 
                  className="flex items-start p-3 rounded-lg hover:bg-blue-50/50 transition-colors"
                  custom={1}
                  variants={featureVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <BrainCircuit className="text-primary h-5 w-5 mt-1 mr-2" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-gray-900">Intelligent Analysis</h3>
                    <p className="text-sm text-gray-600">Powered by Google's latest AI models</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start p-3 rounded-lg hover:bg-blue-50/50 transition-colors"
                  custom={2}
                  variants={featureVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Sparkles className="text-primary h-5 w-5 mt-1 mr-2" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-gray-900">Comprehensive Results</h3>
                    <p className="text-sm text-gray-600">Detailed analysis with probability ratings</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start p-3 rounded-lg hover:bg-blue-50/50 transition-colors"
                  custom={3}
                  variants={featureVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Clipboard className="text-primary h-5 w-5 mt-1 mr-2" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-gray-900">Actionable Insights</h3>
                    <p className="text-sm text-gray-600">Get recommended next steps</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start p-3 rounded-lg hover:bg-blue-50/50 transition-colors"
                  custom={4}
                  variants={featureVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <BarChart4 className="text-primary h-5 w-5 mt-1 mr-2" />
                  </motion.div>
                  <div>
                    <h3 className="font-medium text-gray-900">Private & Secure</h3>
                    <p className="text-sm text-gray-600">Your health data stays protected</p>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link href="/ai-diagnosis">
                  <motion.span 
                    className="bg-primary text-white px-6 py-3 rounded-md font-medium inline-block relative overflow-hidden group"
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <motion.span 
                      className="absolute inset-0 w-0 bg-indigo-600 transition-all duration-300 ease-out group-hover:w-full"
                      style={{ zIndex: -1 }}
                    />
                    Try AI Symptom Analysis Now
                    <motion.span 
                      className="ml-2 inline-block"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ 
                        duration: 1, 
                        repeat: Infinity, 
                        repeatType: "reverse",
                        ease: "easeInOut"
                      }}
                    >
                      →
                    </motion.span>
                  </motion.span>
                </Link>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Right Column: Image/Illustration */}
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div 
              className="relative bg-white rounded-xl shadow-xl overflow-hidden p-6 border border-gray-100"
              whileHover={{ 
                y: -5, 
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" 
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className="absolute -right-12 -top-12 h-32 w-32 bg-blue-50 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute -left-12 -bottom-12 h-24 w-24 bg-blue-50 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              
              <div className="relative z-10">
                <motion.div 
                  className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  whileHover={{ y: -3 }}
                >
                  <h4 className="font-medium text-primary mb-2">Your Symptoms</h4>
                  <p className="text-gray-700 text-sm mb-3">Fever, fatigue, headache, and dry cough for 3 days</p>
                  
                  <div className="bg-blue-50 p-2 rounded text-xs text-blue-700 inline-flex items-center">
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="mr-2"
                    >
                      <svg className="animate-spin h-3 w-3 text-blue-700" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </motion.div>
                    Analyzing with Gemini AI...
                  </div>
                </motion.div>
                
                <motion.div 
                  className="bg-gray-50 p-4 rounded-lg border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  whileHover={{ y: -3 }}
                >
                  <h4 className="font-medium text-primary mb-2">Possible Conditions</h4>
                  
                  <div className="space-y-3">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-700">Common Cold</span>
                        <span className="text-sm text-gray-500">75% match</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          className="bg-green-500 h-2 rounded-full" 
                          initial={{ width: 0 }}
                          whileInView={{ width: "75%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.7 }}
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.8 }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-700">Seasonal Flu</span>
                        <span className="text-sm text-gray-500">65% match</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          initial={{ width: 0 }}
                          whileInView={{ width: "65%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.9 }}
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 1.0 }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-700">COVID-19</span>
                        <span className="text-sm text-gray-500">45% match</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div 
                          className="bg-orange-500 h-2 rounded-full" 
                          initial={{ width: 0 }}
                          whileInView={{ width: "45%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 1.1 }}
                        />
                      </div>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="mt-4 text-right"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 1.2 }}
                  >
                    <motion.span 
                      className="text-xs text-blue-700 hover:underline cursor-pointer group inline-flex items-center"
                      whileHover={{ x: 3 }}
                    >
                      View full analysis
                      <motion.span 
                        className="ml-1 inline-block"
                        animate={{ x: [0, 3, 0] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity, 
                          repeatType: "loop",
                          ease: "easeInOut"
                        }}
                      >
                        →
                      </motion.span>
                    </motion.span>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GeminiFeatureSection; 