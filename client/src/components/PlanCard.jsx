import React, { useState } from 'react';
import { Sun, CheckCircle2, ShieldCheck, Wrench, MessageCircle, Info, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppUrl } from '../services/whatsapp';

export default function PlanCard({ plan, onSelectForQuote }) {
  const { settings } = useSettings();
  const [expanded, setExpanded] = useState(false);

  const formattedPrice = `₹${plan.listed_price.toLocaleString('en-IN')}`;

  const waUrl = getWhatsAppUrl({
    whatsappNumber: settings.whatsapp_number,
    packageName: plan.name,
    capacity: plan.capacity,
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group">
      {/* Top Banner / Badge */}
      <div className="bg-[#0A192F] text-white p-6 relative">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
            <Sun className="w-3.5 h-3.5" /> {plan.capacity} System
          </span>
          <span className="text-[11px] text-slate-300 font-medium">
            {plan.property_type || 'Rooftop Suitable'}
          </span>
        </div>

        <h3 className="text-xl sm:text-2xl font-black text-white mt-3 group-hover:text-amber-400 transition-colors">
          {plan.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Turnkey solar generation solution engineered for long-term savings
        </p>
      </div>

      {/* Pricing Section */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Package Price:</span>
          <span className="text-3xl font-black text-[#0A192F] tracking-tight">{formattedPrice}</span>
          <span className="text-xs text-slate-500 font-medium">*Listed</span>
        </div>

        {/* Subsidy Notice Box */}
        <div className="mt-3 bg-amber-50/80 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Government Subsidy Guidance</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            {plan.subsidy_info || 'Government subsidy may be available to eligible residential customers. Contact us to verify your applicable DISCOM scheme and net cost.'}
          </p>
        </div>

        {/* Net Cost Line */}
        <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Estimated Customer Cost:</span>
          <span className="font-semibold text-slate-700">
            {plan.estimated_net_price || 'Verified post site survey'}
          </span>
        </div>
      </div>

      {/* Core Inclusions List */}
      <div className="p-6 space-y-4 flex-1">
        <div className="space-y-2.5 text-xs text-slate-600">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-800">System Capacity:</strong> {plan.capacity} High Efficiency Array
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-800">Warranty:</strong> {plan.warranty || 'To be confirmed'}
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <Wrench className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-800">Installation:</strong> Full civil & electrical mounting support
            </span>
          </div>
        </div>

        {/* Expandable Specifications */}
        {expanded && (
          <div className="pt-3 border-t border-slate-100 text-xs space-y-3 animate-fadeIn">
            <div>
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider text-slate-400">
                Components Breakdown:
              </span>
              <p className="text-slate-600 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {plan.components || 'To be confirmed upon site engineering assessment.'}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider text-slate-400">
                Inclusions & Services:
              </span>
              <p className="text-slate-600 mt-0.5 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {plan.inclusions || 'Site survey, structural design, net-metering liaison, wiring & commissioning.'}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-slate-500 hover:text-[#0A192F] font-semibold flex items-center gap-1 transition"
        >
          {expanded ? (
            <>
              Hide Specifications <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              View Full Inclusions & Details <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Action Buttons */}
      <div className="p-6 pt-0 space-y-2">
        <button
          onClick={() => onSelectForQuote(plan)}
          className="w-full bg-[#0A192F] hover:bg-[#152B4B] text-white py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow hover:shadow-md active:scale-98"
        >
          <span>Get Free Quote</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
        </button>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>Contact on WhatsApp</span>
        </a>
      </div>
    </div>
  );
}
