import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sun,
  ShieldCheck,
  Zap,
  Sparkles,
  Wrench,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  HelpCircle,
  PhoneCall,
  ChevronDown,
  Building2,
  Home,
  Check,
  ClipboardList
} from 'lucide-react';
import PlanCard from '../components/PlanCard';
import SubsidyNotice from '../components/SubsidyNotice';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppUrl } from '../services/whatsapp';

export default function HomePage({ plans = [], onOpenQuote }) {
  const { settings } = useSettings();
  const [activeFaq, setActiveFaq] = useState(null);

  const waUrl = getWhatsAppUrl({
    whatsappNumber: settings.whatsapp_number,
    isGeneral: true,
  });

  const faqs = [
    {
      q: 'How much rooftop space is required for a solar installation?',
      a: 'As a rule of thumb, each 1 kW of solar rooftop system requires approximately 80 to 100 square feet of shadow-free rooftop area. For a 3 kW system, you need roughly 250-300 sq. ft. Our technical engineers perform a physical site assessment before finalizing layout.'
    },
    {
      q: 'How does the government subsidy work for residential solar?',
      a: 'Under the PM Surya Ghar: Muft Bijli Yojana, eligible residential consumers can receive up to ₹78,000 in central assistance for systems of 3 kW or higher. The subsidy is credited directly to your bank account after system commissioning and inspection by your DISCOM.'
    },
    {
      q: 'Why is professional solar panel cleaning necessary?',
      a: 'Dust, bird droppings, soot, and mineral deposits block sunlight from reaching the photovoltaic cells. Regular demineralized water cleaning can restore up to 15-25% of lost generation efficiency without scratching solar glass.'
    },
    {
      q: 'Can I install a solar system for my commercial shop or factory?',
      a: 'Yes! We engineer heavy-duty commercial rooftop solar solutions for shops, offices, warehouses, and factories to dramatically lower daytime tariff expenses and optimize peak power demand.'
    },
    {
      q: 'What is net-metering and who handles the paperwork?',
      a: 'A net-meter records both the electricity you consume from the grid and the excess solar power you export. Shree Ji Solar Experts assists with the complete discom documentation, load feasibility, and net-metering liaison.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#0A192F] via-[#0F243E] to-[#0A192F] text-white pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-wide">
                <Sun className="w-4 h-4 animate-spin-slow" />
                <span>SHREE JI SOLAR EXPERTS</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight sm:leading-none text-white">
                Power Your Home and Business with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                  Solar Energy
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Solar installation, professional panel cleaning and maintenance solutions from Shree Ji Solar Experts.
              </p>

              {/* Hero Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  to="/plans"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-3.5 rounded-xl text-sm shadow-lg hover:shadow-amber-500/30 transition transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                >
                  <Sun className="w-4 h-4" />
                  Explore Solar Plans
                </Link>

                <button
                  onClick={() => onOpenQuote('New Installation')}
                  className="bg-[#152B4B] hover:bg-[#1C3A66] text-white font-bold px-6 py-3.5 rounded-xl text-sm border border-slate-700 shadow-md transition transform hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-400" />
                  Get a Free Quote
                </button>

                <Link
                  to="/cleaning"
                  className="bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white font-bold px-5 py-3.5 rounded-xl text-sm border border-slate-700/80 transition flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Book Solar Cleaning
                </Link>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-3.5 rounded-xl text-sm shadow transition flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
              </div>

              {/* Assurance Badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-left">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Tier-1 Solar Modules</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Govt Subsidy Guidance</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Periodic Cleaning & Care</span>
                </div>
              </div>
            </div>

            {/* Right Visual Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-800">
                  <img
                    src="/logo.jpg"
                    alt="Shree Ji Solar Logo"
                    className="w-16 h-16 object-contain rounded-xl bg-white p-1"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-white">Clean Energy Specialists</h2>
                    <p className="text-xs text-amber-400">Rooftop Solar & Maintenance Services</p>
                  </div>
                </div>

                <div className="space-y-4 py-6">
                  <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 flex items-start gap-3">
                    <Sun className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Residential Rooftop Solar</h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Cut your domestic electricity bills up to 90% with durable rooftop solar arrays.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Commercial & Industrial Solar</h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        High capacity grid-tied solar for commercial shops, factories, and institutions.
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/50 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-bold text-white">Professional Panel Cleaning</h3>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Maintain maximum peak generation with specialized washing and maintenance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => onOpenQuote('New Installation')}
                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-md"
                  >
                    Request Free On-Site Inspection
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. OUR CORE SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Comprehensive Solar Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A192F] tracking-tight">
            Our Solar Business Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            End-to-end solar engineering, equipment selection, government compliance, and ongoing maintenance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {/* Service 1 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Sun className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">New Solar Panel System Installation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complete turnkey installation for brand new properties, providing high-efficiency photovoltaic modules, premium inverters, and heavy structural framing.
            </p>
            <button
              onClick={() => onOpenQuote('New Installation')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
            >
              Request Installation Quote <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Service 2 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Residential Rooftop Solar Installation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tailored residential rooftop systems (3 kW to 8 kW) optimized for household appliances, AC loads, and maximum savings under the PM Surya Ghar scheme.
            </p>
            <button
              onClick={() => onOpenQuote('New Installation')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Check Residential Plans <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Service 3 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Commercial Solar Installation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Designed for offices, commercial complexes, and industrial plants. Cut peak operating costs with substantial capital depreciation benefits.
            </p>
            <button
              onClick={() => onOpenQuote('Commercial Solar')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Get Commercial Feasibility <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Service 4 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 bg-cyan-50 text-cyan-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Solar Panel Cleaning Services</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Specialized washing using demineralized water and scratch-free solar brushes. Restores lost efficiency caused by dust, soot, and environmental debris.
            </p>
            <Link
              to="/cleaning"
              className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
            >
              Book Cleaning Service <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Service 5 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Solar Maintenance & Servicing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Routine health checkups of inverter parameters, earthing resistance, cabling continuity, surge protection devices, and structural fasteners.
            </p>
            <button
              onClick={() => onOpenQuote('Maintenance & Servicing')}
              className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
            >
              Schedule Servicing <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Service 6 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Existing Solar System Inspection</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Having issues with an existing solar installation? Our engineers inspect generation bottlenecks, hotspot faults, and metering concerns.
            </p>
            <button
              onClick={() => onOpenQuote('System Inspection')}
              className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              Request System Audit <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. SOLAR INSTALLATION PACKAGES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="plans-section">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Transparent Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A192F] tracking-tight">
            Our Solar Installation Plans
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Compare our standard capacity packages. Prices and details are dynamically updated from our central database.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSelectForQuote={(p) =>
                onOpenQuote('New Installation', p.name, p.capacity)
              }
            />
          ))}
        </div>

        {/* Custom Capacity Banner */}
        <div className="mt-8 bg-slate-100 rounded-2xl p-6 text-center border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-slate-900 text-sm sm:text-base">
              Need a Custom Capacity (e.g. 10 kW, 15 kW, 25 kW or Commercial)?
            </h4>
            <p className="text-xs text-slate-600">
              We design custom solar power plants tailored to your rooftop load and electricity tariff requirements.
            </p>
          </div>
          <button
            onClick={() => onOpenQuote('Commercial Solar', 'Custom Capacity Solar', 'Custom')}
            className="bg-[#0A192F] hover:bg-[#152B4B] text-white text-xs font-bold px-5 py-3 rounded-xl shadow shrink-0 transition"
          >
            Request Custom Quotation
          </button>
        </div>
      </section>

      {/* 4. GOVERNMENT SOLAR SUBSIDY NOTICE */}
      <SubsidyNotice onOpenQuote={onOpenQuote} />

      {/* 5. HOW OUR INSTALLATION PROCESS WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Hassle-Free Implementation
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A192F] tracking-tight">
            How Our Installation Process Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            From technical rooftop survey to power generation and net-metering synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {/* Step 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm mb-4">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Site Survey & Load Check</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We assess rooftop orientation, shadow patterns, structural strength, and analyze your historical electricity bills.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm mb-4">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Custom Design & Quote</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You receive an itemized quotation, system simulation, estimated generation forecast, and applicable subsidy eligibility.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm mb-4">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Installation & Civil Work</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Certified engineers erect wind-resistant mounting structures, install panels, connect inverters, and set up earthing.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm mb-4">
              04
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Net-Metering & Handover</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We coordinate with your DISCOM for bi-directional meter installation, system energization, and digital monitoring setup.
            </p>
          </div>
        </div>
      </section>

      {/* 6. SOLAR PANEL CLEANING HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0A192F] to-[#152B4B] text-white rounded-3xl p-8 sm:p-12 overflow-hidden relative shadow-xl">
          <div className="max-w-2xl space-y-5 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-400/30">
              <Sparkles className="w-3.5 h-3.5" /> Maintenance & Cleaning
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Maintain Peak Generation with Professional Solar Cleaning
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Soiling losses from environmental dust and pollution reduce solar output drastically. We provide one-time and recurring professional cleaning with soft brushes and demineralized wash solutions.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/cleaning"
                className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition shadow"
              >
                Explore Cleaning Services
              </Link>
              <button
                onClick={() => onOpenQuote('Solar Panel Cleaning')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider border border-white/20 transition"
              >
                Request Cleaning Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Got Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A192F] tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-600">
            Key details about solar panel installations, subsidies, and maintenance.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-amber-600 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-amber-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
