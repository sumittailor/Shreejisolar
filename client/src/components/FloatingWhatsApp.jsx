import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppUrl } from '../services/whatsapp';

export default function FloatingWhatsApp() {
  const { settings } = useSettings();
  const [showTooltip, setShowTooltip] = useState(false);

  const waUrl = getWhatsAppUrl({
    whatsappNumber: settings.whatsapp_number,
    isGeneral: true,
  });

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group">
      {/* Tooltip on hover/touch */}
      <div className="hidden sm:block mr-3 bg-white text-slate-800 text-xs font-semibold py-2 px-3.5 rounded-xl shadow-xl border border-slate-200 transition-all opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap">
        <span>Chat on WhatsApp with an Expert</span>
        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-white"></div>
      </div>

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Shree Ji Solar Experts on WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-110 active:scale-95"
      >
        {/* Pulse radar rings */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping -z-10"></span>
        <MessageCircle className="w-8 h-8 fill-current" />
      </a>
    </div>
  );
}
