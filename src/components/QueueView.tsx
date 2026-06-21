import React, { useState } from 'react';
import { useClinic } from '../ClinicContext';
import { useTranslation } from '../LanguageContext';
import { QueueItem } from '../types';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp, 
  UserCheck, 
  Activity, 
  Plus, 
  TrendingDown,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

export const QueueView: React.FC = () => {
  const { state, callInToken, completeToken, issueQueueToken } = useClinic();
  const { locale, t } = useTranslation();
  const [fastPatientId, setFastPatientId] = useState('');
  const [fastDoctorId, setFastDoctorId] = useState('');

  // Segregate Queue tokens by current status
  const waitingTokens = state.queue.filter((q) => q.status === 'Waiting');
  const inProgressTokens = state.queue.filter((q) => q.status === 'In Progress');
  const completedTokens = state.queue.filter((q) => q.status === 'Completed');

  // Currently Active "Now Serving" token
  // Typically, the first item in the "In Progress" list, or the latest completed if none is in progress.
  const nowServing = inProgressTokens[0] || null;

  // Compute stats
  const totalVolumeToday = state.queue.length;
  const completionRate = totalVolumeToday > 0 
    ? Math.round((completedTokens.length / totalVolumeToday) * 100) 
    : 0;

  // List of patients not in active queue (to offer fast issue token)
  const availablePatients = state.patients.filter((p) => {
    return !state.queue.some(
      (q) => q.patientId === p.id && (q.status === 'Waiting' || q.status === 'In Progress')
    );
  }).slice(0, 15); // limit select size for speed

  const handleFastIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fastPatientId || !fastDoctorId) {
      toast.error('Select both patient and clinician to issue queue token.');
      return;
    }
    issueQueueToken(fastPatientId, fastDoctorId);
    setFastPatientId('');
    setFastDoctorId('');
  };

  return (
    <div className="space-y-6" id="queue-view-container">
      
      {/* NOW SERVING SCREEN */}
      <div className="relative overflow-hidden rounded-2xl border border-neon-cyan/20 bg-linear-to-r from-slate-950 via-[#070e24] to-[#040612] p-6 shadow-[0_0_25px_rgba(6,182,212,0.15)]" id="queue-now-serving-banner">
        {/* Glow grid watermark */}
        <div className="absolute inset-0 bg-grid-overlay opacity-5 pointer-events-none" />
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-neon-cyan/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6" id="banner-focal-point">
          
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
              <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase font-bold">
                {locale === 'ta' ? 'நேரடி ஓபிடி அமர்வு' : locale === 'hi' ? 'सक्रिय ओपीडी सत्र' : 'OPD SESSION LIVE INGRESS'}
              </span>
            </div>
            <h2 className="font-display text-2xl font-black text-white">
              {locale === 'ta' ? 'தற்போது அழைக்கப்படுபவர்' : locale === 'hi' ? 'अभी सेवा जारी है' : 'NOW SERVING CLIENTELE'}
            </h2>
            <p className="text-xs text-slate-400">
              {locale === 'ta' ? 'அறிவிப்பு பலகைகளுடன் ஒத்திசைக்கப்பட்ட ஒலி ஒளி அமைப்பு.' : locale === 'hi' ? 'अस्पताल के डिस्प्ले बोर्डों के साथ समकालिक दृश्य-श्रव्य प्रणाली।' : 'Audio visual announcement network synched across hospital display boards.'}
            </p>
          </div>

          {/* Glowing Token Center Stage */}
          <div className="flex flex-col md:flex-row items-center gap-6 bg-[#040718]/80 border border-white/5 p-4 rounded-2xl w-full max-w-xl shadow-lg" id="now-serving-badge-center">
            
            <div className="w-24 h-24 rounded-xl bg-linear-to-br from-neon-cyan/20 to-cyan-500/10 border border-neon-cyan/50 flex flex-col items-center justify-center text-center shrink-0 shadow-[0_0_20px_oklch(0.78_0.18_215_/_0.2)]">
              <span className="text-[9px] font-mono text-slate-400 leading-none">
                {locale === 'ta' ? 'டோக்கன்' : locale === 'hi' ? 'टोकन' : 'TOKEN'}
              </span>
              <span className="font-display text-4xl font-extrabold text-neon-cyan leading-none mt-1.5 glow-cyan-text">
                {nowServing ? nowServing.tokenNumber : '103'}
              </span>
              <span className="text-[8px] font-mono text-emerald-400 mt-1 uppercase font-extrabold px-1 bg-emerald-400/10 rounded">
                {locale === 'ta' ? 'செயலில்' : locale === 'hi' ? 'सक्रिय' : 'ACTIVE'}
              </span>
            </div>

            <div className="space-y-2 text-center md:text-left w-full">
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase">
                  {locale === 'ta' ? 'பதிவு செய்யப்பட்ட நோயாளி' : locale === 'hi' ? 'पंजीकृत मरीज़' : 'Registered Patient'}
                </p>
                <p className="text-lg font-black text-white leading-snug tracking-wide">
                  {nowServing ? nowServing.patientName : 'Sandeep Saxena'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-t border-white/5 pt-2">
                <div>
                  <p className="text-[9px] font-mono text-slate-500 uppercase">
                    {locale === 'ta' ? 'ஒதுக்கப்பட்ட மருத்துவர்' : locale === 'hi' ? 'आवंटित डॉक्टर' : 'Assigned Doctor'}
                  </p>
                  <p className="font-semibold text-slate-300">{nowServing ? nowServing.assignedDoctorName : 'Dr. Priya Nair'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-mono text-slate-500 uppercase">
                    {locale === 'ta' ? 'ஆலோசனை அறை' : locale === 'hi' ? 'परामर्श कक्ष' : 'Consult Clinic'}
                  </p>
                  <p className="font-mono text-neon-cyan uppercase">Room 102</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* THREE-COLUMN KANBAN BOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="queue-kanban-row">
        
        {/* Kanban Area (3 Columns of 4 grid spaces) */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4" id="kanban-grid-holder">
          
          {/* COLUMN 1: WAITING */}
          <div className="rounded-xl border border-white/5 bg-[#0a0f26]/30 flex flex-col min-h-[450px]" id="column-waiting">
            <div className="p-4 bg-slate-950/45 rounded-t-xl border-b border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <h4 className="font-display text-xs font-bold text-slate-300 uppercase tracking-widest">
                  {locale === 'ta' ? '1. காத்திருப்பு' : locale === 'hi' ? '1. प्रतीक्षारत' : '1. Waiting'}
                </h4>
              </div>
              <span className="font-mono text-xs font-bold text-slate-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                {waitingTokens.length}
              </span>
            </div>

            <div className="p-3 space-y-3 flex-1 overflow-y-auto" id="kanban-waiting-list">
              {waitingTokens.length > 0 ? (
                waitingTokens.map((item) => (
                  <div 
                    key={item.tokenNumber} 
                    id={`token-card-${item.tokenNumber}`}
                    className="p-4 rounded-lg bg-linear-to-br from-[#0e1634] to-[#080c1e] border border-white/8 hover:border-neon-cyan/40 transition-all shadow-md hover:shadow-[0_0_15px_rgba(6,182,212,0.1)] group relative overflow-hidden"
                  >
                    {/* Token Ribbon Corner */}
                    <div className="absolute top-0 right-0 w-16 h-4 bg-neon-cyan/10 text-neon-cyan text-[8px] font-mono font-bold flex items-center justify-center border-l border-b border-neon-cyan/20 px-1.5 uppercase tracking-wide">
                      {locale === 'ta' ? 'காத்திருப்பு' : locale === 'hi' ? 'प्रतिक्षा' : 'WAITING'}
                    </div>

                    <p className="font-display text-xs font-extrabold text-neon-cyan font-mono mb-2">{locale === 'ta' ? 'டோக்கன்' : locale === 'hi' ? 'टोकन' : 'TOKEN'} #{item.tokenNumber}</p>
                    <h5 className="font-bold text-white text-sm">{item.patientName}</h5>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-violet-400 rounded-full shrink-0" />
                      <span>{item.assignedDoctorName}</span>
                    </p>

                    <div className="border-t border-white/5 mt-4 pt-3 flex items-center justify-between gap-2">
                      <span className="text-[9px] font-mono text-slate-500">
                        {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <button
                        onClick={() => callInToken(item.tokenNumber)}
                        className="bg-neon-cyan hover:bg-cyan-400 text-slate-950 font-bold tracking-wider px-3 py-1.5 rounded-md text-[10px] uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-[0_0_8px_rgba(6,182,212,0.15)] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        id={`btn-call-${item.tokenNumber}`}
                      >
                        <Play className="w-3 h-3 fill-slate-950" />
                        <span>{locale === 'ta' ? 'அழைக்கணும்' : locale === 'hi' ? 'बुलाएं' : 'Call In'}</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center flex-col text-center p-6 text-slate-500 font-mono">
                  <UserCheck className="w-6 h-6 text-slate-600 mb-2" />
                  <span className="text-[11px]">
                    {locale === 'ta' ? 'காத்திருப்பு வரிசையில் நோயாளிகள் இல்லை.' : locale === 'hi' ? 'कतार में कोई मरीज़ प्रतीक्षारत नहीं है।' : 'No patients waiting in queue.'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 2: IN PROGRESS */}
          <div className="rounded-xl border border-neon-violet/10 bg-[#0a0f26]/30 flex flex-col min-h-[450px]" id="column-inprogress">
            <div className="p-4 bg-slate-950/45 rounded-t-xl border-b border-neon-violet/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-neon-violet" />
                <h4 className="font-display text-xs font-bold text-slate-300 uppercase tracking-widest">
                  {locale === 'ta' ? '2. ஆலோசனை' : locale === 'hi' ? '2. प्रगति पर' : '2. In Progress'}
                </h4>
              </div>
              <span className="font-mono text-xs font-bold text-neon-violet bg-neon-violet/5 border border-neon-violet/10 px-2 py-0.5 rounded-full">
                {inProgressTokens.length}
              </span>
            </div>

            <div className="p-3 space-y-3 flex-1 overflow-y-auto" id="kanban-inprogress-list">
              {inProgressTokens.length > 0 ? (
                inProgressTokens.map((item) => (
                  <div 
                    key={item.tokenNumber} 
                    id={`token-card-${item.tokenNumber}`}
                    className="p-4 rounded-lg bg-linear-to-br from-[#0e1634] to-[#080c1e] border border-neon-violet/20 hover:border-neon-violet/50 transition-all shadow-md hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] group relative overflow-hidden"
                  >
                    {/* Token Status Ribbon */}
                    <div className="absolute top-0 right-0 w-20 h-4 bg-neon-violet/20 text-neon-violet text-[8px] font-mono font-bold flex items-center justify-center border-l border-b border-neon-violet/30 px-1.5 uppercase tracking-wide">
                      {locale === 'ta' ? 'ஆலோசனை' : locale === 'hi' ? 'परामर्श' : 'CONSULTING'}
                    </div>

                    <p className="font-display text-xs font-extrabold text-[#c084fc] font-mono mb-2">{locale === 'ta' ? 'டோக்கன்' : locale === 'hi' ? 'टोकन' : 'TOKEN'} #{item.tokenNumber}</p>
                    <h5 className="font-bold text-white text-sm">{item.patientName}</h5>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-neon-cyan rounded-full shrink-0 animate-pulse" />
                      <span>{item.assignedDoctorName}</span>
                    </p>

                    <div className="border-t border-white/5 mt-4 pt-3 flex items-center justify-between gap-2">
                      <span className="text-[9px] font-mono text-slate-500">
                        Room 102 (OPD)
                      </span>
                      <button
                        onClick={() => completeToken(item.tokenNumber)}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold tracking-wider px-3 py-1.5 rounded-md text-[10px] uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-[0_0_8px_rgba(16,185,129,0.15)] hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                        id={`btn-complete-${item.tokenNumber}`}
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span>{locale === 'ta' ? 'முடிந்தது' : locale === 'hi' ? 'पूरा करें' : 'Complete'}</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center flex-col text-center p-6 text-slate-500 font-mono">
                  <AlertCircle className="w-6 h-6 text-slate-600 mb-2 animate-bounce" />
                  <span className="text-[11px]">
                    {locale === 'ta' ? 'தற்போது ஆலோசனைகள் ஏதும் இல்லை.' : locale === 'hi' ? 'वर्तमान में कोई परामर्श नहीं चल रहा है।' : 'No consultation currently active.'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* COLUMN 3: COMPLETED */}
          <div className="rounded-xl border border-white/5 bg-[#0a0f26]/20 flex flex-col min-h-[450px]" id="column-completed">
            <div className="p-4 bg-slate-950/45 rounded-t-xl border-b border-white/8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h4 className="font-display text-xs font-bold text-slate-300 uppercase tracking-widest">
                  {locale === 'ta' ? '3. முடிந்தது' : locale === 'hi' ? '3. संपन्न' : '3. Completed'}
                </h4>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-400/5 border border-emerald-400/10 px-2 py-0.5 rounded-full">
                {completedTokens.length}
              </span>
            </div>

            <div className="p-3 space-y-3 flex-1 overflow-y-auto" id="kanban-completed-list">
              {completedTokens.length > 0 ? (
                completedTokens.map((item) => (
                  <div 
                    key={item.tokenNumber} 
                    id={`token-card-${item.tokenNumber}`}
                    className="p-4 rounded-lg bg-linear-to-br from-[#090d24] to-[#040612] border border-white/4 opacity-65 group relative overflow-hidden"
                  >
                    <p className="font-display text-xs font-extrabold text-emerald-400 font-mono mb-2">{locale === 'ta' ? 'டோக்கன்' : locale === 'hi' ? 'टोकन' : 'TOKEN'} #{item.tokenNumber}</p>
                    <h5 className="font-semibold text-slate-300 text-sm line-through decoration-slate-600">{item.patientName}</h5>
                    <p className="text-[11px] text-slate-500 mt-1">{item.assignedDoctorName}</p>
                    
                    <div className="border-t border-white/5 mt-4 pt-2 flex items-center justify-between text-[9px] font-mono text-slate-500">
                      <span>{locale === 'ta' ? 'சிகிச்சை முடிந்தது' : locale === 'hi' ? 'सत्र समाप्त हुआ' : 'Completed session'}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center flex-col text-center p-6 text-slate-500 font-mono">
                  <span className="text-[11px]">
                    {locale === 'ta' ? 'இன்னும் டோக்கன்கள் ஏதும் முடிக்கப்படவில்லை.' : locale === 'hi' ? 'अभी तक कोई टोकन समाप्त नहीं हुआ है।' : 'No tokens cleared yet.'}
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* SIDE GRAPHICS & STREAMLINED ISSUANCE */}
        <div className="space-y-6" id="queue-side-panel">
          
          {/* Quick Issuance Panel */}
          <div className="rounded-xl border border-white/8 bg-slate-950/40 p-5 space-y-4" id="queue-quick-issue">
            <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">
              {locale === 'ta' ? 'விரைவு அனுமதி முனையம்' : locale === 'hi' ? 'त्वरित प्रवेश पोर्टल' : 'Fast Ingress Portal'}
            </h4>
            <p className="text-[11px] text-slate-400">
              {locale === 'ta' ? 'நோயாளிகள் விவரங்களுக்குச் செல்லாமல் நேரடியாக டோக்கனை உருவாக்கவும்.' : locale === 'hi' ? 'मरीज़ रिकॉर्ड में जाए बिना सीधे टोकन जारी करें।' : 'Issue queue token directly without navigating patients directory.'}
            </p>

            <form onSubmit={handleFastIssueSubmit} className="space-y-3" id="queue-fast-ingress-form">
              
              <div>
                <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                  {locale === 'ta' ? 'நோயாளியைத் தேர்ந்தெடுக்கவும்' : locale === 'hi' ? 'मरीज़ का चयन करें' : 'Select Patient'}
                </label>
                <select
                  required
                  id="fast-patient-select"
                  value={fastPatientId}
                  onChange={(e) => setFastPatientId(e.target.value)}
                  className="w-full bg-[#10162e] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-neon-cyan cursor-pointer"
                >
                  <option value="">
                    {locale === 'ta' ? '-- நோயாளியைத் தேர்ந்தெடுக்கவும் --' : locale === 'hi' ? '-- मरीज़ चुनें --' : '-- Choose Walk-in Patient --'}
                  </option>
                  {availablePatients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-mono text-slate-400 mb-1">
                  {locale === 'ta' ? 'மருத்துவரைத் தேர்ந்தெடுக்கவும்' : locale === 'hi' ? 'चिकित्सक का चयन करें' : 'Select Clinician'}
                </label>
                <select
                  required
                  id="fast-doctor-select"
                  value={fastDoctorId}
                  onChange={(e) => setFastDoctorId(e.target.value)}
                  className="w-full bg-[#10162e] border border-white/10 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-neon-cyan cursor-pointer"
                >
                  <option value="">
                    {locale === 'ta' ? '-- மருத்துவரை நியமிக்கவும் --' : locale === 'hi' ? '-- डॉक्टर नियुक्त करें --' : '-- Assign Doctor --'}
                  </option>
                  {state.doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                id="btn-fast-issue"
                className="w-full bg-slate-900 hover:bg-neon-cyan hover:text-slate-950 font-bold tracking-wider py-2 rounded-lg text-xs uppercase transition-all duration-200 border border-white/5 hover:border-transparent flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {locale === 'ta' ? 'டோக்கன் உருவாக்கவும்' : locale === 'hi' ? 'टोकन जारी करें' : 'Trigger Issue Ticket'}
                </span>
              </button>

            </form>
          </div>

          {/* Queue Performance metrics */}
          <div className="rounded-xl border border-white/8 bg-[#0a1024]/40 p-5 space-y-4" id="queue-throughput-stats">
            <div>
              <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">OPD Load Throughput</h4>
              <p className="text-[11px] text-slate-400">Diagnostic pipeline clearance rates.</p>
            </div>

            <div className="space-y-3.5 font-mono text-xs text-slate-300">
              
              {/* Waiting count */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span>1. Pipeline Waiting</span>
                  <span>{waitingTokens.length} ticket(s)</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-neon-cyan transition-all duration-500" 
                    style={{ width: `${totalVolumeToday > 0 ? (waitingTokens.length / totalVolumeToday) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Consulting count */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span>2. Consulting active</span>
                  <span>{inProgressTokens.length} ticket(s)</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-neon-violet transition-all duration-500" 
                    style={{ width: `${totalVolumeToday > 0 ? (inProgressTokens.length / totalVolumeToday) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Completed count */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span>3. Session Concluded</span>
                  <span>{completedTokens.length} ticket(s)</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 transition-all duration-500" 
                    style={{ width: `${totalVolumeToday > 0 ? (completedTokens.length / totalVolumeToday) * 100 : 0}%` }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/5 pt-3 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Pipeline clearance:</span>
                <span className="text-emerald-400 font-bold">{completionRate}% finished</span>
              </div>

              {/* Stats wait time */}
              <div className="bg-[#04060f] p-3 rounded-lg border border-white/5 text-center mt-3">
                <span className="text-[10px] text-slate-500 uppercase font-semibold">AVERAGE RESPONSE CORRIDOR</span>
                <p className="text-lg font-mono font-black text-neon-cyan mt-1 glow-cyan-text">22min wait</p>
                <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#bfdbfe] mt-0.5 font-bold">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Down 4 mins vs Mon</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
