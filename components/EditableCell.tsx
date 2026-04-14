"use client";

import { useState, useId } from "react";

// HighlightText segédkomponens
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

interface EditableCellProps {
  value: string;
  onSave: (val: string) => void;
  disabled?: boolean;
  highlight?: boolean;
  formatter?: (v: string) => string;
  searchTerm?: string;
  suggestions?: string[]; // <--- Új paraméter az ajánlásokhoz
}

export function EditableCell({ value, onSave, disabled = false, highlight = false, formatter, searchTerm = "", suggestions }: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || "");
  
  // Egyedi azonosító generálása a datalist-hez, hogy minden mező külön listát kapjon
  const datalistId = useId();

  const handleBlur = () => { 
    setIsEditing(false); 
    const finalVal = formatter ? formatter(currentValue) : currentValue;
    if (finalVal !== value) onSave(finalVal); 
    setCurrentValue(finalVal);
  };

  if (disabled) return <div className="px-1 py-0.5 text-slate-400 font-medium line-through bg-slate-50/50 rounded-md break-words text-sm">{value || "-"}</div>;

  if (isEditing) {
    return (
      <div className="relative w-full">
        <input 
          autoFocus 
          value={currentValue} 
          onChange={(e) => setCurrentValue(e.target.value)} 
          onBlur={handleBlur} 
          onKeyDown={(e) => e.key === "Enter" && handleBlur()}
          list={suggestions && suggestions.length > 0 ? datalistId : undefined} // <--- Összekötés a listával
          className="w-full min-w-0 bg-white border border-red-400 px-1 py-0.5 rounded-md focus:outline-none focus:ring-4 focus:ring-red-100 text-slate-900 font-semibold text-sm shadow-sm transition-all"
        />
        {/* <--- Legördülő lista renderelése az árlista elemeiből ---> */}
        {suggestions && suggestions.length > 0 && (
          <datalist id={datalistId}>
            {suggestions.map((sug, idx) => (
              <option key={idx} value={sug} />
            ))}
          </datalist>
        )}
      </div>
    );
  }

  const displayValue = value || "";

  return (
    <div onClick={() => { setIsEditing(true); setCurrentValue(value || ""); }}
      className={`cursor-pointer min-h-[28px] px-1 py-0.5 rounded-md transition-all border border-transparent hover:bg-white/80 hover:border-slate-200 font-medium text-sm break-words overflow-hidden
        ${highlight ? "text-red-950 font-bold" : "text-emerald-950"}`}
      title="Kattints a szerkesztéshez"
    >
      {displayValue ? <HighlightText text={displayValue} highlight={searchTerm} /> : <span className="text-slate-400 italic text-xs font-normal opacity-70">Üres (kattints)</span>}
    </div>
  );
}