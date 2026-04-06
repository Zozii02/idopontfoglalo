"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";

// --- Professzionális Minimalista Ikonok ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const ListPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M19 10v6"/><path d="M22 13h-6"/></svg>;
const CalendarIcon = ({ size = 24 }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const TrashIcon = ({ size = 16 }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const RestoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const PrintIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>;
const SearchIcon = ({ size = 18 }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const AlertModalIcon = () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const QuestionModalIcon = () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;
const EraserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"></path><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path><polyline points="12 7 12 12 15 15"></polyline></svg>;

// --- HÁTTÉRKÉP BEÁLLÍTÁSA ---
const BACKGROUND_IMAGE_URL = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop";

// --- OKOS FORMÁZÓK ---
const formatTAJ = (val: string) => {
  if (!val) return "";
  const cleaned = val.replace(/\D/g, '').substring(0, 9);
  return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
};

const formatPhone = (val: string) => {
  if (!val) return "";
  let cleaned = val.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('06')) cleaned = '+36' + cleaned.substring(2);
  else if (cleaned.startsWith('36')) cleaned = '+36' + cleaned.substring(2);
  if (cleaned.startsWith('+36') && cleaned.length > 3) {
    const p1 = cleaned.substring(0, 3);
    const p2 = cleaned.substring(3, 5);
    const p3 = cleaned.substring(5, 8);
    const p4 = cleaned.substring(8, 12);
    return `${p1} ${p2} ${p3} ${p4}`.trim();
  }
  return cleaned;
};

// Név formázó (Minden szó nagybetűvel kezdődik)
const formatName = (val: string) => {
  if (!val) return "";
  return val.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

// Dátum segédek a gyorsgombokhoz
const getTodayDateStr = () => new Date().toISOString().split('T')[0];
const getTomorrowDateStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

// --- OKOS CELLA ---
function EditableCell({ value, onSave, disabled = false, highlight = false, formatter }: { value: string; onSave: (val: string) => void; disabled?: boolean; highlight?: boolean; formatter?: (v: string) => string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || "");

  const handleBlur = () => { 
    setIsEditing(false); 
    const finalVal = formatter ? formatter(currentValue) : currentValue;
    if (finalVal !== value) onSave(finalVal); 
    setCurrentValue(finalVal);
  };

  if (disabled) return <div className="p-2 text-slate-400 font-medium line-through bg-slate-50/50 rounded-lg break-words">{value || "-"}</div>;

  if (isEditing) {
    return (
      <input 
        autoFocus 
        value={currentValue} 
        onChange={(e) => setCurrentValue(e.target.value)} 
        onBlur={handleBlur} 
        onKeyDown={(e) => e.key === "Enter" && handleBlur()}
        className="w-full min-w-0 bg-white border border-red-400 p-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-100 text-slate-900 font-semibold shadow-sm transition-all"
      />
    );
  }

  return (
    <div onClick={() => { setIsEditing(true); setCurrentValue(value || ""); }}
      className={`cursor-pointer min-h-[38px] p-2 rounded-lg transition-all border border-transparent hover:bg-white/80 hover:border-slate-200 font-medium break-words
        ${highlight ? "text-red-950 font-bold" : "text-emerald-950"}`}
      title="Kattints a szerkesztéshez"
    >
      {value || <span className="text-slate-400 italic text-sm font-normal opacity-70">Üres (kattints)</span>}
    </div>
  );
}

// --- MODERN STÁTUSZ VÁLASZTÓ ---
function ModernStatusSelect({ value, onChange, disabled }: { value: string, onChange: (val: string) => void, disabled: boolean }) {
  if (disabled) return <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">-</span>;
  
  const statusColors: Record<string, string> = {
    "Előjegyzett": "bg-slate-100 text-slate-700 border-slate-200 focus:ring-slate-200",
    "Megérkezett": "bg-amber-100 text-amber-800 border-amber-200 focus:ring-amber-200",
    "Vizsgálaton": "bg-blue-100 text-blue-800 border-blue-200 focus:ring-blue-200",
    "Befejezve": "bg-emerald-100 text-emerald-800 border-emerald-200 focus:ring-emerald-200",
    "Nem jelent meg": "bg-slate-800 text-white border-slate-900 focus:ring-slate-900"
  };

  const currentStyle = statusColors[value] || statusColors["Előjegyzett"];

  return (
    <div className="relative inline-block w-[140px]">
      <select 
        value={value || "Előjegyzett"} 
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none w-full text-[10px] uppercase font-bold tracking-widest px-3 py-2 pr-8 rounded-lg outline-none cursor-pointer border shadow-sm transition-all focus:ring-2 focus:ring-offset-1 ${currentStyle}`}
      >
        <option value="Előjegyzett">Előjegyzett</option>
        <option value="Megérkezett">Megérkezett</option>
        <option value="Vizsgálaton">Vizsgálaton</option>
        <option value="Befejezve">Befejezve</option>
        <option value="Nem jelent meg">Nem jelent meg</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-60">
        <ChevronDownIcon />
      </div>
    </div>
  );
}

// --- MODERN NAPTÁR VÁLASZTÓ (JAVÍTOTT MÉRET & Z-INDEX) ---
function ModernDatePicker({ selectedDate, onChange }: { selectedDate: string, onChange: (date: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate ? new Date(selectedDate) : new Date());

  const monthNames = ["Január", "Február", "Március", "Április", "Május", "Június", "Július", "Augusztus", "Szeptember", "Október", "November", "December"];
  const dayNames = ["H", "K", "Sze", "Cs", "P", "Sz", "V"];

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const selectDay = (day: number) => {
    const y = viewDate.getFullYear();
    const m = (viewDate.getMonth() + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  };

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
  const emptyDays = Array.from({ length: firstDay >= 0 ? firstDay : 0 }, () => null);
  const days = Array.from({ length: daysInMonth > 0 ? daysInMonth : 0 }, (_, i) => i + 1);

  const displayDate = selectedDate ? `${selectedDate.split('-')[0]}. ${monthNames[parseInt(selectedDate.split('-')[1]) - 1]} ${selectedDate.split('-')[2]}.` : "Válassz dátumot...";

  return (
    <div className="relative w-full">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm"
      >
        <span className="flex items-center gap-2">
          <span className="text-slate-400"><CalendarIcon size={16} /></span>
          {displayDate}
        </span>
        <span className="text-slate-400"><ChevronDownIcon /></span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)}></div>
          {/* Javított naptár-doboz: kisebb magasság, ultra-magas z-index, hogy soha ne lógjon ki vagy takaródjon el */}
          <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl z-[999] p-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-3">
              <button onClick={handlePrevMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"><ChevronLeftIcon /></button>
              <div className="font-bold text-slate-800 text-sm">{viewDate.getFullYear()}. {monthNames[viewDate.getMonth()]}</div>
              <button onClick={handleNextMonth} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"><ChevronRightIcon /></button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {dayNames.map(d => <div key={d} className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{d}</div>)}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {emptyDays.map((_, i) => <div key={`empty-${i}`} className="p-1"></div>)}
              {days.map(day => {
                const currentDateStr = `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const isSelected = currentDateStr === selectedDate;
                
                return (
                  <button 
                    key={day} 
                    onClick={() => selectDay(day)}
                    className={`p-1.5 w-full text-xs font-bold rounded-lg transition-all flex items-center justify-center aspect-square
                      ${isSelected ? 'bg-red-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-100'}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const formatDateTime = (isoString: string) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("hu-HU", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
};
const formatShortDate = (d: string) => {
  const parts = d.split('-');
  return parts.length === 3 ? `${parts[1]}. ${parts[2]}.` : d;
};
const timeToMins = (t: string) => { const [h, m] = t.split(':'); return parseInt(h) * 60 + parseInt(m); };
const minsToTime = (m: number) => { const h = Math.floor(m / 60).toString().padStart(2, '0'); const mins = (m % 60).toString().padStart(2, '0'); return `${h}:${mins}`; };

// --- Főoldal ---
export default function Home() {
  const CATEGORIES = [
    "Belgyógyászat", "Ultrahang", "Kardiológia", "Bőrgyógyászat", 
    "Szemészet", "Fül-orr-gégészet", "Nőgyógyászat", "Urológia", 
    "Reumatológia", "Sebészet", "Ortopédia", "Neurológia"
  ];

  const searchInputRef = useRef<HTMLInputElement>(null); 

  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(CATEGORIES[0]);
  const [departmentSearch, setDepartmentSearch] = useState(""); 
  const [showDeleted, setShowDeleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [needsProfileName, setNeedsProfileName] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState("");
  
  const [selectedDate, setSelectedDate] = useState(""); 
  const [newTimeSlot, setNewTimeSlot] = useState("");

  const [genStart, setGenStart] = useState("08:00");
  const [genEnd, setGenEnd] = useState("16:00");
  const [genDuration, setGenDuration] = useState("30");
  const [genBreakStart, setGenBreakStart] = useState("12:00");
  const [genBreakEnd, setGenBreakEnd] = useState("13:00");

  const [printingDate, setPrintingDate] = useState<string | null>(null);

  const [historyModal, setHistoryModal] = useState<{isOpen: boolean, patientName: string, taj: string, data: any[]}>({
    isOpen: false, patientName: "", taj: "", data: []
  });

  const [modal, setModal] = useState<{isOpen: boolean, title: string, message: string, type: "alert" | "confirm", confirmText: string, confirmColor: string, onConfirm: () => void}>({
    isOpen: false, title: "", message: "", type: "alert", confirmText: "Rendben", confirmColor: "bg-slate-900 text-white", onConfirm: () => {}
  });

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));
  const closeHistoryModal = () => setHistoryModal(prev => ({ ...prev, isOpen: false }));

  const showAlert = (title: string, message: string) => {
    setModal({ isOpen: true, title, message, type: "alert", confirmText: "Rendben", confirmColor: "bg-slate-900 text-white hover:bg-black", onConfirm: closeModal });
  };

  const showConfirm = (title: string, message: string, confirmText: string, confirmColor: string, onConfirmCallback: () => void) => {
    setModal({ isOpen: true, title, message, type: "confirm", confirmText, confirmColor, onConfirm: () => { onConfirmCallback(); closeModal(); }});
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        closeModal();
        closeHistoryModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleAfterPrint = () => setPrintingDate(null);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handlePrintDay = (date: string) => {
    setPrintingDate(date);
    setTimeout(() => { window.print(); }, 250); 
  };

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

  useEffect(() => { 
    if (user && !needsProfileName) {
      fetchAppointments();
      const channel = supabase.channel('live-appointments')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchAppointments())
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    } 
  }, [user, needsProfileName]);

  const fetchAppointments = async () => {
    const { data, error } = await supabase.from("appointments").select("*").order("appointment_date", { ascending: true }).order("time_slot", { ascending: true });
    if (!error && data) setAppointments(data);
  };

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
  const getDisplayName = () => user?.user_metadata?.display_name || user?.email;

  const updateAppointment = async (id: number, field: string, newValue: string) => {
    if (!user) return;
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    setAppointments(appointments.map((app: any) => app.id === id ? { ...app, [field]: newValue, last_modified_by: modifierName, last_modified_at: now } : app));
    await supabase.from("appointments").update({ [field]: newValue, last_modified_by: modifierName, last_modified_at: now }).eq("id", id);
  };

  const clearEmptySlots = async (date: string) => {
    const dayApps = groupedByDate[date] || [];
    const emptyApps = dayApps.filter((a: any) => !a.is_deleted && (!a.patient_name || a.patient_name.trim() === ""));
    
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
        
        setAppointments(appointments.map((app: any) => 
          idsToDelete.includes(app.id) ? { ...app, is_deleted: true, deleted_by: modifierName, deleted_at: now } : app
        ));

        await supabase.from("appointments")
          .update({ is_deleted: true, deleted_by: modifierName, deleted_at: now })
          .in('id', idsToDelete);
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
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    setAppointments(appointments.map((app: any) => app.id === id ? { ...app, is_deleted: true, deleted_by: modifierName, deleted_at: now } : app));
    await supabase.from("appointments").update({ is_deleted: true, deleted_by: modifierName, deleted_at: now }).eq("id", id);
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
        
        setAppointments(appointments.map((app: any) => 
          idsToDelete.includes(app.id) ? { ...app, is_deleted: true, deleted_by: modifierName, deleted_at: now } : app
        ));

        await supabase.from("appointments")
          .update({ is_deleted: true, deleted_by: modifierName, deleted_at: now })
          .in('id', idsToDelete);
      }
    );
  };

  const restoreAppointment = async (id: number) => {
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    setAppointments(appointments.map((app: any) => app.id === id ? { ...app, is_deleted: false, last_modified_by: modifierName, last_modified_at: now } : app));
    await supabase.from("appointments").update({ is_deleted: false, last_modified_by: modifierName, last_modified_at: now }).eq("id", id);
  };

  const exportToCSV = (date: string) => {
    const dayApps = groupedByDate[date]?.filter((a: any) => !a.is_deleted).sort((a: any, b: any) => a.time_slot.localeCompare(b.time_slot)) || [];
    if (dayApps.length === 0) return showAlert("Üres nap", "Nincs letölthető adat ezen a napon.");

    const headers = ["Időpont", "Páciens neve", "TAJ szám", "Telefon", "Státusz", "Vizsgálat", "Megjegyzés"];
    const rows = dayApps.map((app: any) => [
      app.time_slot,
      app.patient_name || "",
      app.taj_szam || "",
      app.phone_number || "",
      app.status || "",
      app.examination_type || "",
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

  const openPatientHistory = (name: string, taj: string) => {
    if (!name || !taj) return showAlert("Hiányzó adat", "Az előzmények megtekintéséhez a beteg nevének és TAJ számának is kitöltve kell lennie!");
    
    let matches = appointments.filter(a => !a.is_deleted && a.taj_szam === taj && a.patient_name === name);
    matches = matches.sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime());
    
    setHistoryModal({ isOpen: true, patientName: name, taj: taj, data: matches });
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
    const slotsToCreate = [];

    while (current + durationMins <= end) {
      if (bStart !== null && bEnd !== null && current >= bStart && current < bEnd) { current = bEnd; continue; }
      const next = current + durationMins;
      if (bStart !== null && bEnd !== null && current < bStart && next > bStart) { current = bEnd; continue; }
      slotsToCreate.push(`${minsToTime(current)} - ${minsToTime(next)}`);
      current = next;
    }

    if (slotsToCreate.length === 0) return showAlert("Sikertelen generálás", "A megadott feltételekkel (intervallum, szünetek) nem jött létre egyetlen időpont sem.");
    
    showConfirm(
      "Napi előjegyzés generálása",
      `Sikeresen kiszámoltam ${slotsToCreate.length} db új időpontot a kiválasztott napra.\n\nLétrehozhatom őket?`,
      "Lista Generálása",
      "bg-red-600 hover:bg-red-700 text-white",
      async () => {
        const modifierName = getDisplayName();
        const now = new Date().toISOString();
        const newAppointments = slotsToCreate.map((slot: string) => ({
          department: activeTab, appointment_date: selectedDate, time_slot: slot,
          patient_name: "", taj_szam: "", phone_number: "", examination_type: "", notes: "", status: "Előjegyzett",
          last_modified_by: modifierName, last_modified_at: now, is_deleted: false
        }));

        await supabase.from("appointments").insert(newAppointments);
      }
    );
  };

  const addSingleAppointment = async () => {
    if (!user || !newTimeSlot.trim() || !selectedDate) return showAlert("Hiányzó adat", "Kérlek, válassz dátumot és adj meg egy pontos időpontot is (pl. 17:00)!");
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    await supabase.from("appointments").insert([{
      department: activeTab, appointment_date: selectedDate, time_slot: newTimeSlot,
      patient_name: "", taj_szam: "", phone_number: "", examination_type: "", notes: "", status: "Előjegyzett",
      last_modified_by: modifierName, last_modified_at: now, is_deleted: false
    }]);
    setNewTimeSlot("");
  };

  const customModalUI = (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 no-print transition-all duration-300 ${modal.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
      <div className={`relative bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] p-6 md:p-8 w-full max-w-sm border border-slate-100 flex flex-col transform transition-all duration-300 ${modal.isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
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
              <button onClick={closeModal} className="w-full py-3.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-all shadow-sm active:scale-95">Mégse</button>
           )}
           <button onClick={modal.onConfirm} className={`w-full py-3.5 rounded-xl font-bold shadow-md transition-all active:scale-95 ${modal.confirmColor}`}>{modal.confirmText}</button>
        </div>
      </div>
    </div>
  );

  const patientHistoryModalUI = (
    <div className={`fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-0 no-print transition-all duration-300 ${historyModal.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeHistoryModal}></div>
      <div className={`relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] w-full max-w-2xl border border-slate-200 flex flex-col transform transition-all duration-300 max-h-[80vh] ${historyModal.isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white/50 rounded-t-3xl shrink-0">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><HistoryIcon /> {historyModal.patientName} - Előzmények</h3>
            {historyModal.taj && <p className="text-sm font-bold text-slate-500 mt-1">TAJ: {formatTAJ(historyModal.taj)}</p>}
          </div>
          <button onClick={closeHistoryModal} className="p-2 bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-600 rounded-xl transition-colors font-bold text-sm">Bezár (Esc)</button>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar h-full">
          {historyModal.data.length === 0 ? (
             <p className="text-center text-slate-500 font-medium py-8">Nem található korábbi bejegyzés ehhez a TAJ számhoz.</p>
          ) : (
            <div className="space-y-4">
              {historyModal.data.map((app, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 justify-between hover:border-slate-300 transition-colors">
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{formatShortDate(app.appointment_date)}</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-extrabold">{app.time_slot}</span>
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 font-sans bg-cover bg-center bg-fixed relative" style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')` }}>
        {customModalUI}
        <div className="absolute inset-0 bg-slate-100/60 backdrop-blur-2xl z-0 pointer-events-none"></div>
        <div className="relative z-10 bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-md border border-white/50">
          <div className="flex justify-center mb-8"><img src="/logo.png" alt="Medical-Aqua Logo" className="h-28 object-contain select-none pointer-events-none drop-shadow-sm" /></div>
          <h2 className="text-2xl font-bold mb-2 text-center text-slate-900 tracking-tight">Klinikai Rendszer</h2>
          <p className="text-center text-slate-600 mb-8 text-sm font-medium">Jelentkezz be a folytatáshoz</p>
          <div className="space-y-4">
            <input type="email" placeholder="E-mail cím" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full p-3.5 bg-white/90 border border-white/50 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-sm" />
            <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full p-3.5 bg-white/90 border border-white/50 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-sm" />
            <button onClick={handleLogin} className="w-full bg-red-600 text-white py-3.5 rounded-xl font-semibold shadow-md hover:bg-red-700 hover:shadow-lg transition-all active:scale-95 mt-2">Belépés</button>
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
          <input type="text" placeholder="Teljes neved..." value={profileNameInput} onChange={(e) => setProfileNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSaveProfileName()} className="w-full p-3.5 bg-white/90 border border-white/50 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400 mb-4 text-center shadow-sm" />
          <button onClick={handleSaveProfileName} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold shadow-md hover:bg-black transition-all active:scale-95">Mentés és Tovább</button>
        </div>
      </div>
    );
  }

  const filteredCategories = CATEGORIES.filter(c => c.toLowerCase().includes(departmentSearch.toLowerCase()));

  let filteredAppointments = appointments;
  
  if (searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();
    const termNoSpace = term.replace(/\s+/g, ''); 
    
    filteredAppointments = filteredAppointments.filter((app: any) => {
      const nameMatch = app.patient_name && app.patient_name.toLowerCase().includes(term);
      const tajMatch = app.taj_szam && app.taj_szam.replace(/\s+/g, '').includes(termNoSpace);
      const phoneMatch = app.phone_number && app.phone_number.replace(/\s+/g, '').includes(termNoSpace);
      return nameMatch || tajMatch || phoneMatch;
    });
  } else {
    filteredAppointments = filteredAppointments.filter((app: any) => app.department === activeTab);
  }

  if (!showDeleted) filteredAppointments = filteredAppointments.filter((app: any) => app.is_deleted !== true);
  
  const groupedByDate = filteredAppointments.reduce((acc: any, app: any) => {
    const d = app.appointment_date || "Dátum nélkül";
    if (!acc[d]) acc[d] = [];
    acc[d].push(app);
    return acc;
  }, {});
  const sortedDates = Object.keys(groupedByDate).sort();

  const freeSlotsSummary = sortedDates.map(date => {
    const dayAppointments = groupedByDate[date].filter((a: any) => !a.is_deleted);
    const bookedCount = dayAppointments.filter((a: any) => a.patient_name && a.patient_name.trim() !== "").length;
    const freeCount = dayAppointments.length - bookedCount;
    return { date, freeCount, total: dayAppointments.length };
  }).filter(day => day.total > 0);

  return (
    <div className={`min-h-screen font-sans pb-20 bg-cover bg-center bg-fixed relative ${printingDate ? 'bg-white print-mode' : ''}`} style={{ backgroundImage: printingDate ? 'none' : `url('${BACKGROUND_IMAGE_URL}')` }}>
      {customModalUI}
      {patientHistoryModalUI}
      {!printingDate && <div className="absolute inset-0 bg-slate-100/70 backdrop-blur-2xl z-0 pointer-events-none no-print"></div>}

      {/* --- FEJLÉC ÉS KERESŐ --- */}
      <div className="bg-white/70 backdrop-blur-xl sticky top-0 z-40 border-b border-white/50 shadow-sm relative no-print">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
             <img src="/logo.png" alt="Medical-Aqua" className="h-10 object-contain select-none pointer-events-none drop-shadow-sm" />
             <div className="hidden sm:block">
               <h1 className="text-xl font-bold tracking-tight text-slate-900">Medical-Aqua</h1>
               <p className="text-red-600 font-medium text-[11px] tracking-widest uppercase drop-shadow-sm">Előjegyzési Rendszer</p>
             </div>
          </div>
          
          <div className="flex-1 max-w-lg w-full relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon size={18} /></div>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Keresés név, TAJ vagy telefon... (Ctrl+K)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/80 border border-white/60 py-2.5 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 font-semibold text-slate-800 shadow-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-3 sm:gap-5 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 text-slate-800 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 shadow-sm">
              <UserIcon /><span className="font-semibold text-sm">{getDisplayName()}</span>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 transition-colors p-2" title="Kijelentkezés"><LogoutIcon /></button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8 relative z-10">
        
        {/* --- KONTROLL SÁV --- */}
        {!printingDate && searchTerm === "" && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm border border-white/60 p-6 mb-6 no-print">
            <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center justify-between">
              
              <div className="w-full xl:w-1/2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <label className="block text-slate-500 font-semibold text-xs uppercase tracking-widest">Szakrendelés kiválasztása</label>
                  <div className="relative w-full sm:w-48">
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon size={14} /></div>
                    <input 
                      type="text" 
                      placeholder="Szakrendelés keresése..." 
                      value={departmentSearch} 
                      onChange={(e) => setDepartmentSearch(e.target.value)} 
                      className="w-full bg-white/90 border border-slate-200 py-1.5 pl-8 pr-3 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 font-semibold text-slate-700 transition-all shadow-sm" 
                    />
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar scroll-smooth">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map(c => (
                      <button key={c} onClick={() => setActiveTab(c)} className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold text-sm transition-all border ${activeTab === c ? 'bg-red-600 border-red-600 text-white shadow-md' : 'bg-white/80 border-white text-slate-600 hover:bg-white hover:border-slate-200 shadow-sm'}`}>
                        {c}
                      </button>
                    ))
                  ) : (
                    <span className="text-sm font-medium text-slate-400 italic py-2">Nincs találat a keresésre...</span>
                  )}
                </div>
                
                <label className="mt-3 flex items-center gap-3 cursor-pointer group w-max">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors duration-300 border ${showDeleted ? "bg-slate-800 border-slate-800" : "bg-slate-200 border-slate-300 group-hover:bg-slate-300"}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${showDeleted ? "translate-x-4" : "translate-x-0"}`}></div>
                  </div>
                  <span className={`font-semibold text-sm transition-colors duration-300 ${showDeleted ? "text-slate-800" : "text-slate-500 group-hover:text-slate-700"}`}>Törölt sorok mutatása</span>
                </label>
              </div>

              <div className="w-px h-24 bg-slate-200/60 hidden xl:block"></div>

              {/* JAVÍTOTT: A Generátor 2 fix sorba rendezve */}
              <div className="w-full xl:w-auto flex-1">
                 <div className="flex items-center gap-2.5 mb-4 text-slate-800 font-extrabold text-lg">
                    <div className="bg-red-100 text-red-600 p-1.5 rounded-lg shadow-sm"><ListPlusIcon /></div>
                    <span>Napi előjegyzési lista létrehozása</span>
                 </div>
                 
                 <div className="flex flex-col gap-3 w-full">
                    {/* ELSŐ SOR */}
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="w-full sm:w-auto sm:flex-1 md:w-[220px] md:flex-none">
                        <div className="flex justify-between items-center mb-1.5">
                           <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dátum</label>
                           <div className="flex gap-1">
                             <button onClick={() => setSelectedDate(getTodayDateStr())} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded transition-colors border border-slate-200">Ma</button>
                             <button onClick={() => setSelectedDate(getTomorrowDateStr())} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded transition-colors border border-slate-200">Holnap</button>
                           </div>
                        </div>
                        <ModernDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
                      </div>

                      <div className="w-[calc(50%-0.375rem)] sm:w-20 md:w-24">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kezd</label>
                        <input type="time" value={genStart} onChange={(e) => setGenStart(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" />
                      </div>
                      <div className="w-[calc(50%-0.375rem)] sm:w-20 md:w-24">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Vége</label>
                        <input type="time" value={genEnd} onChange={(e) => setGenEnd(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" />
                      </div>
                      <div className="w-full sm:w-16 md:w-20">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Perc</label>
                        <input type="number" value={genDuration} onChange={(e) => setGenDuration(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" />
                      </div>
                    </div>

                    {/* MÁSODIK SOR */}
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="w-[calc(50%-0.375rem)] sm:w-28">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Szünet Kezd</label>
                        <input type="time" value={genBreakStart} onChange={(e) => setGenBreakStart(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" />
                      </div>
                      <div className="w-[calc(50%-0.375rem)] sm:w-28">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Szünet Vége</label>
                        <input type="time" value={genBreakEnd} onChange={(e) => setGenBreakEnd(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" />
                      </div>
                      
                      <button onClick={generateDailySlots} className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-2.5 rounded-xl hover:from-red-700 hover:to-red-600 font-bold shadow-md shadow-red-500/30 transition-all sm:ml-auto active:scale-95 text-sm h-[42px] mt-2 sm:mt-0">
                        Lista Generálása
                      </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {!printingDate && searchTerm !== "" && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-2xl mb-6 shadow-sm flex items-center gap-3 no-print">
            <SearchIcon size={18} />
            <span className="font-bold">Keresési eredmények a következőre: "{searchTerm}"</span>
            <span className="ml-auto bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-extrabold">{filteredAppointments.length} találat</span>
          </div>
        )}

        {!printingDate && searchTerm === "" && freeSlotsSummary.length > 0 && (
          <div className="mb-8 no-print">
            <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold uppercase tracking-widest text-xs ml-1">
              <CalendarIcon size={16} /> <span>Naptár Áttekintés - Kattints a dátumra</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar scroll-smooth">
              {freeSlotsSummary.map((day) => (
                <button
                  key={day.date}
                  onClick={() => document.getElementById(`date-${day.date}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className={`flex-shrink-0 min-w-[130px] p-3 rounded-2xl border transition-all text-left group backdrop-blur-md
                    ${day.freeCount > 0 ? 'bg-white/90 border-white shadow-sm hover:shadow-md hover:border-emerald-200 cursor-pointer' : 'bg-slate-100/80 border-white/50 opacity-80 cursor-pointer hover:bg-white/90'}`}
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
          <div className="bg-white/80 backdrop-blur-xl p-12 md:p-20 text-center rounded-3xl shadow-sm border border-white/60 flex flex-col items-center no-print">
            <div className="text-slate-300 mb-4"><CalendarIcon size={64} /></div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{searchTerm ? "Nincs találat" : "Még nincsenek időpontok"}</h3>
            <p className="text-slate-600 text-sm font-medium">{searchTerm ? "Próbálkozz más névvel vagy TAJ számmal." : "Válassz dátumot a generátorban, és hozd létre a napot!"}</p>
          </div>
        ) : (
          sortedDates.map((date) => {
            if (printingDate && printingDate !== date) return null;

            const dayAppointments = groupedByDate[date].sort((a: any, b: any) => a.time_slot.localeCompare(b.time_slot));
            const activeSlots = dayAppointments.filter((a: any) => !a.is_deleted);
            const bookedCount = activeSlots.filter((a: any) => a.patient_name && a.patient_name.trim() !== "").length;
            const freeCount = activeSlots.length - bookedCount;

            return (
              <div id={`date-${date}`} key={date} className={`mb-10 rounded-3xl shadow-sm scroll-mt-24 print-container ${printingDate ? 'bg-white border-0 shadow-none' : 'overflow-hidden bg-white/90 backdrop-blur-xl border border-white/60'}`}>
                
                <div className={`p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 print-header ${printingDate ? 'border-b-2 border-black pb-2 mb-2 px-0' : 'bg-white/50 border-b border-white/60'}`}>
                  <div className="flex items-center gap-3 text-slate-900">
                    <CalendarIcon size={20} />
                    <h2 className="text-xl font-bold">{date} {searchTerm !== "" && <span className="text-sm font-medium text-slate-500 ml-2">({dayAppointments[0].department})</span>}</h2>
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">Összes: {activeSlots.length}</span>
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">Szabad: {freeCount}</span>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-red-200">Foglalt: {bookedCount}</span>
                    
                    {!printingDate && (
                      <>
                        <div className="w-px h-6 bg-slate-300 mx-1 hidden sm:block"></div>
                        <button onClick={() => clearEmptySlots(date)} className="bg-white hover:bg-amber-50 text-slate-700 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border border-slate-200 hover:border-amber-300 hover:text-amber-700">
                          <EraserIcon /> <span className="hidden sm:inline">Üres sorok takarítása</span><span className="sm:hidden">Takarít</span>
                        </button>
                        
                        <button onClick={() => exportToCSV(date)} className="bg-white hover:bg-blue-50 text-slate-700 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border border-slate-200 hover:border-blue-300 hover:text-blue-700">
                          <DownloadIcon /> <span className="hidden sm:inline">Excel Export</span><span className="sm:hidden">Excel</span>
                        </button>
                        
                        <button onClick={() => handlePrintDay(date)} className="bg-slate-800 text-white px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center gap-1.5 shadow-sm border border-slate-800">
                          <PrintIcon /> <span className="hidden sm:inline">Nyomtatás</span>
                        </button>
                        <button onClick={() => deleteEntireDay(date)} className="bg-red-50 text-red-600 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm border border-red-200 hover:border-red-600">
                          <TrashIcon /> <span className="hidden sm:inline">Nap törlése</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className={`overflow-x-auto custom-scrollbar ${printingDate ? 'overflow-visible' : ''}`}>
                  <table className="min-w-full text-left border-collapse print-table">
                    <thead>
                      <tr className="border-b border-slate-200/60 print-border">
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap w-min">Időpont</th>
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest min-w-[200px]">Páciens neve</th>
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap w-min">TAJ szám</th>
                        
                        {!printingDate && <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap w-min">Telefon</th>}
                        {!printingDate && <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap w-min">Státusz</th>}
                        
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest w-auto">Vizsgálat</th>
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest w-auto">Megjegyzés</th>
                        {!printingDate && <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest text-center no-print whitespace-nowrap w-min">Művelet</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                      {dayAppointments.map((app: any) => {
                        const isDel = app.is_deleted === true;
                        const isBooked = app.patient_name && app.patient_name.trim() !== "";
                        
                        const canShowHistory = isBooked && !isDel && app.taj_szam && app.taj_szam.trim() !== "";
                        
                        if (printingDate && isDel) return null; 

                        const rowStyle = isDel 
                          ? "bg-slate-100/40 opacity-70 print-hidden" 
                          : isBooked 
                            ? "bg-red-50/70 hover:bg-red-100/60" 
                            : "bg-emerald-50/70 hover:bg-emerald-100/60";

                        return (
                          <tr key={app.id} className={`transition-colors group relative ${printingDate ? '' : rowStyle}`}>
                            
                            <td className="px-4 py-3 align-middle whitespace-nowrap">
                              <div className="flex flex-col gap-1 w-max">
                                <span className={`font-bold text-base ${printingDate ? 'text-black' : isDel ? "text-slate-500 line-through" : isBooked ? "text-red-950" : "text-emerald-950"}`}>{app.time_slot}</span>
                                {!printingDate && !isDel && <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded text-center w-max ${isBooked ? "bg-red-200/60 text-red-900" : "bg-emerald-200/60 text-emerald-900"}`}>{isBooked ? "Foglalt" : "Szabad"}</span>}
                                {!printingDate && isDel && <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded text-center w-max bg-slate-200 text-slate-700">Törölt</span>}
                              </div>
                            </td>
                            
                            <td className={`px-4 py-3 align-middle ${printingDate ? 'text-black font-bold text-sm border-l border-gray-300' : ''}`}>
                              {printingDate ? app.patient_name : (
                                <div className="relative">
                                  <EditableCell disabled={isDel} highlight={isBooked} formatter={formatName} value={app.patient_name} onSave={(val) => updateAppointment(app.id, "patient_name", val)} />
                                  {canShowHistory && (
                                    <button 
                                      onClick={() => openPatientHistory(app.patient_name, app.taj_szam)} 
                                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white text-slate-500 hover:text-red-600 shadow-sm rounded-lg border border-slate-200 opacity-0 group-hover:opacity-100 transition-all z-10" 
                                      title="Előzmények / Karton"
                                    >
                                      <HistoryIcon />
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                            
                            <td className={`px-4 py-3 align-middle whitespace-nowrap ${printingDate ? 'text-black font-mono text-sm border-l border-gray-300' : ''}`}>
                              {printingDate ? formatTAJ(app.taj_szam) : <EditableCell disabled={isDel} highlight={isBooked} formatter={formatTAJ} value={app.taj_szam} onSave={(val) => updateAppointment(app.id, "taj_szam", val)} />}
                            </td>
                            
                            {!printingDate && (
                              <>
                                <td className="px-4 py-3 align-middle whitespace-nowrap"><EditableCell disabled={isDel} highlight={isBooked} formatter={formatPhone} value={app.phone_number} onSave={(val) => updateAppointment(app.id, "phone_number", val)} /></td>
                                
                                <td className="px-4 py-3 align-middle whitespace-nowrap"><ModernStatusSelect disabled={isDel || !isBooked} value={app.status} onChange={(val) => updateAppointment(app.id, "status", val)} /></td>
                              </>
                            )}
                            
                            <td className={`px-4 py-3 align-middle ${printingDate ? 'text-black text-sm border-l border-gray-300' : ''}`}>
                              {printingDate ? app.examination_type : <EditableCell disabled={isDel} highlight={isBooked} value={app.examination_type} onSave={(val) => updateAppointment(app.id, "examination_type", val)} />}
                            </td>
                            <td className={`px-4 py-3 align-middle ${printingDate ? 'text-black text-sm border-l border-gray-300' : ''}`}>
                              {printingDate ? app.notes : <EditableCell disabled={isDel} highlight={isBooked} value={app.notes} onSave={(val) => updateAppointment(app.id, "notes", val)} />}
                            </td>
                            
                            {!printingDate && (
                              <td className="px-4 py-3 align-middle text-center no-print whitespace-nowrap">
                                {isDel ? (
                                  <button onClick={() => restoreAppointment(app.id)} className="bg-white/80 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white shadow-sm border border-slate-200 transition-all flex items-center justify-center gap-1.5 mx-auto"><RestoreIcon /> Visszaállít</button>
                                ) : (
                                  <button onClick={() => confirmDeleteApp(app.id)} className="text-black/30 hover:text-red-600 hover:bg-red-50 shadow-sm p-2 rounded-lg transition-all flex items-center justify-center mx-auto" title="Törlés"><TrashIcon /></button>
                                )}
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:hidden no-print">
                    {dayAppointments.map((app: any) => {
                      const isDel = app.is_deleted === true;
                      const isBooked = app.patient_name && app.patient_name.trim() !== "";
                      const canShowHistory = isBooked && !isDel && app.taj_szam && app.taj_szam.trim() !== "";
                      
                      const cardStyle = isDel 
                        ? "bg-slate-100/50 border-slate-200/50 opacity-80" 
                        : isBooked 
                          ? "bg-red-50/90 border-white shadow-sm" 
                          : "bg-emerald-50/90 border-white shadow-sm";

                      return (
                        <div key={`mob-${app.id}`} className={`rounded-2xl p-5 border transition-all ${cardStyle}`}>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col gap-1">
                               <span className={`font-bold text-xl ${isDel ? "text-slate-500 line-through" : isBooked ? "text-red-950" : "text-emerald-950"}`}>{app.time_slot}</span>
                               <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded text-center w-max ${isDel ? "bg-slate-200 text-slate-700" : isBooked ? "bg-red-200/60 text-red-900" : "bg-emerald-200/60 text-emerald-900"}`}>
                                 {isDel ? "Törölt" : isBooked ? "Foglalt" : "Szabad"}
                               </span>
                            </div>
                            {isDel ? (
                              <button onClick={() => restoreAppointment(app.id)} className="bg-white/80 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white shadow-sm border border-slate-200 flex items-center gap-1.5"><RestoreIcon /> Vissza</button>
                            ) : (
                              <button onClick={() => confirmDeleteApp(app.id)} className="text-black/40 hover:text-red-600 hover:bg-white/80 shadow-sm p-2 rounded-lg"><TrashIcon /></button>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-3">
                            <div className="bg-white/70 p-2.5 rounded-xl border border-white/50">
                              <div className="flex justify-between items-center mb-1 relative z-10">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Páciens neve</span>
                                <div className="flex items-center gap-2">
                                  {canShowHistory && (
                                    <button onClick={() => openPatientHistory(app.patient_name, app.taj_szam)} className="p-1.5 bg-white text-slate-600 shadow-sm rounded-lg border border-slate-200">
                                      <HistoryIcon />
                                    </button>
                                  )}
                                  <div className="w-[130px]"><ModernStatusSelect disabled={isDel || !isBooked} value={app.status} onChange={(val) => updateAppointment(app.id, "status", val)} /></div>
                                </div>
                              </div>
                              <EditableCell disabled={isDel} highlight={isBooked} formatter={formatName} value={app.patient_name} onSave={(val) => updateAppointment(app.id, "patient_name", val)} />
                            </div>
                            <div className="grid grid-cols-2 gap-3 relative z-0">
                              <div className="bg-white/70 p-2.5 rounded-xl border border-white/50">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">TAJ szám</span>
                                <EditableCell disabled={isDel} highlight={isBooked} formatter={formatTAJ} value={app.taj_szam} onSave={(val) => updateAppointment(app.id, "taj_szam", val)} />
                              </div>
                              <div className="bg-white/70 p-2.5 rounded-xl border border-white/50">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Telefon</span>
                                <EditableCell disabled={isDel} highlight={isBooked} formatter={formatPhone} value={app.phone_number} onSave={(val) => updateAppointment(app.id, "phone_number", val)} />
                              </div>
                            </div>
                            <div className="bg-white/70 p-2.5 rounded-xl border border-white/50 relative z-0">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Vizsgálat & Megjegyzés</span>
                              <EditableCell disabled={isDel} highlight={isBooked} value={app.examination_type} onSave={(val) => updateAppointment(app.id, "examination_type", val)} />
                              <div className="mt-1 border-t border-black/5 pt-1">
                                <EditableCell disabled={isDel} highlight={isBooked} value={app.notes} onSave={(val) => updateAppointment(app.id, "notes", val)} />
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-black/5 text-[10px] opacity-70 flex justify-between">
                            {isDel ? (
                              <span>Törölte: <b className="font-semibold">{app.deleted_by}</b> ({formatDateTime(app.deleted_at)})</span>
                            ) : app.last_modified_by ? (
                              <span>Mód: <b className="font-semibold">{app.last_modified_by}</b> ({formatDateTime(app.last_modified_at)})</span>
                            ) : <span>-</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {!printingDate && searchTerm === "" && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-sm border border-white/60 w-full sm:w-max sm:ml-auto no-print">
            <input type="text" placeholder="pl. 17:00 - 17:15" value={newTimeSlot} onChange={(e) => setNewTimeSlot(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSingleAppointment()} className="w-full sm:w-40 bg-white/80 border border-white p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 text-sm font-semibold text-slate-900 transition-all text-center sm:text-left shadow-sm" />
            <button onClick={addSingleAppointment} className="w-full sm:w-auto bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-black font-semibold shadow-md transition-all active:scale-95 text-sm flex items-center justify-center gap-1.5"><PlusIcon /> Új időpont</button>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.4); border-radius: 10px; margin: 0 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(203, 213, 225, 0.8); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 1); }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @media print {
          @page { margin: 1cm; size: portrait; }
          body, html { background: white !important; color: black !important; font-family: sans-serif; height: auto !important; overflow: visible !important; }
          .no-print { display: none !important; }
          .print-mode { background: white !important; min-height: auto !important; padding: 0 !important; display: block !important; position: static !important; overflow: visible !important; }
          
          .print-container { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; page-break-after: auto; overflow: visible !important; }
          .overflow-visible { overflow: visible !important; }
          
          .print-table { width: 100% !important; border-collapse: collapse !important; margin-top: 10px !important; table-layout: fixed; page-break-inside: auto; }
          .print-table thead { display: table-header-group; }
          .print-table tr { page-break-inside: avoid; page-break-after: auto; }
          
          .print-table th { border: 1px solid #333 !important; padding: 6px !important; color: black !important; font-size: 11px !important; font-weight: bold !important; background: #f3f4f6 !important; -webkit-print-color-adjust: exact; text-align: left; }
          .print-table td { border: 1px solid #666 !important; padding: 4px 6px !important; color: black !important; font-size: 11px !important; line-height: 1.2 !important; word-break: break-word; }
          
          .print-header { padding: 0 0 5px 0 !important; margin-bottom: 5px !important; border-bottom: 2px solid black !important; display: flex !important; justify-content: space-between !important; }
          .print-header h2 { font-size: 18px !important; margin: 0 !important; font-weight: bold !important; }
          .print-header span { border: none !important; background: none !important; padding: 0 !important; margin-right: 15px !important; color: black !important; font-size: 12px !important; font-weight: bold !important; }
          
          .print-hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}