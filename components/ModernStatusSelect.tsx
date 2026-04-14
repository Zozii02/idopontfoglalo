"use client";

import { ChevronDownIcon } from "./icons";

export function ModernStatusSelect({ value, onChange, disabled }: { value: string, onChange: (val: string) => void, disabled: boolean }) {
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
    <div className="relative inline-block w-full max-w-[130px]">
      <select 
        value={value || "Előjegyzett"} 
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none w-full text-[9px] uppercase font-bold tracking-wider px-1.5 py-1 pr-4 rounded-md outline-none cursor-pointer border shadow-sm transition-all focus:ring-1 focus:ring-offset-1 ${currentStyle}`}
      >
        <option value="Előjegyzett">Előjegyzett</option>
        <option value="Megérkezett">Megérkezett</option>
        <option value="Vizsgálaton">Vizsgálaton</option>
        <option value="Befejezve">Befejezve</option>
        <option value="Nem jelent meg">Nem jelent meg</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1 text-current opacity-60">
        <ChevronDownIcon />
      </div>
    </div>
  );
}