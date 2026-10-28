import React from 'react';
import { FileText, ShieldAlert, CheckCircle2, AlertTriangle, ExternalLink, Calendar, HelpCircle, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function SubsidyPage({ onOpenQuote }) {
  const { settings } = useSettings();

  const proposedAmount = settings.subsidy_proposed_amount || '78000';
  const verifiedDate = settings.subsidy_last_verified_date || '2026-10-24';
  const officialUrl = settings.subsidy_official_url || 'https://pmsuryaghar.gov.in';

  return (
    <div className="py-12 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
          <FileText className="w-3.5 h-3.5" /> PM Surya Ghar & DISCOM Assistance
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] tracking-tight">
          Government Solar Subsidy Guide & Eligibility
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Comprehensive, transparent overview of central solar subsidies, slab calculations, eligibility criteria, and discom application procedures.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Last scheme regulatory review: {verifiedDate}</span>
        </div>
      </section>

      {/* Main Slabs Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Tier 1 Slab</span>
            <h3 className="text-2xl font-black text-[#0A192F]">1 kW Rooftop Solar</h3>
            <p className="text-3xl font-black text-amber-500">₹30,000</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standard central assistance for small residential rooftop installations with sanctioned connected load.
            </p>
            <ul className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
              <li>• Direct bank account transfer</li>
              <li>• Residential consumers only</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Tier 2 Slab</span>
            <h3 className="text-2xl font-black text-[#0A192F]">2 kW Rooftop Solar</h3>
            <p className="text-3xl font-black text-amber-500">₹60,000</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculated at ₹30,000 per kW for up to 2 kW capacity systems under the PM Surya Ghar guidelines.
            </p>
            <ul className="text-xs text-slate-500 space-y-1 pt-2 border-t border-slate-100">
              <li>• Suitable for medium independent homes</li>
              <li>• Bi-directional net-meter required</li>
            </ul>
          </div>

          <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-300 shadow-md space-y-3 relative overflow-hidden">
            <div className="absolute top-2 right-2 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded">
              Max Slab
            </div>
            <span className="text-xs font-bold uppercase text-amber-800 tracking-wider">Tier 3 Slab</span>
            <h3 className="text-2xl font-black text-amber-950">3 kW to 10 kW Solar</h3>
            <p className="text-3xl font-black text-amber-700">₹78,000</p>
            <p className="text-xs text-amber-900 leading-relaxed">
              Maximum central government subsidy cap applicable for residential rooftop systems of 3 kW capacity and larger.
            </p>
            <ul className="text-xs text-amber-800 space-y-1 pt-2 border-t border-amber-200">
              <li>• Maximum benchmark financial grant</li>
              <li>• Requires DISCOM technical feasibility</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Deep-Dive Requirements & Transparency Accordion */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-[#0A192F]">
            Who is Eligible for the PM Surya Ghar Subsidy?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">Qualifying Criteria</span>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                <li>Applicant must be an Indian citizen with active residential electricity meter.</li>
                <li>Roof must be owned by the applicant with shadow-free clearance.</li>
                <li>Grid-tied system must use Domestic Content Requirement (DCR) solar modules.</li>
                <li>Inverter and balance-of-systems must comply with BIS/MNRE safety standards.</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block text-sm">Non-Qualifying Installations</span>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                <li>Commercial, retail shop, or industrial tariff meters do not qualify for residential direct subsidy.</li>
                <li>Off-grid (battery-only without grid interconnection) systems are outside this central subsidy scheme.</li>
                <li>Systems installed without registered DISCOM net-metering feasibility.</li>
              </ul>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Why We Display Subsidy as "Subject to Scheme Verification":</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Every property has unique technical conditions: sanctioned meter load (kW), phase supply (Single Phase vs. Three Phase), and local DISCOM substation transformer capacity. We verify your individual eligibility before promising exact net prices to ensure full transparency and compliance.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100">
            <button
              onClick={() => onOpenQuote('New Installation')}
              className="bg-[#0A192F] hover:bg-[#152B4B] text-white px-6 py-3 rounded-xl text-xs font-bold shadow flex items-center gap-2"
            >
              <span>Check My Subsidy Eligibility</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </button>

            <a
              href={officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-amber-600 font-semibold"
            >
              <span>View Official National Portal ({officialUrl.replace('https://', '')})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
