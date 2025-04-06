import Link from 'next/link';
// import Image from 'next/image';
// import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
// import BlogPreview from '@/components/home/BlogPreview';

// New components
import AIDiagnosticsSection from '@/components/home/AIDiagnosticsSection';
import HealthRecordsSection from '@/components/home/HealthRecordsSection';
import DoctorsSectionEnhanced from '@/components/home/DoctorsSectionEnhanced';
import GeminiFeatureSection from '@/components/home/GeminiFeatureSection';
import BloodReportFeatureSection from '@/components/home/BloodReportFeatureSection';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 overflow-hidden">
          {/* Hero content - DO NOT insert <HeroSection /> here */}
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative z-10">
                <div className="absolute -left-32 -top-32 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-indigo-300/20 rounded-full blur-3xl"></div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  Advanced Healthcare with <span className="text-primary relative z-10">AI Technology</span>
                </h1>
                <p className="text-lg text-gray-700 mb-8 max-w-lg">
                  Experience next-generation healthcare with AI-powered diagnostics, skin analysis, blood report interpretation, and personalized consultations - all from the comfort of your home.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <Link href="#skin-vision" className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Try Sikn Vision
                  </Link>
                  <Link href="/ai-diagnosis" className="bg-white hover:bg-gray-50 text-primary border border-primary px-6 py-3 rounded-md font-medium transition-colors flex items-center justify-center">
                    <img 
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s" 
                      alt="Gemini AI" 
                      className="h-5 w-5 mr-2 rounded-full"
                    />
                    Try AI Diagnosis with Gemini
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <Link href="/blood-report-analysis" className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center group">
                    <svg className="h-5 w-5 mr-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Analyze Your Blood Report
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -right-32 -top-32 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl"></div>
                <div className="bg-gradient-to-br from-white/60 to-white/90 backdrop-blur-sm shadow-lg rounded-2xl overflow-hidden p-6 h-96 border border-white/20 relative z-10">
                  <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 w-full h-full opacity-70">
                      {/* SVG illustration instead of external image */}
                      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path fill="#4F46E5" d="M43.2,-57.2C55.9,-45.1,66.2,-31.5,71.6,-15.7C77,0.2,77.5,18.3,70.1,32.3C62.7,46.3,47.2,56.3,31.2,62.5C15.2,68.8,-1.3,71.2,-18.1,68.1C-34.9,65,-52,56.3,-62.6,42.1C-73.2,27.9,-77.5,8.1,-75,-10.4C-72.5,-29,-63.2,-46.4,-49.5,-58.6C-35.8,-70.8,-17.9,-77.8,-0.9,-76.7C16.1,-75.6,30.5,-69.3,43.2,-57.2Z" transform="translate(100 100)" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-32 h-32 text-white">
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                        <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                        <path d="M9 14h.01"></path>
                        <path d="M12 14h.01"></path>
                        <path d="M15 14h.01"></path>
                        <path d="M9 18h.01"></path>
                        <path d="M12 18h.01"></path>
                        <path d="M15 18h.01"></path>
                        <path d="M12 6l0 4"></path>
                        <path d="M9 10h6"></path>
                      </svg>
                    </div>
                    <div className="absolute bottom-0 right-0 w-full h-2/3 flex items-end">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
                        <path fill="#ffffff" fillOpacity="0.4" d="M0,192L48,197.3C96,203,192,213,288,202.7C384,192,480,160,576,170.7C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                      </svg>
                    </div>
                    <div className="absolute top-4 left-4 bg-white rounded-full p-3 shadow-md z-10">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-primary">
                        <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4">
            <p className="text-gray-500 text-center text-sm uppercase font-medium mb-6">Trusted by leading healthcare providers</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
              <div className="w-24 h-12 flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <svg className="w-full h-8" viewBox="0 0 100 40" fill="none">
                  <rect width="100" height="40" rx="4" fill="#0057B8" />
                  <path d="M20 10H35C37.7614 10 40 12.2386 40 15V25C40 27.7614 37.7614 30 35 30H20V10Z" fill="white" />
                  <path d="M50 15H65C67.7614 15 70 17.2386 70 20V25C70 27.7614 67.7614 30 65 30H50V15Z" fill="white" />
                  <path d="M80 10H85C87.7614 10 90 12.2386 90 15V25C90 27.7614 87.7614 30 85 30H80V10Z" fill="white" />
                </svg>
              </div>
              <div className="w-24 h-12 flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <svg className="w-full h-8" viewBox="0 0 100 40" fill="none">
                  <path d="M15 10H30C32.7614 10 35 12.2386 35 15V25C35 27.7614 32.7614 30 30 30H15V10Z" fill="#FF4500" />
                  <path d="M45 15H85C87.7614 15 90 17.2386 90 20V25C90 27.7614 87.7614 30 85 30H45V15Z" fill="#FF4500" />
                </svg>
              </div>
              <div className="w-24 h-12 flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <svg className="w-full h-8" viewBox="0 0 100 40" fill="none">
                  <circle cx="20" cy="20" r="10" fill="#4285F4" />
                  <circle cx="50" cy="20" r="10" fill="#34A853" />
                  <circle cx="80" cy="20" r="10" fill="#EA4335" />
                </svg>
              </div>
              <div className="w-24 h-12 flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <svg className="w-full h-8" viewBox="0 0 100 40" fill="none">
                  <rect x="15" y="10" width="70" height="20" rx="10" fill="#0077B5" />
                </svg>
              </div>
              <div className="w-24 h-12 flex items-center justify-center grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all">
                <svg className="w-full h-8" viewBox="0 0 100 40" fill="none">
                  <path d="M50 10L90 30H10L50 10Z" fill="#1DA1F2" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Gemini AI Feature Section */}
        {typeof GeminiFeatureSection === 'function' && <GeminiFeatureSection />}

        {/* Blood Report Analysis Feature Section */}
        {typeof BloodReportFeatureSection === 'function' && <BloodReportFeatureSection />}

        {/* AI Diagnostics Section */}
        {typeof AIDiagnosticsSection === 'function' && <AIDiagnosticsSection />}

        {/* Health Records Section */}
        {typeof HealthRecordsSection === 'function' && <HealthRecordsSection />}

        {/* Doctor Consultations Section */}
        {typeof DoctorsSectionEnhanced === 'function' && <DoctorsSectionEnhanced />}

        {/* Features Section */}
        {typeof FeaturesSection === 'function' && <FeaturesSection />}

        {/* CTA Section */}
        {typeof CTASection === 'function' && <CTASection />}
      </main>

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">NextMed</h3>
              <p className="text-gray-300 mb-4">
                Providing advanced healthcare solutions with a focus on patient care and innovative AI technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.1 10.1 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/ai-diagnosis" className="text-gray-300 hover:text-white transition-colors">AI Diagnosis with Gemini</a></li>
                <li><a href="/blood-report-analysis" className="text-gray-300 hover:text-white transition-colors">Blood Report Analysis</a></li>
                <li><a href="#doctors" className="text-gray-300 hover:text-white transition-colors">Our Doctors</a></li>
                <li><a href="#health-records" className="text-gray-300 hover:text-white transition-colors">Health Records</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Our Services</h3>
              <ul className="space-y-2">
                <li><a href="/ai-diagnosis" className="text-gray-300 hover:text-white transition-colors">AI Symptom Analysis with Gemini</a></li>
                <li><a href="#ai-diagnostics" className="text-gray-300 hover:text-white transition-colors">AI Skin Analysis</a></li>
                <li><a href="/blood-report-analysis" className="text-gray-300 hover:text-white transition-colors">Blood Report Analysis</a></li>
                <li><a href="#doctors" className="text-gray-300 hover:text-white transition-colors">Doctor Consultations</a></li>
                <li><a href="#health-records" className="text-gray-300 hover:text-white transition-colors">Health Record Management</a></li>
                <li><a href="#doctors" className="text-gray-300 hover:text-white transition-colors">Prescription Services</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <address className="text-gray-300 not-italic">
                123 Medical Center Drive<br />
                Healthcare City, MED 12345<br /><br />
                <a href="tel:+15551234567" className="hover:text-white transition-colors">+1 (555) 123-4567</a><br />
                <a href="mailto:contact@nextmed.com" className="hover:text-white transition-colors">contact@nextmed.com</a>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} NextMed. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}