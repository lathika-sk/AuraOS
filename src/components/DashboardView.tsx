import React, { useState, useEffect } from 'react';
import { useClinic } from '../ClinicContext';
import { 
  Users, 
  Activity, 
  UserCheck, 
  Calendar, 
  IndianRupee, 
  Clock, 
  ArrowUpRight, 
  Sparkles,
  TrendingUp,
  Stethoscope,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';

// Animated Count Up effect
const AnimNum: React.FC<{ to: number; duration?: number; prefix?: string; suffix?: string }> = ({ 
  to, 
  duration = 1000, 
  prefix = '', 
  suffix = '' 
}) => {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = to;
    if (end === 0) return;
    const stepTime = Math.max(Math.floor(duration / end), 15);
    const timer = setInterval(() => {
      start += Math.ceil(end / 40);
      if (start >= end) {
        setVal(end);
        clearInterval(timer);
      } else {
        setVal(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [to, duration]);

  return <span id={`stat-count-to-${to}`}>{prefix}{val.toLocaleString('en-IN')}{suffix}</span>;
};

export const DashboardView: React.FC = () => {
  const { state } = useClinic();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Connection Simulation Flashing Dot
  const [connectionStatus, setConnectionStatus] = useState<'SYNCED' | 'STANDBY'>('SYNCED');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const connTimer = setInterval(() => {
      setConnectionStatus(prev => prev === 'SYNCED' ? 'STANDBY' : 'SYNCED');
    }, 4000);
    return () => {
      clearInterval(timer);
      clearInterval(connTimer);
    };
  }, []);

  // Compute stats dynamically
  const activeQueue = state.queue.filter(q => q.status === 'Waiting' || q.status === 'In Progress');
  const finishedQueue = state.queue.filter(q => q.status === 'Completed');
  const nowServingItem = state.queue.find(q => q.status === 'In Progress');

  const totalPatientsCount = state.patients.length;
  const waitingTokenCount = state.queue.filter(q => q.status === 'Waiting').length;
  const doctorsCount = state.doctors.length;

  const todayStr = new Date().toISOString().split('T')[0];
  const appointmentsScheduledToday = state.appointments.filter(a => a.date === todayStr);

  // Generate nice stats totals
  const totalRevenues = state.patients.reduce((acc, p) => acc + p.cost, 0);

  // Chart data 1: Monthly visits vs revenue
  const monthlyData = [
    { name: 'Jan', Patients: 180, Revenue: 1450000 },
    { name: 'Feb', Patients: 220, Revenue: 1850000 },
    { name: 'Mar', Patients: 340, Revenue: 2900000 },
    { name: 'Apr', Patients: 390, Revenue: 3400000 },
    { name: 'May', Patients: 490, Revenue: 4100000 },
    { name: 'Jun', Patients: totalPatientsCount + 320, Revenue: totalRevenues },
  ];

  // Chart data 2: Conditions Pie distribution
  const conditionsDistribution = [
    { name: 'Cardiac', value: 48, color: '#06b6d4' },
    { name: 'Diabetic', value: 38, color: '#8b5cf6' },
    { name: 'Pediatric', value: 24, color: '#14b8a6' },
    { name: 'Gastro', value: 18, color: '#f59e0b' },
    { name: 'Orthopedic', value: 31, color: '#ec4899' },
    { name: 'Others', value: 41, color: '#64748b' },
  ];

  // Chart data 3: Doctor Load
  const doctorLoads = state.doctors.map(doc => {
    // Dynamic calculate if queue is assigned to doc
    const queueForDoc = state.queue.filter(q => q.assignedDoctorId === doc.id).length;
    return {
      name: doc.name.replace('Dr. ', ''),
      TokenLoad: doc.loadToday + queueForDoc,
    };
  });

  // Recent Activity Feed
  // Blend queue items, appointments, consultations sorted by timestamp simulation
  const recentActivities = [
    ...(state.queue.slice(-3).map(q => ({
      id: `act-q-${q.tokenNumber}`,
      type: 'queue',
      title: `Token #${q.tokenNumber} Registered`,
      desc: `${q.patientName} assigned to ${q.assignedDoctorName}`,
      time: 'Just now',
      tag: q.status,
      color: q.status === 'Completed' ? 'text-emerald-400' : 'text-neon-cyan',
    }))),
    ...(state.appointments.slice(-2).map(a => ({
      id: `act-a-${a.id}`,
      type: 'appointment',
      title: 'Appointment Scheduled',
      desc: `${a.patientName} booked with ${a.doctorName}`,
      time: '15 mins ago',
      tag: a.status,
      color: a.status === 'completed' ? 'text-emerald-400' : 'text-neon-violet',
    }))),
    ...(state.consultations.slice(-2).map(c => ({
      id: `act-c-${c.id}`,
      type: 'consultation',
      title: 'Consultation Recorded',
      desc: `${c.diagnosis} by ${c.doctorName}`,
      time: '1 hour ago',
      tag: 'Completed',
      color: 'text-amber-400',
    })))
  ].slice(0, 5);

  return (
    <div className="space-y-6" id="dashboard-view-container">
      
      {/* Header section with Dynamic Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl glass-panel-cyan border-white/5 relative overflow-hidden" id="dashboard-header-container">
        
        {/* Glow ambient lines */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl font-black tracking-normal text-white uppercase glow-cyan-text">AURA OS DASHBOARD</h1>
            <span className="bg-neon-cyan/10 text-neon-cyan text-[10px] font-mono tracking-wider font-semibold px-2 py-0.5 rounded border border-neon-cyan/20">AGENT ONLINE</span>
          </div>
          <p className="text-xs text-slate-400">Integrated terminal displaying live clinic performance metrics and patient volume profiles.</p>
        </div>

        {/* Realtime overview badge */}
        <div className="flex flex-wrap items-center gap-4 z-10 shrink-0" id="realtime-status-badge">
          <div className="bg-[#0b1022] border border-white/10 px-4 py-2.5 rounded-xl flex items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${connectionStatus === 'SYNCED' ? 'bg-emerald-400 animate-pulse' : 'bg-neon-cyan'} shadow-[0_0_10px_currentColor]`} />
              <div>
                <p className="text-[9px] font-mono uppercase text-slate-500">Node Sync</p>
                <p className="text-[11px] font-semibold text-slate-300 font-mono">STATION_HYDRA_01 / {connectionStatus}</p>
              </div>
            </div>
            
            <div className="border-l border-white/10 h-6" />

            <div>
              <p className="text-[9px] font-mono uppercase text-slate-500 font-bold">Waiting Queue</p>
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-extrabold text-neon-cyan">
                <Clock className="w-3.5 h-3.5 text-neon-cyan" />
                <span>{activeQueue.length} Active tokens</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0f26] border border-neon-cyan/15 px-4 py-2 rounded-xl text-right font-mono" id="realtime-clock">
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider">IST METRIC CLOCK</p>
            <p className="text-xs text-neon-cyan font-bold leading-normal tracking-wide">
              {currentTime.toLocaleTimeString('en-US', { hour12: false })} <span className="text-[9px] text-slate-500 font-medium">IST</span>
            </p>
          </div>
        </div>

      </div>

      {/* Top row: 4 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stat-grid-row">
        
        {/* Stat 1: Patients Seeded */}
        <motion.div 
          whileHover={{ y: -6, scale: 1.02, borderColor: "rgba(6,182,212,0.4)", boxShadow: "0 10px 25px -5px rgba(6,182,212,0.15)" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-[#0a0f26] to-slate-900 p-5 border border-white/10 shadow-lg group transition-all duration-300 cursor-pointer" 
          id="card-stat-patients"
        >
          {/* Cyan Glow blob */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon-cyan/5 rounded-full blur-2xl group-hover:bg-neon-cyan/10 transition-all animate-pulse" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 font-medium uppercase tracking-wider">Patients Enrolled</span>
            <div className="p-2.5 rounded-lg bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display text-4xl font-black text-white tracking-tight leading-none">
              <AnimNum to={totalPatientsCount} />
            </h3>
            <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-neon-cyan font-semibold bg-neon-cyan/5 border border-neon-cyan/10 w-fit px-1.5 py-0.5 rounded-sm">
              <TrendingUp className="w-3 h-3" />
              <span>+14.2% Growth</span>
            </div>
          </div>
        </motion.div>

        {/* Stat 2: Active Wait Queue */}
        <motion.div 
          whileHover={{ y: -6, scale: 1.02, borderColor: "rgba(139,92,246,0.4)", boxShadow: "0 10px 25px -5px rgba(139,92,246,0.15)" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-[#0a0f26] to-slate-900 p-5 border border-white/10 shadow-lg group transition-all duration-300 cursor-pointer" 
          id="card-stat-queue"
        >
          {/* Violet Glow blob */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon-violet/5 rounded-full blur-2xl group-hover:bg-neon-violet/10 transition-all animate-pulse" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 font-medium uppercase tracking-wider">Queue Waiting</span>
            <div className="p-2.5 rounded-lg bg-neon-violet/10 text-neon-violet border border-neon-violet/20">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display text-4xl font-black text-white tracking-tight leading-none">
              <AnimNum to={activeQueue.length} />
            </h3>
            <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-neon-violet font-semibold bg-neon-violet/5 border border-neon-violet/10 w-fit px-1.5 py-0.5 rounded-sm">
              <Clock className="w-3 h-3" />
              <span>Avg wait: 22m</span>
            </div>
          </div>
        </motion.div>

        {/* Stat 3: Doctors Roster Available */}
        <motion.div 
          whileHover={{ y: -6, scale: 1.02, borderColor: "rgba(16,185,129,0.4)", boxShadow: "0 10px 25px -5px rgba(16,185,129,0.15)" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-[#0a0f26] to-slate-900 p-5 border border-white/10 shadow-lg group transition-all duration-300 cursor-pointer" 
          id="card-stat-doctors"
        >
          {/* Emerald Glow blob */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all animate-pulse" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 font-medium uppercase tracking-wider">Clinicians On-Line</span>
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display text-4xl font-black text-white tracking-tight leading-none">
              <AnimNum to={doctorsCount} />
            </h3>
            <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-emerald-400 font-semibold bg-emerald-500/5 border border-emerald-500/10 w-fit px-1.5 py-0.5 rounded-sm">
              <Sparkles className="w-3 h-3" />
              <span>100% Staffing</span>
            </div>
          </div>
        </motion.div>

        {/* Stat 4: Appointments Today */}
        <motion.div 
          whileHover={{ y: -6, scale: 1.02, borderColor: "rgba(245,158,11,0.4)", boxShadow: "0 10px 25px -5px rgba(245,158,11,0.15)" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-900 via-[#0a0f26] to-slate-900 p-5 border border-white/10 shadow-lg group transition-all duration-300 cursor-pointer" 
          id="card-stat-appointments"
        >
          {/* Yellow Glow blob */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all animate-pulse" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 font-medium uppercase tracking-wider">Bookings Today</span>
            <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-display text-4xl font-black text-white tracking-tight leading-none">
              <AnimNum to={appointmentsScheduledToday.length || 3} />
            </h3>
            <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-amber-400 font-semibold bg-amber-500/5 border border-amber-500/10 w-fit px-1.5 py-0.5 rounded-sm">
              <ArrowUpRight className="w-3 h-3" />
              <span>+6% vs yesterday</span>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Main Row: Token Panel & Monthly Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-token-revenue-row">
        
        {/* Token Panel */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.01, borderColor: "rgba(99,102,241,0.3)" }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="lg:col-span-2 rounded-xl border border-white/8 bg-slate-950/40 p-6 flex flex-col justify-between relative overflow-hidden cursor-pointer" 
          id="dashboard-current-token-panel"
        >
          
          <div className="absolute -bottom-10 -right-10 w-52 h-52 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-widest text-[#818cf8] uppercase">Active Session Core</span>
              <span className="bg-neon-cyan/10 text-neon-cyan text-[10px] font-mono px-2 py-0.5 rounded border border-neon-cyan/20">LATEST TOKEN</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-6" id="glowing-token-section">
              {/* Massive glowing token */}
              <div className="w-28 h-28 rounded-2xl bg-linear-to-br from-neon-cyan/15 to-violet-600/15 border border-neon-cyan/40 shadow-[0_0_30px_rgba(34,211,238,0.25)] flex flex-col items-center justify-center p-2 text-center shrink-0">
                <span className="text-[10px] font-mono text-slate-400 leading-none">TOKEN ID</span>
                <span className="font-display text-4xl font-black text-[#22d3ee] mt-1 glow-cyan-text">
                  {nowServingItem ? nowServingItem.tokenNumber : '103'}
                </span>
                <div className="mt-1 flex items-center gap-1 bg-[#22d3ee]/10 text-neon-cyan text-[8px] font-mono font-bold px-1.5 rounded uppercase">
                  <span className="w-1 h-1 bg-neon-cyan rounded-full animate-ping" />
                  <span>ACTIVE</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Patient Name / Ident</h4>
                  <p className="text-lg font-bold text-white tracking-wide">{nowServingItem ? nowServingItem.patientName : 'Sandeep Saxena'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Assigned Clinician</h4>
                    <p className="text-xs font-semibold text-slate-300">{nowServingItem ? nowServingItem.assignedDoctorName : 'Dr. Priya Nair'}</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">Clinical Space</h4>
                    <p className="text-xs font-semibold text-[#818cf8] font-mono">OPD CARDIO-BAY 3B</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="text-[11px] text-slate-400 font-mono">
              QUEUE POSITION PRESET RATE: <span className="text-emerald-400">92% PERFORMANCE</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              TOTAL FINISHED TODAY: <span className="text-neon-cyan font-bold">{finishedQueue.length} PATIENTS</span>
            </div>
          </div>

        </motion.div>

        {/* Monthly Revenue INR */}
        <motion.div 
          whileHover={{ y: -4, scale: 1.01, borderColor: "rgba(167,139,250,0.3)" }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="rounded-xl border border-white/8 bg-slate-950/40 p-6 flex flex-col justify-between relative overflow-hidden cursor-pointer" 
          id="dashboard-monthly-revenue-panel"
        >
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-neon-violet/5 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-widest text-[#c084fc] uppercase">Financial Module</span>
              <div className="text-[10px] bg-[#c084fc]/10 text-[#c084fc] font-mono px-2 py-0.5 rounded border border-[#c084fc]/20 uppercase">
                India INR
              </div>
            </div>

            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mt-3">Monthly Accrued Revenue</h4>
            <div className="flex items-center gap-2 mt-2">
              <div className="p-2.5 rounded-lg bg-neon-violet/10 text-neon-violet">
                <IndianRupee className="w-8 h-8 glow-violet-text" />
              </div>
              <div>
                <h3 className="font-display text-2xl lg:text-3xl font-black text-white hover:text-neon-violet transition-colors">
                  <AnimNum to={totalRevenues + 428000} />
                </h3>
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5 font-bold">
                  <span>&uarr; 18.4% Realized gain</span>
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-6 bg-[#04060e]/30 -mx-6 -mb-6 p-4 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>AUDIT LEVEL: COMPLIANT</span>
            <span className="text-[#a78bfa]">GSTIN ENABLED</span>
          </div>

        </motion.div>

      </div>

      {/* Recharts Data Visualization Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-charts-grid">
        
        {/* Dynamic Area Chart: visits vs revenue */}
        <div className="rounded-xl border border-white/8 bg-slate-950/40 p-5 space-y-4" id="chart-visits-revenue">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Volume & Revenue Stream</h4>
              <p className="text-sm font-bold text-white">Monthly Visits vs Accrued Billing</p>
            </div>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-neon-cyan" /> 6 Month Profile</span>
          </div>

          <div className="h-64" id="recharts-area-holder">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090e24', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff', fontFamily: 'var(--font-mono)', fontSize: 11 }}
                  itemStyle={{ fontSize: 11 }}
                />
                <Area type="monotone" dataKey="Patients" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorPatients)" name="Visits" />
                <Area type="monotone" dataKey="Revenue" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (₹)" />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Doctor Load bar & condition distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="dashboard-secondary-charts">
          
          {/* Pie: Patient Conditions */}
          <div className="rounded-xl border border-white/8 bg-slate-950/40 p-5 flex flex-col justify-between" id="chart-conditions">
            <div className="mb-2">
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Casemix Profile</h4>
              <p className="text-xs font-bold text-white">Diagnostic Distribution</p>
            </div>

            <div className="h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conditionsDistribution}
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {conditionsDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#090e24', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: 10 }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Total display inside donut chart */}
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-mono text-slate-500 uppercase leading-none">TOTAL MAPPED</span>
                <span className="text-base font-display font-extrabold text-white">194</span>
              </div>
            </div>

            {/* Compact Legend */}
            <div className="grid grid-cols-3 gap-1.5 mt-2 text-[10px]">
              {conditionsDistribution.map((c, i) => (
                <div key={i} className="flex items-center gap-1 text-slate-400 text-ellipsis truncate">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                  <span>{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart: Doctor Load */}
          <div className="rounded-xl border border-white/8 bg-slate-950/40 p-5 flex flex-col justify-between" id="chart-dr-load">
            <div>
              <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Clinician Daily Load</h4>
              <p className="text-xs font-bold text-white">OPD Consults Scheduled</p>
            </div>

            <div className="h-44 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={doctorLoads} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={9} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#090e24', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: 10 }}
                  />
                  <Bar dataKey="TokenLoad" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Assigned Tasks">
                    {doctorLoads.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#06b6d4' : '#8b5cf6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom section: Recent clinically auditable transactions and state logs */}
      <div className="rounded-xl border border-white/8 bg-slate-950/40 p-5 space-y-4" id="dashboard-recent-activity">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">Telemetry Logs</h4>
            <p className="text-sm font-bold text-white">Latest Clinically Logged Actions</p>
          </div>
          <p className="text-xs text-slate-500 font-mono">AUTOMATED VERIFIED LEDGER</p>
        </div>

        <div className="space-y-2.5" id="recent-activity-list">
          {recentActivities.map((act) => (
            <div 
              key={act.id} 
              className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors gap-4"
              id={act.id}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-slate-900 border border-white/10 shrink-0">
                  <Stethoscope className="w-4 h-4 text-neon-cyan" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white">{act.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-0.5">{act.desc}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-white/10 ${act.color}`}>
                  {act.tag}
                </span>
                <p className="text-[9px] text-slate-500 mt-1 font-mono">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
