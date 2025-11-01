"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiUser, FiMenu, FiX, FiChevronDown, FiActivity, FiFileText, FiCalendar, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/app/context/AuthContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Track scrolling to add shadow to navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isProfileDropdownOpen && !target.closest('.profile-dropdown-container')) {
        setIsProfileDropdownOpen(false);
      }
      
      // Close mobile menu when clicking outside
      if (isMenuOpen && !target.closest('.mobile-menu-container') && !target.closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen, isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Doctors', path: '/doctors' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 mx-4 mt-4`}>
      <div className={`container mx-auto px-4 py-3 backdrop-blur-md bg-white/70 rounded-2xl ${isScrolled ? 'shadow-lg' : 'shadow-md'} transition-all duration-300`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-40 flex items-center">
              <Image 
                src="/images/logo nextmed.png" 
                alt="NextMed Logo" 
                width={180} 
                height={50} 
                className="object-contain" 
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-base font-medium ${
                  pathname === item.path
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary transition-colors'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* AI Services Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-base font-medium text-gray-600 hover:text-primary transition-colors">
                AI Services <FiChevronDown className="ml-1" />
              </button>
              <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                <div className="py-1">
                  <Link href="/ai-diagnosis" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary">
                    AI Symptom Analysis
                  </Link>
                  <Link href="/blood-report-analysis" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-primary">
                    Blood Report Analysis
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative profile-dropdown-container">
                <button
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary"
                  onClick={toggleProfileDropdown}
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser />}
                  </div>
                  <span className="hidden lg:inline">{user?.name || 'User'}</span>
                  <FiChevronDown />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FiUser className="mr-2 inline" /> Profile
                      </Link>
                      <Link
                        href="/ai-diagnosis"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FiActivity className="mr-2 inline" /> AI Symptom Analysis
                      </Link>
                      <Link
                        href="/blood-report-analysis"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FiFileText className="mr-2 inline" /> Blood Report Analysis
                      </Link>
                      <Link
                        href="/health-records"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FiFileText className="mr-2 inline" /> Medical Records
                      </Link>
                      <Link
                        href="/appointments"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <FiCalendar className="mr-2 inline" /> My Appointments
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <FiLogOut className="mr-2 inline" /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/appointment" className="hidden md:inline-block bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md transition-colors">
                  Book Appointment
                </Link>
                <Link href="/login" className="hidden md:inline-block text-primary border border-primary hover:bg-primary/10 px-4 py-2 rounded-md transition-colors">
                  Login
                </Link>
                <Link href="/signup" className="hidden md:inline-block text-gray-600 hover:text-primary transition-colors">
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                className="text-gray-500 p-2 mobile-menu-button"
                onClick={toggleMenu}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 mobile-menu-container">
            <nav className="mt-2 space-y-2 px-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`block py-2 ${
                    pathname === item.path 
                      ? 'text-primary font-medium' 
                      : 'text-gray-600 hover:text-primary'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* AI Services Section in Mobile */}
              <div className="py-2">
                <div className="font-medium text-gray-800 mb-1">AI Services</div>
                <Link
                  href="/ai-diagnosis"
                  className="block pl-3 py-1 text-gray-600 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  AI Symptom Analysis
                </Link>
                <Link
                  href="/blood-report-analysis"
                  className="block pl-3 py-1 text-gray-600 hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Blood Report Analysis
                </Link>
              </div>

              {/* Profile Options for Mobile */}
              {isAuthenticated ? (
                <>
                  <div className="pt-2 border-t border-gray-200">
                    <Link
                      href="/profile"
                      className="flex items-center py-2 text-gray-600 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser className="mr-2" /> Profile
                    </Link>
                    <Link
                      href="/ai-diagnosis"
                      className="flex items-center py-2 text-gray-600 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiActivity className="mr-2" /> AI Symptom Analysis
                    </Link>
                    <Link
                      href="/health-records"
                      className="flex items-center py-2 text-gray-600 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiFileText className="mr-2" /> Medical Records
                    </Link>
                    <Link
                      href="/appointments"
                      className="flex items-center py-2 text-gray-600 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiCalendar className="mr-2" /> My Appointments
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full text-left py-2 text-red-600 hover:text-red-700"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                    <Link
                      href="/appointment"
                      className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-center transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Book Appointment
                    </Link>
                    <Link
                      href="/login"
                      className="text-primary border border-primary hover:bg-primary/10 px-4 py-2 rounded-md text-center transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="text-gray-600 hover:text-primary px-4 py-2 text-center transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
