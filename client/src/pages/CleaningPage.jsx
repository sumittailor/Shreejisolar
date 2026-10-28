import React, { useState } from 'react';
import {
  Sparkles,
  Droplets,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageCircle,
  Send,
  Building2,
  Home,
  Wrench,
  Info
} from 'lucide-react';
import { submitEnquiry } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppUrl } from '../services/whatsapp';

export default function CleaningPage() {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    customer_name: '',
    mobile: '',
    email: '',
    city: '',
    property_type: 'Home',
    service_required: 'Solar Panel Cleaning',
    desired_capacity: '',
    panel_count: '',
    preferred_date: '',
    additional_notes: '',
    consent: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  const waUrl = getWhatsAppUrl({
    whatsappNumber: settings.whatsapp_number,
    service: 'Solar Panel Cleaning',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.mobile.trim()) {
      setError('Please enter a valid mobile number.');
      return;
    }
    if (!formData.city.trim()) {
      setError('Please enter your city and service location.');
      return;
    }
    if (!formData.consent) {
      setError('Please agree to receive service contact.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitEnquiry({
        ...formData,
        service_required: 'Solar Panel Cleaning',
      });
      if (res.success) {
        setSuccessResult({
          reference_no: res.reference_no,
          customer_name: formData.customer_name,
        });
      } else {
        setError(res.message || 'Failed to submit cleaning request.');
      }
    } catch (err) {
      setError(err.message || 'Error saving cleaning booking. Please contact via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 space-y-16">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-600 text-xs font-bold uppercase tracking-wider border border-cyan-500/20">
          <Sparkles className="w-3.5 h-3.5" /> Professional Maintenance
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] tracking-tight">
          Solar Panel Cleaning & Maintenance Services
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Restore photovoltaic efficiency with demineralized washing, soft non-abrasive brushes, and comprehensive electrical health inspections.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <a
            href="#booking-form"
            className="bg-[#0A192F] hover:bg-[#152B4B] text-white text-xs font-bold px-6 py-3 rounded-xl shadow transition"
          >
            Book Cleaning Service
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow transition flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Us
          </a>
        </div>
      </section>

      {/* Services Overview Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Residential Solar Cleaning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Safe rooftop panel washing for villas and residential societies. We remove dust, bird droppings, and leaves without damaging the anti-reflective glass coating.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" /> Soft solar brush equipment
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" /> Non-abrasive, spot-free rinse
              </li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Commercial Solar Cleaning</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              High capacity cleaning for large rooftop arrays on factories, commercial shops, and institutions. Includes pressure-regulated wash and safety rigging.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Large area rapid cleaning
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" /> Safety harnessed certified technicians
              </li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Inspection & Servicing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Electrical inspection of existing solar systems: check inverter performance, examine MC4 connectors, test earthing rods, and torque check mounting brackets.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Fault code diagnosis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" /> Wiring & hotspot verification
              </li>
            </ul>
          </div>
        </div>

        {/* Pricing Transparency Disclaimer */}
        <div className="mt-8 bg-amber-50/70 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            <strong>Transparent Service Pricing:</strong> Cleaning charges are configured based on total panel count, rooftop height accessibility, water source proximity, and single-visit vs. quarterly maintenance plans. Request a personalized quotation below for exact rates.
          </p>
        </div>
      </section>

      {/* Booking & Quotation Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" id="booking-form">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-[#0A192F] text-white p-6 text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-black">
              Book Cleaning or Maintenance Service
            </h2>
            <p className="text-xs text-slate-300">
              Fill in your system details and preferred date for a customized cleaning quote.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            {successResult ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Cleaning Booking Requested!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, {successResult.customer_name}. Your cleaning and maintenance enquiry has been assigned Reference Number:
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl font-mono font-bold text-lg text-[#0A192F]">
                  {successResult.reference_no}
                </div>
                <p className="text-xs text-slate-500">
                  Our service team will confirm service technician schedule and pricing.
                </p>

                <div className="pt-2">
                  <a
                    href={getWhatsAppUrl({
                      whatsappNumber: settings.whatsapp_number,
                      referenceNo: successResult.reference_no,
                      service: 'Solar Panel Cleaning',
                      customerName: successResult.customer_name,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs shadow transition"
                  >
                    <MessageCircle className="w-4 h-4" /> Continue on WhatsApp with Reference
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Customer Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      required
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City & Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Jaipur, Vaishali Nagar"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Approx Number of Solar Panels
                    </label>
                    <input
                      type="number"
                      name="panel_count"
                      min="1"
                      value={formData.panel_count}
                      onChange={handleChange}
                      placeholder="e.g. 8, 12, 24, 60"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Existing System Capacity
                    </label>
                    <input
                      type="text"
                      name="desired_capacity"
                      value={formData.desired_capacity}
                      onChange={handleChange}
                      placeholder="e.g. 3 kW, 5 kW, 10 kW"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Cleaning or Maintenance Type
                    </label>
                    <select
                      name="property_type"
                      value={formData.property_type}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="Home">Residential Rooftop</option>
                      <option value="Shop">Commercial Shop</option>
                      <option value="Office">Office Building</option>
                      <option value="Factory">Factory / Industrial Shed</option>
                      <option value="Other">Recurring Maintenance Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Service Date
                    </label>
                    <input
                      type="date"
                      name="preferred_date"
                      value={formData.preferred_date}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Specific Issues or Requirements
                  </label>
                  <textarea
                    name="additional_notes"
                    rows="2"
                    value={formData.additional_notes}
                    onChange={handleChange}
                    placeholder="e.g. Water connection available on roof? Severe pigeon nesting? Inverter error code?"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm"
                  ></textarea>
                </div>

                <div className="pt-1">
                  <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      className="mt-0.5 rounded text-amber-600"
                    />
                    <span>
                      I agree to receive a cleaning quote and service confirmation from Shree Ji Solar Experts.
                    </span>
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#0A192F] hover:bg-[#152B4B] text-white py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow transition text-sm disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving Cleaning Booking...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        Book Cleaning / Request Cleaning Quote
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
