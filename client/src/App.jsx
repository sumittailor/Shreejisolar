import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import QuotationModal from './components/QuotationModal';
import HomePage from './pages/HomePage';
import PlansPage from './pages/PlansPage';
import CleaningPage from './pages/CleaningPage';
import SubsidyPage from './pages/SubsidyPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { fetchSolarPlans } from './services/api';

// Scroll to top helper
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainLayout({ children, onOpenQuote }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {!isAdminRoute && <Navbar onOpenQuote={onOpenQuote} />}
      <main className="flex-1">{children}</main>
      {!isAdminRoute && <Footer onOpenQuote={onOpenQuote} />}
      {!isAdminRoute && <FloatingWhatsApp />}
    </div>
  );
}

export default function App() {
  const [plans, setPlans] = useState([]);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [quoteDefaults, setQuoteDefaults] = useState({
    service: 'New Installation',
    package: '',
    capacity: '',
  });

  const loadPlans = async () => {
    try {
      const data = await fetchSolarPlans();
      if (data && data.length > 0) {
        setPlans(data);
      }
    } catch (err) {
      console.warn('Could not fetch live plans, using default catalogue:', err.message);
      // Fallback default plans in case API is temporarily booting
      setPlans([
        {
          id: 1,
          slug: 'plan-3kw',
          name: '3 kW Solar System',
          capacity: '3 kW',
          listed_price: 180000,
          estimated_net_price: 'To be verified based on scheme & property eligibility',
          subsidy_info: 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
          components: 'Tier-1 Mono PERC / TopCon Solar Panels, Grid-Tied Solar Inverter, GI Structure, AC/DC Protection Box, Earthing Kit (To be confirmed)',
          inclusions: 'Site Survey, Structural Installation, Net-Metering Assistance, Civil Work & Testing (To be confirmed)',
          warranty: '25-Year Panel Performance Warranty (To be confirmed)',
          property_type: 'Residential Rooftop / Small Commercial',
        },
        {
          id: 2,
          slug: 'plan-5kw',
          name: '5 kW Solar System',
          capacity: '5 kW',
          listed_price: 270000,
          estimated_net_price: 'To be verified based on scheme & property eligibility',
          subsidy_info: 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
          components: 'High-Efficiency Solar Modules, High-Rating Inverter, Heavy-Duty Wind-Resistant Mounting (To be confirmed)',
          inclusions: 'End-to-end Installation, Earthing & Lightning Protection, Net-metering Paperwork support (To be confirmed)',
          warranty: '25-Year Module Warranty (To be confirmed)',
          property_type: 'Medium to Large Home / Independent Villa',
        },
        {
          id: 3,
          slug: 'plan-6kw',
          name: '6 kW Solar System',
          capacity: '6 kW',
          listed_price: 350000,
          estimated_net_price: 'To be verified based on scheme & property eligibility',
          subsidy_info: 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
          components: 'High-Output Bifacial / Mono PERC Panels, Smart Inverter, Premium Cabling (To be confirmed)',
          inclusions: 'Custom Rooftop Engineering, Complete Electrical Inclusions, Safety Inspection (To be confirmed)',
          warranty: '25-Year Performance Warranty (To be confirmed)',
          property_type: 'Large Residential / Commercial Shops',
        },
        {
          id: 4,
          slug: 'plan-8kw',
          name: '8 kW Solar System',
          capacity: '8 kW',
          listed_price: 400000,
          estimated_net_price: 'To be verified based on scheme & property eligibility',
          subsidy_info: 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
          components: 'Commercial Grade Solar Modules, Industrial String Inverter, Heavy Mounting Structure (To be confirmed)',
          inclusions: 'Full Turnkey Installation, Regulatory Grid Interconnection Support, System Commissioning (To be confirmed)',
          warranty: '25-Year Performance Warranty (To be confirmed)',
          property_type: 'Commercial Rooftop / Factory / Multi-Story Residence',
        },
      ]);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleOpenQuote = (service = 'New Installation', packageName = '', capacity = '') => {
    setQuoteDefaults({
      service,
      package: packageName,
      capacity,
    });
    setQuoteModalOpen(true);
  };

  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <ScrollToTop />
          <MainLayout onOpenQuote={handleOpenQuote}>
            <Routes>
              <Route path="/" element={<HomePage plans={plans} onOpenQuote={handleOpenQuote} />} />
              <Route path="/plans" element={<PlansPage plans={plans} onOpenQuote={handleOpenQuote} />} />
              <Route path="/cleaning" element={<CleaningPage />} />
              <Route path="/subsidy" element={<SubsidyPage onOpenQuote={handleOpenQuote} />} />
              <Route path="/about" element={<AboutPage onOpenQuote={handleOpenQuote} />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </MainLayout>

          <QuotationModal
            isOpen={quoteModalOpen}
            onClose={() => setQuoteModalOpen(false)}
            initialService={quoteDefaults.service}
            initialPackage={quoteDefaults.package}
            initialCapacity={quoteDefaults.capacity}
            plans={plans}
          />
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  );
}
