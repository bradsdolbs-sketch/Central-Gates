import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Building, Mail, Calendar, TrendingUp, Plus } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminDashboard = () => {
  const { getToken } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [getToken]);

  const statCards = [
    {
      title: 'Total Properties',
      value: stats?.properties?.total || 0,
      subtitle: `${stats?.properties?.available || 0} available`,
      icon: Building,
      link: '/admin/properties',
      color: 'text-[#F5F0EB]'
    },
    {
      title: 'Featured Listings',
      value: stats?.properties?.featured || 0,
      subtitle: 'Currently highlighted',
      icon: TrendingUp,
      link: '/admin/properties',
      color: 'text-[#F5F0EB]'
    },
    {
      title: 'Contact Enquiries',
      value: stats?.contacts?.total || 0,
      subtitle: `${stats?.contacts?.unread || 0} unread`,
      icon: Mail,
      link: '/admin/contacts',
      color: 'text-[#F5F0EB]'
    },
    {
      title: 'Viewing Requests',
      value: stats?.viewings?.total || 0,
      subtitle: `${stats?.viewings?.pending || 0} pending`,
      icon: Calendar,
      link: '/admin/viewings',
      color: 'text-[#F5F0EB]'
    },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 bg-[#1A1A1A] rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-[#111111] border border-[#333333] p-6 h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div data-testid="admin-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-['Playfair_Display'] text-3xl text-[#F5F0EB]">Dashboard</h1>
          <p className="text-[#A3A3A3] text-sm font-light mt-1">Welcome to your admin panel</p>
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={index}
              to={card.link}
              data-testid={`stat-card-${index}`}
              className="bg-[#111111] border border-[#333333] p-6 hover:border-[#555555] transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <Icon className="w-6 h-6 stroke-1 text-[#A3A3A3] group-hover:text-[#F5F0EB] transition-colors" />
              </div>
              <div className="font-['Playfair_Display'] text-4xl text-[#F5F0EB] mb-1">
                {card.value}
              </div>
              <div className="text-[#F5F0EB] text-sm font-light">{card.title}</div>
              <div className="text-[#A3A3A3] text-xs mt-1">{card.subtitle}</div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-[#111111] border border-[#333333] p-8">
        <h2 className="font-['Playfair_Display'] text-xl text-[#F5F0EB] mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/properties/new"
            className="flex items-center gap-3 p-4 bg-[#0A0A0A] border border-[#333333] hover:border-[#555555] transition-colors"
          >
            <Building className="w-5 h-5 stroke-1 text-[#F5F0EB]" />
            <span className="text-[#F5F0EB] text-sm font-light">Add New Property</span>
          </Link>
          <Link
            to="/admin/contacts"
            className="flex items-center gap-3 p-4 bg-[#0A0A0A] border border-[#333333] hover:border-[#555555] transition-colors"
          >
            <Mail className="w-5 h-5 stroke-1 text-[#F5F0EB]" />
            <span className="text-[#F5F0EB] text-sm font-light">View Enquiries</span>
          </Link>
          <Link
            to="/admin/viewings"
            className="flex items-center gap-3 p-4 bg-[#0A0A0A] border border-[#333333] hover:border-[#555555] transition-colors"
          >
            <Calendar className="w-5 h-5 stroke-1 text-[#F5F0EB]" />
            <span className="text-[#F5F0EB] text-sm font-light">Manage Viewings</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
