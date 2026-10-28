import React, { useState } from 'react';
import { Sun, CheckCircle2, ShieldCheck, Zap, Info, MessageCircle, ArrowRight } from 'lucide-react';
import PlanCard from '../components/PlanCard';
import SubsidyNotice from '../components/SubsidyNotice';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppUrl } from '../services/whatsapp';

export default function PlansPage({ plans = [], onOpenQuote }) {
  const { settings } = useSettings();
  const [propertyFilter, setPropertyFilter] = useState('all');

  const waUrl = getWhatsAppUrl({
    whatsappNumber: settings.whatsapp_number,
    service: 'Solar Installation Plans',
  });

  const filteredPlans = plans.filter(p => {
    if (propertyFilter === 'all') return true;
    if (propertyFilter === 'residential') return p.capacity.includes('3') || p.capacity.includes('5');
    if (propertyFilter === 'commercial') return p.capacity.includes('6') || p.capacity.includes('8');
    return true;
  });

  return (
    <div className="py-12 space-y-16">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
          <Sun className="w-3.5 h-3.5" /> High Performance Solar Systems
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] tracking-tight">
          Solar Installation Plans & Pricing
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Explore our certified rooftop solar packages. Each plan includes engineered mounting, premium grid-tied inverters, and full documentation support.
        </p>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPropertyFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              propertyFilter === 'all'
                ? 'bg-[#0A192F] text-white shadow'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Packages ({plans.length})
          </button>
          <button
            onClick={() => setPropertyFilter('residential')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              propertyFilter === 'residential'
                ? 'bg-[#0A192F] text-white shadow'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Residential Rooftop (3 - 5 kW)
          </button>
          <button
            onClick={() => setPropertyFilter('commercial')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              propertyFilter === 'commercial'
                ? 'bg-[#0A192F] text-white shadow'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            High Capacity / Commercial (6 - 8 kW)
          </button>
        </div>
      </section>

      {/* Plans Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onSelectForQuote={(p) =>
                onOpenQuote('New Installation', p.name, p.capacity)
              }
            />
          ))}
        </div>

        {/* Important Pricing & Subsidy Notes */}
        <div className="mt-10 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Important Pricing & Quotation Transparency:</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-2 list-disc pl-5">
            <li>
              Package prices listed above are standard base catalog figures and do not include unforeseen civil structural modifications (such as high-rise elevated stilt structures) or transmission cable extensions beyond standard limits.
            </li>
            <li>
              Net customer expenditure is determined once customer eligibility for central assistance (PM Surya Ghar scheme) is verified against consumer meter category and DISCOM feasibility.
            </li>
            <li>
              Component specifications and warranties marked as "To be confirmed" will be specified on your formal engineering quotation sheet after rooftop inspection.
            </li>
          </ul>
        </div>
      </section>

      {/* Capacity & Generation Comparison Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 bg-[#0A192F] text-white">
            <h3 className="text-lg font-bold">Capacity & Generation Matrix</h3>
            <p className="text-xs text-slate-300">
              Estimated generation and rooftop area requirement per solar system size.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <th className="p-4">Capacity</th>
                  <th className="p-4">Listed Price</th>
                  <th className="p-4">Daily Output (Avg)</th>
                  <th className="p-4">Monthly Output</th>
                  <th className="p-4">Required Rooftop Space</th>
                  <th className="p-4">Ideal For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr className="hover:bg-slate-50/80">
                  <td className="p-4 font-bold text-slate-900">3 kW System</td>
                  <td className="p-4 font-bold text-[#0A192F]">₹1,80,000</td>
                  <td className="p-4">12 – 15 Units</td>
                  <td className="p-4">360 – 450 Units</td>
                  <td className="p-4">~250 – 300 sq. ft.</td>
                  <td className="p-4">Small Homes (1-2 ACs, Refrigerator, Lights)</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-4 font-bold text-slate-900">5 kW System</td>
                  <td className="p-4 font-bold text-[#0A192F]">₹2,70,000</td>
                  <td className="p-4">20 – 25 Units</td>
                  <td className="p-4">600 – 750 Units</td>
                  <td className="p-4">~400 – 500 sq. ft.</td>
                  <td className="p-4">Medium Villas & Homes (2-3 ACs, Water Pump)</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-4 font-bold text-slate-900">6 kW System</td>
                  <td className="p-4 font-bold text-[#0A192F]">₹3,50,000</td>
                  <td className="p-4">24 – 30 Units</td>
                  <td className="p-4">720 – 900 Units</td>
                  <td className="p-4">~500 – 600 sq. ft.</td>
                  <td className="p-4">Large Residences, Retail Shops, Clinics</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-4 font-bold text-slate-900">8 kW System</td>
                  <td className="p-4 font-bold text-[#0A192F]">₹4,00,000</td>
                  <td className="p-4">32 – 40 Units</td>
                  <td className="p-4">960 – 1,200 Units</td>
                  <td className="p-4">~650 – 800 sq. ft.</td>
                  <td className="p-4">Commercial Establishments, Small Factories, Large Villas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Subsidy Info Section */}
      <SubsidyNotice onOpenQuote={onOpenQuote} />
    </div>
  );
}
