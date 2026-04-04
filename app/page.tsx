"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";

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
  
  // Új: Profilnév megadása első belépéskor
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

  useEffect(() => { if (user && !needsProfileName) fetchAppointments(); }, [user, needsProfileName]);

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
    const { error } = await supabase.from("appointments").update({ [field]: newValue, last_modified_by: modifierName, last_modified_at: now }).eq("id", id);
    if (!error) setAppointments(appointments.map((app) => app.id === id ? { ...app, [field]: newValue, last_modified_by: modifierName, last_modified_at: now } : app));
  };

  const deleteAppointment = async (id: number) => {
    if (!confirm("Biztosan törlöd ezt az időpontot?")) return;
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    const { error } = await supabase.from("appointments").update({ is_deleted: true, deleted_by: modifierName, deleted_at: now }).eq("id", id);
    if (!error) setAppointments(appointments.map((app) => app.id === id ? { ...app, is_deleted: true, deleted_by: modifierName, deleted_at: now } : app));
  };

  const restoreAppointment = async (id: number) => {
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    const { error } = await supabase.from("appointments").update({ is_deleted: false, last_modified_by: modifierName, last_modified_at: now }).eq("id", id);
    if (!error) setAppointments(appointments.map((app) => app.id === id ? { ...app, is_deleted: false, last_modified_by: modifierName, last_modified_at: now } : app));
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
    const newAppointments = slotsToCreate.map(slot => ({
      department: activeTab, appointment_date: selectedDate, time_slot: slot,
      patient_name: "", taj_szam: "", examination_type: "", notes: "",
      last_modified_by: modifierName, last_modified_at: now, is_deleted: false
    }));

    const { data, error } = await supabase.from("appointments").insert(newAppointments).select();
    if (error) alert("Hiba generáláskor!");
    else if (data) setAppointments([...appointments, ...data]);
  };

  const addSingleAppointment = async () => {
    if (!user || !newTimeSlot.trim() || !selectedDate) return alert("Kérlek, adj meg dátumot és időpontot is!");
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    const { data, error } = await supabase.from("appointments").insert([{
      department: activeTab, appointment_date: selectedDate, time_slot: newTimeSlot,
      patient_name: "", taj_szam: "", examination_type: "", notes: "",
      last_modified_by: modifierName, last_modified_at: now, is_deleted: false
    }]).select();
    if (!error && data) { setAppointments([...appointments, data[0]]); setNewTimeSlot(""); }
  };

  // --- Bejelentkezési képernyő (Regisztráció nélkül!) ---
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-200">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-300">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 text-blue-700 p-4 rounded-full text-4xl border border-blue-200">⚕️</div>
          </div>
          <h2 className="text-3xl font-extrabold mb-2 text-center text-slate-900 tracking-tight">MedAssist Portal</h2>
          <p className="text-center text-slate-600 mb-8 font-bold">Kizárólag belső munkatársak részére</p>
          
          <div className="space-y-5">
            <input type="email" placeholder="Email cím" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full p-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 font-semibold placeholder:text-slate-400" />
            <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full p-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 font-semibold placeholder:text-slate-400" />
            <button onClick={handleLogin} className="w-full bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md hover:bg-blue-800 transition-all active:scale-95">Belépés a rendszerbe</button>
          </div>
          <div className="mt-6 border-t border-slate-200 pt-6 text-center">
            <p className="text-xs text-slate-400 font-medium">Ha nincs hozzáférésed, kérjük vedd fel a kapcsolatot a rendszergazdával.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Első belépés: Profilnév megadása ---
  if (needsProfileName) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-200">
        <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md border border-slate-300 text-center">
          <div className="text-5xl mb-4">👋</div>
          <h2 className="text-2xl font-extrabold mb-2 text-slate-900">Üdvözlünk a rendszerben!</h2>
          <p className="text-slate-600 mb-8 font-medium">Mivel most lépsz be először, kérjük add meg a nevedet, ahogy a rendszerben meg szeretnél jelenni (pl. Dr. Kovács).</p>
          
          <input type="text" placeholder="Teljes neved..." value={profileNameInput} onChange={(e) => setProfileNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSaveProfileName()} className="w-full p-3 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all bg-white text-slate-900 font-semibold placeholder:text-slate-400 mb-5 text-center" />
          <button onClick={handleSaveProfileName} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-emerald-700 transition-all active:scale-95">Név mentése és Tovább</button>
        </div>
      </div>
    );
  }

  let filteredAppointments = appointments.filter((app) => app.department === activeTab);
  if (!showDeleted) filteredAppointments = filteredAppointments.filter(app => app.is_deleted !== true);
  
  const groupedByDate = filteredAppointments.reduce((acc, app) => {
    const d = app.appointment_date || "Dátum nélkül";
    if (!acc[d]) acc[d] = [];
    acc[d].push(app);
    return acc;
  }, {} as Record<string, any[]>);
  const sortedDates = Object.keys(groupedByDate).sort();

  return (
    <div className="min-h-screen bg-slate-100 pb-16 font-sans">
      <div className="bg-gradient-to-r from-blue-900 to-slate-900 shadow-lg text-white px-8 py-6 mb-10 flex justify-between items-center rounded-b-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-2xl text-2xl border border-white/20">🏥</div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">MedAssist Előjegyzés</h1>
            <p className="text-blue-200 font-bold text-sm mt-1">Professzionális Betegirányítási Rendszer</p>
          </div>
        </div>
        <div className="flex items-center gap-6 bg-slate-800 py-2 px-5 rounded-full border border-slate-700 shadow-inner">
          <div className="flex items-center gap-2"><span className="text-2xl opacity-90">👨‍⚕️</span><span className="font-extrabold text-white">{getDisplayName()}</span></div>
          <div className="w-px h-6 bg-slate-600"></div>
          <button onClick={handleLogout} className="text-blue-300 hover:text-white font-extrabold text-sm uppercase tracking-wider transition-colors">Kijelentkezés</button>
        </div>
      </div>

      <div className="px-8 w-full mx-auto max-w-[1600px]">
        <div className="bg-white rounded-2xl shadow border border-slate-300 p-8 mb-10 flex flex-col xl:flex-row gap-10 items-start xl:items-center justify-between">
          <div className="flex-1 w-full xl:w-auto">
            <CustomSelect label="Szakrendelés kiválasztása" options={CATEGORIES} value={activeTab} onChange={setActiveTab} />
            <label className="mt-6 flex items-center space-x-4 cursor-pointer group select-none w-max">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} />
                <div className={`block w-14 h-8 rounded-full transition-colors duration-300 border border-slate-300 ${showDeleted ? "bg-rose-500 border-rose-600" : "bg-slate-300 group-hover:bg-slate-400"}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-md flex items-center justify-center ${showDeleted ? "translate-x-6" : "translate-x-0"}`}>{showDeleted && <span className="text-[10px]">🗑️</span>}</div>
              </div>
              <div className="flex flex-col"><span className={`font-extrabold transition-colors duration-300 ${showDeleted ? "text-rose-700" : "text-slate-800 group-hover:text-black"}`}>Törölt időpontok</span><span className="text-xs text-slate-500 font-bold">Láthatóvá teszi a törölt sorokat</span></div>
            </label>
          </div>

          <div className="w-px h-32 bg-slate-200 hidden xl:block"></div>

          <div className="flex-[2] w-full bg-slate-50 p-6 rounded-2xl border border-slate-300 shadow-inner">
            <h3 className="font-extrabold text-blue-900 mb-5 flex items-center gap-2 text-lg"><span>⚙️</span> Napi Előjegyzés Generátor</h3>
            <div className="flex flex-wrap items-end gap-5">
              <div><label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Dátum</label><input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border-2 border-slate-300 p-2.5 rounded-xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none font-bold transition-all text-slate-900" /></div>
              <div><label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Kezdés</label><input type="time" value={genStart} onChange={(e) => setGenStart(e.target.value)} className="border-2 border-slate-300 p-2.5 rounded-xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-900" /></div>
              <div><label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Vége</label><input type="time" value={genEnd} onChange={(e) => setGenEnd(e.target.value)} className="border-2 border-slate-300 p-2.5 rounded-xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold text-slate-900" /></div>
              <div><label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">Hossz (perc)</label><input type="number" value={genDuration} onChange={(e) => setGenDuration(e.target.value)} className="border-2 border-slate-300 p-2.5 rounded-xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all w-24 font-bold text-slate-900" /></div>
              <div className="w-px h-12 bg-slate-300 mx-2 hidden sm:block"></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Szünet kezd</label><input type="time" value={genBreakStart} onChange={(e) => setGenBreakStart(e.target.value)} className="border-2 border-slate-300 p-2.5 rounded-xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-semibold text-slate-600 bg-white" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Szünet vége</label><input type="time" value={genBreakEnd} onChange={(e) => setGenBreakEnd(e.target.value)} className="border-2 border-slate-300 p-2.5 rounded-xl text-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-semibold text-slate-600 bg-white" /></div>
              <button onClick={generateDailySlots} className="bg-blue-700 text-white px-8 py-2.5 rounded-xl hover:bg-blue-800 font-extrabold shadow transition-all ml-auto active:scale-95 border-2 border-blue-800">Generálás</button>
            </div>
          </div>
        </div>

        {sortedDates.length === 0 ? (
          <div className="bg-white p-16 text-center rounded-2xl shadow border border-slate-300 flex flex-col items-center">
            <div className="text-7xl mb-6 opacity-80">📅</div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-3">Még nincsenek időpontok</h3>
            <p className="text-slate-600 text-lg font-medium">Válassz ki egy kategóriát és egy dátumot fent, majd generáld le a napi előjegyzést!</p>
          </div>
        ) : (
          sortedDates.map((date) => {
            const dayAppointments = groupedByDate[date].sort((a, b) => a.time_slot.localeCompare(b.time_slot));
            const activeSlots = dayAppointments.filter(a => !a.is_deleted);
            const bookedCount = activeSlots.filter(a => a.patient_name && a.patient_name.trim() !== "").length;
            const freeCount = activeSlots.length - bookedCount;

            return (
              <div key={date} className="mb-10 bg-white rounded-2xl shadow-md border border-slate-300 overflow-hidden">
                <div className="bg-blue-100 border-b border-slate-300 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3"><div className="bg-blue-700 text-white p-2 rounded-lg shadow-sm">📅</div><h2 className="text-xl font-extrabold text-blue-900">{date}</h2></div>
                  <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-blue-200 shadow-sm">
                    <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-lg text-sm font-extrabold">Összes: {activeSlots.length}</span>
                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-sm font-extrabold">Szabad: {freeCount}</span>
                    <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-extrabold">Foglalt: {bookedCount}</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left border-collapse">
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
                      {dayAppointments.map((app) => {
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
                                <button onClick={() => restoreAppointment(app.id)} className="bg-amber-500 text-slate-900 px-4 py-2 rounded-xl text-xs font-extrabold hover:bg-amber-600 border border-amber-600 shadow-sm transition-all active:scale-95 uppercase tracking-wide">♻️ Visszaállít</button>
                              ) : (
                                <button onClick={() => deleteAppointment(app.id)} className="text-slate-500 hover:text-white bg-slate-100 hover:bg-rose-600 p-2.5 rounded-xl border border-slate-300 transition-all text-xl shadow-sm" title="Időpont törlése">🗑️</button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}

        <div className="mt-8 flex items-center justify-end space-x-4 bg-white p-5 rounded-2xl shadow border border-slate-300 w-max ml-auto mb-10">
          <span className="font-extrabold text-slate-700 text-xs uppercase tracking-widest">Egyedi időpont (Plusz)</span>
          <div className="w-px h-8 bg-slate-300 mx-2"></div>
          <input type="text" placeholder="pl. 17:00 - 17:15" value={newTimeSlot} onChange={(e) => setNewTimeSlot(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSingleAppointment()} className="border-2 border-slate-300 p-2.5 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 w-44 text-sm font-extrabold text-slate-900 transition-all" />
          <button onClick={addSingleAppointment} className="bg-slate-800 text-white px-6 py-2.5 rounded-xl hover:bg-slate-900 font-extrabold shadow-md transition-all active:scale-95 text-sm uppercase tracking-wider border-2 border-slate-900">+ Hozzáadás</button>
        </div>
      </div>
    </div>
  );
}