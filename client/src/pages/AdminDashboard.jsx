import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  LogOut,
  Search,
  Filter,
  Download,
  Eye,
  Edit2,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  X,
  Save,
  MessageCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import {
  fetchAdminStats,
  fetchAdminEnquiries,
  updateEnquiryStatus,
  fetchAdminPlans,
  saveSolarPlan,
  deleteSolarPlan,
  fetchAdminSettings,
  updateAdminSettings
} from '../services/api';
import { getWhatsAppUrl } from '../services/whatsapp';

export default function AdminDashboard() {
  const { user, token, isAuthenticated, logout, loading: authLoading } = useAuth();
  const { refreshSettings } = useSettings();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'enquiries' | 'plans' | 'settings'

  // Overview Data
  const [stats, setStats] = useState({ total: 0, new: 0, contacted: 0, quotationSent: 0, converted: 0, closed: 0 });
  const [recentEnquiries, setRecentEnquiries] = useState([]);

  // Enquiries Data & Filter
  const [enquiries, setEnquiries] = useState([]);
  const [enquiriesLoading, setEnquiriesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Plans Data
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null); // null or plan object
  const [isNewPlanModal, setIsNewPlanModal] = useState(false);

  // Settings Data
  const [adminSettings, setAdminSettings] = useState([]);
  const [settingsForm, setSettingsForm] = useState({});
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Protect route
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [authLoading, isAuthenticated, navigate]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Load Overview
  const loadOverview = async () => {
    if (!token) return;
    try {
      const data = await fetchAdminStats(token);
      if (data.success) {
        setStats(data.stats);
        setRecentEnquiries(data.recentEnquiries || []);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Load Enquiries
  const loadEnquiries = async () => {
    if (!token) return;
    setEnquiriesLoading(true);
    try {
      const data = await fetchAdminEnquiries(token, {
        search: searchTerm,
        status: filterStatus,
        service: filterService,
        page,
        limit: 15
      });
      if (data.success) {
        setEnquiries(data.enquiries || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setEnquiriesLoading(false);
    }
  };

  // Load Plans
  const loadPlans = async () => {
    if (!token) return;
    setPlansLoading(true);
    try {
      const data = await fetchAdminPlans(token);
      setPlans(data || []);
    } catch (err) {
      console.error('Failed to load plans:', err);
    } finally {
      setPlansLoading(false);
    }
  };

  // Load Settings
  const loadSettings = async () => {
    if (!token) return;
    setSettingsLoading(true);
    try {
      const data = await fetchAdminSettings(token);
      setAdminSettings(data || []);
      const form = {};
      (data || []).forEach(item => {
        form[item.key] = item.value;
      });
      setSettingsForm(form);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      if (activeTab === 'overview') loadOverview();
      if (activeTab === 'enquiries') loadEnquiries();
      if (activeTab === 'plans') loadPlans();
      if (activeTab === 'settings') loadSettings();
    }
  }, [token, activeTab, page, filterStatus, filterService]);

  // Handle Enquiry Status Save
  const handleSaveEnquiry = async () => {
    if (!selectedEnquiry) return;
    try {
      await updateEnquiryStatus(token, selectedEnquiry.id, editStatus, editNotes);
      showToast('Enquiry updated successfully');
      setSelectedEnquiry(null);
      loadEnquiries();
      loadOverview();
    } catch (err) {
      alert(err.message || 'Failed to update enquiry');
    }
  };

  // Handle Plan Save
  const handleSavePlan = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!editingPlan?.id;
      await saveSolarPlan(token, editingPlan, isEdit, editingPlan?.id);
      showToast(`Package ${isEdit ? 'updated' : 'created'} successfully`);
      setEditingPlan(null);
      setIsNewPlanModal(false);
      loadPlans();
    } catch (err) {
      alert(err.message || 'Failed to save package');
    }
  };

  // Handle Plan Delete
  const handleDeletePlan = async (id) => {
    if (!window.confirm('Are you sure you want to delete this solar package?')) return;
    try {
      await deleteSolarPlan(token, id);
      showToast('Package deleted');
      loadPlans();
    } catch (err) {
      alert(err.message || 'Failed to delete package');
    }
  };

  // Handle Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateAdminSettings(token, settingsForm);
      showToast('Business settings saved successfully');
      refreshSettings();
      loadSettings();
    } catch (err) {
      alert(err.message || 'Failed to update settings');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0A192F] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-amber-500/40 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Navbar */}
      <header className="bg-[#0A192F] text-white sticky top-0 z-30 shadow-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="Logo" className="h-10 w-auto bg-white p-0.5 rounded" />
            <div>
              <span className="font-bold text-sm tracking-tight text-white block">
                SHREE JI SOLAR EXPERTS
              </span>
              <span className="text-[10px] text-amber-400 font-semibold uppercase">Admin Console</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-300 hidden sm:inline">
              Logged in as <strong className="text-white">{user?.username}</strong>
            </span>
            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'overview'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard Overview
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'enquiries'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Customer Enquiries
          </button>

          <button
            onClick={() => setActiveTab('plans')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'plans'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" /> Solar Packages & Prices
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" /> Business & Subsidy Settings
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* ================= TAB 1: OVERVIEW ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-slate-500">Total Enquiries</span>
                <p className="text-2xl sm:text-3xl font-black text-[#0A192F] mt-1">{stats.total}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-blue-600">New Enquiries</span>
                <p className="text-2xl sm:text-3xl font-black text-blue-700 mt-1">{stats.new}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-amber-600">Contacted</span>
                <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">{stats.contacted}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-purple-600">Quotation Sent</span>
                <p className="text-2xl sm:text-3xl font-black text-purple-700 mt-1">{stats.quotationSent}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-emerald-600">Converted</span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">{stats.converted}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold uppercase text-slate-500">Closed</span>
                <p className="text-2xl sm:text-3xl font-black text-slate-700 mt-1">{stats.closed}</p>
              </div>
            </div>

            {/* Quick Actions & Recent Enquiries */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Recent Enquiries</h3>
                  <p className="text-xs text-slate-500">Latest customer solar and cleaning leads</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="/api/enquiries/export/csv"
                    target="_blank"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" /> Export All to CSV
                  </a>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="bg-[#0A192F] hover:bg-[#152B4B] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                  >
                    View All Leads
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="p-3.5">Ref No</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Mobile</th>
                      <th className="p-3.5">City</th>
                      <th className="p-3.5">Service</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {recentEnquiries.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-6 text-center text-slate-400">
                          No enquiries recorded yet.
                        </td>
                      </tr>
                    ) : (
                      recentEnquiries.map((e) => (
                        <tr key={e.id} className="hover:bg-slate-50/80">
                          <td className="p-3.5 font-mono font-bold text-slate-900">{e.reference_no}</td>
                          <td className="p-3.5 font-bold text-slate-900">{e.customer_name}</td>
                          <td className="p-3.5">{e.mobile}</td>
                          <td className="p-3.5">{e.city}</td>
                          <td className="p-3.5">{e.service_required}</td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {e.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-500">{new Date(e.created_at).toLocaleDateString('en-IN')}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: ENQUIRIES ================= */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && loadEnquiries()}
                    placeholder="Search customer name, ref no, mobile, city..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quotation Sent">Quotation Sent</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>

                <select
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                >
                  <option value="all">All Services</option>
                  <option value="New Installation">New Installation</option>
                  <option value="Solar Panel Cleaning">Solar Panel Cleaning</option>
                  <option value="Maintenance & Servicing">Maintenance & Servicing</option>
                  <option value="Commercial Solar">Commercial Solar</option>
                  <option value="System Inspection">System Inspection</option>
                </select>

                <button
                  onClick={() => loadEnquiries()}
                  className="bg-[#0A192F] text-white px-4 py-2 rounded-lg text-xs font-bold"
                >
                  Filter
                </button>
              </div>

              <a
                href="/api/enquiries/export/csv"
                target="_blank"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow"
              >
                <Download className="w-3.5 h-3.5" /> Export Enquiries to CSV
              </a>
            </div>

            {/* Enquiries Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="p-3.5">Ref No</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5">Customer Name</th>
                      <th className="p-3.5">Contact Details</th>
                      <th className="p-3.5">City & Property</th>
                      <th className="p-3.5">Service Requested</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {enquiriesLoading ? (
                      <tr>
                        <td colSpan="8" className="p-8 text-center text-slate-500">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
                          Loading enquiries...
                        </td>
                      </tr>
                    ) : enquiries.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-8 text-center text-slate-400">
                          No matching enquiries found.
                        </td>
                      </tr>
                    ) : (
                      enquiries.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80">
                          <td className="p-3.5 font-mono font-bold text-slate-900">{item.reference_no}</td>
                          <td className="p-3.5 text-slate-500 whitespace-nowrap">
                            {new Date(item.created_at).toLocaleDateString('en-IN')}
                          </td>
                          <td className="p-3.5 font-bold text-slate-900">{item.customer_name}</td>
                          <td className="p-3.5">
                            <div>{item.mobile}</div>
                            {item.email && <div className="text-[10px] text-slate-400">{item.email}</div>}
                          </td>
                          <td className="p-3.5">
                            <div>{item.city}</div>
                            <div className="text-[10px] text-slate-400">{item.property_type}</div>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-slate-800">{item.service_required}</span>
                            {item.desired_capacity && (
                              <div className="text-[10px] text-slate-500">Cap: {item.desired_capacity}</div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                item.status === 'New'
                                  ? 'bg-blue-100 text-blue-800'
                                  : item.status === 'Contacted'
                                  ? 'bg-amber-100 text-amber-800'
                                  : item.status === 'Quotation Sent'
                                  ? 'bg-purple-100 text-purple-800'
                                  : item.status === 'Converted'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => {
                                setSelectedEnquiry(item);
                                setEditStatus(item.status);
                                setEditNotes(item.internal_notes || '');
                              }}
                              className="bg-slate-100 hover:bg-[#0A192F] hover:text-white text-slate-700 px-3 py-1 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" /> Manage
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SOLAR PLANS ================= */}
        {activeTab === 'plans' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Solar Package Catalogue</h3>
                <p className="text-xs text-slate-500">
                  Manage pricing, specifications, and components displayed on the public website.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingPlan({
                    name: '',
                    capacity: '',
                    listed_price: 180000,
                    estimated_net_price: 'Subject to scheme eligibility verification',
                    subsidy_info: 'Government subsidy may be available to eligible customers. Please contact us to check the applicable scheme and eligibility.',
                    components: 'To be confirmed',
                    inclusions: 'To be confirmed',
                    warranty: 'To be confirmed',
                    property_type: 'Residential Rooftop',
                    is_active: 1,
                    display_order: plans.length + 1
                  });
                  setIsNewPlanModal(true);
                }}
                className="bg-[#0A192F] hover:bg-[#152B4B] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4 text-amber-400" /> Add New Package
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                        {p.capacity}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {p.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base mt-2">{p.name}</h4>
                    <p className="text-2xl font-black text-[#0A192F] mt-1">₹{p.listed_price.toLocaleString('en-IN')}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{p.property_type}</p>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1 border-t border-slate-100 pt-3">
                    <p><strong>Warranty:</strong> {p.warranty || 'To be confirmed'}</p>
                    <p className="line-clamp-2"><strong>Components:</strong> {p.components}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setEditingPlan({ ...p });
                        setIsNewPlanModal(false);
                      }}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-3 h-3 text-amber-600" /> Edit Price & Specs
                    </button>
                    <button
                      onClick={() => handleDeletePlan(p.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition"
                      title="Delete package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 max-w-4xl animate-fadeIn">
            <div className="border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-xl font-bold text-slate-900">Business & Subsidy Settings</h3>
              <p className="text-xs text-slate-500">
                Changes here dynamically update all public contact links, email alerts, WhatsApp clicks, and subsidy disclosures.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company Display Name</label>
                  <input
                    type="text"
                    value={settingsForm.company_name || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.tagline || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Business Email (Lead Notifications)
                  </label>
                  <input
                    type="email"
                    value={settingsForm.business_email || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, business_email: e.target.value })}
                    placeholder="info@shreejisolarexperts.com"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Business Number
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsapp_number || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                    placeholder="9198XXXXXXXX"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Public Contact Phone</label>
                  <input
                    type="text"
                    value={settingsForm.contact_phone || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, contact_phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Office / Business Address</label>
                  <input
                    type="text"
                    value={settingsForm.business_address || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, business_address: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Service Coverage Areas</label>
                  <input
                    type="text"
                    value={settingsForm.service_areas || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, service_areas: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-4">
                <h4 className="font-bold text-sm text-slate-900">Government Solar Subsidy Settings</h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Proposed Subsidy (₹)</label>
                    <input
                      type="number"
                      value={settingsForm.subsidy_proposed_amount || '78000'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, subsidy_proposed_amount: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Last Verified Date</label>
                    <input
                      type="date"
                      value={settingsForm.subsidy_last_verified_date || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, subsidy_last_verified_date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official Scheme Portal URL</label>
                    <input
                      type="url"
                      value={settingsForm.subsidy_official_url || 'https://pmsuryaghar.gov.in'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, subsidy_official_url: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subsidy Regulatory Notice (Public Disclaimer)
                  </label>
                  <textarea
                    rows="2"
                    value={settingsForm.subsidy_notice || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, subsidy_notice: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  ></textarea>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-[#0A192F] hover:bg-[#152B4B] text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow"
                >
                  <Save className="w-4 h-4 text-amber-400" /> Save Business Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ================= MODAL: MANAGE ENQUIRY ================= */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h4 className="font-bold text-lg text-slate-900">
                  Enquiry Details [{selectedEnquiry.reference_no}]
                </h4>
                <p className="text-xs text-slate-500">
                  Received on {new Date(selectedEnquiry.created_at).toLocaleString('en-IN')}
                </p>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="p-1 rounded text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-xl">
              <div><strong>Name:</strong> {selectedEnquiry.customer_name}</div>
              <div><strong>Phone:</strong> <a href={`tel:${selectedEnquiry.mobile}`} className="text-blue-600">{selectedEnquiry.mobile}</a></div>
              <div><strong>Email:</strong> {selectedEnquiry.email || 'None'}</div>
              <div><strong>Location:</strong> {selectedEnquiry.city}</div>
              <div><strong>Property:</strong> {selectedEnquiry.property_type}</div>
              <div><strong>Service:</strong> {selectedEnquiry.service_required}</div>
              <div><strong>Capacity:</strong> {selectedEnquiry.desired_capacity || 'N/A'}</div>
              <div><strong>Package:</strong> {selectedEnquiry.selected_package || 'N/A'}</div>
              <div><strong>Monthly Bill:</strong> {selectedEnquiry.monthly_bill || 'N/A'}</div>
              <div><strong>Panels Count:</strong> {selectedEnquiry.panel_count || '0'}</div>
            </div>

            {selectedEnquiry.additional_notes && (
              <div className="text-xs bg-amber-50 p-3 rounded-lg border border-amber-200">
                <strong>Customer Notes:</strong> {selectedEnquiry.additional_notes}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold mb-1">Update Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-xs bg-white"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Quotation Sent">Quotation Sent</option>
                  <option value="Converted">Converted</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Private Internal Notes (Staff Only)</label>
                <textarea
                  rows="3"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Spoke with customer on Oct 24, sent 5 kW proposal, waiting on meter details..."
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <a
                href={getWhatsAppUrl({
                  whatsappNumber: selectedEnquiry.mobile,
                  referenceNo: selectedEnquiry.reference_no,
                  customerName: selectedEnquiry.customer_name,
                  service: selectedEnquiry.service_required
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Message Customer on WhatsApp
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEnquiry}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#0A192F] text-white flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT/ADD PLAN ================= */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-bold text-lg text-slate-900">
                {isNewPlanModal ? 'Add Solar Package' : `Edit Package: ${editingPlan.name}`}
              </h4>
              <button onClick={() => setEditingPlan(null)} className="p-1 rounded text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Package Name</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.name || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Capacity</label>
                  <input
                    type="text"
                    required
                    value={editingPlan.capacity || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, capacity: e.target.value })}
                    placeholder="e.g. 3 kW"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Listed Package Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingPlan.listed_price || 0}
                    onChange={(e) => setEditingPlan({ ...editingPlan, listed_price: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Estimated Net Customer Price</label>
                  <input
                    type="text"
                    value={editingPlan.estimated_net_price || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, estimated_net_price: e.target.value })}
                    placeholder="e.g. Subject to scheme verification"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Subsidy Information / Note</label>
                <textarea
                  rows="2"
                  value={editingPlan.subsidy_info || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, subsidy_info: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Warranty Information</label>
                  <input
                    type="text"
                    value={editingPlan.warranty || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, warranty: e.target.value })}
                    placeholder="e.g. 25-Year Performance Warranty"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Suitable Property Type</label>
                  <input
                    type="text"
                    value={editingPlan.property_type || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, property_type: e.target.value })}
                    placeholder="e.g. Residential Rooftop"
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Components Specifications</label>
                <textarea
                  rows="2"
                  value={editingPlan.components || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, components: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Inclusions</label>
                <textarea
                  rows="2"
                  value={editingPlan.inclusions || ''}
                  onChange={(e) => setEditingPlan({ ...editingPlan, inclusions: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                ></textarea>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPlan.is_active === 1 || editingPlan.is_active === true}
                    onChange={(e) => setEditingPlan({ ...editingPlan, is_active: e.target.checked ? 1 : 0 })}
                  />
                  <span>Publish / Enable on public site</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-[#0A192F] text-white flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5 text-amber-400" /> Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
