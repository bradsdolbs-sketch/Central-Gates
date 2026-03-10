import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    {
      number: '01',
      title: 'Initial Consultation',
      description: 'We start with a call or in-person visit to fully understand your property, your needs, and your preferred level of involvement.',
    },
    {
      number: '02',
      title: 'Property Onboarding',
      description: 'Your property is added to our secure Client Services portal, along with tenant details and all relevant property information — everything in one place.',
    },
    {
      number: '03',
      title: 'Automated Maintenance Management',
      description: 'When a maintenance issue arises, our system evaluates the request, applies your personal rules (spending thresholds, preferred contractors, emergency criteria), and either resolves it automatically or escalates to you for approval. No chasing. No delays.',
    },
    {
      number: '04',
      title: 'Transparent Job Completion',
      description: 'After every job is completed, the contractor uploads photos, the job is marked complete, and you receive an automatic notification with the invoice. No markups. Ever.',
    },
    {
      number: '05',
      title: 'Ongoing Communication',
      description: 'You stay informed at every stage through your secure landlord portal — full records, invoices, and history for every property, available any time.',
    },
  ];

  return (
    <section 
      id="how-it-works"
      ref={ref}
      data-testid="how-it-works-section"
      className="bg-[#0A0A0A] py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-[#A3A3A3] text-xs tracking-[0.3em] mb-4">THE PROCESS</p>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl text-[#F5F0EB]">
            Property Management That<br />Actually Works
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              data-testid={`step-${index + 1}`}
              className="flex gap-8 mb-12 last:mb-0"
            >
              {/* Step Number */}
              <div className="flex-shrink-0">
                <span className="font-['Playfair_Display'] text-5xl md:text-6xl text-[#333333] font-medium">
                  {step.number}
                </span>
              </div>
              
              {/* Step Content */}
              <div className="pt-2">
                <h3 className="font-['Playfair_Display'] text-xl md:text-2xl text-[#F5F0EB] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#A3A3A3] font-light leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Callout Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 border border-[#333333] p-8 md:p-12 text-center max-w-3xl mx-auto"
        >
          <p className="text-[#F5F0EB] font-['Playfair_Display'] text-lg md:text-xl italic">
            "Unlike traditional agencies, we never add a markup to contractor invoices. What the contractor charges is exactly what you pay."
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
