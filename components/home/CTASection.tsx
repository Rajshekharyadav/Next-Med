import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

const CTASection = () => {
  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl overflow-hidden shadow-lg">
          <div className="px-8 py-16 md:p-16 text-white relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6">
                Get Started with NextMed Today
              </h2>
              <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
                Join thousands of patients who trust NextMed for their healthcare needs. Experience the future of healthcare now.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/appointment"
                  className="bg-white text-primary px-8 py-3 rounded-md font-semibold shadow-sm hover:bg-opacity-90 transition duration-300"
                >
                  Book an Appointment
                </Link>
                <Link
                  href="/about"
                  className="border border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white hover:bg-opacity-10 transition duration-300 flex items-center justify-center"
                >
                  Learn More
                  <FiArrowRight className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-400 opacity-20 -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-400 opacity-20 translate-y-1/2 -translate-x-1/3"></div>
        </div>
      </div>
    </section>
  );
};

export default CTASection; 