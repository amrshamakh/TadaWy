import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CTA from "../components/Landing/Cta";
import Features from "../components/Landing/Features";
import Footer from "../components/Landing/Footer";
import Hero from "../components/Landing/Hero";
import Navbar from "../components/Navbar";


// Complete TadaWy Landing Page
const LandingPage = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role?.toLowerCase() === "doctor") {
      navigate("/doctor");
    }
  }, [role, navigate]);

  return (
    <div className="min-h-screen">
      <div className="max-h-screen w-full">

        {/* Hero Section */}

        <Hero />
      </div>

      <Features />

      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
