import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Users, Building, Scale, FileSearch } from 'lucide-react';

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const services = [
    {
      icon: Users,
      title: 'Tenant Placement',
      description: 'We find and vet high-quality tenants for your property. Full referencing, right-to-rent checks, and a seamless onboarding process. Fixed fee, no surprises.',
    },
    {
      icon: Building,
      title: 'Property Management',
      description: 'Full ongoing management of your property including maintenance coordination, contractor management, inspections, and landlord communications — all handled for a simple fixed annual fee.',
    },
    {
      icon: Scale,
      title: 'Legal Compliance',
      description: 'We keep your property and tenancy legally compliant. From deposit protection to regulatory requirements, we manage the paperwork so you don\'t have to.',
    },
    {
      icon: FileSearch,
      title: 'Referencing',
      description: 'Thorough tenant referencing including employment checks, credit history, previous landlord references, and right-to-rent verification — giving you complete confidence before signing.',
    },
  ];

  return (
    <section 
      id="services"
      ref={ref}
      data-testid="services-section"
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
          <p className="text-[#A3A3A3] text-xs tracking-[0.3em] mb-4">OUR SERVICES</p>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl text-[#F5F0EB]">
            What We Do
          </h2>
        </motion.div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                data-testid={`service-card-${index}`}
                className="bg-[#0A0A0A] border-t border-[#333333] p-8 hover:border-[#555555] transition-colors duration-300"
              >
                <div className="mb-6">
                  <Icon className="w-8 h-8 stroke-1 text-[#F5F0EB]" />
                </div>
                <h3 className="font-['Playfair_Display'] text-xl text-[#F5F0EB] mb-4">
                  {service.title}
                </h3>
                <p className="text-[#A3A3A3] font-light text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
