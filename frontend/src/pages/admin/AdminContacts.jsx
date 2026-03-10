import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Mail, Phone, Building, Clock, CheckCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminContacts = () => {
  const { getToken } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/contacts`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [getToken]);

  const markAsRead = async (contactId) => {
    try {
      await fetch(`${BACKEND_URL}/api/admin/contacts/${contactId}/read`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });
      fetchContacts();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    <div data-testid="admin-contacts">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-['Playfair_Display'] text-3xl text-[#F5F0EB]">Contact Enquiries</h1>
        <p className="text-[#A3A3A3] text-sm font-light mt-1">
          {contacts.length} total • {contacts.filter(c => !c.is_read).length} unread
        </p>
      </div>

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <div className="bg-[#111111] border border-[#333333] p-12 text-center">
          <Mail className="w-12 h-12 stroke-1 text-[#333333] mx-auto mb-4" />
          <p className="text-[#A3A3A3]">No contact enquiries yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              data-testid={`contact-row-${contact.id}`}
              className={`bg-[#111111] border p-6 ${
                contact.is_read ? 'border-[#333333]' : 'border-[#F5F0EB]'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[#F5F0EB] font-medium">{contact.full_name}</h3>
                    {!contact.is_read && (
                      <span className="bg-[#F5F0EB] text-[#0A0A0A] text-xs px-2 py-0.5">NEW</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-[#A3A3A3] text-sm">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4 stroke-1" />
                      <a href={`mailto:${contact.email}`} className="hover:text-[#F5F0EB]">{contact.email}</a>
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4 stroke-1" />
                      <a href={`tel:${contact.phone_number}`} className="hover:text-[#F5F0EB]">{contact.phone_number}</a>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[#A3A3A3] text-xs mb-2">
                    <Clock className="w-3 h-3 stroke-1" />
                    {formatDate(contact.created_at)}
                  </div>
                  {!contact.is_read && (
                    <button
                      onClick={() => markAsRead(contact.id)}
                      className="flex items-center gap-1 text-[#A3A3A3] text-xs hover:text-[#F5F0EB] transition-colors"
                    >
                      <CheckCircle className="w-3 h-3 stroke-1" />
                      Mark as read
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="flex items-center gap-1 text-[#A3A3A3]">
                  <Building className="w-4 h-4 stroke-1" />
                  {contact.number_of_properties} {contact.number_of_properties === '1' ? 'property' : 'properties'}
                </span>
                <span className="px-2 py-1 bg-[#1A1A1A] text-[#F5F0EB] text-xs">
                  {contact.looking_for}
                </span>
              </div>

              {contact.message && (
                <div className="bg-[#0A0A0A] border border-[#333333] p-4">
                  <p className="text-[#A3A3A3] text-sm font-light whitespace-pre-wrap">{contact.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
