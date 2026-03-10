import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const LOGO_URL = "https://customer-assets.emergentagent.com/job_landlord-portal-17/artifacts/g2hvvylh_Logo.png";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('cge_admin_token', data.token);
        localStorage.setItem('cge_admin_user', JSON.stringify({ email: data.email, name: data.name }));
        toast.success(`Welcome back, ${data.name}`);
        navigate('/admin');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      toast.error('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <img src={LOGO_URL} alt="Central Gate Estates" className="h-20 w-auto mx-auto mb-6" />
          <h1 className="font-['Playfair_Display'] text-3xl text-[#F5F0EB]">Admin Portal</h1>
          <p className="text-[#A3A3A3] text-sm mt-2 font-light">Sign in to manage your properties</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-login-form">
          <div>
            <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">EMAIL ADDRESS</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              data-testid="admin-email-input"
              className="bg-[#111111] border-[#333333] text-[#F5F0EB] rounded-none h-12 focus:ring-1 focus:ring-[#FFFFFF] focus:border-[#FFFFFF]"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-[#A3A3A3] text-xs tracking-[0.1em] mb-2">PASSWORD</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="admin-password-input"
                className="bg-[#111111] border-[#333333] text-[#F5F0EB] rounded-none h-12 focus:ring-1 focus:ring-[#FFFFFF] focus:border-[#FFFFFF] pr-12"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-[#F5F0EB]"
              >
                {showPassword ? <EyeOff className="w-5 h-5 stroke-1" /> : <Eye className="w-5 h-5 stroke-1" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            data-testid="admin-login-btn"
            className="w-full bg-[#F5F0EB] text-[#0A0A0A] py-4 text-sm tracking-[0.15em] font-medium hover:bg-white transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        {/* Back Link */}
        <div className="text-center mt-8">
          <a href="/" className="text-[#A3A3A3] text-sm hover:text-[#F5F0EB] transition-colors">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
