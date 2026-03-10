import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    bedrooms: '',
    maxRent: '',
    availableFrom: '',
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/properties?available_only=true`);
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
          setFilteredProperties(data);
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Apply filters whenever filters or properties change
  useEffect(() => {
    let result = [...properties];

    if (filters.bedrooms) {
      result = result.filter(p => p.bedrooms === parseInt(filters.bedrooms));
    }

    if (filters.maxRent) {
      result = result.filter(p => p.rent_per_month <= parseInt(filters.maxRent));
    }

    if (filters.availableFrom) {
      result = result.filter(p => p.available_date <= filters.availableFrom);
    }

    setFilteredProperties(result);
  }, [filters, properties]);

  const clearFilters = () => {
    setFilters({
      bedrooms: '',
      maxRent: '',
      availableFrom: '',
    });
  };

  const hasActiveFilters = filters.bedrooms || filters.maxRent || filters.availableFrom;

  return (
    <>
      <Helmet>
        <title>Available Properties | Central Gate Estates</title>
        <meta name="description" content="Browse our curated selection of premium London properties for rent. Find your next home with Central Gate Estates." />
      </Helmet>

      <main data-testid="properties-page" className="bg-[#0A0A0A] min-h-screen pt-20">
        {/* Hero */}
        <section className="py-16 md:py-24">
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

        {/* Filters */}
        <section className="pb-8">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#A3A3A3] text-sm">
                {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} available
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                data-testid="toggle-filters-btn"
                className="flex items-center gap-2 text-[#F5F0EB] text-sm border border-[#333333] px-4 py-2 hover:border-[#555555] transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4 stroke-1" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#111111] border border-[#333333] p-6 mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">BEDROOMS</label>
                    <Select
                      value={filters.bedrooms}
                      onValueChange={(value) => setFilters(prev => ({ ...prev, bedrooms: value }))}
                    >
                      <SelectTrigger 
                        data-testid="filter-bedrooms"
                        className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none h-11"
                      >
                        <SelectValue placeholder="Any" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#111111] border-[#333333]">
                        <SelectItem value="1" className="text-[#F5F0EB]">1 Bedroom</SelectItem>
                        <SelectItem value="2" className="text-[#F5F0EB]">2 Bedrooms</SelectItem>
                        <SelectItem value="3" className="text-[#F5F0EB]">3 Bedrooms</SelectItem>
                        <SelectItem value="4" className="text-[#F5F0EB]">4+ Bedrooms</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">MAX RENT (£/MONTH)</label>
                    <Input
                      type="number"
                      value={filters.maxRent}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxRent: e.target.value }))}
                      placeholder="e.g., 3000"
                      data-testid="filter-max-rent"
                      className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none h-11"
                    />
                  </div>

                  <div>
                    <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">AVAILABLE FROM</label>
                    <Input
                      type="date"
                      value={filters.availableFrom}
                      onChange={(e) => setFilters(prev => ({ ...prev, availableFrom: e.target.value }))}
                      data-testid="filter-available-from"
                      className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none h-11"
                    />
                  </div>

                  <div className="flex items-end">
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        data-testid="clear-filters-btn"
                        className="flex items-center gap-2 text-[#A3A3A3] hover:text-[#F5F0EB] transition-colors text-sm"
                      >
                        <X className="w-4 h-4" />
                        Clear Filters
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
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
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProperties.map((property, index) => (
                  <PropertyCard key={property.id} property={property} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-[#111111] border border-[#333333] p-16 text-center"
              >
                <Search className="w-12 h-12 stroke-1 text-[#333333] mx-auto mb-4" />
                <p className="text-[#F5F0EB] text-lg mb-2">No properties found</p>
                <p className="text-[#A3A3A3] mb-6">
                  {hasActiveFilters 
                    ? 'Try adjusting your filters to see more results.'
                    : 'No properties are currently available. Check back soon!'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-[#F5F0EB] text-sm border border-[#333333] px-6 py-3 hover:border-[#555555] transition-colors"
                  >
                    Clear All Filters
                  </button>
                )}
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        {filteredProperties.length > 0 && (
          <section className="bg-[#111111] py-24">
            <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
              <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#F5F0EB] mb-4">
                Are You a Landlord?
              </h2>
              <p className="text-[#A3A3A3] font-light max-w-xl mx-auto mb-8">
                Looking to list your property with a transparent, professional agency? Get in touch for a free consultation.
              </p>
              <Link
                to="/#contact"
                data-testid="landlord-cta"
                className="inline-block bg-[#F5F0EB] text-[#0A0A0A] px-10 py-4 text-sm tracking-[0.15em] font-medium hover:bg-white transition-all duration-300"
              >
                LIST YOUR PROPERTY
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
};

export default PropertiesPage;
