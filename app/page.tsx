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

// --- Az "Okos Cella" Prémium Dizájnnal ---
function EditableCell({ value, onSave, disabled = false, highlight = false }: { value: string; onSave: (val: string) => void; disabled?: boolean; highlight?: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || "");

  const handleBlur = () => { setIsEditing(false); if (currentValue !== value) onSave(currentValue); };

  if (disabled) return <div className="p-2 text-slate-400 font-medium line-through bg-slate-50/50 rounded-lg">{value || "-"}</div>;

  if (isEditing) {
    return (
      <input autoFocus value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} onBlur={handleBlur} onKeyDown={(e) => e.key === "Enter" && handleBlur()}
        className="w-full bg-white border border-red-400 p-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-100 text-slate-900 font-semibold shadow-sm transition-all"
      />
    );
  }

  return (
    <div onClick={() => setIsEditing(true)}
      className={`cursor-pointer min-h-[38px] p-2 rounded-lg transition-all border border-transparent hover:bg-slate-50 hover:border-slate-200 font-medium
        ${highlight ? "text-slate-900 font-bold" : "text-slate-700"}`}
      title="Kattints a szerkesztéshez"
    >
      {value || <span className="text-slate-300 italic text-sm font-normal">Üres (kattints)</span>}
    </div>
  );
}

const formatDateTime = (isoString: string) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("hu-HU", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
};
const timeToMins = (t: string) => { const [h, m] = t.split(':'); return parseInt(h) * 60 + parseInt(m); };
const minsToTime = (m: number) => { const h = Math.floor(m / 60).toString().padStart(2, '0'); const mins = (m % 60).toString().padStart(2, '0'); return `${h}:${mins}`; };

// --- Főoldal ---
export default function Home() {
  // FEJLESZTŐI ESZKÖZÖK BLOKKOLÁSA
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12') e.preventDefault();
      if (e.ctrlKey && e.shiftKey && e.key === 'I') e.preventDefault();
      if (e.ctrlKey && e.shiftKey && e.key === 'J') e.preventDefault();
      if (e.ctrlKey && e.key === 'u') e.preventDefault();
    };
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  const CATEGORIES = [
    "Belgyógyászat", "Ultrahang", "Kardiológia", "Bőrgyógyászat", 
    "Szemészet", "Fül-orr-gégészet", "Nőgyógyászat", "Urológia", 
    "Reumatológia", "Sebészet", "Ortopédia", "Neurológia"
  ];

  const [appointments, setAppointments] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(CATEGORIES[0]);
  const [showDeleted, setShowDeleted] = useState(false);
  
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
      patient_name: "", taj_szam: "", examination_type: "", notes: "",
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
      patient_name: "", taj_szam: "", examination_type: "", notes: "",
      last_modified_by: modifierName, last_modified_at: now, is_deleted: false
    }]);
    setNewTimeSlot("");
  };

  // --- 1. BEJELENTKEZŐ KÉPERNYŐ ---
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
        <div className="bg-white p-10 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md border border-slate-100">
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="Medical-Aqua Logo" className="h-28 object-contain select-none pointer-events-none" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-center text-slate-900 tracking-tight">Klinikai Rendszer</h2>
          <p className="text-center text-slate-500 mb-8 text-sm">Jelentkezz be a folytatáshoz</p>
          <div className="space-y-4">
            <input type="email" placeholder="E-mail cím" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full p-3.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400" />
            <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full p-3.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400" />
            <button onClick={handleLogin} className="w-full bg-red-600 text-white py-3.5 rounded-xl font-semibold shadow-sm hover:bg-red-700 hover:shadow transition-all active:scale-95 mt-2">Belépés</button>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. PROFILNÉV MEGADÁSA ---
  if (needsProfileName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 font-sans">
        <div className="bg-white p-10 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md border border-slate-100 text-center">
          <div className="flex justify-center text-red-600 mb-6"><UserIcon /></div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900">Üdvözlünk a rendszerben!</h2>
          <p className="text-slate-500 mb-8 text-sm">Kérjük, add meg a teljes nevedet a naplózáshoz (pl. Dr. Kovács).</p>
          <input type="text" placeholder="Teljes neved..." value={profileNameInput} onChange={(e) => setProfileNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSaveProfileName()} className="w-full p-3.5 bg-slate-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400 mb-4 text-center" />
          <button onClick={handleSaveProfileName} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold shadow-sm hover:bg-black transition-all active:scale-95">Mentés és Tovább</button>
        </div>
      </div>
    );
  }

  // --- ADATOK SZŰRÉSE ---
  let filteredAppointments = appointments.filter((app: any) => app.department === activeTab);
  if (!showDeleted) filteredAppointments = filteredAppointments.filter((app: any) => app.is_deleted !== true);
  
  const groupedByDate = filteredAppointments.reduce((acc: any, app: any) => {
    const d = app.appointment_date || "Dátum nélkül";
    if (!acc[d]) acc[d] = [];
    acc[d].push(app);
    return acc;
  }, {});
  const sortedDates = Object.keys(groupedByDate).sort();

  // --- 3. FŐ KÉPERNYŐ (DASHBOARD) ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      
      {/* --- PRÉMIUM ÜVEG FEJLÉC --- */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <img src="/logo.png" alt="Medical-Aqua" className="h-10 object-contain select-none pointer-events-none hidden sm:block" />
             <div>
               <h1 className="text-xl font-bold tracking-tight text-slate-900">Medical-Aqua</h1>
               <p className="text-red-600 font-medium text-[11px] tracking-widest uppercase">Előjegyzési Rendszer</p>
             </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="flex items-center gap-2 text-slate-700 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
              <UserIcon />
              <span className="font-semibold text-sm">{getDisplayName()}</span>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-red-600 transition-colors p-2" title="Kijelentkezés">
              <LogoutIcon />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8">
        
        {/* --- KONTROLL SÁV (Kategóriák + Generátor) --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center justify-between">
            
            {/* Vízszintesen görgethető Kategória Gombok (Modern UI) */}
            <div className="w-full xl:w-1/2">
              <label className="block text-slate-500 font-semibold text-xs uppercase tracking-widest mb-3">Szakrendelés kiválasztása</label>
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                {CATEGORIES.map(c => (
                  <button key={c} onClick={() => setActiveTab(c)} className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold text-sm transition-all border ${activeTab === c ? 'bg-red-600 border-red-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'}`}>
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

            <div className="w-px h-24 bg-slate-100 hidden xl:block"></div>

            {/* Letisztult Generátor */}
            <div className="w-full xl:w-auto flex-1">
               <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold"><SettingsIcon /> <span>Napi Előjegyzés Generátor</span></div>
               <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-end gap-3">
                  <div className="col-span-2 sm:col-span-1"><label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Dátum</label><input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all" /></div>
                  <div><label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Kezd</label><input type="time" value={genStart} onChange={(e) => setGenStart(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all" /></div>
                  <div><label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Vége</label><input type="time" value={genEnd} onChange={(e) => setGenEnd(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all" /></div>
                  <div><label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Perc</label><input type="number" value={genDuration} onChange={(e) => setGenDuration(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none sm:w-20 font-semibold text-slate-800 transition-all" /></div>
                  <button onClick={generateDailySlots} className="col-span-2 sm:col-span-1 w-full sm:w-auto bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-black font-semibold shadow-sm transition-all sm:ml-auto active:scale-95 text-sm flex items-center justify-center gap-2 mt-2 sm:mt-0"><SettingsIcon /> Létrehozás</button>
               </div>
            </div>
          </div>
        </div>

        {/* --- IDŐPONTOK MEGJELENÍTÉSE --- */}
        {sortedDates.length === 0 ? (
          <div className="bg-white p-12 md:p-20 text-center rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center">
            <div className="text-slate-200 mb-4"><CalendarIcon size={64} /></div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Még nincsenek időpontok</h3>
            <p className="text-slate-500 text-sm">Válassz dátumot a generátorban, és hozd létre a napot!</p>
          </div>
        ) : (
          sortedDates.map((date) => {
            const dayAppointments = groupedByDate[date].sort((a: any, b: any) => a.time_slot.localeCompare(b.time_slot));
            const activeSlots = dayAppointments.filter((a: any) => !a.is_deleted);
            const bookedCount = activeSlots.filter((a: any) => a.patient_name && a.patient_name.trim() !== "").length;
            const freeCount = activeSlots.length - bookedCount;

            return (
              <div key={date} className="mb-10 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Fejléc Dátummal */}
                <div className="bg-slate-50 border-b border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-slate-900"><CalendarIcon size={20} /><h2 className="text-lg font-bold">{date}</h2></div>
                  <div className="flex gap-2">
                    <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">Összes: {activeSlots.length}</span>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">Szabad: {freeCount}</span>
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Foglalt: {bookedCount}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  {/* ASZTALI NÉZET */}
                  <table className="min-w-full text-left border-collapse hidden lg:table">
                    <thead>
                      <tr className="bg-white border-b border-slate-100">
                        <th className="px-5 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-widest">Időpont</th>
                        <th className="px-5 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-widest w-1/5">Páciens neve</th>
                        <th className="px-5 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-widest">TAJ szám</th>
                        <th className="px-5 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-widest">Vizsgálat</th>
                        <th className="px-5 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-widest w-1/4">Megjegyzés</th>
                        <th className="px-5 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-widest">Módosítva</th>
                        <th className="px-5 py-4 font-semibold text-slate-400 text-[11px] uppercase tracking-widest text-center">Művelet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dayAppointments.map((app: any) => {
                        const isDel = app.is_deleted === true;
                        const isBooked = app.patient_name && app.patient_name.trim() !== "";
                        
                        return (
                          <tr key={app.id} className={`transition-colors group ${isDel ? "bg-slate-50/50" : "hover:bg-slate-50 bg-white"}`}>
                            <td className="px-5 py-3 align-top">
                              <div className="flex flex-col gap-1.5 w-max pt-1">
                                <span className={`font-bold text-base ${isDel ? "text-slate-400 line-through" : "text-slate-800"}`}>{app.time_slot}</span>
                                {!isDel && <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded text-center w-max ${isBooked ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>{isBooked ? "Foglalt" : "Szabad"}</span>}
                                {isDel && <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded text-center w-max bg-slate-200 text-slate-600">Törölt</span>}
                              </div>
                            </td>
                            <td className="px-5 py-3 align-top"><EditableCell disabled={isDel} highlight={isBooked} value={app.patient_name} onSave={(val) => updateAppointment(app.id, "patient_name", val)} /></td>
                            <td className="px-5 py-3 align-top"><EditableCell disabled={isDel} highlight={isBooked} value={app.taj_szam} onSave={(val) => updateAppointment(app.id, "taj_szam", val)} /></td>
                            <td className="px-5 py-3 align-top"><EditableCell disabled={isDel} highlight={isBooked} value={app.examination_type} onSave={(val) => updateAppointment(app.id, "examination_type", val)} /></td>
                            <td className="px-5 py-3 align-top"><EditableCell disabled={isDel} highlight={isBooked} value={app.notes} onSave={(val) => updateAppointment(app.id, "notes", val)} /></td>
                            <td className="px-5 py-3 align-top">
                              {isDel ? (
                                <div className="text-slate-500 text-xs pt-1"><span className="block font-semibold">Törölte: {app.deleted_by}</span>{formatDateTime(app.deleted_at)}</div>
                              ) : (
                                <div className="text-slate-400 text-xs pt-1 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">{app.last_modified_by ? <span className="font-semibold text-slate-600">{app.last_modified_by}</span> : <span>-</span>}{app.last_modified_at && <span>{formatDateTime(app.last_modified_at)}</span>}</div>
                              )}
                            </td>
                            <td className="px-5 py-3 align-top text-center">
                              {isDel ? (
                                <button onClick={() => restoreAppointment(app.id)} className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-300 transition-all mt-1 flex items-center justify-center gap-1.5 mx-auto"><RestoreIcon /> Visszaállít</button>
                              ) : (
                                <button onClick={() => deleteAppointment(app.id)} className="text-slate-300 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all mt-1 flex items-center justify-center mx-auto" title="Törlés"><TrashIcon /></button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* MOBIL NÉZET KÁRTYÁK */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:hidden bg-slate-50/50">
                    {dayAppointments.map((app: any) => {
                      const isDel = app.is_deleted === true;
                      const isBooked = app.patient_name && app.patient_name.trim() !== "";

                      return (
                        <div key={`mob-${app.id}`} className={`rounded-2xl p-5 border transition-all ${isDel ? "bg-slate-50 border-slate-200 opacity-80" : "bg-white border-slate-200 shadow-sm"}`}>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col gap-1">
                               <span className={`font-bold text-xl ${isDel ? "text-slate-400 line-through" : "text-slate-800"}`}>{app.time_slot}</span>
                               <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded text-center w-max ${isDel ? "bg-slate-200 text-slate-600" : isBooked ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                                 {isDel ? "Törölt" : isBooked ? "Foglalt" : "Szabad"}
                               </span>
                            </div>
                            {isDel ? (
                              <button onClick={() => restoreAppointment(app.id)} className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-300 flex items-center gap-1.5"><RestoreIcon /> Vissza</button>
                            ) : (
                              <button onClick={() => deleteAppointment(app.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg"><TrashIcon /></button>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-3">
                            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Páciens neve</span>
                              <EditableCell disabled={isDel} highlight={isBooked} value={app.patient_name} onSave={(val) => updateAppointment(app.id, "patient_name", val)} />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">TAJ szám</span>
                                <EditableCell disabled={isDel} highlight={isBooked} value={app.taj_szam} onSave={(val) => updateAppointment(app.id, "taj_szam", val)} />
                              </div>
                              <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Vizsgálat</span>
                                <EditableCell disabled={isDel} highlight={isBooked} value={app.examination_type} onSave={(val) => updateAppointment(app.id, "examination_type", val)} />
                              </div>
                            </div>
                            <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Megjegyzés</span>
                              <EditableCell disabled={isDel} highlight={isBooked} value={app.notes} onSave={(val) => updateAppointment(app.id, "notes", val)} />
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
                            {isDel ? (
                              <span>Törölte: <b className="text-slate-600">{app.deleted_by}</b> ({formatDateTime(app.deleted_at)})</span>
                            ) : app.last_modified_by ? (
                              <span>Módosította: <b className="text-slate-600">{app.last_modified_by}</b> ({formatDateTime(app.last_modified_at)})</span>
                            ) : null}
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

        {/* --- EGYEDI IDŐPONT HOZZÁADÁSA --- */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 w-full sm:w-max sm:ml-auto">
          <input type="text" placeholder="pl. 17:00 - 17:15" value={newTimeSlot} onChange={(e) => setNewTimeSlot(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSingleAppointment()} className="w-full sm:w-40 bg-slate-50 border border-slate-200 p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 text-sm font-semibold text-slate-900 transition-all text-center sm:text-left" />
          <button onClick={addSingleAppointment} className="w-full sm:w-auto bg-white text-slate-700 px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 hover:text-red-600 font-semibold shadow-sm transition-all active:scale-95 text-sm flex items-center justify-center gap-1.5"><PlusIcon /> Új időpont</button>
        </div>
      </div>
      
      <style dangerouslySetContent={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}