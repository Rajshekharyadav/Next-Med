"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const SimpleEnhanced3DHero = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background Video */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/background video.mp4" type="video/mp4" />
        <source src="/background video.webm" type="video/webm" />
      </video>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      
      {/* Animated overlay elements */}
      <div className="absolute inset-0 z-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <motion.div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
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
      </div>

      <div className="container mx-auto px-4 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          <motion.div 
            className="relative z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <motion.span 
              className="inline-block py-2 px-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-blue-300 rounded-full text-sm font-medium mb-6 border border-blue-500/30"
            >
              ✨ Next-Generation Healthcare
            </motion.span>
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight"
              variants={fadeIn}
            >
              Transform Your Health with{" "}
              <motion.span 
                className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                AI Power
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 mb-10 max-w-lg leading-relaxed"
              variants={fadeIn}
            >
              Experience revolutionary healthcare with AI-powered diagnostics, real-time analysis, and personalized care.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 mb-12"
              variants={fadeIn}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/skin-vision" className="group relative inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20 hover:border-white/40 hover:shadow-2xl hover:shadow-blue-500/25">
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                  <span>Try Skin Vision AI</span>
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/ai-diagnosis" className="group relative inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20 hover:border-white/40">
                  <span>🧠 AI Diagnosis</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative h-[600px] w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden">
              <motion.img 
                src="/images/hosipital.png" 
                alt="Hospital" 
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <motion.div 
                className="absolute bottom-6 left-6 right-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-2">Advanced Healthcare Facility</h3>
                <p className="text-sm text-gray-200">State-of-the-art medical technology</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SimpleEnhanced3DHero;