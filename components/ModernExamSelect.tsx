"use client";

import { ChevronDownIcon } from "./icons";

export function ModernExamSelect({
  value,
  onChange,
  options,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  disabled?: boolean;
}) {
  if (disabled) return <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">-</span>;

  const getColor = (exam: string) => {
    if (!exam) return "bg-slate-100 text-slate-500 border-slate-200 focus:ring-slate-200";
    const lower = exam.toLowerCase();
    if (lower.includes("ultrahang") || lower.includes("uh")) return "bg-blue-100 text-blue-800 border-blue-200 focus:ring-blue-200";
    if (lower.includes("kontroll")) return "bg-emerald-100 text-emerald-800 border-emerald-200 focus:ring-emerald-200";
    if (lower.includes("vérvétel") || lower.includes("labor")) return "bg-red-100 text-red-800 border-red-200 focus:ring-red-200";
    if (lower.includes("konzultáció") || lower.includes("vizsgálat")) return "bg-purple-100 text-purple-800 border-purple-200 focus:ring-purple-200";
    if (lower.includes("röntgen") || lower.includes("rtg")) return "bg-amber-100 text-amber-800 border-amber-200 focus:ring-amber-200";
    return "bg-slate-100 text-slate-700 border-slate-200 focus:ring-slate-200";
  };

  const currentStyle = getColor(value);

  return (
    <div className="relative w-full">
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none w-full text-[10px] uppercase font-bold tracking-widest px-2 py-1 pr-7 rounded-md outline-none cursor-pointer border shadow-sm transition-all focus:ring-2 focus:ring-offset-1 ${currentStyle}`}
      >
        <option value="">— Nincs kiválasztva —</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-60">
        <ChevronDownIcon />
      </div>
    </div>
  );
}
