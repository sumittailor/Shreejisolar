import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, MessageCircle, Menu, X, Sun, ShieldCheck } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppUrl } from '../services/whatsapp';

export default function Navbar({ onOpenQuote }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { settings } = useSettings();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Solar Plans', path: '/plans' },
    { label: 'Cleaning Services', path: '/cleaning' },
    { label: 'Govt Subsidy', path: '/subsidy' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const waUrl = getWhatsAppUrl({
    whatsappNumber: settings.whatsapp_number,
    isGeneral: true,
  });

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100">
      {/* Top Notification / Contact Bar */}
      <div className="bg-[#0A192F] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Sun className="w-3.5 h-3.5" /> Approved Rooftop Solar & Maintenance
            </span>
            <span className="hidden sm:inline-block text-slate-500">|</span>
            <span className="hidden sm:flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Tier-1 Panels & Professional Servicing
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {settings.contact_phone && (
              <a
                href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                <Phone className="w-3 h-3 text-amber-400" />
                <span className="hidden md:inline">{settings.contact_phone}</span>
                <span className="md:hidden">Call</span>
              </a>
            )}
            {settings.business_email && (
              <a
                href={`mailto:${settings.business_email}`}
                className="hidden lg:flex items-center gap-1 hover:text-white transition-colors"
              >
                <Mail className="w-3 h-3 text-amber-400" />
                <span>{settings.business_email}</span>
              </a>
            )}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-emerald-600/90 hover:bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-xs font-medium transition"
            >
              <MessageCircle className="w-3 h-3" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <img
              src="/logo.jpg"
              alt="Shree Ji Solar Experts"
              className="h-14 w-auto object-contain rounded-md shadow-xs transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0A192F] group-hover:text-amber-600 transition-colors">
                SHREE JI <span className="text-amber-500">SOLAR EXPERTS</span>
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 font-semibold tracking-wider uppercase">
                Installation • Cleaning • Maintenance
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-amber-600 bg-amber-50/80 shadow-xs'
                    : 'text-slate-700 hover:text-[#0A192F] hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onOpenQuote()}
              className="bg-[#0A192F] hover:bg-[#152B4B] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-2 border border-slate-700/50"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Get Free Quote
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => onOpenQuote()}
              className="sm:hidden bg-[#0A192F] text-white text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              Quote
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-[#0A192F] hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white shadow-xl animate-fadeIn">
          <div className="px-4 pt-3 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition ${
                  isActive(link.path)
                    ? 'bg-amber-500/10 text-amber-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="w-full bg-[#0A192F] text-white py-3 rounded-xl font-bold shadow text-center block text-sm"
              >
                Get a Free Quotation
              </button>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 text-white py-2.5 rounded-xl font-bold shadow text-center flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
