import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminPropertyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const fileInputRef = useRef(null);
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [formData, setFormData] = useState({
    address: '',
    bedrooms: 1,
    rent_per_month: 0,
    available_date: '',
    description: '',
    is_available: true,
    is_featured: false,
    location_lat: null,
    location_lng: null,
  });

  useEffect(() => {
    if (isEditing) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/properties/${id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          address: data.address,
          bedrooms: data.bedrooms,
          rent_per_month: data.rent_per_month,
          available_date: data.available_date,
          description: data.description || '',
          is_available: data.is_available,
          is_featured: data.is_featured,
          location_lat: data.location_lat,
          location_lng: data.location_lng,
        });
        setImages(data.images || []);
      }
    } catch (error) {
      toast.error('Failed to load property');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageIndex) => {
    if (!isEditing) return;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/properties/${id}/images/${imageIndex}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setImages(data.images);
        toast.success('Image removed');
      }
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (isEditing) {
        // Update property data
        const response = await fetch(`${BACKEND_URL}/api/admin/properties/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to update');

        // Upload new images if any
        if (newImages.length > 0) {
          const imageFormData = new FormData();
          newImages.forEach(img => imageFormData.append('images', img));

          await fetch(`${BACKEND_URL}/api/admin/properties/${id}/images`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${getToken()}` },
            body: imageFormData
          });
        }

        toast.success('Property updated');
      } else {
        // Create new property with images
        const submitFormData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            submitFormData.append(key, value);
          }
        });
        newImages.forEach(img => submitFormData.append('images', img));

        const response = await fetch(`${BACKEND_URL}/api/admin/properties`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${getToken()}` },
          body: submitFormData
        });

        if (!response.ok) throw new Error('Failed to create');
        toast.success('Property created');
      }

      navigate('/admin/properties');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-[#1A1A1A] rounded w-48" />
        <div className="h-64 bg-[#1A1A1A] rounded" />
      </div>
    );
  }

  return (
    <div data-testid="admin-property-form">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/properties')}
          className="p-2 border border-[#333333] text-[#A3A3A3] hover:text-[#F5F0EB] transition-colors"
        >
          <ArrowLeft className="w-5 h-5 stroke-1" />
        </button>
        <div>
          <h1 className="font-['Playfair_Display'] text-3xl text-[#F5F0EB]">
            {isEditing ? 'Edit Property' : 'Add New Property'}
          </h1>
          <p className="text-[#A3A3A3] text-sm font-light mt-1">
            {isEditing ? 'Update property details' : 'Create a new property listing'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Images Section */}
        <div className="bg-[#111111] border border-[#333333] p-6">
          <h2 className="text-[#F5F0EB] text-lg mb-4">Property Images</h2>
          
          {/* Existing Images */}
          {images.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-4">
              {images.map((img, index) => (
                <div key={index} className="relative aspect-video bg-[#0A0A0A] group">
                  <img
                    src={img.startsWith('/') ? `${BACKEND_URL}${img}` : img}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* New Images Preview */}
          {newImages.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-4">
              {newImages.map((img, index) => (
                <div key={index} className="relative aspect-video bg-[#0A0A0A] group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`New ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-2 left-2 bg-[#F5F0EB] text-[#0A0A0A] text-xs px-2 py-1">NEW</span>
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-6 py-3 border border-dashed border-[#555555] text-[#A3A3A3] hover:border-[#F5F0EB] hover:text-[#F5F0EB] transition-colors w-full justify-center"
          >
            <Upload className="w-5 h-5 stroke-1" />
            Upload Images
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Property Details */}
        <div className="bg-[#111111] border border-[#333333] p-6 space-y-6">
          <h2 className="text-[#F5F0EB] text-lg">Property Details</h2>

          <div>
            <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">ADDRESS</label>
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              data-testid="property-address-input"
              className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none h-12"
              placeholder="e.g., 42 Kensington High Street, W8"
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">BEDROOMS</label>
              <Input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="1"
                required
                data-testid="property-bedrooms-input"
                className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none h-12"
              />
            </div>
            <div>
              <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">RENT (£/MONTH)</label>
              <Input
                type="number"
                name="rent_per_month"
                value={formData.rent_per_month}
                onChange={handleChange}
                min="0"
                required
                data-testid="property-rent-input"
                className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none h-12"
              />
            </div>
            <div>
              <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">AVAILABLE FROM</label>
              <Input
                type="date"
                name="available_date"
                value={formData.available_date}
                onChange={handleChange}
                required
                data-testid="property-date-input"
                className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none h-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">DESCRIPTION</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              data-testid="property-description-input"
              className="bg-[#0A0A0A] border-[#333333] text-[#F5F0EB] rounded-none min-h-[150px]"
              placeholder="Describe the property features, location highlights, and amenities..."
            />
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.is_available}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_available: checked }))}
                data-testid="property-available-switch"
              />
              <label className="text-[#F5F0EB] text-sm">Available for rent</label>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_featured: checked }))}
                data-testid="property-featured-switch"
              />
              <label className="text-[#F5F0EB] text-sm">Featured listing</label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/properties')}
            className="flex-1 border border-[#333333] text-[#F5F0EB] py-4 text-sm tracking-[0.15em] hover:bg-[#1A1A1A] transition-colors"
          >
            CANCEL
          </button>
          <button
            type="submit"
            disabled={saving}
            data-testid="property-save-btn"
            className="flex-1 bg-[#F5F0EB] text-[#0A0A0A] py-4 text-sm tracking-[0.15em] font-medium hover:bg-white transition-all disabled:opacity-50"
          >
            {saving ? 'SAVING...' : isEditing ? 'UPDATE PROPERTY' : 'CREATE PROPERTY'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPropertyForm;
