import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Bed, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const FeaturedPropertiesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [properties, setProperties] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/properties/featured`);
        if (response.ok) {
          const data = await response.json();
          setProperties(data.slice(0, 6)); // Max 6 featured
        }
      } catch (error) {
        console.error('Failed to fetch featured properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, properties.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, properties.length - 2)) % Math.max(1, properties.length - 2));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <section className="bg-[#111111] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="animate-pulse">
            <div className="h-8 bg-[#1A1A1A] w-48 mx-auto mb-12" />
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-[#0A0A0A] h-80" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) return null;

  const visibleProperties = properties.slice(currentIndex, currentIndex + 3);
  // Fill remaining slots if needed
  while (visibleProperties.length < 3 && properties.length >= 3) {
    visibleProperties.push(properties[visibleProperties.length % properties.length]);
  }

  return (
    <section 
      ref={ref}
      data-testid="featured-properties-section"
      className="bg-[#111111] py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[#A3A3A3] text-xs tracking-[0.3em] mb-4">FEATURED</p>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl text-[#F5F0EB]">
            Premium London Properties
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation Arrows */}
          {properties.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                data-testid="featured-prev-btn"
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#0A0A0A] border border-[#333333] text-[#F5F0EB] hover:bg-[#1A1A1A] transition-colors"
              >
                <ChevronLeft className="w-5 h-5 stroke-1" />
              </button>
              <button
                onClick={nextSlide}
                data-testid="featured-next-btn"
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#0A0A0A] border border-[#333333] text-[#F5F0EB] hover:bg-[#1A1A1A] transition-colors"
              >
                <ChevronRight className="w-5 h-5 stroke-1" />
              </button>
            </>
          )}

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(properties.length < 3 ? properties : visibleProperties).map((property, index) => (
              <motion.div
                key={`${property.id}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                data-testid={`featured-property-${index}`}
                className="bg-[#0A0A0A] border border-[#333333] overflow-hidden group"
              >
                {/* Image */}
                <Link to={`/properties/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
                  <img
                    src={property.image_url?.startsWith('/') ? `${BACKEND_URL}${property.image_url}` : property.image_url}
                    alt={property.address}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#F5F0EB] text-[#0A0A0A] text-xs px-3 py-1 tracking-[0.1em]">
                    FEATURED
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6">
                  <Link to={`/properties/${property.id}`}>
                    <h3 className="font-['Playfair_Display'] text-lg text-[#F5F0EB] mb-3 hover:text-white transition-colors">
                      {property.address}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-4 mb-4 text-[#A3A3A3] text-sm">
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4 stroke-1" />
                      {property.bedrooms} Bed{property.bedrooms > 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 stroke-1" />
                      {formatDate(property.available_date)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-[#333333]">
                    <div>
                      <span className="font-['Playfair_Display'] text-2xl text-[#F5F0EB]">
                        £{property.rent_per_month.toLocaleString()}
                      </span>
                      <span className="text-[#A3A3A3] text-sm">/month</span>
                    </div>
                    <Link
                      to={`/properties/${property.id}`}
                      className="text-[#F5F0EB] text-xs tracking-[0.1em] hover:underline"
                    >
                      VIEW PROPERTY
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link
            to="/properties"
            data-testid="view-all-properties-btn"
            className="inline-block border border-[#FFFFFF] text-[#FFFFFF] px-10 py-4 text-sm tracking-[0.15em] font-medium hover:bg-[#FFFFFF] hover:text-[#0A0A0A] transition-all duration-300"
          >
            VIEW ALL PROPERTIES
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection;
