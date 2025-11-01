"use client";

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import AnimatedSection from '@/components/home/AnimatedSection';

// Import lightweight components directly
import SimpleEnhanced3DHero from '@/components/home/SimpleEnhanced3DHero';
import HealthBenefitsSection from '@/components/home/HealthBenefitsSection';

// Lazy load heavier components
const ArcadeEmbed = dynamic(() => import('@/components/home/ArcadeEmbed').then(mod => ({ default: mod.ArcadeEmbed })), { 
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-800/50 animate-pulse rounded-xl"></div>
});

const EnhancedFeatures = dynamic(() => import('@/components/home/EnhancedFeatures'), { 
  loading: () => <div className="w-full h-64 bg-gray-800/50 animate-pulse rounded-xl"></div>
});

const SkinVisionFeatureSection = dynamic(() => import('@/components/home/SkinVisionFeatureSection'), { 
  loading: () => <div className="w-full h-64 bg-gray-800/50 animate-pulse rounded-xl"></div>
});

const GeminiFeatureSection = dynamic(() => import('@/components/home/GeminiFeatureSection'), { 
  loading: () => <div className="w-full h-64 bg-gray-800/50 animate-pulse rounded-xl"></div>
});

const BloodReportFeatureSection = dynamic(() => import('@/components/home/BloodReportFeatureSection'), { 
  loading: () => <div className="w-full h-64 bg-gray-800/50 animate-pulse rounded-xl"></div>
});

const AIDiagnosticsSection = dynamic(() => import('@/components/home/AIDiagnosticsSection'), { 
  loading: () => <div className="w-full h-64 bg-gray-800/50 animate-pulse rounded-xl"></div>
});

const HealthRecordsSection = dynamic(() => import('@/components/home/HealthRecordsSection'), { 
  loading: () => <div className="w-full h-64 bg-gray-800/50 animate-pulse rounded-xl"></div>
});

const DoctorsSectionEnhanced = dynamic(() => import('@/components/home/DoctorsSectionEnhanced'), { 
  loading: () => <div className="w-full h-64 bg-gray-800/50 animate-pulse rounded-xl"></div>
});

const TestimonialsSection = dynamic(() => import('@/components/home/TestimonialsSection'), { 
  loading: () => <div className="w-full h-64 bg-gray-800/50 animate-pulse rounded-xl"></div>
});

const CTASection = dynamic(() => import('@/components/home/CTASection'), { 
  loading: () => <div className="w-full h-64 bg-gray-800/50 animate-pulse rounded-xl"></div>
});

const AnimatedFooter = dynamic(() => import('@/components/home/AnimatedFooter'), { 
  loading: () => <div className="w-full h-64 bg-gray-800/50 animate-pulse rounded-xl"></div>
});

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black/80 via-black/60 to-black/80">
      <main className="flex-grow backdrop-blur-sm">
        {/* Enhanced 3D Hero Section */}
        <SimpleEnhanced3DHero />
        
        {/* Arcade Demo Section */}
        <AnimatedSection>
          <div className="">
            <div className="container mx-auto max-w-6xl">
              <div className="bg-black/30 backdrop-blur-md  p-6 border border-white/10">
                <ArcadeEmbed />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Health Benefits Section */}
        <AnimatedSection>
          <HealthBenefitsSection />
        </AnimatedSection>

        {/* Skin Vision Feature Section */}
        {typeof SkinVisionFeatureSection === 'function' && (
          <AnimatedSection>
            <SkinVisionFeatureSection />
          </AnimatedSection>
        )}

        {/* Gemini AI Feature Section */}
        {typeof GeminiFeatureSection === 'function' && (
          <AnimatedSection delay={0.1}>
            <GeminiFeatureSection />
          </AnimatedSection>
        )}

        {/* Blood Report Analysis Feature Section */}
        {typeof BloodReportFeatureSection === 'function' && (
          <AnimatedSection delay={0.2}>
            <BloodReportFeatureSection />
          </AnimatedSection>
        )}

        {/* AI Diagnostics Section - Removed as requested */}

        {/* Health Records Section */}
        {typeof HealthRecordsSection === 'function' && (
          <AnimatedSection delay={0.4}>
            <HealthRecordsSection />
          </AnimatedSection>
        )}

        {/* Doctors Section - Removed as requested */}

        {/* Enhanced Features Section - Removed as requested */}

        {/* Testimonials Section */}
        {typeof TestimonialsSection === 'function' && (
          <AnimatedSection delay={0.6}>
            <TestimonialsSection />
          </AnimatedSection>
        )}

        {/* CTA Section */}
        {typeof CTASection === 'function' && (
          <AnimatedSection delay={0.8}>
            <CTASection />
          </AnimatedSection>
        )}
      </main>

      <AnimatedFooter />
    </div>
  );
}