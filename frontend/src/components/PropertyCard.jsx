import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bed, Calendar, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PropertyCard = ({ property, index }) => {
  const [showViewingModal, setShowViewingModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingForm, setViewingForm] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    preferred_date: '',
    message: '',
  });

  const handleViewingSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/viewing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...viewingForm,
          property_id: property.id,
        }),
      });

      if (response.ok) {
        toast.success('Viewing request submitted! We\'ll be in touch soon.');
        setShowViewingModal(false);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        data-testid={`property-card-${index}`}
        className="property-card bg-[#111111] border border-[#333333] overflow-hidden group"
      >
        {/* Property Image */}
        <Link to={`/properties/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
          <img
            src={property.image_url?.startsWith('/') ? `${BACKEND_URL}${property.image_url}` : property.image_url}
            alt={property.address}
            className="property-image w-full h-full object-cover"
          />
          {property.is_available && (
            <div className="absolute top-4 left-4 bg-[#0A0A0A]/80 px-3 py-1 text-xs tracking-[0.1em] text-[#F5F0EB]">
              AVAILABLE
            </div>
          )}
        </Link>

        {/* Property Details */}
        <div className="p-6">
          <Link to={`/properties/${property.id}`}>
            <h3 className="font-['Playfair_Display'] text-xl text-[#F5F0EB] mb-3 hover:text-white transition-colors">
              {property.address}
            </h3>
          </Link>
          
          <div className="flex items-center gap-6 mb-4 text-[#A3A3A3]">
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 stroke-1" />
              <span className="text-sm">{property.bedrooms} Bed{property.bedrooms > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 stroke-1" />
              <span className="text-sm">{formatDate(property.available_date)}</span>
            </div>
          </div>

          <p className="text-[#A3A3A3] text-sm font-light mb-4 line-clamp-2">
            {property.description}
          </p>

          <div className="flex justify-between items-center pt-4 border-t border-[#333333]">
            <div>
              <span className="text-[#F5F0EB] font-['Playfair_Display'] text-2xl">
                £{property.rent_per_month.toLocaleString()}
              </span>
              <span className="text-[#A3A3A3] text-sm"> /month</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              data-testid={`property-contact-btn-${index}`}
              onClick={() => setShowContactModal(true)}
              className="flex-1 border border-[#FFFFFF] text-[#FFFFFF] px-4 py-3 text-xs tracking-[0.1em] font-medium hover:bg-[#FFFFFF] hover:text-[#0A0A0A] transition-all duration-300"
            >
              CONTACT
            </button>
            <button
              data-testid={`property-viewing-btn-${index}`}
              onClick={() => setShowViewingModal(true)}
              className="flex-1 bg-[#F5F0EB] text-[#0A0A0A] px-4 py-3 text-xs tracking-[0.1em] font-medium hover:bg-white transition-all duration-300"
            >
              BOOK VIEWING
            </button>
          </div>
        </div>
      </motion.div>

      {/* Viewing Request Modal */}
      <Dialog open={showViewingModal} onOpenChange={setShowViewingModal}>
        <DialogContent className="bg-[#111111] border-[#333333] text-[#F5F0EB] max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['Playfair_Display'] text-2xl">
              Book a Viewing
            </DialogTitle>
            <DialogDescription className="text-[#A3A3A3] text-sm">
              {property.address}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleViewingSubmit} className="space-y-4">
            <div>
              <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">FULL NAME</label>
              <Input
                type="text"
                required
                value={viewingForm.full_name}
                onChange={(e) => setViewingForm(prev => ({ ...prev, full_name: e.target.value }))}
                data-testid="viewing-name-input"
                className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none h-11"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">EMAIL</label>
                <Input
                  type="email"
                  required
                  value={viewingForm.email}
                  onChange={(e) => setViewingForm(prev => ({ ...prev, email: e.target.value }))}
                  data-testid="viewing-email-input"
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
                  data-testid="viewing-phone-input"
                  className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none h-11"
                />
              </div>
            </div>
            <div>
              <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">PREFERRED DATE</label>
              <Input
                type="date"
                required
                value={viewingForm.preferred_date}
                onChange={(e) => setViewingForm(prev => ({ ...prev, preferred_date: e.target.value }))}
                data-testid="viewing-date-input"
                className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none h-11"
              />
            </div>
            <div>
              <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">MESSAGE (OPTIONAL)</label>
              <Textarea
                value={viewingForm.message}
                onChange={(e) => setViewingForm(prev => ({ ...prev, message: e.target.value }))}
                data-testid="viewing-message-input"
                className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none min-h-[80px]"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              data-testid="viewing-submit-btn"
              className="w-full bg-[#F5F0EB] text-[#0A0A0A] py-3 text-sm tracking-[0.15em] font-medium hover:bg-white transition-all duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'SUBMITTING...' : 'REQUEST VIEWING'}
            </button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="bg-[#111111] border-[#333333] text-[#F5F0EB] max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['Playfair_Display'] text-2xl">
              Contact Us About This Property
            </DialogTitle>
            <DialogDescription className="text-[#A3A3A3] text-sm">
              {property.address}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] border border-[#333333]">
              <Mail className="w-5 h-5 stroke-1 text-[#F5F0EB]" />
              <div>
                <p className="text-[#F5F0EB] text-sm">Bradley Czechowicz-Dolbear</p>
                <a href="mailto:bradley@centralgateestates.com" className="text-[#A3A3A3] text-sm hover:text-[#F5F0EB] transition-colors">
                  bradley@centralgateestates.com
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-[#0A0A0A] border border-[#333333]">
              <Mail className="w-5 h-5 stroke-1 text-[#F5F0EB]" />
              <div>
                <p className="text-[#F5F0EB] text-sm">Claire Bruce</p>
                <a href="mailto:claire@centralgateestates.com" className="text-[#A3A3A3] text-sm hover:text-[#F5F0EB] transition-colors">
                  claire@centralgateestates.com
                </a>
              </div>
            </div>
            <a
              href={`https://wa.me/447726594925?text=Hi,%20I'm%20interested%20in%20the%20property%20at%20${encodeURIComponent(property.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 text-sm tracking-[0.1em] font-medium hover:bg-[#128C7E] transition-all duration-300"
            >
              <Phone className="w-4 h-4" />
              WHATSAPP US
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyCard;
