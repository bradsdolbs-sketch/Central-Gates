import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_landlord-portal-17/artifacts/g2hvvylh_Logo.png";

const Footer = () => {
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/#services' },
    { name: 'About', href: '/#about' },
    { name: 'Pricing', href: '/#pricing' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Properties', href: '/properties' },
    { name: 'Contact', href: '/#contact' },
  ];

  return (
    <footer data-testid="footer" className="bg-[#0A0A0A] border-t border-[#333333]">
      {/* Large CTA Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 text-center">
        <h2 className="font-['Playfair_Display'] text-5xl md:text-7xl text-[#F5F0EB] mb-6">
          Let's Talk
        </h2>
        <p className="text-[#A3A3A3] text-lg mb-8 max-w-2xl mx-auto font-light">
          Ready to experience property management done properly?
        </p>
        <a
          href="/#contact"
          data-testid="footer-cta"
          className="inline-block bg-[#F5F0EB] text-[#0A0A0A] px-10 py-4 text-sm tracking-[0.15em] font-medium hover:bg-white transition-all duration-300"
        >
          GET A FREE CONSULTATION
        </a>
      </div>

      {/* Main Footer */}
      <div className="border-t border-[#333333]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Logo & Tagline */}
            <div className="md:col-span-2">
              <img 
                src={LOGO_URL} 
                alt="Central Gate Estates" 
                className="h-16 w-auto mb-6"
              />
              <p className="text-[#A3A3A3] font-light mb-6">
                Central Gate Estates — London Lettings & Property Management
              </p>
              {/* Social Links */}
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com/centralgatestates"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="footer-instagram"
                  className="text-[#A3A3A3] hover:text-[#F5F0EB] transition-colors"
                >
                  <Instagram className="w-5 h-5 stroke-1" />
                </a>
                <a
                  href="https://facebook.com/centralgateestates"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="footer-facebook"
                  className="text-[#A3A3A3] hover:text-[#F5F0EB] transition-colors"
                >
                  <Facebook className="w-5 h-5 stroke-1" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-[#F5F0EB] text-xs tracking-[0.2em] mb-6">QUICK LINKS</h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-[#A3A3A3] hover:text-[#F5F0EB] text-sm font-light transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Accreditations */}
            <div>
              <h4 className="text-[#F5F0EB] text-xs tracking-[0.2em] mb-6">ACCREDITATIONS</h4>
              <ul className="space-y-3 text-[#A3A3A3] text-sm font-light">
                <li>Property Redress Scheme</li>
                <li>Tenancy Deposit Scheme (TDS)</li>
                <li>Fully Insured Agency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#333333]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#A3A3A3] text-xs font-light">
              © 2025 Central Gate Estates. All rights reserved. Member of the Property Redress Scheme.
            </p>
            <div className="flex space-x-6 text-[#A3A3A3] text-xs font-light">
              <a href="#" className="hover:text-[#F5F0EB] transition-colors">Terms & Conditions</a>
              <a href="#" className="hover:text-[#F5F0EB] transition-colors">Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
