"use client";

import { useState, useRef, useEffect } from "react";

// Keresett szó kiemelése
const HighlightText = ({ text, highlight }: { text: string, highlight: string }) => {
  if (!highlight.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? 
          <mark key={i} className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5 py-0 font-bold">{part}</mark> : part
      )}
    </>
  );
};

export function PatientAutocomplete({ 
  value, 
  onSave, 
  onSelectPatient,
  searchPatients,
  disabled = false, 
  highlight = false, 
  searchTerm = "" 
}: { 
  value: string; 
  onSave: (val: string) => void; 
  onSelectPatient: (patient: any) => void;
  searchPatients: (term: string) => Promise<any[]>;
  disabled?: boolean; 
  highlight?: boolean; 
  searchTerm?: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || "");
  const [results, setResults] = useState<any[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isSelecting = useRef(false); 

  // Bezárás, ha mellékattintanak
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        if (!isSelecting.current) {
          handleBlur();
        }
      }
    };
    if (isEditing) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEditing, currentValue]);

  // Gépelés figyelése és keresés az adatbázisban
  useEffect(() => {
    if (!isEditing || currentValue.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      const data = await searchPatients(currentValue);
      // JAVÍTÁS: Most már MINDIG megjelenítjük a találatokat, 
      // ha van a beírt betűknek megfelelő beteg az adatbázisban!
      setResults(data || []);
    }, 300); 
    return () => clearTimeout(timer);
  }, [currentValue, isEditing]);

  const handleBlur = () => {
    if (isSelecting.current) return; 
    
    setIsEditing(false); 
    setResults([]);
    
    const finalVal = currentValue.trim();
    const formattedVal = finalVal ? finalVal.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ') : "";
    
    if (formattedVal !== value) {
      onSave(formattedVal); 
    }
    setCurrentValue(formattedVal);
  };

  const handleSelect = (patient: any) => {
    isSelecting.current = true;
    setCurrentValue(patient.name);
    setIsEditing(false);
    setResults([]);
    
    onSelectPatient(patient);
    
    setTimeout(() => { isSelecting.current = false; }, 200);
  };

  if (disabled) return <div className="p-2 text-slate-400 font-medium line-through bg-slate-50/50 rounded-lg break-words">{value || "-"}</div>;

  if (isEditing) {
    return (
      <div className="relative w-full" ref={wrapperRef}>
        <input 
          autoFocus 
          value={currentValue} 
          onChange={(e) => setCurrentValue(e.target.value)} 
          onBlur={handleBlur} 
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleBlur();
            }
          }}
          placeholder="Név keresése..."
          className="w-full min-w-0 bg-white border border-emerald-400 p-2 rounded-lg focus:outline-none focus:ring-4 focus:ring-emerald-100 text-slate-900 font-semibold shadow-sm transition-all"
        />
        {/* Lenyíló találati lista */}
        {results.length > 0 && (
          <ul className="absolute z-50 top-full left-0 w-[280px] mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto custom-scrollbar">
            <li className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-100 sticky top-0">Ismert betegek (Kattints rá)</li>
            {results.map(p => (
              <li 
                key={p.id} 
                onMouseDown={(e) => {
                  e.preventDefault(); 
                  handleSelect(p);
                }}
                className="px-3 py-2 border-b border-slate-50 hover:bg-emerald-50 cursor-pointer transition-colors"
              >
                <div className="font-bold text-slate-800 text-sm">{p.name}</div>
                <div className="flex gap-2 mt-0.5">
                  {p.taj_szam && <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono border border-slate-200">{p.taj_szam}</span>}
                  {p.phone_number && <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">{p.phone_number}</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div onClick={() => { setIsEditing(true); setCurrentValue(value || ""); }}
      className={`cursor-pointer min-h-[38px] p-2 rounded-lg transition-all border border-transparent hover:bg-white/80 hover:border-slate-200 font-medium break-words
        ${highlight ? "text-red-950 font-bold" : "text-emerald-950"}`}
      title="Kattints a kereséshez vagy szerkesztéshez"
    >
      {value ? <HighlightText text={value} highlight={searchTerm} /> : <span className="text-slate-400 italic text-sm font-normal opacity-70">Üres (kattints)</span>}
    </div>
  );
}