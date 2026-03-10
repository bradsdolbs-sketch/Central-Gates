import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { HelmetProvider } from "react-helmet-async";
import HomePage from "@/pages/HomePage";
import PropertiesPage from "@/pages/PropertiesPage";
import PropertyDetailPage from "@/pages/PropertyDetailPage";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProperties from "@/pages/admin/AdminProperties";
import AdminContacts from "@/pages/admin/AdminContacts";
import AdminViewings from "@/pages/admin/AdminViewings";
import AdminPropertyForm from "@/pages/admin/AdminPropertyForm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import AdminLayout from "@/components/AdminLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <HelmetProvider>
      <div className="App min-h-screen bg-[#0A0A0A]">
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Navbar />
                <HomePage />
                <Footer />
                <FloatingButtons />
              </>
            } />
            <Route path="/properties" element={
              <>
                <Navbar />
                <PropertiesPage />
                <Footer />
                <FloatingButtons />
              </>
            } />
            <Route path="/properties/:id" element={
              <>
                <Navbar />
                <PropertyDetailPage />
                <Footer />
                <FloatingButtons />
              </>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="properties/new" element={<AdminPropertyForm />} />
              <Route path="properties/:id/edit" element={<AdminPropertyForm />} />
              <Route path="contacts" element={<AdminContacts />} />
              <Route path="viewings" element={<AdminViewings />} />
            </Route>
          </Routes>
          <Toaster 
            position="top-right" 
            toastOptions={{
              style: {
                background: '#111111',
                color: '#F5F0EB',
                border: '1px solid #333333',
              },
            }}
          />
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}

export default App;
