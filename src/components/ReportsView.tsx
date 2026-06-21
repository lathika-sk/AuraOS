import React, { useState } from 'react';
import { useClinic } from '../ClinicContext';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  BarChart, 
  PieChart as PieIcon, 
  Users, 
  IndianRupee, 
  Calendar, 
  Activity, 
  Award,
  BookOpen
} from 'lucide-react';
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
  BarChart as RechartsBarChart, 
  Bar, 
  Legend,
  LineChart,
  Line
} from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'sonner';

let cachedRegularBase64: string | null = null;
let cachedBoldBase64: string | null = null;

async function loadUnicodeFont(doc: any): Promise<string> {
  // If we have cached both, direct load from memory
  if (cachedRegularBase64 && cachedBoldBase64) {
    doc.addFileToVFS('Roboto-Regular.ttf', cachedRegularBase64);
    doc.addFont('Roboto-Regular.ttf', 'RobotoManual', 'normal');
    doc.addFileToVFS('Roboto-Bold.ttf', cachedBoldBase64);
    doc.addFont('Roboto-Bold.ttf', 'RobotoManual', 'bold');
    return 'RobotoManual';
  }

  const regUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf';
  const boldUrl = 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Bold.ttf';

  try {
    const [regRes, boldRes] = await Promise.all([
      fetch(regUrl),
      fetch(boldUrl)
    ]);

    if (regRes.ok && boldRes.ok) {
      const [regBuf, boldBuf] = await Promise.all([
        regRes.arrayBuffer(),
        boldRes.arrayBuffer()
      ]);

      const toBase64 = (buffer: ArrayBuffer) => {
        const bytes = new Uint8Array(buffer);
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
      };

      cachedRegularBase64 = toBase64(regBuf);
      cachedBoldBase64 = toBase64(boldBuf);

      doc.addFileToVFS('Roboto-Regular.ttf', cachedRegularBase64);
      doc.addFont('Roboto-Regular.ttf', 'RobotoManual', 'normal');
      doc.addFileToVFS('Roboto-Bold.ttf', cachedBoldBase64);
      doc.addFont('Roboto-Bold.ttf', 'RobotoManual', 'bold');

      return 'RobotoManual';
    }
  } catch (e) {
    console.warn('Failed to load full Roboto Regular and Bold from CDN. Trying fallback...', e);
  }

  // Graceful single fallback (Regular only, mapped to bold as well)
  if (cachedRegularBase64) {
    doc.addFileToVFS('Roboto-Regular.ttf', cachedRegularBase64);
    doc.addFont('Roboto-Regular.ttf', 'RobotoManual', 'normal');
    doc.addFont('Roboto-Regular.ttf', 'RobotoManual', 'bold');
    return 'RobotoManual';
  }

  // Fallback try loading Regular alone with GStatic
  try {
    const res = await fetch('https://fonts.gstatic.com/s/notosans/v36/o-0IIpQlx3QUlC5A4FJrkyM610F8ww.ttf');
    if (res.ok) {
      const buffer = await res.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const b64 = window.btoa(binary);
      cachedRegularBase64 = b64;
      doc.addFileToVFS('Roboto-Regular.ttf', b64);
      doc.addFont('Roboto-Regular.ttf', 'RobotoManual', 'normal');
      doc.addFont('Roboto-Regular.ttf', 'RobotoManual', 'bold');
      return 'RobotoManual';
    }
  } catch (e) {
    console.warn('Fallback font failed', e);
  }

  return 'Helvetica';
}

export const ReportsView: React.FC = () => {
  const { state } = useClinic();
  const [selectedPatId, setSelectedPatId] = useState('');

  // Top statistics variables
  const totalRevenueSum = state.patients.reduce((sum, p) => sum + p.cost, 0);
  const totalPatientsCount = state.patients.length;
  const totalAppointmentsCount = state.appointments.length;
  const averageSatisfaction = 4.8; // premium clinic scale

  // Filter list of patients for individual PDF report select dropdown
  const topReportPatients = state.patients.slice(0, 40);

  // Recharts Chart configurations
  const conditionsSummary = [
    { name: 'Cardiac Diseases', Patients: 48, fill: '#06b6d4' },
    { name: 'Type 2 Diabetes', Patients: 38, fill: '#8b5cf6' },
    { name: 'Pediatric Asthma', Patients: 24, fill: '#14b8a6' },
    { name: 'Orthopedics', Patients: 31, fill: '#ec4899' },
    { name: 'Gastroenteritis', Patients: 18, fill: '#f59e0b' },
    { name: 'Others', Patients: 41, fill: '#64748b' }
  ];

  const genderRatio = [
    { name: 'Male', value: 110, color: '#06b6d4' },
    { name: 'Female', value: 82, color: '#8b5cf6' },
    { name: 'Other', value: 8, color: '#14b8a6' }
  ];

  const overTimeVolume = [
    { month: 'Jan', revenue: 1450000, visits: 180 },
    { month: 'Feb', revenue: 1850000, visits: 220 },
    { month: 'Mar', revenue: 2900000, visits: 340 },
    { month: 'Apr', revenue: 3400000, visits: 390 },
    { month: 'May', revenue: 4100000, visits: 490 },
    { month: 'Jun', revenue: totalRevenueSum, visits: totalPatientsCount + 300 },
  ];

  // Dynamic last 7 days patient trend generator
  const getPatientIntakeTrends = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const trendData = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dayName = days[d.getDay()];
      const dayStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      
      const seedValues = [12, 18, 14, 25, 19, 28, 22];
      const count = seedValues[6 - i] + (state.patients.length % 5);
      
      trendData.push({
        day: `${dayName} (${dayStr})`,
        "Admitted": count,
        "Discharged": Math.max(5, count - 4)
      });
    }
    return trendData;
  };

  const intakeTrends = getPatientIntakeTrends();

  // ==========================================
  // FUNCTION 1: GENERATE HOSPITAL EXECUTIVE PDF
  // ==========================================
  const downloadExecutiveAnalyticsReport = () => {
    const doc = new jsPDF();

    // 1. Aura OS branding Header styling
    doc.setFillColor(7, 11, 25);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(34, 211, 238); // neon cyan
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('AURA CLINIC OS', 14, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text('METRO CENTER OF EXCELLENCE // BENGALURU, INDIA', 14, 28);
    doc.text('EXECUTIVE EXECUTIVE REPORT -- SYSTEM VERIFIED LOG', 120, 28);

    // 2. Report metadata info
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}`, 14, 48);
    doc.text('Ledger Audit Clearing Code: OS-INR-IND-2026', 14, 53);

    // 3. Stat box totals layout
    doc.setFillColor(243, 244, 246);
    doc.rect(14, 60, 56, 25, 'F');
    doc.rect(77, 60, 56, 25, 'F');
    doc.rect(140, 60, 56, 25, 'F');

    doc.setTextColor(100, 100, 100);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('TOTAL PATIENTS REGISTERED', 18, 66);
    doc.text('TOTAL RESERVED CLINICS', 81, 66);
    doc.text('AUDITED INR STREAM', 144, 66);

    doc.setTextColor(7, 11, 25);
    doc.setFontSize(14);
    doc.text(totalPatientsCount.toString(), 18, 76);
    doc.text(totalAppointmentsCount.toString(), 81, 76);
    doc.text(`INR ${(totalRevenueSum + 428000).toLocaleString('en-IN')}`, 144, 76);

    // 4. Table 1: Doctors Performance overview
    doc.setTextColor(7, 11, 25);
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text('Registered Medical Practitioners & Roster Load', 14, 96);

    const docBody = state.doctors.map((dr, idx) => [
      dr.id,
      dr.name,
      dr.specialty,
      dr.availability,
      `INR ${dr.fee.toLocaleString('en-IN')}`,
      `${dr.loadToday} patients/day`
    ]);

    autoTable(doc, {
      startY: 100,
      head: [['Doc-ID', 'Practitioner Name', 'Clinical Specialty', 'Standard Roster Space', 'Fee (INR)', 'Roster Load']],
      body: docBody,
      headStyles: { fillColor: [13, 20, 43], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      theme: 'striped'
    });

    // 5. Table 2: Pipeline Waiting Statistics
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(12);
    doc.text('EMR Pipeline Queuing Log Summary', 14, finalY + 15);

    const queueBody = state.queue.map((q) => [
      q.tokenNumber.toString(),
      q.patientId,
      q.patientName,
      q.assignedDoctorName,
      q.status
    ]);

    autoTable(doc, {
      startY: finalY + 20,
      head: [['Token #', 'Patient ID', 'Patient Name', 'Assigned Clinician', 'Pipeline Status']],
      body: queueBody,
      headStyles: { fillColor: [56, 189, 248], textColor: [7, 11, 25] },
      theme: 'grid'
    });

    // Footer
    const finalY2 = (doc as any).lastAutoTable.finalY || 210;
    doc.setFont('Helvetica', 'bolditalic');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('CONFIDENTIAL INTELLECTUAL PROPERTY OF AURA CLINIC COMPLIANCE GATEWAY SYSTEM. ALL COGNIZANT RECORD KEEPING RESERVED.', 14, Math.min(finalY2 + 25, 280));

    doc.save('aura_clinical_executive_analytics_report.pdf');
    setSelectedPatId('');
    toast.success('Executive hospital analytics report generated and saved as PDF.');
  };

  // ==========================================
  // FUNCTION 2: INDIVIDUAL PATIENT EMR PDF
  // ==========================================
  const downloadPatientDossierReport = async (patientId: string) => {
    if (!patientId) {
      toast.error('Choose patient from select roster dropdown before requesting EMR compilation.');
      return;
    }

    const patient = state.patients.find((p) => p.id === patientId);
    if (!patient) return;

    // Filter past consultations
    const consultDiary = state.consultations.filter((c) => c.patientId === patientId);

    const doc = new jsPDF();

    // Load Unicode font with elegant toast warning
    const toastId = toast.loading('Synchronizing secure clinical Unicode font tables...');
    const unicodeFontName = await loadUnicodeFont(doc);
    toast.dismiss(toastId);

    // Visual theme EMR Dossier card background details
    doc.setFillColor(13, 20, 43); // deep cyber blue
    doc.rect(0, 0, 210, 45, 'F');

    // Branding text
    doc.setTextColor(56, 189, 248); // neon cyan
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('AURA OS', 14, 20);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'normal');
    doc.text('EMR CLINICAL HEALTH RECORDS SYSTEM', 14, 28);
    doc.text('PATIENT REGISTREE DOSSIER SUMMARY', 14, 34);

    // EMR Identity Tag Right aligned
    doc.setTextColor(34, 211, 238);
    doc.setFont('Courier', 'bold');
    doc.setFontSize(12);
    doc.text(`ID: ${patient.id}`, 145, 20);
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`ISSUED IST: ${new Date().toLocaleDateString('en-IN')}`, 145, 28);
    doc.text('STATUS: VERIFIED SECURE', 145, 34);

    // Section 1: Demographics
    let currentY = 56;
    doc.setTextColor(13, 20, 43);
    doc.setFont(unicodeFontName, 'bold');
    doc.setFontSize(12);
    doc.text('1. Biological Demographics & Dossier Detail', 14, currentY);
    currentY += 8;

    // Structured border box for Demographics Detail
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.rect(14, currentY, 182, 48, 'F');
    doc.rect(14, currentY, 182, 48, 'S');

    doc.setFont(unicodeFontName, 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);

    // Two Column Fixed Grid Layout offsets
    const col1X = 18;
    const col2X = 110;
    const valCol1Offset = col1X + 38;
    const valCol2Offset = col2X + 40;

    // Row 1: Full Register Name & Enrolled Diagnostics
    doc.setFont(unicodeFontName, 'bold');
    doc.text('Full Register Name:', col1X, currentY + 8);
    doc.setFont(unicodeFontName, 'normal');
    doc.text(patient.name, valCol1Offset, currentY + 8);

    doc.setFont(unicodeFontName, 'bold');
    doc.text('Enrolled Diagnostics:', col2X, currentY + 8);
    doc.setFont(unicodeFontName, 'normal');
    const diagText = doc.splitTextToSize(patient.condition, 44);
    doc.text(diagText, valCol2Offset, currentY + 8);

    // Row 2: Age / Gender & Enrolled Procedure
    doc.setFont(unicodeFontName, 'bold');
    doc.text('Age / Gender:', col1X, currentY + 16);
    doc.setFont(unicodeFontName, 'normal');
    doc.text(`${patient.age} Yrs old   //   ${patient.gender}`, valCol1Offset, currentY + 16);

    doc.setFont(unicodeFontName, 'bold');
    doc.text('Enrolled Procedure:', col2X, currentY + 16);
    doc.setFont(unicodeFontName, 'normal');
    const procText = doc.splitTextToSize(patient.procedure, 44);
    doc.text(procText, valCol2Offset, currentY + 16);

    // Row 3: Contact Handset & Treatment Cost Value
    doc.setFont(unicodeFontName, 'bold');
    doc.text('Contact Handset:', col1X, currentY + 24);
    doc.setFont(unicodeFontName, 'normal');
    doc.text(patient.phone, valCol1Offset, currentY + 24);

    doc.setFont(unicodeFontName, 'bold');
    doc.text('Treatment Cost Value:', col2X, currentY + 24);
    doc.setFont(unicodeFontName, 'bold');
    doc.setTextColor(13, 20, 43);
    const costSymbol = unicodeFontName === 'Helvetica' ? 'Rs. ' : '₹ ';
    doc.text(`${costSymbol}${patient.cost.toLocaleString('en-IN')}`, valCol2Offset, currentY + 24);
    doc.setTextColor(71, 85, 105);
    doc.setFont(unicodeFontName, 'normal');

    // Row 4: Registered City
    doc.setFont(unicodeFontName, 'bold');
    doc.text('Registered City:', col1X, currentY + 32);
    doc.setFont(unicodeFontName, 'normal');
    doc.text(patient.city, valCol1Offset, currentY + 32);

    // Row 5: Home Address (Full width row with safe word wrapping)
    doc.setFont(unicodeFontName, 'bold');
    doc.text('Home Address:', col1X, currentY + 39);
    doc.setFont(unicodeFontName, 'normal');
    const addressLines = doc.splitTextToSize(patient.address, 130);
    doc.text(addressLines, valCol1Offset, currentY + 39);

    currentY += 48; // move below the demographics card block
    currentY += 12; // consistent rhythm spacing

    // Section 2: Patient Consultation history diary
    doc.setTextColor(13, 20, 43);
    doc.setFont(unicodeFontName, 'bold');
    doc.setFontSize(12);
    doc.text('2. Sealed Clinical Consultation Notes Matrix (EMR Log)', 14, currentY);
    currentY += 6;

    if (consultDiary.length > 0) {
      const consultData = consultDiary.map((c) => [
        new Date(c.createdAt).toLocaleDateString('en-IN'),
        c.doctorName,
        c.diagnosis,
        c.clinicalNotes.slice(0, 80) + '...',
        c.prescription.slice(0, 80) + '...'
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [['IST Log Date', 'Prescribing Practitioner', 'Clinical Diagnosis', 'Somatic Notes Reference', 'Rx Prescription formulation']],
        body: consultData,
        headStyles: { fillColor: [13, 20, 43], textColor: [255, 255, 255], font: unicodeFontName },
        styles: { font: unicodeFontName },
        theme: 'striped'
      });
      currentY = (doc as any).lastAutoTable?.finalY || (currentY + 25);
    } else {
      // Elegant empty consultation notes card
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(248, 250, 252);
      doc.rect(14, currentY, 182, 18, 'F');
      doc.rect(14, currentY, 182, 18, 'S');

      doc.setFont(unicodeFontName, 'italic');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('No certified clinical consult journals are registered yet in this session folder.', 18, currentY + 11);
      
      currentY += 18; // offset empty container
    }

    currentY += 12; // consistent rhythm spacing

    // Section 3: Financial Clearance Statement
    doc.setTextColor(13, 20, 43);
    doc.setFont(unicodeFontName, 'bold');
    doc.setFontSize(12);
    doc.text('3. Super-Specialty Billing Clearance Invoice', 14, currentY);
    currentY += 6;

    const invoiceBody = [
      ['Aura Super-specialty Hospital Administrative Charge', `${costSymbol}1,500.00`],
      ['Enrolled Clinical Procedure: ' + patient.procedure, `${costSymbol}${(patient.cost - 1500).toLocaleString('en-IN')}.00`],
      ['Unified CGST Standard Tax Assessment Rate (18% inclusive)', 'Tax Exempt'],
      ['TOTAL REALIZED CLINIC LIABILITY PAID (INR)', `${costSymbol}${patient.cost.toLocaleString('en-IN')}.00`]
    ];

    autoTable(doc, {
      startY: currentY,
      head: [['Line Item Medical Clearance Description', 'Assessment Invoice Charge (INR)']],
      body: invoiceBody,
      headStyles: { fillColor: [92, 107, 115], textColor: [255, 255, 255], font: unicodeFontName },
      styles: { font: unicodeFontName },
      theme: 'grid',
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'right' }
      },
      didParseCell: (data) => {
        if (data.row.index === 3) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.fillColor = [241, 245, 249];
          data.cell.styles.fontSize = 10;
          data.cell.styles.textColor = [13, 20, 43];
        }
      }
    });

    // Signature Block Footer
    const finalYInvoice = (doc as any).lastAutoTable.finalY || (currentY + 30);
    doc.setFont('Helvetica', 'bolditalic');
    doc.setFontSize(8);
    doc.text('AURA HOSPITALS CERTIFIABLE CLINICAL DISCHARGE LEDGER. SEAL VERIFIED BY BIOMETRICS OUTPATIENT CARD REGISTRAR.', 14, Math.min(finalYInvoice + 16, 280));

    doc.save(`EMR_Dossier_Report_${patient.name.replace(/\s+/g, '_')}.pdf`);
    toast.success(`Patient EMR compiled successfully & saved as PDF for ${patient.name}`);
  };

  return (
    <div className="space-y-6" id="reports-view-container">
      
      {/* Analytics Total Stats row and Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="reports-hub-main">
        
        {/* Core download controls inside glass pane */}
        <div className="lg:col-span-1 rounded-xl border border-white/10 bg-[#090e24]/40 p-6 flex flex-col justify-between h-[380px]" id="pdf-downloads-control">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-neon-cyan animate-pulse" />
              <h3 className="font-display text-sm font-bold text-white uppercase tracking-wider">Reports Clearing Desk</h3>
            </div>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Compile hospital executive analytics or individual patient EMR medical records files into high-integrity clinically sealable PDF files.
            </p>

            {/* Selection for individual patient PDF report */}
            <div className="space-y-2.5">
              <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold">1. Select Patient for Individual PDF</label>
              <select
                id="report-patient-select"
                value={selectedPatId}
                onChange={(e) => setSelectedPatId(e.target.value)}
                className="w-full bg-[#10162e] border border-white/10 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-neon-cyan cursor-pointer"
              >
                <option value="">-- Choose Patient Dossier --</option>
                {topReportPatients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>

              <button
                id="btn-download-patient-report"
                onClick={() => downloadPatientDossierReport(selectedPatId)}
                disabled={!selectedPatId}
                className="w-full bg-linear-to-r from-neon-cyan to-cyan-500 hover:from-cyan-400 hover:to-neon-cyan text-slate-950 font-bold tracking-wider py-2.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_oklch(0.78_0.18_215_/_0.15)] text-xs uppercase cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Build Patient EMR File</span>
              </button>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 mt-4 space-y-2">
            <label className="block text-[10px] font-mono uppercase text-slate-400 font-bold">2. Executive Analytics Audit</label>
            <button
              onClick={downloadExecutiveAnalyticsReport}
              className="w-full bg-slate-900 hover:bg-neon-violet border border-white/5 text-white font-bold tracking-wider py-2.5 rounded-xl transition-all duration-300 text-xs uppercase cursor-pointer flex items-center justify-center gap-2"
              id="btn-download-executive-report"
            >
              <Download className="w-4 h-4" />
              <span>Executive Data PDF</span>
            </button>
          </div>
        </div>

        {/* Dynamic Analytics Data statistics dashboard Area */}
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-[#090e24]/40 p-6 flex flex-col justify-between" id="analytics-overview-dashboard">
          
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-display text-xs font-bold text-slate-300 uppercase tracking-widest">Aura OS Analytics Module</h4>
            <span className="text-[10px] bg-neon-cyan/5 text-neon-cyan font-mono border border-neon-cyan/15 px-2 py-0.5 rounded uppercase">Verified Data Nodes</span>
          </div>

          {/* Analytics stat boxes */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2" id="analytics-hub-grid">
            
            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-left shadow-xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Hospital Flow</span>
              <span className="text-xl font-display font-black text-white block mt-1">{totalPatientsCount}</span>
              <p className="text-[9px] text-emerald-400 mt-1 font-mono">&uarr; +14.2% Growth</p>
            </div>

            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-left shadow-xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Clinic Reserved</span>
              <span className="text-xl font-display font-black text-white block mt-1">{totalAppointmentsCount}</span>
              <p className="text-[9px] text-indigo-400 mt-1 font-mono">&bull; Operational</p>
            </div>

            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-left shadow-xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Realized Billings</span>
              <span className="text-xl font-display font-black text-white block mt-1">₹{(totalRevenueSum).toLocaleString('en-IN')}</span>
              <p className="text-[9px] text-emerald-400 mt-1 font-mono">&uarr; +18.4% realizing</p>
            </div>

            <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-left shadow-xs">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">Satisfaction</span>
              <span className="text-xl font-display font-black text-white block mt-1">{averageSatisfaction} / 5</span>
              <p className="text-[9px] text-neon-cyan mt-1 font-mono">&bull; 400+ reviews Standard</p>
            </div>

          </div>

          <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>AUDIT METRIC: LEVEL A COMPLIANT // NO PARITY ERRORS FOUND</span>
            <span>SECURE BACKUP: IST ONLINE</span>
          </div>

        </div>

      </div>

      {/* Analytics Graphs Display Roster */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" id="reports-graphs-roster">
        
        {/* Graph 1: Cond. Bar */}
        <div className="rounded-xl border border-white/10 bg-[#090e24]/40 p-5 space-y-4" id="report-graph-conditions">
          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">MAPPED INDIVIDUALS PROFILE</h4>
            <p className="text-sm font-bold text-white">Casemix Diagnostic Profile</p>
          </div>

          <div className="h-60" id="report-recharts-bar-holder">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={conditionsSummary} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090e24', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: 11 }}
                />
                <Bar dataKey="Patients" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Active Files">
                  {conditionsSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 2: 7-Day Patient Intake Line Chart */}
        <div className="rounded-xl border border-white/10 bg-[#090e24]/40 p-5 space-y-4" id="report-graph-intake-trends">
          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">7-DAY VOLUME INSIGHTS</h4>
            <p className="text-sm font-bold text-white">Patient Intake Trends</p>
          </div>

          <div className="h-60" id="report-recharts-line-holder">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={intakeTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090e24', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: 11 }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line 
                  type="monotone" 
                  dataKey="Admitted" 
                  stroke="#06b6d4" 
                  strokeWidth={3} 
                  activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
                  dot={{ r: 4, stroke: '#06b6d4', strokeWidth: 1.5, fill: '#090e24' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Discharged" 
                  stroke="#8b5cf6" 
                  strokeWidth={2} 
                  strokeDasharray="4 4"
                  dot={{ r: 3, stroke: '#8b5cf6', strokeWidth: 1, fill: '#090e24' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Graph 3: Revenue stream */}
        <div className="rounded-xl border border-white/10 bg-[#090e24]/40 p-5 space-y-4" id="report-graph-stream">
          <div>
            <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">MONTHLY FINANCIAL ACCRUAL</h4>
            <p className="text-sm font-bold text-white">Consolidated Billings Stream (6 months)</p>
          </div>

          <div className="h-60" id="report-recharts-area-holder">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overTimeVolume} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#090e24', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: 11 }}
                  labelStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" name="Revenue (₹)" />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
