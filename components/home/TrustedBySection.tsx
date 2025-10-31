"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';

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

// New animation variants
const logoHover = {
  rest: { scale: 1, filter: "grayscale(1) opacity(0.7)" },
  hover: { 
    scale: 1.05, 
    filter: "grayscale(0) opacity(1)",
    transition: { 
      duration: 0.3,
      ease: "easeOut" 
    }
  }
};

const shimmer = {
  rest: { opacity: 0, x: -50 },
  hover: {
    opacity: [0, 1, 0],
    x: 50,
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity
    }
  }
};

// Define higher-quality partner logos with industry-specific names
const partners = [
  {
    name: "Mayo Medical Network",
    logo: (
      <svg viewBox="0 0 160 40" fill="none" className="w-full h-10">
        <path d="M20 8H30C32.2091 8 34 9.79086 34 12V28C34 30.2091 32.2091 32 30 32H20V8Z" fill="#0057B8" />
        <path d="M40 8H50C52.2091 8 54 9.79086 54 12V28C54 30.2091 52.2091 32 50 32H40V8Z" fill="#0057B8" />
        <path d="M60 16H70C72.2091 16 74 17.7909 74 20V28C74 30.2091 72.2091 32 70 32H60V16Z" fill="#0057B8" />
        <path d="M10 20L18 8V32L10 20Z" fill="#0057B8" />
        <path d="M85 12H88M85 20H88M85 28H88" stroke="#0057B8" strokeWidth="2" strokeLinecap="round" />
        <path d="M96 12H114" stroke="#0057B8" strokeWidth="4" strokeLinecap="round" />
        <path d="M96 20H110" stroke="#0057B8" strokeWidth="4" strokeLinecap="round" />
        <path d="M96 28H106" stroke="#0057B8" strokeWidth="4" strokeLinecap="round" />
        <path d="M126 12V28M126 12L134 20M126 12L118 20" stroke="#0057B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="145" cy="20" r="8" stroke="#0057B8" strokeWidth="2" />
      </svg>
    )
  },
  {
    name: "CareFirst Health Alliance",
    logo: (
      <svg viewBox="0 0 160 40" fill="none" className="w-full h-10">
        <rect x="10" y="8" width="24" height="24" rx="12" fill="#E64A33" />
        <path d="M22 12V28M14 20H30" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M44 12H60M44 16H56M44 20H52M44 24H56M44 28H60" stroke="#E64A33" strokeWidth="2" strokeLinecap="round" />
        <path d="M70 20C70 14.4772 74.4772 10 80 10V10C85.5228 10 90 14.4772 90 20V20C90 25.5228 85.5228 30 80 30V30C74.4772 30 70 25.5228 70 20V20Z" stroke="#E64A33" strokeWidth="2" />
        <path d="M75 20H85" stroke="#E64A33" strokeWidth="2" strokeLinecap="round" />
        <path d="M100 10L110 30M110 10L100 30" stroke="#E64A33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M120 10V30M130 10V30M120 20H130" stroke="#E64A33" strokeWidth="2" strokeLinecap="round" />
        <path d="M140 10V30L150 20L140 10Z" fill="#E64A33" />
      </svg>
    )
  },
  {
    name: "MedTech Innovations",
    logo: (
      <svg viewBox="0 0 160 40" fill="none" className="w-full h-10">
        <circle cx="20" cy="20" r="10" fill="#4285F4" />
        <circle cx="45" cy="20" r="10" fill="#34A853" />
        <circle cx="70" cy="20" r="10" fill="#FBBC05" />
        <circle cx="95" cy="20" r="10" fill="#EA4335" />
        <path d="M115 10H120V30H115V10Z" fill="#4285F4" />
        <path d="M130 10H150L140 20L150 30H130V10Z" fill="#34A853" />
      </svg>
    )
  },
  {
    name: "Pulse Healthcare Systems",
    logo: (
      <svg viewBox="0 0 160 40" fill="none" className="w-full h-10">
        <path d="M10 20C10 14.4772 14.4772 10 20 10H70C75.5228 10 80 14.4772 80 20C80 25.5228 75.5228 30 70 30H20C14.4772 30 10 25.5228 10 20Z" fill="#0077B5" />
        <path d="M22 15L27 25L32 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M36 15V25M42 15V25M36 20H42" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M58 15V25M52 15L52 20C52 22.7614 54.2386 25 57 25H58" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M68 15V25L64 20H68" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M90 16V24M90 16C90 13.7909 91.7909 12 94 12V12C96.2091 12 98 13.7909 98 16V24C98 26.2091 96.2091 28 94 28V28C91.7909 28 90 26.2091 90 24V24" stroke="#0077B5" strokeWidth="2" strokeLinecap="round" />
        <rect x="106" y="12" width="8" height="16" rx="4" stroke="#0077B5" strokeWidth="2" />
        <path d="M122 12V28L130 20L122 12Z" stroke="#0077B5" strokeWidth="2" strokeLinejoin="round" />
        <path d="M138 12V28M146 12V28M138 20H146" stroke="#0077B5" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  },
  {
    name: "Global Health Initiative",
    logo: (
      <svg viewBox="0 0 160 40" fill="none" className="w-full h-10">
        <path d="M20 10L35 30H5L20 10Z" fill="#1DA1F2" />
        <circle cx="50" cy="20" r="10" stroke="#1DA1F2" strokeWidth="2" />
        <path d="M70 10H90V20H70V10Z" fill="#1DA1F2" />
        <path d="M70 24H90V28H70V24Z" fill="#1DA1F2" />
        <path d="M100 10H110M100 20H110M100 30H110" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round" />
        <path d="M140 10L130 10L130 30L140 30" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M150 10L140 10L140 30L150 30" stroke="#1DA1F2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    name: "Cleveland Wellness Center",
    logo: (
      <svg viewBox="0 0 160 40" fill="none" className="w-full h-10">
        <path d="M15 12C15 10.8954 15.8954 10 17 10H33C34.1046 10 35 10.8954 35 12V28C35 29.1046 34.1046 30 33 30H17C15.8954 30 15 29.1046 15 28V12Z" fill="#5D3FD3" />
        <path d="M25 15V25" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 20H30" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M45 15L55 25M55 15L45 25" stroke="#5D3FD3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M70 10H100" stroke="#5D3FD3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M70 20H95" stroke="#5D3FD3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M70 30H90" stroke="#5D3FD3" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="125" cy="20" r="10" stroke="#5D3FD3" strokeWidth="2" />
        <path d="M125 15V25" stroke="#5D3FD3" strokeWidth="2" strokeLinecap="round" />
        <path d="M120 20H130" stroke="#5D3FD3" strokeWidth="2" strokeLinecap="round" />
        <rect x="140" y="10" width="10" height="20" rx="2" stroke="#5D3FD3" strokeWidth="2" />
      </svg>
    )
  }
];

// Statistics with specific healthcare metrics
const statistics = [
  { 
    number: "800+", 
    text: "Healthcare Partners", 
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    description: "Leading healthcare institutions rely on NextMed's AI solutions to transform patient care."
  },
  { 
    number: "125,000+", 
    text: "Patients Served Annually", 
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    description: "Our platform provides exceptional healthcare experiences to patients across the globe."
  },
  { 
    number: "99.6%", 
    text: "Diagnostic Accuracy", 
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    description: "Our advanced AI algorithms deliver precise medical diagnostics with unmatched consistency."
  },
  { 
    number: "5,000+", 
    text: "Medical Professionals", 
    icon: (
      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    description: "Specialists and healthcare providers trust our platform for efficient patient care."
  }
];

const TrustedBySection = () => {
  const [activePartner, setActivePartner] = useState<number | null>(null);
  const [activeStat, setActiveStat] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gradient-to-r from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -left-10 -top-10 w-40 h-40 bg-blue-50 rounded-full opacity-30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute right-0 bottom-0 w-80 h-80 bg-indigo-50 rounded-full opacity-30 transform translate-x-1/2 translate-y-1/2"
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3], 
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-primary rounded-full opacity-20"></div>
        <div className="absolute top-3/4 right-1/3 w-8 h-8 bg-primary rounded-full opacity-10"></div>
        
        {/* Enhanced animated pulse elements */}
        {[1, 2, 3, 4, 5].map((i) => (
          <motion.div 
            key={i}
            className="absolute bg-primary rounded-full opacity-5"
            style={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              width: `${60 - (i * 8)}px`, 
              height: `${60 - (i * 8)}px` 
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.05, 0.1, 0.05]
            }}
            transition={{
              duration: 3 + (i * 1.5),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.7
            }}
          />
        ))}
        
        {/* Animated lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="diagonalHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.span 
            className="inline-block py-1.5 px-5 bg-gradient-to-r from-blue-50 to-indigo-100 text-indigo-800 rounded-full text-sm font-semibold mb-4 border border-indigo-100/50 shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Trusted Globally
          </motion.span>
          
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Partnered with <span className="text-primary">Leading Healthcare</span> Organizations
          </motion.h2>
          
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Our technology is trusted by prestigious medical institutions worldwide, delivering exceptional AI-powered healthcare solutions
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="flex flex-wrap justify-center items-center gap-x-12 gap-y-10 mb-20 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {/* Decorative connector lines between partners */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <svg width="100%" height="100%" strokeDasharray="5,5" stroke="currentColor" strokeWidth="1" className="text-primary">
              <line x1="10%" y1="50%" x2="90%" y2="50%" />
              <line x1="50%" y1="10%" x2="50%" y2="90%" />
              <line x1="20%" y1="20%" x2="80%" y2="80%" />
              <line x1="20%" y1="80%" x2="80%" y2="20%" />
            </svg>
          </div>
          
          {partners.map((partner, index) => (
            <motion.div 
              key={partner.name}
              className="w-40 md:w-48 h-20 flex flex-col items-center justify-center group relative"
              variants={fadeIn}
              whileHover="hover"
              initial="rest"
              animate="rest"
              onHoverStart={() => setActivePartner(index)}
              onHoverEnd={() => setActivePartner(null)}
            >
              <motion.div 
                className="w-full grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 relative overflow-hidden"
                variants={logoHover}
              >
                {partner.logo}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  variants={shimmer}
                />
              </motion.div>
              <motion.p 
                className="text-xs text-center text-gray-600 mt-2 font-medium opacity-80 hover:opacity-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: activePartner === index ? 1 : 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {partner.name}
              </motion.p>
              
              {/* Highlight ring that appears on hover */}
              <motion.div 
                className="absolute -inset-2 rounded-lg border-2 border-primary/10 opacity-0"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: activePartner === index ? 1 : 0,
                  scale: activePartner === index ? 1 : 0.9
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {statistics.map((stat, index) => (
              <motion.div 
                key={stat.text}
                className="p-8 text-center relative overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                whileHover={{ 
                  backgroundColor: "rgba(237, 242, 255, 0.7)"
                }}
                onHoverStart={() => setActiveStat(index)}
                onHoverEnd={() => setActiveStat(null)}
              >
                {/* Enhanced background decoration for each stat */}
                <motion.div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: activeStat === index ? 1 : 0.8, 
                    opacity: activeStat === index ? 1 : 0 
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <svg className="absolute -right-4 -bottom-4 text-indigo-100 w-24 h-24" fill="currentColor" viewBox="0 0 100 100">
                    <path d="M95,50 C95,74.8528137 74.8528137,95 50,95 C25.1471863,95 5,74.8528137 5,50 C5,25.1471863 25.1471863,5 50,5 C74.8528137,5 95,25.1471863 95,50 Z"></path>
                  </svg>
                </motion.div>
                
                <motion.div 
                  className="flex justify-center mb-4"
                  whileHover={{ y: -3 }}
                >
                  <motion.div 
                    className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center text-primary"
                    animate={{
                      scale: activeStat === index ? [1, 1.05, 1] : 1,
                      backgroundColor: activeStat === index ? ['rgba(224, 231, 255, 0.6)', 'rgba(224, 231, 255, 1)', 'rgba(224, 231, 255, 0.6)'] : 'rgba(224, 231, 255, 0.6)',
                    }}
                    transition={{
                      duration: 2,
                      repeat: activeStat === index ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    {stat.icon}
                  </motion.div>
                </motion.div>
                
                <motion.h3 
                  className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <motion.span
                    initial={{ opacity: 1 }}
                    animate={{ 
                      color: activeStat === index ? '#4F46E5' : '#111827',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {stat.number}
                  </motion.span>
                </motion.h3>
                
                <p className="text-gray-600 text-sm mb-3">{stat.text}</p>
                
                {/* New: description that appears on hover */}
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: activeStat === index ? 1 : 0,
                    height: activeStat === index ? 'auto' : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-xs text-gray-500 overflow-hidden"
                >
                  {stat.description}
                </motion.div>
                
                {/* Decorative underline that appears on hover */}
                <motion.div 
                  className="h-1 w-0 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-4 group-hover:w-16 transition-all duration-300"
                  layoutId={`underline-${index}`}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Enhanced Testimonial Quote */}
        <motion.div 
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-white to-gray-50 p-10 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {/* Background patterns */}
          <div className="absolute inset-0 opacity-5">
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" />
            </svg>
          </div>
          
          <motion.div
            className="absolute top-4 left-4 opacity-10 text-primary"
            animate={{
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 32 32">
              <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
            </svg>
          </motion.div>
          
          <svg className="w-10 h-10 text-primary/30 mx-auto mb-4" fill="currentColor" viewBox="0 0 32 32">
            <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
          </svg>
          
          <blockquote className="text-lg md:text-xl text-gray-700 italic mb-6 leading-relaxed">
            "NextMed's innovative AI platform has transformed how we deliver care to our patients. The diagnostic accuracy and seamless integration with our existing systems have made it an invaluable tool for our medical staff."
          </blockquote>
          
          <div className="flex items-center justify-center">
            <motion.div 
              className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl mr-3 shadow-md"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              C
            </motion.div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">Dr. Catherine M. Johnson</p>
              <p className="text-sm text-gray-600">Chief Medical Officer, Cleveland Wellness Center</p>
            </div>
          </div>
          
          {/* Rating stars */}
          <motion.div 
            className="flex justify-center mt-6"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.svg 
                key={i} 
                className="w-5 h-5 text-yellow-400 mx-0.5" 
                fill="currentColor" 
                viewBox="0 0 20 20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </motion.svg>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustedBySection; 