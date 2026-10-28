import React from 'react';
import { ShieldAlert, ExternalLink, Calendar, CheckCircle2, AlertTriangle, FileText, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function SubsidyNotice({ onOpenQuote }) {
  const { settings } = useSettings();

  const proposedAmount = settings.subsidy_proposed_amount || '78000';
  const verifiedDate = settings.subsidy_last_verified_date || '2026-10-24';
  const officialUrl = settings.subsidy_official_url || 'https://pmsuryaghar.gov.in';

  return (
    <section className="py-16 bg-slate-50 border-y border-slate-200" id="subsidy-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
            <FileText className="w-3.5 h-3.5" /> Official Scheme Advisory
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0A192F] tracking-tight">
            Government Solar Subsidy Information
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Understanding central and state financial assistance under the PM Surya Ghar: Muft Bijli Yojana and applicable DISCOM regulations.
          </p>
        </div>

        {/* Proposed Subsidy Verification Highlight Card */}
        <div className="mt-10 bg-white rounded-2xl border border-amber-200/90 shadow-md p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Left 2 Cols: Description & Criteria */}
            <div className="lg:col-span-2 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold">
                  Proposed Benchmark: Up to ₹{parseInt(proposedAmount, 10).toLocaleString('en-IN')}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Last Scheme Check: {verifiedDate}
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                <p>
                  Under current national guidelines for residential rooftop solar (PM Surya Ghar), central subsidies are structured by system capacity:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-xs text-slate-500 block font-semibold">1 kW Capacity</span>
                    <span className="text-base font-bold text-[#0A192F]">₹30,000 Subsidy</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <span className="text-xs text-slate-500 block font-semibold">2 kW Capacity</span>
                    <span className="text-base font-bold text-[#0A192F]">₹60,000 Subsidy</span>
                  </div>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                    <span className="text-xs text-amber-800 block font-semibold">3 kW & Above</span>
                    <span className="text-base font-bold text-amber-900">₹78,000 Max Subsidy</span>
                  </div>
                </div>

                <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200/80 text-xs text-amber-900 space-y-2 mt-4">
                  <div className="flex items-start gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>Important Regulatory Disclosure:</span>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-amber-800">
                    <li>Subsidy eligibility and final disbursement are determined exclusively by the official National Solar Portal and your local Electricity Distribution Company (DISCOM).</li>
                    <li>Subsidies are strictly intended for residential grid-tied rooftop solar systems with sanctioned consumer meter connections.</li>
                    <li>Commercial, industrial, or unapproved installations are subject to different tariff and tax structures and may not qualify for residential direct benefit subsidies.</li>
                    <li>We do not guarantee approvals in advance; our technical team provides documentation assistance, meter application guidance, and turnkey EPC engineering.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Col: Official Portal & Check Button */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 bg-[#0A192F] text-amber-400 rounded-xl flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>

              <div>
                <h4 className="font-bold text-base text-slate-900">Check Your Scheme Eligibility</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Have your latest electricity bill ready to verify sanctioned load, DISCOM zone, and consumer category.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => onOpenQuote('New Installation')}
                  className="w-full bg-[#0A192F] hover:bg-[#152B4B] text-white py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow"
                >
                  <span>Request Subsidy Assessment</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>

                <a
                  href={officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-amber-600 font-semibold py-2 transition"
                >
                  <span>Visit National Portal (pmsuryaghar.gov.in)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
