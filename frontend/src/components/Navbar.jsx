import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_landlord-portal-17/artifacts/g2hvvylh_Logo.png";

const navLinks = [
  { name: 'HOME', href: '/', section: 'hero' },
  { name: 'SERVICES', href: '/#services', section: 'services' },
  { name: 'ABOUT', href: '/#about', section: 'about' },
  { name: 'PRICING', href: '/#pricing', section: 'pricing' },
  { name: 'HOW IT WORKS', href: '/#how-it-works', section: 'how-it-works' },
  { name: 'PROPERTIES', href: '/properties', section: null },
  { name: 'CONTACT', href: '/#contact', section: 'contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, link) => {
    setMobileMenuOpen(false);
    
    if (link.section && location.pathname === '/') {
      e.preventDefault();
      const element = document.getElementById(link.section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (link.section && location.pathname !== '/') {
      // Will navigate to home, then scroll
    }
  };

  return (
    <nav 
      data-testid="navbar"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#333333]' : 'bg-[#0A0A0A] border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" data-testid="logo-link" className="flex-shrink-0">
            <img 
              src={LOGO_URL} 
              alt="Central Gate Estates" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                data-testid={`nav-link-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={(e) => handleNavClick(e, link)}
                className="nav-link text-[#F5F0EB] hover:text-white text-xs tracking-[0.2em] font-light transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:block">
            <Link
              to="/#contact"
              data-testid="nav-cta-button"
              onClick={(e) => handleNavClick(e, { section: 'contact' })}
              className="border border-[#F5F0EB] text-[#F5F0EB] hover:bg-[#F5F0EB] hover:text-[#0A0A0A] px-6 py-3 text-xs tracking-[0.15em] font-medium transition-all duration-300"
            >
              LIST YOUR PROPERTY
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            data-testid="mobile-menu-button"
            className="lg:hidden text-[#F5F0EB] p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6 stroke-1" /> : <Menu className="w-6 h-6 stroke-1" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        data-testid="mobile-menu"
        className={`lg:hidden transition-all duration-300 overflow-hidden ${
          mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="bg-[#0A0A0A] border-t border-[#333333] px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              data-testid={`mobile-nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={(e) => handleNavClick(e, link)}
              className="block text-[#F5F0EB] hover:text-white text-sm tracking-[0.15em] font-light py-2"
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/#contact"
            data-testid="mobile-cta-button"
            onClick={(e) => handleNavClick(e, { section: 'contact' })}
            className="block text-center border border-[#F5F0EB] text-[#F5F0EB] hover:bg-[#F5F0EB] hover:text-[#0A0A0A] px-6 py-3 text-xs tracking-[0.15em] font-medium transition-all duration-300 mt-4"
          >
            LIST YOUR PROPERTY
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
