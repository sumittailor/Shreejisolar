import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, MessageCircle, Sun, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { getWhatsAppUrl } from '../services/whatsapp';

export default function Footer({ onOpenQuote }) {
  const { settings } = useSettings();

  const waUrl = getWhatsAppUrl({
    whatsappNumber: settings.whatsapp_number,
    isGeneral: true,
  });

  return (
    <footer className="bg-[#0A192F] text-slate-300 border-t border-slate-800">
      {/* Pre-footer Call to Action */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
              Ready to Cut Your Electricity Bills with Solar?
            </h3>
            <p className="text-slate-900 font-medium text-sm sm:text-base mt-1">
              Talk to our technical engineers for customized residential and commercial solar solutions.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenQuote()}
              className="bg-[#0A192F] text-white hover:bg-[#152B4B] px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition active:scale-95"
            >
              Request Free Quote
            </button>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3 rounded-xl font-bold text-sm shadow-md transition flex items-center gap-2 active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp Direct
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpg"
                alt="Shree Ji Solar Experts"
                className="h-14 w-auto object-contain rounded-md bg-white p-1"
              />
              <div>
                <span className="text-lg font-black tracking-tight text-white block">
                  SHREE JI SOLAR EXPERTS
                </span>
                <span className="text-xs text-amber-400 font-medium block">
                  Solar Energy & Cleaning Specialists
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {settings.tagline || 'Powering a Brighter Future with Solar Energy'}. We provide residential rooftop solar installations, commercial systems, professional demineralized panel cleaning, and periodic maintenance.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-emerald-400 text-xs font-medium border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> High Performance & Guaranteed Care
              </span>
            </div>
          </div>

          {/* Business Services */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" /> Our Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/plans" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> New Solar Panel Installation
                </Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> Residential Rooftop Solar (3-8 kW)
                </Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> Commercial & Industrial Solar
                </Link>
              </li>
              <li>
                <Link to="/cleaning" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> Solar Panel Cleaning Services
                </Link>
              </li>
              <li>
                <Link to="/cleaning" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> Maintenance & System Servicing
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> Existing System Inspection
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Govt Scheme */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Scheme & Information
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/subsidy" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> PM Surya Ghar Scheme Details
                </Link>
              </li>
              <li>
                <a
                  href={settings.subsidy_official_url || 'https://pmsuryaghar.gov.in'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-400 transition flex items-center gap-1.5 text-amber-400 font-medium"
                >
                  <ExternalLink className="w-3 h-3" /> Official Govt Solar Portal
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> About Our Standards
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-500" /> Request On-Site Survey
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-amber-400 transition flex items-center gap-1.5 text-slate-500">
                  <ArrowRight className="w-3 h-3" /> Admin Staff Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Contact & Coverage
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              {settings.contact_phone && (
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-500 text-[10px]">Direct Phone</span>
                    <a href={`tel:${settings.contact_phone.replace(/\s+/g, '')}`} className="text-white hover:text-amber-400 font-semibold">
                      {settings.contact_phone}
                    </a>
                  </div>
                </li>
              )}
              {settings.business_email && (
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-slate-500 text-[10px]">Business Email</span>
                    <a href={`mailto:${settings.business_email}`} className="text-white hover:text-amber-400">
                      {settings.business_email}
                    </a>
                  </div>
                </li>
              )}
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-500 text-[10px]">Service Area</span>
                  <span className="text-slate-300">{settings.service_areas || 'Regional Rooftop & Commercial Services'}</span>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block text-slate-500 text-[10px]">WhatsApp Support</span>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                    Chat with an expert
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <p className="font-semibold text-slate-300 mb-1">
            Government Solar Subsidy Notice:
          </p>
          <p>
            Subsidy information published on this website reflects current guidelines under central and state schemes including PM Surya Ghar: Muft Bijli Yojana. Subsidy eligibility, applicable amounts, DISCOM approvals, and final disbursements are subject to official portal verification, consumer category, system capacity, and regulatory guidelines. We assist with application support, engineering, and documentation. Net savings and quotes are confirmed post site assessment.
          </p>
        </div>

        {/* Copyright Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SHREE JI SOLAR EXPERTS. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-400">Privacy & Terms</Link>
            <span>•</span>
            <Link to="/subsidy" className="hover:text-slate-400">Subsidy Transparency</Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-slate-400">Admin Login</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
