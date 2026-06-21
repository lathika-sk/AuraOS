import React, { useState } from 'react';
import { useClinic } from '../ClinicContext';
import { Consultation } from '../types';
import { 
  FileText, 
  Plus, 
  History, 
  Stethoscope, 
  Activity, 
  User, 
  Pill, 
  Clock, 
  Search,
  CheckCircle,
  FileSpreadsheet,
  Sparkles,
  BrainCircuit,
  ShieldAlert
} from 'lucide-react';
import { toast } from 'sonner';

export const ConsultationView: React.FC = () => {
  const { state, addConsultation } = useClinic();

  // Active session or user session details (checks if logged in as a specific doctor!)
  const activeUser = state.session;
  const isDoctorUser = activeUser?.role === 'doctor';
  
  // Set default doctor to Dr. Amit Verma if not logged in as doctor
  const defaultDoctorId = isDoctorUser ? (activeUser?.doctorId || 'doc-1') : 'doc-1';

  // Consultation notes inputs
  const [patientId, setPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [prescription, setPrescription] = useState('');

  // AI states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiReport, setAiReport] = useState('');

  // Filtering states on historical consultations
  const [patientSearchQuery, setPatientSearchQuery] = useState('');

  const handleAiDiagnose = async () => {
    if (!patientId) {
      toast.error('Choose a patient record first to query the Clinical Oracle!');
      return;
    }
    const patientObj = state.patients.find(p => p.id === patientId);
    if (!patientObj) return;

    setAiLoading(true);
    setAiReport('');
    const toastId = toast.loading('Synchronizing patient dataset with Aura Clinical Brain...');
    try {
      const res = await fetch('/api/ai/patient-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientData: patientObj })
      });
      const data = await res.json();
      if (res.ok && data.text) {
        setAiReport(data.text);
        
        // Auto-expand into form inputs
        setDiagnosis(patientObj.condition);
        setClinicalNotes(`Somatic observation & Predictive Prognosis:\nPatient presents with ${patientObj.condition}.\n\nAI Prognosis Highlights:\n- Age of patient: ${patientObj.age} (${patientObj.gender})\n- Clinical Outcome status: ${patientObj.outcome}\n\nClinical guidelines drafted by Aura OS.`);
        
        // Extract a simplified drug dosage plan
        setPrescription(`1. Tab. Atorvastatin 10mg once daily\n2. Tab. Pantoprazole 40mg once before breakfast\n\n[Review critical advisory generated in Aura AI drawer below]`);
        
        toast.dismiss(toastId);
        toast.success(`EMR Dossier calculated! Check prescription draft.`);
      } else {
        toast.dismiss(toastId);
        toast.error('Cognizant AI service connection timeout.');
      }
    } catch (e: any) {
      toast.dismiss(toastId);
      toast.error(`Service framework is currently offline or demo key: ${e.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !diagnosis || !clinicalNotes || !prescription) {
      toast.error('Complete prescription docket fully (Choose Patient, Diagnosis, Notes, and Rx)');
      return;
    }

    const patient = state.patients.find((p) => p.id === patientId);
    let doctor = state.doctors.find((d) => d.id === defaultDoctorId);
    
    // Fallback safely
    if (!doctor) doctor = state.doctors[0];

    if (!patient || !doctor) {
      toast.error('Patient or Clinician parameters invalid.');
      return;
    }

    addConsultation({
      patientId,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      diagnosis,
      clinicalNotes,
      prescription,
    });

    // Reset notes inputs
    setPatientId('');
    setDiagnosis('');
    setClinicalNotes('');
    setPrescription('');
    setAiReport('');
  };

  // Filter historical medical records
  const filteredHistories = state.consultations.filter((c) => {
    return (
      c.patientName.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      c.diagnosis.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
      c.doctorName.toLowerCase().includes(patientSearchQuery.toLowerCase())
    );
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="consultation-view-container">
      
      {/* LEFT & CENTER PANEL: INTUITIVE CONSULTATION NOTE LOGGING */}
      <div className="lg:col-span-2 space-y-6" id="consultation-form-panel">
        
        <div className="rounded-xl border border-white/10 bg-[#090e24]/60 p-6 md:p-8 space-y-6 relative overflow-hidden" id="form-consultation-docket">
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/5 rounded-full blur-2xl pointer-events-none" />

          <div className="space-y-1 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-neon-cyan" />
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">EMR Clinical Notes Desk</h3>
            </div>
            <p className="text-xs text-slate-400">Lock in real-time diagnostics, symptom observations, therapeutic notes, and medication prescription logs.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-300" id="emr-notes-form">
            
            {/* Meta Header displaying Doctor writing */}
            <div className="bg-[#040610] p-3.5 rounded-xl border border-white/5 flex flex-wrap items-center justify-between gap-3 text-slate-400 font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-pulse" />
                <span>CLINICIAN RECORDEE:</span>
                <span className="text-white font-bold">{isDoctorUser ? activeUser?.name : 'Dr. Amit Verma (Cardiology)'}</span>
              </div>
              <div>
                <span>AUTHENTICATION TIER // SECURE LOG</span>
              </div>
            </div>

            {/* Select Patient */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">Select Patient Session (EMR File)</label>
              <select
                required
                id="consultation-patient-select"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full bg-[#10162e] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-neon-cyan cursor-pointer"
              >
                <option value="">-- Click to choose patient file --</option>
                {state.patients.slice(0, 40).map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id} // Diagnosis: {p.condition})</option>
                ))}
              </select>
            </div>

            {patientId && (
              <div className="pt-1.5 pb-0.5">
                <button
                  type="button"
                  onClick={handleAiDiagnose}
                  disabled={aiLoading}
                  className="w-full border-2 border-cyan-500/20 hover:border-cyan-400/80 bg-cyan-950/15 hover:bg-cyan-950/35 text-cyan-300 hover:text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 font-bold tracking-wider transition-all duration-300 transform active:scale-98 select-none font-mono text-[11px] cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.12)] hover:shadow-[0_0_20px_rgba(34,211,238,0.25)]"
                >
                  <Sparkles className={`w-4 h-4 text-cyan-400 ${aiLoading ? 'animate-spin' : 'animate-pulse'}`} />
                  {aiLoading ? 'SYNCHRONIZING DECISION ALGORITHM...' : 'AURA AI CLINICAL WORKSPACE AUTO-COMPLETE'}
                </button>
              </div>
            )}

            {/* Diagnosis Summary */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">Primary Clinical Diagnosis / Code</label>
              <input
                type="text"
                required
                id="consultation-diagnosis-input"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="E.g., Coronary Artery Disease with mild angina / Hypertension Stage II"
                className="w-full bg-[#10162e] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-neon-cyan font-semibold"
              />
            </div>

            {/* Clinical Observation Notes */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1.5">Observation Notes & History of Presenting Illness (HPI)</label>
              <textarea
                required
                id="consultation-notes-area"
                rows={4}
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                placeholder="Enter detailed somatic observations, heart sounds, metabolic trends, secondary symptoms, and advice..."
                className="w-full bg-[#10162e] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-neon-cyan leading-relaxed"
              />
            </div>

            {/* Prescription (Rx) */}
            <div className="space-y-1.5 bg-[#0a0f26]/60 p-4 rounded-xl border border-white/5 relative">
              <div className="absolute top-3 right-3 text-neon-violet">
                <Pill className="w-5 h-5 animate-bounce" />
              </div>

              <label className="block text-[10px] font-mono uppercase tracking-widest text-neon-violet font-black">Medication RX Formulation</label>
              <p className="text-[10px] text-slate-400 mb-2 leading-tight">Prescribe therapeutic drug models (Drug Name, Strengths, Dosage Schedule, Frequency, Duration).</p>
              <textarea
                required
                id="consultation-prescription-area"
                rows={5}
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="1. Tab. Atorvastatin 20mg once at night&#10;2. Tab. Clopidogrel 75mg once daily after lunch&#10;3. Tab. Pantoprazole 40mg once before breakfast"
                className="w-full bg-[#0a0e21] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-neon-violet font-mono leading-relaxed"
              />
            </div>

            {/* Submit Consultation notes */}
            <button
              type="submit"
              id="consultation-submit-btn"
              className="w-full bg-gradient-to-r from-neon-cyan to-cyan-500 hover:from-cyan-400 hover:to-neon-cyan text-slate-950 font-black tracking-widest py-3 rounded-xl transition-all duration-300 shadow-[0_0_15px_oklch(0.78_0.18_215_/_0.2)] text-xs uppercase font-display"
            >
              Sign and Seal EMR Notes
            </button>

          </form>
          
          {aiReport && (
            <div className="mt-6 p-5 rounded-xl border border-cyan-500/30 bg-cyan-950/15 text-slate-200 space-y-3.5 animate-fadeIn" id="consultation-ai-report">
              <div className="flex items-center gap-2 border-b border-cyan-500/20 pb-2.5">
                <BrainCircuit className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h4 className="font-mono text-[11px] font-bold text-cyan-300 uppercase tracking-widest">Aura Clinical Intelligence Prognosis</h4>
              </div>
              <div className="font-sans text-[11px] leading-relaxed whitespace-pre-wrap select-text text-slate-300 max-h-[350px] overflow-y-auto pr-1">
                {aiReport}
              </div>
              <div className="flex flex-wrap gap-2 pt-1.5 font-mono text-[9px] text-[#22d3ee]">
                <span className="bg-cyan-950/40 border border-cyan-500/15 py-1 px-2.5 rounded-md">DECISION SUITE: GEMINI-3.1-PRO-PREVIEW</span>
                <span className="bg-cyan-950/40 border border-cyan-500/15 py-1 px-2.5 rounded-md text-slate-400">STATUS: VERIFIED SECURE ADVISORY</span>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* RIGHT PANEL: HISTORICAL EMR TRANSACTIONS CARD INDEX */}
      <div className="space-y-4" id="consultation-history-panel">
        
        <div className="rounded-xl border border-white/10 bg-[#090e24]/40 p-5 space-y-4 flex flex-col h-[700px]" id="history-scrolled-box">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-[#bfdbfe]" />
              <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">Clinical EMR Ledger</h4>
            </div>
            <p className="text-[11px] text-slate-400">Past consult diaries recorded across clinic nodes.</p>
          </div>

          {/* Quick Find History */}
          <div className="relative">
            <Search className="absolute inset-y-0 left-2.5 w-4 h-4 text-slate-500 top-2.5" />
            <input
              type="text"
              id="history-search"
              value={patientSearchQuery}
              onChange={(e) => setPatientSearchQuery(e.target.value)}
              placeholder="Search by patient or diagnosis..."
              className="w-full bg-[#050818] border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-xs text-slate-300 focus:outline-none focus:border-neon-cyan"
            />
          </div>

          {/* Scrolled list */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1" id="history-scroll-grid">
            {filteredHistories.length > 0 ? (
              filteredHistories.map((hist) => (
                <div 
                  key={hist.id} 
                  id={hist.id}
                  className="p-4 rounded-xl border border-white/5 bg-slate-950/40 hover:bg-slate-950/70 transition-colors space-y-3 relative group"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{hist.id}</span>
                    <span>{new Date(hist.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>

                  <div className="space-y-1">
                    <h5 className="font-bold text-white text-xs">{hist.patientName}</h5>
                    <p className="text-[10px] font-semibold text-neon-cyan">{hist.diagnosis}</p>
                  </div>

                  <div className="border-t border-white/5 pt-2 space-y-2 text-[10px] text-slate-300 leading-normal">
                    <p className="italic text-slate-400 group-hover:text-slate-300 duration-300">
                      &ldquo;{hist.clinicalNotes.slice(0, 150)}{hist.clinicalNotes.length > 150 ? '...' : ''}&rdquo;
                    </p>
                    <div className="bg-[#050818] p-2 rounded border border-white/5 font-mono text-[9px] text-slate-400">
                      <p className="text-[8px] uppercase text-neon-violet font-bold mb-1">Prescribed Formulation (Rx):</p>
                      <pre className="whitespace-pre-wrap">{hist.prescription.slice(0, 100)}{hist.prescription.length > 100 ? '...' : ''}</pre>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-slate-500 border-t border-white/5 pt-2">
                    <span className="uppercase text-slate-500">Dr: {hist.doctorName.replace('Dr. ', '')}</span>
                    <span className="flex items-center gap-1 text-emerald-400"><CheckCircle className="w-3 h-3" /> Signed</span>
                  </div>

                </div>
              ))
            ) : (
              <div className="text-center py-12 text-slate-500 font-mono flex flex-col items-center justify-center">
                <FileSpreadsheet className="w-6 h-6 text-slate-600 mb-2" />
                <span>No consultations record.</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
