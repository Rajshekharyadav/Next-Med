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

// New animations for enhanced UI
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-indigo-100/70 to-purple-100/70 rounded-full opacity-70 blur-3xl -z-10 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-blue-100/70 to-indigo-100/70 rounded-full opacity-70 blur-3xl -z-10 transform -translate-x-1/2 translate-y-1/2"></div>
      
      {/* Enhanced animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -150 - 50, 0],
              opacity: [0, Math.random() * 0.5 + 0.5, 0],
              scale: [0, Math.random() * 2 + 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
        
        {/* Decorative circles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`circle-${i}`}
            className="absolute rounded-full opacity-10"
            style={{
              left: `${20 + i * 25}%`,
              top: `${30 + i * 20}%`,
              width: `${150 - i * 30}px`,
              height: `${150 - i * 30}px`,
              background: `radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0) 70%)`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ scale: 0, opacity: 0 }} 
            whileInView={{ scale: 1, opacity: 1 }} 
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="mb-4 inline-block"
          >
            <span className="inline-block py-1.5 px-5 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 rounded-full text-sm font-semibold border border-indigo-200/50 shadow-sm">
              Why Choose NextMed
            </span>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Transform Your Healthcare Experience with <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Advanced Benefits</span>
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Our AI-powered healthcare platform delivers personalized care, real-time insights, and seamless experiences to revolutionize how you manage your health.
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => (
            <motion.div 
              key={benefit.title}
              className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group border border-gray-100/40 ${hoveredCard === index ? 'ring-2 ring-primary/20 scale-[1.02]' : ''}`}
              variants={item}
              whileHover={{ y: -8 }}
              onHoverStart={() => {
                setActiveIndex(index);
                setHoveredCard(index);
              }}
              onHoverEnd={() => {
                setActiveIndex(null);
                setHoveredCard(null);
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-7 relative">
                {/* Background pattern */}
                <div className="absolute right-0 top-0 h-20 w-20 opacity-5">
                  <svg className="w-full h-full" viewBox="0 0 80 80" fill="none">
                    <path d="M80 0H0V80H80V0Z" fill="url(#paint0_radial)" />
                    <defs>
                      <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(40 40) rotate(90) scale(40)">
                        <stop stopColor="currentColor" />
                        <stop offset="1" stopColor="currentColor" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>
                
                <motion.div 
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 text-white bg-gradient-to-r ${benefit.color} transform transition-all duration-300 shadow-lg`}
                  whileHover={{ scale: 1.1 }}
                  animate={hoveredCard === index ? pulseAnimation.animate : pulseAnimation.initial}
                >
                  {benefit.icon}
                </motion.div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                  {benefit.title}
                  {activeIndex === index && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="ml-2 text-xs font-normal bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                    >
                      {benefit.stats}
                    </motion.span>
                  )}
                </h3>
                
                <p className="text-gray-600">{benefit.description}</p>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-t border-gray-100 flex justify-between items-center">
                <a href="#" className="text-primary flex items-center text-sm font-medium group-hover:underline">
                  Learn more
                  <motion.svg 
                    className="w-4 h-4 ml-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                    initial={{ x: 0 }}
                    animate={{ x: activeIndex === index ? 3 : 0 }}
                    transition={{ repeat: activeIndex === index ? Infinity : 0, repeatType: "reverse", duration: 0.6 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </motion.svg>
                </a>
                
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-24 text-center bg-gradient-to-br from-indigo-50 to-blue-50 p-10 rounded-2xl shadow-sm border border-indigo-100/50 max-w-4xl mx-auto relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          {/* Animated pattern background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="currentColor" />
              </pattern>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Floating health icon */}
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
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to experience the future of healthcare?</h3>
            <p className="text-gray-600 mb-8">Join over 50,000 patients who have transformed their healthcare experience with NextMed's innovative platform.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a 
                href="/about" 
                className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:from-primary/90 hover:to-indigo-600/90"
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
                className="inline-flex items-center px-6 py-3.5 bg-white text-primary border border-primary/20 rounded-lg shadow-sm hover:bg-gray-50 transition-all duration-300"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.9)" }}
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