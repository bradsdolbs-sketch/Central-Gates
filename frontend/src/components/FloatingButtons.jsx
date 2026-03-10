import { useState, useEffect } from 'react';
import { MessageCircle, Calendar } from 'lucide-react';

const FloatingButtons = () => {
  const [showStickyCTA, setShowStickyCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past hero section
      setShowStickyCTA(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Sticky CTA Button */}
      <button
        data-testid="sticky-cta-button"
        onClick={scrollToContact}
        className={`fixed bottom-8 right-24 z-40 bg-[#F5F0EB] text-[#0A0A0A] px-6 py-4 text-xs tracking-[0.1em] font-medium shadow-2xl transition-all duration-500 flex items-center space-x-2 hover:bg-white ${
          showStickyCTA ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <Calendar className="w-4 h-4 stroke-2" />
        <span>GET A FREE CONSULTATION</span>
      </button>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/447000000000?text=Hello%20Central%20Gate%20Estates%2C%20I%27m%20interested%20in%20your%20property%20management%20services."
        target="_blank"
        rel="noopener noreferrer"
        data-testid="whatsapp-button"
        className="fixed bottom-8 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-lg transition-all duration-300 whatsapp-pulse"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </a>
    </>
  );
};

export default FloatingButtons;
