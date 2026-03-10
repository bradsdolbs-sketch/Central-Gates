import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import ServicesSection from '@/components/ServicesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import PricingSection from '@/components/PricingSection';
import AboutSection from '@/components/AboutSection';
import TrustSection from '@/components/TrustSection';
import FeaturedPropertiesSection from '@/components/FeaturedPropertiesSection';
import ContactSection from '@/components/ContactSection';

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Central Gate Estates | London Lettings & Property Management</title>
        <meta name="description" content="Central Gate Estates offers London landlords transparent pricing, zero hidden fees, and fully automated property management. 19+ years of industry experience." />
        <meta name="keywords" content="London property management, lettings agency, landlord services, tenant placement, property letting London" />
      </Helmet>
      
      <main data-testid="home-page">
        <HeroSection />
        <ProblemSection />
        <ServicesSection />
        <FeaturedPropertiesSection />
        <HowItWorksSection />
        <PricingSection />
        <AboutSection />
        <TrustSection />
        <ContactSection />
      </main>
    </>
  );
};

export default HomePage;
