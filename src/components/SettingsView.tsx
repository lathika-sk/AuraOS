import React, { useState } from 'react';
import { useClinic } from '../ClinicContext';
import { 
  User, 
  Settings, 
  Lock, 
  Database, 
  Compass, 
  Wifi, 
  LogOut, 
  ShieldAlert,
  Sliders,
  CheckCircle,
  FileCode
} from 'lucide-react';
import { toast } from 'sonner';

export const SettingsView: React.FC = () => {
  const { state, logout } = useClinic();
  const activeUser = state.session;

  // Account editing states
  const [profileName, setProfileName] = useState(activeUser?.name || 'Administrator');
  const [clinicNode, setClinicNode] = useState('STATION_HYDRA_01_SOUTH');
  const [isModified, setIsModified] = useState(false);

  // Database actions
  const clearDatabaseToDefaults = () => {
    if (confirm('Are you absolutely sure you want to hard reset the database storage back to seeded mockup files? All active queue items, custom scheduled appointments, and logged EMR note clinical consultation files will be wiped!')) {
      localStorage.clear();
      toast.success('Local database storage cleared! Reloading system console files...');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModified(false);
    toast.success('Console node properties saved safely.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="settings-view-container">
      
      {/* Profiler block panel */}
      <div className="lg:col-span-2 space-y-6" id="settings-primary-panel">
        
        {/* Profile Card */}
        <div className="rounded-xl border border-white/10 bg-[#090e24]/60 p-6 md:p-8 space-y-6" id="settings-profile-card">
          <div className="space-y-1 pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-neon-cyan animate-spin" style={{ animationDuration: '6s' }} />
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">Operator Profile Settings</h3>
            </div>
            <p className="text-xs text-slate-400">Configure your active terminal node operator variables and authentication properties.</p>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs text-slate-300" id="profile-settings-form">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Operator Name */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-mono uppercase text-[10px]">Active Operator Name</label>
                <div className="relative">
                  <User className="absolute inset-y-0 left-3 w-4 h-4 text-slate-500 top-3" />
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => {
                      setProfileName(e.target.value);
                      setIsModified(true);
                    }}
                    className="w-full bg-[#10162e] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-neon-cyan"
                  />
                </div>
              </div>

              {/* Clearance role */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-mono uppercase text-[10px]">Authority Clearance Tier</label>
                <input
                  type="text"
                  disabled
                  value={(activeUser?.role || 'admin').toUpperCase()}
                  className="w-full bg-[#10162e]/30 border border-white/5 rounded-lg py-2.5 px-4 text-xs text-slate-500 font-mono focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1 italic">Permissions tier mapped strictly dynamic from System Gateway auth keys.</p>
              </div>

              {/* Station node ID */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-mono uppercase text-[10px]">Active Ingress Node ID</label>
                <input
                  type="text"
                  value={clinicNode}
                  onChange={(e) => {
                    setClinicNode(e.target.value);
                    setIsModified(true);
                  }}
                  className="w-full bg-[#10162e] border border-white/10 rounded-lg py-2.5 px-4 text-xs text-white font-mono focus:outline-none focus:border-neon-cyan"
                />
              </div>

              {/* Gateway interface */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-mono uppercase text-[10px]">Secured Hub Gateway Socket</label>
                <input
                  type="text"
                  disabled
                  value="127.0.0.1:3000 // SEC_HUB_TLS"
                  className="w-full bg-[#10162e]/30 border border-white/5 rounded-lg py-3 px-4 text-xs text-slate-500 font-mono focus:outline-none"
                />
              </div>

            </div>

            {/* Profile buttons action panels */}
            {isModified && (
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setProfileName(activeUser?.name || 'Administrator');
                    setClinicNode('STATION_HYDRA_01_SOUTH');
                    setIsModified(false);
                    toast.info('Modifications discarded.');
                  }}
                  className="px-4 py-2 hover:bg-white/5 border border-white/5 text-slate-400 hover:text-white rounded-lg text-xs uppercase cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-neon-cyan to-cyan-500 text-slate-950 font-bold rounded-lg text-xs uppercase cursor-pointer shadow-lg"
                >
                  Save Properties
                </button>
              </div>
            )}

          </form>

        </div>

        {/* Database control modules and hardware triggers */}
        <div className="rounded-xl border border-rose-950/40 bg-[#160b13]/25 p-6 md:p-8 space-y-4" id="settings-database-card">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-rose-400">
              <Database className="w-5 h-5 text-rose-450" />
              <h4 className="font-display text-sm font-bold uppercase tracking-wider">System Database Clearance Zone</h4>
            </div>
            <p className="text-xs text-slate-400">Hard reset operator client cache matrices, seeded mock records, and local storage variables.</p>
          </div>

          <div className="p-4 rounded-xl border border-rose-500/10 bg-rose-500/[0.02] flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-bold text-rose-400 uppercase font-mono">DANGER: DESTRUCTIVE ACTION MODE</p>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                Clearing the terminal resets all hospital records back to original seeded state. Past consultation files, issued queue tokens, and OPD appointments booked during this browser frame session will be permanently erased.
              </p>
            </div>
          </div>

          <button
            onClick={clearDatabaseToDefaults}
            className="bg-rose-950/35 hover:bg-rose-900 text-rose-400 hover:text-white border border-rose-550/30 px-5 py-2.5 rounded-xl font-bold font-mono uppercase text-xs transition-all duration-300 transform active:scale-95 cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.05)] w-full sm:w-auto"
            id="btn-settings-clear-db"
          >
            Trigger Local Storage Purge
          </button>
        </div>

      </div>

      {/* SYSTEM META STATISTICS DETAILS */}
      <div className="space-y-4" id="settings-meta-panel">
        
        <div className="rounded-xl border border-white/10 bg-[#090e24]/40 p-5 space-y-4" id="settings-sys-telemetry">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-neon-cyan" />
              <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider">System Diagnostic</h4>
            </div>
            <p className="text-[10px] text-slate-500">Live operational characteristics of this client node.</p>
          </div>

          <div className="space-y-3 font-mono text-[11px] text-slate-400">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span>Holographic Ingress:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" /> SYNCED
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span>Browser Store Type:</span>
              <span className="text-white font-bold">LocalStorage Cache</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span>Seeded Patient Files:</span>
              <span className="text-[#bfdbfe] font-bold">200 RECORDS</span>
            </div>

            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span>Crypto Cipher:</span>
              <span className="text-[#c084fc] font-bold">AES-GCM 256bit</span>
            </div>

            <div className="flex items-center justify-between pb-1">
              <span>Local Time Engine:</span>
              <span className="text-slate-300 font-bold">{new Date().toDateString()}</span>
            </div>

          </div>
        </div>

        {/* Big log out panel */}
        <div className="rounded-xl border border-white/8 bg-slate-950/40 p-5 space-y-3.5" id="settings-sys-logout">
          <h4 className="font-display text-xs font-bold text-slate-300 uppercase tracking-wider">Session Authority</h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            Terminating your operator session locks EMR databases from access until Gateway authentication is re-requested.
          </p>

          <button
            onClick={logout}
            className="w-full bg-[#1e293b]/60 hover:bg-rose-950/60 hover:text-rose-400 text-slate-300 border border-white/10 hover:border-rose-800/30 font-bold py-2.5 rounded-xl transition-all duration-300 text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
            id="btn-settings-sign-out"
          >
            <LogOut className="w-4 h-4" />
            <span>End Active Session</span>
          </button>
        </div>

      </div>

    </div>
  );
};
