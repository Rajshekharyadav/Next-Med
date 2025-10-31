"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import ClientOnly from '../ui/ClientOnly';

const Canvas = dynamic(() => import('@react-three/fiber').then(mod => ({ default: mod.Canvas })), { ssr: false });
const OrbitControls = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.OrbitControls })), { ssr: false });
const Sphere = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Sphere })), { ssr: false });
const MeshDistortMaterial = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.MeshDistortMaterial })), { ssr: false });
const Float = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Float })), { ssr: false });

// 3D Medical Icon Component
function MedicalIcon() {
  const meshRef = useRef<any>(null);
  
  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.2]} />
        <meshStandardMaterial color="#4F46E5" />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.2, 0.8, 0.2]} />
        <meshStandardMaterial color="#4F46E5" />
      </mesh>
    </Float>
  );
}

// 3D Floating Spheres
function FloatingSpheres() {
  return (
    <>
      <Float speed={2} rotationIntensity={1} floatIntensity={3}>
        <Sphere args={[0.3]} position={[-2, 1, -1]}>
          <MeshDistortMaterial
            color="#60A5FA"
            attach="material"
            distort={0.3}
            speed={2}
            roughness={0.2}
          />
        </Sphere>
      </Float>
      
      <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
        <Sphere args={[0.2]} position={[2, -1, -0.5]}>
          <MeshDistortMaterial
            color="#34D399"
            attach="material"
            distort={0.4}
            speed={3}
            roughness={0.1}
          />
        </Sphere>
      </Float>
      
      <Float speed={2.5} rotationIntensity={0.5} floatIntensity={4}>
        <Sphere args={[0.15]} position={[1, 2, -2]}>
          <MeshDistortMaterial
            color="#F472B6"
            attach="material"
            distort={0.2}
            speed={1.5}
            roughness={0.3}
          />
        </Sphere>
      </Float>
    </>
  );
}

// 3D Scene Component
function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4F46E5" />
      
      <MedicalIcon />
      <FloatingSpheres />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

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

const Enhanced3DHero = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
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
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div 
            className="relative z-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <motion.span 
              className="inline-block py-2 px-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm text-blue-300 rounded-full text-sm font-medium mb-6 border border-blue-500/30"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
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
                  duration: 8,
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
              Experience revolutionary healthcare with AI-powered diagnostics, real-time analysis, and personalized care - all from the comfort of your home.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 mb-12"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeIn}>
                <Link href="/skin-vision" className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/25 hover:-translate-y-1">
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></span>
                  <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Try Skin Vision AI
                </Link>
              </motion.div>
              
              <motion.div variants={fadeIn}>
                <Link href="/ai-diagnosis" className="group relative inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-xl font-semibold transition-all duration-300 hover:bg-white/20 hover:shadow-xl">
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s" 
                    alt="Gemini AI" 
                    className="h-5 w-5 mr-2 rounded-full group-hover:scale-110 transition-transform"
                  />
                  AI Diagnosis
                </Link>
              </motion.div>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-8"
              variants={fadeIn}
            >
              {[
                { number: "10K+", label: "Patients Served" },
                { number: "95%", label: "Accuracy Rate" },
                { number: "24/7", label: "Support" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + (index * 0.1) }}
                >
                  <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right 3D Scene */}
          <motion.div 
            className="relative h-[600px] w-full"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-3xl border border-white/10">
              <ClientOnly fallback={
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
                </div>
              }>
                <Suspense fallback={
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-400"></div>
                  </div>
                }>
                  <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                    <Scene3D />
                  </Canvas>
                </Suspense>
              </ClientOnly>
            </div>
            
            {/* Floating UI Elements */}
            <motion.div 
              className="absolute top-8 right-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">AI Active</span>
              </div>
            </motion.div>
            
            <motion.div 
              className="absolute bottom-8 left-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="text-white">
                <div className="text-xs text-gray-300 mb-1">Health Score</div>
                <div className="text-2xl font-bold text-green-400">98%</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Enhanced3DHero;