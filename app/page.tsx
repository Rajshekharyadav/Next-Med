"use client";

import FeaturesSection from '@/components/home/FeaturesSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';
import AIDiagnosticsSection from '@/components/home/AIDiagnosticsSection';
import HealthRecordsSection from '@/components/home/HealthRecordsSection';
import DoctorsSectionEnhanced from '@/components/home/DoctorsSectionEnhanced';
import GeminiFeatureSection from '@/components/home/GeminiFeatureSection';
import BloodReportFeatureSection from '@/components/home/BloodReportFeatureSection';
import SkinVisionFeatureSection from '@/components/home/SkinVisionFeatureSection';
import HomeHero from '@/components/home/HomeHero';
import TrustedBySection from '@/components/home/TrustedBySection';
import AnimatedSection from '@/components/home/AnimatedSection';
import AnimatedFooter from '@/components/home/AnimatedFooter';
import HealthBenefitsSection from '@/components/home/HealthBenefitsSection';
import { ArcadeEmbed } from '@/components/home/ArcadeEmbed';

// Enhanced 3D Components
import SimpleEnhanced3DHero from '@/components/home/SimpleEnhanced3DHero';
import EnhancedFeatures from '@/components/home/EnhancedFeatures';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black/80 via-black/60 to-black/80">
      <main className="flex-grow backdrop-blur-sm">
        {/* Enhanced 3D Hero Section */}
        <SimpleEnhanced3DHero />
        
        {/* Arcade Demo Section */}
        <AnimatedSection>
          <div className="py-16 px-4">
            <div className="container mx-auto max-w-6xl">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  See NextMed in Action
                </h2>
                <p className="text-white/80 max-w-2xl mx-auto">
                  Watch our interactive demo to see how easy it is to use AI diagnosis and book doctor appointments
                </p>
              </div>
              <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 border border-white/10">
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

        {/* AI Diagnostics Section */}
        {typeof AIDiagnosticsSection === 'function' && (
          <AnimatedSection delay={0.3}>
            <AIDiagnosticsSection />
          </AnimatedSection>
        )}

        {/* Health Records Section */}
        {typeof HealthRecordsSection === 'function' && (
          <AnimatedSection delay={0.4}>
            <HealthRecordsSection />
          </AnimatedSection>
        )}

        {/* Doctor Consultations Section */}
        {typeof DoctorsSectionEnhanced === 'function' && (
          <AnimatedSection delay={0.5}>
            <DoctorsSectionEnhanced />
          </AnimatedSection>
        )}

        {/* Enhanced Features Section */}
        <EnhancedFeatures />

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