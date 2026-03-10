import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/properties?available_only=true`);
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const scrollToContact = () => {
    // Navigate to home page contact section
    window.location.href = '/#contact';
  };

  return (
    <main data-testid="properties-page" className="bg-[#0A0A0A] min-h-screen pt-20">
      {/* Hero */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[#A3A3A3] text-xs tracking-[0.3em] mb-4"
          >
            AVAILABLE PROPERTIES
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-['Playfair_Display'] text-4xl md:text-6xl text-[#F5F0EB] mb-6"
          >
            Find Your Next Home
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[#A3A3A3] font-light max-w-2xl mx-auto"
          >
            Browse our carefully curated selection of premium London properties, each managed with the highest standards of service and care.
          </motion.p>
        </div>
      </section>

      {/* Properties Grid */}
      <section className="pb-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#111111] border border-[#333333] animate-pulse">
                  <div className="aspect-[4/3] bg-[#1A1A1A]" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-[#1A1A1A] rounded w-3/4" />
                    <div className="h-4 bg-[#1A1A1A] rounded w-1/2" />
                    <div className="h-4 bg-[#1A1A1A] rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                <PropertyCard key={property.id} property={property} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-[#A3A3A3] text-lg mb-6">No properties currently available.</p>
              <button
                onClick={scrollToContact}
                data-testid="no-properties-cta"
                className="bg-[#F5F0EB] text-[#0A0A0A] px-8 py-4 text-sm tracking-[0.15em] font-medium hover:bg-white transition-all duration-300"
              >
                GET IN TOUCH FOR UPCOMING LISTINGS
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {properties.length > 0 && (
        <section className="bg-[#111111] py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#F5F0EB] mb-4">
              Are You a Landlord?
            </h2>
            <p className="text-[#A3A3A3] font-light max-w-xl mx-auto mb-8">
              Looking to list your property with a transparent, professional agency? Get in touch for a free consultation.
            </p>
            <button
              onClick={scrollToContact}
              data-testid="landlord-cta"
              className="bg-[#F5F0EB] text-[#0A0A0A] px-10 py-4 text-sm tracking-[0.15em] font-medium hover:bg-white transition-all duration-300"
            >
              LIST YOUR PROPERTY
            </button>
          </div>
        </section>
      )}
    </main>
  );
};

export default PropertiesPage;
