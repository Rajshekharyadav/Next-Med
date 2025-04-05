"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/app/context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

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
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="bg-white shadow-navbar sticky top-0 z-50">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative h-10 w-40">
              <span className="text-2xl font-display font-bold text-primary">NextMed</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className="text-text-dark hover:text-primary font-medium transition duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons or User Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 text-text-dark hover:text-primary"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                    {user?.name.charAt(0)}
                  </div>
                  <span>{user?.name}</span>
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <FiUser className="mr-2" /> My Profile
                    </Link>
                    <Link 
                      href="/health-records" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Medical Records
                    </Link>
                    <Link 
                      href="/appointments" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Appointments
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/appointment" className="btn-primary">
                  Book Appointment
                </Link>
                <Link href="/login" className="btn-secondary">
                  Login
                </Link>
                <Link href="/signup" className="text-text-dark hover:text-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              className="text-text-dark p-2"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 mt-4 border-t">
            <nav className="flex flex-col space-y-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="text-text-dark hover:text-primary font-medium transition duration-200 px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center space-x-2 px-2 mb-4">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                        {user?.name.charAt(0)}
                      </div>
                      <span className="font-medium">{user?.name}</span>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center px-2 py-1 text-text-dark hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FiUser className="mr-2" /> My Profile
                    </Link>
                    <Link
                      href="/health-records"
                      className="px-2 py-1 text-text-dark hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Medical Records
                    </Link>
                    <Link
                      href="/appointments"
                      className="px-2 py-1 text-text-dark hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Appointments
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full text-left px-2 py-1 text-red-600 hover:text-red-700"
                    >
                      <FiLogOut className="mr-2" /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/appointment"
                    className="btn-primary mt-2 inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Book Appointment
                  </Link>
                  <Link
                    href="/login"
                    className="btn-secondary mt-2 inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="text-text-dark hover:text-primary px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
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