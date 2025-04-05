import Link from 'next/link';
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-text-dark text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* About */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">NextMed</h3>
            <p className="text-gray-300 mb-4">
              Providing advanced healthcare solutions with a focus on patient care and innovative medical practices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="text-gray-300 hover:text-white transition">
                  Our Doctors
                </Link>
              </li>
              <li>
                <Link href="/appointment" className="text-gray-300 hover:text-white transition">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-300 hover:text-white transition">
                  Health Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/general-medicine" className="text-gray-300 hover:text-white transition">
                  General Medicine
                </Link>
              </li>
              <li>
                <Link href="/services/cardiology" className="text-gray-300 hover:text-white transition">
                  Cardiology
                </Link>
              </li>
              <li>
                <Link href="/services/pediatrics" className="text-gray-300 hover:text-white transition">
                  Pediatrics
                </Link>
              </li>
              <li>
                <Link href="/services/neurology" className="text-gray-300 hover:text-white transition">
                  Neurology
                </Link>
              </li>
              <li>
                <Link href="/services/orthopedics" className="text-gray-300 hover:text-white transition">
                  Orthopedics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <FiMapPin className="mt-1 mr-3 text-primary" />
                <span className="text-gray-300">
                  123 Medical Center Drive,<br />Healthcare City, MED 12345
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-3 text-primary" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <FiMail className="mr-3 text-primary" />
                <span className="text-gray-300">contact@nextmed.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} NextMed. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 