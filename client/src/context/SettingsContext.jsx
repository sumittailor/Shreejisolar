import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchPublicSettings } from '../services/api';

const SettingsContext = createContext({
  settings: {},
  loading: true,
  refreshSettings: () => {},
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    company_name: 'SHREE JI SOLAR EXPERTS',
    tagline: 'Powering a Brighter Future with Solar Energy',
    business_email: 'shreejisolarexperts@gmail.com',
    whatsapp_number: '919785002188',
    contact_phone: '+91 9785002188',
    business_address: 'Solar Service Hub, Main Highway Road',
    service_areas: 'Residential, Commercial & Industrial Solar Installations across region',
    subsidy_proposed_amount: '78000',
    subsidy_status: 'Subject to verification under PM Surya Ghar scheme',
    subsidy_last_verified_date: new Date().toISOString().split('T')[0],
    subsidy_official_url: 'https://pmsuryaghar.gov.in',
  });
  const [loading, setLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const data = await fetchPublicSettings();
      if (data && Object.keys(data).length > 0) {
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn('Using default business settings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: loadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
