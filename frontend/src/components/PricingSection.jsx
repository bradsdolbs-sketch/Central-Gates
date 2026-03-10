import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check } from 'lucide-react';

const PricingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const tenantPlacement = [
    { type: '1 & 2 Bedroom Properties', fee: '£2,250', renewal: '£1,500' },
    { type: '3 Bedroom Properties', fee: '£3,000', renewal: '£1,750' },
    { type: '4 Bedroom Properties', fee: '£4,000', renewal: '£2,000' },
  ];

  const managementOnly = [
    { type: '1 & 2 Bedroom Properties', fee: '£1,500 per year' },
    { type: '3+ Bedroom Properties', fee: '£2,000 per year' },
  ];

  const guarantees = [
    'No fixed-term contracts',
    'No markup on contractor fees',
    'No hidden administration charges',
  ];

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="pricing"
      ref={ref}
      data-testid="pricing-section"
      className="bg-[#111111] py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#A3A3A3] text-xs tracking-[0.3em] mb-4">PRICING</p>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl text-[#F5F0EB] mb-4">
            Transparent Pricing.<br />No Hidden Costs.
          </h2>
          <p className="text-[#A3A3A3] font-light max-w-2xl mx-auto">
            We believe landlords deserve to know exactly what they're paying before they commit. No small print. No surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Tenant Placement Fees */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            data-testid="pricing-tenant-placement"
            className="bg-[#0A0A0A] border border-[#333333] p-8 md:p-10"
          >
            <h3 className="font-['Playfair_Display'] text-2xl text-[#F5F0EB] mb-8">
              Tenant Placement Fees
            </h3>
            <div className="space-y-6">
              {tenantPlacement.map((item, index) => (
                <div key={index} className="border-b border-[#333333] pb-6 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[#F5F0EB] font-light">{item.type}</span>
                    <span className="text-[#F5F0EB] font-medium text-xl">{item.fee}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[#A3A3A3] text-sm">Renewal: {item.renewal}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Management Only */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-testid="pricing-management-only"
            className="bg-[#0A0A0A] border border-[#333333] p-8 md:p-10"
          >
            <h3 className="font-['Playfair_Display'] text-2xl text-[#F5F0EB] mb-8">
              Management Only
            </h3>
            <p className="text-[#A3A3A3] text-sm mb-6 font-light">Annual Fixed Fee</p>
            <div className="space-y-6">
              {managementOnly.map((item, index) => (
                <div key={index} className="border-b border-[#333333] pb-6 last:border-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[#F5F0EB] font-light">{item.type}</span>
                    <span className="text-[#F5F0EB] font-medium text-xl">{item.fee}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Guarantees */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12"
        >
          {guarantees.map((guarantee, index) => (
            <div key={index} className="flex items-center space-x-2 text-[#F5F0EB]">
              <Check className="w-4 h-4 stroke-1" />
              <span className="text-sm font-light">{guarantee}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <button
            data-testid="pricing-cta"
            onClick={scrollToContact}
            className="bg-[#F5F0EB] text-[#0A0A0A] px-10 py-4 text-sm tracking-[0.15em] font-medium hover:bg-white transition-all duration-300"
          >
            BOOK A FREE CONSULTATION
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
