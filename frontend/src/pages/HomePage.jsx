import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import ServicesSection from '@/components/ServicesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import PricingSection from '@/components/PricingSection';
import AboutSection from '@/components/AboutSection';
import TrustSection from '@/components/TrustSection';
import ContactSection from '@/components/ContactSection';

const HomePage = () => {
  return (
    <main data-testid="home-page">
      <HeroSection />
      <ProblemSection />
      <ServicesSection />
      <HowItWorksSection />
      <PricingSection />
      <AboutSection />
      <TrustSection />
      <ContactSection />
    </main>
  );
};

export default HomePage;
