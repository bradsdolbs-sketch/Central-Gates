import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Banknote, MessageSquareOff, HeartOff } from 'lucide-react';

const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const problems = [
    {
      icon: Banknote,
      title: 'Excessive Fees',
      description: 'Traditional agencies charge high commissions, add markups to every contractor invoice, and bury charges in the small print. We don\'t.',
    },
    {
      icon: MessageSquareOff,
      title: 'Poor Communication',
      description: 'Landlords are often left chasing their agent for updates, invoices and answers. We keep you informed automatically after every job.',
    },
    {
      icon: HeartOff,
      title: 'Lack of Genuine Care',
      description: 'Most agencies move on once a deal is signed. At Central Gate Estates, that\'s when our service truly begins.',
    },
  ];

  return (
    <section 
      ref={ref}
      data-testid="problem-section"
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
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl text-[#F5F0EB] mb-4">
            Why Most Landlords Are Fed Up<br />With Their Agent
          </h2>
        </motion.div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center px-6"
              >
                <div className="flex justify-center mb-6">
                  <Icon className="w-10 h-10 stroke-1 text-[#F5F0EB]" />
                </div>
                <h3 className="font-['Playfair_Display'] text-2xl text-[#F5F0EB] mb-4">
                  {problem.title}
                </h3>
                <p className="text-[#A3A3A3] font-light leading-relaxed">
                  {problem.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-[#F5F0EB] italic font-['Playfair_Display'] text-lg md:text-xl max-w-3xl mx-auto"
        >
          "We built Central Gate Estates because we experienced these frustrations first-hand — and decided to do something about it."
        </motion.p>
      </div>
    </section>
  );
};

export default ProblemSection;
