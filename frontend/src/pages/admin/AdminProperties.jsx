import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Star, StarOff, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminProperties = () => {
  const { getToken } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ open: false, property: null });

  const fetchProperties = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/properties`);
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

  useEffect(() => {
    fetchProperties();
  }, []);

  const toggleFeatured = async (property) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/properties/${property.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ is_featured: !property.is_featured })
      });

      if (response.ok) {
        toast.success(property.is_featured ? 'Removed from featured' : 'Added to featured');
        fetchProperties();
      }
    } catch (error) {
      toast.error('Failed to update property');
    }
  };

  const toggleAvailability = async (property) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/properties/${property.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ is_available: !property.is_available })
      });

      if (response.ok) {
        toast.success(property.is_available ? 'Marked as unavailable' : 'Marked as available');
        fetchProperties();
      }
    } catch (error) {
      toast.error('Failed to update property');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.property) return;

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/properties/${deleteModal.property.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });

      if (response.ok) {
        toast.success('Property deleted');
        setDeleteModal({ open: false, property: null });
        fetchProperties();
      }
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#111111] border border-[#333333] h-24" />
        ))}
      </div>
    );
  }

  return (
    <div data-testid="admin-properties">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-['Playfair_Display'] text-3xl text-[#F5F0EB]">Properties</h1>
          <p className="text-[#A3A3A3] text-sm font-light mt-1">{properties.length} total listings</p>
        </div>
        <Link
          to="/admin/properties/new"
          data-testid="add-property-btn"
          className="flex items-center gap-2 bg-[#F5F0EB] text-[#0A0A0A] px-6 py-3 text-sm tracking-[0.1em] font-medium hover:bg-white transition-all"
        >
          <Plus className="w-4 h-4" />
          ADD PROPERTY
        </Link>
      </div>

      {/* Properties List */}
      {properties.length === 0 ? (
        <div className="bg-[#111111] border border-[#333333] p-12 text-center">
          <p className="text-[#A3A3A3] mb-4">No properties yet</p>
          <Link
            to="/admin/properties/new"
            className="inline-flex items-center gap-2 bg-[#F5F0EB] text-[#0A0A0A] px-6 py-3 text-sm tracking-[0.1em] font-medium hover:bg-white transition-all"
          >
            <Plus className="w-4 h-4" />
            ADD YOUR FIRST PROPERTY
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              data-testid={`property-row-${property.id}`}
              className="bg-[#111111] border border-[#333333] p-4 flex items-center gap-4"
            >
              {/* Image */}
              <div className="w-24 h-24 flex-shrink-0 bg-[#1A1A1A] overflow-hidden">
                {property.image_url ? (
                  <img
                    src={property.image_url.startsWith('/') ? `${BACKEND_URL}${property.image_url}` : property.image_url}
                    alt={property.address}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#555555]">
                    No image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-[#F5F0EB] font-light truncate">{property.address}</h3>
                  {property.is_featured && (
                    <span className="bg-[#F5F0EB] text-[#0A0A0A] text-xs px-2 py-0.5">FEATURED</span>
                  )}
                  {!property.is_available && (
                    <span className="bg-[#333333] text-[#A3A3A3] text-xs px-2 py-0.5">UNAVAILABLE</span>
                  )}
                </div>
                <p className="text-[#A3A3A3] text-sm">
                  {property.bedrooms} bed • £{property.rent_per_month.toLocaleString()}/month
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleFeatured(property)}
                  title={property.is_featured ? 'Remove from featured' : 'Add to featured'}
                  className={`p-2 border transition-colors ${
                    property.is_featured 
                      ? 'border-[#F5F0EB] text-[#F5F0EB]' 
                      : 'border-[#333333] text-[#A3A3A3] hover:text-[#F5F0EB]'
                  }`}
                >
                  {property.is_featured ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4 stroke-1" />}
                </button>
                <button
                  onClick={() => toggleAvailability(property)}
                  title={property.is_available ? 'Mark unavailable' : 'Mark available'}
                  className={`p-2 border transition-colors ${
                    property.is_available 
                      ? 'border-green-600 text-green-500' 
                      : 'border-[#333333] text-[#A3A3A3] hover:text-[#F5F0EB]'
                  }`}
                >
                  <Eye className="w-4 h-4 stroke-1" />
                </button>
                <Link
                  to={`/admin/properties/${property.id}/edit`}
                  className="p-2 border border-[#333333] text-[#A3A3A3] hover:text-[#F5F0EB] hover:border-[#555555] transition-colors"
                >
                  <Edit className="w-4 h-4 stroke-1" />
                </Link>
                <button
                  onClick={() => setDeleteModal({ open: true, property })}
                  className="p-2 border border-[#333333] text-[#A3A3A3] hover:text-red-500 hover:border-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4 stroke-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModal.open} onOpenChange={(open) => setDeleteModal({ open, property: deleteModal.property })}>
        <DialogContent className="bg-[#111111] border-[#333333] text-[#F5F0EB]">
          <DialogHeader>
            <DialogTitle className="font-['Playfair_Display'] text-xl">Delete Property</DialogTitle>
            <DialogDescription className="text-[#A3A3A3]">
              Are you sure you want to delete "{deleteModal.property?.address}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setDeleteModal({ open: false, property: null })}
              className="flex-1 border border-[#333333] text-[#F5F0EB] py-3 text-sm hover:bg-[#1A1A1A] transition-colors"
            >
              CANCEL
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 text-white py-3 text-sm hover:bg-red-700 transition-colors"
            >
              DELETE
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProperties;
