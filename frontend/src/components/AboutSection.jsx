import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="about"
      ref={ref}
      data-testid="about-section"
      className="bg-[#0A0A0A] py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1676147376197-203c810944a8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMGhhbmRzaGFrZSUyMGNsb3NlJTIwdXAlMjBkYXJrJTIwYmFja2dyb3VuZHxlbnwwfHx8fDE3NzMxMDE0OTR8MA&ixlib=rb-4.1.0&q=85"
                alt="Central Gate Estates Team"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 border border-[#333333] -translate-x-4 -translate-y-4 -z-10" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2"
          >
            <p className="text-[#A3A3A3] text-xs tracking-[0.3em] mb-4">ABOUT US</p>
            <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl text-[#F5F0EB] mb-8">
              Built By Someone Who's Been On Both Sides
            </h2>
            
            <div className="space-y-6 text-[#A3A3A3] font-light leading-relaxed">
              <p>
                Central Gate Estates was co-founded by <span className="text-[#F5F0EB]">Bradley Czechowicz-Dolbear</span> and <span className="text-[#F5F0EB]">Claire Bruce</span>, who brings 19+ years of experience in the property industry.
              </p>
              <p>
                After nearly two decades in the industry, Claire became disillusioned with the quality of service landlords and tenants were receiving — excessive fees, poor aftercare, and a complete lack of genuine transparency.
              </p>
              <p>
                She founded Central Gate Estates to offer a genuinely different experience: cost-effective, transparent, and built around the needs of the landlord and tenant — not the agency's bottom line.
              </p>
              <p>
                Central Gate Estates is not a faceless corporate agency — it is personal, accountable, and driven by values of honesty and fairness. The agency is a proud member of the <span className="text-[#F5F0EB]">Property Redress Scheme</span> and the <span className="text-[#F5F0EB]">Tenancy Deposit Scheme</span>, providing full protection and accountability for landlords and tenants.
              </p>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 pt-8 border-t border-[#333333] font-['Playfair_Display'] text-xl text-[#F5F0EB] italic"
            >
              "When you choose Central Gate Estates, you're not a commission. You're a client."
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
