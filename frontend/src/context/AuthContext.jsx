import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cge_admin_token');
    const userData = localStorage.getItem('cge_admin_user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    localStorage.setItem('cge_admin_token', userData.token);
    localStorage.setItem('cge_admin_user', JSON.stringify({ email: userData.email, name: userData.name }));
    setUser({ email: userData.email, name: userData.name });
  };

  const logout = () => {
    localStorage.removeItem('cge_admin_token');
    localStorage.removeItem('cge_admin_user');
    setUser(null);
  };

  const getToken = () => localStorage.getItem('cge_admin_token');

  return (
    <AuthContext.Provider value={{ user, login, logout, getToken, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
