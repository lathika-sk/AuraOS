export type UserRole = 'admin' | 'doctor' | 'receptionist';

export interface UserSession {
  username: string;
  role: UserRole;
  name: string;
  doctorId?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  fee: number;
  avatar: string;
  availability: string;
  loadToday: number; // Patient count for the day
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  city: string;
  address: string;
  condition: string;
  procedure: string;
  cost: number;
  lengthOfStay: number; // in days
  readmissionFlag: boolean;
  outcome: 'Recovered' | 'Improved' | 'Stable' | 'Critical';
  satisfactionScore: number; // 1-5
}

export interface QueueItem {
  tokenNumber: number;
  patientId: string;
  patientName: string;
  assignedDoctorId: string;
  assignedDoctorName: string;
  status: 'Waiting' | 'In Progress' | 'Completed';
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  diagnosis: string;
  clinicalNotes: string;
  prescription: string; // drug list or notes
  createdAt: string;
}
