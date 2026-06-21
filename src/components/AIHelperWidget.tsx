import React, { useState, useEffect } from 'react';
import { useTranslation, Language } from '../LanguageContext';
import { 
  Sparkles, 
  X, 
  Send, 
  HelpCircle, 
  BookOpen, 
  Clock, 
  Compass, 
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FAQItem {
  id: string;
  category: 'booking' | 'queue' | 'reports' | 'general';
  question: { [lang in Language]: string };
  answer: { [lang in Language]: string };
}

const faqData: FAQItem[] = [
  {
    id: 'appt',
    category: 'booking',
    question: {
      en: 'How do I book a doctor appointment?',
      ta: 'அப்பாயிண்ட்மெண்ட் மருத்துவரிடம் பதிவு செய்வது எப்படி?',
      hi: 'डॉक्टर अपॉइंटमेंट कैसे बुक करें?'
    },
    answer: {
      en: '📊 Click on the "Appointments" tab in the sidebar. Choose the patient name from the dropdown, select the respective medical department, specify your preferred date and time slot, then click the "Confirm Diagnostic Slot" button to book instantly.',
      ta: '📊 பக்கவாட்டு பாரில் உள்ள "Appointments" பக்கத்திற்குச் செல்லவும். நோயாளியின் பெயரைத் தேர்ந்தெடுத்து, மருத்துவத் துறையைத் தேர்வு செய்யவும். தங்களுக்குத் தேவையான தேதி மற்றும் நேரத்தை அமைத்து "முன்பதிவை உறுதிசெய்" என்பதை அழுத்தவும்.',
      hi: '📊 साइडबार में "Appointments" (नियुक्ति) विकल्प चुनें। मरीज़ का नाम और विभाग चुनें, अपनी मनचाही तारीख और समय चुनें, और फिर "अपॉइंटमेंट स्लॉट की पुष्टि करें" बटन पर क्लिक करके स्लॉट सुरक्षित करें।'
    }
  },
  {
    id: 'queue_pos',
    category: 'queue',
    question: {
      en: 'How do I check my queue token number?',
      ta: 'என் வரிசை முறை மற்றும் டோக்கன் எண்ணை எங்கு காண்பது?',
      hi: 'मुझे अपना टोकन नंबर और कतार स्थिति कहाँ मिलेगी?'
    },
    answer: {
      en: '🕒 Go to the "Live Queue" screen. When a patient is added to the system, they are immediately assigned a unique Token ID (e.g. pat-19). The active queue cards update in real-time, showing whether a patient is currently Waiting, In Progress, or Completed.',
      ta: '🕒 நேரலை "Live Queue" (வரிசை முறை) பக்கத்திற்குச் செல்லவும். நோயாளி சேர்க்கப்பட்டவுடன் அவருக்கு டோக்கன் எண் வழங்கப்படும். தற்போதைய நிலையை (Waiting / In Progress / Completed) திரையில் நேரடி வண்ணப் புள்ளிகள் மூலம் எளிதாகக் காணலாம்.',
      hi: '🕒 "Live Queue" (लाइव कतार) पेज पर जाएं। जब किसी मरीज़ को शामिल किया जाता है, तो उसे एक नया टोकन नंबर जारी होता है। आप कतार में मरीज़ की वर्तमान स्थिति को वास्तविक समय में (Waiting, In Progress, या Completed) देख सकते हैं।'
    }
  },
  {
    id: 'rx_notes',
    category: 'reports',
    question: {
      en: 'How do I edit or write prescription consultation notes?',
      ta: 'மருந்து சீட்டு மற்றும் மருத்துவக் குறிப்புகள் எழுதுவது எப்படி?',
      hi: 'दवा पर्ची और परामर्श नोट कैसे लिखें?'
    },
    answer: {
      en: '🩺 The "Consultations" page allows clinical doctors to write prescription details. Select a patient from the queue dropdown, type out clinical parameters in the Notes section, add prescription formulas in the Rx Prescription block, and click "Submit Certified Consultation".',
      ta: '🩺 "Consultations" பக்கத்தில் மருத்துவர் மருந்துச் சீட்டுகளை எழுதலாம். வரிசையிலிருந்து நோயாளியைத் தேர்வு செய்து, அவரது நோய் ஆவணக் குறிப்புகளை சமர்ப்பித்து, பரிந்துரைக்கப்படும் மருந்துகளை (Rx) எழுதி "Submit Certified Consultation" என்பதை அழுத்தவும்.',
      hi: '🩺 "Consultations" (परामर्श) पेज डॉक्टरों को परामर्श नोट लिखने की सुविधा देता है। कतार से मरीज़ का चयन करें, आवश्यक विवरण दर्ज करें, दवाइयों की सूची लिखें और फिर "प्रमाणित परामर्श सबमिट करें" पर क्लिक करें।'
    }
  },
  {
    id: 'emr_pdf',
    category: 'reports',
    question: {
      en: 'How do I download a patient billing/EMR report PDF?',
      ta: 'பில்லிங் மற்றும் மருத்துவ அறிக்கையை PDF கோப்பாக பதிவிறக்குவது எப்படி?',
      hi: 'मरीज़ का चिकित्सा रिकॉर्ड (EMR PDF) कैसे डाउनलोड करें?'
    },
    answer: {
      en: '📄 Open the "Reports & EMR" tab. Inside, pick a patient from the authorized register dropdown list. Click on "Download EMR Dossier PDF" to generate a legal, high-contrast PDF document with synchronized billing invoice items and a medical ledger verification seal.',
      ta: '📄 "Reports & EMR" பகுதிக்குச் செல்லவும். அங்கிருக்கும் பட்டியலில் இருந்து நோயாளியின் பெயரைத் தேர்ந்தெடுத்து "Download EMR Dossier PDF" என்பதை அழுத்தவும். உங்களது பரிசோதனைகள் மற்றும் கட்டண விபரங்கள் அடங்கிய சான்றளிக்கப்பட்ட PDF கோப்பு பதிவிறக்கமாகும்.',
      hi: '📄 "Reports & EMR" (रिपोर्ट) सेक्शन खोलें। वहां सूची से वांछित मरीज़ का चयन करें और "मरीज़ EMR पीडीएफ डाउनलोड करें" बटन पर क्लिक करें। संपूर्ण चिकित्सा लॉग और शुल्क विवरण वाली पीडीएफ फाइल डाउनलोड हो जाएगी।'
    }
  },
  {
    id: 'add_patient',
    category: 'booking',
    question: {
      en: 'Where do I add new patient registry records?',
      ta: 'புதிய நோயாளி விபரங்களை எங்கு பதிவு செய்வது?',
      hi: 'नए मरीज का विवरण और रिकॉर्ड कहाँ दर्ज करें?'
    },
    answer: {
      en: '👥 Navigate to the "Patients" page. Click the "Register New Patient" button in the tab. Fill out their profile information (Name, Age, gender, Contact phone, and treatment cost), then click "Save Medical Record" to commit.',
      ta: '👥 "Patients" பக்கத்திற்குச் செல்லவும். அங்குள்ள "Register New Patient" பட்டனை கிளிக் செய்க. பெயர், வயது, பாலினம், தொலைபேசி மற்றும் முகவரியைப் பதிவுசெய்து "மருத்துவப் பதிவைச் சேமி" என்பதை அழுத்தவும்.',
      hi: '👥 इसके लिए "मरीज़" (Patients) पेज पर जाएं। "नया मरीज़ पंजीकृत करें" नामक नीले बटन पर क्लिक करें, मरीज़ का विवरण दर्ज करें और अंत में "मेडिकल रिकॉर्ड सहेजें" बटन दबाएं।'
    }
  },
  {
    id: 'google_signin_issue',
    category: 'general',
    question: {
      en: 'How do I use Google login on Aura OS?',
      ta: 'கூகிள் பாதுகாப்பு உள்நுழைவை எவ்வாறு பயன்படுத்துவது?',
      hi: 'गूगल लॉग इन (Google Login) का उपयोग कैसे करें?'
    },
    answer: {
      en: '🔑 On the login panel, scroll down below the password box. Click on the "Aura Secure Google Auth" social login button. A popup safe auth dialog opens, allowing you to access the dashboard with your Google email credentials instantly.',
      ta: '🔑 உள்நுழைவு பக்கத்தில் கடவுச்சொல் பெட்டிக்குக் கீழே உள்ள "Aura Secure Google Auth" பட்டனை அழுத்தவும். ஒரு புதிய பாதுகாப்பு பாப் அப் செயலி திறந்து, உங்களது கூகிள் மின்அஞ்சல் மூலம் விரைவாக உள்நுழைய உதவும்.',
      hi: '🔑 लॉगिन पेज पर क्रेडेंशियल फॉर्म के नीचे बने "AURA सुरक्षित Google प्रमाणीकरण" बटन पर क्लिक करें। एक सुरक्षित पॉपअप खुलेगा, जिसमें अपनी गूगल आईडी से क्लिक करके आप तुरंत डैशबोर्ड पर पहुंच सकते हैं।'
    }
  },
  {
    id: 'is_real_ai',
    category: 'general',
    question: {
      en: 'Is this assistant a live AI neural network?',
      ta: 'இது செயற்கை நுண்ணறிவா அல்லது தானியங்கி உதவியாளரா?',
      hi: 'क्या यह सहायक असली एआई है या केवल ऑटो-अनुक्रिया?'
    },
    answer: {
      en: '🤖 Yes, I am optimized as a hybrid local clinical guide. Because of active safety controls and cloud token quotas, I function directly within the local browser sandbox in English, Tamil, and Hindi to guide you securely without data exposure or internet lag.',
      ta: '🤖 ஆம், நான் உங்களது ஆரா கிளினிக் அதிநவீன வழிகாட்டி ஆவேன். உங்களது தரவுகளைப் பாதுகாப்பாக வைத்திருக்கவும், தடையின்றி இயங்கவும் தமிழ், ஆங்கிலம், மற்றும் ஹிந்தியில் வடிவமைக்கப்பட்ட தானியங்கி பாதுகாப்பு உதவியாளர் நான்.',
      hi: '🤖 जी हाँ, मैं ऑरा क्लीनिक का समर्पित एकीकृत लोकल गाइड हूँ। अस्पताल की सुरक्षा और टोकन व्यवस्थाओं को ध्यान में रखते हुए, आपकी संपूर्ण गोपनीयता सुदृढ़ करने हेतु मैं सीधे ब्राउज़र सैंडबॉक्स में आपकी स्थानीय भाषा में सेवा प्रदान करता हूँ।'
    }
  },
  {
    id: 'clinic_dir_pdf',
    category: 'reports',
    question: {
      en: 'How do I download the entire active patients directory list?',
      ta: 'பதிவுசெய்யப்பட்ட மொத்த நோயாளிகள் பட்டியலை எடுக்க முடியுமா?',
      hi: 'सक्रिय रोगियों की पूरी सूची एक बार में कैसे निकालें?'
    },
    answer: {
      en: '📋 Yes. Go to the "Reports & EMR" screen and click "Compile Clinic Directory PDF". It will compile the full, comprehensive clinic register containing all logged profiles and saved billing metadata into a clean table structure.',
      ta: '📋 ஆம். "Reports & EMR" பக்கத்திற்குச் சென்று "Compile Clinic Directory PDF" என்பதை அழுத்தவும். கிளினிக்கில் உள்ள அனைத்து நோயாளிகளின் பெயர், டோக்கன், மற்றும் கட்டணத் தகவல்கள் அடங்கிய விரிவான அறிக்கை பதிவிறக்கமாகும்.',
      hi: '📋 बिल्कुल। "रिपोर्ट और EMR" पेज खोलें और "क्लिनिक डायरेक्टरी रिपोर्ट डाउनलोड करें" बटन पर क्लिक करें। अस्पताल में पंजीकृत सभी मरीज़ों का पूरा डेटा तालिका के रूप में सीधे डाउनलोड हो जाएगा।'
    }
  },
  {
    id: 'add_dr_staff',
    category: 'general',
    question: {
      en: 'How can we add doctors/staff or setup specialties?',
      ta: 'கிளினிக் மருத்துவர்கள் மற்றும் ஊழியர்களை எவ்வாறு திருத்துவது?',
      hi: 'अस्पताल के विशेष डॉक्टरों और स्टाफ को कैसे प्रबंधित करें?'
    },
    answer: {
      en: '⚙️ Go to the "Settings" page in the navigation sidebar. You will find sections to update Clinic details, view registered Practitioners, and click "Add Medical Practitioner" to add new active clinical specialized personnel.',
      ta: '⚙️ மெனுவில் உள்ள "Settings" (அமைப்புகள்) பக்கத்திற்குச் செல்லவும். அங்கு மருத்துவமனையின் விபரங்களை மாற்றலாம், மேலும் "Add Medical Practitioner" மூலம் புதிய மருத்துவர்களின் விபரங்களைப் பதிவேற்றலாம்.',
      hi: '⚙️ अस्पताल के विशेष डॉक्टरों और नियुक्तियों के प्रबंधन हेतु "Settings" (सेटिंग्स) साइडबार खोलें। वहां "नया चिकित्सक जोड़ें" विकल्प से डॉक्टरों की प्रोफाइल एवं उनकी विशेषता जोड़ें।'
    }
  }
];

export const AIHelperWidget: React.FC = () => {
  const { locale, setLocale, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai', text: string }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'faq' | 'chat'>('faq');
  const [chatInput, setChatInput] = useState('');

  // Initial greeting based on language
  useEffect(() => {
    const greetings = {
      en: "👋 Hello! I am your Aura Companion. How can I help you navigate the clinic application today? Below are verified rapid guides in your language.",
      ta: "👋 வணக்கம்! நான் உங்களது ஆரா கிளினிக் உதவியாளர். இன்று தங்களுக்கு நான் எவ்வாறு உதவ முடியும்? தங்களுக்குத் தேவையான எளிய வழிகாட்டிகள் தமிழ் மொழியில் கீழே உள்ளன.",
      hi: "👋 नमस्कार! मैं आपका ऑरा क्लीनिक डिजिटल सहायक हूँ। आज मैं एप्लिकेशन का उपयोग करने में आपकी किस प्रकार सहायता कर सकता हूँ? विभिन्न उपयोगी गाइड नीचे उपलब्ध हैं।"
    };
    
    setMessages([
      { sender: 'ai', text: greetings[locale] }
    ]);
  }, [locale]);

  const handleSelectFAQ = (item: FAQItem) => {
    // Add user message with FAQ question
    const userMsg = item.question[locale];
    const aiAnswer = item.answer[locale];

    setMessages(prev => [
      ...prev,
      { sender: 'user', text: userMsg },
      { sender: 'ai', text: aiAnswer }
    ]);
    
    setActiveTab('chat');
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const query = chatInput.toLowerCase().trim();
    setChatInput('');
    
    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text: query }]);

    // Check pre-written responses using smart keyword matching
    setTimeout(() => {
      let matchedAns = '';
      
      const keywords: { [key: string]: string[] } = {
        appt: ['appointment', 'book', 'slot', 'முன்பதிவு', 'பதிவு', 'அப்பாயிண்ட்', 'अपॉइंटमेंट', 'नियुक्ति', 'बुक'],
        queue_pos: ['queue', 'token', 'number', 'waiting', 'டோக்கன்', 'வரிசை', 'டொகன்', 'कतार', 'टोकन', 'वेटिंग'],
        rx_notes: ['consultation', 'prescription', 'notes', 'rx', 'ஆலோசனை', 'மருந்து', 'பரிந்துரை', 'परामर्श', 'दवा', 'पर्चा'],
        emr_pdf: ['pdf', 'report', 'billing', 'download', 'bill', 'கட்டணம்', 'அறிக்கை', 'பில்லிங்', 'பதிவிறக்கு', 'डाउनलोड', 'बिल', 'रिपोर्ट', 'पीडीएफ'],
        add_patient: ['patient', 'register', 'add', 'நோயாளிகள்', 'நோயாளி', 'மரிழ்', 'पंजीकृत', 'मरीज', 'जोड़ें'],
        google: ['google', 'login', 'popup', 'auth', 'கூகிள்', 'உள்நுழை', 'गूगल', 'लॉगिन', 'पासवर्ड'],
        is_real_ai: ['real', 'ai', 'script', 'உண்மையாக', 'உதவி', 'एआई', 'असली', 'मदद'],
        add_dr_staff: ['doctor', 'staff', 'practitioner', 'specialty', 'Settings', 'அமைப்புகள்', 'மருத்துவர்', 'செட்டிங்ஸ்', 'सेटिंग्स', 'डॉक्टर', 'कर्मचारी']
      };

      let bestMatch: FAQItem | null = null;
      for (const faq of faqData) {
        const faqid = faq.id;
        const matches = keywords[faqid] || [];
        const isMatch = matches.some(kw => query.includes(kw));
        if (isMatch) {
          bestMatch = faq;
          break;
        }
      }

      if (bestMatch) {
        matchedAns = bestMatch.answer[locale];
      } else {
        // Fallback reassuring answer
        const fallback = {
          en: `I heard you, but my programmed local registry cannot find an exact match for "${query}". Try clicking the 'Rapid Guides' panel for step-by-step walkthroughs of our clinical dashboard, Appointments, or Patient Reports. All hospital staff is standing by to help!`,
          ta: `வணக்கம்! நீங்கள் குறிப்பிட்ட "${query}" என்பதற்கான சரியான தகவல் கிடைக்கவில்லை. எளிய வழிமுறைகளுக்கு கீழே உள்ள 'வழிகாட்டிகள்' மெனுவைத் தேர்ந்தெடுங்கள் அல்லது எங்கள் மருத்துவமனை நிர்வாக உதவியாளரைத் தொடர்பு கொள்ளவும். நாங்கள் உங்களுக்கு உதவக் காத்திருக்கிறோம்!`,
          hi: `नमस्ते! आपके प्रश्न "${query}" से मेल खाता हुआ विवरण अभी नहीं मिला। कृपया सरल गाइड के लिए 'वयावहारिक मार्गदर्शिका' पर क्लिक करें या क्लिनिक काउंटर पर संपर्क करें। हम सहायता के लिए तैयार हैं!`
        };
        matchedAns = fallback[locale];
      }

      setMessages(prev => [...prev, { sender: 'ai', text: matchedAns }]);
    }, 400);
  };

  const filteredFAQ = faqData.filter(faq => {
    const q = faq.question[locale].toLowerCase();
    const a = faq.answer[locale].toLowerCase();
    const s = searchQuery.toLowerCase();
    return q.includes(s) || a.includes(s);
  });

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans" id="multilingual-ai-assistant">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            layoutId="helper-bubble"
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-emerald-500/90 via-cyan-500/90 to-blue-500/95 text-white flex items-center justify-center p-3 sm:p-4 rounded-full shadow-[0_8px_30px_rgba(0,180,216,0.35)] hover:scale-105 hover:rotate-2 transition-all duration-300 outline-none select-none cursor-pointer border border-white/10"
            id="assistant-open-btn"
            style={{ width: '56px', height: '56px' }}
          >
            <Sparkles className="w-6 h-6 animate-pulse text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="helper-bubble"
            className="bg-slate-900 border border-white/10 w-92 max-w-[calc(100vw-32px)] h-[550px] max-h-[calc(100vh-100px)] rounded-2xl shadow-[0_12px_45px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
            id="assistant-console-panel"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          >
            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-white uppercase tracking-wider block">Aura Global Guide</h4>
                  <p className="text-[9px] font-medium text-emerald-400 uppercase tracking-widest mt-0.5" id="agent-type">
                    {locale === 'en' ? 'Verified Hospital Help' : locale === 'ta' ? 'அங்கீகரிக்கப்பட்ட உதவி மையம்' : 'प्रमाणित क्लिनिक सेवा'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Micro language switches inside helper */}
                <div className="flex bg-slate-800 rounded-lg p-0.5 border border-white/5 text-[9px] font-bold">
                  <button 
                    onClick={() => setLocale('en')} 
                    className={`px-1.5 py-0.5 rounded ${locale === 'en' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                  >
                    EN
                  </button>
                  <button 
                    onClick={() => setLocale('ta')} 
                    className={`px-1.5 py-0.5 rounded ${locale === 'ta' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                  >
                    தமில்
                  </button>
                  <button 
                    onClick={() => setLocale('hi')} 
                    className={`px-1.5 py-0.5 rounded ${locale === 'hi' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'}`}
                  >
                    हिन्दी
                  </button>
                </div>

                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Selector Tab bar */}
            <div className="grid grid-cols-2 bg-slate-950 border-b border-white/5 select-none text-[10px] font-bold uppercase transition-all">
              <button
                onClick={() => setActiveTab('faq')}
                className={`py-3 flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'faq'
                    ? 'border-emerald-500 text-emerald-400 bg-white/[0.02]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{locale === 'en' ? 'Rapid Guides' : locale === 'ta' ? 'வழிகாட்டிகள்' : 'मार्गदर्शिका'}</span>
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`py-3 flex items-center justify-center gap-1.5 border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'chat'
                    ? 'border-emerald-500 text-emerald-400 bg-white/[0.02]'
                    : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>{locale === 'en' ? 'Interactive Chat' : locale === 'ta' ? 'கலந்துரையாடல்' : 'संवाद कक्ष'}</span>
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto bg-slate-900/45 p-4 flex flex-col min-h-0">
              {activeTab === 'faq' ? (
                // FAQS LISTING
                <div className="flex-col flex flex-1 min-h-0 space-y-3">
                  <div className="relative shrink-0">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={locale === 'en' ? 'Search topic guides...' : locale === 'ta' ? 'தலைப்புகளில் தேடவும்...' : 'विषय गाइड खोजें...'}
                      className="w-full bg-slate-950/80 border border-white/10 text-xs rounded-xl py-2 px-3 text-white focus:outline-none focus:border-emerald-500 placeholder-slate-500 pl-8 font-sans"
                    />
                    <HelpCircle className="w-4 h-4 text-slate-500 absolute left-2.5 top-2.5" />
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                    <p className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider pb-1">
                      {locale === 'en' ? 'SELECT CLINIC TOPIC TO START:' : locale === 'ta' ? 'மருத்துவமனை வழிகாட்டி தலைப்புகள்:' : 'प्रारंभ करने के लिए विषय चुनें:'}
                    </p>
                    {filteredFAQ.length > 0 ? (
                      filteredFAQ.map(faq => (
                        <button
                          key={faq.id}
                          onClick={() => handleSelectFAQ(faq)}
                          className="w-full text-left bg-slate-950/40 hover:bg-slate-950/90 hover:border-slate-700 border border-white/5 p-3 rounded-xl transition-all flex items-start gap-2.5 group cursor-pointer"
                        >
                          <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-slate-200 group-hover:text-white leading-snug block">
                              {faq.question[locale]}
                            </span>
                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-1 block">
                              {faq.category}
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8 text-xs text-slate-500">
                        {locale === 'en' ? 'No quick guides match query.' : locale === 'ta' ? 'பொருந்தக்கூடிய விபரங்கள் எதுவும் இல்லை.' : 'कोई मार्गदर्शिका मेल नहीं खाती।'}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // INTRACTIVE CONVERSATION CHAT
                <div className="flex-1 flex flex-col min-h-0 space-y-4">
                  <div className="flex-1 overflow-y-auto space-y-3.5 pr-1" id="chat-messages-container">
                    {messages.map((m, idx) => (
                      <div key={idx} className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed whitespace-pre-wrap font-sans ${
                          m.sender === 'user'
                            ? 'bg-gradient-to-br from-emerald-600/25 to-blue-500/15 border border-emerald-500/25 text-white rounded-tr-none'
                            : 'bg-slate-950/80 border border-white/10 text-slate-200 rounded-tl-none'
                        }`}>
                          {m.text}
                        </div>
                        <span className="text-[7.5px] font-mono mt-1 text-slate-500 uppercase px-1">
                          {m.sender === 'user' ? (locale === 'en' ? 'You' : locale === 'ta' ? 'நீங்கள்' : 'आप') : (locale === 'en' ? 'Aura Guide' : locale === 'ta' ? 'ஆரா உதவியாளர்' : 'ऑरा गाइड')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Manual search and input block */}
                  <form onSubmit={handleChatSubmit} className="flex gap-2 shrink-0 select-text relative">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={
                        locale === 'en' 
                          ? "Ask companion (e.g. appointment)..." 
                          : locale === 'ta' 
                            ? "விபரம் கேட்கவும் (உதாரணம்: டோக்கன்)..." 
                            : "प्रशन पूछें (जैसे: डॉक्टर अपॉइंटमेंट)..."
                      }
                      className="flex-1 bg-slate-950 border border-white/10 focus:border-emerald-500/80 rounded-xl py-2 px-3 text-xs text-white focus:outline-none placeholder-slate-500 pl-3 font-sans select-text"
                    />
                    <button
                      type="submit"
                      className="bg-emerald-500/90 hover:bg-emerald-500 text-slate-950 p-2 rounded-xl transition-colors shrink-0 cursor-pointer flex items-center justify-center border border-emerald-400/20"
                    >
                      <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Quick action helper bottom list */}
            <div className="bg-slate-950 p-2.5 border-t border-white/5 select-none flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>{locale === 'en' ? 'SECURE CONSOLE' : locale === 'ta' ? 'பாதுகாப்பான மென்பொருள்' : 'सुरक्षित कन्सोल'}</span>
              </span>
              <button 
                onClick={() => {
                  setMessages([{ sender: 'ai', text: locale === 'en' ? 'Greeting channels reset.' : locale === 'ta' ? 'புதிய சேவை தொடங்கப்பட்டது.' : 'चैनल रीसेट।' }]);
                  setActiveTab('faq');
                }}
                className="text-[9px] text-emerald-400 hover:underline cursor-pointer"
              >
                {locale === 'en' ? 'Reset Guide' : locale === 'ta' ? 'மீட்டமைக்க' : 'रीसेट करें'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
