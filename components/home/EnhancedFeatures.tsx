"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

const features = [
  {
    id: 1,
    title: 'AI-Powered Diagnostics',
    description: 'Advanced machine learning algorithms analyze symptoms and provide accurate preliminary diagnoses with 95% accuracy rate.',
    icon: '🧠',
    color: 'from-blue-500 to-indigo-600',
    link: '/ai-diagnosis'
  },
  {
    id: 2,
    title: 'Skin Vision Analysis',
    description: 'Revolutionary computer vision technology detects skin conditions from photos using deep learning neural networks.',
    icon: '📷',
    color: 'from-green-500 to-emerald-600',
    link: '/skin-vision'
  },
  {
    id: 3,
    title: 'Blood Report Intelligence',
    description: 'Comprehensive analysis of blood test results with personalized insights and health recommendations.',
    icon: '❤️',
    color: 'from-red-500 to-rose-600',
    link: '/blood-report-analysis'
  },
  {
    id: 4,
    title: 'Virtual Consultations',
    description: 'Connect with certified healthcare professionals through secure video calls and get expert medical advice.',
    icon: '👨‍⚕️',
    color: 'from-purple-500 to-violet-600',
    link: '/doctors'
  },
  {
    id: 5,
    title: 'Health Records Management',
    description: 'Securely store and manage your complete medical history with blockchain-level security and easy access.',
    icon: '📋',
    color: 'from-cyan-500 to-blue-600',
    link: '/health-records'
  },
  {
    id: 6,
    title: '24/7 Health Monitoring',
    description: 'Continuous health tracking with real-time alerts and personalized health insights powered by AI.',
    icon: '⏰',
    color: 'from-orange-500 to-red-600',
    link: '/dashboard'
  }
];

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2 transform-gpu">
        
        {/* Icon Container */}
        <motion.div 
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-6 shadow-lg`}
          animate={{ 
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          {feature.icon}
        </motion.div>
        
        {/* Content */}
        <motion.h3 
          className="text-2xl font-bold text-white mb-4"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {feature.title}
        </motion.h3>
        
        <p className="text-gray-300 mb-6 leading-relaxed">
          {feature.description}
        </p>
        
        {feature.link && (
          <Link 
            href={feature.link} 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium group-hover:translate-x-2 transition-transform duration-300"
          >
            Explore Feature
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
        
        {/* Hover Effect Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
        />
        
        {/* Floating particles */}
        <motion.div
          className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full"
          animate={{
            y: isHovered ? [-5, 5, -5] : [0],
            opacity: isHovered ? [0.5, 1, 0.5] : [0.3]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-8 left-8 w-1 h-1 bg-purple-400 rounded-full"
          animate={{
            y: isHovered ? [5, -5, 5] : [0],
            opacity: isHovered ? [0.3, 0.8, 0.3] : [0.2]
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
      </div>
    </motion.div>
  );
}

const EnhancedFeatures = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 100, 0]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, -100, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            className="inline-block py-2 px-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-blue-300 rounded-full text-sm font-medium mb-6 border border-blue-500/30"
          >
            🚀 Advanced Healthcare Technology
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Revolutionary Features for{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Modern Healthcare
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Experience the future of healthcare with our cutting-edge AI technologies, 
            designed to provide accurate diagnostics and personalized care.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Link 
            href="/services" 
            className="btn-3d"
          >
            Explore All Services
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default EnhancedFeatures;