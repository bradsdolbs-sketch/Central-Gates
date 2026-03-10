import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { LayoutDashboard, Building, Mail, Calendar, LogOut, ChevronRight } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_landlord-portal-17/artifacts/g2hvvylh_Logo.png";

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/properties', label: 'Properties', icon: Building },
    { path: '/admin/contacts', label: 'Contact Enquiries', icon: Mail },
    { path: '/admin/viewings', label: 'Viewing Requests', icon: Calendar },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-[#333333] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#333333]">
          <Link to="/">
            <img src={LOGO_URL} alt="CGE" className="h-10 w-auto" />
          </Link>
          <p className="text-[#A3A3A3] text-xs mt-2">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`admin-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                  active 
                    ? 'bg-[#F5F0EB] text-[#0A0A0A]' 
                    : 'text-[#A3A3A3] hover:text-[#F5F0EB] hover:bg-[#1A1A1A]'
                }`}
              >
                <Icon className="w-5 h-5 stroke-1" />
                <span className="text-sm font-light">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-[#333333]">
          <div className="text-[#F5F0EB] text-sm font-light mb-1">{user?.name}</div>
          <div className="text-[#A3A3A3] text-xs mb-4">{user?.email}</div>
          <button
            onClick={handleLogout}
            data-testid="admin-logout-btn"
            className="flex items-center gap-2 text-[#A3A3A3] hover:text-[#F5F0EB] transition-colors text-sm"
          >
            <LogOut className="w-4 h-4 stroke-1" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Breadcrumb */}
        <div className="bg-[#111111] border-b border-[#333333] px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/admin" className="text-[#A3A3A3] hover:text-[#F5F0EB]">Admin</Link>
            {location.pathname !== '/admin' && (
              <>
                <ChevronRight className="w-4 h-4 text-[#555555]" />
                <span className="text-[#F5F0EB] capitalize">
                  {location.pathname.split('/').pop().replace(/-/g, ' ')}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
