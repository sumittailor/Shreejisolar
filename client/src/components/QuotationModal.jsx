import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, MessageCircle, Send, ShieldCheck, Sun } from 'lucide-react';
import { submitEnquiry } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppUrl } from '../services/whatsapp';

export default function QuotationModal({
  isOpen,
  onClose,
  initialService = 'New Installation',
  initialPackage = '',
  initialCapacity = '',
  plans = []
}) {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    customer_name: '',
    mobile: '',
    email: '',
    city: '',
    property_type: 'Home',
    service_required: initialService,
    desired_capacity: initialCapacity,
    selected_package: initialPackage,
    monthly_bill: '',
    panel_count: '',
    preferred_date: '',
    additional_notes: '',
    consent: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  // Sync props when opening
  useEffect(() => {
    if (isOpen) {
      setFormData(prev => ({
        ...prev,
        service_required: initialService || 'New Installation',
        selected_package: initialPackage || '',
        desired_capacity: initialCapacity || '',
      }));
      setError('');
      setSuccessResult(null);
    }
  }, [isOpen, initialService, initialPackage, initialCapacity]);

  if (!isOpen) return null;

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

    // Validation
    if (!formData.customer_name.trim()) {
      setError('Please provide your full name.');
      return;
    }
    if (!formData.mobile.trim()) {
      setError('Please enter a valid mobile number.');
      return;
    }
    if (!/^[+]?[\d\s-]{7,15}$/.test(formData.mobile.trim())) {
      setError('Please enter a valid phone number (e.g. +91 9876543210).');
      return;
    }
    if (formData.email && formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!formData.city.trim()) {
      setError('Please provide your city / installation location.');
      return;
    }
    if (!formData.consent) {
      setError('Please agree to receive a quotation and technical follow-up.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitEnquiry(formData);
      if (res.success) {
        setSuccessResult({
          reference_no: res.reference_no,
          message: res.message,
          customer_name: formData.customer_name,
          service: formData.service_required,
        });
      } else {
        setError(res.message || 'Submission failed. Please check your details.');
      }
    } catch (err) {
      setError(err.message || 'Failed to submit enquiry. Please try again or reach out on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 my-8 animate-fadeIn">
        
        {/* Header Bar */}
        <div className="bg-[#0A192F] text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight">
                {successResult ? 'Enquiry Confirmed' : 'Request Solar Quotation & Assessment'}
              </h3>
              <p className="text-xs text-slate-300">
                {successResult
                  ? 'Your enquiry is securely stored in our system'
                  : 'Get customized technical specs, pricing, and government subsidy details'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[80vh] overflow-y-auto">
          {successResult ? (
            /* Success Screen */
            <div className="text-center py-6 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Enquiry Successfully Recorded
                </span>
                <h4 className="text-2xl font-black text-slate-900 mt-2">
                  Thank You, {successResult.customer_name}!
                </h4>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Our solar specialists have received your requirement. A detailed quotation and site feasibility check are being prepared.
                </p>
              </div>

              {/* Reference Card */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md mx-auto text-left space-y-1">
                <p className="text-xs text-amber-800 font-medium">Your Enquiry Reference Number:</p>
                <p className="text-xl font-mono font-black text-[#0A192F] tracking-wide">
                  {successResult.reference_no}
                </p>
                <p className="text-[11px] text-amber-700">
                  Please keep this reference number for all future communications and subsidy assistance.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 max-w-md mx-auto pt-2">
                <a
                  href={getWhatsAppUrl({
                    whatsappNumber: settings.whatsapp_number,
                    referenceNo: successResult.reference_no,
                    service: successResult.service,
                    customerName: successResult.customer_name,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-600/30 transition text-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  Continue on WhatsApp with Reference
                </a>

                <button
                  onClick={onClose}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition text-sm"
                >
                  Done / Close
                </button>
              </div>
            </div>
          ) : (
            /* Form Screen */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Customer Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Customer Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    required
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Sharma"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (with country code) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(for quote copy)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Service Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Jaipur, Rajasthan"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              {/* Step 2: Property & Service Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="property_type"
                    value={formData.property_type}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white"
                  >
                    <option value="Home">Home / Residential Rooftop</option>
                    <option value="Shop">Shop / Retail Store</option>
                    <option value="Office">Office Commercial Building</option>
                    <option value="Factory">Factory / Industrial Shed</option>
                    <option value="Other">Other Property Type</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Required <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="service_required"
                    value={formData.service_required}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white"
                  >
                    <option value="New Installation">New Solar Panel Installation</option>
                    <option value="Solar Panel Cleaning">Solar Panel Cleaning Service</option>
                    <option value="Maintenance & Servicing">Maintenance & Servicing</option>
                    <option value="Commercial Solar">Commercial & Industrial Solar</option>
                    <option value="System Inspection">Inspection of Existing System</option>
                  </select>
                </div>
              </div>

              {/* Step 3: Technical Specifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Desired Solar Capacity <span className="text-slate-400 font-normal">(or choose package)</span>
                  </label>
                  <select
                    name="desired_capacity"
                    value={formData.desired_capacity}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white"
                  >
                    <option value="">Select or leave open for suggestion</option>
                    <option value="3 kW">3 kW (Avg 12-15 units/day)</option>
                    <option value="5 kW">5 kW (Avg 20-25 units/day)</option>
                    <option value="6 kW">6 kW (Avg 24-30 units/day)</option>
                    <option value="8 kW">8 kW (Avg 32-40 units/day)</option>
                    <option value="10+ kW Commercial">10+ kW Commercial</option>
                    <option value="Custom Size">Custom Engineering Size</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selected Package (Optional)
                  </label>
                  <select
                    name="selected_package"
                    value={formData.selected_package}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white"
                  >
                    <option value="">No specific package (General quote)</option>
                    {plans && plans.length > 0 ? (
                      plans.map(p => (
                        <option key={p.id} value={p.name}>
                          {p.name} — ₹{p.listed_price.toLocaleString('en-IN')}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="3 kW Solar System">3 kW Solar System — ₹1,80,000</option>
                        <option value="5 kW Solar System">5 kW Solar System — ₹2,70,000</option>
                        <option value="6 kW Solar System">6 kW Solar System — ₹3,50,000</option>
                        <option value="8 kW Solar System">8 kW Solar System — ₹4,00,000</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Step 4: Electricity Bill & Panels */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Approx Monthly Electricity Bill <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="monthly_bill"
                    value={formData.monthly_bill}
                    onChange={handleChange}
                    placeholder="e.g. ₹3,000 - ₹5,000"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Existing Panel Count / Preferred Date <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    name="preferred_date"
                    value={formData.preferred_date}
                    onChange={handleChange}
                    placeholder="e.g. Urgent / Next Week / 12 Panels"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              {/* Step 5: Additional Requirements */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Notes or Specific Requirements
                </label>
                <textarea
                  name="additional_notes"
                  rows="2"
                  value={formData.additional_notes}
                  onChange={handleChange}
                  placeholder="Tell us about rooftop space, shade conditions, inverter preference, or cleaning requirements..."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                ></textarea>
              </div>

              {/* Step 6: Consent */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleChange}
                    className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>
                    I consent to Shree Ji Solar Experts contacting me via phone, email, or WhatsApp with quotation details, technical site assessment, and government subsidy guidance.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0A192F] hover:bg-[#152B4B] text-white py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition active:scale-98 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving Enquiry & Generating Reference...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-400" />
                      Submit Enquiry & Get Free Quotation
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
