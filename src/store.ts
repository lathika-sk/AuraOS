import { Patient, Doctor, QueueItem, Appointment, Consultation, UserSession } from './types';
import { generateMockPatients } from './data/mockPatients';
import { DOCTORS } from './data/doctors';

export interface ClinicState {
  patients: Patient[];
  doctors: Doctor[];
  queue: QueueItem[];
  appointments: Appointment[];
  consultations: Consultation[];
  session: UserSession | null;
}

const STORAGE_KEY = 'aura_clinic_os_state';

// Helper to get formatted date-time representing "now" or relative offsets
function getRelativeDateStr(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

function getInitialState(): ClinicState {
  if (typeof window === 'undefined') {
    return {
      patients: [],
      doctors: DOCTORS,
      queue: [],
      appointments: [],
      consultations: [],
      session: null,
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.patients?.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse clinic state from storage, re-seeding', e);
    }
  }

  // Generate initial mock state
  const patientsList = generateMockPatients();
  
  // Seed initial Queue
  const initialQueue: QueueItem[] = [
    {
      tokenNumber: 101,
      patientId: patientsList[0].id,
      patientName: patientsList[0].name,
      assignedDoctorId: 'doc-1',
      assignedDoctorName: 'Dr. Amit Verma',
      status: 'Completed',
      createdAt: getRelativeDateStr(0) + 'T09:15:00Z',
    },
    {
      tokenNumber: 102,
      patientId: patientsList[1].id,
      patientName: patientsList[1].name,
      assignedDoctorId: 'doc-4',
      assignedDoctorName: 'Dr. Sneha Patil',
      status: 'Completed',
      createdAt: getRelativeDateStr(0) + 'T09:30:00Z',
    },
    {
      tokenNumber: 103,
      patientId: patientsList[2].id,
      patientName: patientsList[2].name,
      assignedDoctorId: 'doc-2',
      assignedDoctorName: 'Dr. Priya Nair',
      status: 'In Progress',
      createdAt: getRelativeDateStr(0) + 'T10:05:00Z',
    },
    {
      tokenNumber: 104,
      patientId: patientsList[3].id,
      patientName: patientsList[3].name,
      assignedDoctorId: 'doc-3',
      assignedDoctorName: 'Dr. Rajesh Sharma',
      status: 'Waiting',
      createdAt: getRelativeDateStr(0) + 'T10:15:00Z',
    },
    {
      tokenNumber: 105,
      patientId: patientsList[4].id,
      patientName: patientsList[4].name,
      assignedDoctorId: 'doc-4',
      assignedDoctorName: 'Dr. Sneha Patil',
      status: 'Waiting',
      createdAt: getRelativeDateStr(0) + 'T10:20:00Z',
    },
    {
      tokenNumber: 106,
      patientId: patientsList[5].id,
      patientName: patientsList[5].name,
      assignedDoctorId: 'doc-6',
      assignedDoctorName: 'Dr. Ananya Iyer',
      status: 'Waiting',
      createdAt: getRelativeDateStr(0) + 'T10:35:00Z',
    },
  ];

  // Seed initial appointments
  const initialAppointments: Appointment[] = [
    {
      id: 'apt-1',
      patientId: patientsList[10].id,
      patientName: patientsList[10].name,
      doctorId: 'doc-1',
      doctorName: 'Dr. Amit Verma',
      date: getRelativeDateStr(0),
      timeSlot: '09:00 AM - 09:30 AM',
      status: 'completed',
      createdAt: getRelativeDateStr(-2),
    },
    {
      id: 'apt-2',
      patientId: patientsList[11].id,
      patientName: patientsList[11].name,
      doctorId: 'doc-4',
      doctorName: 'Dr. Sneha Patil',
      date: getRelativeDateStr(0),
      timeSlot: '11:30 AM - 12:00 PM',
      status: 'scheduled',
      createdAt: getRelativeDateStr(-2),
    },
    {
      id: 'apt-3',
      patientId: patientsList[12].id,
      patientName: patientsList[12].name,
      doctorId: 'doc-2',
      doctorName: 'Dr. Priya Nair',
      date: getRelativeDateStr(0),
      timeSlot: '01:00 PM - 01:30 PM',
      status: 'scheduled',
      createdAt: getRelativeDateStr(-1),
    },
    {
      id: 'apt-4',
      patientId: patientsList[13].id,
      patientName: patientsList[13].name,
      doctorId: 'doc-3',
      doctorName: 'Dr. Rajesh Sharma',
      date: getRelativeDateStr(1),
      timeSlot: '11:00 AM - 11:30 AM',
      status: 'scheduled',
      createdAt: getRelativeDateStr(-1),
    },
    {
      id: 'apt-5',
      patientId: patientsList[14].id,
      patientName: patientsList[14].name,
      doctorId: 'doc-6',
      doctorName: 'Dr. Ananya Iyer',
      date: getRelativeDateStr(1),
      timeSlot: '03:00 PM - 03:30 PM',
      status: 'scheduled',
      createdAt: getRelativeDateStr(0),
    },
    {
      id: 'apt-6',
      patientId: patientsList[15].id,
      patientName: patientsList[15].name,
      doctorId: 'doc-1',
      doctorName: 'Dr. Amit Verma',
      date: getRelativeDateStr(-1),
      timeSlot: '10:00 AM - 10:30 AM',
      status: 'completed',
      createdAt: getRelativeDateStr(-3),
    },
    {
      id: 'apt-7',
      patientId: patientsList[16].id,
      patientName: patientsList[16].name,
      doctorId: 'doc-5',
      doctorName: 'Dr. Vikram Sen',
      date: getRelativeDateStr(-1),
      timeSlot: '02:00 PM - 02:30 PM',
      status: 'cancelled',
      createdAt: getRelativeDateStr(-3),
    },
  ];

  // Seed initial consultations
  const initialConsultations: Consultation[] = [
    {
      id: 'cons-1',
      patientId: patientsList[0].id,
      patientName: patientsList[0].name,
      doctorId: 'doc-1',
      doctorName: 'Dr. Amit Verma',
      diagnosis: 'Coronary Artery Disease - Mild Angina',
      clinicalNotes: 'Complaining of brief fatigue during high-stress activities. Advised diet control and lower sodium intake. Heart sounds normal. Follow up in 3 weeks.',
      prescription: '1. Tab. Atorvastatin 20mg once at night\n2. Tab. Clopidogrel 75mg once daily after lunch\n3. Tab. Metoprolol 25mg twice daily',
      createdAt: getRelativeDateStr(-1) + 'T10:30:00Z',
    },
    {
      id: 'cons-2',
      patientId: patientsList[1].id,
      patientName: patientsList[1].name,
      doctorId: 'doc-4',
      doctorName: 'Dr. Sneha Patil',
      diagnosis: 'Type 2 Diabetes mellitus - Newly diagnosed',
      clinicalNotes: 'Raised HbA1c at 7.4. Symptoms of mild polyuria. Patient motivated to make lifestyle adjustments. Prescribed metformin.',
      prescription: '1. Tab. Metformin 500mg once daily with breakfast for 1 week, then escalate to twice daily\n2. Tab. Multivitamin once daily',
      createdAt: getRelativeDateStr(0) + 'T09:45:00Z',
    }
  ];

  const state: ClinicState = {
    patients: patientsList,
    doctors: DOCTORS,
    queue: initialQueue,
    appointments: initialAppointments,
    consultations: initialConsultations,
    session: null, // Initially logged out
  };

  saveState(state);
  return state;
}

export function saveState(state: ClinicState) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}
export { getInitialState };
