import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClinicState, getInitialState, saveState } from './store';
import { Patient, Doctor, QueueItem, Appointment, Consultation, UserRole, UserSession } from './types';
import { toast } from 'sonner';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  db, 
  doc, 
  setDoc, 
  onSnapshot 
} from './firebase';

interface ClinicContextType {
  state: ClinicState;
  login: (username: string, password: string, role: UserRole) => boolean;
  logout: () => void;
  signInWithGoogle: () => Promise<boolean>;
  addPatient: (patient: Omit<Patient, 'id' | 'satisfactionScore' | 'outcome'>) => void;
  updatePatient: (patient: Patient) => void;
  deletePatient: (id: string) => void;
  issueQueueToken: (patientId: string, doctorId: string) => void;
  callInToken: (tokenNumber: number) => void;
  completeToken: (tokenNumber: number) => void;
  bookAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => void;
  cancelAppointment: (id: string) => void;
  completeAppointment: (id: string) => void;
  addConsultation: (consultation: Omit<Consultation, 'id' | 'createdAt'>) => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ClinicState>(getInitialState);

  // 1. Real-time Firestore synchronization subscription when session is active
  useEffect(() => {
    if (!state.session) {
      return;
    }
    const userKey = state.session.username.replace(/[^a-zA-Z0-9]/g, '_');
    const docRef = doc(db, "clinic_states", userKey);
    
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const remoteData = snapshot.data();
        setState((prev) => {
          // Guard against infinite loop triggers by checking if deep fields indeed changed
          if (JSON.stringify(prev.patients) === JSON.stringify(remoteData.patients) &&
              JSON.stringify(prev.queue) === JSON.stringify(remoteData.queue) &&
              JSON.stringify(prev.appointments) === JSON.stringify(remoteData.appointments) &&
              JSON.stringify(prev.consultations) === JSON.stringify(remoteData.consultations)) {
            return prev;
          }
          return {
            ...prev,
            patients: remoteData.patients || prev.patients,
            queue: remoteData.queue || prev.queue,
            appointments: remoteData.appointments || prev.appointments,
            consultations: remoteData.consultations || prev.consultations,
          };
        });
      } else {
        // Document doesn't exist yet, seed it with the current client-side state
        setDoc(docRef, {
          patients: state.patients,
          queue: state.queue,
          appointments: state.appointments,
          consultations: state.consultations,
          updatedAt: new Date().toISOString()
        }).catch((err) => console.error("Initial Firestore seed failed:", err));
      }
    });

    return () => unsubscribe();
  }, [state.session?.username]);

  // 2. Debounced push modifications to Firestore as changes occur locally
  useEffect(() => {
    saveState(state);
    
    if (state.session) {
      const userKey = state.session.username.replace(/[^a-zA-Z0-9]/g, '_');
      const docRef = doc(db, "clinic_states", userKey);
      
      const timeoutId = setTimeout(() => {
        setDoc(docRef, {
          patients: state.patients,
          queue: state.queue,
          appointments: state.appointments,
          consultations: state.consultations,
          updatedAt: new Date().toISOString()
        }).catch((err) => console.error("Firestore automatic persist failed:", err));
      }, 600); // 600ms debouncing interval
      
      return () => clearTimeout(timeoutId);
    }
  }, [state.patients, state.queue, state.appointments, state.consultations]);

  const login = (username: string, password: string, role: UserRole): boolean => {
    // Standard credential check
    let authorized = false;
    let name = '';
    let doctorId: string | undefined = undefined;

    const lowerUser = username.trim().toLowerCase();

    if (role === 'admin' && lowerUser === 'admin' && password === 'admin@123') {
      authorized = true;
      name = 'Administrator (OS Support)';
    } else if (role === 'doctor' && lowerUser === 'doctor' && password === 'doc@123') {
      authorized = true;
      name = 'Dr. Amit Verma';
      doctorId = 'doc-1';
    } else if (role === 'receptionist' && lowerUser === 'staff' && password === 'staff@123') {
      authorized = true;
      name = 'Arya Sen (Front Desk)';
    }

    if (authorized) {
      const session: UserSession = { username: lowerUser, role, name, doctorId };
      setState((prev) => ({ ...prev, session }));
      toast.success(`Welcome back, ${name}! Session active.`);
      return true;
    } else {
      toast.error('Invalid credentials for selected role.');
      return false;
    }
  };

  const logout = () => {
    firebaseSignOut(auth).catch((c) => console.log(c));
    toast.info('Session ended. Authenticate to access Aura OS.');
    setState((prev) => ({ ...prev, session: null }));
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user) {
        toast.success(`Google verification successful: ${user.displayName}`);
        const session: UserSession = {
          username: user.email || 'google_user',
          role: 'admin',
          name: user.displayName || 'Authorized Admin Link',
        };
        setState((prev) => ({ ...prev, session }));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error(error);
      const isCancelled = error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user';
      if (!isCancelled) {
        toast.error(`Aura Identity Sign-in aborted: ${error.message}`);
      } else {
        toast.info('Google Identity sign-in cancelled.');
      }
      return false;
    }
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'satisfactionScore' | 'outcome'>) => {
    const newId = `pat-${state.patients.length + 1}`;
    const newPatient: Patient = {
      ...patientData,
      id: newId,
      satisfactionScore: 5,
      outcome: 'Stable',
    };

    setState((prev) => ({
      ...prev,
      patients: [newPatient, ...prev.patients],
    }));
    toast.success(`Patient record created for ${newPatient.name}`);
  };

  const updatePatient = (updatedPatient: Patient) => {
    setState((prev) => ({
      ...prev,
      patients: prev.patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p)),
    }));
    toast.success(`Patient profile updated for ${updatedPatient.name}`);
  };

  const deletePatient = (id: string) => {
    const patientName = state.patients.find((p) => p.id === id)?.name || 'Patient';
    setState((prev) => ({
      ...prev,
      patients: prev.patients.filter((p) => p.id !== id),
      queue: prev.queue.filter((q) => q.patientId !== id),
    }));
    toast.error(`Removed record of patient ${patientName}`);
  };

  const issueQueueToken = (patientId: string, doctorId: string) => {
    const patient = state.patients.find((p) => p.id === patientId);
    const doctor = state.doctors.find((d) => d.id === doctorId);

    if (!patient || !doctor) {
      toast.error('Incompatible patient or doctor identity data.');
      return;
    }

    // Check if patient is already active in queue (Waiting / In Progress)
    const isActive = state.queue.some(
      (q) => q.patientId === patientId && (q.status === 'Waiting' || q.status === 'In Progress')
    );
    if (isActive) {
      toast.error(`${patient.name} is already registered in the active queue.`);
      return;
    }

    // Generate token number (last token + 1, starts at 101)
    const nextToken = state.queue.length > 0 
      ? Math.max(...state.queue.map((q) => q.tokenNumber)) + 1 
      : 101;

    const newQueueItem: QueueItem = {
      tokenNumber: nextToken,
      patientId,
      patientName: patient.name,
      assignedDoctorId: doctorId,
      assignedDoctorName: doctor.name,
      status: 'Waiting',
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      queue: [...prev.queue, newQueueItem],
    }));
    toast.success(`Issued Token #${nextToken} for ${patient.name}`);
  };

  const callInToken = (tokenNumber: number) => {
    setState((prev) => {
      // Find patient name for toast
      const item = prev.queue.find((q) => q.tokenNumber === tokenNumber);
      if (item) {
        toast.info(`Token #${tokenNumber} (${item.patientName}) called in consultation.`);
      }
      return {
        ...prev,
        queue: prev.queue.map((q) =>
          q.tokenNumber === tokenNumber ? { ...q, status: 'In Progress' } : q
        ),
      };
    });
  };

  const completeToken = (tokenNumber: number) => {
    setState((prev) => {
      const item = prev.queue.find((q) => q.tokenNumber === tokenNumber);
      if (item) {
        toast.success(`Completed Token #${tokenNumber} medical session.`);
      }
      return {
        ...prev,
        queue: prev.queue.map((q) =>
          q.tokenNumber === tokenNumber ? { ...q, status: 'Completed' } : q
        ),
      };
    });
  };

  const bookAppointment = (appData: Omit<Appointment, 'id' | 'status' | 'createdAt'>) => {
    const newId = `apt-${state.appointments.length + 1}`;
    const newApt: Appointment = {
      ...appData,
      id: newId,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      appointments: [newApt, ...prev.appointments],
    }));
    toast.success(`Appointment booked with ${appData.doctorName} for ${appData.patientName}`);
  };

  const cancelAppointment = (id: string) => {
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) => (a.id === id ? { ...a, status: 'cancelled' as const } : a)),
    }));
    toast.error('Appointment has been cancelled.');
  };

  const completeAppointment = (id: string) => {
    setState((prev) => {
      const apt = prev.appointments.find((a) => a.id === id);
      if (apt) {
        toast.success(`Marked appointment with ${apt.doctorName} as completed.`);
      }
      return {
        ...prev,
        appointments: prev.appointments.map((a) => (a.id === id ? { ...a, status: 'completed' as const } : a)),
      };
    });
  };

  const addConsultation = (consData: Omit<Consultation, 'id' | 'createdAt'>) => {
    const newId = `cons-${state.consultations.length + 1}`;
    const newCons: Consultation = {
      ...consData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      consultations: [newCons, ...prev.consultations],
    }));
    toast.success(`Consultation saved for ${consData.patientName}`);
  };

  return (
    <ClinicContext.Provider
      value={{
        state,
        login,
        logout,
        signInWithGoogle,
        addPatient,
        updatePatient,
        deletePatient,
        issueQueueToken,
        callInToken,
        completeToken,
        bookAppointment,
        cancelAppointment,
        completeAppointment,
        addConsultation,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
