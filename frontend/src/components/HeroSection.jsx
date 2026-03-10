import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_landlord-portal-17/artifacts/g2hvvylh_Logo.png";

const HeroSection = () => {
  const trustIndicators = [
    'Fixed Transparent Pricing',
    'No Markup on Contractors',
    'No Fixed-Term Contracts',
    'Property Redress Scheme Member',
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="hero" 
      data-testid="hero-section"
      className="relative min-h-screen bg-[#0A0A0A] flex items-center justify-center pt-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <img 
            src={LOGO_URL} 
            alt="Central Gate Estates" 
            className="h-32 md:h-40 w-auto mx-auto"
          />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-['Playfair_Display'] text-4xl sm:text-5xl md:text-7xl text-[#F5F0EB] mb-8 tracking-tight leading-tight"
        >
          London Property Management.<br />
          <span className="italic">Done Properly.</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-[#A3A3A3] text-base md:text-lg max-w-3xl mx-auto mb-12 font-light leading-relaxed"
        >
          Central Gate Estates offers London landlords transparent pricing, zero hidden fees, 
          and fully automated property management — so you never have to chase an agent again.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <button
            data-testid="hero-cta-consultation"
            onClick={() => scrollToSection('contact')}
            className="w-full sm:w-auto bg-[#F5F0EB] text-[#0A0A0A] px-10 py-4 text-sm tracking-[0.15em] font-medium hover:bg-white transition-all duration-300"
          >
            GET A FREE CONSULTATION
          </button>
          <button
            data-testid="hero-cta-pricing"
            onClick={() => scrollToSection('pricing')}
            className="w-full sm:w-auto border border-[#FFFFFF] text-[#FFFFFF] px-10 py-4 text-sm tracking-[0.15em] font-medium hover:bg-[#FFFFFF] hover:text-[#0A0A0A] transition-all duration-300"
          >
            VIEW OUR PRICING
          </button>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-4"
        >
          {trustIndicators.map((indicator, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 text-[#A3A3A3]"
            >
              <Check className="w-4 h-4 stroke-1 text-[#F5F0EB]" />
              <span className="text-xs tracking-wide font-light">{indicator}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Subtle gradient at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
