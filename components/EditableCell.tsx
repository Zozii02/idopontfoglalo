"use client";

import { useState } from "react";

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

export function EditableCell({ value, onSave, disabled = false, highlight = false, formatter, searchTerm = "" }: { value: string; onSave: (val: string) => void; disabled?: boolean; highlight?: boolean; formatter?: (v: string) => string; searchTerm?: string }) {
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

  const displayValue = value || "";

  return (
    <div onClick={() => { setIsEditing(true); setCurrentValue(value || ""); }}
      className={`cursor-pointer min-h-[38px] p-2 rounded-lg transition-all border border-transparent hover:bg-white/80 hover:border-slate-200 font-medium break-words
        ${highlight ? "text-red-950 font-bold" : "text-emerald-950"}`}
      title="Kattints a szerkesztéshez"
    >
      {displayValue ? <HighlightText text={displayValue} highlight={searchTerm} /> : <span className="text-slate-400 italic text-sm font-normal opacity-70">Üres (kattints)</span>}
    </div>
  );
}