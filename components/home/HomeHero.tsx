"use client";

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const heroImageAnimation = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15,
      duration: 0.8
    }
  }
};

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const HomeHero = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="relative z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <motion.div 
              className="absolute -left-32 -top-32 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            ></motion.div>
            <motion.span 
              className="inline-block py-1 px-3 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Revolutionizing Healthcare
            </motion.span>
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              variants={fadeIn}
            >
              Transform Your Health Journey with{" "}
              <motion.span 
                className="text-primary relative z-10 inline-block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                AI-Powered Healthcare
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-700 mb-8 max-w-lg leading-relaxed"
              variants={fadeIn}
            >
              Experience personalized care like never before with our cutting-edge AI diagnostics, real-time skin analysis, comprehensive blood report interpretations, and on-demand virtual doctor consultations — all accessible from your home.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-8"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeIn}>
                <Link href="/skin-vision" className="bg-primary hover:bg-primary/90 text-white px-6 py-3.5 rounded-md font-medium transition-all duration-300 flex items-center justify-center group shadow-lg shadow-primary/20 hover:shadow-primary/40">
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Try Skin Vision
                </Link>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Link href="/ai-diagnosis" className="group bg-white hover:bg-gray-50 text-primary border border-primary px-6 py-3.5 rounded-md font-medium transition-colors flex items-center justify-center relative overflow-hidden shadow-md">
                  <span className="absolute inset-0 w-0 bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-300 group-hover:w-full opacity-10"></span>
                  <Image 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s" 
                    alt="Gemini AI" 
                    width={20}
                    height={20}
                    className="mr-2 rounded-full group-hover:scale-110 transition-transform"
                    priority
                  />
                  AI Symptom Analysis
                </Link>
              </motion.div>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-6"
              variants={fadeIn}
            >
              <Link href="/blood-report-analysis" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center group">
                <svg className="h-5 w-5 mr-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                Analyze Blood Reports
              </Link>
              <Link href="/doctors" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center group">
                <svg className="h-5 w-5 mr-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Consult Specialists
              </Link>
            </motion.div>
            
            <motion.div 
              className="mt-8 flex items-center space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((index) => (
                  <motion.div 
                    key={index}
                    className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.2 + (index * 0.1) }}
                  >
                    <div className={`h-full w-full bg-gradient-to-br ${
                      index === 1 ? 'from-blue-400 to-blue-600' : 
                      index === 2 ? 'from-indigo-400 to-indigo-600' : 
                      index === 3 ? 'from-purple-400 to-purple-600' : 
                      'from-pink-400 to-pink-600'
                    }`}></div>
                  </motion.div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">10,000+</span> satisfied patients
              </div>
            </motion.div>
          </motion.div>
          <motion.div 
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={heroImageAnimation}
          >
            <motion.div 
              className="absolute -right-32 -top-32 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.2, 0.35, 0.2]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <motion.div 
              className="bg-gradient-to-br from-white/60 to-white/90 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden p-6 h-[480px] border border-white/20 relative z-10"
              variants={heroImageAnimation}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 25px 30px -12px rgba(0, 0, 0, 0.15)" 
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="absolute top-4 right-4 flex space-x-1.5">
                <motion.div 
                  className="h-3 w-3 rounded-full bg-red-500"
                  whileHover={{ scale: 1.2 }}
                ></motion.div>
                <motion.div 
                  className="h-3 w-3 rounded-full bg-yellow-500"
                  whileHover={{ scale: 1.2 }}
                ></motion.div>
                <motion.div 
                  className="h-3 w-3 rounded-full bg-green-500"
                  whileHover={{ scale: 1.2 }}
                ></motion.div>
              </div>
              
              <motion.div 
                className="w-full h-full rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden mt-4"
                variants={floatingAnimation}
                initial="initial"
                animate="animate"
              >
                <div className="absolute inset-0 w-full h-full opacity-70">
                  {/* SVG illustration */}
                  <motion.svg 
                    viewBox="0 0 200 200" 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-full h-full"
                    animate={{
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <path fill="#4F46E5" d="M43.2,-57.2C55.9,-45.1,66.2,-31.5,71.6,-15.7C77,0.2,77.5,18.3,70.1,32.3C62.7,46.3,47.2,56.3,31.2,62.5C15.2,68.8,-1.3,71.2,-18.1,68.1C-34.9,65,-52,56.3,-62.6,42.1C-73.2,27.9,-77.5,8.1,-75,-10.4C-72.5,-29,-63.2,-46.4,-49.5,-58.6C-35.8,-70.8,-17.9,-77.8,-0.9,-76.7C16.1,-75.6,30.5,-69.3,43.2,-57.2Z" transform="translate(100 100)" />
                  </motion.svg> 
                </div>
                
                <div className="absolute inset-0 flex flex-col">
                  <div className="flex-1 flex items-center justify-center">
                    <motion.div 
                      className="text-center"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <motion.div 
                        className="w-24 h-24 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center"
                        whileHover={{ rotate: 5 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-primary">
                          <path d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.25 48.25 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                        </svg>
                      </motion.div>
                      <h3 className="mt-6 text-xl font-bold text-gray-900">Health Dashboard</h3>
                      <p className="mt-2 text-gray-600 max-w-xs mx-auto">Monitor your vital signs and health metrics in real-time</p>
                    </motion.div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 p-4">
                    {['Heart Rate', 'Blood Pressure', 'Activity'].map((metric, index) => (
                      <motion.div
                        key={metric}
                        className="bg-white/70 backdrop-blur-sm rounded-lg p-3 text-center shadow-sm"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 + (index * 0.1) }}
                        whileHover={{ y: -3, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                      >
                        <p className="text-xs text-gray-500 font-medium">{metric}</p>
                        <p className="text-indigo-600 font-bold">
                          {index === 0 ? '72 bpm' : index === 1 ? '120/80' : '8,453 steps'}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <motion.div 
                  className="absolute bottom-4 right-4 bg-white rounded-full p-3 shadow-md z-10"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                    <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;