import React, { useState } from 'react';
import { useClinic } from '../ClinicContext';
import { useTranslation } from '../LanguageContext';
import { 
  Activity, 
  Users, 
  Clock, 
  Calendar, 
  Stethoscope, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe,
  Sparkles,
  Send,
  MessageSquare,
  BrainCircuit
} from 'lucide-react';
import { motion } from 'motion/react';

interface AppShellProps {
  activePage: string;
  onPageChange: (page: any) => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ activePage, onPageChange, children }) => {
  const { state, logout } = useClinic();
  const { locale, setLocale, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // AI Copilot slide drawer states
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotMessages, setCopilotMessages] = useState<Array<{ sender: 'user' | 'ai', text: string }>>([
    { sender: 'ai', text: 'Diagnostic channels synchronized. Ask me to scan clinic KPIs, report current diagnostic rosters, or list therapeutic guidelines!' }
  ]);
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);

  // Active user details
  const activeUser = state.session;

  const handleSendCopilot = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!copilotInput.trim() || copilotLoading) return;

    const userMsg = copilotInput.trim();
    setCopilotMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setCopilotInput('');
    setCopilotLoading(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsg,
          clinicContext: {
            patientsCount: state.patients.length,
            queueCount: state.queue.filter(q => q.status === 'Waiting' || q.status === 'In Progress').length,
            appointmentsCount: state.appointments.length,
            consultationsCount: state.consultations.length,
            activeUserRole: activeUser?.role || 'admin',
          }
        })
      });
      const data = await res.json();
      if (res.ok && data.text) {
        setCopilotMessages(prev => [...prev, { sender: 'ai', text: data.text }]);
      } else {
        setCopilotMessages(prev => [...prev, { sender: 'ai', text: '⚠️ Connection timeout with Aura Decision Matrix. Confirm secret configurations.' }]);
      }
    } catch (err: any) {
      setCopilotMessages(prev => [...prev, { sender: 'ai', text: `⚠️ Exception: ${err.message}` }]);
    } finally {
      setCopilotLoading(false);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'queue', label: 'Live Queue', icon: Clock },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'consultation', label: 'Consultations', icon: Stethoscope },
    { id: 'reports', label: 'Reports & EMR', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[oklch(0.16_0.03_240)] text-white font-sans flex flex-col md:flex-row relative overflow-x-hidden selection:bg-[oklch(0.78_0.18_215)] selection:text-black" id="clinic-app-shell">
      
      {/* BACKGROUND GRAPHICS: Radial soft glows matching Sleek theme */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_oklch(0.4_0.2_215_/_0.15),_transparent_40%),radial-gradient(circle_at_bottom_left,_oklch(0.4_0.2_280_/_0.15),_transparent_40%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* MOBILE HEADER BAR */}
      <div className="md:hidden bg-black/20 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between z-40 sticky top-0" id="mobile-top-header">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.78_0.18_215)] flex items-center justify-center shadow-[0_0_15px_oklch(0.78_0.18_215_/_0.4)] text-black font-black">
            <Zap className="w-4 h-4 text-black stroke-[3]" />
          </div>
          <div>
            <span className="font-display text-sm font-black tracking-widest text-white uppercase italic leading-none block">Aura</span>
            <span className="text-[8px] text-[oklch(0.78_0.18_215)] font-bold tracking-[0.2em] uppercase leading-none block mt-0.5">Clinic OS</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Mobile compact language selector */}
          <div className="flex bg-slate-900/85 border border-white/10 p-0.5 rounded-lg text-[8.5px] font-bold select-none h-7 items-center" id="mobile-lang-picker">
            <button 
              type="button"
              onClick={() => setLocale('en')} 
              className={`px-1.5 py-0.5 rounded ${locale === 'en' ? 'bg-cyan-500/20 text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              EN
            </button>
            <button 
              type="button"
              onClick={() => setLocale('ta')} 
              className={`px-1.5 py-0.5 rounded ${locale === 'ta' ? 'bg-cyan-500/20 text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              தமிழ்
            </button>
            <button 
              type="button"
              onClick={() => setLocale('hi')} 
              className={`px-1.5 py-0.5 rounded ${locale === 'hi' ? 'bg-cyan-500/20 text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'}`}
            >
              हिन्दी
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 px-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white border border-white/10 h-7"
            id="btn-toggle-mobile-menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* PERSISTENT LEFT SIDEBAR FOR DESKTOP */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-black/20 backdrop-blur-xl border-r border-white/10 z-30 relative shrink-0 h-screen sticky top-0" id="desktop-sidebar">
        
        {/* LOGO */}
        <div className="space-y-6 flex flex-col flex-1 min-h-0">
          <div className="p-8 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[oklch(0.78_0.18_215)] rounded-lg flex items-center justify-center shadow-[0_0_20px_oklch(0.78_0.18_215_/_0.4)] shrink-0">
                <Zap className="w-5 h-5 text-black stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-wider uppercase leading-none italic text-white font-display">Aura</h1>
                <p className="text-[10px] text-[oklch(0.78_0.18_215)] font-bold tracking-[0.2em] uppercase">Clinic OS</p>
              </div>
            </div>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto" id="desktop-navigation">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activePage === item.id;

              return (
                <motion.button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => onPageChange(item.id)}
                  whileHover={{ 
                    x: 6,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    transition: { duration: 0.15, ease: "easeOut" }
                  }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-4 p-3 cursor-pointer text-left uppercase text-xs rounded-lg transition-colors relative origin-left ${
                    isActive
                      ? 'bg-white/10 border-l-4 border-[oklch(0.78_0.18_215)] shadow-[inset_0_0_20px_rgba(34,211,238,0.06)] text-[oklch(0.78_0.18_215)] font-bold tracking-wide'
                      : 'text-white/60 hover:text-white border-l-4 border-transparent font-medium tracking-wide'
                  }`}
                >
                  <IconComp className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'text-[oklch(0.78_0.18_215)] scale-110' : 'text-white/60'}`} />
                  <span>{t(item.id)}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeNavIndicator"
                      className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[oklch(0.78_0.18_215)] shadow-[0_0_10px_oklch(0.78_0.18_215)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* ACTIVE USER PANEL & LOGOUT */}
        <div className="p-6 space-y-4" id="sidebar-footer">
          
          {/* ACTIVE USER PANEL */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl" id="sidebar-user-panel">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[oklch(0.78_0.18_215)] to-[oklch(0.65_0.22_280)] p-[2px] shrink-0">
                <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white uppercase">
                    {activeUser?.name?.charAt(0) || 'A'}
                  </div>
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase text-white truncate leading-none">{activeUser?.name || 'Administrator'}</p>
                <p className="text-[10px] text-white/40 font-medium uppercase mt-1.5 truncate leading-none">{activeUser?.role || 'Senior Operator'}</p>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-xs font-bold text-white/60 hover:text-rose-400 hover:bg-rose-950/15 border border-transparent hover:border-rose-900/10 transition-all cursor-pointer group"
            id="sidebar-logout-btn"
          >
            <LogOut className="w-4 h-4 text-white/60 group-hover:text-rose-400 shrink-0" />
            <span>{t('logoutBtn')}</span>
          </button>
        </div>

      </aside>

      {/* MOBILE NAVIGATION SLIDE DOWN DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-2xl border-b border-white/10 py-4 px-6 space-y-4 z-40 sticky top-[61px]" id="mobile-slide-drawer">
          
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest leading-none border-b border-white/5 pb-2">CLEARANCE TIERS NAVIGATION</p>
          
          <div className="grid grid-cols-2 gap-2" id="mobile-nav-grid">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onPageChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold uppercase truncate ${
                    isActive
                      ? 'border-[oklch(0.78_0.18_215)] bg-white/5 text-[oklch(0.78_0.18_215)] font-bold'
                      : 'border-white/10 text-white/60 hover:text-white'
                  }`}
                  id={`mobile-nav-${item.id}`}
                >
                  <IconComp className="w-4 h-4 shrink-0" />
                  <span>{t(item.id)}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              logout();
              setMobileMenuOpen(false);
            }}
            className="w-full py-3 border border-rose-950 bg-rose-950/20 text-rose-350 font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-2"
            id="mobile-nav-logout"
          >
            <LogOut className="w-4 h-4" />
            <span>{t('mobileLogoutBtn')}</span>
          </button>

        </div>
      )}

      {/* CORE PAGE CONTENT SHELL BLOCK */}
      <main className="flex-1 flex flex-col min-w-0" id="clinic-viewport">
        
        {/* Top title bar */}
        <header className="hidden md:flex items-center justify-between p-5 bg-black/10 backdrop-blur-md border-b border-white/10 z-10" id="viewport-header">
          <div className="flex items-center gap-3 text-xs font-mono text-white/40">
            <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-[oklch(0.78_0.18_215)]" /> {t('terminalIdent')}</span>
            <span className="text-white/10">//</span>
            <span>OS RECON: SYNCED</span>
          </div>

          {/* Quick Stats indicator on top-right of shell header */}
          <div className="flex items-center gap-6 text-xs font-mono text-white/50">
            {/* Elegant switcher next to notifications/stats */}
            <div className="flex items-center gap-1.5 bg-slate-900/60 border border-white/15 p-1 rounded-xl text-[10px] font-bold select-none shrink-0" id="desktop-lang-switcher">
              <button 
                onClick={() => setLocale('en')} 
                type="button"
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${locale === 'en' ? 'bg-cyan-500/20 text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLocale('ta')} 
                type="button"
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${locale === 'ta' ? 'bg-cyan-500/20 text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'}`}
              >
                தமிழ்
              </button>
              <button 
                onClick={() => setLocale('hi')} 
                type="button"
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${locale === 'hi' ? 'bg-cyan-500/20 text-cyan-400 font-extrabold' : 'text-slate-400 hover:text-white'}`}
              >
                हिन्दी
              </button>
            </div>

            <span>{t('operatorRoleLabel')} <span className="text-[oklch(0.78_0.18_215)] font-bold uppercase">{activeUser?.role || 'ADMIN'}</span></span>
          </div>
        </header>

        {/* Page Inner layout container */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full mx-auto" id="page-main-layout">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            key={activePage}
            className="h-full"
            id="page-inner-transition"
          >
            {children}
          </motion.div>
        </div>

      </main>

      {/* FLOATING COPILOT TOGGLE PILL */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setCopilotOpen(!copilotOpen)}
          className="bg-gradient-to-r from-cyan-500 to-neon-cyan hover:from-cyan-400 hover:to-neon-cyan text-slate-950 font-black p-3 rounded-full shadow-[0_4px_30px_oklch(0.78_0.18_215_/_0.35)] hover:shadow-[0_4px_45px_oklch(0.78_0.18_215_/_0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer h-12 px-4 gap-2 border border-cyan-400/25"
          title="Toggle Aura AI Copilot"
        >
          <Sparkles className="w-5 h-5 text-slate-950 animate-pulse shrink-0" />
          <span className="text-[10px] uppercase font-mono tracking-widest font-black text-slate-950">AURA AI COPILOT</span>
        </button>
      </div>

      {/* FLOATING COPILOT CONSOLE PANEL (Slide-out) */}
      {copilotOpen && (
        <div className="fixed top-0 right-0 w-full sm:w-96 h-full bg-[#070b1e]/98 border-l border-white/10 shadow-[0_0_50px_rgba(34,211,238,0.2)] z-[60] flex flex-col transition-all duration-500">
          
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-cyan-950/20">
            <div className="flex items-center gap-2.5">
              <BrainCircuit className="w-5 h-5 text-cyan-400 animate-pulse shrink-0" />
              <div>
                <h4 className="font-display font-semibold text-xs tracking-wider uppercase text-cyan-200">Aura AI Clinical Assistant</h4>
                <p className="text-[8px] font-mono text-cyan-500 uppercase tracking-widest mt-0.5">Decision Advice Node</p>
              </div>
            </div>
            <button
              onClick={() => setCopilotOpen(false)}
              className="p-1 rounded-lg bg-white/5 border border-white/15 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Context Indicators */}
          <div className="p-3 bg-black/40 border-b border-white/5 font-mono text-[9px] text-slate-400 grid grid-cols-3 gap-2 text-center select-none">
            <div className="bg-white/5 p-1 rounded">
              <p className="text-slate-500 text-[8px]">PATIENTS</p>
              <p className="font-bold text-white mt-0.5">{state.patients.length}</p>
            </div>
            <div className="bg-white/5 p-1 rounded">
              <p className="text-slate-500 text-[8px]">PENDING Q</p>
              <p className="font-bold text-cyan-400 mt-0.5">{state.queue.filter(q => q.status !== 'Completed').length}</p>
            </div>
            <div className="bg-white/5 p-1 rounded">
              <p className="text-slate-500 text-[8px]">OPERATOR</p>
              <p className="font-bold text-[oklch(0.78_0.18_215)] mt-0.5 uppercase truncate">{activeUser?.role || 'admin'}</p>
            </div>
          </div>

          {/* Messages block */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 select-text">
            {copilotMessages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed whitespace-pre-wrap font-sans ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-br from-cyan-600/30 to-cyan-500/15 border border-cyan-500/30 text-white rounded-tr-none'
                    : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[8px] font-mono mt-1 text-slate-500 block uppercase px-1">
                  {msg.sender === 'user' ? 'Operator' : 'Aura AI Brain'}
                </span>
              </div>
            ))}
            {copilotLoading && (
              <div className="flex flex-col items-start">
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Suggestion tags */}
          <div className="p-2 border-t border-white/5 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none select-none bg-[#050918]">
            <button
              onClick={() => {
                setCopilotInput('Summarize patient caseload and caseload balances');
              }}
              className="text-[9px] border border-white/10 hover:border-cyan-500 bg-white/5 px-2.5 py-1 rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Analyze Caseloads
            </button>
            <button
              onClick={() => {
                setCopilotInput('Draft general cardiovascular management policies');
              }}
              className="text-[9px] border border-white/10 hover:border-cyan-500 bg-white/5 px-2.5 py-1 rounded-full text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Clinical Policies
            </button>
          </div>

          {/* Input field */}
          <form onSubmit={handleSendCopilot} className="p-4 bg-black/40 border-t border-white/10 flex items-center gap-2">
            <input
              type="text"
              value={copilotInput}
              onChange={(e) => setCopilotInput(e.target.value)}
              placeholder="Ask Aura Clinical Copilot..."
              className="flex-1 bg-[#0b0e1b] border border-white/15 focus:border-cyan-400 rounded-xl py-2.5 px-4 text-xs select-text focus:outline-none text-white font-sans"
            />
            <button
              type="submit"
              className="bg-[oklch(0.78_0.18_215)] hover:bg-[oklch(0.82_0.15_215)] text-slate-950 p-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

        </div>
      )}

    </div>
  );
};
