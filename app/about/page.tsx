"use client";
import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      
      {/* Hero Section */}
      <div className="relative z-10 backdrop-blur-sm bg-black/20 border-b border-white/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-blue-500/20 to-teal-500/20 backdrop-blur-sm mb-6">
            <div className="bg-black/40 rounded-full px-6 py-2">
              <span className="text-blue-400 font-medium">Healthcare Innovation</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white via-blue-100 to-teal-100 bg-clip-text text-transparent">
            About NextMed
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Revolutionizing healthcare through AI-powered solutions and personalized medical care for a healthier tomorrow.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 text-blue-400">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium uppercase tracking-wider">Our Mission</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Transforming Healthcare
                <span className="block text-transparent bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text">
                  Through Innovation
                </span>
              </h2>
            </div>
            
            <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
              <p>
                At NextMed, we're dedicated to making healthcare more accessible, efficient, and personalized through cutting-edge technology. Our mission is to bridge the gap between patients and quality healthcare services using AI-powered solutions.
              </p>
              <p>
                We believe that everyone deserves access to accurate medical information and professional healthcare services, regardless of their location or circumstances. Our platform combines the latest in artificial intelligence with human expertise to deliver exceptional care.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 text-blue-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>AI-Powered Diagnostics</span>
              </div>
              <div className="flex items-center space-x-2 text-teal-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>24/7 Healthcare Access</span>
              </div>
              <div className="flex items-center space-x-2 text-emerald-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Secure Health Records</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-3xl blur-xl"></div>
            <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-teal-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <Image
                  src="/images/our mission.jpg"
                  alt="Our Mission - NextMed Healthcare Innovation"
                  width={500}
                  height={400}
                  className="w-full h-80 object-cover rounded-2xl shadow-2xl"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-1">Healthcare Innovation</h3>
                    <p className="text-gray-300 text-sm">Empowering patients with AI-driven healthcare solutions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="relative z-10 backdrop-blur-sm bg-black/10 border-y border-white/10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 text-teal-400 mb-6">
              <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium uppercase tracking-wider">Core Values</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What Drives Us
              <span className="block text-transparent bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text">
                Forward
              </span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Our commitment to excellence is built on these fundamental principles that guide every decision we make.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors duration-300">Innovation</h3>
                  <p className="text-gray-300 leading-relaxed">We continuously push the boundaries of healthcare technology to provide cutting-edge solutions that transform patient care and medical outcomes.</p>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-teal-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-teal-500/20 to-teal-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-teal-400 transition-colors duration-300">Security</h3>
                  <p className="text-gray-300 leading-relaxed">We prioritize the security and privacy of your medical data above all else, implementing industry-leading encryption and compliance standards.</p>
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-emerald-400 transition-colors duration-300">Community</h3>
                  <p className="text-gray-300 leading-relaxed">We believe in building a strong healthcare community that supports and empowers patients, fostering connections between care providers and individuals.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 text-emerald-400 mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium uppercase tracking-wider">Leadership Team</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet Our
            <span className="block text-transparent bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text">
              Expert Team
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Passionate healthcare professionals and technology experts dedicated to transforming patient care.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-28 h-28 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-400/20">
                  <svg className="w-14 h-14 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors duration-300">Dr. Sarah Johnson</h3>
                <p className="text-blue-400 mb-4 font-medium">Chief Medical Officer</p>
                <p className="text-gray-300 leading-relaxed">20+ years of experience in healthcare technology and digital transformation initiatives</p>
                <div className="mt-6 flex justify-center space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-400/50 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-400/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-teal-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-28 h-28 bg-gradient-to-r from-teal-500/20 to-teal-600/20 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-teal-400/20">
                  <svg className="w-14 h-14 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-teal-400 transition-colors duration-300">Michael Chen</h3>
                <p className="text-teal-400 mb-4 font-medium">AI Technology Lead</p>
                <p className="text-gray-300 leading-relaxed">Expert in machine learning and healthcare applications with focus on diagnostic AI systems</p>
                <div className="mt-6 flex justify-center space-x-3">
                  <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-teal-400/50 rounded-full"></div>
                  <div className="w-2 h-2 bg-teal-400/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            <div className="relative backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-28 h-28 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-emerald-400/20">
                  <svg className="w-14 h-14 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors duration-300">Emily Rodriguez</h3>
                <p className="text-emerald-400 mb-4 font-medium">Patient Experience Director</p>
                <p className="text-gray-300 leading-relaxed">Dedicated to improving healthcare accessibility and patient satisfaction through innovative solutions</p>
                <div className="mt-6 flex justify-center space-x-3">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-emerald-400/50 rounded-full"></div>
                  <div className="w-2 h-2 bg-emerald-400/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call to Action Section */}
      <div className="relative z-10 backdrop-blur-sm bg-black/20 border-t border-white/10 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your
              <span className="block text-transparent bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text">
                Healthcare Experience?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed">
              Join thousands of patients who trust NextMed for their healthcare needs. Experience the future of medicine today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl font-semibold text-white hover:from-blue-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-teal-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <span className="relative">Get Started Today</span>
              </button>
              <button className="group relative px-8 py-4 backdrop-blur-sm bg-white/10 border border-white/20 rounded-xl font-semibold text-white hover:bg-white/20 transition-all duration-300">
                <span className="relative">Learn More</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}