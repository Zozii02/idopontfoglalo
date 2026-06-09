"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "./supabase";

import { 
  UserIcon, LogoutIcon, ListPlusIcon, CalendarIcon, TrashIcon, RestoreIcon, 
  PlusIcon, PrintIcon, SearchIcon, AlertModalIcon, QuestionModalIcon, 
  ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, EraserIcon, DownloadIcon, 
  HistoryIcon, ArrowUpIcon, MailIcon, LockIcon, TagIcon, InfoIcon, 
  RefreshIcon, CheckCircleIcon, XCircleIcon, BellIcon, SettingsIcon, 
  FeedbackIcon, CalculatorIcon, DocumentIcon, EyeOpenIcon, EyeClosedIcon
} from "../components/icons";

import { ModernDatePicker } from "../components/ModernDatePicker";
import { ModernStatusSelect } from "../components/ModernStatusSelect";
import { BACKGROUND_IMAGE_URL, LAB_DATABASE } from "../lib/constants";

export default function Home() {
  const [labPhone, setLabPhone] = useState("");
  const [labEmail, setLabEmail] = useState("");
  const [labPatientAddress, setLabPatientAddress] = useState("");
  
  // Labor Napok állapotai
  const [labSlots, setLabSlots] = useState<any[]>([]);
  const [labSelectedSlotId, setLabSelectedSlotId] = useState("");
  const [labGenDate, setLabGenDate] = useState("");
  const [labGenStart, setLabGenStart] = useState("08:00");
  const [labGenEnd, setLabGenEnd] = useState("12:00");
  const [labGenDuration, setLabGenDuration] = useState("10");
  const [labDayNewTimeSlots, setLabDayNewTimeSlots] = useState<Record<string, string>>({});

  const [savedCalculations, setSavedCalculations] = useState<any[]>([]);
  const [isLoadingSavedLabs, setIsLoadingSavedLabs] = useState(false);
  const [printingSavedLab, setPrintingSavedLab] = useState<any>(null); 

  const [statsPeriod, setStatsPeriod] = useState<'today' | 'week' | 'month' | 'all'>('month');

  const [isDeptDropdownOpen, setIsDeptDropdownOpen] = useState(false);
  const deptDropdownRef = useRef<HTMLDivElement>(null);

  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [isOnlineDropdownOpen, setIsOnlineDropdownOpen] = useState(false);
  const onlineRef = useRef<HTMLDivElement>(null);

  const [appointments, setAppointments] = useState<any[]>([]);
  const appointmentsRef = useRef(appointments); // Ref a legfrissebb állapothoz
  const [departmentSearch, setDepartmentSearch] = useState(""); 
  const [showDeleted, setShowDeleted] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [needsProfileName, setNeedsProfileName] = useState(false);
  const [profileNameInput, setProfileNameInput] = useState("");
  
  const [selectedDate, setSelectedDate] = useState(""); 
  
  const [dayNewTimeSlots, setDayNewTimeSlots] = useState<Record<string, string>>({});

  const [genStart, setGenStart] = useState("08:00");
  const [genEnd, setGenEnd] = useState("16:00");
  const [genDuration, setGenDuration] = useState("30");
  const [genBreakStart, setGenBreakStart] = useState("12:00");
  const [genBreakEnd, setGenBreakEnd] = useState("13:00");
  
  const [genOnlineStart, setGenOnlineStart] = useState("");
  const [genOnlineEnd, setGenOnlineEnd] = useState("");

  const [printingDate, setPrintingDate] = useState<string | null>(null);
  const [printingLabQuote, setPrintingLabQuote] = useState(false); 
  const [showScrollTop, setShowScrollTop] = useState(false);

  const [allPrices, setAllPrices] = useState<any[]>([]);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [currentPrices, setCurrentPrices] = useState<{id: string, name: string, price: string}[]>([]);
