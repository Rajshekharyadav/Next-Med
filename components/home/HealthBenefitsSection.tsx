"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

const benefits = [
  {
    title: "Real-Time Health Insights",
    description: "Get instant AI-powered analysis of symptoms, skin conditions, and medical reports with up to 99.8% accuracy.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "from-blue-500 to-indigo-600",
    stats: "30-second analysis"
  },
  {
    title: "Personalized Care Plans",
    description: "Receive tailored healthcare recommendations based on your unique medical history, genetics, and lifestyle factors.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    color: "from-emerald-500 to-teal-600",
    stats: "95% adherence rate"
  },
  {
    title: "Seamless Doctor Consultations",
    description: "Connect with board-certified specialists via HD video calls for expert medical advice, prescriptions, and referrals.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    color: "from-purple-500 to-indigo-600",
    stats: "< 15 minute wait time"
  },
  {
    title: "Comprehensive Health Records",
    description: "Store and access your entire medical history in one secure, HIPAA-compliant platform with military-grade encryption.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "from-orange-500 to-amber-600",
    stats: "256-bit encryption"
  },
  {
    title: "Smart Health Reminders",
    description: "Receive intelligent notifications for medication schedules, check-ups, and personalized preventive health measures.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "from-pink-500 to-rose-600",
    stats: "27% better adherence"
  },
  {
    title: "Advanced Health Analytics",
    description: "Gain insights from predictive AI models that analyze your health data to identify potential issues before symptoms appear.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    color: "from-cyan-500 to-blue-600",
    stats: "Early detection +64%"
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const pulseAnimation = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1],
    transition: { 
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" 
    }
  }
};

const floatAnimation = {
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

const HealthBenefitsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(2);

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % benefits.length);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + benefits.length) % benefits.length);
  };

  const getVisibleCards = () => {
    const prev = (currentIndex - 1 + benefits.length) % benefits.length;
    const next = (currentIndex + 1) % benefits.length;
    return [prev, currentIndex, next];
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-500/5 rounded-full filter blur-3xl animate-pulse-slow animation-delay-1000"></div>
      </div>
      <div className="container mx-auto px-4 overflow-x-hidden relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }} 
            whileInView={{ scale: 1, opacity: 1 }} 
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mb-4 inline-block"
          >
            <span className="inline-block py-1.5 px-5 dark-glass-button text-white rounded-full text-sm font-semibold shadow-lg">
              Why Choose NextMed
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight text-shadow-glow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            style={{
              textShadow: '0 0 15px rgba(78, 78, 231, 0.5)'
            }}
          >
            Transform Your Healthcare Experience with <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">Advanced Benefits</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              textShadow: '0 0 5px rgba(255, 255, 255, 0.3)'
            }}
          >
            Our AI-powered healthcare platform delivers personalized care, real-time insights, and seamless experiences to revolutionize how you manage your health.
          </motion.p>
        </div>
        
        <div className="flex justify-center items-center gap-8 mb-12">
          {getVisibleCards().map((cardIndex, position) => {
            const benefit = benefits[cardIndex];
            const isCenter = position === 1;
            return (
              <motion.div
                key={cardIndex}
                className={`relative p-8 transition-all duration-500 ${
                  isCenter 
                    ? 'dark-glass-card text-white shadow-2xl scale-110 z-10' 
                    : 'bg-black/20 backdrop-blur-sm text-white/60 scale-95 opacity-50 blur-sm border border-white/10'
                } w-80 h-64 flex flex-col justify-center`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: isCenter ? 1 : 0.5, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {isCenter && (
                  <motion.div 
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg overflow-hidden"
                    animate={{ 
                      boxShadow: [
                        '0 0 20px rgba(59, 130, 246, 0.3)',
                        '0 0 40px rgba(59, 130, 246, 0.6)',
                        '0 0 20px rgba(59, 130, 246, 0.3)'
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <img 
                      src={`/images/Crads-img/${benefit.title}.jpg`}
                      alt={benefit.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                )}
                
                <div className="text-center">
                  <h3 className={`text-xl font-bold mb-4 ${isCenter ? 'text-white' : 'text-white/60'}`}>
                    {benefit.title}
                  </h3>
                  
                  <div className={`w-16 h-px mx-auto mb-4 ${isCenter ? 'bg-white/30' : 'bg-white/20'}`}></div>
                  
                  <p className={`text-sm leading-relaxed ${isCenter ? 'text-white/80' : 'text-white/40'}`}>
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="flex justify-center gap-4 mb-12">
          <motion.button
            onClick={prevCard}
            className="w-12 h-12 dark-glass-button text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
          
          <motion.button
            onClick={nextCard}
            className="w-12 h-12 dark-glass-button text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
        
        <motion.div 
          className="mt-24 text-center dark-glass p-10 max-w-4xl mx-auto relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <motion.div 
            className="absolute -top-6 -right-6 text-primary/20"
            variants={floatAnimation}
            initial="initial"
            animate="animate"
          >
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-11h2v4h4v2h-4v4h-2v-4H7v-2h4V9z"/>
            </svg>
          </motion.div>
          
          <div className="max-w-xl mx-auto relative z-10">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to experience the future of healthcare?</h3>
            <p className="text-white/80 mb-8">Join over 50,000 patients who have transformed their healthcare experience with NextMed's innovative platform.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a 
                href="/about" 
                className="inline-flex items-center px-6 py-3.5 dark-glass-button text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
              
              <motion.a 
                href="/demo" 
                className="inline-flex items-center px-6 py-3.5 dark-glass-button text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                Watch Demo
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HealthBenefitsSection;