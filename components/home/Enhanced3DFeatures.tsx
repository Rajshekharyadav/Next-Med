"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Suspense, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import ClientOnly from '../ui/ClientOnly';

const Canvas = dynamic(() => import('@react-three/fiber').then(mod => ({ default: mod.Canvas })), { ssr: false });
const Float = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Float })), { ssr: false });
const OrbitControls = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.OrbitControls })), { ssr: false });
const Sphere = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Sphere })), { ssr: false });
const Box = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Box })), { ssr: false });
const Torus = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Torus })), { ssr: false });
import * as THREE from 'three';

// 3D Feature Icon Components
function FeatureIcon3D({ type, color }: { type: string; color: string }) {
  const meshRef = useRef<any>(null);
  
  const iconComponents = {
    medical: (
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <group>
          <Box args={[0.8, 0.2, 0.2]} position={[0, 0, 0]}>
            <meshStandardMaterial color={color} />
          </Box>
          <Box args={[0.2, 0.8, 0.2]} position={[0, 0, 0]}>
            <meshStandardMaterial color={color} />
          </Box>
        </group>
      </Float>
    ),
    camera: (
      <Float speed={1.5} rotationIntensity={2} floatIntensity={3}>
        <group>
          <Box args={[1, 0.6, 0.4]} position={[0, 0, 0]}>
            <meshStandardMaterial color={color} />
          </Box>
          <Sphere args={[0.25]} position={[0.3, 0, 0.25]}>
            <meshStandardMaterial color="#333" />
          </Sphere>
        </group>
      </Float>
    ),
    brain: (
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={4}>
        <Torus args={[0.4, 0.15, 8, 16]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={color} />
        </Torus>
      </Float>
    ),
    heart: (
      <Float speed={1.8} rotationIntensity={1.5} floatIntensity={2.5}>
        <group>
          <Sphere args={[0.3]} position={[-0.15, 0.1, 0]}>
            <meshStandardMaterial color={color} />
          </Sphere>
          <Sphere args={[0.3]} position={[0.15, 0.1, 0]}>
            <meshStandardMaterial color={color} />
          </Sphere>
          <Box args={[0.4, 0.4, 0.3]} position={[0, -0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
            <meshStandardMaterial color={color} />
          </Box>
        </group>
      </Float>
    )
  };
  
  return iconComponents[type as keyof typeof iconComponents] || iconComponents.medical;
}

// Individual Feature Card with 3D
function FeatureCard3D({ feature, index }: { feature: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-2">
        {/* 3D Icon Container */}
        <div className="h-32 w-full mb-6 relative">
          <ClientOnly fallback={
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
            </div>
          }>
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400"></div>
              </div>
            }>
              <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color={feature.color} />
                
                <FeatureIcon3D type={feature.iconType} color={feature.color} />
                
                <OrbitControls 
                  enableZoom={false} 
                  enablePan={false}
                  autoRotate={isHovered}
                  autoRotateSpeed={2}
                />
              </Canvas>
            </Suspense>
          </ClientOnly>
        </div>
        
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
      </div>
    </motion.div>
  );
}

const features = [
  {
    id: 1,
    title: 'AI-Powered Diagnostics',
    description: 'Advanced machine learning algorithms analyze symptoms and provide accurate preliminary diagnoses with 95% accuracy rate.',
    iconType: 'brain',
    color: '#4F46E5',
    link: '/ai-diagnosis'
  },
  {
    id: 2,
    title: 'Skin Vision Analysis',
    description: 'Revolutionary computer vision technology detects skin conditions from photos using deep learning neural networks.',
    iconType: 'camera',
    color: '#059669',
    link: '/skin-vision'
  },
  {
    id: 3,
    title: 'Blood Report Intelligence',
    description: 'Comprehensive analysis of blood test results with personalized insights and health recommendations.',
    iconType: 'heart',
    color: '#DC2626',
    link: '/blood-report-analysis'
  },
  {
    id: 4,
    title: 'Virtual Consultations',
    description: 'Connect with certified healthcare professionals through secure video calls and get expert medical advice.',
    iconType: 'medical',
    color: '#7C3AED',
    link: '/doctors'
  },
  {
    id: 5,
    title: 'Health Records Management',
    description: 'Securely store and manage your complete medical history with blockchain-level security and easy access.',
    iconType: 'medical',
    color: '#0891B2',
    link: '/health-records'
  },
  {
    id: 6,
    title: '24/7 Health Monitoring',
    description: 'Continuous health tracking with real-time alerts and personalized health insights powered by AI.',
    iconType: 'heart',
    color: '#EA580C',
    link: '/dashboard'
  }
];

const Enhanced3DFeatures = () => {
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
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
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
            <FeatureCard3D key={feature.id} feature={feature} index={index} />
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
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1"
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

export default Enhanced3DFeatures;