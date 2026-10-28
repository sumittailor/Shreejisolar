import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle2, AlertCircle, Loader2, Sun } from 'lucide-react';
import { submitEnquiry } from '../services/api';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppUrl } from '../services/whatsapp';

export default function ContactPage() {
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    customer_name: '',
    mobile: '',
    email: '',
    city: '',
    property_type: 'Home',
    service_required: 'New Installation',
    desired_capacity: '',
    additional_notes: '',
    consent: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  const waUrl = getWhatsAppUrl({
    whatsappNumber: settings.whatsapp_number,
    isGeneral: true,
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
      setError('Please provide a valid contact number.');
      return;
    }
    if (!formData.city.trim()) {
      setError('Please enter your city / location.');
      return;
    }
    if (!formData.consent) {
      setError('Please consent to receive contact from our solar team.');
      return;
    }

    setLoading(true);
    try {
      const res = await submitEnquiry(formData);
      if (res.success) {
        setSuccessResult({
          reference_no: res.reference_no,
          customer_name: formData.customer_name,
        });
      } else {
        setError(res.message || 'Submission failed.');
      }
    } catch (err) {
      setError(err.message || 'Server error. Please reach out via WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
          <Phone className="w-3.5 h-3.5" /> Direct Contact
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] tracking-tight">
          Get in Touch with Our Solar Specialists
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Request an on-site solar feasibility survey, inquire about solar panel cleaning schedules, or discuss commercial solar solutions.
        </p>
      </section>

      {/* Grid: Contact Info + Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0A192F] text-white p-7 rounded-3xl shadow-lg space-y-6">
              <div>
                <h3 className="text-xl font-black text-amber-400">SHREE JI SOLAR EXPERTS</h3>
                <p className="text-xs text-slate-300 mt-1">
                  Solar Panel Installation • Cleaning • Maintenance Solutions
                </p>
              </div>

              <div className="space-y-4 text-xs">
                {settings.contact_phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Phone Number</span>
                      <a href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`} className="text-white hover:text-amber-400 font-semibold text-sm">
                        {settings.contact_phone}
                      </a>
                    </div>
                  </div>
                )}

                {settings.business_email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px]">Official Email</span>
                      <a href={`mailto:${settings.business_email}`} className="text-white hover:text-amber-400 font-semibold text-sm">
                        {settings.business_email}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Office Address</span>
                    <span className="text-slate-200">
                      {settings.business_address || 'Regional Headquarters - Configurable in Admin'}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Sun className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Service Area</span>
                    <span className="text-slate-200">
                      {settings.service_areas || 'Residential & Commercial Solar coverage'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs shadow transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  Connect Instantly on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            {successResult ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Enquiry Submitted!</h3>
                <p className="text-xs text-slate-600">
                  Thank you, {successResult.customer_name}. Reference Number:
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl font-mono font-bold text-lg text-[#0A192F]">
                  {successResult.reference_no}
                </div>
                <p className="text-xs text-slate-500">
                  Our team will contact you shortly regarding your service requirements.
                </p>
                <div className="pt-2">
                  <a
                    href={getWhatsAppUrl({
                      whatsappNumber: settings.whatsapp_number,
                      referenceNo: successResult.reference_no,
                      customerName: successResult.customer_name,
                    })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl text-xs shadow transition"
                  >
                    <MessageCircle className="w-4 h-4" /> Continue on WhatsApp
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Send an Enquiry Message</h3>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      required
                      value={formData.customer_name}
                      onChange={handleChange}
                      placeholder="Your name"
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
                      Email Address
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
                      City / Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="e.g. Jaipur"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Service Required
                    </label>
                    <select
                      name="service_required"
                      value={formData.service_required}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white"
                    >
                      <option value="New Installation">New Installation</option>
                      <option value="Solar Panel Cleaning">Solar Panel Cleaning</option>
                      <option value="Maintenance & Servicing">Maintenance & Servicing</option>
                      <option value="Commercial Solar">Commercial Solar</option>
                      <option value="System Inspection">System Inspection</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Desired Capacity (Approx)
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

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Message / Rooftop Details
                  </label>
                  <textarea
                    name="additional_notes"
                    rows="3"
                    value={formData.additional_notes}
                    onChange={handleChange}
                    placeholder="Tell us about your property, power requirements, or specific requests..."
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
                      I authorize Shree Ji Solar Experts to contact me regarding this enquiry.
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
                        Submitting Enquiry...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-400" />
                        Send Solar Enquiry
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
