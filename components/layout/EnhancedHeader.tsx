"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiUser, FiMenu, FiX, FiChevronDown, FiActivity, FiFileText, FiCalendar, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/app/context/AuthContext';
import { motion } from 'framer-motion';

const EnhancedHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <motion.header 
      className={`bg-white/90 backdrop-blur-md ${isScrolled ? 'shadow-xl border-b border-white/20' : ''} sticky top-0 z-50 transition-all duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative h-10 w-40 flex items-center">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-2"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.25 48.25 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </motion.div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">NextMed</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {menuItems.map((item) => (
              <motion.div key={item.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={item.path}
                  className={`relative text-base font-medium px-4 py-2 transition-all duration-300 ${
                    pathname === item.path
                      ? 'text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-1 after:bg-gradient-to-r after:from-blue-600 after:to-purple-600 after:rounded-full after:shadow-lg'
                      : 'text-gray-600 hover:text-blue-600 hover:after:absolute hover:after:bottom-0 hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:w-4 hover:after:h-0.5 hover:after:bg-blue-300 hover:after:rounded-full hover:after:transition-all hover:after:duration-300'
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
            
            {/* AI Services Dropdown */}
            <div className="relative group">
              <motion.button 
                className="flex items-center text-base font-medium text-gray-600 hover:text-blue-600 px-4 py-2 rounded-xl hover:bg-blue-50 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
              >
                AI Services 
                <motion.div
                  animate={{ rotate: 0 }}
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <FiChevronDown className="ml-1" />
                </motion.div>
              </motion.button>
              <motion.div 
                className="absolute left-0 mt-2 w-56 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-md border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                initial={{ opacity: 0, y: -10 }}
                whileHover={{ opacity: 1, y: 0 }}
              >
                <div className="py-2">
                  <Link href="/ai-diagnosis" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl mx-2 my-1">
                    🧠 AI Symptom Analysis
                  </Link>
                  <Link href="/blood-report-analysis" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl mx-2 my-1">
                    🩸 Blood Report Analysis
                  </Link>
                  <Link href="/skin-vision" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl mx-2 my-1">
                    📷 Skin Vision AI
                  </Link>
                </div>
              </motion.div>
            </div>
          </nav>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-xl hover:bg-blue-50 transition-all duration-300"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                  </div>
                  <span className="hidden lg:inline font-medium">{user?.name || 'User'}</span>
                  <FiChevronDown />
                </motion.button>

                {isProfileDropdownOpen && (
                  <motion.div 
                    className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl bg-white/95 backdrop-blur-md border border-white/20"
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="py-2">
                      <Link href="/dashboard" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl mx-2 my-1">
                        <FiUser className="mr-3" /> Dashboard
                      </Link>
                      <Link href="/health-records" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl mx-2 my-1">
                        <FiFileText className="mr-3" /> Health Records
                      </Link>
                      <Link href="/appointment" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all duration-200 rounded-xl mx-2 my-1">
                        <FiCalendar className="mr-3" /> Appointments
                      </Link>
                      <button
                        onClick={() => { logout(); setIsProfileDropdownOpen(false); }}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 rounded-xl mx-2 my-1"
                      >
                        <FiLogOut className="mr-3" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/appointment" className="hidden md:inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                    📅 Book Appointment
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/login" className="hidden md:inline-block text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white px-6 py-2.5 rounded-xl font-medium transition-all duration-300">
                    Login
                  </Link>
                </motion.div>
              </>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden text-gray-600 p-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden mt-4 pb-4 border-t border-gray-200/50"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <nav className="mt-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block py-3 px-4 rounded-xl transition-all duration-300 ${
                    pathname === item.path 
                      ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-2 border-t border-gray-200/50 mt-4">
                <div className="font-medium text-gray-800 mb-2 px-4">AI Services</div>
                <Link href="/ai-diagnosis" className="block py-2 px-6 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                  🧠 AI Symptom Analysis
                </Link>
                <Link href="/blood-report-analysis" className="block py-2 px-6 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                  🩸 Blood Report Analysis
                </Link>
              </div>

              {!isAuthenticated && (
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200/50">
                  <Link href="/appointment" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-center font-medium shadow-lg transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                    📅 Book Appointment
                  </Link>
                  <Link href="/login" className="text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-xl text-center font-medium transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default EnhancedHeader;