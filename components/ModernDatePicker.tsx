"use client";

import { useState, useRef, useEffect } from "react";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "./icons";

export function ModernDatePicker({ selectedDate, onChange }: { selectedDate: string, onChange: (date: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

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
    <div className="relative w-full" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/80 border border-white/60 px-2 py-1.5 rounded-xl text-xs focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm"
      >
        <span className="flex items-center gap-2">
          <span className="text-slate-400"><CalendarIcon size={16} /></span>
          {displayDate}
        </span>
        <span className="text-slate-400"><ChevronDownIcon /></span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl z-[999] p-2.5 animate-in fade-in zoom-in-95 duration-200">
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
      )}
    </div>
  );
}