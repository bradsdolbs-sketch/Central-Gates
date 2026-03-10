import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Calendar, Mail, Phone, MapPin, Clock, Check, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminViewings = () => {
  const { getToken } = useAuth();
  const [viewings, setViewings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchViewings = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/viewings`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        setViewings(data);
      }
    } catch (error) {
      console.error('Failed to fetch viewings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchViewings();
  }, [getToken]);

  const updateStatus = async (viewingId, status) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/viewings/${viewingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        toast.success(`Viewing ${status}`);
        fetchViewings();
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredViewings = filter === 'all' 
    ? viewings 
    : viewings.filter(v => v.status === filter);

  const statusColors = {
    pending: 'bg-yellow-600/20 text-yellow-500 border-yellow-600',
    confirmed: 'bg-green-600/20 text-green-500 border-green-600',
    declined: 'bg-red-600/20 text-red-500 border-red-600'
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#111111] border border-[#333333] h-32" />
        ))}
      </div>
    );
  }

  return (
    <div data-testid="admin-viewings">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-['Playfair_Display'] text-3xl text-[#F5F0EB]">Viewing Requests</h1>
          <p className="text-[#A3A3A3] text-sm font-light mt-1">
            {viewings.length} total • {viewings.filter(v => v.status === 'pending').length} pending
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'declined'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 text-xs tracking-[0.1em] uppercase transition-colors ${
                filter === status
                  ? 'bg-[#F5F0EB] text-[#0A0A0A]'
                  : 'border border-[#333333] text-[#A3A3A3] hover:text-[#F5F0EB]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Viewings List */}
      {filteredViewings.length === 0 ? (
        <div className="bg-[#111111] border border-[#333333] p-12 text-center">
          <Calendar className="w-12 h-12 stroke-1 text-[#333333] mx-auto mb-4" />
          <p className="text-[#A3A3A3]">
            {filter === 'all' ? 'No viewing requests yet' : `No ${filter} viewings`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredViewings.map((viewing) => (
            <div
              key={viewing.id}
              data-testid={`viewing-row-${viewing.id}`}
              className="bg-[#111111] border border-[#333333] p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-[#F5F0EB] font-medium">{viewing.full_name}</h3>
                    <span className={`text-xs px-2 py-1 border uppercase ${statusColors[viewing.status]}`}>
                      {viewing.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[#A3A3A3] text-sm">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4 stroke-1" />
                      <a href={`mailto:${viewing.email}`} className="hover:text-[#F5F0EB]">{viewing.email}</a>
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4 stroke-1" />
                      <a href={`tel:${viewing.phone_number}`} className="hover:text-[#F5F0EB]">{viewing.phone_number}</a>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                {viewing.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateStatus(viewing.id, 'confirmed')}
                      data-testid={`confirm-viewing-${viewing.id}`}
                      className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white text-xs hover:bg-green-700 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      CONFIRM
                    </button>
                    <button
                      onClick={() => updateStatus(viewing.id, 'declined')}
                      data-testid={`decline-viewing-${viewing.id}`}
                      className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white text-xs hover:bg-red-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      DECLINE
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-2 text-[#F5F0EB]">
                  <MapPin className="w-4 h-4 stroke-1 text-[#A3A3A3]" />
                  {viewing.property_address}
                </span>
                <span className="flex items-center gap-2 text-[#A3A3A3]">
                  <Calendar className="w-4 h-4 stroke-1" />
                  Preferred: {formatDate(viewing.preferred_date)}
                </span>
                <span className="flex items-center gap-2 text-[#A3A3A3]">
                  <Clock className="w-4 h-4 stroke-1" />
                  Requested: {formatDate(viewing.created_at)}
                </span>
              </div>

              {viewing.message && (
                <div className="mt-4 bg-[#0A0A0A] border border-[#333333] p-4">
                  <p className="text-[#A3A3A3] text-sm font-light">{viewing.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminViewings;
