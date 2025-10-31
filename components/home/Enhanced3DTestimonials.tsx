"use client";

import { motion } from 'framer-motion';
import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import ClientOnly from '../ui/ClientOnly';

const Canvas = dynamic(() => import('@react-three/fiber').then(mod => ({ default: mod.Canvas })), { ssr: false });
const Float = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Float })), { ssr: false });
const Sphere = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Sphere })), { ssr: false });
const MeshDistortMaterial = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.MeshDistortMaterial })), { ssr: false });
const OrbitControls = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.OrbitControls })), { ssr: false });
import Card3D from '../ui/Card3D';

// 3D Avatar Component
function Avatar3D({ color }: { color: string }) {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
      <Sphere args={[0.8]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.2}
          speed={1}
          roughness={0.1}
        />
      </Sphere>
    </Float>
  );
}

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Patient",
    avatar: "#4F46E5",
    rating: 5,
    text: "The AI skin analysis detected my condition early. The accuracy was incredible and saved me multiple doctor visits. Highly recommend NextMed!",
    condition: "Skin Analysis"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    role: "Dermatologist",
    avatar: "#059669",
    rating: 5,
    text: "As a healthcare professional, I'm impressed by the diagnostic accuracy. The AI recommendations align perfectly with clinical assessments.",
    condition: "Professional Review"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Patient",
    avatar: "#DC2626",
    rating: 5,
    text: "The blood report analysis provided insights my doctor missed. The personalized recommendations helped improve my health significantly.",
    condition: "Blood Analysis"
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Patient",
    avatar: "#7C3AED",
    rating: 5,
    text: "Virtual consultations are convenient and thorough. The doctors are knowledgeable and the platform is user-friendly.",
    condition: "Telemedicine"
  },
  {
    id: 5,
    name: "Dr. Lisa Park",
    role: "General Practitioner",
    avatar: "#0891B2",
    rating: 5,
    text: "NextMed's AI diagnostics complement our practice perfectly. It helps us provide better patient care and faster diagnoses.",
    condition: "AI Diagnostics"
  },
  {
    id: 6,
    name: "Robert Kim",
    role: "Patient",
    avatar: "#EA580C",
    rating: 5,
    text: "The 24/7 health monitoring caught an irregular heartbeat that led to early treatment. This platform literally saved my life.",
    condition: "Health Monitoring"
  }
];

const Enhanced3DTestimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  return (
    <section className="relative py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
            rotate: [360, 180, 0]
          }}
          transition={{
            duration: 12,
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
            className="inline-block py-2 px-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm text-purple-300 rounded-full text-sm font-medium mb-6 border border-purple-500/30"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            ⭐ Patient Success Stories
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
              Thousands
            </span>
            {" "}of Patients
          </h2>
          
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Real stories from real people who transformed their healthcare experience with NextMed's AI-powered solutions.
          </p>
        </motion.div>

        {/* Featured Testimonial */}
        <motion.div 
          className="max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Card3D className="p-8" glowColor="purple" intensity={0.3}>
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* 3D Avatar */}
              <div className="w-32 h-32 relative">
                <ClientOnly fallback={
                  <div className="w-32 h-32 bg-purple-500/20 rounded-full animate-pulse"></div>
                }>
                  <Suspense fallback={
                    <div className="w-32 h-32 bg-purple-500/20 rounded-full animate-pulse"></div>
                  }>
                    <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                      <ambientLight intensity={0.6} />
                      <pointLight position={[10, 10, 10]} intensity={1} />
                      <Avatar3D color={testimonials[activeTestimonial].avatar} />
                      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
                    </Canvas>
                  </Suspense>
                </ClientOnly>
              </div>
              
              {/* Content */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <motion.svg
                      key={i}
                      className="w-6 h-6 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>
                
                <blockquote className="text-xl text-gray-200 mb-6 leading-relaxed">
                  "{testimonials[activeTestimonial].text}"
                </blockquote>
                
                <div>
                  <div className="font-semibold text-white text-lg">
                    {testimonials[activeTestimonial].name}
                  </div>
                  <div className="text-purple-300">
                    {testimonials[activeTestimonial].role}
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    {testimonials[activeTestimonial].condition}
                  </div>
                </div>
              </div>
            </div>
          </Card3D>
        </motion.div>

        {/* Testimonial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setActiveTestimonial(index)}
              className="cursor-pointer"
            >
              <Card3D 
                className={`p-6 transition-all duration-300 ${
                  activeTestimonial === index ? 'ring-2 ring-purple-400' : ''
                }`}
                glowColor="purple"
                intensity={0.2}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  {testimonial.text.length > 100 
                    ? `${testimonial.text.substring(0, 100)}...` 
                    : testimonial.text
                  }
                </p>
                
                <div className="text-xs text-purple-300 font-medium">
                  {testimonial.condition}
                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { number: "10,000+", label: "Happy Patients" },
            { number: "95%", label: "Accuracy Rate" },
            { number: "24/7", label: "Support" },
            { number: "500+", label: "Doctors" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 + (index * 0.1) }}
            >
              <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Enhanced3DTestimonials;