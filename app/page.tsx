"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";

// --- Professzionális Minimalista Ikonok ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const CalendarIcon = ({ size = 24 }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const TrashIcon = ({ size = 16 }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const RestoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const PrintIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>;
const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;

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

// --- OKOS CELLA (Formázó funkcióval) ---
function EditableCell({ value, onSave, disabled = false, highlight = false, formatter }: { value: string; onSave: (val: string) => void; disabled?: boolean; highlight?: boolean; formatter?: (v: string) => string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || "");

  const handleBlur = () => { 
    setIsEditing(false); 
    const finalVal = formatter ? formatter(currentValue) : currentValue;
    if (finalVal !== value) onSave(finalVal); 
    setCurrentValue(finalVal);
  };

  if (disabled) return <div className="p-2 text-slate-400 font-medium line-through bg-slate-50/50 rounded-lg">{value || "-"}</div>;

  if (isEditing) {
    return (
      <input autoFocus value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} onBlur={handleBlur} onKeyDown={(e) => e.key === "Enter" && handleBlur()}
        className="w-full bg-white border border-red-400 p-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-100 text-slate-900 font-semibold shadow-sm transition-all"
      />
    );
  }

  return (
    <div onClick={() => { setIsEditing(true); setCurrentValue(value || ""); }}
      className={`cursor-pointer min-h-[38px] p-2 rounded-lg transition-all border border-transparent hover:bg-white/80 hover:border-slate-200 font-medium
        ${highlight ? "text-red-950 font-bold" : "text-emerald-950"}`}
      title="Kattints a szerkesztéshez"
    >
      {value || <span className="text-slate-400 italic text-sm font-normal opacity-70">Üres (kattints)</span>}
    </div>
  );
}

// --- STÁTUSZ VÁLASZTÓ ---
function StatusSelect({ value, onChange, disabled }: { value: string, onChange: (val: string) => void, disabled: boolean }) {
  if (disabled) return <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">-</span>;
  
  const statusColors: Record<string, string> = {
    "Előjegyzett": "bg-slate-100 text-slate-600 border-slate-200",
    "Megérkezett": "bg-amber-100 text-amber-700 border-amber-200",
    "Vizsgálaton": "bg-blue-100 text-blue-700 border-blue-200",
    "Befejezve": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Nem jelent meg": "bg-slate-700 text-white border-slate-800"
  };

  const currentStyle = statusColors[value] || statusColors["Előjegyzett"];

  return (
    <select 
      value={value || "Előjegyzett"} 
      onChange={(e) => onChange(e.target.value)}
      className={`text-[10px] uppercase font-bold tracking-widest px-2 py-1.5 rounded-lg outline-none cursor-pointer border shadow-sm transition-all w-full appearance-none text-center ${currentStyle}`}
    >
      <option value="Előjegyzett">Előjegyzett</option>
      <option value="Megérkezett">Megérkezett</option>
      <option value="Vizsgálaton">Vizsgálaton</option>
      <option value="Befejezve">Befejezve</option>
      <option value="Nem jelent meg">Nem jelent meg</option>
    </select>
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

  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(CATEGORIES[0]);
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

  // Print figyelő
  useEffect(() => {
    const handleAfterPrint = () => setPrintingDate(null);
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

  const handlePrintDay = (date: string) => {
    setPrintingDate(date);
    setTimeout(() => { window.print(); }, 100);
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
    if (error) alert("Hiba a belépésnél: Hibás email vagy jelszó.");
  };

  const handleSaveProfileName = async () => {
    if (!profileNameInput.trim()) return alert("Kérlek, add meg a neved!");
    const { data, error } = await supabase.auth.updateUser({ data: { display_name: profileNameInput } });
    if (error) alert("Hiba a mentés során!");
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

  const deleteAppointment = async (id: number) => {
    if (!confirm("Biztosan törlöd ezt az időpontot?")) return;
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    setAppointments(appointments.map((app: any) => app.id === id ? { ...app, is_deleted: true, deleted_by: modifierName, deleted_at: now } : app));
    await supabase.from("appointments").update({ is_deleted: true, deleted_by: modifierName, deleted_at: now }).eq("id", id);
  };

  const restoreAppointment = async (id: number) => {
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    setAppointments(appointments.map((app: any) => app.id === id ? { ...app, is_deleted: false, last_modified_by: modifierName, last_modified_at: now } : app));
    await supabase.from("appointments").update({ is_deleted: false, last_modified_by: modifierName, last_modified_at: now }).eq("id", id);
  };

  const generateDailySlots = async () => {
    if (!selectedDate) return alert("Kérlek, válassz ki egy dátumot a naptárból!");
    if (!genStart || !genEnd || !genDuration) return alert("Minden generátor mezőt ki kell tölteni!");
    const durationMins = parseInt(genDuration);
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

    if (slotsToCreate.length === 0) return alert("A megadott feltételekkel nem jött létre időpont.");
    if (!confirm(`Generálok ${slotsToCreate.length} db időpontot a ${selectedDate} napra. Mehet?`)) return;

    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    const newAppointments = slotsToCreate.map((slot: string) => ({
      department: activeTab, appointment_date: selectedDate, time_slot: slot,
      patient_name: "", taj_szam: "", phone_number: "", examination_type: "", notes: "", status: "Előjegyzett",
      last_modified_by: modifierName, last_modified_at: now, is_deleted: false
    }));

    await supabase.from("appointments").insert(newAppointments);
  };

  const addSingleAppointment = async () => {
    if (!user || !newTimeSlot.trim() || !selectedDate) return alert("Kérlek, adj meg dátumot és időpontot is!");
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    await supabase.from("appointments").insert([{
      department: activeTab, appointment_date: selectedDate, time_slot: newTimeSlot,
      patient_name: "", taj_szam: "", phone_number: "", examination_type: "", notes: "", status: "Előjegyzett",
      last_modified_by: modifierName, last_modified_at: now, is_deleted: false
    }]);
    setNewTimeSlot("");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 font-sans bg-cover bg-center bg-fixed relative" style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')` }}>
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

  // --- OKOS KERESŐ ÉS SZŰRŐ LOGIKA ---
  let filteredAppointments = appointments;
  
  if (searchTerm.trim() !== "") {
    // Ha keresünk, minden osztályon keresünk
    const term = searchTerm.toLowerCase();
    filteredAppointments = filteredAppointments.filter((app: any) => 
      (app.patient_name && app.patient_name.toLowerCase().includes(term)) ||
      (app.taj_szam && app.taj_szam.includes(term)) ||
      (app.phone_number && app.phone_number.includes(term))
    );
  } else {
    // Ha nem keresünk, marad a kategória szűrés
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
          
          {/* OKOS KERESŐ MEZŐ */}
          <div className="flex-1 max-w-lg w-full relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><SearchIcon /></div>
            <input 
              type="text" 
              placeholder="Keresés név, TAJ vagy telefonszám alapján..." 
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
        
        {/* --- KONTROLL SÁV (Elrejtve nyomtatásnál és keresésnél) --- */}
        {!printingDate && searchTerm === "" && (
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm border border-white/60 p-6 mb-6 no-print">
            <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center justify-between">
              <div className="w-full xl:w-1/2">
                <label className="block text-slate-500 font-semibold text-xs uppercase tracking-widest mb-3">Szakrendelés kiválasztása</label>
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setActiveTab(c)} className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold text-sm transition-all border ${activeTab === c ? 'bg-red-600 border-red-600 text-white shadow-md' : 'bg-white/80 border-white text-slate-600 hover:bg-white hover:border-slate-200 shadow-sm'}`}>
                      {c}
                    </button>
                  ))}
                </div>
                <label className="mt-4 flex items-center gap-3 cursor-pointer group w-max">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors duration-300 border ${showDeleted ? "bg-slate-800 border-slate-800" : "bg-slate-200 border-slate-300 group-hover:bg-slate-300"}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${showDeleted ? "translate-x-4" : "translate-x-0"}`}></div>
                  </div>
                  <span className={`font-semibold text-sm transition-colors duration-300 ${showDeleted ? "text-slate-800" : "text-slate-500 group-hover:text-slate-700"}`}>Törölt sorok mutatása</span>
                </label>
              </div>

              <div className="w-px h-24 bg-slate-200/60 hidden xl:block"></div>

              <div className="w-full xl:w-auto flex-1">
                 <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold"><SettingsIcon /> <span>Napi Előjegyzés Generátor</span></div>
                 <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-end gap-3">
                    <div className="col-span-2 lg:col-span-1"><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Dátum</label><input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" /></div>
                    <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kezd</label><input type="time" value={genStart} onChange={(e) => setGenStart(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" /></div>
                    <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Vége</label><input type="time" value={genEnd} onChange={(e) => setGenEnd(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" /></div>
                    <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Perc</label><input type="number" value={genDuration} onChange={(e) => setGenDuration(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none w-full lg:w-16 font-semibold text-slate-800 transition-all shadow-sm" /></div>
                    
                    <div className="hidden lg:block w-px h-10 bg-slate-300/50 mx-1 mb-1"></div>
                    <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Szünet Kezd</label><input type="time" value={genBreakStart} onChange={(e) => setGenBreakStart(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" /></div>
                    <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Szünet Vége</label><input type="time" value={genBreakEnd} onChange={(e) => setGenBreakEnd(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" /></div>
                    
                    <button onClick={generateDailySlots} className="col-span-2 lg:col-span-1 w-full lg:w-auto bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-black font-semibold shadow-md transition-all lg:ml-auto active:scale-95 text-sm flex items-center justify-center gap-2 mt-2 lg:mt-0"><SettingsIcon /> Létrehozás</button>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* --- KERESÉSI EREDMÉNY CÍMSOR --- */}
        {!printingDate && searchTerm !== "" && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-2xl mb-6 shadow-sm flex items-center gap-3 no-print">
            <SearchIcon />
            <span className="font-bold">Keresési eredmények a következőre: "{searchTerm}"</span>
            <span className="ml-auto bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-extrabold">{filteredAppointments.length} találat</span>
          </div>
        )}

        {/* --- GYORSNAPTÁR WIDGET --- */}
        {!printingDate && searchTerm === "" && freeSlotsSummary.length > 0 && (
          <div className="mb-8 no-print">
            <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold uppercase tracking-widest text-xs ml-1">
              <CalendarIcon size={16} /> <span>Naptár Áttekintés - Kattints a dátumra</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
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

        {/* --- IDŐPONTOK MEGJELENÍTÉSE --- */}
        {sortedDates.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl p-12 md:p-20 text-center rounded-3xl shadow-sm border border-white/60 flex flex-col items-center no-print">
            <div className="text-slate-300 mb-4"><CalendarIcon size={64} /></div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{searchTerm ? "Nincs találat" : "Még nincsenek időpontok"}</h3>
            <p className="text-slate-600 text-sm font-medium">{searchTerm ? "Próbálkozz más névvel vagy TAJ számmal." : "Válassz dátumot a generátorban, és hozd létre a napot!"}</p>
          </div>
        ) : (
          sortedDates.map((date) => {
            // Ha épp nyomtatunk, de nem ezt a napot, akkor elrejtjük
            if (printingDate && printingDate !== date) return null;

            const dayAppointments = groupedByDate[date].sort((a: any, b: any) => a.time_slot.localeCompare(b.time_slot));
            const activeSlots = dayAppointments.filter((a: any) => !a.is_deleted);
            const bookedCount = activeSlots.filter((a: any) => a.patient_name && a.patient_name.trim() !== "").length;
            const freeCount = activeSlots.length - bookedCount;

            return (
              <div id={`date-${date}`} key={date} className={`mb-10 rounded-3xl shadow-sm overflow-hidden scroll-mt-24 print-container ${printingDate ? 'bg-white border-0 shadow-none' : 'bg-white/90 backdrop-blur-xl border border-white/60'}`}>
                
                {/* Fejléc Dátummal és Nyomtatás gombbal */}
                <div className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 print-header ${printingDate ? 'border-b-2 border-black pb-2 mb-4 px-0' : 'bg-white/50 border-b border-white/60'}`}>
                  <div className="flex items-center gap-3 text-slate-900">
                    <CalendarIcon size={20} />
                    <h2 className="text-xl font-bold">{date} {searchTerm !== "" && <span className="text-sm font-medium text-slate-500 ml-2">({dayAppointments[0].department})</span>}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200">Összes: {activeSlots.length}</span>
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">Szabad: {freeCount}</span>
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-red-200">Foglalt: {bookedCount}</span>
                    {!printingDate && (
                      <button onClick={() => handlePrintDay(date)} className="ml-2 bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center gap-1.5 shadow-sm">
                        <PrintIcon /> Nyomtatás
                      </button>
                    )}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-collapse print-table">
                    <thead>
                      <tr className="border-b border-slate-200/60 print-border">
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest w-24">Időpont</th>
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest w-1/5">Páciens neve</th>
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest">TAJ szám</th>
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest">Telefon</th>
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest">Státusz</th>
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest">Vizsgálat</th>
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest w-1/6">Megjegyzés</th>
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest text-center no-print">Művelet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                      {dayAppointments.map((app: any) => {
                        const isDel = app.is_deleted === true;
                        const isBooked = app.patient_name && app.patient_name.trim() !== "";
                        
                        const rowStyle = isDel 
                          ? "bg-slate-100/40 opacity-70 print-hidden" 
                          : isBooked 
                            ? "bg-red-50/70 hover:bg-red-100/60" 
                            : "bg-emerald-50/70 hover:bg-emerald-100/60";

                        if (printingDate && isDel) return null; // Nyomtatásba ne kerüljön törölt sor

                        return (
                          <tr key={app.id} className={`transition-colors group ${printingDate ? 'border-b border-gray-300' : rowStyle}`}>
                            <td className="px-4 py-3 align-middle">
                              <div className="flex flex-col gap-1 w-max">
                                <span className={`font-bold text-base ${isDel ? "text-slate-500 line-through" : isBooked ? "text-red-950" : "text-emerald-950"}`}>{app.time_slot}</span>
                                {!printingDate && !isDel && <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded text-center w-max ${isBooked ? "bg-red-200/60 text-red-900" : "bg-emerald-200/60 text-emerald-900"}`}>{isBooked ? "Foglalt" : "Szabad"}</span>}
                                {!printingDate && isDel && <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded text-center w-max bg-slate-200 text-slate-700">Törölt</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3 align-middle"><EditableCell disabled={isDel} highlight={isBooked} value={app.patient_name} onSave={(val) => updateAppointment(app.id, "patient_name", val)} /></td>
                            <td className="px-4 py-3 align-middle"><EditableCell disabled={isDel} highlight={isBooked} formatter={formatTAJ} value={app.taj_szam} onSave={(val) => updateAppointment(app.id, "taj_szam", val)} /></td>
                            <td className="px-4 py-3 align-middle"><EditableCell disabled={isDel} highlight={isBooked} formatter={formatPhone} value={app.phone_number} onSave={(val) => updateAppointment(app.id, "phone_number", val)} /></td>
                            <td className="px-4 py-3 align-middle">
                              {!printingDate ? (
                                <StatusSelect disabled={isDel || !isBooked} value={app.status} onChange={(val) => updateAppointment(app.id, "status", val)} />
                              ) : (
                                <span className="font-bold text-xs uppercase">{isBooked ? app.status : ''}</span>
                              )}
                            </td>
                            <td className="px-4 py-3 align-middle"><EditableCell disabled={isDel} highlight={isBooked} value={app.examination_type} onSave={(val) => updateAppointment(app.id, "examination_type", val)} /></td>
                            <td className="px-4 py-3 align-middle"><EditableCell disabled={isDel} highlight={isBooked} value={app.notes} onSave={(val) => updateAppointment(app.id, "notes", val)} /></td>
                            <td className="px-4 py-3 align-middle text-center no-print">
                              {isDel ? (
                                <button onClick={() => restoreAppointment(app.id)} className="bg-white/80 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white shadow-sm border border-slate-200 transition-all flex items-center justify-center gap-1.5 mx-auto"><RestoreIcon /> Visszaállít</button>
                              ) : (
                                <button onClick={() => deleteAppointment(app.id)} className="text-black/30 hover:text-red-600 hover:bg-white/80 shadow-sm p-2 rounded-lg transition-all flex items-center justify-center mx-auto" title="Törlés"><TrashIcon /></button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* MOBIL KÁRTYÁK (Csak képernyőn) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:hidden no-print">
                    {dayAppointments.map((app: any) => {
                      const isDel = app.is_deleted === true;
                      const isBooked = app.patient_name && app.patient_name.trim() !== "";
                      
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
                              <button onClick={() => deleteAppointment(app.id)} className="text-black/40 hover:text-red-600 hover:bg-white/80 shadow-sm p-2 rounded-lg"><TrashIcon /></button>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-3">
                            <div className="bg-white/70 p-2.5 rounded-xl border border-white/50">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Páciens neve</span>
                                <div className="w-1/2"><StatusSelect disabled={isDel || !isBooked} value={app.status} onChange={(val) => updateAppointment(app.id, "status", val)} /></div>
                              </div>
                              <EditableCell disabled={isDel} highlight={isBooked} value={app.patient_name} onSave={(val) => updateAppointment(app.id, "patient_name", val)} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-white/70 p-2.5 rounded-xl border border-white/50">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">TAJ szám</span>
                                <EditableCell disabled={isDel} highlight={isBooked} formatter={formatTAJ} value={app.taj_szam} onSave={(val) => updateAppointment(app.id, "taj_szam", val)} />
                              </div>
                              <div className="bg-white/70 p-2.5 rounded-xl border border-white/50">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Telefon</span>
                                <EditableCell disabled={isDel} highlight={isBooked} formatter={formatPhone} value={app.phone_number} onSave={(val) => updateAppointment(app.id, "phone_number", val)} />
                              </div>
                            </div>
                            <div className="bg-white/70 p-2.5 rounded-xl border border-white/50">
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
      
      {/* NYOMTATÁSI STÍLUSOK */}
      <style dangerouslySetContent={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @media print {
          @page { margin: 1cm; size: landscape; }
          body { background: white !important; color: black !important; }
          .no-print { display: none !important; }
          .print-mode { background: white !important; }
          .print-container { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; }
          .print-table th, .print-table td { border: 1px solid #ddd !important; padding: 8px !important; color: black !important; }
          .print-header { padding: 0 0 10px 0 !important; }
        }
      `}} />
    </div>
  );
}