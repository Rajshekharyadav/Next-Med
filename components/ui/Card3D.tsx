"use client";

import { motion } from 'framer-motion';
import { ReactNode, useRef, useState } from 'react';

interface Card3DProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: number;
}

const Card3D = ({ 
  children, 
  className = "", 
  glowColor = "blue", 
  intensity = 0.5 
}: Card3DProps) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -10 * intensity;
    const rotateYValue = (mouseX / (rect.width / 2)) * 10 * intensity;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative transform-gpu transition-all duration-300 ${className}`}
      style={{
        perspective: "1000px",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        className={`relative bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden ${
          isHovered ? "shadow-2xl shadow-blue-500/25" : "shadow-lg"
        }`}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/5 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent rounded-2xl"
          initial={{ opacity: 0, transform: "translateX(-100%) translateY(-100%) rotate(45deg)" }}
          animate={{
            opacity: isHovered ? [0, 1, 0] : 0,
            transform: isHovered 
              ? "translateX(100%) translateY(100%) rotate(45deg)" 
              : "translateX(-100%) translateY(-100%) rotate(45deg)"
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        
        <div className="relative z-10">
          {children}
        </div>
        
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-blue-400/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default Card3D;