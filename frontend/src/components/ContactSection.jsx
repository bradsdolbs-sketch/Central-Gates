import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { toast } from 'sonner';
import { Mail, Phone, Instagram, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    number_of_properties: '',
    looking_for: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Thank you for your enquiry! We\'ll be in touch within 24 hours.');
        setFormData({
          full_name: '',
          phone_number: '',
          email: '',
          number_of_properties: '',
          looking_for: '',
          message: '',
        });
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="contact"
      ref={ref}
      data-testid="contact-section"
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
          <p className="text-[#A3A3A3] text-xs tracking-[0.3em] mb-4">CONTACT</p>
          <h2 className="font-['Playfair_Display'] text-3xl md:text-5xl text-[#F5F0EB] mb-4">
            Let's Talk About Your Property
          </h2>
          <p className="text-[#A3A3A3] font-light max-w-2xl mx-auto">
            Whether you have one property or a full portfolio, we'd love to understand your needs and show you how Central Gate Estates can help.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} data-testid="contact-form" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">FULL NAME</label>
                  <Input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    data-testid="contact-name-input"
                    className="bg-[#111111] border-[#333333] text-[#F5F0EB] placeholder:text-[#555555] rounded-none focus:ring-1 focus:ring-[#FFFFFF] focus:border-[#FFFFFF] h-12"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">PHONE NUMBER</label>
                  <Input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    required
                    data-testid="contact-phone-input"
                    className="bg-[#111111] border-[#333333] text-[#F5F0EB] placeholder:text-[#555555] rounded-none focus:ring-1 focus:ring-[#FFFFFF] focus:border-[#FFFFFF] h-12"
                    placeholder="+44 7XXX XXX XXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">EMAIL ADDRESS</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  data-testid="contact-email-input"
                  className="bg-[#111111] border-[#333333] text-[#F5F0EB] placeholder:text-[#555555] rounded-none focus:ring-1 focus:ring-[#FFFFFF] focus:border-[#FFFFFF] h-12"
                  placeholder="you@example.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">NUMBER OF PROPERTIES</label>
                  <Select
                    value={formData.number_of_properties}
                    onValueChange={(value) => handleSelectChange('number_of_properties', value)}
                  >
                    <SelectTrigger 
                      data-testid="contact-properties-select"
                      className="bg-[#111111] border-[#333333] text-[#F5F0EB] rounded-none h-12"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#333333]">
                      <SelectItem value="1" className="text-[#F5F0EB]">1</SelectItem>
                      <SelectItem value="2-5" className="text-[#F5F0EB]">2-5</SelectItem>
                      <SelectItem value="6-10" className="text-[#F5F0EB]">6-10</SelectItem>
                      <SelectItem value="10+" className="text-[#F5F0EB]">10+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">WHAT ARE YOU LOOKING FOR?</label>
                  <Select
                    value={formData.looking_for}
                    onValueChange={(value) => handleSelectChange('looking_for', value)}
                  >
                    <SelectTrigger 
                      data-testid="contact-looking-for-select"
                      className="bg-[#111111] border-[#333333] text-[#F5F0EB] rounded-none h-12"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111111] border-[#333333]">
                      <SelectItem value="Tenant Placement" className="text-[#F5F0EB]">Tenant Placement</SelectItem>
                      <SelectItem value="Full Management" className="text-[#F5F0EB]">Full Management</SelectItem>
                      <SelectItem value="Both" className="text-[#F5F0EB]">Both</SelectItem>
                      <SelectItem value="Just Exploring" className="text-[#F5F0EB]">Just Exploring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">MESSAGE</label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  data-testid="contact-message-input"
                  className="bg-[#111111] border-[#333333] text-[#F5F0EB] placeholder:text-[#555555] rounded-none focus:ring-1 focus:ring-[#FFFFFF] focus:border-[#FFFFFF] min-h-[120px]"
                  placeholder="Tell us about your property and requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                data-testid="contact-submit-button"
                className="w-full bg-[#F5F0EB] text-[#0A0A0A] px-10 py-4 text-sm tracking-[0.15em] font-medium hover:bg-white transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'SENDING...' : 'SEND ENQUIRY'}
              </button>
            </form>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Mail className="w-5 h-5 stroke-1 text-[#F5F0EB] mt-1" />
                <div>
                  <p className="text-[#F5F0EB] font-light">Bradley Czechowicz-Dolbear</p>
                  <a href="mailto:bradley@centralgateestates.com" className="text-[#A3A3A3] hover:text-[#F5F0EB] transition-colors">
                    bradley@centralgateestates.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="w-5 h-5 stroke-1 text-[#F5F0EB] mt-1" />
                <div>
                  <p className="text-[#F5F0EB] font-light">Claire Bruce</p>
                  <a href="mailto:claire@centralgateestates.com" className="text-[#A3A3A3] hover:text-[#F5F0EB] transition-colors">
                    claire@centralgateestates.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Instagram className="w-5 h-5 stroke-1 text-[#F5F0EB] mt-1" />
                <div>
                  <a href="https://instagram.com/centralgatestates" target="_blank" rel="noopener noreferrer" className="text-[#A3A3A3] hover:text-[#F5F0EB] transition-colors">
                    @centralgatestates
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 stroke-1 text-[#F5F0EB] mt-1" />
                <div>
                  <p className="text-[#A3A3A3]">London, United Kingdom</p>
                </div>
              </div>
            </div>

            <p className="text-[#F5F0EB] text-sm border-l-2 border-[#333333] pl-4 italic">
              We respond to all enquiries within 24 hours.
            </p>

            {/* Google Map */}
            <div className="map-container aspect-video bg-[#111111] border border-[#333333] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158858.47340102945!2d-0.24168105!3d51.5287398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2sus!4v1704067200000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Central Gate Estates Location"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
