import Link from 'next/link';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-blue-50 to-blue-100 overflow-hidden relative">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <img 
                src="https://storage.googleapis.com/gweb-uniblog-publish-prod/images/gemini-advanced.max-1200x1200.jpg" 
                alt="Gemini" 
                className="h-4 w-4 mr-2"
              />
              <span>New: AI Symptom Analysis with Gemini</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-text-dark leading-tight mb-6">
              Advanced Healthcare for a{' '}
              <span className="text-primary">Better Life</span>
            </h1>
            <p className="text-lg text-text-light mb-8">
              Connect with top-rated doctors, book appointments, and get expert medical advice from the comfort of your home. NextMed is revolutionizing healthcare access with AI-powered diagnostics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/appointment" className="btn-primary flex items-center justify-center gap-2">
                Try Skin Vision
              </Link>
              <Link href="/ai-diagnosis" className="btn-secondary flex items-center justify-center gap-2">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s" 
                  alt="Gemini" 
                  className="h-4 w-4 mr-1"
                />
                Try AI Diagnosis
              </Link>
            </div>
            <div className="mt-10 flex items-center">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((id) => (
                  <div key={id} className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-300 to-blue-500" />
                  </div>
                ))}
              </div>
              <div className="ml-4">
                <div className="font-medium text-primary">500+ Doctors</div>
                <div className="text-sm text-text-light">Trusted by thousands</div>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent z-10" />
            <div className="relative h-full w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-400">
                <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
                  Doctor Image Placeholder
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block absolute top-20 right-20 w-16 h-16 rounded-full bg-accent/20 animate-pulse"></div>
      <div className="hidden lg:block absolute bottom-20 left-20 w-24 h-24 rounded-full bg-primary/10 animate-pulse"></div>
    </section>
  );
};

export default HeroSection; 