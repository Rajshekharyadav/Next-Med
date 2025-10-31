"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiUser, FiMenu, FiX, FiChevronDown, FiFileText, FiCalendar, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/app/context/AuthContext';

const EnhancedHeader = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-transparent backdrop-blur-md sticky top-0 w-full">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21a48.25 48.25 0 0 1-8.135-.687c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-black">NextMed</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  pathname === item.path 
                    ? 'text-black bg-white/20 shadow-lg' 
                    : 'text-black hover:text-blue-600 hover:bg-white/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="relative group">
              <button className="flex items-center text-black hover:text-blue-600 hover:bg-white/10 font-medium px-4 py-2 rounded-lg transition-all duration-300">
                AI Services 
                <FiChevronDown className="ml-1 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute left-0 top-full mt-1 w-56 rounded-xl shadow-2xl bg-white/90 backdrop-blur-md border border-gray-200 z-[9999] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-0">
                <div className="py-3">
                  <Link href="/ai-diagnosis" className="block px-4 py-3 text-sm text-black hover:bg-white/10 hover:text-blue-600 rounded-lg mx-2 transition-all duration-200">
                    AI Symptom Analysis
                  </Link>
                  <Link href="/blood-report-analysis" className="block px-4 py-3 text-sm text-black hover:bg-white/10 hover:text-blue-600 rounded-lg mx-2 transition-all duration-200">
                    Blood Report Analysis
                  </Link>
                  <Link href="/skin-vision" className="block px-4 py-3 text-sm text-black hover:bg-white/10 hover:text-blue-600 rounded-lg mx-2 transition-all duration-200">
                    Skin Vision AI
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-2 text-black hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                  </div>
                  <span className="hidden lg:inline font-medium">{user?.name || 'User'}</span>
                  <FiChevronDown className="transition-transform" />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-56 rounded-xl shadow-2xl bg-white/90 backdrop-blur-md border border-gray-200 z-[9999] transform translate-y-0">
                    <div className="py-3">
                      <Link href="/dashboard" className="flex items-center px-4 py-3 text-sm text-black hover:bg-white/10 hover:text-blue-600 rounded-lg mx-2 transition-all duration-200">
                        <FiUser className="mr-3" /> Dashboard
                      </Link>
                      <Link href="/health-records" className="flex items-center px-4 py-3 text-sm text-black hover:bg-white/10 hover:text-blue-600 rounded-lg mx-2 transition-all duration-200">
                        <FiFileText className="mr-3" /> Health Records
                      </Link>
                      <Link href="/appointment" className="flex items-center px-4 py-3 text-sm text-black hover:bg-white/10 hover:text-blue-600 rounded-lg mx-2 transition-all duration-200">
                        <FiCalendar className="mr-3" /> Appointments
                      </Link>
                      <button
                        onClick={() => { logout(); setIsProfileDropdownOpen(false); }}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 rounded-lg mx-2 transition-all duration-200"
                      >
                        <FiLogOut className="mr-3" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/appointment" className="hidden md:inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300">
                  Book Appointment
                </Link>
                <Link href="/login" className="hidden md:inline-block text-black border-2 border-gray-300 px-6 py-2.5 rounded-xl font-medium hover:bg-white/10 hover:border-gray-400 transition-all duration-300">
                  Login
                </Link>
              </>
            )}

            <button
              className="md:hidden text-black hover:text-blue-600 p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="mt-4 space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block py-2 px-4 rounded-lg transition-all duration-300 ${
                    pathname === item.path 
                      ? 'text-black bg-white/20 shadow-lg' 
                      : 'text-black hover:text-blue-600 hover:bg-white/10'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-2 border-t border-gray-200 mt-4">
                <div className="font-medium text-black mb-2 px-4">AI Services</div>
                <Link href="/ai-diagnosis" className="block py-2 px-6 text-black hover:text-blue-600 hover:bg-white/10 rounded-lg transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                  AI Symptom Analysis
                </Link>
                <Link href="/blood-report-analysis" className="block py-2 px-6 text-black hover:text-blue-600 hover:bg-white/10 rounded-lg transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                  Blood Report Analysis
                </Link>
              </div>

              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link href="/appointment" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-xl text-center font-medium shadow-lg transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                    Book Appointment
                  </Link>
                  <Link href="/login" className="text-black border-2 border-gray-300 px-4 py-2 rounded-xl text-center font-medium hover:bg-white/10 transition-all duration-300" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default EnhancedHeader;