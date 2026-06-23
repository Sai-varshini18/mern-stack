import React, { useState, useMemo } from 'react';
import { 
  Heart, 
  Search, 
  PlusCircle, 
  Droplet, 
  Activity, 
  ShieldAlert, 
  Users, 
  MapPin, 
  Phone, 
  CheckCircle, 
  Clock, 
  Filter,
  RefreshCw,
  AlertTriangle,
  FileText
} from 'lucide-react';

// ==========================================
// MOCK DATA & CONSTANTS
// ==========================================

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
const DONATION_TYPES = ['Whole Blood', 'Plasma', 'Platelets', 'Double Red Cells'];

// Blood Compatibility Chart Matrix [Donor] -> [Recipient]
const COMPATIBILITY_MATRIX = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+']
};

const INITIAL_DONORS = [
  { id: 'D1', name: "Jonathan Byers", type: "Plasma", group: "O+", location: "Metro General Hospital Center", contact: "555-0192", age: 29, lastDonated: "2026-02-14", status: "Available" },
  { id: 'D2', name: "Clarissa Ward", type: "Whole Blood", group: "A-", location: "Downtown Red Cross Hub", contact: "555-0143", age: 34, lastDonated: "2025-11-05", status: "Available" },
  { id: 'D3', name: "Marcus Vance", type: "Platelets", group: "AB+", location: "St. Jude Memorial Clinic", contact: "555-0188", age: 41, lastDonated: "2026-05-20", status: "On Break" },
  { id: 'D4', name: "Elena Rostova", type: "Whole Blood", group: "O-", location: "Metro General Hospital Center", contact: "555-0121", age: 25, lastDonated: "2026-01-10", status: "Available" },
  { id: 'D5', name: "David Kim", type: "Plasma", group: "B+", location: "Northside Community Lab", contact: "555-0322", age: 31, lastDonated: "2026-03-29", status: "Available" },
  { id: 'D6', name: "Sarah Jenkins", type: "Double Red Cells", group: "O+", location: "Downtown Red Cross Hub", contact: "555-0981", age: 22, lastDonated: "2026-04-12", status: "Available" },
  { id: 'D7', name: "Amir Patel", type: "Platelets", group: "A+", location: "St. Jude Memorial Clinic", contact: "555-0443", age: 38, lastDonated: "2026-05-01", status: "Available" }
];

const INITIAL_REQUESTS = [
  { id: 'R1', patientName: "Robert Chen", group: "A+", type: "Whole Blood", unitsNeeded: 3, location: "City Emergency Ward", urgency: "Critical", status: "Pending" },
  { id: 'R2', patientName: "Maria G.", group: "O-", type: "Plasma", unitsNeeded: 2, location: "Children's Trauma Center", urgency: "Urgent", status: "Fulfilled" },
  { id: 'R3', patientName: "William Hayes", group: "AB-", type: "Platelets", unitsNeeded: 5, location: "Metro General Hospital Center", urgency: "Normal", status: "In Progress" },
];

export default function BloodPlasmaNetwork() {
  // ==========================================
  // STATE MANAGEMENT
  // ==========================================
  const [donors, setDonors] = useState(INITIAL_DONORS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, donors, requests, compatibility
  
  // Filtering States
  const [donorSearch, setDonorSearch] = useState('');
  const [donorGroupFilter, setDonorGroupFilter] = useState('All');
  const [donorTypeFilter, setDonorTypeFilter] = useState('All');
  const [donorStatusFilter, setDonorStatusFilter] = useState('All');

  // Form Submission States
  const [donorForm, setDonorForm] = useState({ name: '', type: 'Whole Blood', group: 'O+', location: '', contact: '', age: '', status: 'Available' });
  const [requestForm, setRequestForm] = useState({ patientName: '', group: 'O+', type: 'Whole Blood', unitsNeeded: 1, location: '', urgency: 'Normal' });
  
  // Real-time Matching Utility Modal/State
  const [selectedMatchGroup, setSelectedMatchGroup] = useState(null);

  // ==========================================
  // BUSINESS LOGIC & COMPUTED PROPERTIES
  // ==========================================
  const stats = useMemo(() => {
    const totalDonors = donors.length;
    const activeDonors = donors.filter(d => d.status === 'Available').length;
    const criticalRequests = requests.filter(r => r.urgency === 'Critical' && r.status !== 'Fulfilled').length;
    
    // Calculate blood unit volume index metrics
    const typeDistribution = donors.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + 1;
      return acc;
    }, {});

    return { totalDonors, activeDonors, criticalRequests, typeDistribution };
  }, [donors, requests]);

  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      const matchesSearch = donor.name.toLowerCase().includes(donorSearch.toLowerCase()) || 
                            donor.location.toLowerCase().includes(donorSearch.toLowerCase());
      const matchesGroup = donorGroupFilter === 'All' || donor.group === donorGroupFilter;
      const matchesType = donorTypeFilter === 'All' || donor.type === donorTypeFilter;
      const matchesStatus = donorStatusFilter === 'All' || donor.status === donorStatusFilter;
      
      return matchesSearch && matchesGroup && matchesType && matchesStatus;
    });
  }, [donors, donorSearch, donorGroupFilter, donorTypeFilter, donorStatusFilter]);

  // Handle Form Registrations
  const handleRegisterDonor = (e) => {
    e.preventDefault();
    if (!donorForm.name || !donorForm.location || !donorForm.contact || !donorForm.age) {
      alert("Error: Please compile all required database entities before pipeline injection.");
      return;
    }
    const newDonor = {
      id: `D${donors.length + 1}`,
      ...donorForm,
      age: parseInt(donorForm.age),
      lastDonated: new Date().toISOString().split('T')[0],
    };
    setDonors([newDonor, ...donors]);
    setDonorForm({ name: '', type: 'Whole Blood', group: 'O+', location: '', contact: '', age: '', status: 'Available' });
    alert("System Notification: New Donor Node initialized successfully into the central grid registry.");
  };

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!requestForm.patientName || !requestForm.location) {
      alert("Error: Insufficient tracking tokens provided.");
      return;
    }
    const newRequest = {
      id: `R${requests.length + 1}`,
      ...requestForm,
      status: 'Pending'
    };
    setRequests([newRequest, ...requests]);
    setRequestForm({ patientName: '', group: 'O+', type: 'Whole Blood', unitsNeeded: 1, location: '', urgency: 'Normal' });
    alert("System Critical: Supply request Broadcast issued to corresponding matching clusters.");
  };

  const updateRequestStatus = (id, newStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased selection:bg-red-500 selection:text-white">
      
      {/* GLOBAL BANNER CONTROL */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-amber-600 px-4 py-2 text-center text-xs font-semibold tracking-wider uppercase text-white flex justify-center items-center gap-2 shadow-inner">
        <ShieldAlert className="w-4 h-4 animate-pulse" />
        <span>Notice: Inter-Hospital Network Grid online. Database Synchronized to node cluster standard.</span>
      </div>

      {/* NAVIGATION BAR CONTAINER */}
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="bg-red-500/10 p-2.5 rounded-xl border border-red-500/30">
                <Droplet className="w-8 h-8 text-red-500 fill-current" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white block">HEMOSYNC</span>
                <span className="text-xs font-mono text-red-400 tracking-widest block uppercase">Plasma & Blood Grid</span>
              </div>
            </div>
            
            <div className="flex space-x-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Activity },
                { id: 'donors', label: 'Donor Database', icon: Users },
                { id: 'requests', label: 'Emergency Despatch', icon: AlertTriangle },
                { id: 'compatibility', label: 'Cross-Match Matrix', icon: FileText },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id 
                        ? 'bg-red-600 text-white shadow-md shadow-red-900/30' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ==========================================
            TAB CONTENT: DASHBOARD VISUALIZATION
            ========================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Analytics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Registered Nodes</p>
                  <h3 className="text-3xl font-bold text-white mt-1">{stats.totalDonors}</h3>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Inventory</p>
                  <h3 className="text-3xl font-bold text-emerald-400 mt-1">{stats.activeDonors}</h3>
                </div>
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Critical Despatches</p>
                  <h3 className="text-3xl font-bold text-red-500 mt-1">{stats.criticalRequests}</h3>
                </div>
                <div className="p-3 bg-red-500/10 rounded-xl text-red-400 border border-red-500/20">
                  <Heart className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Network Capacity</p>
                  <h3 className="text-3xl font-bold text-amber-400 mt-1">98.4%</h3>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                  <RefreshCw className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Split View Components */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Type Share Distribution Breakdown */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 lg:col-span-1">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-500" />
                  Resource Allocation Split
                </h2>
                <div className="space-y-4 mt-6">
                  {DONATION_TYPES.map(type => {
                    const count = stats.typeDistribution[type] || 0;
                    const percentage = stats.totalDonors ? (count / stats.totalDonors) * 100 : 0;
                    return (
                      <div key={type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-slate-300 font-medium">{type}</span>
                          <span className="text-slate-400 font-mono">{count} units</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-rose-600 h-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Universal Safeguard Rule</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Type O- negative units represent the universal safe-harbor baseline configuration for un-matched recipient field vectors. Maintain minimum safety thresholds.
                  </p>
                </div>
              </div>

              {/* Real-time Emergency Streaming Activity Feed */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-500" />
                    Active Supply Vectors & Despatches
                  </h2>
                  <span className="text-xs bg-slate-800 text-slate-300 font-mono px-2 py-1 rounded border border-slate-700">
                    LIVE SYSTEM MONITORS
                  </span>
                </div>

                <div className="divide-y divide-slate-800 max-h-[380px] overflow-y-auto pr-2 space-y-3">
                  {requests.map(req => (
                    <div key={req.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${
                          req.urgency === 'Critical' ? 'bg-red-500 shadow-lg shadow-red-500/50' : 'bg-amber-400'
                        }`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-200">{req.patientName}</span>
                            <span className={`text-xs px-2 py-0.2 rounded font-mono font-bold ${
                              req.urgency === 'Critical' ? 'bg-red-950 text-red-400 border border-red-900' : 'bg-slate-900 text-slate-400'
                            }`}>
                              {req.urgency}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{req.type} Need at <span className="text-slate-300">{req.location}</span></p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6">
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 bg-slate-900 text-red-400 font-black rounded-lg border border-slate-800 text-sm">
                            {req.group}
                          </span>
                          <span className="block text-[10px] text-slate-500 uppercase mt-0.5 font-mono">{req.unitsNeeded} units needed</span>
                        </div>
                        
                        <select
                          value={req.status}
                          onChange={(e) => updateRequestStatus(req.id, e.target.value)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg font-medium bg-slate-900 border ${
                            req.status === 'Fulfilled' ? 'text-emerald-400 border-emerald-900' :
                            req.status === 'In Progress' ? 'text-blue-400 border-blue-900' : 'text-amber-400 border-amber-900'
                          } focus:outline-none`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Fulfilled">Fulfilled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB CONTENT: DONOR REGISTRY DATABASE
            ========================================== */}
        {activeTab === 'donors' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* Left Column: Form Action Panel */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 h-fit">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-red-500" />
                Register New Donor Profile
              </h2>
              <p className="text-xs text-slate-400 mb-6">Append an available resource node to the shared network grid.</p>
              
              <form onSubmit={handleRegisterDonor} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Full Legal Name</label>
                  <input 
                    type="text" required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm"
                    placeholder="Enter full name"
                    value={donorForm.name}
                    onChange={e => setDonorForm({...donorForm, name: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Age</label>
                    <input 
                      type="number" required min="18" max="65"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500 text-sm"
                      placeholder="Min 18"
                      value={donorForm.age}
                      onChange={e => setDonorForm({...donorForm, age: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Blood Configuration</label>
                    <select
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-red-500 text-sm"
                      value={donorForm.group}
                      onChange={e => setDonorForm({...donorForm, group: e.target.value})}
                    >
                      {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Resource Component Type</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-red-500 text-sm"
                    value={donorForm.type}
                    onChange={e => setDonorForm({...donorForm, type: e.target.value})}
                  >
                    {DONATION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Deployment Location Base</label>
                  <input 
                    type="text" required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500 text-sm"
                    placeholder="Facility name or city sector"
                    value={donorForm.location}
                    onChange={e => setDonorForm({...donorForm, location: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Secure Contact Index (Phone)</label>
                  <input 
                    type="tel" required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500 text-sm"
                    placeholder="555-XXXX"
                    value={donorForm.contact}
                    onChange={e => setDonorForm({...donorForm, contact: e.target.value})}
                  />
                </div>

                <button type="submit" className="w-full mt-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-150 shadow-lg shadow-red-900/20 text-sm">
                  Inject Node Data Structure
                </button>
              </form>
            </div>

            {/* Right Column: Database Records Grid Frame */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filter Matrix Configuration Panel */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input 
                      type="text"
                      placeholder="Query name or physical location vectors..."
                      value={donorSearch}
                      onChange={e => setDonorSearch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-slate-700"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                    <Filter className="w-4 h-4 text-slate-500 hidden sm:inline" />
                    <select
                      value={donorGroupFilter}
                      onChange={e => setDonorGroupFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-300 focus:outline-none"
                    >
                      <option value="All">All Groups</option>
                      {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>

                    <select
                      value={donorTypeFilter}
                      onChange={e => setDonorTypeFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-300 focus:outline-none"
                    >
                      <option value="All">All Components</option>
                      {DONATION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Infinite Stream Record Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDonors.length > 0 ? (
                  filteredDonors.map(donor => (
                    <div key={donor.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm flex flex-col justify-between hover:border-slate-700 transition">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-base text-slate-100">{donor.name}</h3>
                            <div className="flex gap-2 items-center mt-1">
                              <span className="text-[11px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                                Age: {donor.age}
                              </span>
                              <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                                donor.status === 'Available' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-slate-900 text-slate-500 border border-slate-800'
                              }`}>
                                {donor.status}
                              </span>
                            </div>
                          </div>
                          <span className="text-lg font-black px-3 py-1 bg-red-600 text-white rounded-lg min-w-[45px] text-center shadow-md">
                            {donor.group}
                          </span>
                        </div>

                        <div className="space-y-1.5 mt-4 pt-4 border-t border-slate-900 text-xs text-slate-400">
                          <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-slate-600" /> {donor.location}</p>
                          <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-600" /> {donor.contact}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-2">Resource Element: <span className="text-slate-300">{donor.type}</span></p>
                        </div>
                      </div>

                      <button 
                        onClick={() => alert(`Broadcast Alert Request transmitted securely to target endpoint descriptor mapping ${donor.id}.`)}
                        disabled={donor.status !== 'Available'}
                        className={`mt-4 w-full py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                          donor.status === 'Available' 
                            ? 'bg-slate-900 text-red-400 border border-red-900/30 hover:bg-red-950/30' 
                            : 'bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed'
                        }`}
                      >
                        Ping Alert Vector
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-16 bg-slate-950 rounded-2xl border border-dashed border-slate-800 text-slate-500">
                    Zero records parsed matching active state filtering constraints.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB CONTENT: EMERGENCY DESPATCH PANEL
            ========================================== */}
        {activeTab === 'requests' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* Left Hand: Request Entry Module */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 h-fit">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Dispatch Supply Request
              </h2>
              <p className="text-xs text-slate-400 mb-6">File a critical priority token to pull matched plasma or whole units.</p>

              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Patient Alias / Reference</label>
                  <input 
                    type="text" required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-amber-500 text-sm"
                    placeholder="e.g. Case Sub-04"
                    value={requestForm.patientName}
                    onChange={e => setRequestForm({...requestForm, patientName: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Group</label>
                    <select
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none text-sm"
                      value={requestForm.group}
                      onChange={e => setRequestForm({...requestForm, group: e.target.value})}
                    >
                      {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Volume Units</label>
                    <input 
                      type="number" required min="1" max="10"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 text-sm"
                      value={requestForm.unitsNeeded}
                      onChange={e => setRequestForm({...requestForm, unitsNeeded: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Component Taxonomy</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none text-sm"
                    value={requestForm.type}
                    onChange={e => setRequestForm({...requestForm, type: e.target.value})}
                  >
                    {DONATION_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Urgency Escalation State</label>
                  <select
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none text-sm"
                    value={requestForm.urgency}
                    onChange={e => setRequestForm({...requestForm, urgency: e.target.value})}
                  >
                    <option value="Normal">Normal Profile</option>
                    <option value="Urgent">Urgent Tier</option>
                    <option value="Critical">Critical Threat Vector</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Destination Trauma Facility</label>
                  <input 
                    type="text" required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none text-sm"
                    placeholder="Hospital coordinate name"
                    value={requestForm.location}
                    onChange={e => setRequestForm({...requestForm, location: e.target.value})}
                  />
                </div>

                <button type="submit" className="w-full mt-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition text-sm shadow-md">
                  Broadcast Request Stream
                </button>
              </form>
            </div>

            {/* Right Hand Component: Master Logs Tracker List */}
            <div className="lg:col-span-2">
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
                <div className="p-5 border-b border-slate-900 bg-slate-950 flex justify-between items-center">
                  <h3 className="font-bold text-white text-base">Network Telemetry Logs</h3>
                  <span className="text-xs text-slate-500 font-mono">Records evaluated: {requests.length}</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-900 bg-slate-900/40 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="p-4">Recipient Identity</th>
                        <th className="p-4">Type Class</th>
                        <th className="p-4">Target Pool</th>
                        <th className="p-4">Urgency Vector</th>
                        <th className="p-4">Operational Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900 text-sm">
                      {requests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="p-4">
                            <span className="block font-semibold text-slate-200">{req.patientName}</span>
                            <span className="block text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {req.location}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-xs text-slate-300">{req.type}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 bg-slate-900 text-slate-200 font-bold border border-slate-800 rounded font-mono">
                              {req.group}
                            </span>
                            <span className="text-xs text-slate-500 ml-2 font-mono">x{req.unitsNeeded}</span>
                          </td>
                          <td className="p-4">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              req.urgency === 'Critical' ? 'text-red-400 bg-red-950/40' :
                              req.urgency === 'Urgent' ? 'text-amber-400 bg-amber-950/40' : 'text-blue-400 bg-blue-950/40'
                            }`}>
                              {req.urgency}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                              req.status === 'Fulfilled' ? 'text-emerald-400' :
                              req.status === 'In Progress' ? 'text-blue-400' : 'text-amber-500 animate-pulse'
                            }`}>
                              <span className="w-1.5 h-1.5 rounded-full bg-current" />
                              {req.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            TAB CONTENT: CROSS-MATCH COMPATIBILITY MATRIX
            ========================================== */}
        {activeTab === 'compatibility' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-red-500" />
                Cross-Match Serology Reference Matrix
              </h2>
              <p className="text-xs text-slate-400">
                Interactive diagnostic interface for mapping molecular surface antigens during emergency transfusion logistics.
              </p>

              {/* Selector Bar */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {BLOOD_GROUPS.map(group => (
                  <button
                    key={group}
                    onClick={() => setSelectedMatchGroup(group === selectedMatchGroup ? null : group)}
                    className={`p-4 rounded-xl border font-black transition-all text-center flex flex-col justify-between items-center ${
                      selectedMatchGroup === group 
                        ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-900/40 transform -translate-y-0.5' 
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xl">{group}</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider font-normal mt-2 opacity-60">Evaluate</span>
                  </button>
                ))}
              </div>

              {/* Resolution Panel */}
              {selectedMatchGroup ? (
                <div className="mt-8 bg-slate-900/60 p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Safe Recipients Matrix for Donor Configuration ({selectedMatchGroup})
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {COMPATIBILITY_MATRIX[selectedMatchGroup].map(recipient => (
                        <span key={recipient} className="px-4 py-2 bg-emerald-950 border border-emerald-900 text-emerald-400 rounded-xl font-bold font-mono text-sm shadow-sm">
                          {recipient}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-4 leading-relaxed">
                      Units derived from a <strong className="text-slate-300">{selectedMatchGroup}</strong> donor profile node can safely be routed to clinical targets matching these verified receiver expressions without trigger-matching adverse immune agglutination.
                    </p>
                  </div>

                  <div className="border-t md:border-t-0 md:border-l border-slate-800 pt-6 md:pt-0 md:pl-8">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Real-Time Available Cluster Matches
                    </h4>
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2">
                      {donors.filter(d => d.group === selectedMatchGroup && d.status === 'Available').length > 0 ? (
                        donors.filter(d => d.group === selectedMatchGroup && d.status === 'Available').map(donor => (
                          <div key={donor.id} className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                            <span className="font-semibold text-slate-200">{donor.name}</span>
                            <span className="text-slate-500 font-mono">{donor.type} - {donor.location}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-600 py-4 italic">No active matching instances indexed in live server memory blocks.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-8 p-12 border border-dashed border-slate-800 rounded-2xl text-center text-xs text-slate-500">
                  Select a parent donor phenotype matrix node from the chart block above to compute safe inter-network transfusion paths.
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER SYSTEM STRIP */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pb-12 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-600 mt-6">
          Hemosync Network Pipeline Protocol Management System v4.12.0-STABLE. Distributed ledger configuration.
        </p>
      </footer>
    </div>
  );
}