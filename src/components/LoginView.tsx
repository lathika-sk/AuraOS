import React, { useState } from 'react';
import { useClinic } from '../ClinicContext';
import { useTranslation } from '../LanguageContext';
import { Eye, EyeOff, ShieldCheck, Stethoscope, UserCog, Key, User, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const { login, signInWithGoogle } = useClinic();
  const { locale, setLocale, t } = useTranslation();
  const [role, setRole] = useState<'admin' | 'doctor' | 'receptionist'>('admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      const success = await signInWithGoogle();
      if (success) {
        onLoginSuccess();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-fill convenience triggers
  const fillCredentials = (selectedRole: typeof role) => {
    setRole(selectedRole);
    if (selectedRole === 'admin') {
      setUsername('admin');
      setPassword('admin@123');
    } else if (selectedRole === 'doctor') {
      setUsername('doctor');
      setPassword('doc@123');
    } else if (selectedRole === 'receptionist') {
      setUsername('staff');
      setPassword('staff@123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username, password, role);
    if (success) {
      onLoginSuccess();
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[oklch(0.16_0.03_240)] grid-overlay py-8 px-4 overflow-hidden" id="login-container">
      {/* Background radial soft glowing circles representing premium sci-fi tone */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[oklch(0.78_0.18_215_/_0.1)] rounded-full blur-[100px] pointer-events-none ambient-orb" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[oklch(0.65_0.22_280_/_0.1)] rounded-full blur-[130px] pointer-events-none ambient-orb" style={{ animationDelay: '3s' }} />

      <div className="relative w-full max-w-5xl bg-slate-950/65 backdrop-blur-2xl text-white rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(34,211,238,0.18)] border-2 border-[oklch(0.78_0.18_215)]/40 flex flex-col md:flex-row min-h-[600px] hover:border-[oklch(0.78_0.18_215)]/60 transition-all duration-300" id="login-main-card">
        
        {/* Left Side: Brand, AI Doc Portrait, Futuristic Scanning motifs */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 bg-black/40 border-r border-white/10 flex flex-col justify-between relative overflow-hidden" id="login-marketing-side">
          <div className="z-10 space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[oklch(0.78_0.18_215)] flex items-center justify-center shadow-[0_0_20px_oklch(0.78_0.18_215_/_0.4)]">
                  <ShieldCheck className="w-5 h-5 text-black stroke-[2.5]" />
                </div>
                <div>
                  <h1 className="font-display text-lg font-black tracking-widest text-white uppercase italic leading-none block">Aura</h1>
                  <span className="text-[9px] text-[oklch(0.78_0.18_215)] font-bold tracking-[0.2em] uppercase leading-none block mt-1">Clinic OS</span>
                </div>
              </div>
              
              {/* Flag-free premium language switcher */}
              <div className="flex items-center gap-1 bg-slate-900/90 border border-white/10 p-1 rounded-xl text-[10px] font-mono font-bold select-none shrink-0" id="login-lang-picker">
                <button 
                  type="button"
                  onClick={() => setLocale('en')} 
                  id="btn-lang-en"
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${locale === 'en' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
                >
                  EN
                </button>
                <button 
                  type="button"
                  onClick={() => setLocale('ta')} 
                  id="btn-lang-ta"
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${locale === 'ta' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
                >
                  தமிழ்
                </button>
                <button 
                  type="button"
                  onClick={() => setLocale('hi')} 
                  id="btn-lang-hi"
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${locale === 'hi' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
                >
                  हिन्दी
                </button>
              </div>
            </div>
            
            <h1 className="font-sans text-2xl lg:text-3xl font-bold mt-8 tracking-wide leading-tight">
              {locale === 'ta' ? (
                <>மருத்துவமனை <br /><span className="text-[oklch(0.78_0.18_215)] font-black uppercase tracking-wider">மேலாண்மைத் தொழில்நுட்பம்.</span></>
              ) : locale === 'hi' ? (
                <>चिकित्सालय का <br /><span className="text-[oklch(0.78_0.18_215)] font-black uppercase tracking-wider">सर्वश्रेष्ठ संचालन उपकरण।</span></>
              ) : (
                <>The future of <br /><span className="text-[oklch(0.78_0.18_215)] font-black uppercase tracking-wider">clinic intelligence.</span></>
              )}
            </h1>
            <p className="text-[10px] text-white/40 mt-3 font-mono tracking-wider">NEURAL HEALTHCARE AUTOMATION // INDIA V4.2</p>
          </div>

          {/* Glass Framed Photo/Illustration of AI Doctor */}
          <div className="relative my-8 group z-10 w-full max-w-[280px] mx-auto aspect-[3/4]" id="ai-doctor-frame-shadow">
            {/* Corner Bracket Decorations */}
            <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[oklch(0.78_0.18_215)] z-20 group-hover:scale-110 transition-transform" />
            <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[oklch(0.78_0.18_215)] z-20 group-hover:scale-110 transition-transform" />
            <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[oklch(0.78_0.18_215)] z-20 group-hover:scale-110 transition-transform" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[oklch(0.78_0.18_215)] z-20 group-hover:scale-110 transition-transform" />

            {/* Glowing Scan Line Animation */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[oklch(0.78_0.18_215)] shadow-[0_0_12px_oklch(0.78_0.18_215)] animate-bounce z-20 opacity-80" style={{ animationDuration: '3.5s' }} />

            <div className="w-full h-full rounded-lg overflow-hidden border border-white/10 relative bg-[#090e24]">
              <img 
                src="/src/assets/images/futuristic_ai_doctor_1782048464611.jpg" 
                alt="Futuristic AI Doctor Portrait"
                className="w-full h-full object-cover grayscale brightness-90 contrast-125 hover:grayscale-0 transition-all duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
                id="login-ai-doctor-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f28] via-transparent to-transparent opacity-60" />

              {/* Status Badge */}
              <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[oklch(0.78_0.18_215)]/40 flex items-center gap-1.5 shadow-[0_0_10px_oklch(0.78_0.18_215_/_0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.78_0.18_215)] animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.78_0.18_215)] absolute" />
                <span className="text-[9px] font-mono tracking-wider font-bold text-[oklch(0.78_0.18_215)] uppercase">
                  {locale === 'en' ? 'AI Diagnostic Online' : locale === 'ta' ? 'ஏஐ நோயறிதல் தயார்' : 'एआई विश्लेषण सक्रिय'}
                </span>
              </div>
            </div>
          </div>

          <div className="text-left text-[9px] text-white/30 font-mono mt-auto z-10" id="intellectual-rights">
            SECURE LINK // MULTI-FACTOR CLINIC MANAGEMENT TERMINAL. SHIFT LOCK ACTIVE.
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-black/20" id="login-form-side">
          <h2 className="font-display text-3xl font-extrabold tracking-widest mb-1 text-white uppercase drop-shadow-[0_0_20px_rgba(34,211,238,0.7)]">{t('systemGateway')}</h2>
          <p className="text-xs text-cyan-300/90 mb-8 font-semibold tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            {t('clearanceSub')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6" id="clinic-login-form">
            
            {/* 3-Button Role Selector */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
                <span className="w-1.5 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                {t('clearanceTier')}
              </label>
              <div className="grid grid-cols-3 gap-2" id="role-selector">
                <button
                  type="button"
                  id="role-btn-admin"
                  onClick={() => fillCredentials('admin')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                    role === 'admin'
                      ? 'border-cyan-400 bg-cyan-500/25 text-white shadow-[0_0_25px_rgba(34,211,238,0.5),inset_0_0_10px_rgba(34,211,238,0.25)] font-black scale-102 border-2'
                      : 'border-cyan-500/20 bg-slate-900/40 text-slate-400 hover:text-white hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:bg-cyan-950/20'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5 mb-1.5 text-cyan-400" />
                  <span className="text-[11px] font-bold tracking-wide uppercase">{t('adminRole')}</span>
                  <span className="text-[8px] opacity-60 font-mono font-bold uppercase mt-1">{t('fullAccess')}</span>
                </button>

                <button
                  type="button"
                  id="role-btn-doctor"
                  onClick={() => fillCredentials('doctor')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                    role === 'doctor'
                      ? 'border-indigo-400 bg-indigo-500/25 text-white shadow-[0_0_25px_rgba(99,102,241,0.5),inset_0_0_10px_rgba(99,102,241,0.25)] font-black scale-102 border-2'
                      : 'border-indigo-500/20 bg-slate-900/40 text-slate-400 hover:text-white hover:border-indigo-500/50 hover:shadow-[0_0_15px_rgba(99,102,241,0.25)] hover:bg-indigo-950/20'
                  }`}
                >
                  <Stethoscope className="w-5 h-5 mb-1.5 text-indigo-400" />
                  <span className="text-[11px] font-bold tracking-wide uppercase">{t('doctorRole')}</span>
                  <span className="text-[8px] opacity-60 font-mono font-bold uppercase mt-1">{t('clinicalAccess')}</span>
                </button>

                <button
                  type="button"
                  id="role-btn-receptionist"
                  onClick={() => fillCredentials('receptionist')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                    role === 'receptionist'
                      ? 'border-cyan-400 bg-cyan-500/25 text-white shadow-[0_0_25px_rgba(34,211,238,0.5),inset_0_0_10px_rgba(34,211,238,0.25)] font-black scale-102 border-2'
                      : 'border-cyan-500/20 bg-slate-900/40 text-slate-400 hover:text-white hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:bg-cyan-950/20'
                  }`}
                >
                  <UserCog className="w-5 h-5 mb-1.5 text-cyan-400" />
                  <span className="text-[11px] font-bold tracking-wide uppercase">{t('staffRole')}</span>
                  <span className="text-[8px] opacity-60 font-mono font-bold uppercase mt-1">{t('frontDeskPanel')}</span>
                </button>
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-cyan-300 font-bold uppercase">
                <span className="w-1.5 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                {t('operatorIdent')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-400">
                  <User className="w-4 h-4 animate-pulse" />
                </div>
                <input
                  type="text"
                  required
                  id="login-username-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('enterCredentialName')}
                  style={{ color: '#ffffff' }}
                  className="w-full bg-cyan-950/45 border-2 border-cyan-500/35 hover:border-cyan-400 rounded-xl py-3.5 pl-10 pr-4 text-xs font-semibold text-white placeholder-cyan-300/30 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(34,211,238,0.45),inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all font-mono tracking-wide"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-cyan-300 font-bold uppercase">
                <span className="w-1.5 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                {t('decryptionCipher')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyan-400">
                  <Key className="w-4 h-4 animate-pulse" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  id="login-password-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{ color: '#ffffff' }}
                  className="w-full bg-cyan-950/45 border-2 border-cyan-500/35 hover:border-cyan-400 rounded-xl py-3.5 pl-10 pr-10 text-xs font-semibold text-white placeholder-cyan-300/30 focus:outline-none focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(34,211,238,0.45),inset_0_2px_4px_rgba(0,0,0,0.6)] transition-all font-mono tracking-wide"
                />
                <button
                  type="button"
                  id="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-300/60 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Demo Quick Fill */}
            <div className="flex items-center justify-between text-xs pt-1 select-none">
              <label className="flex items-center gap-2 text-white/50 cursor-pointer hover:text-white transition-colors">
                <input
                  type="checkbox"
                  id="login-remember-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-black border-cyan-500/30 text-cyan-500 focus:ring-0 focus:ring-offset-0 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-slate-300">{t('rememberConsole')}</span>
              </label>

              <button
                type="button"
                id="login-quickfill-btn"
                onClick={() => fillCredentials(role)}
                className="text-cyan-400 hover:text-cyan-300 hover:underline font-extrabold tracking-wide uppercase text-[11px] cursor-pointer"
              >
                {t('useDemoCreds')}
              </button>
            </div>

            {/* Submit Clearance Request Button */}
            <button
              type="submit"
              id="login-submit-btn"
              className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black tracking-widest py-4 rounded-xl transition-all duration-300 transform active:scale-98 shadow-[0_0_30px_rgba(34,211,238,0.65),inset_0_1px_0_rgba(255,255,255,0.4)] select-none text-xs flex items-center justify-center gap-2 uppercase font-mono cursor-pointer"
            >
              {t('requestAccessBtn')}
            </button>
          </form>

          <div className="relative my-5 flex items-center justify-center" id="login-or-separator">
            <hr className="w-full border-t border-white/5" />
            <span className="absolute bg-[#0b0f1a]/95 border border-cyan-500/10 rounded-full px-3.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-[#22d3ee] font-bold shadow-[0_0_12px_rgba(34,211,238,0.15)]">{t('orSignInSocial')}</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full border-2 border-cyan-500/25 hover:border-[oklch(0.78_0.18_215)] bg-cyan-950/20 hover:bg-[oklch(0.78_0.18_215_/_0.1)] text-cyan-200 hover:text-white font-black tracking-wider py-3.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 select-none text-xs uppercase font-mono cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.12)] hover:shadow-[0_0_25px_rgba(34,211,238,0.3)]"
          >
            <svg className="w-4 h-4 shrink-0 fill-current text-cyan-300" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            {t('secureGoogleAuth')}
          </button>

          {/* Demo Hint */}
          <div className="mt-8 p-4 rounded-xl border border-amber-500/25 bg-amber-500/10 flex items-start gap-3" id="login-credential-hints">
            <ShieldAlert className="w-5 h-5 text-amber-300 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <p className="text-[11px] font-bold text-amber-300 font-mono uppercase tracking-widest">{t('authorizedUsersOnly')}</p>
              <div className="text-[10px] text-slate-200 mt-2 leading-relaxed font-mono font-medium">
                {t('clearanceKeysHint')} <br />
                <span className="text-white font-extrabold bg-cyan-950/60 border border-cyan-500/20 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(34,211,238,0.25)]">admin / admin@123</span> &bull;{' '}
                <span className="text-white font-extrabold bg-indigo-950/60 border border-indigo-500/20 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(99,102,241,0.25)]">doctor / doc@123</span> &bull;{' '}
                <span className="text-white font-extrabold bg-cyan-950/60 border border-cyan-500/20 px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(34,211,238,0.25)]">staff / staff@123</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated medical ECG Motif near the bottom of screens */}
      <div className="absolute bottom-8 left-0 right-0 pointer-events-none flex items-center justify-center opacity-20 px-12" id="bottom-decorations">
        <svg className="w-full max-w-lg h-10 text-[oklch(0.78_0.18_215)]/40" viewBox="0 0 100 20" preserveAspectRatio="none">
          <path
            d="M0,10 L30,10 L34,10 L37,13 L40,4 L43,19 L46,8 L49,11 L52,10 L55,10 L70,10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="100"
            strokeDashoffset="100"
            className="animate-pulse"
            style={{ strokeDashoffset: 0, animationDuration: '4s' }}
          />
        </svg>
      </div>
    </div>
  );
};
