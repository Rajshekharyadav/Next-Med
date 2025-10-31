"use client";

import { motion } from 'framer-motion';

const stats = [
  { number: "10K+", label: "Patients Served", icon: "👥" },
  { number: "95%", label: "Accuracy Rate", icon: "🎯" },
  { number: "24/7", label: "Support Available", icon: "⏰" },
  { number: "500+", label: "Expert Doctors", icon: "👨‍⚕️" }
];

const FloatingStats = () => {
  return (
    <section className="relative py-16 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 bg-blue-300/20 rounded-full blur-2xl"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-40 h-40 bg-purple-300/20 rounded-full blur-2xl"
          animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Trusted by <span className="text-gradient">Thousands</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our growing community of satisfied patients who trust NextMed for their healthcare needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50">
                <motion.div 
                  className="text-4xl mb-3"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div 
                  className="text-3xl font-bold text-gray-800 mb-2"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
                
                {/* Floating particles */}
                <motion.div
                  className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full opacity-60"
                  animate={{ y: [-5, 5, -5], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FloatingStats;