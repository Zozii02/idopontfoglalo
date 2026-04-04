"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";

// --- Professzionális Ikonok (Emojik helyett) ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>;
const CalendarIcon = ({ size = 24 }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const TrashIcon = ({ size = 18 }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const RestoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>;

// --- Egyedi, Animált Legördülő Menü ---
function CustomSelect({ options, value, onChange, label }: { options: string[], value: string, onChange: (val: string) => void, label: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full xl:w-80" ref={dropdownRef}>
      <label className="block text-slate-700 font-extrabold text-xs uppercase tracking-widest mb-2">{label}</label>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex justify-between items-center w-full border-2 p-3 rounded-xl bg-white font-bold text-lg cursor-pointer transition-all duration-300 select-none
          ${isOpen ? "border-blue-500 ring-4 ring-blue-50 text-blue-900 shadow-sm" : "border-slate-300 text-slate-800 hover:border-blue-400 hover:bg-blue-50/30"}`}
      >
        <span className="truncate">{value}</span>
        <span className={`transform transition-transform duration-300 text-slate-600 ${isOpen ? "rotate-180 text-blue-600" : ""}`}>▼</span>
      </div>
      <div className={`absolute z-50 mt-2 w-full bg-white border border-slate-300 rounded-xl shadow-xl transition-all duration-200 origin-top 
        ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-4 pointer-events-none"}`}
      >
        <div className="max-h-72 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {options.map((cat) => (
            <div key={cat} onClick={() => { onChange(cat); setIsOpen(false); }}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 font-bold select-none
                ${value === cat ? "bg-blue-100 text-blue-900 pl-4 border-l-4 border-blue-600" : "text-slate-700 hover:bg-slate-100 hover:pl-4 hover:text-slate-900 border-l-4 border-transparent"}`}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Az "Okos Cella" ---
function EditableCell({ value, onSave, disabled = false, highlight = false }: { value: string; onSave: (val: string) => void; disabled?: boolean; highlight?: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || "");

  const handleBlur = () => { setIsEditing(false); if (currentValue !== value) onSave(currentValue); };

  if (disabled) return <div className="p-2 text-slate-500 font-medium line-through bg-slate-100 rounded">{value || "-"}</div>;

  if (isEditing) {
    return (
      <input autoFocus value={currentValue} onChange={(e) => setCurrentValue(e.target.value)} onBlur={handleBlur} onKeyDown={(e) => e.key === "Enter" && handleBlur()}
        className="border-2 border-blue-500 p-2 w-full rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-100 text-slate-900 font-semibold shadow-sm transition-all"
      />
    );
  }

  return (
    <div onClick={() => setIsEditing(true)}
      className={`cursor-pointer min-h-[36px] p-2 rounded-lg transition-colors border border-transparent hover:border-blue-200 font-medium
        ${highlight ? "text-slate-900 font-extrabold" : "text-slate-800 hover:bg-blue-50"}`}
      title="Kattints a szerkesztéshez"
    >
      {value || <span className="text-slate-400 italic text-sm font-normal">Üres (kattints)</span>}
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
    if (loggedUser && !loggedUser.user_metadata?.display_name) {
      setNeedsProfileName(true);
    } else {
      setNeedsProfileName(false);
    }
  };

  useEffect(() => { 
    if (user && !needsProfileName) {
      fetchAppointments();
      const channel = supabase
        .channel('live-appointments')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
            fetchAppointments();
        })
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
    else {
      setUser(data.user);
      setNeedsProfileName(false);
    }
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-200 px-4">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-300">
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="Medical-Aqua Logo" className="h-28 object-contain" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2 text-center text-slate-900 tracking-tight">Medical-Aqua Portál</h2>
          <p className="text-center text-slate-600 mb-8 font-bold">Hogy az időpontok ne tűnjenek el</p>
          <div className="space-y-5">
            <input type="email" placeholder="Email cím" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full p-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 font-semibold placeholder:text-slate-400" />
            <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full p-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 font-semibold placeholder:text-slate-400" />
            <button onClick={handleLogin} className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md hover:bg-blue-800 transition-all active:scale-95">Belépés a rendszerbe</button>
          </div>
        </div>
      </div>
    );
  }

  if (needsProfileName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-200 px-4">
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-300 text-center">
          <div className="flex justify-center text-blue-600 mb-6"><UserIcon /></div>
          <h2 className="text-2xl font-extrabold mb-2 text-slate-900">Üdvözlünk a rendszerben!</h2>
          <p className="text-slate-600 mb-8 font-medium">Mivel most lépsz be először, kérjük add meg a nevedet, ahogy a rendszerben meg szeretnél jelenni (pl. Dr. Kovács).</p>
          <input type="text" placeholder="Teljes neved..." value={profileNameInput} onChange={(e) => setProfileNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSaveProfileName()} className="w-full p-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 font-semibold placeholder:text-slate-400 mb-5 text-center" />
          <button onClick={handleSaveProfileName} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition-all active:scale-95">Név mentése és Tovább</button>
        </div>
      </div>
    );
  }

  let filteredAppointments = appointments.filter((app: any) => app.department === activeTab);
  if (!showDeleted) filteredAppointments = filteredAppointments.filter((app: any) => app.is_deleted !== true);
  
  const groupedByDate = filteredAppointments.reduce((acc: any, app: any) => {
    const d = app.appointment_date || "Dátum nélkül";
    if (!acc[d]) acc[d] = [];
    acc[d].push(app);
    return acc;
  }, {});
  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <div className="min-h-screen bg-slate-100 pb-16 font-sans">
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 shadow-lg text-white px-4 md:px-8 py-6 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center rounded-b-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-white p-2 rounded-xl border border-white/20 hidden sm:block shadow-md">
             <img src="/logo.png" alt="Medical-Aqua Logo" className="h-12 object-contain" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">Medical-Aqua előjegyzés</h1>
            <p className="text-blue-200 font-bold text-sm mt-1">Professzionális Betegirányítási Rendszer kezdőknek és haladóknak </p>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6 bg-slate-800 py-2 px-5 rounded-full border border-slate-700 shadow-inner w-full md:w-auto justify-center">
          <div className="flex items-center gap-2 text-blue-200"><UserIcon /><span className="font-extrabold text-white text-sm md:text-base">{getDisplayName()}</span></div>
          <div className="w-px h-6 bg-slate-600"></div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-blue-300 hover:text-white font-extrabold text-xs md:text-sm uppercase tracking-wider transition-colors"><LogoutIcon /> <span>Kijelentkezés</span></button>
        </div>
      </div>

      <div className="px-4 md:px-8 w-full mx-auto max-w-[1600px]">
        <div className="bg-white rounded-2xl shadow border border-slate-300 p-6 md:p-8 mb-10 flex flex-col xl:flex-row gap-8 md:gap-10 items-start xl:items-center justify-between">
          <div className="flex-1 w-full xl:w-auto">
            <CustomSelect label="Szakrendelés kiválasztása" options={CATEGORIES} value={activeTab} onChange={setActiveTab} />
            <label className="mt-6 flex items-center space-x-4 cursor-pointer group select-none w-max">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} />
                <div className={`block w-14 h-8 rounded-full transition-colors duration-300 border border-slate-300 ${showDeleted ? "bg-rose-500 border-rose-600" : "bg-slate-300 group-hover:bg-slate-400"}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-md flex items-center justify-center text-rose-500 ${showDeleted ? "translate-x-6" : "translate-x-0"}`}>{showDeleted && <TrashIcon size={12} />}</div>
              </div>
              <div className="flex flex-col"><span className={`font-extrabold transition-colors duration-300 ${showDeleted ? "text-rose-700" : "text-slate-800 group-hover:text-black"}`}>Törölt időpontok</span><span className="text-xs text-slate-500 font-bold hidden sm:block">Láthatóvá teszi a törölt sorokat</span></div>
            </label>
          </div>

          <div className="w-px h-32 bg-slate-200 hidden xl:block"></div>

          <div className="flex-[2] w-full bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-300 shadow-inner">
            <h3 className="font-extrabold text-blue-900 mb-5 flex items-center gap-2 text-base md:text-lg"><SettingsIcon /> Napi Előjegyzés Generátor</h3>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-end gap-4 md:gap-5">
              <div className="col-span-2 sm:col-span-1"><label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Dátum</label><input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full border-2 border-slate-300 p-2.5 rounded-xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-bold transition-all text-slate-900" /></div>
              <div><label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Kezdés</label><input type="time" value={genStart} onChange={(e) => setGenStart(e.target.value)} className="w-full border-2 border-slate-300 p-2.5 rounded-xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-900" /></div>
              <div><label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Vége</label><input type="time" value={genEnd} onChange={(e) => setGenEnd(e.target.value)} className="w-full border-2 border-slate-300 p-2.5 rounded-xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-900" /></div>
              <div><label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Hossz (p)</label><input type="number" value={genDuration} onChange={(e) => setGenDuration(e.target.value)} className="w-full border-2 border-slate-300 p-2.5 rounded-xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all sm:w-24 font-bold text-slate-900" /></div>
              <div className="w-px h-12 bg-slate-300 mx-2 hidden lg:block"></div>
              <div><label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Szünet kezd</label><input type="time" value={genBreakStart} onChange={(e) => setGenBreakStart(e.target.value)} className="w-full border-2 border-slate-300 p-2.5 rounded-xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-semibold text-slate-600 bg-white" /></div>
              <div><label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Szünet vége</label><input type="time" value={genBreakEnd} onChange={(e) => setGenBreakEnd(e.target.value)} className="w-full border-2 border-slate-300 p-2.5 rounded-xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-semibold text-slate-600 bg-white" /></div>
              <button onClick={generateDailySlots} className="col-span-2 sm:col-span-1 w-full sm:w-auto bg-blue-700 text-white px-8 py-2.5 rounded-xl hover:bg-blue-800 font-extrabold shadow transition-all sm:ml-auto active:scale-95 border-2 border-blue-800 mt-2 sm:mt-0">Generálás</button>
            </div>
          </div>
        </div>

        {sortedDates.length === 0 ? (
          <div className="bg-white p-10 md:p-16 text-center rounded-2xl shadow border border-slate-300 flex flex-col items-center">
            <div className="text-slate-300 mb-6"><CalendarIcon size={80} /></div>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-800 mb-3">Még nincsenek időpontok</h3>
            <p className="text-slate-600 text-base md:text-lg font-medium">Válassz ki egy kategóriát és egy dátumot fent, majd generáld le a napi előjegyzést!</p>
          </div>
        ) : (
          sortedDates.map((date) => {
            const dayAppointments = groupedByDate[date].sort((a: any, b: any) => a.time_slot.localeCompare(b.time_slot));
            const activeSlots = dayAppointments.filter((a: any) => !a.is_deleted);
            const bookedCount = activeSlots.filter((a: any) => a.patient_name && a.patient_name.trim() !== "").length;
            const freeCount = activeSlots.length - bookedCount;

            return (
              <div key={date} className="mb-10 bg-white rounded-2xl shadow-md border border-slate-300 overflow-hidden">
                <div className="bg-blue-100 border-b border-slate-300 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3"><div className="bg-blue-700 text-white p-2 rounded-lg shadow-sm"><CalendarIcon size={20} /></div><h2 className="text-lg md:text-xl font-extrabold text-blue-900">{date}</h2></div>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 bg-white p-1.5 rounded-xl border border-blue-200 shadow-sm w-max">
                    <span className="bg-blue-50 text-blue-800 px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-extrabold">Összes: {activeSlots.length}</span>
                    <span className="bg-emerald-50 text-emerald-700 px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-extrabold">Szabad: {freeCount}</span>
                    <span className="bg-blue-600 text-white px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm font-extrabold">Foglalt: {bookedCount}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-collapse hidden lg:table">
                    <thead>
                      <tr className="bg-slate-100 border-b-2 border-slate-300">
                        <th className="p-4 font-extrabold text-slate-700 text-[12px] uppercase tracking-widest">Időpont</th>
                        <th className="p-4 font-extrabold text-slate-700 text-[12px] uppercase tracking-widest w-1/5">Páciens neve</th>
                        <th className="p-4 font-extrabold text-slate-700 text-[12px] uppercase tracking-widest">TAJ szám</th>
                        <th className="p-4 font-extrabold text-slate-700 text-[12px] uppercase tracking-widest">Vizsgálat típusa</th>
                        <th className="p-4 font-extrabold text-slate-700 text-[12px] uppercase tracking-widest w-1/4">Megjegyzés</th>
                        <th className="p-4 font-extrabold text-slate-700 text-[12px] uppercase tracking-widest">Rendszer adat</th>
                        <th className="p-4 font-extrabold text-slate-700 text-[12px] uppercase tracking-widest text-center">Művelet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {dayAppointments.map((app: any) => {
                        const isDel = app.is_deleted === true;
                        const isBooked = app.patient_name && app.patient_name.trim() !== "";
                        let rowStyle = isDel ? "bg-rose-50 border-l-4 border-l-rose-400" : isBooked ? "bg-blue-50/40 hover:bg-blue-100/50 border-l-4 border-l-blue-500" : "bg-white hover:bg-slate-50 border-l-4 border-l-emerald-400";

                        return (
                          <tr key={app.id} className={`transition-colors group ${rowStyle}`}>
                            <td className={`p-4 font-extrabold whitespace-nowrap ${isDel ? "text-slate-500 line-through" : "text-slate-900"}`}>
                              <div className="flex flex-col gap-1.5 w-max">
                                <span className={`px-3 py-1.5 rounded-lg border text-sm shadow-sm ${isDel ? "bg-slate-100 border-slate-300" : "bg-white border-slate-300"}`}>{app.time_slot}</span>
                                {!isDel && <span className={`text-[10px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded text-center ${isBooked ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-emerald-100 text-emerald-700 border border-emerald-200"}`}>{isBooked ? "Foglalt" : "Szabad"}</span>}
                                {isDel && <span className="text-[10px] uppercase tracking-widest font-extrabold px-2 py-0.5 rounded text-center bg-rose-200 text-rose-800 border border-rose-300">Törölt</span>}
                              </div>
                            </td>
                            <td className="p-4"><EditableCell disabled={isDel} highlight={isBooked} value={app.patient_name} onSave={(newVal) => updateAppointment(app.id, "patient_name", newVal)} /></td>
                            <td className="p-4"><EditableCell disabled={isDel} highlight={isBooked} value={app.taj_szam} onSave={(newVal) => updateAppointment(app.id, "taj_szam", newVal)} /></td>
                            <td className="p-4"><EditableCell disabled={isDel} highlight={isBooked} value={app.examination_type} onSave={(newVal) => updateAppointment(app.id, "examination_type", newVal)} /></td>
                            <td className="p-4"><EditableCell disabled={isDel} highlight={isBooked} value={app.notes} onSave={(newVal) => updateAppointment(app.id, "notes", newVal)} /></td>
                            <td className="p-4">
                              {isDel ? (
                                <div className="text-rose-800 text-xs bg-rose-100 p-2.5 rounded-lg border border-rose-300"><b className="block mb-1">Törölte: {app.deleted_by}</b><span className="font-bold">{formatDateTime(app.deleted_at)}</span></div>
                              ) : (
                                <div className="flex flex-col text-xs p-2.5 opacity-80 group-hover:opacity-100 transition-opacity">{app.last_modified_by ? <span className="text-slate-800 font-extrabold">{app.last_modified_by}</span> : <span className="text-slate-500 font-bold">-</span>}{app.last_modified_at && <span className="text-slate-600 mt-1 font-bold">{formatDateTime(app.last_modified_at)}</span>}</div>
                              )}
                            </td>
                            <td className="p-4 text-center align-middle">
                              {isDel ? (
                                <button onClick={() => restoreAppointment(app.id)} className="bg-amber-500 flex items-center justify-center gap-1 mx-auto text-slate-900 px-4 py-2 rounded-xl text-xs font-extrabold hover:bg-amber-600 border border-amber-600 shadow-sm transition-all active:scale-95 uppercase tracking-wide"><RestoreIcon /> Visszaállít</button>
                              ) : (
                                <button onClick={() => deleteAppointment(app.id)} className="text-slate-500 hover:text-white bg-slate-100 hover:bg-rose-600 p-2.5 rounded-xl border border-slate-300 transition-all shadow-sm mx-auto flex items-center justify-center" title="Időpont törlése"><TrashIcon size={20} /></button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:hidden bg-slate-50/50">
                    {dayAppointments.map((app: any) => {
                      const isDel = app.is_deleted === true;
                      const isBooked = app.patient_name && app.patient_name.trim() !== "";
                      let cardStyle = isDel ? "bg-rose-50 border-l-4 border-l-rose-400 opacity-80" : isBooked ? "bg-white border-l-4 border-l-blue-500 shadow-md ring-1 ring-blue-100" : "bg-white border-l-4 border-l-emerald-400 shadow-sm";

                      return (
                        <div key={`mob-${app.id}`} className={`rounded-xl p-4 flex flex-col gap-3 relative transition-all ${cardStyle}`}>
                          <div className="flex justify-between items-start border-b border-slate-200/60 pb-3">
                            <div className="flex flex-col gap-1.5">
                               <span className={`font-extrabold text-xl ${isDel ? "text-slate-500 line-through" : "text-slate-900"}`}>{app.time_slot}</span>
                               <div className="flex gap-2">
                                 {!isDel && <span className={`text-[10px] uppercase tracking-widest font-extrabold w-max px-2 py-0.5 rounded text-center ${isBooked ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-emerald-100 text-emerald-700 border border-emerald-200"}`}>{isBooked ? "Foglalt" : "Szabad"}</span>}
                                 {isDel && <span className="text-[10px] uppercase tracking-widest font-extrabold w-max px-2 py-0.5 rounded text-center bg-rose-200 text-rose-800 border border-rose-300">Törölt</span>}
                               </div>
                            </div>
                            <div>
                              {isDel ? (
                                <button onClick={() => restoreAppointment(app.id)} className="bg-amber-500 flex items-center gap-1 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-extrabold hover:bg-amber-600 shadow-sm transition-all uppercase"><RestoreIcon /> Vissza</button>
                              ) : (
                                <button onClick={() => deleteAppointment(app.id)} className="bg-slate-100 text-slate-600 hover:bg-rose-600 hover:text-white p-2 rounded-lg border border-slate-200 transition-all shadow-sm"><TrashIcon size={16} /></button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2.5">
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Páciens neve</span>
                              <EditableCell disabled={isDel} highlight={isBooked} value={app.patient_name} onSave={(newVal) => updateAppointment(app.id, "patient_name", newVal)} />
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">TAJ szám</span>
                                <EditableCell disabled={isDel} highlight={isBooked} value={app.taj_szam} onSave={(newVal) => updateAppointment(app.id, "taj_szam", newVal)} />
                              </div>
                              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Vizsgálat típusa</span>
                                <EditableCell disabled={isDel} highlight={isBooked} value={app.examination_type} onSave={(newVal) => updateAppointment(app.id, "examination_type", newVal)} />
                              </div>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/60">
                              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">Megjegyzés</span>
                              <EditableCell disabled={isDel} highlight={isBooked} value={app.notes} onSave={(newVal) => updateAppointment(app.id, "notes", newVal)} />
                            </div>
                          </div>
                          
                          <div className="pt-2 border-t border-slate-200/60 mt-1">
                            {isDel ? (
                              <div className="text-rose-800 text-[10px]"><span className="font-bold">Törölte: {app.deleted_by}</span> ({formatDateTime(app.deleted_at)})</div>
                            ) : (
                              <div className="text-slate-500 text-[10px] flex flex-col">{app.last_modified_by ? <span>Módosította: <b className="text-slate-700">{app.last_modified_by}</b></span> : <span>- Nincs módosítás -</span>} {app.last_modified_at && <span className="text-slate-400">{formatDateTime(app.last_modified_at)}</span>}</div>
                            )}
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

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow border border-slate-300 w-full sm:w-max sm:ml-auto mb-10">
          <span className="font-extrabold text-slate-700 text-xs uppercase tracking-widest hidden sm:block">Egyedi időpont (Plusz)</span>
          <div className="w-px h-8 bg-slate-300 mx-2 hidden sm:block"></div>
          <input type="text" placeholder="pl. 17:00 - 17:15" value={newTimeSlot} onChange={(e) => setNewTimeSlot(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSingleAppointment()} className="w-full sm:w-44 border-2 border-slate-300 p-2.5 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 text-sm font-extrabold text-slate-900 transition-all text-center sm:text-left" />
          <button onClick={addSingleAppointment} className="w-full sm:w-auto bg-slate-800 text-white px-6 py-2.5 rounded-xl hover:bg-slate-900 font-extrabold shadow-md transition-all active:scale-95 text-sm uppercase tracking-wider border-2 border-slate-900">+ Hozzáadás</button>
        </div>
      </div>
    </div>
  );
}