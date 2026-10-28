import React from 'react';
import { Sun, ShieldCheck, Wrench, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function AboutPage({ onOpenQuote }) {
  const { settings } = useSettings();

  return (
    <div className="py-12 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
          <Sun className="w-3.5 h-3.5" /> Engineered Clean Energy
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A192F] tracking-tight">
          About Shree Ji Solar Experts
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {settings.tagline || 'Powering a Brighter Future with Solar Energy'}. We are dedicated to providing turnkey rooftop solar installations, thorough maintenance, and professional solar panel cleaning.
        </p>
      </section>

      {/* Philosophy & Mission Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h2 className="text-2xl font-black text-[#0A192F]">
              Engineering Integrity & Long-Term Reliability
            </h2>
            <p>
              Solar rooftop installations are 25-year investments. At Shree Ji Solar Experts, we believe in honest technical consultation rather than overpromising. We guide property owners through the entire lifecycle: site orientation, structural load calculations, component procurement, net-metering liaison, and periodic washing.
            </p>
            <p>
              We prioritize Tier-1 high-efficiency photovoltaic modules, smart grid-tied inverters with digital remote monitoring, hot-dip galvanized mounting structures engineered to withstand extreme wind conditions, and multi-tier surge protection.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenQuote()}
                className="bg-[#0A192F] hover:bg-[#152B4B] text-white px-6 py-3 rounded-xl text-xs font-bold shadow flex items-center gap-2"
              >
                <span>Request On-Site Technical Survey</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>

          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Our Core Service Standards</h3>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Transparent Subsidy Guidance:</strong>
                  We provide realistic PM Surya Ghar guidelines without claiming false automatic approvals.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Specialized Soft-Wash Cleaning:</strong>
                  Trained technicians using demineralized water and scratch-resistant solar glass brushes.
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">End-to-End DISCOM Liaison:</strong>
                  Full support for grid synchronization, inspection, and net-meter billing configuration.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
