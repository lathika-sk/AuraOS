import React, { useState } from 'react';
import { useClinic } from '../ClinicContext';
import { Patient } from '../types';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  UserPlus, 
  ArrowRight, 
  Check, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Filter,
  IndianRupee,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export const PatientsView: React.FC = () => {
  const { state, addPatient, updatePatient, deletePatient, issueQueueToken } = useClinic();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');
  
  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modals / Editor States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Queue issue state
  const [isIssueOpen, setIsIssueOpen] = useState<string | null>(null); // Patient ID

  // Form states for new patient / editing patient
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState<number>(35);
  const [formGender, setFormGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [formPhone, setFormPhone] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCondition, setFormCondition] = useState('');
  const [formProcedure, setFormProcedure] = useState('');
  const [formCost, setFormCost] = useState<number>(0);
  const [formLengthOfStay, setFormLengthOfStay] = useState<number>(0);

  // Cities extracted for filter dropdown
  const uniqueCities = Array.from(new Set(state.patients.map((p) => p.city))).sort();

  // Reset form helper
  const resetForm = () => {
    setFormName('');
    setFormAge(35);
    setFormGender('Male');
    setFormPhone('');
    setFormCity('');
    setFormAddress('');
    setFormCondition('');
    setFormProcedure('');
    setFormCost(2000);
    setFormLengthOfStay(1);
  };

  // Trigger Edit mode
  const handleEditClick = (p: Patient) => {
    setSelectedPatient(p);
    setFormName(p.name);
    setFormAge(p.age);
    setFormGender(p.gender);
    setFormPhone(p.phone);
    setFormCity(p.city);
    setFormAddress(p.address);
    setFormCondition(p.condition);
    setFormProcedure(p.procedure);
    setFormCost(p.cost);
    setFormLengthOfStay(p.lengthOfStay);
    setIsEditModalOpen(true);
  };

  // Submit handlers
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone || !formCondition) {
      toast.error('Please complete required fields (Name, Phone, Condition)');
      return;
    }
    addPatient({
      name: formName,
      age: Number(formAge),
      gender: formGender,
      phone: formPhone,
      city: formCity || 'Mumbai',
      address: formAddress || 'Clinic Register Walk-In',
      condition: formCondition,
      procedure: formProcedure || 'Standard Consultation',
      cost: Number(formCost),
      lengthOfStay: Number(formLengthOfStay),
      readmissionFlag: false,
    });
    setIsAddModalOpen(false);
    resetForm();
    setCurrentPage(1); // Back to page 1 to see the prepend
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    updatePatient({
      ...selectedPatient,
      name: formName,
      age: Number(formAge),
      gender: formGender,
      phone: formPhone,
      city: formCity,
      address: formAddress,
      condition: formCondition,
      procedure: formProcedure,
      cost: Number(formCost),
      lengthOfStay: Number(formLengthOfStay),
    });
    setIsEditModalOpen(false);
    setSelectedPatient(null);
    resetForm();
  };

  // Filter patients
  const filteredPatients = state.patients.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.procedure.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = genderFilter === 'All' || p.gender === genderFilter;
    const matchesCity = cityFilter === 'All' || p.city === cityFilter;

    return matchesSearch && matchesGender && matchesCity;
  });

  // Paginated chunk
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage) || 1;
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6" id="patients-view-container">
      
      {/* Search and control Header panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl glass-panel relative overflow-hidden" id="patients-filter-header">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold tracking-normal uppercase text-white">PATIENT DIRECTORY</h2>
          <p className="text-xs text-slate-400">Manage clinically enrolled patient dossiers, history, billing metrics, and issue queue tokens.</p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-2 bg-linear-to-r from-neon-cyan to-cyan-500 hover:from-cyan-400 hover:to-neon-cyan text-slate-950 font-bold px-4 py-2.5 rounded-xl transition-all duration-300 transform active:scale-95 text-xs uppercase"
          id="btn-add-patient-trigger"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Patient</span>
        </button>
      </div>

      {/* Main Filters & Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-950/20 p-4 rounded-xl border border-white/5" id="patients-toolbar">
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="patient-search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by ID, name, diagnosis, phone, city..."
            className="w-full bg-[#0a0f26] border border-white/8 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 focus:outline-none focus:border-neon-cyan transition-all"
          />
        </div>

        {/* Gender Filter */}
        <div className="relative">
          <select
            id="filter-gender-select"
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#0a0f26] border border-white/8 rounded-xl py-2 px-3 text-xs text-slate-400 focus:outline-none focus:border-neon-cyan cursor-pointer"
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* City Filter */}
        <div className="relative">
          <select
            id="filter-city-select"
            value={cityFilter}
            onChange={(e) => {
              setCityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-[#0a0f26] border border-white/8 rounded-xl py-2 px-3 text-xs text-slate-400 focus:outline-none focus:border-neon-cyan cursor-pointer"
          >
            <option value="All">All Cities (Indian Standard)</option>
            {uniqueCities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Patients Data Table Grid */}
      <div className="relative overflow-hidden rounded-xl border border-white/8 bg-slate-950/30 shadow-lg" id="patients-table-holder">
        <div className="overflow-x-auto">
          <table className="w-full text-left" id="patients-data-table">
            <thead>
              <tr className="bg-[#0b1022] text-xs font-mono uppercase text-slate-400 border-b border-white/10">
                <th className="py-3 px-4 font-semibold">Patient Ident & Name</th>
                <th className="py-3 px-4 font-semibold">Age / Sex</th>
                <th className="py-3 px-4 font-semibold">Contact / City</th>
                <th className="py-3 px-4 font-semibold">Assigned Diagnosis</th>
                <th className="py-3 px-4 font-semibold">Total Cost (₹)</th>
                <th className="py-3 px-4 font-semibold text-center">Service Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-300">
              {paginatedPatients.length > 0 ? (
                paginatedPatients.map((p) => (
                  <tr 
                    key={p.id} 
                    id={`row-${p.id}`}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Patient Ident + Name */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-400/10 to-violet-600/10 border border-slate-700 flex items-center justify-center font-bold text-neon-cyan">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white tracking-wide">{p.name}</p>
                          <p className="text-[10px] font-mono text-neon-cyan uppercase mt-0.5">{p.id}</p>
                        </div>
                      </div>
                    </td>

                    {/* Age / Sex */}
                    <td className="py-3.5 px-4 font-mono font-medium">
                      {p.age} Yrs &bull; {p.gender.toUpperCase()}
                    </td>

                    {/* Contact & City */}
                    <td className="py-3.5 px-4">
                      <p className="font-mono text-[11px]">{p.phone}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{p.city}</p>
                    </td>

                    {/* Diagnosis / Condition */}
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-200">{p.condition}</p>
                      <p className="text-[10px] text-slate-400 float-left clear-both italic mt-0.5">{p.procedure}</p>
                    </td>

                    {/* Cost format Indian standard */}
                    <td className="py-3.5 px-4 font-mono text-slate-200 font-bold">
                      ₹{p.cost.toLocaleString('en-IN')}
                    </td>

                    {/* Action Panel */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2 relative">
                        {/* Issue Token button opens inline doctor selector */}
                        <div className="relative">
                          <button
                            id={`btn-issue-${p.id}`}
                            onClick={() => setIsIssueOpen(isIssueOpen === p.id ? null : p.id)}
                            className="bg-neon-cyan/10 hover:bg-neon-cyan hover:text-slate-950 text-neon-cyan px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase transition-all duration-200 flex items-center gap-1 cursor-pointer"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Issue Token</span>
                          </button>

                          {/* Quick Doctor Selection Subpanel */}
                          {isIssueOpen === p.id && (
                            <div className="absolute right-0 bottom-full mb-2 w-56 rounded-xl bg-[#090f28] border border-neon-cyan/30 shadow-[0_0_20px_rgba(6,182,212,0.3)] p-2.5 z-40 space-y-1.5" id={`issue-dropdown-${p.id}`}>
                              <p className="text-[10px] font-mono uppercase text-slate-400 border-b border-white/5 pb-1 mb-1.5 font-bold tracking-wider">Assign Clinician</p>
                              {state.doctors.map((d) => (
                                <button
                                  key={d.id}
                                  onClick={() => {
                                    issueQueueToken(p.id, d.id);
                                    setIsIssueOpen(null);
                                  }}
                                  className="w-full text-left p-1.5 rounded-md hover:bg-neon-cyan/10 text-slate-300 hover:text-neon-cyan text-[11px] font-medium flex items-center justify-between transition-colors cursor-pointer"
                                  id={`issue-to-doc-${d.id}`}
                                >
                                  <span>{d.name}</span>
                                  <span className="text-[9px] text-slate-500 font-mono italic">{d.specialty}</span>
                                </button>
                              ))}
                              <button 
                                onClick={() => setIsIssueOpen(null)}
                                className="w-full text-center text-[10px] text-rose-400 hover:bg-rose-500/10 py-1.5 rounded border border-rose-500/10 mt-1 uppercase font-semibold cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Edit Button */}
                        <button
                          id={`btn-edit-${p.id}`}
                          onClick={() => handleEditClick(p)}
                          className="p-1 px-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          id={`btn-delete-${p.id}`}
                          onClick={() => {
                            if (confirm(`Remove patient record for ${p.name}? This is permanent.`)) {
                              deletePatient(p.id);
                            }
                          }}
                          className="p-1 px-1.5 bg-rose-950/45 hover:bg-rose-800 text-rose-400 rounded hover:text-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400 font-mono">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                    <span>No medical records found matching filters.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Pagination Bar */}
        <div className="p-4 bg-[#080d21] border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400" id="patients-pagination">
          <p className="font-mono">
            Showing <span className="text-neon-cyan font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="text-neon-cyan font-bold">{Math.min(currentPage * itemsPerPage, filteredPatients.length)}</span> of{' '}
            <span className="text-white font-bold">{filteredPatients.length}</span> patient files
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((c) => Math.max(1, c - 1))}
              disabled={currentPage === 1}
              className="p-2 py-1 bg-slate-900 border border-slate-800 rounded text-[#bfdbfe] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono px-3">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage((c) => Math.min(totalPages, c + 1))}
              disabled={currentPage === totalPages}
              className="p-2 py-1 bg-slate-900 border border-slate-800 rounded text-[#bfdbfe] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ADD / EDIT PATIENT SEAMLESS MODALS */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-[#090f28] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 overflow-y-auto max-h-[90vh]">
            
            {/* Header info */}
            <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-6">
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                {isAddModalOpen ? 'ENROLL PATIENT DOSSIER' : 'REWRITE CLINIC DOSSIER'}
              </h3>
              <button 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  resetForm();
                }}
                className="p-1 rounded-full bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleAddSubmit : handleEditSubmit} className="space-y-4 text-xs text-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Full name */}
                <div>
                  <label className="block text-slate-400 mb-1">Patient Full Name (Required)</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Amit Kumar Gupta"
                    className="w-full bg-[#101735] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                {/* Mobile phone */}
                <div>
                  <label className="block text-slate-400 mb-1">Mobile Contact Phone (Required)</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="+91 91234 56789"
                    className="w-full bg-[#101735] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-neon-cyan font-mono"
                  />
                </div>

                {/* Age */}
                <div>
                  <label className="block text-slate-400 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={formAge}
                    onChange={(e) => setFormAge(Number(e.target.value))}
                    min={1}
                    max={120}
                    className="w-full bg-[#101735] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-neon-cyan font-mono"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-slate-400 mb-1">Biological Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    className="w-full bg-[#101735] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-neon-cyan cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-slate-400 mb-1">Assigned City</label>
                  <input
                    type="text"
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="Mumbai"
                    className="w-full bg-[#101735] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                {/* Full Address */}
                <div>
                  <label className="block text-slate-400 mb-1">Home Address Detailed</label>
                  <input
                    type="text"
                    value={formAddress}
                    onChange={(e) => setFormAddress(e.target.value)}
                    placeholder="Flat 101, Galaxy Towers"
                    className="w-full bg-[#101735] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                {/* Clinical Diagnosis (Condition) */}
                <div>
                  <label className="block text-slate-400 mb-1">Diagnostic Condition Description (Required)</label>
                  <input
                    type="text"
                    required
                    value={formCondition}
                    onChange={(e) => setFormCondition(e.target.value)}
                    placeholder="Type 2 Diabetes / Gastroenteritis"
                    className="w-full bg-[#101735] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                {/* Treatment / Procedure */}
                <div>
                  <label className="block text-slate-400 mb-1">Treatment / Clinical Procedure</label>
                  <input
                    type="text"
                    value={formProcedure}
                    onChange={(e) => setFormProcedure(e.target.value)}
                    placeholder="Angioplasty / Nebulization therapy"
                    className="w-full bg-[#101735] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>

                {/* Cost */}
                <div>
                  <label className="block text-slate-400 mb-1">Projected Treatment Cost (₹ INR)</label>
                  <input
                    type="number"
                    value={formCost}
                    onChange={(e) => setFormCost(Number(e.target.value))}
                    className="w-full bg-[#101735] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-neon-cyan font-mono"
                  />
                </div>

                {/* Length of Stay */}
                <div>
                  <label className="block text-slate-400 mb-1">Estimated Length of Stay (Days)</label>
                  <input
                    type="number"
                    value={formLengthOfStay}
                    onChange={(e) => setFormLengthOfStay(Number(e.target.value))}
                    min={0}
                    className="w-full bg-[#101735] border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-neon-cyan font-mono"
                  />
                </div>

              </div>

              {/* Action operations buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/8 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 hover:bg-white/5 border border-white/5 text-slate-400 hover:text-white rounded-xl text-xs uppercase cursor-pointer"
                >
                  Cancel Actions
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-neon-cyan to-cyan-500 hover:from-cyan-400 hover:to-neon-cyan text-slate-950 font-bold rounded-xl text-xs uppercase cursor-pointer shadow-[0_0_15px_oklch(0.78_0.18_215_/_0.2)]"
                >
                  {isAddModalOpen ? 'Create Record' : 'Apply Changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
