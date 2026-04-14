"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "./supabase";

import { 
  UserIcon, LogoutIcon, ListPlusIcon, CalendarIcon, TrashIcon, RestoreIcon, 
  PlusIcon, PrintIcon, SearchIcon, AlertModalIcon, QuestionModalIcon, 
  ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, EraserIcon, DownloadIcon, 
  HistoryIcon, ArrowUpIcon, MailIcon, LockIcon, TagIcon, InfoIcon, 
  RefreshIcon, CheckCircleIcon, XCircleIcon, BellIcon, SettingsIcon, 
  FeedbackIcon, CalculatorIcon, DocumentIcon 
} from "../components/icons";

const ChartPieIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
);

const TrendingUpIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

const ActivityIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);

const CalendarPlusIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line><line x1="10" y1="16" x2="14" y2="16"></line><line x1="12" y1="14" x2="12" y2="18"></line></svg>
);

const UsersIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

const ClockIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);

const DatabaseIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
);

const MapPinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

import { BACKGROUND_IMAGE_URL, LAB_DATABASE } from "../lib/constants";

import { 
  formatTAJ, formatPhone, formatName, getTodayDateStr, getTomorrowDateStr, 
  formatDateTime, formatShortDate, timeToMins, minsToTime, getDailyRevenue 
} from "../lib/utils";

import { EditableCell } from "../components/EditableCell";
import { ModernStatusSelect } from "../components/ModernStatusSelect";
import { ModernExamSelect } from "../components/ModernExamSelect";
import { ModernDatePicker } from "../components/ModernDatePicker";
import { PatientAutocomplete } from "../components/PatientAutocomplete";

const getExamColor = (exam: string) => {
  if (!exam) return "border-transparent";
  const lower = exam.toLowerCase();
  if (lower.includes("ultrahang") || lower.includes("uh")) return "bg-blue-50 text-blue-900 border-blue-200";
  if (lower.includes("kontroll")) return "bg-emerald-50 text-emerald-900 border-emerald-200";
  if (lower.includes("vérvétel") || lower.includes("labor")) return "bg-red-50 text-red-900 border-red-200";
  if (lower.includes("konzultáció") || lower.includes("vizsgálat")) return "bg-purple-50 text-purple-900 border-purple-200";
  if (lower.includes("röntgen") || lower.includes("rtg")) return "bg-amber-50 text-amber-900 border-amber-200";
  return "bg-slate-50 text-slate-900 border-slate-200"; 
};

export default function Home() {
  const searchInputRef = useRef<HTMLInputElement>(null); 

  const [isInitialLoading, setIsInitialLoading] = useState(true); 

  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("");
  
  const [showLabCalculator, setShowLabCalculator] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showPatients, setShowPatients] = useState(false);
  const [isArchiveView, setIsArchiveView] = useState(false);

  const [patientsList, setPatientsList] = useState<any[]>([]);
  const [patientsSearchTerm, setPatientsSearchTerm] = useState("");
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);

  // --- LABOR KALKULÁTOR ÁLLAPOTOK ---
  const [activeLabTab, setActiveLabTab] = useState<'new' | 'saved' | 'slots'>('new');
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([]);
  const [labSearchTerm, setLabSearchTerm] = useState("");
  const [includeBloodDrawFee, setIncludeBloodDrawFee] = useState(true);
  const [editingLabId, setEditingLabId] = useState<number | null>(null);
  
  const [labPatientName, setLabPatientName] = useState("");
  const [labMaidenName, setLabMaidenName] = useState("");
  const [labBirthDate, setLabBirthDate] = useState("");
  const [labBirthPlace, setLabBirthPlace] = useState("");
  const [labPatientTaj, setLabPatientTaj] = useState("");
  const [labPhone, setLabPhone] = useState("");
  const [labEmail, setLabEmail] = useState("");
  const [labPatientAddress, setLabPatientAddress] = useState("");
  
  // Labor Napok állapotai
  const [labSlots, setLabSlots] = useState<any[]>([]);
  const [labSelectedSlotId, setLabSelectedSlotId] = useState("");
  const [labGenDate, setLabGenDate] = useState("");
  const [labGenStart, setLabGenStart] = useState("08:00");
  const [labGenEnd, setLabGenEnd] = useState("12:00");
  const [labGenDuration, setLabGenDuration] = useState("10");
  const [labDayNewTimeSlots, setLabDayNewTimeSlots] = useState<Record<string, string>>({});

  const [savedCalculations, setSavedCalculations] = useState<any[]>([]);
  const [isLoadingSavedLabs, setIsLoadingSavedLabs] = useState(false);
  const [printingSavedLab, setPrintingSavedLab] = useState<any>(null); 

  const [statsPeriod, setStatsPeriod] = useState<'today' | 'week' | 'month' | 'all'>('month');

  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const deptDropdownRef = useRef<HTMLDivElement>(null);

  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [isOnlineDropdownOpen, setIsOnlineDropdownOpen] = useState(false);
  const onlineRef = useRef<HTMLDivElement>(null);

  const [appointments, setAppointments] = useState<any[]>([]);
  const appointmentsRef = useRef(appointments); // Ref a legfrissebb állapothoz
  const [departmentSearch, setDepartmentSearch] = useState(""); 
  const [showDeleted, setShowDeleted] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [needsProfileName, setNeedsProfileName] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState("");
  
  const [selectedDate, setSelectedDate] = useState(""); 
  
  const [dayNewTimeSlots, setDayNewTimeSlots] = useState<Record<string, string>>({});

  const [genStart, setGenStart] = useState("08:00");
  const [genEnd, setGenEnd] = useState("16:00");
  const [genDuration, setGenDuration] = useState("30");
  const [genBreakStart, setGenBreakStart] = useState("12:00");
  const [genBreakEnd, setGenBreakEnd] = useState("13:00");
  
  const [genOnlineStart, setGenOnlineStart] = useState("");
  const [genOnlineEnd, setGenOnlineEnd] = useState("");

  const [printingDate, setPrintingDate] = useState<string | null>(null);
  const [printingLabQuote, setPrintingLabQuote] = useState(false); 
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [allPrices, setAllPrices] = useState<any[]>([]);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [currentPrices, setCurrentPrices] = useState<{id: string, name: string, price: string}[]>([]);

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");

  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null); 

  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [bugDescription, setBugDescription] = useState("");
  const [bugFile, setBugFile] = useState<File | null>(null);
  const [isSubmittingBug, setIsSubmittingBug] = useState(false);

  const [historyModal, setHistoryModal] = useState<{isOpen: boolean, patientName: string, taj: string, data: any[]}>({
    isOpen: false, patientName: "", taj: "", data: []
  });

  const [appInfoModal, setAppInfoModal] = useState<{isOpen: boolean, data: any, logs: any[], loading: boolean}>({
    isOpen: false, data: null, logs: [], loading: false
  });

  const [modal, setModal] = useState<{isOpen: boolean, title: string, message: string, type: "alert" | "confirm", confirmText: string, confirmColor: string, onConfirm: () => void}>({
    isOpen: false, title: "", message: "", type: "alert", confirmText: "Rendben", confirmColor: "bg-slate-900 text-white", onConfirm: () => {}
  });

  const [toast, setToast] = useState<{visible: boolean, message: string, type: 'success' | 'error' | 'warning'}>({
    visible: false, message: "", type: 'success'
  });

  useEffect(() => {
    appointmentsRef.current = appointments;
  }, [appointments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const searchPatients = async (term: string) => {
    if (!term || term.length < 2) return [];
    const { data, error } = await supabase.from('patients').select('*').ilike('name', `%${term}%`).limit(6);
    if (error) console.error("Keresési hiba:", error);
    return data || [];
  };

  const handleSelectPatient = async (appId: number, patient: any) => {
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    
    setAppointments(prev => prev.map((app: any) => app.id === appId ? { 
      ...app, 
      patient_name: patient.name, 
      taj_szam: patient.taj_szam || app.taj_szam, 
      phone_number: patient.phone_number || app.phone_number,
      birth_date: patient.birth_date || app.birth_date,
      last_modified_by: modifierName, 
      last_modified_at: now 
    } : app));
    
    await supabase.from("appointments").update({ 
      patient_name: patient.name, 
      taj_szam: patient.taj_szam, 
      phone_number: patient.phone_number,
      birth_date: patient.birth_date,
      last_modified_by: modifierName, 
      last_modified_at: now 
    }).eq("id", appId);
    
    await logAction(appId, "Módosítás", `Beteg betöltve a törzsből: ${patient.name}`);
    showToast(`${patient.name} adatai sikeresen kitöltve!`);
  };

  const toggleLabTest = (id: string) => {
    setSelectedLabTests(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const getSelectedLabItemsData = () => {
    const items: any[] = [];
    LAB_DATABASE.forEach(cat => {
      cat.items.forEach(item => {
        if (selectedLabTests.includes(item.id)) items.push(item);
      });
    });
    return items;
  };

  const calculateLabTotal = () => {
    const items = getSelectedLabItemsData();
    const testsTotal = items.reduce((sum, item) => sum + item.price, 0);
    const baseFee = includeBloodDrawFee ? 6000 : 0;
    return testsTotal + baseFee;
  };

  const handlePrintLabQuote = () => {
    if (selectedLabTests.length === 0) return showAlert("Üres ajánlat", "Kérlek, válassz ki legalább egy vizsgálatot a nyomtatáshoz!");
    setPrintingLabQuote(true);
    setTimeout(() => { window.print(); }, 300);
  };

  const handleSaveLabCalculation = async () => {
    if (selectedLabTests.length === 0) return showAlert("Hiba", "Nincs kiválasztott vizsgálat, amit el lehetne menteni!");
    if (!labPatientName.trim()) return showAlert("Hiányzó adat", "Kérlek, legalább a páciens nevét add meg a mentéshez!");

    const items = getSelectedLabItemsData();
    const testsTotal = items.reduce((sum, item) => sum + item.price, 0);
    const testsList = items.map(i => i.name).join(", ");

    let erkezesi_ido_val = null;
    if (labSelectedSlotId) {
       const slot = labSlots.find(s => s.id.toString() === labSelectedSlotId);
       if (slot) {
          const dt = new Date(`${slot.slot_date}T${slot.slot_time}`);
          erkezesi_ido_val = dt.toISOString();
       }
    }

    const payload = {
      patient_name: labPatientName,
      maiden_name: labMaidenName,
      taj_szam: labPatientTaj,
      birth_date: labBirthDate,
      birth_place: labBirthPlace,
      address: labPatientAddress,
      phone_number: labPhone,
      email: labEmail,
      tests_list: testsList,
      total_price: testsTotal,
      created_by: getDisplayName(),
      erkezesi_ido: erkezesi_ido_val 
    };

    let error;
    if (editingLabId) {
      const { error: updateError } = await supabase.from('lab_calculations').update(payload).eq('id', editingLabId);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('lab_calculations').insert([payload]);
      error = insertError;
    }

    if (error) {
      console.error(error);
      showAlert("Hiba", "Nem sikerült elmenteni a kalkulációt az adatbázisba.");
    } else {
      if (labSelectedSlotId) {
        await supabase.from('lab_slots').update({ is_booked: true, patient_name: labPatientName }).eq('id', labSelectedSlotId);
      }
      showToast(editingLabId ? "Kalkuláció sikeresen frissítve!" : "Kalkuláció sikeresen elmentve az adatbázisba!");
      setLabPatientName(""); setLabMaidenName(""); setLabPatientTaj(""); setLabBirthDate("");
      setLabBirthPlace(""); setLabPatientAddress(""); setLabPhone(""); setLabEmail("");
      setLabSelectedSlotId(""); 
      setSelectedLabTests([]);
      setEditingLabId(null);
      setActiveLabTab('saved');
      fetchLabSlots();
      fetchSavedCalculations();
    }
  };

  const handleEditLabCalculation = (calc: any) => {
    setLabPatientName(calc.patient_name || "");
    setLabMaidenName(calc.maiden_name || "");
    setLabBirthDate(calc.birth_date || "");
    setLabBirthPlace(calc.birth_place || "");
    setLabPatientTaj(calc.taj_szam || "");
    setLabPhone(calc.phone_number || "");
    setLabEmail(calc.email || "");
    setLabPatientAddress(calc.address || "");
    
    const testNames = calc.tests_list.split(", ");
    const matchedTestIds: string[] = [];
    LAB_DATABASE.forEach(cat => {
      cat.items.forEach(item => {
        if (testNames.includes(item.name)) matchedTestIds.push(item.id);
      });
    });
    setSelectedLabTests(matchedTestIds);
    setEditingLabId(calc.id);
    setActiveLabTab('new');
    
    showToast("Adatok betöltve szerkesztésre!", 'success');
  };

  const fetchLabSlots = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('lab_slots').select('*').gte('slot_date', today).order('slot_date').order('slot_time');
    if (data) setLabSlots(data);
  };

  const generateLabSlots = async () => {
    if (!labGenDate || !labGenStart || !labGenEnd || !labGenDuration) return showAlert("Hiányzó adat", "Minden labor generátor mezőt ki kell tölteni!");
    const durationMins = parseInt(labGenDuration);
    if (isNaN(durationMins) || durationMins <= 0) return showAlert("Hibás érték", "A vizsgálat hossza (perc) nullánál nagyobb kell, hogy legyen!");

    let current = timeToMins(labGenStart);
    const end = timeToMins(labGenEnd);
    const slotsToCreate = [];

    while (current + durationMins <= end) {
      slotsToCreate.push({
        slot_date: labGenDate,
        slot_time: minsToTime(current) + ":00",
        is_booked: false,
        patient_name: null
      });
      current += durationMins;
    }

    if (slotsToCreate.length === 0) return showAlert("Sikertelen generálás", "A megadott feltételekkel nem jött létre időpont.");

    showConfirm(
      "Labor nap generálása",
      `Sikeresen kiszámoltam ${slotsToCreate.length} db új labor időpontot a kiválasztott napra.\n\nLétrehozhatom őket?`,
      "Generálás",
      "bg-emerald-600 hover:bg-emerald-700 text-white",
      async () => {
        const { error } = await supabase.from('lab_slots').insert(slotsToCreate);
        if (error) {
           console.error(error);
           showAlert("Hiba", "Nem sikerült elmenteni az időpontokat.");
        } else {
           showToast("Labor időpontok sikeresen legenerálva!");
           fetchLabSlots();
        }
      }
    );
  };

  const addLabDaySingleSlot = async (date: string) => {
    const slotTime = labDayNewTimeSlots[date];
    if (!slotTime || !slotTime.trim()) return showAlert("Hiányzó adat", "Kérlek, adj meg egy pontos időpontot (pl. 07:45)!");
    
    let formattedTime = slotTime.trim();
    if (formattedTime.length === 5) formattedTime += ":00";

    const { error } = await supabase.from('lab_slots').insert([{
      slot_date: date,
      slot_time: formattedTime,
      is_booked: false,
      patient_name: null
    }]);

    if (error) {
      showAlert("Hiba", "Nem sikerült hozzáadni az időpontot.");
    } else {
      setLabDayNewTimeSlots(prev => ({...prev, [date]: ""}));
      showToast("Új egyedi labor időpont sikeresen hozzáadva!");
      fetchLabSlots();
    }
  };

  const deleteLabDay = async (date: string) => {
    showConfirm(
      "Labor nap törlése",
      `Biztosan törlöd a teljes ${date} labor napot?\nFigyelem: A foglalt időpontok is törlődnek a listából (a kalkulációk viszont megmaradnak az archívumban).`,
      "Igen, törlés",
      "bg-red-600 hover:bg-red-700 text-white",
      async () => {
        await supabase.from('lab_slots').delete().eq('slot_date', date);
        showToast("Labor nap törölve!");
        fetchLabSlots();
      }
    );
  };

  const fetchSavedCalculations = async () => {
    setIsLoadingSavedLabs(true);
    let allData: any[] = [];
    let hasMore = true;
    let from = 0;
    const step = 1000;

    while (hasMore) {
      const { data, error } = await supabase
        .from('lab_calculations')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, from + step - 1);
      
      if (error) {
        console.error("Hiba a kalkulációk betöltésekor:", error);
        break;
      }
      if (data) {
        allData = [...allData, ...data];
        if (data.length < step) hasMore = false;
        else from += step;
      } else {
        hasMore = false;
      }
    }
    setSavedCalculations(allData);
    setIsLoadingSavedLabs(false);
  };

  const deleteSavedCalculation = async (calc: any) => {
    showConfirm(
      "Mentett ajánlat törlése",
      "Biztosan törlöd ezt az elmentett labor kalkulációt a rendszerből?",
      "Igen, törlés",
      "bg-red-600 hover:bg-red-700 text-white",
      async () => {
        await supabase.from('lab_calculations').delete().eq('id', calc.id);
        
        if (calc.erkezesi_ido) {
           const dt = new Date(calc.erkezesi_ido);
           const slotDate = dt.toISOString().split('T')[0];
           const slotTime = dt.toTimeString().split(' ')[0];
           
           await supabase.from('lab_slots')
             .update({ is_booked: false, patient_name: null })
             .eq('slot_date', slotDate)
             .like('slot_time', `${slotTime.substring(0, 5)}%`)
             .eq('patient_name', calc.patient_name);
           
           fetchLabSlots();
        }
        
        setSavedCalculations(prev => prev.filter(c => c.id !== calc.id));
        showToast("Kalkuláció véglegesen törölve, időpont felszabadítva!");
      }
    );
  };

  const toggleLabArrived = async (id: number, currentValue: boolean) => {
    const { error } = await supabase.from('lab_calculations').update({ megerkezett: !currentValue }).eq('id', id);
    if (error) {
      showAlert("Hiba", "Nem sikerült frissíteni a státuszt.");
    } else {
      setSavedCalculations(prev => prev.map(c => c.id === id ? { ...c, megerkezett: !currentValue } : c));
      showToast(!currentValue ? "Sikeresen kipipálva (Megérkezett)!" : "Státusz visszavonva!");
    }
  };

  const handlePrintSavedLab = (calc: any) => {
    setPrintingSavedLab(calc);
    setPrintingLabQuote(true);
    setTimeout(() => { window.print(); }, 300);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), type === 'warning' ? 5000 : 3500);
  };

  const logAction = async (appId: number, action: string, details: string) => {
    const modifierName = getDisplayName();
    try {
      await supabase.from('appointment_logs').insert([{ appointment_id: appId, modified_by: modifierName, action: action, details: details }]);
    } catch (e) {
      console.error("Naplózási hiba", e);
    }
  };

  const openAppInfoModal = async (app: any) => {
    setAppInfoModal({ isOpen: true, data: app, logs: [], loading: true });
    const { data } = await supabase.from('appointment_logs').select('*').eq('appointment_id', app.id).order('modified_at', { ascending: false });
    setAppInfoModal({ isOpen: true, data: app, logs: data || [], loading: false });
  };

  const openPriceModal = () => {
    const deptPrices = allPrices.filter(p => p.department === activeTab);
    setCurrentPrices(deptPrices.length > 0 ? deptPrices : []);
    setIsPriceModalOpen(true);
  };

  const handleNotificationClick = (msg: string) => {
    const parts = msg.split("módosította az árlistát: ");
    if (parts.length === 2) {
      const dept = parts[1].trim();
      if (categories.includes(dept)) setActiveTab(dept);
      const deptPrices = allPrices.filter(p => p.department === dept);
      setCurrentPrices(deptPrices.length > 0 ? deptPrices : []);
      setIsPriceModalOpen(true);
      setIsNotifOpen(false);
    }
  };

  const addPriceItem = () => setCurrentPrices([...currentPrices, { id: Date.now().toString(), name: "", price: "" }]);
  const updatePriceItem = (id: string, field: "name" | "price", value: string) => setCurrentPrices(currentPrices.map(item => item.id === id ? { ...item, [field]: value } : item));
  const removePriceItem = (id: string) => setCurrentPrices(currentPrices.filter(item => item.id !== id));

  const savePrices = async () => {
    await supabase.from("prices").delete().eq("department", activeTab);
    const validPrices = currentPrices.filter(p => p.name.trim() !== "" || p.price.trim() !== "");
    if (validPrices.length > 0) {
      const inserts = validPrices.map(p => ({ department: activeTab, name: p.name, price: p.price }));
      await supabase.from("prices").insert(inserts);
    }
    await supabase.from("notifications").insert([{ message: `${getDisplayName()} módosította az árlistát: ${activeTab}` }]);
    setIsPriceModalOpen(false);
    showToast(`${activeTab} árak sikeresen elmentve!`);
  };

  const handleAddDepartment = async () => {
    const trimmed = newDeptName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) return showAlert("Hiba", "Ez a szakrendelés már létezik!");
    
    await supabase.from("departments").insert([{ name: trimmed }]);
    setNewDeptName("");
    showToast("Szakrendelés sikeresen hozzáadva!");
  };

  const handleDeleteDepartment = (name: string) => {
    showConfirm(
      "Szakrendelés törlése",
      `Biztosan törlöd a(z) ${name} szakrendelést a listából?\n\n(A már rögzített időpontok és páciensek megmaradnak az adatbázisban, csak ez a fül tűnik el.)`,
      "Igen, törlés",
      "bg-red-600 hover:bg-red-700 text-white",
      async () => {
        await supabase.from("departments").delete().eq("name", name);
        if (activeTab === name) setActiveTab(categories[0] || "");
        showToast("Szakrendelés törölve!");
      }
    );
  };

  const handleBugSubmit = async () => {
    if (!bugDescription.trim()) return showAlert("Hiányzó adat", "Kérlek írd le röviden a problémát vagy az ötletedet!");
    setIsSubmittingBug(true);
    
    try {
      const formData = new FormData();
      formData.append("Bejelentő neve", getDisplayName() || "Ismeretlen");
      formData.append("Bejelentő email", user?.email || "Ismeretlen");
      formData.append("Leírás", bugDescription);
      if (bugFile) formData.append("Csatolmány", bugFile);
      
      formData.append("_subject", "Új hibabejelentés: Medical-Aqua");
      formData.append("_captcha", "false");

      const response = await fetch("https://formsubmit.co/ajax/kovacs.zoltan1998@gmail.com", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        showToast("Hibabejelentés sikeresen elküldve!");
        setIsBugModalOpen(false);
        setBugDescription("");
        setBugFile(null);
      } else {
        showAlert("Hiba", "Nem sikerült elküldeni az e-mailt. Próbáld újra később.");
      }
    } catch (error) {
      showAlert("Hálózati Hiba", "Ellenőrizd az internetkapcsolatot!");
    }
    
    setIsSubmittingBug(false);
  };

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));
  const closeHistoryModal = () => setHistoryModal(prev => ({ ...prev, isOpen: false }));
  const closeAppInfoModal = () => setAppInfoModal(prev => ({ ...prev, isOpen: false }));

  const showAlert = (title: string, message: string) => {
    setModal({ isOpen: true, title, message, type: "alert", confirmText: "Rendben", confirmColor: "bg-slate-900 text-white hover:bg-black", onConfirm: closeModal });
  };

  const showConfirm = (title: string, message: string, confirmText: string, confirmColor: string, onConfirmCallback: () => void) => {
    setModal({ isOpen: true, title, message, type: "confirm", confirmText, confirmColor, onConfirm: () => { onConfirmCallback(); closeModal(); }});
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (deptDropdownRef.current && !deptDropdownRef.current.contains(e.target as Node)) {
        setIsDeptDropdownOpen(false);
      }
      if (onlineRef.current && !onlineRef.current.contains(e.target as Node)) {
        setIsOnlineDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const scrollToToday = () => {
    const todayId = `date-${getTodayDateStr()}`;
    const el = document.getElementById(todayId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      showToast('Erre a napra (még) nincsenek időpontok generálva!', 'warning');
    }
  };

  useEffect(() => {
    if (!user) return;
    let timeoutId: NodeJS.Timeout;
    const logoutUser = async () => {
      await handleLogout();
      showAlert("Munkamenet lejárt", "Biztonsági okokból, 15 perc inaktivitás után a rendszer automatikusan kijelentkeztetett.");
    };
    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(logoutUser, 900000);
    };
    const events = ['mousemove', 'keydown', 'mousedown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); 
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') { 
        e.preventDefault(); searchInputRef.current?.focus(); 
      }
      if (e.altKey && e.key.toLowerCase() === 'l') { 
        e.preventDefault(); setShowLabCalculator(true); setShowStats(false); setShowPatients(false);
      }
      if (e.altKey && e.key.toLowerCase() === 's') { 
        e.preventDefault(); setShowStats(true); setShowLabCalculator(false); setShowPatients(false);
      }
      if (e.altKey && e.key.toLowerCase() === 'p') { 
        e.preventDefault(); setShowPatients(true); setShowStats(false); setShowLabCalculator(false);
      }
      if (e.key === 'Escape') { 
        closeModal(); closeHistoryModal(); setIsPriceModalOpen(false); 
        closeAppInfoModal(); setIsNotifOpen(false); setIsDeptModalOpen(false);
        setIsBugModalOpen(false); setIsDeptDropdownOpen(false); setIsOnlineDropdownOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleAfterPrint = () => { 
      setPrintingDate(null); 
      setPrintingLabQuote(false); 
      setPrintingSavedLab(null);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => checkUserAndProfile(session?.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => checkUserAndProfile(session?.user));
    return () => authListener.subscription.unsubscribe();
  }, []);

  const checkUserAndProfile = (loggedUser: any) => {
    setUser(loggedUser ?? null);
    if (loggedUser && !loggedUser.user_metadata?.display_name) setNeedsProfileName(true);
    else setNeedsProfileName(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('departments').select('name').order('name');
    if (data) {
      const catList = data.map(d => d.name);
      setCategories(catList);
      setActiveTab(prev => (prev && catList.includes(prev)) ? prev : (catList[0] || ""));
    }
  };

  const fetchAllPrices = async () => {
    const { data } = await supabase.from("prices").select("*");
    if (data) setAllPrices(data);
  };

  const fetchNotifications = async () => {
    const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(20);
    if (data) {
      setNotifications(data);
      updateUnreadCount(data);
    }
  };

  const updateUnreadCount = (notifs: any[]) => {
    if (!user) return;
    const lastRead = localStorage.getItem(`medaqua_notif_${user?.email}`);
    if (!lastRead) {
      setUnreadCount(notifs.length);
    } else {
      const count = notifs.filter(n => new Date(n.created_at) > new Date(lastRead)).length;
      setUnreadCount(count);
    }
  };

  const toggleNotif = () => {
    const opening = !isNotifOpen;
    setIsNotifOpen(opening);
    if (opening && user) {
      const now = new Date().toISOString();
      localStorage.setItem(`medaqua_notif_${user.email}`, now);
      setUnreadCount(0);
    }
  };

  const fetchAppointments = async () => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setFullYear(today.getFullYear() - 2); 
    const futureDate = new Date();
    futureDate.setFullYear(today.getFullYear() + 1);

    const pastStr = pastDate.toISOString().split('T')[0];
    const futureStr = futureDate.toISOString().split('T')[0];

    let allData: any[] = [];
    let hasMore = true;
    let from = 0;
    const step = 1000;

    while (hasMore) {
      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .gte("appointment_date", pastStr)
        .lte("appointment_date", futureStr)
        .order("appointment_date", { ascending: true })
        .order("time_slot", { ascending: true })
        .range(from, from + step - 1);

      if (error) {
        console.error("Hiba az időpontok betöltésekor:", error);
        break;
      }
      if (data) {
        allData = [...allData, ...data];
        if (data.length < step) hasMore = false;
        else from += step;
      } else {
        hasMore = false;
      }
    }
    setAppointments(allData);
  };

  const fetchPatientsList = async () => {
    setIsLoadingPatients(true);
    let allData: any[] = [];
    let hasMore = true;
    let from = 0;
    const step = 1000;

    while (hasMore) {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('name', { ascending: true })
        .range(from, from + step - 1);

      if (error) {
        console.error("Hiba a páciensek betöltésekor:", error);
        break;
      }
      if (data) {
        allData = [...allData, ...data];
        if (data.length < step) hasMore = false;
        else from += step;
      } else {
        hasMore = false;
      }
    }
    setPatientsList(allData);
    setIsLoadingPatients(false);
  };

  useEffect(() => {
    if (showPatients) {
      fetchPatientsList();
    }
  }, [showPatients]);

  const loadInitialData = async () => {
    setIsInitialLoading(true);
    await Promise.all([
      fetchCategories(),
      fetchAppointments(),
      fetchAllPrices(),
      fetchNotifications(),
      fetchLabSlots()
    ]);
    setIsInitialLoading(false);
  };

  const userId = user?.id;
  const userEmail = user?.email;
  const userName = user?.user_metadata?.display_name;

  useEffect(() => { 
    if (userId && !needsProfileName) {
      loadInitialData(); 

      const channel = supabase.channel('live-appointments')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            setAppointments(prev => prev.find(a => a.id === payload.new.id) ? prev : [...prev, payload.new]);
          } else if (payload.eventType === 'UPDATE') {
            setAppointments(prev => prev.map(app => {
              if (app.id === payload.new.id) {
                // Versenyhelyzet elkerülése: ha a mi adatunk újabb vagy egykorú, mint a beérkező módosítás,
                // akkor ignoráljuk a Supabase realtime frissítést (mert ez valószínűleg a saját mentésünk visszhangja)
                const localDate = new Date(app.last_modified_at || 0).getTime();
                const incomingDate = new Date(payload.new.last_modified_at || 0).getTime();
                
                if (localDate >= incomingDate) {
                  return app; // Megtartjuk a lokális, épp gépelt állapotot
                }
                return payload.new;
              }
              return app;
            }));
          } else if (payload.eventType === 'DELETE') {
            setAppointments(prev => prev.filter(app => app.id !== payload.old.id));
          }
        })
        .subscribe();
      
      const pricesChannel = supabase.channel('live-prices')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'prices' }, () => fetchAllPrices())
        .subscribe();

      const notifChannel = supabase.channel('live-notifs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () => fetchNotifications())
        .subscribe();

      const deptChannel = supabase.channel('live-departments')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'departments' }, () => fetchCategories())
        .subscribe();

      const labSlotsChannel = supabase.channel('live-lab-slots')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'lab_slots' }, () => fetchLabSlots())
        .subscribe();

      const presenceChannel = supabase.channel('online-users');
      presenceChannel
        .on('presence', { event: 'sync' }, () => {
          const state = presenceChannel.presenceState();
          const users = Object.values(state).map((presences: any) => presences[0]);
          setOnlineUsers(users);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await presenceChannel.track({
              email: userEmail,
              name: userName || userEmail,
            });
          }
        });

      return () => { 
        supabase.removeChannel(channel); 
        supabase.removeChannel(pricesChannel); 
        supabase.removeChannel(notifChannel); 
        supabase.removeChannel(deptChannel); 
        supabase.removeChannel(labSlotsChannel);
        supabase.removeChannel(presenceChannel); 
      };
    } 
  }, [userId, userEmail, userName, needsProfileName]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return showAlert("Sikertelen belépés", "Hibás e-mail cím vagy jelszó.\nKérlek, ellenőrizd az adataidat és próbáld újra!");
  };

  const handleSaveProfileName = async () => {
    if (!profileNameInput.trim()) return showAlert("Hiányzó adat", "Kérlek, add meg a teljes nevedet a folytatáshoz! (Pl. Dr. Kovács)");
    const { data, error } = await supabase.auth.updateUser({ data: { display_name: profileNameInput } });
    if (error) return showAlert("Hiba", "Nem sikerült elmenteni a nevedet. Kérlek, próbáld újra!");
    else { setUser(data.user); setNeedsProfileName(false); }
  };

  const handleLogout = async () => await supabase.auth.signOut();
  const getDisplayName = () => userName || userEmail;

  // --- ÚJRAGONDOLT, BIZTONSÁGOS MENTÉSI METÓDUS ---
  const updateAppointment = async (id: number, field: string, newValue: string) => {
    if (!user) return;
    
    // 1. Megkeressük az aktuális elemet a ref segítségével (hogy a legfrissebb adatot lássuk)
    const oldApp = appointmentsRef.current.find((a: any) => a.id === id);
    if (!oldApp) return;

    const oldValue = oldApp[field] || "";
    if (oldValue === newValue) return; // Ha tényleg nincs változás, nem csinálunk semmit

    const modifierName = getDisplayName();
    const now = new Date().toISOString();

    // 2. Azonnali UI frissítés, hogy a gépelés gördülékeny maradjon
    setAppointments(prev => prev.map((app: any) => 
      app.id === id ? { ...app, [field]: newValue, last_modified_by: modifierName, last_modified_at: now } : app
    ));

    const fieldNames: Record<string, string> = {
      patient_name: "Páciens neve", taj_szam: "TAJ szám", phone_number: "Telefon", 
      birth_date: "Születési idő", status: "Státusz", examination_type: "Vizsgálat", 
      notes: "Megjegyzés", location: "Helyszín"
    };
    const fieldLabel = fieldNames[field] || field;
    const details = `${fieldLabel}: "${oldValue || "(üres)"}" ➔ "${newValue || "(üres)"}"`;

    // 3. Mentés a háttérben (Supabase)
    const { error } = await supabase.from("appointments").update({ 
      [field]: newValue, 
      last_modified_by: modifierName, 
      last_modified_at: now 
    }).eq("id", id);

    if (error) {
      console.error("Adatbázis mentési hiba:", error);
      showToast("Hiba a mentés során!", "error");
      return; // Ha hiba van, megállítjuk a további logolást
    }

    logAction(id, "Módosítás", details);

    // 4. Betegtörzs logika lefutása sikeres mentés esetén
    if (["patient_name", "taj_szam", "phone_number", "birth_date"].includes(field)) {
      const currentName = field === "patient_name" ? newValue : (oldApp.patient_name || "");
      const currentTaj = field === "taj_szam" ? newValue : (oldApp.taj_szam || "");
      const currentPhone = field === "phone_number" ? newValue : (oldApp.phone_number || "");
      const currentBirthDate = field === "birth_date" ? newValue : (oldApp.birth_date || "");
      
      if (currentName && currentName.trim().length >= 3) {
        const { data: existingPatients } = await supabase.from('patients').select('id').eq('name', currentName.trim());
        if (existingPatients && existingPatients.length > 0) {
           await supabase.from('patients').update({
              taj_szam: currentTaj || null,
              phone_number: currentPhone || null,
              birth_date: currentBirthDate || null,
              last_visit: now
           }).eq('id', existingPatients[0].id);
        } else {
           await supabase.from('patients').insert([{
              name: currentName.trim(),
              taj_szam: currentTaj || null,
              phone_number: currentPhone || null,
              birth_date: currentBirthDate || null,
              last_visit: now
           }]);
        }
      }
    }
  };

  const updateDayLocation = async (date: string, department: string, location: string) => {
    if (!user) return;
    const modifierName = getDisplayName();
    const now = new Date().toISOString();

    setAppointments(prev => prev.map((app: any) => 
      (app.appointment_date === date && app.department === department) 
        ? { ...app, location, last_modified_by: modifierName, last_modified_at: now } 
        : app
    ));

    await supabase.from("appointments")
      .update({ location, last_modified_by: modifierName, last_modified_at: now })
      .eq("appointment_date", date)
      .eq("department", department);

    showToast("Napi helyszín sikeresen frissítve!");
  };

  const clearEmptySlots = async (date: string) => {
    const dayApps = groupedByDate[date] || [];
    const emptyApps = dayApps.filter((a: any) => !a.is_deleted && a.time_slot !== "VÁRÓLISTA" && (!a.patient_name || a.patient_name.trim() === ""));
    
    if (emptyApps.length === 0) return showAlert("Nincs törölhető üres sor", "Ezen a napon nincsenek üres (páciens nélküli) időpontok.");

    showConfirm(
      "Üres sorok takarítása",
      `Biztosan törlöd a(z) ${emptyApps.length} db üresen maradt időpontot ezen a napon?`,
      "Igen, törlés",
      "bg-amber-500 hover:bg-amber-600 text-white",
      async () => {
        const modifierName = getDisplayName();
        const now = new Date().toISOString();
        const idsToDelete = emptyApps.map((a: any) => a.id);
        
        setAppointments(prev => prev.map((app: any) => 
          idsToDelete.includes(app.id) ? { ...app, is_deleted: true, deleted_by: modifierName, deleted_at: now } : app
        ));

        await supabase.from("appointments")
          .update({ is_deleted: true, deleted_by: modifierName, deleted_at: now })
          .in('id', idsToDelete);
          
        const logs = idsToDelete.map((id: number) => ({
           appointment_id: id, modified_by: modifierName, action: "Törlés", details: "Üres sor automatikus takarítása"
        }));
        await supabase.from('appointment_logs').insert(logs);
        
        showToast("Üres sorok sikeresen törölve!");
      }
    );
  };

  const confirmDeleteApp = (id: number) => {
    showConfirm(
      "Időpont törlése",
      "Biztosan törlöd ezt az időpontot?\n\nKésőbb a 'Törölt sorok mutatása' gombbal visszaállítható.",
      "Igen, törlöm",
      "bg-red-600 hover:bg-red-700 text-white",
      () => executeDeleteApp(id)
    );
  };

  const executeDeleteApp = async (id: number) => {
    const appToDelete = appointments.find(a => a.id === id);
    const date = appToDelete?.appointment_date;
    const isBooked = appToDelete?.patient_name && appToDelete.patient_name.trim() !== "";
    
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    
    setAppointments(prev => prev.map((app: any) => app.id === id ? { ...app, is_deleted: true, deleted_by: modifierName, deleted_at: now } : app));
    
    await supabase.from("appointments").update({ is_deleted: true, deleted_by: modifierName, deleted_at: now }).eq("id", id);
    await logAction(id, "Törlés", "Időpont törölve a listából");
    
    const waitingCount = appointments.filter(a => a.appointment_date === date && a.time_slot === "VÁRÓLISTA" && !a.is_deleted).length;
    if (waitingCount > 0 && appToDelete?.time_slot !== "VÁRÓLISTA" && isBooked) {
       showToast(`Időpont törölve! Figyelem: ${waitingCount} beteg van a várólistán!`, 'warning');
    } else {
       showToast("Időpont törölve");
    }
  };

  const handlePrintDay = (date: string) => {
    setPrintingDate(date);
    setTimeout(() => { window.print(); }, 300);
  };

  const deleteEntireDay = async (date: string) => {
    const dayApps = groupedByDate[date].filter((a: any) => !a.is_deleted);
    if (dayApps.length === 0) return showAlert("Üres nap", "Ezen a napon nincsenek törölhető időpontok az adott szakrendelésen.");

    showConfirm(
      "Teljes nap törlése",
      `Biztosan törlöd a teljes ${date} napot a(z) ${activeTab} szakrendelésen?\n\nFigyelem: Ezzel az összes ide beírt páciens is törlésre kerül!`,
      "Igen, teljes nap törlése",
      "bg-red-600 hover:bg-red-700 text-white",
      async () => {
        const modifierName = getDisplayName();
        const now = new Date().toISOString();
        const idsToDelete = dayApps.map((a: any) => a.id);
        
        setAppointments(prev => prev.map((app: any) => 
          idsToDelete.includes(app.id) ? { ...app, is_deleted: true, deleted_by: modifierName, deleted_at: now } : app
        ));

        await supabase.from("appointments")
          .update({ is_deleted: true, deleted_by: modifierName, deleted_at: now })
          .in('id', idsToDelete);
          
        const logs = idsToDelete.map((id: number) => ({
           appointment_id: id, modified_by: modifierName, action: "Törlés", details: "Teljes nap csoportos törlése"
        }));
        await supabase.from('appointment_logs').insert(logs);
        showToast("A teljes nap törlésre került.");
      }
    );
  };

  const exportToCSV = (date: string) => {
    const dayApps = groupedByDate[date]?.filter((a: any) => !a.is_deleted).sort((a: any, b: any) => a.time_slot.localeCompare(b.time_slot)) || [];
    if (dayApps.length === 0) return showAlert("Üres nap", "Nincs letölthető adat ezen a napon.");

    const headers = ["Időpont", "Páciens neve", "Születési idő", "TAJ szám", "Telefon", "Státusz", "Vizsgálat", "Helyszín", "Megjegyzés"];
    const rows = dayApps.map((app: any) => [
      app.time_slot.replace(" (Online)", ""), 
      app.patient_name || "",
      app.birth_date || "", 
      app.taj_szam || "",
      app.phone_number || "",
      app.status || "",
      app.examination_type || "",
      app.location || "",
      app.notes || ""
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map((row: any[]) => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(";"))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `MA_elojegyzes_${activeTab}_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPatientHistory = async (name: string, taj: string) => {
    if (!name) return showAlert("Hiányzó adat", "A karton megnyitásához a beteg nevének kitöltve kell lennie!");
    setHistoryModal({ isOpen: true, patientName: name, taj: taj || "", data: [] });
    
    let query = supabase.from("appointments").select("*").eq("patient_name", name).eq("is_deleted", false);
    const { data } = await query;
    let matches = data || [];
    
    if (taj && taj.trim() !== "") {
       matches = matches.filter(a => a.taj_szam && a.taj_szam.replace(/\s+/g, '') === taj.replace(/\s+/g, ''));
    }

    matches = matches.sort((a: any, b: any) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime());
    setHistoryModal({ isOpen: true, patientName: name, taj: taj || "", data: matches });
  };

  const addToWaitingList = async (date: string) => {
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    const { data } = await supabase.from("appointments").insert([{
      department: activeTab, appointment_date: date, time_slot: "VÁRÓLISTA",
      patient_name: "", taj_szam: "", phone_number: "", birth_date: "", examination_type: "", notes: "", status: "Várólista",
      last_modified_by: modifierName, last_modified_at: now, is_deleted: false
    }]).select();
    
    if (data && data[0]) {
       await logAction(data[0].id, "Létrehozás", "Új várólistás hely hozzáadva");
    }
    showToast("Új hely a várólistán létrehozva!");
  };

  const generateDailySlots = async () => {
    if (!selectedDate) return showAlert("Hiányzó adat", "Kérlek, válassz ki egy dátumot a naptárból!");
    if (!genStart || !genEnd || !genDuration) return showAlert("Hiányzó adat", "Minden generátor mezőt ki kell tölteni a művelethez!");
    
    const durationMins = parseInt(genDuration);
    if (isNaN(durationMins) || durationMins <= 0) return showAlert("Hibás érték", "A vizsgálat hossza (perc) nullánál nagyobb kell, hogy legyen!");

    let current = timeToMins(genStart);
    const end = timeToMins(genEnd);
    const bStart = genBreakStart ? timeToMins(genBreakStart) : null;
    const bEnd = genBreakEnd ? timeToMins(genBreakEnd) : null;
    
    const oStart = genOnlineStart ? timeToMins(genOnlineStart) : null;
    const oEnd = genOnlineEnd ? timeToMins(genOnlineEnd) : null;

    const slotsToCreate = [];

    while (current + durationMins <= end) {
      if (bStart !== null && bEnd !== null && current >= bStart && current < bEnd) { current = bEnd; continue; }
      const next = current + durationMins;
      if (bStart !== null && bEnd !== null && current < bStart && next > bStart) { current = bEnd; continue; }
      
      let slotStr = `${minsToTime(current)} - ${minsToTime(next)}`;
      
      if (oStart !== null && oEnd !== null && current >= oStart && current < oEnd) {
         slotStr += " (Online)";
      }

      slotsToCreate.push(slotStr);
      current = next;
    }

    if (slotsToCreate.length === 0) return showAlert("Sikertelen generálás", "A megadott feltételekkel (intervallum, szünetek) nem jött létre egyetlen időpont sem.");
    
    showConfirm(
      "Napi előjegyzés generálása",
      `Sikeresen kiszámoltam ${slotsToCreate.length} db új időpontot a kiválaszt napra.\n\nLétrehozhatom őket?`,
      "Lista Generálása",
      "bg-red-600 hover:bg-red-700 text-white",
      async () => {
        const modifierName = getDisplayName();
        const now = new Date().toISOString();
        const newAppointments = slotsToCreate.map((slot: string) => ({
          department: activeTab, appointment_date: selectedDate, time_slot: slot,
          patient_name: "", taj_szam: "", phone_number: "", birth_date: "", examination_type: "", notes: "", status: "Előjegyzett",
          last_modified_by: modifierName, last_modified_at: now, is_deleted: false
        }));

        const { data } = await supabase.from("appointments").insert(newAppointments).select();
        
        if (data) {
           const logs = data.map((app: any) => ({
              appointment_id: app.id, modified_by: modifierName, action: "Létrehozás", details: "Napi lista generálással létrehozva"
           }));
           await supabase.from('appointment_logs').insert(logs);
        }
        showToast("Napi időpontok sikeresen legenerálva!");
      }
    );
  };

  const addDaySingleAppointment = async (date: string) => {
    const slot = dayNewTimeSlots[date];
    if (!user || !slot || !slot.trim()) return showAlert("Hiányzó adat", "Kérlek, adj meg egy pontos időpontot (pl. 17:00)!");
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    const { data } = await supabase.from("appointments").insert([{
      department: activeTab, appointment_date: date, time_slot: slot.trim(),
      patient_name: "", taj_szam: "", phone_number: "", birth_date: "", examination_type: "", notes: "", status: "Előjegyzett",
      last_modified_by: modifierName, last_modified_at: now, is_deleted: false
    }]).select();
    
    if (data && data[0]) {
       await logAction(data[0].id, "Létrehozás", `Egyedi időpont manuálisan hozzáadva (${slot})`);
    }
    setDayNewTimeSlots(prev => ({...prev, [date]: ""}));
    showToast("Új időpont sikeresen hozzáadva!");
  };

  const restoreAppointment = async (id: number) => {
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    setAppointments(prev => prev.map((app: any) => app.id === id ? { ...app, is_deleted: false, last_modified_by: modifierName, last_modified_at: now } : app));
    await supabase.from("appointments").update({ is_deleted: false, last_modified_by: modifierName, last_modified_at: now }).eq("id", id);
    await logAction(id, "Visszaállítás", "Törölt időpont visszaállítva");
    showToast("Időpont sikeresen visszaállítva!");
  };

  // --- UI COMPONENTEK ---

  const customModalUI = (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 no-print transition-all duration-300 ${modal.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
      <div className={`relative bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] p-6 md:p-8 w-full max-w-sm border border-slate-100 flex flex-col transform transition-all duration-300 ${modal.isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="flex justify-center mb-5">
           {modal.type === 'alert' ? (
              <div className="bg-red-50 text-red-500 p-4 rounded-full shadow-inner"><AlertModalIcon /></div>
           ) : (
              <div className="bg-blue-50 text-blue-500 p-4 rounded-full shadow-inner"><QuestionModalIcon /></div>
           )}
        </div>
        <h3 className="text-xl font-extrabold text-center text-slate-900 mb-3">{modal.title}</h3>
        <p className="text-slate-600 text-sm font-medium text-center mb-8 whitespace-pre-line leading-relaxed">{modal.message}</p>
        
        <div className="flex flex-col gap-3 mt-auto">
           {modal.type === "confirm" && (
              <button onClick={closeModal} className="w-full py-3.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-all shadow-sm active:scale-95">Mégsem</button>
           )}
           <button onClick={modal.onConfirm} className={`w-full py-3.5 rounded-xl font-bold shadow-md transition-all active:scale-95 ${modal.confirmColor}`}>{modal.confirmText}</button>
        </div>
      </div>
    </div>
  );

  const priceModalUI = (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 no-print transition-all duration-300 ${isPriceModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPriceModalOpen(false)}></div>
      <div className={`relative bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] w-full max-w-2xl border border-slate-200 flex flex-col transform transition-all duration-300 max-h-[90vh] ${isPriceModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-xl"><TagIcon /></div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Árlista</h3>
              <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{activeTab}</p>
            </div>
          </div>
          <button onClick={() => setIsPriceModalOpen(false)} className="p-2 bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-600 rounded-xl transition-colors font-bold text-sm">Bezár (Esc)</button>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar flex-1 bg-slate-50/50">
          {currentPrices.length === 0 ? (
            <div className="text-center text-slate-500 font-medium py-10 border-2 border-dashed border-slate-200 rounded-2xl">
              Nincsenek még árak felvéve ehhez a szakrendeléshez.<br/>Kattints az "Új tétel hozzáadása" gombra!
            </div>
          ) : (
            <div className="space-y-3">
              {currentPrices.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-200 hover:border-slate-300 transition-all items-center">
                  <div className="w-full sm:flex-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Vizsgálat megnevezése</label>
                    <input type="text" value={item.name} onChange={(e) => updatePriceItem(item.id, 'name', e.target.value)} placeholder="pl. Hasi ultrahang" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none font-bold text-slate-800" />
                  </div>
                  <div className="w-full sm:w-40">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Ár</label>
                    <input type="text" value={item.price} onChange={(e) => updatePriceItem(item.id, 'price', e.target.value)} placeholder="pl. 15.000 Ft" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none font-bold text-slate-800" />
                  </div>
                  <button onClick={() => removePriceItem(item.id)} className="w-full sm:w-auto mt-4 sm:mt-5 p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex justify-center items-center">
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <button onClick={addPriceItem} className="mt-4 w-full border-2 border-dashed border-slate-300 text-slate-600 hover:border-emerald-500 hover:text-emerald-700 bg-white py-3 rounded-2xl font-bold transition-all flex justify-center items-center gap-2">
            <PlusIcon /> Új tétel hozzáadása
          </button>
        </div>

        <div className="p-6 border-t border-slate-100 shrink-0 bg-white rounded-b-3xl">
           <button onClick={savePrices} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2">
             Mentés és Bezárás
           </button>
        </div>
      </div>
    </div>
  );

  const deptModalUI = (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 no-print transition-all duration-300 ${isDeptModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDeptModalOpen(false)}></div>
      <div className={`relative bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] w-full max-w-lg border border-slate-200 flex flex-col transform transition-all duration-300 max-h-[90vh] ${isDeptModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 text-slate-600 p-2.5 rounded-xl"><SettingsIcon size={20} /></div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Szakrendelések kezelése</h3>
              <p className="text-sm font-bold text-slate-500">Új hozzáadása vagy meglévő törlése</p>
            </div>
          </div>
          <button onClick={() => setIsDeptModalOpen(false)} className="p-2 bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-600 rounded-xl transition-colors font-bold text-sm">Bezár (Esc)</button>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar flex-1 bg-slate-50/50">
          {categories.length === 0 ? (
            <p className="text-center text-slate-500 font-medium py-4">Nincs még szakrendelés a rendszerben.</p>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <span className="font-bold text-slate-800">{cat}</span>
                  <button onClick={() => handleDeleteDepartment(cat)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Törlés">
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 shrink-0 bg-white rounded-b-3xl">
           <div className="flex flex-col sm:flex-row gap-3">
             <input 
               type="text" 
               placeholder="Új szakrendelés neve..." 
               value={newDeptName} 
               onChange={(e) => setNewDeptName(e.target.value)} 
               onKeyDown={(e) => e.key === "Enter" && handleAddDepartment()}
               className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-slate-200 focus:border-slate-500 outline-none font-semibold text-slate-800"
             />
             <button onClick={handleAddDepartment} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2">
               <PlusIcon /> Hozzáadás
             </button>
           </div>
        </div>
      </div>
    </div>
  );

  const bugModalUI = (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 no-print transition-all duration-300 ${isBugModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSubmittingBug && setIsBugModalOpen(false)}></div>
      <div className={`relative bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] w-full max-w-lg border border-slate-200 flex flex-col transform transition-all duration-300 ${isBugModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 text-amber-600 p-2.5 rounded-xl"><FeedbackIcon size={24} /></div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Hibabejelentő</h3>
              <p className="text-sm font-bold text-slate-500">Ötlet vagy probléma küldése a fejlesztőnek</p>
            </div>
          </div>
          <button disabled={isSubmittingBug} onClick={() => setIsBugModalOpen(false)} className="p-2 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-xl transition-colors font-bold text-sm shadow-sm disabled:opacity-50">Bezár (Esc)</button>
        </div>

        <div className="p-6 flex-1 bg-white">
          <div className="mb-4">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-2">Mit tapasztaltál? Milyen ötleted van?</label>
            <textarea 
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              placeholder="Írd le ide részletesen..."
              rows={4}
              disabled={isSubmittingBug}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-100 focus:border-amber-500 outline-none font-medium text-slate-800 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-2">Kép csatolása (Opcionális)</label>
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => setBugFile(e.target.files ? e.target.files[0] : null)}
              disabled={isSubmittingBug}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 file:transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 shrink-0 bg-white rounded-b-3xl">
           <button 
             onClick={handleBugSubmit} 
             disabled={isSubmittingBug}
             className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
           >
             {isSubmittingBug ? <span className="flex items-center gap-2 animate-pulse"><RefreshIcon /> Küldés folyamatban...</span> : "E-mail küldése"}
           </button>
        </div>
      </div>
    </div>
  );

  const patientHistoryModalUI = (
    <div className={`fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-0 no-print transition-all duration-300 ${historyModal.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeHistoryModal}></div>
      <div className={`relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] w-full max-w-2xl border border-slate-200 flex flex-col transform transition-all duration-300 max-h-[90vh] ${historyModal.isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white/50 rounded-t-3xl shrink-0">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><HistoryIcon /> {historyModal.patientName} - Előzmények</h3>
            {historyModal.taj && <p className="text-sm font-bold text-slate-500 mt-1">TAJ: {formatTAJ(historyModal.taj)}</p>}
          </div>
          <button onClick={closeHistoryModal} className="p-2 bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-600 rounded-xl transition-colors font-bold text-sm">Bezár (Esc)</button>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar h-full">
          {historyModal.data.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-10 opacity-50">
               <RefreshIcon />
               <p className="text-center text-slate-500 font-medium mt-4">Betöltés folyamatban, vagy nincs előzmény...</p>
             </div>
          ) : (
            <div className="space-y-4">
              {historyModal.data.map((app, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 justify-between hover:border-slate-300 transition-colors">
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{formatShortDate(app.appointment_date)}</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-extrabold">{app.time_slot.replace(" (Online)", "")}</span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border border-blue-100">{app.department}</span>
                     </div>
                     <div className="text-sm font-medium text-slate-600 mt-2">
                        {app.examination_type ? <span>Vizsgálat: <b className="text-slate-800">{app.examination_type}</b></span> : <span className="italic opacity-60">Nincs vizsgálat rögzítve</span>}
                        {app.notes && <span className="ml-3 border-l pl-3 border-slate-300">Jegyzet: <b className="text-slate-800">{app.notes}</b></span>}
                     </div>
                   </div>
                   <div className="shrink-0">
                     <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg border shadow-sm
                       ${app.status === "Megérkezett" ? "bg-amber-100 text-amber-800 border-amber-200" :
                         app.status === "Vizsgálaton" ? "bg-blue-100 text-blue-800 border-blue-200" :
                         app.status === "Befejezve" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                         app.status === "Nem jelent meg" ? "bg-slate-800 text-white border-slate-900" :
                         "bg-slate-100 text-slate-700 border-slate-200"
                       }`}>
                       {app.status || "Előjegyzett"}
                     </span>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const infoModalUI = (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 no-print transition-all duration-300 ${appInfoModal.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeAppInfoModal}></div>
      <div className={`relative bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-lg border border-slate-100 flex flex-col transform transition-all duration-300 max-h-[90vh] ${appInfoModal.isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-3xl shrink-0">
           <div className="flex items-center gap-3">
             <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl"><InfoIcon /></div>
             <div>
               <h3 className="text-xl font-extrabold text-slate-900">Napló</h3>
               <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{appInfoModal.data?.time_slot.replace(" (Online)", "")} {appInfoModal.data?.patient_name && `• ${appInfoModal.data.patient_name}`}</p>
             </div>
           </div>
           <button onClick={closeAppInfoModal} className="p-2 bg-white hover:bg-slate-200 text-slate-600 rounded-xl transition-colors font-bold shadow-sm border border-slate-200"><TrashIcon size={20} /></button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
          {appInfoModal.loading ? (
             <div className="flex justify-center items-center py-10 opacity-50 animate-pulse"><RefreshIcon /></div>
          ) : appInfoModal.logs.length === 0 ? (
             <p className="text-center text-slate-500 text-sm font-medium py-6 italic">Nincs még bejegyzés erről az időpontról.</p>
          ) : (
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pb-4">
              {appInfoModal.logs.map((log, idx) => {
                 let bgColor = "bg-blue-100 border-blue-200 text-blue-600";
                 if (log.action === "Törlés") bgColor = "bg-red-100 border-red-200 text-red-600";
                 if (log.action === "Létrehozás") bgColor = "bg-emerald-100 border-emerald-200 text-emerald-600";
                 if (log.action === "Visszaállítás") bgColor = "bg-amber-100 border-amber-200 text-amber-600";
                 
                 return (
                   <div key={idx} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${bgColor.split(" ")[0]}`}></div>
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl shadow-sm">
                         <div className="flex justify-between items-center mb-1.5 gap-2">
                           <span className={`text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded ${bgColor}`}>{log.action}</span>
                           <span className="text-xs font-bold text-slate-400">{formatDateTime(log.modified_at)}</span>
                         </div>
                         <p className="text-sm font-bold text-slate-800 mb-1">{log.modified_by}</p>
                         <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white p-2 rounded-xl border border-slate-100">{log.details}</p>
                      </div>
                   </div>
                 );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const toastUI = (
    <div className={`fixed bottom-6 right-6 z-[999] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-100 p-4 flex items-center gap-3 transform transition-all duration-300 pointer-events-none 
      ${toast.visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`}>
      <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : toast.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
        {toast.type === 'success' ? <CheckCircleIcon /> : toast.type === 'warning' ? <AlertModalIcon /> : <XCircleIcon />}
      </div>
      <p className="font-bold text-sm text-slate-800 pr-2">{toast.message}</p>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 font-sans bg-cover bg-center bg-fixed relative" style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')` }}>
        {customModalUI}
        <div className="absolute inset-0 bg-slate-100/60 backdrop-blur-2xl z-0 pointer-events-none"></div>
        <div className="relative z-10 bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-md border border-white/50">
          <div className="flex justify-center mb-8"><img src="/logo.png" alt="Medical-Aqua Logo" className="h-28 object-contain select-none pointer-events-none drop-shadow-sm" /></div>
          
          <h2 className="text-2xl font-bold mb-2 text-center text-slate-900 tracking-tight">Előjegyzés</h2>
          <p className="text-center text-slate-600 mb-8 text-sm font-medium">Jelentkezz be a folytatáshoz</p>
          
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><MailIcon /></div>
              <input type="email" placeholder="E-mail cím" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full p-3.5 pl-14 rounded-xl border border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all font-semibold" />
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><LockIcon /></div>
              <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full p-3.5 pl-14 rounded-xl border border-slate-200 bg-white/80 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all font-semibold" />
            </div>
            
            <button onClick={handleLogin} className="w-full bg-red-600 text-white py-3.5 rounded-xl font-semibold shadow-md hover:bg-red-700 hover:shadow-lg transition-all active:scale-95 mt-2">Bejelentkezés</button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200/60 text-center">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Ha nincs felhasználója vagy nem tud bejelentkezni,<br/>vegye fel a kapcsolatot a <span className="font-bold text-slate-700">rendszergazdával</span>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (needsProfileName) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 font-sans bg-cover bg-center bg-fixed relative" style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')` }}>
        {customModalUI}
        <div className="absolute inset-0 bg-slate-100/60 backdrop-blur-2xl z-0 pointer-events-none"></div>
        <div className="relative z-10 bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-md border border-white/50 text-center">
          <div className="flex justify-center text-red-600 mb-6 drop-shadow-sm"><UserIcon /></div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900">Üdvözlünk a rendszerben!</h2>
          <p className="text-slate-600 mb-8 text-sm font-medium">Kérjük, add meg a teljes nevedet a naplózáshoz (pl. Dr. Kovács).</p>
          <input type="text" placeholder="Teljes neved..." value={profileNameInput} onChange={(e) => setProfileNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSaveProfileName()} className="w-full p-4 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all font-semibold mb-4 text-center" />
          <button onClick={handleSaveProfileName} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold shadow-md hover:bg-black transition-all active:scale-95">Mentés és Tovább</button>
        </div>
      </div>
    );
  }

  if (showStats) {
    let validApps = appointments.filter(a => !a.is_deleted && a.patient_name && a.patient_name.trim() !== "");
    
    const todayStr = new Date().toISOString().split('T')[0];
    const currentMonthStr = todayStr.substring(0, 7); 
    
    const now = new Date();
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
    const mon = new Date(now); mon.setDate(now.getDate() - dayOfWeek + 1);
    const sun = new Date(now); sun.setDate(now.getDate() - dayOfWeek + 7);
    const monStr = mon.toISOString().split('T')[0];
    const sunStr = sun.toISOString().split('T')[0];

    if (statsPeriod === 'today') {
      validApps = validApps.filter(a => a.appointment_date === todayStr);
    } else if (statsPeriod === 'week') {
      validApps = validApps.filter(a => a.appointment_date >= monStr && a.appointment_date <= sunStr);
    } else if (statsPeriod === 'month') {
      validApps = validApps.filter(a => a.appointment_date.startsWith(currentMonthStr));
    }

    const totalBooked = validApps.length;
    const completed = validApps.filter(a => a.status === 'Befejezve').length;
    const noShow = validApps.filter(a => a.status === 'Nem jelent meg').length;
    
    const deptCounts: Record<string, number> = {};
    validApps.forEach(a => {
        deptCounts[a.department] = (deptCounts[a.department] || 0) + 1;
    });
    const deptStats = Object.entries(deptCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
    const maxDeptCount = Math.max(...deptStats.map(d => d.count), 1);

    const statuses = ['Előjegyzett', 'Megérkezett', 'Vizsgálaton', 'Befejezve', 'Nem jelent meg'];
    const statusCounts = statuses.map(st => {
       const count = validApps.filter(a => (a.status || 'Előjegyzett') === st).length;
       return { name: st, count };
    }).filter(s => s.count > 0);
    const maxStatusCount = Math.max(...statusCounts.map(s => s.count), 1);

    let totalRevenue = 0;
    validApps.forEach(app => {
       if (!app.examination_type) return;
       const deptPrices = allPrices.filter(p => p.department === app.department);
       const examStr = app.examination_type.toLowerCase();
       const matchedPrice = deptPrices.find(p => examStr.includes(p.name.toLowerCase()) || p.name.toLowerCase().includes(examStr));
       if (matchedPrice) {
          const priceVal = parseInt(matchedPrice.price.replace(/[^0-9]/g, ''), 10);
          if (!isNaN(priceVal)) totalRevenue += priceVal;
       }
    });

    return (
      <div className="min-h-screen bg-slate-50 font-sans relative pb-10">
        <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-200 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <img src="/logo.png" alt="Medical-Aqua" className="h-10 object-contain" />
               <div>
                 <h1 className="text-xl font-bold tracking-tight text-slate-900">Vezetői Műszerfal</h1>
                 <p className="text-blue-600 font-medium text-[11px] tracking-widest uppercase">Statisztikák és Kimutatások</p>
               </div>
            </div>
            <button onClick={() => setShowStats(false)} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-sm hover:bg-black transition-all active:scale-95 flex items-center gap-2">
              <ChevronLeftIcon /> Vissza az Előjegyzéshez
            </button>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8">
          
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-2 w-max mx-auto md:mx-0 mb-8">
            {[
              { id: 'today', label: 'Ma' },
              { id: 'week', label: 'Ezen a héten' },
              { id: 'month', label: 'Ebben a hónapban' },
              { id: 'all', label: 'Összesített' }
            ].map(period => (
              <button 
                key={period.id}
                onClick={() => setStatsPeriod(period.id as any)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${statsPeriod === period.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                {period.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
             <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-200">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><UserIcon /></div>
                 <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Összes Páciens</h3>
               </div>
               <p className="text-4xl font-extrabold text-slate-900">{totalBooked}</p>
               <p className="text-xs font-medium text-slate-400 mt-2">Sikeresen rögzítve az időszakban</p>
             </div>

             <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-200">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircleIcon /></div>
                 <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Befejezett Vizsgálatok</h3>
               </div>
               <p className="text-4xl font-extrabold text-emerald-600">{completed}</p>
               <p className="text-xs font-bold text-emerald-500/70 mt-2">{totalBooked > 0 ? Math.round((completed / totalBooked) * 100) : 0}%-os sikerességi arány</p>
             </div>

             <div className="bg-white p-6 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-slate-200">
               <div className="flex items-center gap-3 mb-4">
                 <div className="p-3 bg-slate-100 text-slate-600 rounded-xl"><XCircleIcon /></div>
                 <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Meg Nem Jelent</h3>
               </div>
               <p className="text-4xl font-extrabold text-slate-800">{noShow}</p>
               <p className="text-xs font-bold text-slate-400 mt-2">{totalBooked > 0 ? Math.round((noShow / totalBooked) * 100) : 0}%-os lemorzsolódás</p>
             </div>

             <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-3xl shadow-lg border border-amber-400 text-white relative overflow-hidden">
               <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4"><TrendingUpIcon size={120} /></div>
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-3 bg-white/20 rounded-xl"><CalculatorIcon size={24} /></div>
                   <h3 className="text-xs font-extrabold uppercase tracking-widest text-amber-100">Becsült Bevétel</h3>
                 </div>
                 <p className="text-3xl font-extrabold">{new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(totalRevenue)}</p>
                 <p className="text-xs font-medium text-amber-200 mt-2">Árlisták és beírt vizsgálatok alapján</p>
               </div>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2"><ListPlusIcon /> Szakrendelések forgalma</h2>
                
                {deptStats.length === 0 ? (
                  <p className="text-sm font-medium text-slate-400 italic">Nincs adat az adott időszakra.</p>
                ) : (
                  <div className="space-y-4">
                    {deptStats.map(dept => (
                      <div key={dept.name} className="flex items-center gap-4">
                        <div className="w-32 text-sm font-bold text-slate-700 truncate" title={dept.name}>{dept.name}</div>
                        <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden relative">
                           <div 
                             className="absolute top-0 left-0 h-full bg-blue-500 rounded-full transition-all duration-1000" 
                             style={{ width: `${(dept.count / maxDeptCount) * 100}%` }}
                           ></div>
                        </div>
                        <div className="w-10 text-right text-sm font-extrabold text-slate-900">{dept.count} <span className="text-[10px] text-slate-400 font-medium">db</span></div>
                      </div>
                    ))}
                  </div>
                )}
             </div>

             <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2"><ChartPieIcon /> Státuszok eloszlása</h2>
                
                {statusCounts.length === 0 ? (
                  <p className="text-sm font-medium text-slate-400 italic">Nincs adat az adott időszakra.</p>
                ) : (
                  <div className="space-y-4">
                    {statusCounts.map(st => {
                      const color = 
                        st.name === 'Befejezve' ? 'bg-emerald-500' :
                        st.name === 'Vizsgálaton' ? 'bg-blue-400' :
                        st.name === 'Megérkezett' ? 'bg-amber-400' :
                        st.name === 'Nem jelent meg' ? 'bg-slate-800' :
                        'bg-slate-300';
                      
                      return (
                        <div key={st.name} className="flex items-center gap-4">
                          <div className="w-32 text-sm font-bold text-slate-700 truncate" title={st.name}>{st.name}</div>
                          <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden relative">
                            <div 
                              className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ${color}`} 
                              style={{ width: `${(st.count / maxStatusCount) * 100}%` }}
                            ></div>
                          </div>
                          <div className="w-10 text-right text-sm font-extrabold text-slate-900">{st.count} <span className="text-[10px] text-slate-400 font-medium">db</span></div>
                        </div>
                      );
                    })}
                  </div>
                )}
             </div>
          </div>

        </div>
      </div>
    );
  }

  if (showPatients) {
    const filteredPatientsList = patientsList.filter(p => {
      if (!patientsSearchTerm) return true;
      const term = patientsSearchTerm.toLowerCase().replace(/\s+/g, '');
      const nameMatch = (p.name || "").toLowerCase().includes(term);
      const tajMatch = (p.taj_szam || "").replace(/\s+/g, '').includes(term);
      const phoneMatch = (p.phone_number || "").replace(/\s+/g, '').includes(term);
      const birthMatch = (p.birth_date || "").includes(term);
      return nameMatch || tajMatch || phoneMatch || birthMatch;
    });

    return (
      <div className="min-h-screen bg-slate-50 font-sans relative pb-10">
        {patientHistoryModalUI}
        {customModalUI}

        <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-200 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <img src="/logo.png" alt="Medical-Aqua" className="h-10 object-contain" />
               <div>
                 <h1 className="text-xl font-bold tracking-tight text-slate-900">Páciensek</h1>
                 <p className="text-purple-600 font-medium text-[11px] tracking-widest uppercase">Kartonok és Törzsadatok</p>
               </div>
            </div>
            <button onClick={() => setShowPatients(false)} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-sm hover:bg-black transition-all active:scale-95 flex items-center gap-2">
              <ChevronLeftIcon /> Vissza az Előjegyzéshez
            </button>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8">
          
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-3">
               <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><UsersIcon size={24} /></div>
               <div>
                 <h2 className="text-lg font-extrabold text-slate-900">Betegtörzs</h2>
                 <p className="text-sm font-medium text-slate-500">Összesen: <b className="text-slate-800">{patientsList.length}</b> regisztrált páciens</p>
               </div>
             </div>

             <div className="relative w-full md:w-96 group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors"><SearchIcon size={18} /></div>
                <input 
                  type="text" 
                  placeholder="Keresés név, TAJ, telefon vagy szül. idő..." 
                  value={patientsSearchTerm}
                  onChange={(e) => setPatientsSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-100 focus:border-purple-400 font-semibold text-slate-800 outline-none transition-all"
                />
             </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            {isLoadingPatients ? (
               <div className="flex flex-col justify-center items-center py-20 opacity-50 animate-pulse">
                 <RefreshIcon />
                 <p className="mt-4 font-bold text-slate-500">Betegtörzs betöltése...</p>
               </div>
            ) : filteredPatientsList.length === 0 ? (
               <div className="text-center py-20 text-slate-500">
                 <UsersIcon size={48} />
                 <p className="mt-4 font-bold text-lg text-slate-700">Nem található a keresésnek megfelelő páciens</p>
               </div>
            ) : (
               <div className="overflow-x-auto custom-scrollbar">
                 <table className="min-w-full text-left border-collapse">
                   <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                       <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap">Név</th>
                       <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap">Születési idő</th>
                       <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap">TAJ Szám</th>
                       <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap">Telefon</th>
                       <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap">Utolsó Látogatás</th>
                       <th className="px-6 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap text-right">Művelet</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {filteredPatientsList.map(patient => (
                       <tr key={patient.id} className="hover:bg-purple-50/30 transition-colors group">
                         <td className="px-6 py-4 font-extrabold text-slate-900">{patient.name}</td>
                         <td className="px-6 py-4 text-sm text-slate-600 font-medium">{patient.birth_date || "-"}</td>
                         <td className="px-6 py-4 font-mono text-sm text-slate-600">{formatTAJ(patient.taj_szam) || "-"}</td>
                         <td className="px-6 py-4 text-sm text-slate-600 font-medium">{formatPhone(patient.phone_number) || "-"}</td>
                         <td className="px-6 py-4 text-sm text-slate-500">
                           {patient.last_visit ? formatShortDate(patient.last_visit.split('T')[0]) : "Ismeretlen"}
                         </td>
                         <td className="px-6 py-4 text-right">
                           <button 
                             onClick={() => openPatientHistory(patient.name, patient.taj_szam)}
                             className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 whitespace-nowrap"
                           >
                             <HistoryIcon /> Karton megnyitása
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // --- LABOR KALKULÁTOR / NYOMTATÁSI NÉZET ---
  if (showLabCalculator) {
    const selectedItems = getSelectedLabItemsData();
    const totalPrice = calculateLabTotal();
    const formattedTotal = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(totalPrice);
    
    // Szabad labor időpontok (A legördülő menühöz)
    const availableSlots = labSlots.filter(s => !s.is_booked);
    const availableSlotsByDate = availableSlots.reduce((acc: any, slot: any) => {
       if (!acc[slot.slot_date]) acc[slot.slot_date] = [];
       acc[slot.slot_date].push(slot);
       return acc;
    }, {});
    
    // Mentett kalkulációk dátum szerinti csoportosítása (Érkezés alapján)
    const groupedSavedLabs = savedCalculations.reduce((acc: any, curr: any) => {
      const targetDate = curr.erkezesi_ido ? curr.erkezesi_ido : curr.created_at;
      const dateKey = targetDate ? targetDate.split('T')[0] : "Ismeretlen";
      
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(curr);
      return acc;
    }, {});
    const sortedSavedDates = Object.keys(groupedSavedLabs).sort((a, b) => b.localeCompare(a));

    return (
      <div className={`min-h-screen font-sans relative ${printingLabQuote ? 'bg-white print-mode' : 'bg-slate-50 overflow-hidden flex flex-col'}`}>
        {customModalUI}
        {toastUI}
        
        {!printingLabQuote && (
          <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-200 shadow-sm no-print">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-3 flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <img src="/logo.png" alt="Medical-Aqua" className="h-10 object-contain" />
                 <div>
                   <h1 className="text-xl font-bold tracking-tight text-slate-900">Laboratórium</h1>
                   <p className="text-emerald-600 font-medium text-[11px] tracking-widest uppercase">Kalkulátor és Ajánlatok</p>
                 </div>
              </div>
              <button onClick={() => setShowLabCalculator(false)} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-sm hover:bg-black transition-all active:scale-95 flex items-center gap-2">
                <ChevronLeftIcon /> Vissza az Előjegyzéshez
              </button>
            </div>
            
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 mt-4 flex gap-6 border-b border-slate-200 shrink-0 overflow-x-auto no-scrollbar">
               <button 
                 onClick={() => setActiveLabTab('new')} 
                 className={`py-3 px-2 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeLabTab === 'new' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
               >
                 <span className="flex items-center gap-2"><CalculatorIcon size={18}/> Új Ajánlat Készítése</span>
               </button>
               <button 
                 onClick={() => setActiveLabTab('slots')} 
                 className={`py-3 px-2 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeLabTab === 'slots' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
               >
                 <span className="flex items-center gap-2"><CalendarPlusIcon size={18}/> Labor Napok Generálása</span>
               </button>
               <button 
                 onClick={() => { setActiveLabTab('saved'); fetchSavedCalculations(); }} 
                 className={`py-3 px-2 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeLabTab === 'saved' ? 'border-emerald-500 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
               >
                 <span className="flex items-center gap-2"><DatabaseIcon size={18}/> Mentett Ajánlatok ({savedCalculations.length})</span>
               </button>
            </div>
          </div>
        )}

        <div className={`max-w-[1600px] w-full mx-auto ${printingLabQuote ? 'p-0 pt-0 max-w-none' : 'px-4 md:px-8 py-6 min-h-[calc(100vh-140px)] flex flex-col'}`}>
          
          {printingLabQuote && (
            <div className="bg-white text-black max-w-4xl mx-auto printable-quote">
              <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-3 mb-4">
                <div>
                  <img src="/logo.png" alt="Medical-Aqua" className="h-16 object-contain mb-2" />
                  <h1 className="text-2xl font-extrabold text-slate-900">Laboratóriumi ajánlat</h1>
                  <p className="text-slate-500 mt-0.5 font-medium text-sm">Dátum: {new Date().toLocaleDateString('hu-HU')}</p>
                </div>
                <div className="text-right text-xs text-slate-600 mt-1 space-y-0.5">
                  <p className="font-bold text-slate-800 text-sm">Medical-Aqua Kft.</p>
                  <p>4700 Mátészalka, Eötvös utca 21.</p>
                  <p>Tel: +36 (30) 850-6149 | +36 (30) 083-3925</p>
                  <p>Email: kapcsolat@medical-aqua.hu</p>
                </div>
              </div>

              <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200 print-bg-light">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">Páciens neve</h2>
                    <p className="text-base font-bold text-slate-900">{printingSavedLab ? printingSavedLab.patient_name : (labPatientName || "Nincs megadva")}</p>
                  </div>
                  <div>
                    <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">Születési idő</h2>
                    <p className="text-sm font-bold text-slate-900">{printingSavedLab ? (printingSavedLab.birth_date || "-") : (labBirthDate || "-")}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">TAJ Szám</h2>
                    <p className="text-sm font-bold text-slate-900">{printingSavedLab ? (printingSavedLab.taj_szam || "-") : (labPatientTaj || "-")}</p>
                  </div>
                  <div className="col-span-2">
                    <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">Lakcím</h2>
                    <p className="text-sm font-bold text-slate-900">{printingSavedLab ? (printingSavedLab.address || "-") : (labPatientAddress || "-")}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">Kiválasztott vizsgálatok</h3>
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="py-1 px-1 font-bold text-slate-600">Vizsgálat megnevezése</th>
                      <th className="py-1 px-1 font-bold text-slate-600 text-right">Díj (HUF)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {printingSavedLab ? (
                      printingSavedLab.tests_list.split(', ').map((testName: string, i: number) => (
                        <tr key={i}>
                          <td className="py-1 px-1 font-bold text-slate-900">{testName}</td>
                          <td className="py-1 px-1 font-bold text-slate-900 text-right">-</td>
                        </tr>
                      ))
                    ) : (
                      selectedItems.map(item => (
                        <tr key={item.id}>
                          <td className="py-1 px-1 font-bold text-slate-900">{item.name}</td>
                          <td className="py-1 px-1 font-bold text-slate-900 text-right">{item.price === 0 ? "-" : `${item.price.toLocaleString('hu-HU')} Ft`}</td>
                        </tr>
                      ))
                    )}
                    
                    {!printingSavedLab && includeBloodDrawFee && (
                      <tr className="bg-slate-50 print-bg-light border-t-2 border-slate-200">
                        <td className="py-1 px-1 font-bold text-slate-900">Vérvételi / Kezelési díj</td>
                        <td className="py-1 px-1 font-bold text-slate-900 text-right">6 000 Ft</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end border-t border-emerald-600 pt-3">
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Fizetendő végösszeg</p>
                  <p className="text-2xl font-extrabold text-emerald-700">
                     {printingSavedLab ? `${printingSavedLab.total_price.toLocaleString('hu-HU')} Ft` : formattedTotal}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between items-end text-[10px] text-slate-500 border-t border-slate-200 pt-4">
                 <span>Kiállította: <b className="text-slate-700">{printingSavedLab ? printingSavedLab.created_by : getDisplayName()}</b></span>
                 <span className="text-right">A fenti árak tájékoztató jellegűek. Az ajánlat a kiállítás napjától számított 30 napig érvényes.</span>
              </div>
            </div>
          )}

          {/* ÚJ AJÁNLAT FÜL */}
          {!printingLabQuote && activeLabTab === 'new' && (
            <div className="flex flex-col lg:flex-row gap-6 items-start flex-1 min-h-0 w-full animate-in fade-in duration-300">
              
              <div className="w-full lg:w-2/3 bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col min-h-0 h-full">
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ListPlusIcon /> Vizsgálatok kiválasztása</h2>
                  
                  <div className="relative w-64 group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"><SearchIcon size={16} /></div>
                    <input 
                      type="text" 
                      placeholder="Keresés a vizsgálatok között..." 
                      value={labSearchTerm}
                      onChange={(e) => setLabSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 py-2 pl-9 pr-4 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 font-semibold text-slate-800 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-3 space-y-4">
                  {LAB_DATABASE.map(cat => {
                    const filteredItems = cat.items.filter(i => i.name.toLowerCase().includes(labSearchTerm.toLowerCase()));
                    if (filteredItems.length === 0) return null;

                    return (
                      <div key={cat.category} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                          <h3 className="font-extrabold text-slate-800 text-sm">{cat.category}</h3>
                          <span className="text-xs font-bold text-slate-400">{filteredItems.length} vizsgálat</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                          {filteredItems.map(item => {
                            const isSelected = selectedLabTests.includes(item.id);
                            return (
                              <label key={item.id} className={`flex items-start gap-3 p-3 border-b border-r border-slate-50 cursor-pointer transition-all hover:bg-slate-50 ${isSelected ? 'bg-emerald-50/50' : ''}`}>
                                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                                  <input type="checkbox" className="sr-only" checked={isSelected} onChange={() => toggleLabTest(item.id)} />
                                  <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-bold leading-tight truncate ${isSelected ? 'text-emerald-900' : 'text-slate-700'}`} title={item.name}>{item.name}</p>
                                  <div className="flex gap-2 mt-1">
                                    <span className="text-[9px] font-extrabold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-100 shadow-sm">{item.price === 0 ? "Nincs ár" : `${item.price.toLocaleString('hu-HU')} Ft`}</span>
                                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 truncate"><HistoryIcon /> {item.time}</span>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="w-full lg:w-1/3 bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full min-h-0">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 shrink-0"><DocumentIcon /> Ajánlat & Páciens adatai</h2>
                
                <div className="mb-2 space-y-3 shrink-0 overflow-y-auto custom-scrollbar pr-1 max-h-[300px]">
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Név</label>
                      <input type="text" placeholder="Kovács János" value={labPatientName} onChange={(e) => setLabPatientName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 text-slate-800 font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Leánykori név</label>
                      <input type="text" placeholder="Uaz." value={labMaidenName} onChange={(e) => setLabMaidenName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 text-slate-800 font-bold" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Születési idő</label>
                      <input type="text" placeholder="1980.01.01" value={labBirthDate} onChange={(e) => setLabBirthDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 text-slate-800 font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Születési hely</label>
                      <input type="text" placeholder="Budapest" value={labBirthPlace} onChange={(e) => setLabBirthPlace(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 text-slate-800 font-bold" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">TAJ Szám</label>
                      <input type="text" placeholder="123 456 789" value={labPatientTaj} onChange={(e) => setLabPatientTaj(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 text-slate-800 font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Telefon</label>
                      <input type="text" placeholder="06 30 123 4567" value={labPhone} onChange={(e) => setLabPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 text-slate-800 font-bold" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">E-mail cím</label>
                    <input type="email" placeholder="minta@email.hu" value={labEmail} onChange={(e) => setLabEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 text-slate-800 font-bold" />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Érkezés pontos ideje (Opcionális)</label>
                    <select 
                      value={labSelectedSlotId} 
                      onChange={(e) => setLabSelectedSlotId(e.target.value)} 
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 text-slate-800 font-bold cursor-pointer"
                    >
                      <option value="">Nincs időpont választva (Séta be)</option>
                      {Object.keys(availableSlotsByDate).sort().map(date => (
                         <optgroup key={date} label={formatShortDate(date)}>
                           {availableSlotsByDate[date].map((s: any) => (
                              <option key={s.id} value={s.id}>{s.slot_time.substring(0, 5)}</option>
                           ))}
                         </optgroup>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Teljes Lakcím</label>
                    <input type="text" placeholder="1234 Budapest, Példa utca 1." value={labPatientAddress} onChange={(e) => setLabPatientAddress(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 text-slate-800 font-bold" />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 mb-4 mt-2 flex flex-col min-h-[120px] flex-1">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1.5 shrink-0">Kiválasztott tételek ({selectedItems.length})</h3>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1.5 min-h-[40px]">
                    {selectedItems.length === 0 ? (
                      <p className="text-xs text-slate-400 font-medium italic text-center py-2">Nincs kiválasztott vizsgálat.</p>
                    ) : (
                      selectedItems.map(item => (
                        <div key={item.id} className="flex justify-between items-start gap-2">
                          <span className="text-xs font-bold text-slate-700 leading-tight">{item.name}</span>
                          <span className="text-xs font-extrabold text-slate-900 whitespace-nowrap">{item.price === 0 ? "-" : `${item.price.toLocaleString('hu-HU')} Ft`}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200 shrink-0">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-2">
                         <div className="relative flex items-center justify-center">
                           <input type="checkbox" className="sr-only" checked={includeBloodDrawFee} onChange={(e) => setIncludeBloodDrawFee(e.target.checked)} />
                           <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${includeBloodDrawFee ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}>
                             <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                           </div>
                         </div>
                         <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Vérvételi / Kezelési díj</span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900">6 000 Ft</span>
                    </label>
                  </div>
                </div>

                <div className="shrink-0 space-y-3">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Végösszeg</span>
                    <span className="text-2xl font-extrabold text-emerald-600">{formattedTotal}</span>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={handleSaveLabCalculation} 
                      disabled={selectedItems.length === 0}
                      className="w-1/2 py-3 rounded-xl font-bold shadow-md transition-all active:scale-95 flex justify-center items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Kezelési díj nélkül menti az adatbázisba"
                    >
                      <DatabaseIcon /> {editingLabId ? "Frissítés (Mentés)" : "Mentés (Adatbázis)"}
                    </button>
                    <button 
                      onClick={handlePrintLabQuote} 
                      disabled={selectedItems.length === 0}
                      className="w-1/2 py-3 rounded-xl font-bold shadow-md transition-all active:scale-95 flex justify-center items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <PrintIcon /> Nyomtatás (PDF)
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ÚJ NÉZET: LABOR NAPOK GENERÁLÁSA */}
          {!printingLabQuote && activeLabTab === 'slots' && (
            <div className="flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mb-8">
                  <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><CalendarPlusIcon /> Új labor nap generálása</h2>
                  <div className="flex flex-wrap items-end gap-4">
                    <div className="w-full sm:w-auto sm:flex-1 md:w-[220px] md:flex-none">
                       <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Dátum</label>
                       <ModernDatePicker selectedDate={labGenDate} onChange={setLabGenDate} />
                    </div>
                    <div className="w-[calc(50%-0.5rem)] sm:w-24">
                       <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Kezdés</label>
                       <input type="time" value={labGenStart} onChange={(e) => setLabGenStart(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm outline-none font-bold text-slate-800" />
                    </div>
                    <div className="w-[calc(50%-0.5rem)] sm:w-24">
                       <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Befejezés</label>
                       <input type="time" value={labGenEnd} onChange={(e) => setLabGenEnd(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm outline-none font-bold text-slate-800" />
                    </div>
                    <div className="w-full sm:w-20">
                       <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Perc</label>
                       <input type="number" min="1" value={labGenDuration} onChange={(e) => setLabGenDuration(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm outline-none font-bold text-slate-800" />
                    </div>
                    <button onClick={generateLabSlots} className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition-all active:scale-95 sm:ml-auto">Generálás</button>
                  </div>
               </div>

               {Object.keys(labSlots.reduce((acc: any, s: any) => ({...acc, [s.slot_date]: true}), {})).sort().length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-slate-200">
                     <CalendarIcon size={48} />
                     <h3 className="text-xl font-bold text-slate-800 mb-2 mt-4">Nincsenek aktív labor napok</h3>
                     <p className="text-slate-500 font-medium text-sm">Generálj egy új napot a fenti sáv segítségével!</p>
                  </div>
               ) : (
                  <div className="space-y-6">
                    {Object.keys(labSlots.reduce((acc: any, s: any) => ({...acc, [s.slot_date]: true}), {})).sort().map(date => {
                       const daySlots = labSlots.filter(s => s.slot_date === date).sort((a,b) => a.slot_time.localeCompare(b.slot_time));
                       const bookedCount = daySlots.filter(s => s.is_booked).length;
                       const freeCount = daySlots.length - bookedCount;

                       return (
                         <div key={date} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                              <div className="flex items-center gap-3">
                                 <h3 className="text-lg font-extrabold text-slate-900">{formatShortDate(date)}</h3>
                                 <div className="flex gap-2">
                                   <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200">Összes: {daySlots.length}</span>
                                   <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-200">Szabad: {freeCount}</span>
                                   <span className="bg-red-100 text-red-800 px-2.5 py-1 rounded-lg text-xs font-bold border border-red-200">Foglalt: {bookedCount}</span>
                                 </div>
                              </div>
                              <button onClick={() => deleteLabDay(date)} className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5">
                                 <TrashIcon size={16} /> Nap törlése
                              </button>
                           </div>

                           <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-4">
                             {daySlots.map(slot => (
                                <div key={slot.id} className={`p-3 rounded-xl border text-center relative group flex flex-col items-center justify-center min-h-[60px] ${slot.is_booked ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'}`}>
                                   <span className={`text-sm font-extrabold ${slot.is_booked ? 'text-red-900' : 'text-emerald-900'}`}>{slot.slot_time.substring(0, 5)}</span>
                                   {slot.is_booked && (
                                     <div className="mt-1 text-[10px] font-bold text-red-700 truncate w-full px-1" title={slot.patient_name}>{slot.patient_name}</div>
                                   )}
                                </div>
                             ))}
                           </div>

                           {/* ÚJ: EGYEDI IDŐPONT HOZZÁADÁSA A LABOR NAPHOZ */}
                           <div className="border-t border-slate-100 pt-4 mt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                             <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                               <PlusIcon size={16} /> Egyedi időpont hozzáadása:
                             </div>
                             <div className="flex items-center gap-2 w-full sm:w-auto">
                               <input 
                                  type="time" 
                                  value={labDayNewTimeSlots[date] || ""} 
                                  onChange={(e) => setLabDayNewTimeSlots(prev => ({...prev, [date]: e.target.value}))}
                                  className="flex-1 sm:w-32 bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400"
                                />
                                <button 
                                  onClick={() => addLabDaySingleSlot(date)}
                                  className="bg-slate-800 text-white px-4 py-2 rounded-xl hover:bg-black transition-all font-bold text-xs shadow-sm active:scale-95"
                                >
                                  Hozzáadás
                                </button>
                             </div>
                           </div>
                         </div>
                       );
                    })}
                  </div>
               )}
            </div>
          )}

          {/* MENTETT AJÁNLATOK NÉZET */}
          {!printingLabQuote && activeLabTab === 'saved' && (
            <div className="flex-1 w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
               {isLoadingSavedLabs ? (
                 <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <RefreshIcon />
                    <p className="mt-4 font-bold text-slate-500">Mentett adatok betöltése...</p>
                 </div>
               ) : sortedSavedDates.length === 0 ? (
                 <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-slate-200">
                    <DatabaseIcon size={48} />
                    <h3 className="text-xl font-bold text-slate-800 mb-2 mt-4">Nincsenek mentett kalkulációk</h3>
                    <p className="text-slate-500 font-medium text-sm">Készíts egy új ajánlatot, és mentsd el, hogy itt megjelenjen!</p>
                 </div>
               ) : (
                 <div className="space-y-8">
                   {sortedSavedDates.map(dateKey => {
                      const displayDate = formatShortDate(dateKey); 
                      const labsForDay = groupedSavedLabs[dateKey];
                      
                      const dailyTotal = labsForDay.reduce((sum: number, calc: any) => sum + (calc.total_price || 0), 0);
                      const formattedDailyTotal = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(dailyTotal);
                      
                      return (
                        <div key={dateKey} className="bg-white/50 p-6 rounded-3xl border border-slate-200/60 shadow-sm backdrop-blur-md">
                          <h3 className="font-extrabold text-slate-800 text-lg mb-4 flex items-center flex-wrap gap-2 border-b border-slate-200 pb-2 w-full sm:w-max pr-6">
                            <CalendarIcon /> {displayDate}
                            <span className="bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest">{labsForDay.length} db</span>
                            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest ml-1 sm:ml-2">Összesen: {formattedDailyTotal}</span>
                          </h3>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {labsForDay.map((calc: any) => (
                              <div key={calc.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col h-full">
                                <div className="flex justify-between items-start mb-4">
                                   <div>
                                     <h4 className="font-extrabold text-slate-900 text-lg leading-tight">{calc.patient_name}</h4>
                                     {calc.maiden_name && <p className="text-xs text-slate-400 font-medium mt-0.5">Leánykori: {calc.maiden_name}</p>}
                                   </div>
                                   <div className="flex flex-col items-end gap-2">
                                     <span className="text-sm font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 whitespace-nowrap shrink-0 ml-2">
                                       {calc.total_price.toLocaleString('hu-HU')} Ft
                                     </span>
                                     <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 transition-colors">
                                        <input type="checkbox" checked={calc.megerkezett || false} onChange={() => toggleLabArrived(calc.id, calc.megerkezett || false)} className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" />
                                        <span className={`text-[10px] font-extrabold uppercase tracking-widest ${calc.megerkezett ? 'text-emerald-600' : 'text-slate-500'}`}>Megérkezett</span>
                                     </label>
                                   </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-[11px] text-slate-600 font-medium mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                   {calc.erkezesi_ido && <div className="col-span-2 bg-blue-50/50 p-2 rounded-lg border border-blue-100"><span className="block text-[9px] uppercase font-bold text-blue-500 tracking-widest">Tervezett érkezés</span><span className="font-bold text-blue-900 text-sm">{new Date(calc.erkezesi_ido).toLocaleString('hu-HU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span></div>}
                                   {calc.taj_szam && <div><span className="block text-[9px] uppercase font-bold text-slate-400 tracking-widest">TAJ</span><span className="font-bold text-slate-800">{formatTAJ(calc.taj_szam)}</span></div>}
                                   {calc.birth_date && <div><span className="block text-[9px] uppercase font-bold text-slate-400 tracking-widest">Szül. idő</span><span className="font-bold text-slate-800">{calc.birth_date}</span></div>}
                                   {calc.phone_number && <div><span className="block text-[9px] uppercase font-bold text-slate-400 tracking-widest">Telefon</span><span className="font-bold text-slate-800">{formatPhone(calc.phone_number)}</span></div>}
                                   {calc.email && <div><span className="block text-[9px] uppercase font-bold text-slate-400 tracking-widest">E-mail</span><span className="font-bold text-slate-800 truncate">{calc.email}</span></div>}
                                </div>

                                <div className="mb-4 flex-1">
                                   <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">Kért vizsgálatok</span>
                                   <p className="text-xs font-semibold text-slate-700 leading-relaxed bg-white border border-slate-100 p-2.5 rounded-xl line-clamp-3" title={calc.tests_list}>
                                     {calc.tests_list}
                                   </p>
                                </div>
                                
                                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                                   <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-md">
                                     {new Date(calc.created_at).toLocaleTimeString('hu-HU', {hour: '2-digit', minute:'2-digit'})} • {calc.created_by.split('@')[0]}
                                   </span>
                                   <div className="flex gap-1.5">
                                      <button 
                                        onClick={() => handleEditLabCalculation(calc)} 
                                        className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors border border-transparent hover:border-blue-200" 
                                        title="Szerkesztés"
                                      >
                                        <SettingsIcon size={18} />
                                      </button>
                                      <button 
                                        onClick={() => handlePrintSavedLab(calc)} 
                                        className="text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-colors border border-transparent hover:border-emerald-200" 
                                        title="Újra-nyomtatás"
                                      >
                                        <PrintIcon />
                                      </button>
                                      <button 
                                        onClick={() => deleteSavedCalculation(calc)} 
                                        className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-200" 
                                        title="Kalkuláció törlése"
                                      >
                                        <TrashIcon />
                                      </button>
                                   </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                   })}
                 </div>
               )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const filteredCategories = categories.filter(c => c.toLowerCase().includes(departmentSearch.toLowerCase()));
  const todayStr = new Date().toISOString().split('T')[0];

  let filteredAppointments = appointments;
  
  if (debouncedSearchTerm.trim() !== "") {
    const term = debouncedSearchTerm.toLowerCase();
    const termNoSpace = term.replace(/\s+/g, ''); 
    
    filteredAppointments = filteredAppointments.filter((app: any) => {
      const nameMatch = app.patient_name && app.patient_name.toLowerCase().includes(term);
      const tajMatch = app.taj_szam && app.taj_szam.replace(/\s+/g, '').includes(termNoSpace);
      const phoneMatch = app.phone_number && app.phone_number.replace(/\s+/g, '').includes(termNoSpace);
      const birthMatch = app.birth_date && app.birth_date.includes(term);
      return nameMatch || tajMatch || phoneMatch || birthMatch;
    });
  } else {
    filteredAppointments = filteredAppointments.filter((app: any) => app.department === activeTab);

    filteredAppointments = filteredAppointments.filter((app: any) => {
      const appDate = app.appointment_date || "";
      if (isArchiveView) {
        return appDate < todayStr; 
      } else {
        return appDate >= todayStr; 
      }
    });
  }

  if (!showDeleted) filteredAppointments = filteredAppointments.filter((app: any) => app.is_deleted !== true);
  
  const groupedByDate = filteredAppointments.reduce((acc: any, app: any) => {
    const d = app.appointment_date || "Dátum nélkül";
    if (!acc[d]) acc[d] = [];
    acc[d].push(app);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    if (isArchiveView) return b.localeCompare(a);
    return a.localeCompare(b);
  });

  const freeSlotsSummary = sortedDates.map(date => {
    const dayNormalAppointments = groupedByDate[date].filter((a: any) => !a.is_deleted && a.time_slot !== "VÁRÓLISTA");
    const bookedCount = dayNormalAppointments.filter((a: any) => a.patient_name && a.patient_name.trim() !== "").length;
    const freeCount = dayNormalAppointments.length - bookedCount;
    return { date, freeCount, total: dayNormalAppointments.length };
  }).filter(day => day.total > 0);

  if (printingDate) {
    const dayAppointments = groupedByDate[printingDate]?.sort((a: any, b: any) => a.time_slot.localeCompare(b.time_slot)) || [];
    return (
      <div className="bg-white text-black min-h-screen p-8 font-sans print-mode">
        <div className="mb-6 pb-4 border-b-2 border-black flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-black mb-1">{printingDate}</h1>
            <h2 className="text-xl font-bold text-slate-700">{activeTab} - Napi előjegyzési lista</h2>
          </div>
          <div className="text-right">
            <p className="text-sm font-bold text-slate-600">Készült: {new Date().toLocaleDateString('hu-HU')}</p>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-black">
              <th className="py-3 px-2 font-bold text-sm text-black">Időpont</th>
              <th className="py-3 px-2 font-bold text-sm text-black">Páciens neve</th>
              <th className="py-3 px-2 font-bold text-sm text-black">Szül. idő</th>
              <th className="py-3 px-2 font-bold text-sm text-black">TAJ szám</th>
              <th className="py-3 px-2 font-bold text-sm text-black">Telefon</th>
              <th className="py-3 px-2 font-bold text-sm text-black">Vizsgálat</th>
              <th className="py-3 px-2 font-bold text-sm text-black">Megjegyzés</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {dayAppointments.filter((app: any) => !app.is_deleted).map((app: any) => (
              <tr key={app.id} className="break-inside-avoid">
                <td className="py-3 px-2 font-bold text-black w-[100px]">
                  {app.time_slot === "VÁRÓLISTA" ? "VÁRÓLISTA" : app.time_slot.replace(" (Online)", "")}
                </td>
                <td className="py-3 px-2 font-bold text-black">{app.patient_name || "-"}</td>
                <td className="py-3 px-2 text-black">{app.birth_date || "-"}</td>
                <td className="py-3 px-2 font-mono text-black">{formatTAJ(app.taj_szam) || "-"}</td>
                <td className="py-3 px-2 text-black">{formatPhone(app.phone_number) || "-"}</td>
                <td className="py-3 px-2 text-black font-semibold">{app.examination_type || "-"}</td>
                <td className="py-3 px-2 text-black italic">{app.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans pb-10 bg-cover bg-center bg-fixed relative`} style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')` }}>
      {customModalUI}
      {patientHistoryModalUI}
      {priceModalUI}
      {infoModalUI}
      {deptModalUI}
      {bugModalUI}
      {toastUI}
      {!printingDate && <div className="absolute inset-0 bg-slate-100/70 backdrop-blur-2xl z-0 pointer-events-none no-print"></div>}

      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-white/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] relative no-print">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 md:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
             <img src="/logo.png" alt="Medical-Aqua" className="h-10 object-contain select-none pointer-events-none drop-shadow-sm" />
             <div className="hidden sm:block">
               <h1 className="text-xl font-bold tracking-tight text-slate-900">Medical-Aqua</h1>
               <p className="text-red-600 font-medium text-[11px] tracking-widest uppercase drop-shadow-sm">Előjegyzési Rendszer</p>
             </div>
          </div>
          
          <div className="flex-1 max-w-lg w-full relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors"><SearchIcon size={18} /></div>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Keresés név, TAJ, telefon vagy szül. idő... (Ctrl+K)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/80 border border-white/60 py-2 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 font-semibold text-slate-800 transition-all placeholder:font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto justify-center md:justify-end flex-wrap mt-2 md:mt-0">
            
            <button onClick={() => { setShowPatients(true); setShowStats(false); setShowLabCalculator(false); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-full text-xs font-bold transition-all shadow-sm">
              <UsersIcon size={16} />
              <span className="hidden xl:inline">Páciensek</span>
            </button>

            <button onClick={() => { setShowStats(true); setShowLabCalculator(false); setShowPatients(false); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-full text-xs font-bold transition-all shadow-sm">
              <ChartPieIcon size={16} />
              <span className="hidden xl:inline">Statisztika</span>
            </button>

            <button onClick={() => { setShowLabCalculator(true); setShowStats(false); setShowPatients(false); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold transition-all shadow-sm">
              <CalculatorIcon size={16} />
              <span className="hidden sm:inline">Labor kalkulátor</span>
            </button>

            <button onClick={() => setIsBugModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-xs font-bold transition-all shadow-sm">
              <FeedbackIcon size={16} />
              <span className="hidden lg:inline">Hibabejelentő</span>
            </button>

            <div className="relative" ref={notifRef}>
              <button onClick={toggleNotif} className="relative p-2 text-slate-500 hover:text-red-600 transition-colors ml-1 cursor-pointer">
                <BellIcon />
                {unreadCount > 0 && <span className="absolute top-0 right-0 translate-x-1 -translate-y-1 bg-red-500 text-white text-[10px] font-extrabold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white">{unreadCount}</span>}
              </button>
              {isNotifOpen && (
                 <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                   <div className="p-3.5 border-b border-slate-100 bg-slate-50/80 font-bold text-sm text-slate-800 flex items-center justify-between">
                     <span>Értesítések</span>
                     {unreadCount > 0 && <span className="text-[10px] bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{unreadCount} új</span>}
                   </div>
                   <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                         <div className="p-6 text-center text-sm font-medium text-slate-400">Nincsenek még értesítések.</div>
                      ) : (
                         notifications.map(n => {
                           const isPriceMod = n.message.includes("módosította az árlistát:");
                           return (
                             <div 
                               key={n.id} 
                               onClick={() => isPriceMod ? handleNotificationClick(n.message) : null}
                               className={`p-3.5 border-b border-slate-50 transition-colors flex gap-3 items-start ${isPriceMod ? 'cursor-pointer hover:bg-slate-100' : 'hover:bg-slate-50'}`}
                               title={isPriceMod ? "Kattints a megtekintéshez" : ""}
                             >
                                <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-xl mt-0.5 shrink-0 shadow-sm"><TagIcon /></div>
                                <div className="flex-1">
                                  <p className="text-sm text-slate-800 font-medium leading-snug">{n.message}</p>
                                  <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">{formatDateTime(n.created_at)}</p>
                                </div>
                                {isPriceMod && <div className="mt-2 text-slate-400"><ChevronRightIcon /></div>}
                             </div>
                           );
                         })
                      )}
                   </div>
                 </div>
              )}
            </div>

            <div className="relative ml-1" ref={onlineRef}>
              <button onClick={() => setIsOnlineDropdownOpen(!isOnlineDropdownOpen)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold transition-all shadow-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
                <span className="hidden xl:inline">{onlineUsers.length} online</span>
              </button>

              {isOnlineDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <div className="p-3 border-b border-slate-100 bg-slate-50/80 font-bold text-xs text-slate-500 uppercase tracking-widest">
                    Jelenleg aktív ({onlineUsers.length})
                  </div>
                  <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-1.5 space-y-1">
                    {onlineUsers.map((ou, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 p-2 hover:bg-slate-50 rounded-xl transition-colors">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-extrabold text-[10px]">
                          {ou.name?.substring(0, 2).toUpperCase() || "MA"}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-bold text-slate-800 truncate">{ou.name}</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.6)] shrink-0"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-slate-800 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 shadow-sm z-10 relative ml-1">
              <UserIcon /><span className="font-semibold text-sm hidden md:inline">{getDisplayName()}</span>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 transition-colors p-2 z-10 relative cursor-pointer" title="Kijelentkezés"><LogoutIcon /></button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8 relative z-10 min-h-[80vh]">
        
        {!printingDate && debouncedSearchTerm === "" && (
          <div className="relative z-30 bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm border border-white/60 p-6 mb-6 no-print">
            <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center justify-between">
              
              <div className="w-full xl:w-[45%] flex flex-col gap-4">
                
                <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-full sm:w-max shadow-inner border border-slate-200/60 mb-2">
                  <button
                    onClick={() => setIsArchiveView(false)}
                    className={`flex-1 sm:px-5 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ${!isArchiveView ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
                  >
                    Aktuális
                  </button>
                  <button
                    onClick={() => setIsArchiveView(true)}
                    className={`flex-1 sm:px-5 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 ${isArchiveView ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'}`}
                  >
                    Archívum
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-800">
                    <div className="bg-red-100 text-red-600 p-2 rounded-xl shadow-sm"><ActivityIcon size={18} /></div>
                    <span className="font-extrabold text-lg">Szakrendelés</span>
                  </div>
                  <div className="flex gap-2">
                    {activeTab && (
                      <button onClick={openPriceModal} className="text-xs font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95">
                        <TagIcon /> Árlista
                      </button>
                    )}
                    <button onClick={() => setIsDeptModalOpen(true)} className="text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95">
                      Kezelés
                    </button>
                  </div>
                </div>

                <div className="relative z-50 w-full" ref={deptDropdownRef}>
                  <button 
                    onClick={() => setIsDeptDropdownOpen(!isDeptDropdownOpen)}
                    className={`w-full bg-white border-2 text-left px-5 py-4 rounded-2xl flex justify-between items-center transition-all shadow-sm group cursor-pointer ${isDeptDropdownOpen ? 'border-red-400 ring-4 ring-red-50' : 'border-slate-100 hover:border-red-200'}`}
                  >
                    <div className="truncate pr-4">
                      <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-0.5">Kiválasztott szakrendelés</span>
                      <span className="block text-lg font-extrabold text-slate-800 group-hover:text-red-600 transition-colors truncate">
                        {activeTab || "Válassz szakrendelést..."}
                      </span>
                    </div>
                    <div className={`p-2 rounded-full transition-transform duration-300 shrink-0 ${isDeptDropdownOpen ? 'rotate-180 bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500 group-hover:bg-red-50 group-hover:text-red-500'}`}>
                      <ChevronDownIcon size={20} />
                    </div>
                  </button>

                  <div className={`absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden transition-all duration-300 origin-top ${isDeptDropdownOpen ? 'opacity-100 scale-y-100 visible' : 'opacity-0 scale-y-95 invisible'}`}>
                    <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon size={16} /></div>
                        <input 
                          type="text" 
                          placeholder="Keresés a szakrendelések között..." 
                          value={departmentSearch}
                          onChange={(e) => setDepartmentSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 font-semibold text-slate-800 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="max-h-[320px] overflow-y-auto custom-scrollbar p-2 grid grid-cols-1 sm:grid-cols-2 gap-1 bg-white">
                      {filteredCategories.length > 0 ? (
                         filteredCategories.map(c => (
                           <button
                             key={c}
                             onClick={() => { setActiveTab(c); setIsDeptDropdownOpen(false); setDepartmentSearch(""); }}
                             className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group cursor-pointer ${activeTab === c ? 'bg-red-50 text-red-700 shadow-sm' : 'hover:bg-slate-50 text-slate-700'}`}
                           >
                             <span className="truncate pr-2">{c}</span>
                             {activeTab === c && <CheckCircleIcon size={16} />}
                           </button>
                         ))
                      ) : (
                         <div className="col-span-full py-8 text-center text-sm font-medium text-slate-400 italic">Nincs találat a keresésre.</div>
                      )}
                    </div>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer group w-max mt-1">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors duration-300 border ${showDeleted ? "bg-slate-800 border-slate-800" : "bg-slate-200 border-slate-300 group-hover:border-slate-400"}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${showDeleted ? "translate-x-4" : "translate-x-0"}`}></div>
                  </div>
                  <span className={`font-semibold text-sm transition-colors duration-300 ${showDeleted ? "text-slate-800" : "text-slate-500 group-hover:text-slate-700"}`}>Törölt sorok mutatása</span>
                </label>
              </div>

              <div className="w-px h-[180px] bg-slate-200/60 hidden xl:block mx-4"></div>

              <div className={`w-full xl:w-auto flex-1 relative z-0 transition-opacity duration-300 ${isArchiveView ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                 <div className="flex items-center gap-2.5 mb-4 text-slate-800 font-extrabold text-lg">
                    <div className="bg-red-100 text-red-600 p-1.5 rounded-lg shadow-sm"><CalendarPlusIcon size={18} /></div>
                    <span>Napi előjegyzési lista létrehozása</span>
                 </div>
                 
                 <div className="flex flex-col gap-3 w-full">
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="w-full sm:w-auto sm:flex-1 md:w-[220px] md:flex-none">
                        <div className="flex justify-between items-center mb-1.5">
                           <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dátum</label>
                           <div className="flex gap-1">
                             <button onClick={() => setSelectedDate(getTodayDateStr())} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded transition-colors">MA</button>
                             <button onClick={() => setSelectedDate(getTomorrowDateStr())} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded transition-colors">HOLNAP</button>
                           </div>
                        </div>
                        <ModernDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
                      </div>

                      <div className="w-[calc(50%-0.375rem)] sm:w-20 md:w-24">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kezdés</label>
                        <input type="time" value={genStart} onChange={(e) => setGenStart(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none font-bold text-slate-800 transition-all shadow-sm" />
                      </div>
                      <div className="w-[calc(50%-0.375rem)] sm:w-20 md:w-24">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Befejezés</label>
                        <input type="time" value={genEnd} onChange={(e) => setGenEnd(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none font-bold text-slate-800 transition-all shadow-sm" />
                      </div>
                      <div className="w-full sm:w-16 md:w-20">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Perc</label>
                        <input type="number" value={genDuration} onChange={(e) => setGenDuration(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none font-bold text-slate-800 transition-all shadow-sm" min="1" />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-end gap-3 mt-1">
                      <div className="w-[calc(50%-0.375rem)] sm:w-28">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Szünet kezdete</label>
                        <input type="time" value={genBreakStart} onChange={(e) => setGenBreakStart(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none font-bold text-slate-800 transition-all shadow-sm" />
                      </div>
                      <div className="w-[calc(50%-0.375rem)] sm:w-28">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Szünet vége</label>
                        <input type="time" value={genBreakEnd} onChange={(e) => setGenBreakEnd(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none font-bold text-slate-800 transition-all shadow-sm" />
                      </div>
                      
                      <div className="w-[calc(50%-0.375rem)] sm:w-28">
                        <label className="block text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1.5">Online kezdete</label>
                        <input type="time" value={genOnlineStart} onChange={(e) => setGenOnlineStart(e.target.value)} className="w-full bg-blue-50/50 border border-blue-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none font-bold text-blue-900 transition-all shadow-sm" />
                      </div>
                      <div className="w-[calc(50%-0.375rem)] sm:w-28">
                        <label className="block text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1.5">Online vége</label>
                        <input type="time" value={genOnlineEnd} onChange={(e) => setGenOnlineEnd(e.target.value)} className="w-full bg-blue-50/50 border border-blue-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none font-bold text-blue-900 transition-all shadow-sm" />
                      </div>
                      
                      <button onClick={generateDailySlots} className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-2.5 rounded-xl hover:from-red-700 hover:to-red-600 transition-all active:scale-95 font-bold shadow-md shadow-red-500/20 sm:ml-auto">
                        Lista Generálása
                      </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {!printingDate && debouncedSearchTerm !== "" && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-2xl mb-6 shadow-sm flex items-center gap-3 no-print">
            <SearchIcon size={18} />
            <span className="font-bold">Keresési eredmények a következőre: "{debouncedSearchTerm}"</span>
            <span className="ml-auto bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-extrabold">{filteredAppointments.length} találat</span>
          </div>
        )}

        {!printingDate && isInitialLoading ? (
          <div className="space-y-8 animate-pulse no-print relative z-10">
            {[1, 2].map((dayBlock) => (
              <div key={dayBlock} className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                  <div className="w-8 h-8 bg-slate-200/80 rounded-full"></div>
                  <div className="w-48 h-6 bg-slate-200/80 rounded-xl"></div>
                  <div className="w-32 h-6 bg-slate-200/80 rounded-xl ml-auto"></div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((row) => (
                    <div key={row} className="w-full h-16 bg-white/50 border border-slate-100 rounded-2xl flex items-center px-4 gap-4">
                      <div className="w-16 h-5 bg-slate-200/80 rounded-md shrink-0"></div>
                      <div className="w-48 h-5 bg-slate-200/80 rounded-md"></div>
                      <div className="w-32 h-5 bg-slate-200/80 rounded-md"></div>
                      <div className="flex-1 h-5 bg-slate-200/80 rounded-md"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {!printingDate && debouncedSearchTerm === "" && freeSlotsSummary.length > 0 && (
              <div className="mb-8 no-print">
                <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold uppercase tracking-widest text-xs ml-1">
                  <CalendarIcon size={16} /> <span>Naptár Áttekintés - Kattints a dátumra</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar scroll-smooth">
                  
                  {!isArchiveView && (
                    <button
                      onClick={scrollToToday}
                      className="flex-shrink-0 flex items-center justify-center gap-2 min-w-[130px] p-3 rounded-2xl border bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 transition-all shadow-sm"
                    >
                      <CalendarIcon size={20} />
                      <span className="font-extrabold text-sm">Ugrás Mára</span>
                    </button>
                  )}

                  {freeSlotsSummary.map((day) => (
                    <button
                      key={day.date}
                      onClick={() => document.getElementById(`date-${day.date}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                      className={`flex-shrink-0 min-w-[130px] p-3 rounded-2xl border transition-all text-left group backdrop-blur-md cursor-pointer
                        ${day.freeCount > 0 ? 'bg-white/90 border-white shadow-sm hover:shadow-md hover:border-emerald-200' : 'bg-slate-100/80 border-white/50 opacity-80 hover:bg-white/90'}`}
                    >
                      <div className="text-slate-800 font-extrabold text-sm mb-1">{formatShortDate(day.date)}</div>
                      <div className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-lg w-max transition-colors
                        ${day.freeCount > 0 ? 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200' : 'bg-slate-200 text-slate-700'}`}>
                        {day.freeCount > 0 ? `${day.freeCount} szabad hely` : 'Megtelt'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sortedDates.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-xl p-12 md:p-20 text-center rounded-3xl shadow-sm border border-white/60 flex flex-col items-center no-print relative z-0">
                <div className="text-slate-300 mb-4"><CalendarIcon size={64} /></div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {debouncedSearchTerm ? "Nincs találat" : isArchiveView ? "Az archívum üres" : "Még nincsenek aktuális időpontok"}
                </h3>
                <p className="text-slate-600 text-sm font-medium">
                  {debouncedSearchTerm ? "Próbálkozz más névvel, TAJ számmal, telefonnal vagy születési idővel." : isArchiveView ? "Ide fognak bekerülni a tegnapi és régebbi, lejárt időpontok." : "Válassz ki egy dátumot, és generáld le a listát a fenti eszköz segítségével."}
                </p>
              </div>
            ) : (
              sortedDates.map((date) => {
                if (printingDate && printingDate !== date) return null;

                const dayAppointments = groupedByDate[date].sort((a: any, b: any) => a.time_slot.localeCompare(b.time_slot));
                const activeSlots = dayAppointments.filter((a: any) => !a.is_deleted);
                
                const activeNormalSlots = activeSlots.filter((a: any) => a.time_slot !== "VÁRÓLISTA");
                const waitingListSlots = activeSlots.filter((a: any) => a.time_slot === "VÁRÓLISTA");

                const bookedCount = activeNormalSlots.filter((a: any) => a.patient_name && a.patient_name.trim() !== "").length;
                const freeCount = activeNormalSlots.length - bookedCount;
                
                const percent = activeNormalSlots.length > 0 ? Math.round((bookedCount / activeNormalSlots.length) * 100) : 0;
                const deptPrices = allPrices.filter(p => p.department === (dayAppointments[0]?.department || activeTab));
                const examinationSuggestions = deptPrices.map(p => p.name);
                const dailyRevenue = getDailyRevenue(activeNormalSlots, deptPrices);
                const formattedRevenue = dailyRevenue > 0 ? new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(dailyRevenue) : "0 Ft";

                return (
                  <div id={`date-${date}`} key={date} className={`mb-10 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] scroll-mt-[100px] print-container relative z-0 flex flex-col ${printingDate ? 'bg-white' : 'bg-white/80 backdrop-blur-xl border border-white/60'}`}>
                    
                    <div className={`p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 print-header ${printingDate ? 'border-b-2 border-black pb-2 mb-2 px-0' : 'bg-white/50 border-b border-slate-100 rounded-t-3xl'}`}>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-3 text-slate-900">
                            <CalendarIcon size={20} />
                            <h2 className="text-xl font-bold flex items-baseline gap-2">
                              {date} 
                              <span className="text-sm font-semibold text-slate-500 capitalize">
                                {new Intl.DateTimeFormat('hu-HU', { weekday: 'long' }).format(new Date(date))}
                              </span>
                              {debouncedSearchTerm !== "" && <span className="text-sm font-medium text-slate-500 ml-2">({dayAppointments[0].department})</span>}
                            </h2>
                          </div>
                          
                          {!printingDate && debouncedSearchTerm === "" && (
                            <div className="flex items-center gap-2 mt-1">
                              <MapPinIcon size={16} className="text-slate-400" />
                              <select 
                                value={dayAppointments[0]?.location || ""} 
                                onChange={(e) => updateDayLocation(date, dayAppointments[0].department, e.target.value)}
                                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2 py-1 focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition-colors"
                              >
                                <option value="">Helyszín nincs megadva</option>
                                <option value="Eötvös utca 21.">Eötvös utca 21.</option>
                                <option value="Árpád utca 12.">Árpád utca 12.</option>
                              </select>
                            </div>
                          )}
                        </div>
                        
                        {!printingDate && debouncedSearchTerm === "" && (
                          <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-100">
                            <div className="flex flex-col gap-1 w-32 sm:w-40">
                              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                <span>Telítettség</span>
                                <span className={percent === 100 ? "text-emerald-600" : ""}>{percent}%</span>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                 <div className={`h-full transition-all duration-1000 ${percent === 100 ? 'bg-emerald-500' : percent > 60 ? 'bg-amber-400' : 'bg-blue-400'}`} style={{width: `${percent}%`}}></div>
                              </div>
                            </div>
                            <div className="w-px h-6 bg-slate-200 mx-1"></div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Várható bevétel</span>
                              <span className="text-sm font-extrabold text-slate-800">{formattedRevenue}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center flex-wrap gap-2">
                        {debouncedSearchTerm === "" && (
                          <>
                            <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200">Összes: {activeNormalSlots.length}</span>
                            <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200">Szabad: {freeCount}</span>
                            <span className="bg-red-100 text-red-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200">Foglalt: {bookedCount}</span>
                            
                            {!printingDate && !isArchiveView && (
                              <button onClick={() => addToWaitingList(date)} className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-orange-300 transition-colors flex items-center gap-1 cursor-pointer">
                                <PlusIcon size={14} /> Várólista
                              </button>
                            )}
                          </>
                        )}
                        
                        {!printingDate && debouncedSearchTerm === "" && (
                          <>
                            <div className="w-px h-6 bg-slate-300 mx-1 hidden md:block"></div>
                            
                            {!isArchiveView && (
                              <button onClick={() => clearEmptySlots(date)} title="Üres sorok takarítása" className="bg-white hover:bg-amber-50 text-slate-700 p-1.5 rounded-xl transition-all shadow-sm border border-slate-200 cursor-pointer hover:text-amber-600 hover:border-amber-200">
                                <EraserIcon />
                              </button>
                            )}
                            
                            <button onClick={() => exportToCSV(date)} className="bg-white hover:bg-blue-50 text-slate-700 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border border-slate-200 cursor-pointer hover:border-blue-200 hover:text-blue-600">
                              <DownloadIcon /> <span className="hidden sm:inline">Excel Export</span><span className="sm:hidden">Excel</span>
                            </button>
                            
                            <button onClick={() => handlePrintDay(date)} className="bg-slate-800 text-white px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center gap-1.5 shadow-sm cursor-pointer">
                              <PrintIcon /> <span className="hidden sm:inline">Nyomtatás</span>
                            </button>
                            
                            {!isArchiveView && (
                              <button onClick={() => deleteEntireDay(date)} className="bg-red-50 text-red-600 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm border border-red-200 cursor-pointer">
                                <TrashIcon /> <span className="hidden sm:inline">Nap törlése</span>
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className={`overflow-x-auto custom-scrollbar flex-1 ${printingDate ? 'overflow-visible' : ''}`}>
                      <table className="min-w-full text-left border-collapse print-table hidden lg:table print:table">
                        <thead className="sticky top-0 z-20 shadow-sm bg-white">
                          <tr className="border-b border-slate-200/60 print-border">
                            <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap w-min">Időpont</th>
                            <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest min-w-[220px]">Páciens neve</th>
                            
                            <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap min-w-[130px]">Szül. idő</th>
                            <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap min-w-[140px]">TAJ szám</th>
                            
                            <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap min-w-[140px]">Telefon</th>
                            {!printingDate && <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap min-w-[140px]">Státusz</th>}
                            
                            <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest w-auto min-w-[150px]">Vizsgálat</th>
                            <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest w-auto min-w-[150px]">Megjegyzés</th>
                            {!printingDate && <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest text-center no-print whitespace-nowrap w-min">Művelet</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50 relative z-0 bg-white/50 backdrop-blur-sm">
                          {dayAppointments.map((app: any) => {
                            const isDel = app.is_deleted === true;
                            const isBooked = app.patient_name && app.patient_name.trim() !== "";
                            const isWaitingList = app.time_slot === "VÁRÓLISTA";
                            const isOnlineSlot = app.time_slot.includes("(Online)");
                            const displayTime = app.time_slot.replace(" (Online)", "");
                            
                            const canShowHistory = isBooked && !isDel && app.taj_szam && app.taj_szam.trim() !== "";
                            
                            if (printingDate && isDel) return null; 

                            const statusBorder = printingDate || isDel || (!isBooked && !isWaitingList) ? "" :
                              isWaitingList ? "border-l-4 border-l-orange-400" :
                              app.status === "Megérkezett" ? "border-l-4 border-l-amber-400" :
                              app.status === "Vizsgálaton" ? "border-l-4 border-l-blue-400" :
                              app.status === "Befejezve" ? "border-l-4 border-l-emerald-500" :
                              app.status === "Nem jelent meg" ? "border-l-4 border-l-slate-800" :
                              "border-l-4 border-l-transparent";

                            const rowStyle = isDel 
                              ? "bg-slate-100/40 opacity-70 print-hidden" 
                              : isWaitingList 
                                ? `bg-orange-50/50 hover:bg-orange-100/60 ${statusBorder}`
                                : isBooked 
                                  ? `bg-red-50/70 hover:bg-red-100/60 ${statusBorder}`
                                  : "bg-emerald-50/70 hover:bg-emerald-100/60 border-l-4 border-l-transparent";

                            return (
                              <tr key={app.id} className={`transition-colors group relative ${printingDate ? '' : rowStyle}`}>
                                
                                <td className="px-4 py-3 align-middle whitespace-nowrap">
                                  <div className="flex flex-col gap-1 w-max">
                                    {isWaitingList ? (
                                      <span className="font-extrabold text-orange-600 flex items-center gap-1.5"><ClockIcon size={16}/> VÁRÓLISTA</span>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <span className={`font-bold text-base ${printingDate ? 'text-black' : isDel ? "text-slate-500 line-through" : isBooked ? "text-red-950" : "text-emerald-950"}`}>{displayTime}</span>
                                        {isOnlineSlot && !printingDate && !isDel && (
                                          <span className="bg-blue-100 text-blue-700 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border border-blue-200 shadow-sm" title="Online előjegyzési sáv">Online</span>
                                        )}
                                      </div>
                                   )}
                                    {!printingDate && !isDel && !isWaitingList && <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-md text-center w-full shadow-sm
                                      ${isBooked ? 'bg-red-200 text-red-800 border border-red-300' : 'bg-emerald-200 text-emerald-800 border border-emerald-300'}`}>
                                      {isBooked ? 'Foglalt' : 'Szabad'}
                                    </span>}
                                  </div>
                                </td>

                                <td className="px-4 py-3 align-middle min-w-[220px]">
                                  {printingDate ? (
                                    <div className="font-bold text-black text-sm">{app.patient_name}</div>
                                  ) : isDel ? (
                                    <div className="font-semibold text-slate-500 line-through">{app.patient_name || "-"}</div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <PatientAutocomplete
                                        value={app.patient_name}
                                        onSave={(val) => updateAppointment(app.id, "patient_name", val)}
                                        onSelectPatient={(patient) => handleSelectPatient(app.id, patient)}
                                        searchPatients={searchPatients}
                                        placeholder="Páciens neve..."
                                      />
                                      {canShowHistory && (
                                        <button onClick={() => openPatientHistory(app.patient_name, app.taj_szam)} className="p-2 bg-white text-purple-600 border border-purple-200 hover:bg-purple-100 hover:border-purple-300 rounded-xl shadow-sm transition-all flex-shrink-0" title="Karton">
                                           <HistoryIcon />
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </td>
                                
                                <td className="px-4 py-3 align-middle">
                                  {printingDate ? (
                                    <div className="text-black text-sm">{app.birth_date}</div>
                                  ) : isDel ? (
                                    <div className="text-slate-500">{app.birth_date || "-"}</div>
                                  ) : (
                                    <EditableCell 
                                      value={app.birth_date} 
                                      onSave={(val) => updateAppointment(app.id, "birth_date", val)} 
                                      placeholder="ÉÉÉÉ.HH.NN" 
                                      className="font-medium text-slate-700" 
                                    />
                                  )}
                                </td>

                                <td className="px-4 py-3 align-middle">
                                  {printingDate ? (
                                    <div className="font-mono text-black text-sm">{formatTAJ(app.taj_szam)}</div>
                                  ) : isDel ? (
                                    <div className="font-mono text-slate-500">{formatTAJ(app.taj_szam) || "-"}</div>
                                  ) : (
                                    <EditableCell 
                                      value={formatTAJ(app.taj_szam)} 
                                      onSave={(val) => updateAppointment(app.id, "taj_szam", val)} 
                                      placeholder="000 000 000" 
                                      className="font-mono font-bold text-slate-700" 
                                    />
                                  )}
                                </td>

                                <td className="px-4 py-3 align-middle">
                                  {printingDate ? (
                                    <div className="text-black text-sm">{formatPhone(app.phone_number)}</div>
                                  ) : isDel ? (
                                    <div className="text-slate-500">{formatPhone(app.phone_number) || "-"}</div>
                                  ) : (
                                    <EditableCell 
                                      value={formatPhone(app.phone_number)} 
                                      onSave={(val) => updateAppointment(app.id, "phone_number", val)} 
                                      placeholder="06 30 000 0000" 
                                      className="font-medium text-slate-700" 
                                    />
                                  )}
                                </td>

                                {!printingDate && (
                                  <td className="px-4 py-3 align-middle">
                                    {isDel ? (
                                      <div className="text-slate-500">{app.status || "-"}</div>
                                    ) : (
                                      <ModernStatusSelect 
                                        value={app.status || "Előjegyzett"} 
                                        onChange={(val) => updateAppointment(app.id, "status", val)} 
                                        disabled={!isBooked && !isWaitingList}
                                      />
                                    )}
                                  </td>
                                )}

                                <td className="px-4 py-3 align-middle">
                                  {printingDate ? (
                                    <div className="text-black text-sm font-semibold">{app.examination_type}</div>
                                  ) : isDel ? (
                                    <div className="text-slate-500">{app.examination_type || "-"}</div>
                                  ) : (
                                    <ModernExamSelect
                                      value={app.examination_type}
                                      onChange={(val) => updateAppointment(app.id, "examination_type", val)}
                                      options={examinationSuggestions}
                                    />
                                  )}
                                </td>

                                <td className="px-4 py-3 align-middle">
                                  {printingDate ? (
                                    <div className="text-black text-sm italic">{app.notes}</div>
                                  ) : isDel ? (
                                    <div className="text-slate-500 italic">{app.notes || "-"}</div>
                                  ) : (
                                    <EditableCell 
                                      value={app.notes} 
                                      onSave={(val) => updateAppointment(app.id, "notes", val)} 
                                      placeholder="Kattints ide..." 
                                      className="text-slate-600 italic text-sm" 
                                    />
                                  )}
                                </td>

                                {!printingDate && (
                                  <td className="px-4 py-3 align-middle text-center no-print w-min whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-2">
                                      <button onClick={() => openAppInfoModal(app)} className="text-slate-400 hover:text-blue-600 hover:bg-blue-100 p-2 rounded-xl transition-all" title="Napló">
                                        <InfoIcon />
                                      </button>
                                      {isDel ? (
                                        <button onClick={() => restoreAppointment(app.id)} className="text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 p-2 rounded-xl transition-all" title="Visszaállítás">
                                          <RestoreIcon />
                                        </button>
                                      ) : (
                                        <button onClick={() => confirmDeleteApp(app.id)} className="text-red-400 hover:text-red-600 hover:bg-red-100 p-2 rounded-xl transition-all" title="Törlés">
                                          <TrashIcon />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                )}
                                
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {/* MOBIL NÉZET */}
                      <div className="lg:hidden flex flex-col gap-3 p-3">
                         {dayAppointments.map((app: any) => {
                            if (printingDate) return null;
                            const isDel = app.is_deleted === true;
                            const isBooked = app.patient_name && app.patient_name.trim() !== "";
                            const isWaitingList = app.time_slot === "VÁRÓLISTA";
                            const displayTime = app.time_slot.replace(" (Online)", "");
                            const canShowHistory = isBooked && !isDel && app.taj_szam && app.taj_szam.trim() !== "";
                            
                            const statusBorder = isDel || (!isBooked && !isWaitingList) ? "border-l-4 border-l-slate-200" :
                              isWaitingList ? "border-l-4 border-l-orange-400" :
                              app.status === "Megérkezett" ? "border-l-4 border-l-amber-400" :
                              app.status === "Vizsgálaton" ? "border-l-4 border-l-blue-400" :
                              app.status === "Befejezve" ? "border-l-4 border-l-emerald-500" :
                              app.status === "Nem jelent meg" ? "border-l-4 border-l-slate-800" :
                              "border-l-4 border-l-slate-200";

                            const rowBg = isDel ? "bg-slate-100/50" : isWaitingList ? "bg-orange-50/50" : isBooked ? "bg-white" : "bg-emerald-50/50";

                            return (
                              <div key={app.id} className={`${rowBg} ${statusBorder} rounded-2xl p-4 shadow-sm border border-slate-100 relative`}>
                                 {isDel && <div className="absolute inset-0 bg-slate-200/50 backdrop-blur-[1px] z-10 rounded-2xl flex items-center justify-center">
                                    <button onClick={() => restoreAppointment(app.id)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold shadow-md flex items-center gap-2">
                                      <RestoreIcon /> Visszaállítás
                                    </button>
                                 </div>}

                                 <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                                    <div className="flex flex-col gap-1">
                                      <span className={`text-lg font-extrabold ${isWaitingList ? 'text-orange-600' : 'text-slate-900'}`}>{isWaitingList ? 'VÁRÓLISTA' : displayTime}</span>
                                      {!isWaitingList && <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg w-max ${isBooked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{isBooked ? 'Foglalt' : 'Szabad'}</span>}
                                    </div>
                                    <div className="flex gap-2">
                                       <button onClick={() => openAppInfoModal(app)} className="p-2 bg-slate-100 text-slate-500 rounded-xl" title="Napló"><InfoIcon /></button>
                                       {!isDel && <button onClick={() => confirmDeleteApp(app.id)} className="p-2 bg-red-50 text-red-500 rounded-xl" title="Törlés"><TrashIcon /></button>}
                                    </div>
                                 </div>

                                 <div className="space-y-3">
                                    <div>
                                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Páciens neve</label>
                                       <div className="flex gap-2">
                                         <PatientAutocomplete value={app.patient_name} onSave={(val) => updateAppointment(app.id, "patient_name", val)} onSelectPatient={(patient) => handleSelectPatient(app.id, patient)} searchPatients={searchPatients} placeholder="Páciens neve..." />
                                         {canShowHistory && (
                                           <button onClick={() => openPatientHistory(app.patient_name, app.taj_szam)} className="p-2.5 bg-purple-50 text-purple-600 rounded-xl border border-purple-200" title="Karton">
                                              <HistoryIcon />
                                           </button>
                                         )}
                                       </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                       <div>
                                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Születési idő</label>
                                         <EditableCell value={app.birth_date} onSave={(val) => updateAppointment(app.id, "birth_date", val)} placeholder="ÉÉÉÉ.HH.NN" className="bg-slate-50 text-sm" />
                                       </div>
                                       <div>
                                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">TAJ Szám</label>
                                         <EditableCell value={formatTAJ(app.taj_szam)} onSave={(val) => updateAppointment(app.id, "taj_szam", val)} placeholder="000 000 000" className="bg-slate-50 font-mono text-sm" />
                                       </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                       <div>
                                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Telefon</label>
                                         <EditableCell value={formatPhone(app.phone_number)} onSave={(val) => updateAppointment(app.id, "phone_number", val)} placeholder="06 30 000 0000" className="bg-slate-50 text-sm" />
                                       </div>
                                       <div>
                                         <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Státusz</label>
                                         <ModernStatusSelect value={app.status || "Előjegyzett"} onChange={(val) => updateAppointment(app.id, "status", val)} disabled={!isBooked && !isWaitingList} />
                                       </div>
                                    </div>

                                    <div>
                                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Vizsgálat</label>
                                       <ModernExamSelect value={app.examination_type} onChange={(val) => updateAppointment(app.id, "examination_type", val)} options={examinationSuggestions} />
                                    </div>

                                    <div>
                                       <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Megjegyzés</label>
                                       <EditableCell value={app.notes} onSave={(val) => updateAppointment(app.id, "notes", val)} placeholder="Ide írhatsz..." className="bg-slate-50 italic text-sm" />
                                    </div>
                                 </div>
                              </div>
                            );
                         })}
                      </div>

                    </div>
                    
                    {!printingDate && debouncedSearchTerm === "" && !isArchiveView && (
                      <div className="bg-slate-50/80 p-4 border-t border-slate-200/60 rounded-b-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
                         <div className="text-slate-500 font-bold text-xs flex items-center gap-2"><PlusIcon size={16} /> Új időpont hozzáadása ehhez a naphoz:</div>
                         <div className="flex gap-2 w-full sm:w-auto">
                            <input 
                              type="text" 
                              placeholder="pl. 17:30" 
                              value={dayNewTimeSlots[date] || ""} 
                              onChange={(e) => setDayNewTimeSlots(prev => ({...prev, [date]: e.target.value}))}
                              onKeyDown={(e) => e.key === "Enter" && addDaySingleAppointment(date)}
                              className="flex-1 sm:w-32 bg-white border border-slate-200 text-sm font-bold text-slate-800 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 shadow-sm"
                            />
                            <button 
                              onClick={() => addDaySingleAppointment(date)}
                              className="bg-slate-800 text-white px-5 py-2 rounded-xl hover:bg-black transition-all font-bold text-xs shadow-sm active:scale-95"
                            >
                              Hozzáadás
                            </button>
                         </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </>
        )}
      </div>

      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-slate-900 text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-black transition-all duration-300 transform no-print ${showScrollTop && !toast.visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-16 opacity-0 scale-50 pointer-events-none'}`}
        title="Ugrás a tetejére"
      >
        <ArrowUpIcon />
      </button>

      <footer className="text-center pb-6 text-slate-500 font-medium text-xs no-print relative z-10 drop-shadow-sm">
        Medical-Aqua Előjegyzési Rendszer © {new Date().getFullYear()}<br/>
        <span className="opacity-70">Biztonságos kapcsolat</span>
      </footer>

    </div>
  );
}