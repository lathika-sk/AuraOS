import React, { useState } from 'react';
import { useClinic } from '../ClinicContext';
import { useTranslation } from '../LanguageContext';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  User, 
  Plus, 
  CheckCircle, 
  XSquare, 
  AlertCircle,
  IndianRupee,
  Search,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

const TIME_SLOTS = [
  '09:00 AM - 09:30 AM',
  '09:30 AM - 10:00 AM',
  '10:30 AM - 11:00 AM',
  '11:30 AM - 12:00 PM',
  '01:00 PM - 01:30 PM',
  '02:00 PM - 02:30 PM',
  '03:30 PM - 04:00 PM',
  '04:30 PM - 05:00 PM',
  '05:30 PM - 06:00 PM',
  '06:30 PM - 07:00 PM',
];

export const AppointmentsView: React.FC = () => {
  const { state, bookAppointment, cancelAppointment, completeAppointment } = useClinic();
  const { locale, t } = useTranslation();

  // Booking states
  const [patientId, setPatientId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [aptDate, setAptDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [searchQuery, setSearchQuery] = useState('');

  // Active modal/popup state
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !doctorId || !aptDate || !timeSlot) {
      toast.error('Please complete all selection fields to log appointment.');
      return;
    }

    const patient = state.patients.find((p) => p.id === patientId);
    const doctor = state.doctors.find((d) => d.id === doctorId);

    if (!patient || !doctor) {
      toast.error('Identity data mismatch.');
      return;
    }

    bookAppointment({
      patientId,
      patientName: patient.name,
      doctorId,
      doctorName: doctor.name,
      date: aptDate,
      timeSlot,
    });

    // Reset fields & close
    setPatientId('');
    setDoctorId('');
    setIsFormOpen(false);
  };

  // Filter list of appointments based on simple search
  const filteredAppointments = state.appointments.filter((apt) => {
    return (
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.timeSlot.includes(searchQuery)
    );
  });

  return (
    <div className="space-y-6" id="appointments-view-container">
      
      {/* Upper bar with Search & Appointment booking Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl glass-panel relative overflow-hidden" id="appointments-header">
        <div className="space-y-1">
          <h2 className="font-display text-xl font-bold tracking-normal uppercase text-white">
            {locale === 'ta' ? 'அப்பாயிண்ட்மெண்ட் முன்பதிவுகள்' : locale === 'hi' ? 'ओपीडी बुकिंग्स' : 'OPD BOOKINGS'}
          </h2>
          <p className="text-xs text-slate-400">
            {locale === 'ta' ? 'நோயாளிகளுக்கான சந்திப்புகளைத் திட்டமிடுங்கள், மருத்துவர்களை ஒதுக்குங்கள் மற்றும் முன்பதிவு நிலையை மாற்றவும்.' : locale === 'hi' ? 'बाह्य रोगी नियुक्तियां निर्धारित करें, डॉक्टरों को नियुक्त करें और बुकिंग स्थिति को बदलें।' : 'Schedule outpatient clinics, assign doctor calendars, and modify reservation status.'}
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 bg-linear-to-r from-neon-violet to-[#8b5cf6] hover:from-[#8b5cf6] hover:to-neon-violet text-white font-bold px-4 py-2.5 rounded-xl transition-all duration-300 transform active:scale-95 text-xs uppercase cursor-pointer"
          id="btn-trigger-appointment-booking"
        >
          <Calendar className="w-4 h-4" />
          <span>
            {locale === 'ta' ? 'சந்திப்பைத் திட்டமிடு' : locale === 'hi' ? 'नियुक्ति जोड़ें' : 'Schedule Appointment'}
          </span>
        </button>
      </div>

      {/* Roster Search Bar Filters */}
      <div className="relative max-w-md bg-slate-950/20 p-1.5 rounded-xl border border-white/5" id="appointment-filters">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          id="appointment-search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={locale === 'ta' ? 'நோயாளி, மருத்துவர் அல்லது நேரத்தைக் கொண்டு தேடவும்...' : locale === 'hi' ? 'मरीज़, डॉक्टर या समय स्लॉट द्वारा खोजें...' : 'Filter booking by patient, doctor specialty or time slot...'}
          className="w-full bg-[#0a0f26] border border-white/8 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 focus:outline-none focus:border-neon-cyan transition-all"
        />
      </div>

      {/* Main Grid: APPOINTMENTS BOOKING LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="appointments-grid-list">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => {
            const badgeStyles = {
              scheduled: 'bg-[#d97706]/10 text-amber-400 border-amber-500/20',
              completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
              cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
            }[apt.status];

            return (
              <div 
                key={apt.id} 
                id={`card-${apt.id}`}
                className="rounded-xl border border-white/10 bg-[#090e24]/60 p-5 space-y-4 hover:border-slate-600 transition-all shadow-md group relative overflow-hidden"
              >
                
                {/* Header status */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{apt.id}</span>
                  <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeStyles}`}>
                    {apt.status}
                  </span>
                </div>

                {/* Patient details */}
                <div className="flex items-start gap-2.5">
                  <User className="w-4 h-4 text-neon-cyan mt-0.5" />
                  <div>
                    <h5 className="text-[10px] font-mono text-slate-500 uppercase">
                      {locale === 'ta' ? 'நோயாளி பெயர்' : locale === 'hi' ? 'मरीज़ का नाम' : 'Patient Name'}
                    </h5>
                    <p className="font-bold text-white leading-snug tracking-wide">{apt.patientName}</p>
                    <span className="text-[10px] text-slate-400 font-mono italic">{apt.patientId}</span>
                  </div>
                </div>

                {/* Doctor details */}
                <div className="flex items-start gap-2.5">
                  <Stethoscope className="w-4 h-4 text-neon-violet mt-0.5" />
                  <div>
                    <h5 className="text-[10px] font-mono text-slate-500 uppercase">
                      {locale === 'ta' ? 'மருத்துவர்' : locale === 'hi' ? 'चिकित्सक' : 'Clinician'}
                    </h5>
                    <p className="font-semibold text-slate-300 leading-snug mt-0.5">{apt.doctorName}</p>
                  </div>
                </div>

                {/* Timing details */}
                <div className="bg-[#040610] p-3 rounded-lg border border-white/5 space-y-1 text-xs">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-slate-500">
                      {locale === 'ta' ? 'முன்பதிவு நேரம்:' : locale === 'hi' ? 'अपॉइंटमेंट स्लॉट:' : 'APPOINTMENT SLOT:'}
                    </span>
                    <span className="text-neon-cyan font-bold">{apt.date}</span>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] font-bold text-slate-300">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-right">{apt.timeSlot}</span>
                  </div>
                </div>

                {/* Panel actions if scheduled */}
                {apt.status === 'scheduled' && (
                  <div className="border-t border-white/5 pt-3 flex items-center justify-end gap-2 text-[10px]">
                    <button
                      id={`btn-cancel-apt-${apt.id}`}
                      onClick={() => {
                        if (confirm('Cancel this scheduled hospital appointment reservation?')) {
                          cancelAppointment(apt.id);
                        }
                      }}
                      className="bg-rose-950/45 hover:bg-rose-900 border border-rose-800/30 text-rose-400 font-bold px-2.5 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1 uppercase text-[9px]"
                    >
                      <XSquare className="w-3.5 h-3.5" />
                      <span>{locale === 'ta' ? 'ரத்து செய்' : locale === 'hi' ? 'रद्द करें' : 'Cancel'}</span>
                    </button>

                    <button
                      id={`btn-complete-apt-${apt.id}`}
                      onClick={() => completeAppointment(apt.id)}
                      className="bg-emerald-550/10 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-500/20 text-emerald-400 font-bold px-2.5 py-1.5 rounded transition-all cursor-pointer flex items-center gap-1 uppercase text-[9px]"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{locale === 'ta' ? 'முடிக்கவும்' : locale === 'hi' ? 'पूरा चिन्हित' : 'Mark Complete'}</span>
                    </button>
                  </div>
                )}

              </div>
            );
          })
        ) : (
          <div className="col-span-full text-center py-16 text-slate-400 font-mono bg-slate-950/20 border border-white/5 rounded-xl">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <span>
              {locale === 'ta' ? 'தேடலுடன் பொருந்தக்கூடிய அப்பாயிண்ட்மெண்ட்கள் எதுவும் இல்லை.' : locale === 'hi' ? 'कोई मिलान वाली नियुक्तियां नहीं मिलीं।' : 'No hospital scheduling matches current filter queries.'}
            </span>
          </div>
        )}
      </div>

      {/* BOOKING MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-[#090f28] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/8 mb-6">
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider">
                {locale === 'ta' ? 'அப்பாயிண்ட்மெண்ட் முன்பதிவு செய்யவும்' : locale === 'hi' ? 'परामर्श स्लॉट बुक करें' : 'Book Consultation Slot'}
              </h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                {locale === 'ta' ? 'மூடு' : locale === 'hi' ? 'बंद करें' : 'Close'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-300">
              
              {/* Select Patient */}
              <div>
                <label className="block text-slate-400 mb-1 font-mono uppercase tracking-widest text-[10px]">
                  {locale === 'ta' ? 'நோயாளியைத் தேர்ந்தெடுக்கவும்' : locale === 'hi' ? 'अस्पताल के मरीज़ का चयन करें' : 'Select Hospital Patient'}
                </label>
                <select
                  required
                  id="booking-patient-select"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="w-full bg-[#10162e] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-neon-cyan cursor-pointer"
                >
                  <option value="">
                    {locale === 'ta' ? '-- நோயாளியைத் தேர்வு செய்க --' : locale === 'hi' ? '-- मरीज़ प्रोफ़ाइल चुनें --' : '-- Choose Patient Wallet File --'}
                  </option>
                  {state.patients.slice(0, 50).map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({locale === 'ta' ? 'வயது' : locale === 'hi' ? 'उम्र' : 'Age'}: {p.age}, {locale === 'ta' ? 'நகரம்' : locale === 'hi' ? 'शहर' : 'City'}: {p.city})
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-slate-500 font-mono mt-1 leading-normal italic">
                  {locale === 'ta' ? 'உங்கள் கணினியில் பதிவுசெய்யப்பட்ட நோயாளிகளின் பட்டியலைக் காட்டுகிறது.' : locale === 'hi' ? 'सिस्टम में पंजीकृत सक्रिय मरीजों की सूची प्रदर्शित है।' : 'Shows the topmost active profiles registered in your system folder.'}
                </p>
              </div>

              {/* Select Doctor */}
              <div>
                <label className="block text-slate-400 mb-1 font-mono uppercase tracking-widest text-[10px]">
                  {locale === 'ta' ? 'மருத்துவரை நியமிக்கவும்' : locale === 'hi' ? 'चिकित्सक आवंटित करें' : 'Assign Clinician Cabinet'}
                </label>
                <select
                  required
                  id="booking-doctor-select"
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  className="w-full bg-[#10162e] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-neon-cyan cursor-pointer"
                >
                  <option value="">
                    {locale === 'ta' ? '-- மருத்துவரைத் தேர்ந்தெடுக்கவும் --' : locale === 'hi' ? '-- चिकित्सक चुनें --' : '-- Choose Medical Practitioner --'}
                  </option>
                  {state.doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.specialty} // {locale === 'ta' ? 'கட்டணம்' : locale === 'hi' ? 'परामर्श शुल्क' : 'Fee'}: ₹{d.fee})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                {/* Select Date */}
                <div>
                  <label className="block text-slate-400 mb-1 font-mono uppercase tracking-widest text-[10px]">
                    {locale === 'ta' ? 'முன்பதிவு தேதி' : locale === 'hi' ? 'निर्धारित तिथि' : 'Date Scheduled'}
                  </label>
                  <input
                    type="date"
                    required
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    className="w-full bg-[#10162e] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-neon-cyan font-mono"
                  />
                </div>

                {/* Select Slot */}
                <div>
                  <label className="block text-slate-400 mb-1 font-mono uppercase tracking-widest text-[10px]">
                    {locale === 'ta' ? 'ஒதுக்கப்பட்ட நேரம்' : locale === 'hi' ? 'आवंटित समय सीमा' : 'Assigned Time Frame'}
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-[#10162e] border border-white/10 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-neon-cyan font-mono cursor-pointer"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Save Panel triggers */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/8 mt-6">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 hover:bg-white/5 border border-white/5 text-slate-400 hover:text-white rounded-xl text-xs uppercase cursor-pointer"
                >
                  {locale === 'ta' ? 'விலகு' : locale === 'hi' ? 'रद्द करें' : 'Discard'}
                </button>
                <button
                  type="submit"
                  id="btn-confirm-booking"
                  className="px-6 py-2 bg-gradient-to-r from-neon-violet to-[#8b5cf6] hover:from-[#8b5cf6] hover:to-neon-violet text-white font-bold rounded-xl text-xs uppercase cursor-pointer shadow-lg"
                >
                  {locale === 'ta' ? 'முன்பதிவை உறுதி செய்' : locale === 'hi' ? 'परामर्श स्लॉट बुक करें' : 'Request Consultation Slot'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
