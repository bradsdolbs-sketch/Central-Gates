import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Shield, Lock, BadgeCheck, Clock } from 'lucide-react';

const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const accreditations = [
    {
      icon: Shield,
      title: 'Property Redress Scheme Member',
      description: 'Trusted dispute resolution for landlords and tenants',
    },
    {
      icon: Lock,
      title: 'Tenancy Deposit Scheme (TDS)',
      description: 'All deposits fully protected',
    },
    {
      icon: BadgeCheck,
      title: 'Fully Insured',
      description: 'Agency and all contractors carry full insurance',
    },
    {
      icon: Clock,
      title: '19+ Years Experience',
      description: 'Deep industry knowledge behind every decision',
    },
  ];

  return (
    <section 
      ref={ref}
      data-testid="trust-section"
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
          <p className="text-[#A3A3A3] text-xs tracking-[0.3em] mb-4">ACCREDITATIONS</p>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl text-[#F5F0EB]">
            Regulated, Insured & Accountable
          </h2>
        </motion.div>

        {/* Accreditation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {accreditations.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                data-testid={`accreditation-${index}`}
                className="bg-[#0A0A0A] border border-[#333333] p-8 text-center hover:border-[#555555] transition-colors duration-300"
              >
                <div className="flex justify-center mb-6">
                  <Icon className="w-10 h-10 stroke-1 text-[#F5F0EB]" />
                </div>
                <h3 className="font-['Playfair_Display'] text-lg text-[#F5F0EB] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#A3A3A3] font-light text-sm">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Statement */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-[#A3A3A3] font-light max-w-2xl mx-auto"
        >
          We don't just say we're trustworthy — we're regulated, insured, and accountable to independent bodies.
        </motion.p>
      </div>
    </section>
  );
};

export default TrustSection;
