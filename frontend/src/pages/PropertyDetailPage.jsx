import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { Bed, Calendar, MapPin, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingForm, setViewingForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    preferred_date: '',
    message: '',
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/properties/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
        }
      } catch (error) {
        console.error('Failed to fetch property:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleViewingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/viewing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...viewingForm,
          property_id: id,
        }),
      });

      if (response.ok) {
        toast.success('Viewing request submitted! We\'ll be in touch soon.');
        setViewingForm({
          full_name: '',
          email: '',
          phone_number: '',
          preferred_date: '',
          message: '',
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextImage = () => {
    if (property?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
    }
  };

  const prevImage = () => {
    if (property?.images?.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="animate-pulse">
            <div className="h-96 bg-[#111111] mb-8" />
            <div className="h-8 bg-[#111111] w-1/2 mb-4" />
            <div className="h-4 bg-[#111111] w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-['Playfair_Display'] text-3xl text-[#F5F0EB] mb-4">Property Not Found</h1>
          <Link to="/properties" className="text-[#A3A3A3] hover:text-[#F5F0EB]">
            ← Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images?.length > 0 ? property.images : [property.image_url];
  const currentImage = images[currentImageIndex];

  return (
    <>
      <Helmet>
        <title>{property.address} | Central Gate Estates</title>
        <meta name="description" content={`${property.bedrooms} bedroom property in ${property.address} - £${property.rent_per_month}/month. ${property.description?.slice(0, 150)}`} />
      </Helmet>

      <main data-testid="property-detail-page" className="min-h-screen bg-[#0A0A0A] pt-20">
        {/* Back Link */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8">
          <Link 
            to="/properties" 
            className="inline-flex items-center gap-2 text-[#A3A3A3] hover:text-[#F5F0EB] transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4 stroke-1" />
            Back to Properties
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Images & Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative aspect-[16/10] bg-[#111111] overflow-hidden"
              >
                <img
                  src={currentImage?.startsWith('/') ? `${BACKEND_URL}${currentImage}` : currentImage}
                  alt={property.address}
                  className="w-full h-full object-cover"
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-[#0A0A0A]/80 text-[#F5F0EB] hover:bg-[#0A0A0A] transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6 stroke-1" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-[#0A0A0A]/80 text-[#F5F0EB] hover:bg-[#0A0A0A] transition-colors"
                    >
                      <ChevronRight className="w-6 h-6 stroke-1" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-[#F5F0EB]' : 'bg-[#555555]'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {property.is_available && (
                  <div className="absolute top-4 left-4 bg-[#0A0A0A]/80 px-4 py-2 text-xs tracking-[0.1em] text-[#F5F0EB]">
                    AVAILABLE
                  </div>
                )}
              </motion.div>

              {/* Image Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`aspect-video overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-[#F5F0EB]' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img.startsWith('/') ? `${BACKEND_URL}${img}` : img}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Property Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="font-['Playfair_Display'] text-3xl md:text-4xl text-[#F5F0EB] mb-4">
                  {property.address}
                </h1>

                <div className="flex items-center gap-6 mb-6 text-[#A3A3A3]">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 stroke-1" />
                    <span>{property.bedrooms} Bedroom{property.bedrooms > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 stroke-1" />
                    <span>Available {formatDate(property.available_date)}</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-8">
                  <span className="font-['Playfair_Display'] text-4xl text-[#F5F0EB]">
                    £{property.rent_per_month.toLocaleString()}
                  </span>
                  <span className="text-[#A3A3A3]">per month</span>
                </div>

                {property.description && (
                  <div className="bg-[#111111] border border-[#333333] p-8">
                    <h2 className="font-['Playfair_Display'] text-xl text-[#F5F0EB] mb-4">About This Property</h2>
                    <p className="text-[#A3A3A3] font-light leading-relaxed whitespace-pre-wrap">
                      {property.description}
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Map */}
              {(property.location_lat && property.location_lng) && (
                <div className="bg-[#111111] border border-[#333333] overflow-hidden">
                  <div className="p-6 border-b border-[#333333]">
                    <h2 className="font-['Playfair_Display'] text-xl text-[#F5F0EB] flex items-center gap-2">
                      <MapPin className="w-5 h-5 stroke-1" />
                      Location
                    </h2>
                  </div>
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000!2d${property.location_lng}!3d${property.location_lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2suk!4v1`}
                      width="100%"
                      height="100%"
                      style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
                      allowFullScreen=""
                      loading="lazy"
                      title="Property Location"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Viewing Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:sticky lg:top-28 self-start"
            >
              <div className="bg-[#111111] border border-[#333333] p-8">
                <h2 className="font-['Playfair_Display'] text-2xl text-[#F5F0EB] mb-2">Book a Viewing</h2>
                <p className="text-[#A3A3A3] text-sm mb-6">We respond to all enquiries within 24 hours.</p>

                <form onSubmit={handleViewingSubmit} data-testid="property-viewing-form" className="space-y-4">
                  <div>
                    <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">FULL NAME</label>
                    <Input
                      type="text"
                      required
                      value={viewingForm.full_name}
                      onChange={(e) => setViewingForm(prev => ({ ...prev, full_name: e.target.value }))}
                      className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">EMAIL</label>
                    <Input
                      type="email"
                      required
                      value={viewingForm.email}
                      onChange={(e) => setViewingForm(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">PHONE</label>
                    <Input
                      type="tel"
                      required
                      value={viewingForm.phone_number}
                      onChange={(e) => setViewingForm(prev => ({ ...prev, phone_number: e.target.value }))}
                      className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">PREFERRED DATE</label>
                    <Input
                      type="date"
                      required
                      value={viewingForm.preferred_date}
                      onChange={(e) => setViewingForm(prev => ({ ...prev, preferred_date: e.target.value }))}
                      className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none h-11"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">MESSAGE (OPTIONAL)</label>
                    <Textarea
                      value={viewingForm.message}
                      onChange={(e) => setViewingForm(prev => ({ ...prev, message: e.target.value }))}
                      className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none min-h-[80px]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#F5F0EB] text-[#0A0A0A] py-4 text-sm tracking-[0.15em] font-medium hover:bg-white transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'REQUEST VIEWING'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PropertyDetailPage;
