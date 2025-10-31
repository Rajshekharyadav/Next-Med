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

// Enhanced 3D Components
import SimpleEnhanced3DHero from '@/components/home/SimpleEnhanced3DHero';
import EnhancedFeatures from '@/components/home/EnhancedFeatures';
import FloatingStats from '@/components/home/FloatingStats';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Enhanced 3D Hero Section */}
        <SimpleEnhanced3DHero />

        {/* Floating Stats Section */}
        <FloatingStats />
        
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