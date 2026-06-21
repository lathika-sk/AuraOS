import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ta' | 'hi';

export interface Translations {
  [key: string]: {
    [locale in Language]: string;
  };
}

export const translations: Translations = {
  // Navigation
  dashboard: {
    en: 'Dashboard',
    ta: 'டாஷ்போர்டு',
    hi: 'डैशबोर्ड'
  },
  patients: {
    en: 'Patients',
    ta: 'நோயாளிகள்',
    hi: 'मरीज़'
  },
  queue: {
    en: 'Live Queue',
    ta: 'நேரடி வரிசை',
    hi: 'लाइव कतार'
  },
  appointments: {
    en: 'Appointments',
    ta: 'அப்பாயிண்ட்மெண்ட்',
    hi: 'नियुक्ति'
  },
  consultation: {
    en: 'Consultation',
    ta: 'ஆலோசனை',
    hi: 'परामर्श'
  },
  reports: {
    en: 'Reports & EMR',
    ta: 'அறிக்கைகள் & EMR',
    hi: 'रिपोर्ट और EMR'
  },
  settings: {
    en: 'Settings',
    ta: 'அமைப்புகள்',
    hi: 'सेटिंग्स'
  },
  logoutBtn: {
    en: 'End Active Session',
    ta: 'அமர்வை முடிக்கவும்',
    hi: 'सत्र समाप्त करें'
  },
  mobileLogoutBtn: {
    en: 'End Active Shift',
    ta: 'பணியை முடிக்கவும்',
    hi: 'शिफ्ट समाप्त करें'
  },

  // Login Screen
  systemGateway: {
    en: 'System Gateway',
    ta: 'கணினி நுழைவாயில்',
    hi: 'सिस्टम गेटवे'
  },
  clearanceSub: {
    en: 'Select authority clearance tier to gain access',
    ta: 'அணுகலைப் பெற தகுதி தரத்தைத் தேர்ந்தெடுக்கவும்',
    hi: 'पहुंच प्राप्त करने के लिए अधिकार स्तर चुनें'
  },
  clearanceTier: {
    en: 'Clearance Tier',
    ta: 'அனுமதி அடுக்கு',
    hi: 'निकासी स्तर'
  },
  adminRole: {
    en: 'Admin',
    ta: 'அட்மின்',
    hi: 'एडमिन'
  },
  fullAccess: {
    en: 'Full Access',
    ta: 'முழு அணுகல்',
    hi: 'पूर्ण पहुंच'
  },
  doctorRole: {
    en: 'Doctor',
    ta: 'மருத்துவர்',
    hi: 'डॉक्टर'
  },
  clinicalAccess: {
    en: 'Clinical',
    ta: 'மருத்துவத் துறை',
    hi: 'क्लिनिकल'
  },
  staffRole: {
    en: 'Staff',
    ta: 'ஊழியர்கள்',
    hi: 'कर्मचारी'
  },
  frontDeskPanel: {
    en: 'Front Desk',
    ta: 'முன்பதிவு மேசை',
    hi: 'फ़्रंट डेस्क'
  },
  operatorIdent: {
    en: 'Operator Ident (Username)',
    ta: 'இயக்குவர் பெயர் (பயனர் பெயர்)',
    hi: 'ऑपरेटर पहचान (यूज़रनेम)'
  },
  enterCredentialName: {
    en: 'Enter credential name',
    ta: 'பயனர் பெயரை உள்ளிடவும்',
    hi: 'क्रेडेंशियल नाम दर्ज करें'
  },
  decryptionCipher: {
    en: 'Decryption Cipher (Password)',
    ta: 'கடவுச்சொல் (பாஸ்வேர்ட்)',
    hi: 'डिक्रिप्शन पासवर्ड'
  },
  rememberConsole: {
    en: 'Remember console',
    ta: 'கணினியை நினைவில் கொள்க',
    hi: 'कंसोल याद रखें'
  },
  useDemoCreds: {
    en: 'Use demo credentials',
    ta: 'மாதிரி சான்றுகளைப் பயன்படுத்தவும்',
    hi: 'डेमो क्रेडेंशियल का उपयोग करें'
  },
  requestAccessBtn: {
    en: 'Request Access',
    ta: 'அணுகல் கோரிக்கை',
    hi: 'पहुंच का अनुरोध करें'
  },
  orSignInSocial: {
    en: 'OR SIGN IN WITH SECURE SOCIAL CLOUD',
    ta: 'அல்லது பாதுகாப்பான கூகிள் மூலம் உள்நுழையவும்',
    hi: 'या सुरक्षित सामाजिक क्लाउड से साइन इन करें'
  },
  secureGoogleAuth: {
    en: 'Aura Secure Google Auth',
    ta: 'பாதுகாப்பான கூகிள் உள்நுழைவு',
    hi: 'Aura सुरक्षित Google प्रमाणीकरण'
  },
  authorizedUsersOnly: {
    en: 'AUTHORIZED COGNIZANT USERS ONLY',
    ta: 'அங்கீகரிக்கப்பட்ட பயனர்கள் மட்டும்',
    hi: 'केवल अधिकृत उपयोगकर्ताओं के लिए'
  },
  clearanceKeysHint: {
    en: 'Clearance keys for instant preview:',
    ta: 'உடனடி அணுகலுக்கான கடவுச்சொற்கள்:',
    hi: 'तत्काल पूर्वावलोकन के लिए क्रेडेंशियल:'
  },

  // Dashboard Overview
  clinicOverviewTitle: {
    en: 'Aura Clinic Overview Dashboard',
    ta: 'ஆரா கிளினிக் டாஷ்போர்டு கண்ணோட்டம்',
    hi: 'ऑरा क्लिनिक मुख्य डैशबोर्ड'
  },
  terminalIdent: {
    en: 'TERMINAL IND-METROPOLIS-01',
    ta: 'முனையகம் IND-METROPOLIS-01',
    hi: 'टर्मिनल IND-METROPOLIS-01'
  },
  operatorRoleLabel: {
    en: 'OPERATOR ROLE:',
    ta: 'பணி நிலை:',
    hi: 'ऑपरेटर की भूमिका:'
  },
  totalCaseload: {
    en: 'Total Caseload',
    ta: 'மொத்த நோயாளிகள்',
    hi: 'कुल मरीज़ सूची'
  },
  waitingQueue: {
    en: 'Waiting in Queue',
    ta: 'வரிசையில் காத்திருப்போர்',
    hi: 'कतार में प्रतीक्षारत'
  },
  completedTreatments: {
    en: 'Completed Treatments',
    ta: 'சிகிச்சை முடிந்தோர்',
    hi: 'पूर्ण किए गए उपचार'
  },
  activeSpecialist: {
    en: 'Active Specialist',
    ta: 'செயலில் உள்ள மருத்துவர்',
    hi: 'सक्रिय विशेषज्ञ'
  },
  todaysQueueSummary: {
    en: "Today's Queue Overview",
    ta: 'இன்றைய வரிசை நிலவரம்',
    hi: 'आज की कतार स्थिति का विवरण'
  },
  recentSystemLogs: {
    en: 'System Transaction Logs',
    ta: 'கணினி செயல்பாட்டு பதிவுகள்',
    hi: 'सिस्टम गतिविधि लॉग'
  },
  metricSomaticStability: {
    en: 'Somatic Stability Index',
    ta: 'உடல் நிலைத்தன்மை குறியீடு',
    hi: 'दैहिक स्थिरता सूचकांक'
  },
  patientSatisfactionLabel: {
    en: 'Patient Satisfaction Rating',
    ta: 'நோயாளி திருப்தி மதிப்பீடு',
    hi: 'मरीज़ संतुष्टि रेटिंग'
  },

  // Patients View
  patientDossierTitle: {
    en: 'Centralized Patient Dossier & Roster',
    ta: 'நோயாளிகளின் மத்திய பதிவேடு',
    hi: 'केंद्रीय चिकित्सा मरीज़ रजिस्टर'
  },
  registerNewPatientBtn: {
    en: 'Register New Patient',
    ta: 'புதிய நோயாளியைப் பதிவுசெய்',
    hi: 'नया मरीज़ पंजीकृत करें'
  },
  patientNameLabel: {
    en: 'Full Register Name',
    ta: 'முழு பெயர்',
    hi: 'मरीज़ का पूरा नाम'
  },
  patientAgeLabel: {
    en: 'Age',
    ta: 'வயது',
    hi: 'उम्र'
  },
  patientGenderLabel: {
    en: 'Gender',
    ta: 'பாலினம்',
    hi: 'लिंग'
  },
  patientPhoneLabel: {
    en: 'Contact Handset',
    ta: 'தொலைபேசி எண்',
    hi: 'मोबाइल फ़ोन'
  },
  patientCityLabel: {
    en: 'Registered City',
    ta: 'பதிவுசெய்யப்பட்ட நகரம்',
    hi: 'पंजीकृत शहर'
  },
  patientAddressLabel: {
    en: 'Home Address',
    ta: 'முகவரி',
    hi: 'घर का पता'
  },
  diagnosedConditionLabel: {
    en: 'Enrolled Diagnostics',
    ta: 'நோயறிதல்',
    hi: 'नामांकित निदान'
  },
  medicalProcedureLabel: {
    en: 'Enrolled Procedure',
    ta: 'சிகிச்சை முறை',
    hi: 'नामांकित प्रक्रिया'
  },
  treatmentCostLabel: {
    en: 'Treatment Cost Value',
    ta: 'சிகிச்சை கட்டணம்',
    hi: 'उपचार लागत मूल्य'
  },
  cancelBtn: {
    en: 'Cancel',
    ta: 'ரத்து செய்',
    hi: 'रद्द करें'
  },
  saveRecordBtn: {
    en: 'Save Medical Record',
    ta: 'மருத்துவப் பதிவைச் சேமி',
    hi: 'मेडिकल रिकॉर्ड सहेजें'
  },
  searchPlaceholder: {
    en: 'Search patients by name, diagnostic card or procedural key...',
    ta: 'பெயர், நோய் அல்லது சிகிச்சை மூலம் தேடவும்...',
    hi: 'नाम, निदान या उपचार द्वारा मरीज़ खोजें...'
  },
  genderMale: {
    en: 'Male',
    ta: 'ஆண்',
    hi: 'पुरुष'
  },
  genderFemale: {
    en: 'Female',
    ta: 'பெண்',
    hi: 'महिला'
  },
  genderOther: {
    en: 'Other',
    ta: 'மற்றவை',
    hi: 'अन्य'
  },

  // Live Queue
  queueManagementTitle: {
    en: 'Live Queue Management Engine',
    ta: 'நேரடி வரிசை மேலாண்மை இயந்திரம்',
    hi: 'लाइव कतार प्रबंधन इंजन'
  },
  enqueuePatientBtn: {
    en: 'Enqueue Registered Patient',
    ta: 'நோயாளியை வரிசையில் சேர்க்கவும்',
    hi: 'मरीज़ को कतार में जोड़ें'
  },
  tokenHeader: {
    en: 'Token ID',
    ta: 'டோக்கன்',
    hi: 'टोकन आईडी'
  },
  severityHeader: {
    en: 'Severity',
    ta: 'தீவிரம்',
    hi: 'गंभीरता'
  },
  statusHeader: {
    en: 'Status',
    ta: 'நிலை',
    hi: 'स्थिति'
  },
  practitionerHeader: {
    en: 'Practitioner',
    ta: 'மருத்துவர்',
    hi: 'चिकित्सक'
  },
  actionsHeader: {
    en: 'Actions',
    ta: 'செயல்கள்',
    hi: 'कार्रवाई'
  },
  callNextPatientBtn: {
    en: 'Call Next Patient',
    ta: 'அடுத்த நோயாளியை அழைக்கவும்',
    hi: 'अगले मरीज़ को बुलाएं'
  },
  updateStatusDocBtn: {
    en: 'Update Status',
    ta: 'நிலையை மாற்று',
    hi: 'स्थिति अपडेट करें'
  },

  // Appointments
  appointmentsSchedulerTitle: {
    en: 'Clinical Appointment Scheduler',
    ta: 'மருத்துவ அமுலாக்க முன்பதிவு',
    hi: 'क्लिनिकल नियुक्ति अनुसूचक'
  },
  scheduleNewTitle: {
    en: 'Schedule Booking',
    ta: 'சந்திப்பு முன்பதிவு',
    hi: 'नई नियुक्ति बुक करें'
  },
  selectDepartmentLabel: {
    en: 'Select Department',
    ta: 'துறையைத் தேர்ந்தெடுக்கவும்',
    hi: 'विभाग का चयन करें'
  },
  dateTimeLabel: {
    en: 'Date and Time Slot',
    ta: 'தேதி மற்றும் நேரம்',
    hi: 'तारीख और समय स्लॉट'
  },
  bookSlotBtn: {
    en: 'Confirm Diagnostic Slot',
    ta: 'முன்பதிவை உறுதிசெய்',
    hi: 'अपॉइंटमेंट स्लॉट की पुष्टि करें'
  },

  // Consultation Console
  consultationConsoleTitle: {
    en: 'Clinical Consultation Console',
    ta: 'ஆலோசனை மற்றும் மருந்து ஏடு',
    hi: 'क्लिनिकल परामर्श कंसोल'
  },
  consultationSub: {
    en: 'Diagnose and submit prescription formulas for patients currently called to service chambers',
    ta: 'மருத்துவ அறையில் இருக்கும் நோயாளிகளை ஆராய்ந்து மருந்துகளைப் பதிவு செய்யவும்',
    hi: 'वर्तमान में प्रतीक्षारत मरीज़ को देखकर पर्चा और निदान दर्ज करें'
  },
  clinicalPrescriptionNotes: {
    en: 'Clinical Consultation Notes',
    ta: 'மருத்துவ ஆலோசனைக் குறிப்புகள்',
    hi: 'क्लिनिकल परामर्श नोट'
  },
  prescriptionLabel: {
    en: 'Rx Prescription Formulation',
    ta: 'பரிந்துரைக்கப்படும் மருந்துகள் (Rx)',
    hi: 'चिकित्सीय पर्चा फॉर्मूलेशन (Rx)'
  },
  submitConsultationBtn: {
    en: 'Submit Certified Consultation',
    ta: 'ஆலோசனையை அங்கீகரித்து சமர்ப்பிக்கவும்',
    hi: 'प्रमाणित परामर्श सबमिट करें'
  },

  // Reports
  certifiedEMRTitle: {
    en: 'Certified EMR Reports & Financial Clearance',
    ta: 'சான்றளிக்கப்பட்ட EMR அறிக்கைகள் & கட்டணத் தீர்வு',
    hi: 'प्रमाणित EMR रिपोर्ट और वित्तीय निकासी'
  },
  emrReportsSub: {
    en: 'Generate legal, secure cryptographic PDF transcripts and global clinic analytics.',
    ta: 'உத்தியோகபூர்வ மருத்துவ EMR அறிக்கைகள் மற்றும் சான்றிதழ்களை PDF முறையில் பெறவும்.',
    hi: 'आधिकारिक कानूनी चिकित्सा रिपोर्ट और वित्तीय रिकॉर्ड पीडीएफ के रूप में डाउनलोड करें।'
  },
  selectRosterDropdown: {
    en: 'Select Patient from Roster',
    ta: 'நோயாளிகள் பட்டியலிலிருந்து தேர்ந்தெடுக்கவும்',
    hi: 'मरीज़ रजिस्टर से चयन करें'
  },
  emrDossierReportBtn: {
    en: 'Download EMR Dossier PDF',
    ta: 'EMR ஆவணத்தை பதிவிறக்கு (PDF)',
    hi: 'मरीज़ EMR पीडीएफ डाउनलोड करें'
  },
  compileClinicDirectoryBtn: {
    en: 'Compile Clinic Directory PDF',
    ta: 'கிளினிக் பதிவேட்டை பதிவிறக்கு (PDF)',
    hi: 'क्लिनिक डायरेक्टरी रिपोर्ट डाउनलोड करें'
  },

  // Settings
  systemAdminSettingsTitle: {
    en: 'System Administrative & Settings Profile',
    ta: 'கணினி நிர்வாகம் மற்றும் அமைப்புகள்',
    hi: 'सिस्टम प्रशासनिक और सेटिंग्स प्रोफ़ाइल'
  },
  clinicDetailsCategory: {
    en: 'Clinic Details Configuration',
    ta: 'கிளினிக் விவரங்கள் வடிவமைப்பு',
    hi: 'क्लिनिक विवरण विन्यास'
  },
  practitionersRoster: {
    en: 'Registered Active Practitioners List',
    ta: 'பதிவுசெய்யப்பட்ட செயலில் உள்ள மருத்துவர்கள்',
    hi: 'पंजीकृत सक्रिय चिकित्सकों की सूची'
  },
  addPractitionerBtn: {
    en: 'Add Medical Practitioner',
    ta: 'மருத்துவரைச் சேர்க்கவும்',
    hi: 'नया चिकित्सक जोड़ें'
  }
};

interface LanguageContextProps {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Language>(() => {
    const saved = localStorage.getItem('aura_locale');
    if (saved === 'ta' || saved === 'hi' || saved === 'en') {
      return saved as Language;
    }
    return 'en';
  });

  const setLocale = (lang: Language) => {
    setLocaleState(lang);
    localStorage.setItem('aura_locale', lang);
  };

  useEffect(() => {
    // Dynamic html attribute updating
    document.documentElement.setAttribute('lang', locale);
    
    // Apply appropriate class names dynamically for Noto fonts if desired
    if (locale === 'ta') {
      document.body.style.fontFamily = '"Noto Sans Tamil", "Inter", sans-serif';
    } else if (locale === 'hi') {
      document.body.style.fontFamily = '"Noto Sans Devanagari", "Inter", sans-serif';
    } else {
      document.body.style.fontFamily = '"Inter", sans-serif';
    }
  }, [locale]);

  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][locale];
    }
    // Fallback if key missing
    return key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
