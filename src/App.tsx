import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './ClinicContext';
import { LanguageProvider } from './LanguageContext';
import { Toaster } from 'sonner';
import { LoginView } from './components/LoginView';
import { AppShell } from './components/AppShell';
import { AIHelperWidget } from './components/AIHelperWidget';
import { DashboardView } from './components/DashboardView';
import { PatientsView } from './components/PatientsView';
import { QueueView } from './components/QueueView';
import { AppointmentsView } from './components/AppointmentsView';
import { ConsultationView } from './components/ConsultationView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';

function AppContent() {
  const { state } = useClinic();
  const [activePage, setActivePage] = useState<'dashboard' | 'patients' | 'queue' | 'appointments' | 'consultation' | 'reports' | 'settings'>('dashboard');

  // If there's no active session, render the high fidelity Login View
  const renderContent = () => {
    if (!state.session) {
      return <LoginView onLoginSuccess={() => setActivePage('dashboard')} />;
    }

    // Else render standard pages inside the responsive persistent AppShell
    const renderActiveView = () => {
      switch (activePage) {
        case 'dashboard':
          return <DashboardView />;
        case 'patients':
          return <PatientsView />;
        case 'queue':
          return <QueueView />;
        case 'appointments':
          return <AppointmentsView />;
        case 'consultation':
          return <ConsultationView />;
        case 'reports':
          return <ReportsView />;
        case 'settings':
          return <SettingsView />;
        default:
          return <DashboardView />;
      }
    };

    return (
      <AppShell activePage={activePage} onPageChange={setActivePage}>
        {renderActiveView()}
      </AppShell>
    );
  };

  return (
    <>
      {renderContent()}
      <AIHelperWidget />
    </>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ClinicProvider>
        <Toaster 
          theme="dark" 
          position="top-right" 
          toastOptions={{
            style: {
              background: 'rgba(10, 16, 32, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f3f4f6',
              backdropFilter: 'blur(12px)',
            }
          }}
        />
        <AppContent />
      </ClinicProvider>
    </LanguageProvider>
  );
}

