"use client";

import { motion } from 'framer-motion';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import ClientOnly from './ClientOnly';

const Canvas = dynamic(() => import('@react-three/fiber').then(mod => ({ default: mod.Canvas })), { ssr: false });
const Float = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Float })), { ssr: false });
const Sphere = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.Sphere })), { ssr: false });
const MeshDistortMaterial = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.MeshDistortMaterial })), { ssr: false });
const OrbitControls = dynamic(() => import('@react-three/drei').then(mod => ({ default: mod.OrbitControls })), { ssr: false });

function LoadingSphere() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={3}>
      <Sphere args={[1]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="#4F46E5"
          attach="material"
          distort={0.5}
          speed={3}
          roughness={0.1}
        />
      </Sphere>
    </Float>
  );
}

interface Loading3DProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Loading3D = ({ message = "Loading...", size = 'md' }: Loading3DProps) => {
  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} relative`}>
        <ClientOnly fallback={
          <div className={`${sizeClasses[size]} bg-blue-500/20 rounded-full animate-pulse`}></div>
        }>
          <Suspense fallback={
            <div className={`${sizeClasses[size]} bg-blue-500/20 rounded-full animate-pulse`}></div>
          }>
            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4F46E5" />
              
              <LoadingSphere />
              
              <OrbitControls 
                enableZoom={false} 
                enablePan={false}
                autoRotate
                autoRotateSpeed={2}
              />
            </Canvas>
          </Suspense>
        </ClientOnly>
      </div>
      
      <motion.div
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.p 
          className="text-lg font-medium text-gray-700 mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.p>
        
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-500 rounded-full"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Loading3D;