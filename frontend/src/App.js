import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "@/pages/HomePage";
import PropertiesPage from "@/pages/PropertiesPage";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";

function App() {
  return (
    <div className="App min-h-screen bg-[#0A0A0A]">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
        </Routes>
        <Footer />
        <FloatingButtons />
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
  );
}

export default App;
