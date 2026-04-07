"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "./supabase";

// --- Ikonok ---
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const ListPlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M19 10v6"/><path d="M22 13h-6"/></svg>;
const CalendarIcon = ({ size = 24 }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const TrashIcon = ({ size = 16 }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
const RestoreIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const PrintIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>;
const SearchIcon = ({ size = 18 }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const AlertModalIcon = () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const QuestionModalIcon = () => <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const ChevronLeftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const ChevronRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;
const EraserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"></path><path d="M22 21H7"></path><path d="m5 11 9 9"></path></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>;
const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5"></path><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"></path><polyline points="12 7 12 12 15 15"></polyline></svg>;
const ArrowUpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const LockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const TagIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const InfoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const RefreshIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>;
const CheckCircleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const XCircleIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const SettingsIcon = ({ size = 16 }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 1.7l-.15.82a6.8 6.8 0 0 1-2.12 1.22l-.78-.37a2 2 0 0 0-2.67.73l-.22.38a2 2 0 0 0 .73 2.67l.78.37a6.8 6.8 0 0 1 0 2.45l-.78.37a2 2 0 0 0-.73 2.67l.22.38a2 2 0 0 0 2.67.73l.78-.37a6.8 6.8 0 0 1 2.12 1.22l.15.82a2 2 0 0 0 2 1.7h.44a2 2 0 0 0 2-1.7l.15-.82a6.8 6.8 0 0 1 2.12-1.22l.78.37a2 2 0 0 0 2.67-.73l.22-.38a2 2 0 0 0-.73-2.67l-.78-.37a6.8 6.8 0 0 1 0-2.45l.78-.37a2 2 0 0 0 .73-2.67l-.22-.38a2 2 0 0 0-2.67-.73l-.78.37a6.8 6.8 0 0 1-2.12-1.22l-.15-.82A2 2 0 0 0 12.22 2z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const FeedbackIcon = ({ size = 20 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const CalculatorIcon = ({ size = 18 }: { size?: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><line x1="8" y1="6" x2="16" y2="6"></line><line x1="16" y1="14" x2="16.01" y2="14"></line><line x1="12" y1="14" x2="12.01" y2="14"></line><line x1="8" y1="14" x2="8.01" y2="14"></line><line x1="16" y1="10" x2="16.01" y2="10"></line><line x1="12" y1="10" x2="12.01" y2="10"></line><line x1="8" y1="10" x2="8.01" y2="10"></line><line x1="16" y1="18" x2="16.01" y2="18"></line><line x1="12" y1="18" x2="12.01" y2="18"></line><line x1="8" y1="18" x2="8.01" y2="18"></line></svg>;
const DocumentIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;

// --- HÁTTÉRKÉP BEÁLLÍTÁSA ---
const BACKGROUND_IMAGE_URL = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop";

// --- LABOR VIZSGÁLAT ADATBÁZIS (FELTÖLTVE VALÓS ÁRAKKAL) ---
const LAB_DATABASE = [
  {
    category: "Általános",
    items: [
      { id: "alt_1", name: "CRP", price: 1500, time: "1 munkanap" },
      { id: "alt_2", name: "AST (ASO)", price: 2200, time: "3 munkanap" },
      { id: "alt_3", name: "Vvt süllyedés", price: 1500, time: "1 munkanap" },
      { id: "alt_4", name: "Vérkép automatával", price: 1000, time: "1 munkanap" },
      { id: "alt_5", name: "Vérkép+reticulocyta", price: 2200, time: "1 munkanap" },
      { id: "alt_6", name: "Teljes vizelet ált+üledék", price: 1200, time: "1 munkanap" },
      { id: "alt_7", name: "Vizelet tenyésztés", price: 6000, time: "-" },
      { id: "alt_8", name: "Vércsoport", price: 15000, time: "2 munkanap" },
      { id: "alt_9", name: "Húgysav", price: 400, time: "1 munkanap" },
      { id: "alt_10", name: "Epesav", price: 10500, time: "8 munkanap" },
      { id: "alt_11", name: "Koleszterin", price: 400, time: "1 munkanap" },
      { id: "alt_12", name: "HDL-koleszterin", price: 700, time: "1 munkanap" },
      { id: "alt_13", name: "LDL koleszterin", price: 700, time: "1 munkanap" },
      { id: "alt_14", name: "Triglicerid", price: 400, time: "1 munkanap" },
      { id: "alt_15", name: "Vas", price: 500, time: "1 munkanap" },
      { id: "alt_16", name: "Transzferrin", price: 1000, time: "1 munkanap" },
      { id: "alt_17", name: "Transzferrin szat. (vas+transzf)", price: 300, time: "1 munkanap" },
      { id: "alt_18", name: "Ferritin", price: 2600, time: "1 munkanap" },
      { id: "alt_19", name: "Lipáz", price: 800, time: "1 munkanap" },
      { id: "alt_20", name: "Amiláz", price: 800, time: "1 munkanap" },
      { id: "alt_21", name: "Pancreas spec. elasztáz", price: 20000, time: "17 munkanap" },
      { id: "alt_22", name: "Albumin", price: 400, time: "1 munkanap" },
      { id: "alt_23", name: "Összfehérje", price: 400, time: "1 munkanap" },
      { id: "alt_24", name: "IgG / IgA / IgM", price: 2000, time: "3 munkanap" },
      { id: "alt_25", name: "Nagylabor csomag", price: 18000, time: "Csomag" },
    ]
  },
  {
    category: "Hemosztázis",
    items: [
      { id: "hem_1", name: "Prothrombin(INR)", price: 1000, time: "1 munkanap" },
      { id: "hem_2", name: "APTI", price: 1000, time: "1 munkanap" },
      { id: "hem_3", name: "Trombin idő", price: 1000, time: "1 munkanap" },
      { id: "hem_4", name: "Fibrinogén", price: 1700, time: "1 munkanap" },
      { id: "hem_5", name: "D-dimer", price: 6500, time: "1 munkanap" },
    ]
  },
  {
    category: "Máj és Vese",
    items: [
      { id: "mv_1", name: "Összbilirubin", price: 400, time: "1 munkanap" },
      { id: "mv_2", name: "GPT / GOT / GGT", price: 400, time: "1 munkanap" },
      { id: "mv_3", name: "Alkalikus foszfatáz", price: 400, time: "1 munkanap" },
      { id: "mv_4", name: "LDH", price: 400, time: "1 munkanap" },
      { id: "mv_5", name: "Karbamid", price: 400, time: "1 munkanap" },
      { id: "mv_6", name: "Kreatinin", price: 500, time: "1 munkanap" },
    ]
  },
  {
    category: "Cukor / Anyagcsere",
    items: [
      { id: "cuk_1", name: "Glukóz- éhgyomri", price: 400, time: "1 munkanap" },
      { id: "cuk_2", name: "Hemoglobin A1c", price: 3500, time: "1 munkanap" },
      { id: "cuk_3", name: "Fruktózamin", price: 3000, time: "3 munkanap" },
      { id: "cuk_4", name: "Inzulin- éhgyomri", price: 2500, time: "1 munkanap" },
      { id: "cuk_5", name: "3 pontos vércukorterhelés", price: 1200, time: "1 munkanap" },
      { id: "cuk_6", name: "3 pontos inzulinterhelés", price: 7500, time: "1 munkanap" },
      { id: "cuk_7", name: "HOMA index", price: 0, time: "1 munkanap" },
    ]
  },
  {
    category: "Ionok",
    items: [
      { id: "ion_1", name: "Nátrium / Kálium / Klorid", price: 400, time: "1 munkanap" },
      { id: "ion_2", name: "Calcium / Magnézium", price: 400, time: "1 munkanap" },
      { id: "ion_3", name: "P-foszfor", price: 400, time: "1 munkanap" },
      { id: "ion_4", name: "Cink", price: 6900, time: "3 munkanap" },
    ]
  },
  {
    category: "Hormonok",
    items: [
      { id: "horm_1", name: "TSH", price: 2000, time: "1 munkanap" },
      { id: "horm_2", name: "fT3 / FT4", price: 3000, time: "1 munkanap" },
      { id: "horm_3", name: "Thyreoglobulin", price: 4000, time: "5 munkanap" },
      { id: "horm_4", name: "Anti TPO / Anti TG", price: 4000, time: "1 munkanap" },
      { id: "horm_5", name: "TRAK / Reverz T3", price: 7500, time: "3 munkanap" },
      { id: "horm_6", name: "FSH", price: 3500, time: "1 munkanap" },
      { id: "horm_7", name: "LH / Prolactin / Ösztradiol", price: 3000, time: "1 munkanap" },
      { id: "horm_8", name: "Progeszteron", price: 4800, time: "1 munkanap" },
      { id: "horm_9", name: "AMH", price: 11000, time: "3 munkanap" },
      { id: "horm_10", name: "Béta-HCG", price: 4500, time: "1 munkanap" },
      { id: "horm_11", name: "Tesztoszteron", price: 3500, time: "1 munkanap" },
      { id: "horm_12", name: "Total és szabad tesztoszteron", price: 8000, time: "1 munkanap" },
      { id: "horm_13", name: "Cortizol", price: 3500, time: "2 munkanap" },
      { id: "horm_14", name: "SHBG", price: 4000, time: "1 munkanap" },
      { id: "horm_15", name: "Parathormon (PHT)", price: 5500, time: "5 munkanap" },
      { id: "horm_16", name: "Aldoszteron", price: 11000, time: "17 munkanap" },
      { id: "horm_17", name: "C-peptid", price: 6500, time: "-" },
      { id: "horm_18", name: "DHEA-S", price: 3500, time: "1 munkanap" },
      { id: "horm_19", name: "CK", price: 600, time: "-" },
    ]
  },
  {
    category: "Allergia / Intolerancia",
    items: [
      { id: "all_1", name: "Cöliacia", price: 6500, time: "5 munkanap" },
      { id: "all_2", name: "EMA IgA/IgG", price: 10000, time: "5 munkanap" },
      { id: "all_3", name: "Nutritív 20", price: 23000, time: "5 munkanap" },
      { id: "all_4", name: "Nutritív 40", price: 28000, time: "5 munkanap" },
      { id: "all_5", name: "IgE", price: 4000, time: "3 munkanap" },
      { id: "all_6", name: "Hisztamin intolerancia (DAO)", price: 14000, time: "17 munkanap" },
      { id: "all_7", name: "40-es étel intolerancia panel", price: 22000, time: "3 munkanap" },
      { id: "all_8", name: "108-as intolerancia panel", price: 47000, time: "5 munkanap" },
      { id: "all_9", name: "220 intolerancia igg", price: 80000, time: "Csomag" },
      { id: "all_10", name: "Laktóz vér/nyál", price: 16000, time: "10 munkanap" },
      { id: "all_11", name: "Inhalatív 20", price: 23000, time: "5 munkanap" },
      { id: "all_12", name: "Inhalatív 40", price: 32000, time: "5 munkanap" },
      { id: "all_13", name: "Méh-darázscs. antisepc. IgE", price: 16000, time: "5 munkanap" },
      { id: "all_14", name: "54 kombinált allergia panel", price: 33000, time: "-" },
    ]
  },
  {
    category: "Tumormarker",
    items: [
      { id: "tm_1", name: "CA 125 (petefészek)", price: 4600, time: "5 munkanap" },
      { id: "tm_2", name: "CA 19-9 (hasnyálmirigy)", price: 4000, time: "3 munkanap" },
      { id: "tm_3", name: "CA 72-4 (pank, máj, tüdő)", price: 6500, time: "17 munkanap" },
      { id: "tm_4", name: "CA 15-3 (emlő)", price: 4500, time: "3 munkanap" },
      { id: "tm_5", name: "CEA (máj, vastagbél, végbél)", price: 4000, time: "3 munkanap" },
      { id: "tm_6", name: "ROMA index (HE4+CA 125)", price: 14000, time: "7 munkanap" },
      { id: "tm_7", name: "PSA (prostata)", price: 3000, time: "1 munkanap" },
      { id: "tm_8", name: "PSA free (prostata)", price: 4000, time: "1 munkanap" },
      { id: "tm_9", name: "NSE (kis sejtes tüdőrák)", price: 11000, time: "-" },
      { id: "tm_10", name: "TPA (hólyag)", price: 11000, time: "-" },
      { id: "tm_11", name: "AFP (máj)", price: 4500, time: "-" },
    ]
  },
  {
    category: "Vitaminok",
    items: [
      { id: "vit_1", name: "A vitamin", price: 12000, time: "17 munkanap" },
      { id: "vit_2", name: "B12 vitamin", price: 4000, time: "1 munkanap" },
      { id: "vit_3", name: "Folsav", price: 4000, time: "1 munkanap" },
      { id: "vit_4", name: "C vitamin", price: 15000, time: "17 munkanap" },
      { id: "vit_5", name: "Jód", price: 18000, time: "14 munkanap" },
      { id: "vit_6", name: "Szelén", price: 12000, time: "14 munkanap" },
      { id: "vit_7", name: "D-vitamin", price: 4500, time: "1 munkanap" },
      { id: "vit_8", name: "K1 vitamin", price: 18000, time: "17 munkanap" },
    ]
  },
  {
    category: "Fertőzés",
    items: [
      { id: "inf_1", name: "Hepatitis A (IgG+IgM) antitest", price: 6500, time: "3 munkanap" },
      { id: "inf_2", name: "Hepatitis A friss (IgM)", price: 4500, time: "1 munkanap" },
      { id: "inf_3", name: "Hepatitis B (HBsAg) antigén", price: 4500, time: "3 munkanap" },
      { id: "inf_4", name: "Hepatitis B antitest (Anti-HBsAg)", price: 4500, time: "3 munkanap" },
      { id: "inf_5", name: "Hepatitis B (Anti- HBcAg)", price: 5300, time: "3 munkanap" },
      { id: "inf_6", name: "Hepatitis C antitest", price: 5500, time: "3 munkanap" },
      { id: "inf_7", name: "Hepatitis E IgG/IgM", price: 12000, time: "10 munkanap" },
      { id: "inf_8", name: "Autoimmun májpanel", price: 13500, time: "-" },
      { id: "inf_9", name: "Borrelia antitest IgG+IgM (Lyme kór)", price: 20000, time: "7 munkanap" },
      { id: "inf_10", name: "Chlamydia pneum. anti. IGG IgM+IgA", price: 10000, time: "5 munkanap" },
      { id: "inf_11", name: "Clamidia tracho IgG/IgA/IgM", price: 10000, time: "5 munkanap" },
      { id: "inf_12", name: "Cytomegalovírus IgG/IgM", price: 6600, time: "3 munkanap" },
      { id: "inf_13", name: "Epstein-bar vírus antitestek", price: 10500, time: "5 munkanap" },
      { id: "inf_14", name: "Helicobacter pylori antit. IgA+IgG", price: 8000, time: "2 munkanap" },
      { id: "inf_15", name: "Herpes simplex vírus IgG+IgM", price: 12000, time: "5 munkanap" },
      { id: "inf_16", name: "HIV", price: 6500, time: "3 munkanap" },
      { id: "inf_17", name: "Legionella IgG, IgM", price: 15000, time: "17 munkanap" },
      { id: "inf_18", name: "Morbili (kanyaró) IgG", price: 9000, time: "17 munkanap" },
      { id: "inf_19", name: "Mycoplasma pneumoniae antit.", price: 10000, time: "5 munkanap" },
      { id: "inf_20", name: "Parvo vírus B19 IgG", price: 10000, time: "5 munkanap" },
      { id: "inf_21", name: "Rubeola védettség / vírus antitest", price: 7500, time: "5 munkanap" },
      { id: "inf_22", name: "Toxoplasma antitest IgG-IgM", price: 7500, time: "3 munkanap" },
      { id: "inf_23", name: "Treponema ellenanyag (LUES/szifilisz)", price: 5500, time: "5 munkanap" },
      { id: "inf_24", name: "Varicella zoster védettség", price: 8500, time: "5 munkanap" },
      { id: "inf_25", name: "Varicella zoster vírus antit. IgG-IgM", price: 9000, time: "5 munkanap" },
    ]
  },
  {
    category: "Speciális / Egyéb",
    items: [
      { id: "spec_1", name: "Spermium elleni antitest", price: 16000, time: "21 munkanap" },
      { id: "spec_2", name: "Leiden mutáció", price: 15000, time: "12 munkanap" },
      { id: "spec_3", name: "Calprotectin", price: 8000, time: "5 munkanap" },
      { id: "spec_4", name: "Széklet tenyésztés", price: 8500, time: "5 munkanap" },
      { id: "spec_5", name: "Széklet vér (3 minta)", price: 7500, time: "3 egymást követő nap" },
      { id: "spec_6", name: "Leptin", price: 15000, time: "-" },
      { id: "spec_7", name: "APC rezisztencia", price: 8000, time: "Fagyasztós" },
      { id: "spec_8", name: "ADH", price: 17500, time: "17 munkanap" },
      { id: "spec_9", name: "ACTH", price: 8000, time: "Fagyasztós" },
      { id: "spec_10", name: "Anti-DSdna", price: 6000, time: "-" },
      { id: "spec_11", name: "Celluláris immunstátusz", price: 31000, time: "-" },
      { id: "spec_12", name: "Cell. Immun + NK funkció", price: 55000, time: "-" },
      { id: "spec_13", name: "NK lymphocyta funkció", price: 38000, time: "-" },
    ]
  }
];


// --- OKOS FORMÁZÓK ÉS SEGÉDEK ---
const formatTAJ = (val: string) => {
  if (!val) return "";
  const cleaned = val.replace(/\D/g, '').substring(0, 9);
  return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
};

const formatPhone = (val: string) => {
  if (!val) return "";
  let cleaned = val.replace(/[^\d+]/g, '');
  if (cleaned.startsWith('06')) cleaned = '+36' + cleaned.substring(2);
  else if (cleaned.startsWith('36')) cleaned = '+36' + cleaned.substring(2);
  if (cleaned.startsWith('+36') && cleaned.length > 3) {
    const p1 = cleaned.substring(0, 3);
    const p2 = cleaned.substring(3, 5);
    const p3 = cleaned.substring(5, 8);
    const p4 = cleaned.substring(8, 12);
    return `${p1} ${p2} ${p3} ${p4}`.trim();
  }
  return cleaned;
};

const formatName = (val: string) => {
  if (!val) return "";
  return val.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const getTodayDateStr = () => new Date().toISOString().split('T')[0];
const getTomorrowDateStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

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

// --- OKOS CELLA ---
function EditableCell({ value, onSave, disabled = false, highlight = false, formatter, searchTerm = "" }: { value: string; onSave: (val: string) => void; disabled?: boolean; highlight?: boolean; formatter?: (v: string) => string; searchTerm?: string }) {
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

// --- MODERN STÁTUSZ VÁLASZTÓ ---
function ModernStatusSelect({ value, onChange, disabled }: { value: string, onChange: (val: string) => void, disabled: boolean }) {
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
    <div className="relative inline-block w-[140px]">
      <select 
        value={value || "Előjegyzett"} 
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none w-full text-[10px] uppercase font-bold tracking-widest px-3 py-2 pr-8 rounded-lg outline-none cursor-pointer border shadow-sm transition-all focus:ring-2 focus:ring-offset-1 ${currentStyle}`}
      >
        <option value="Előjegyzett">Előjegyzett</option>
        <option value="Megérkezett">Megérkezett</option>
        <option value="Vizsgálaton">Vizsgálaton</option>
        <option value="Befejezve">Befejezve</option>
        <option value="Nem jelent meg">Nem jelent meg</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-current opacity-60">
        <ChevronDownIcon />
      </div>
    </div>
  );
}

// --- MODERN NAPTÁR VÁLASZTÓ ---
function ModernDatePicker({ selectedDate, onChange }: { selectedDate: string, onChange: (date: string) => void }) {
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
        className="w-full flex items-center justify-between bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm"
      >
        <span className="flex items-center gap-2">
          <span className="text-slate-400"><CalendarIcon size={16} /></span>
          {displayDate}
        </span>
        <span className="text-slate-400"><ChevronDownIcon /></span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-2xl z-[999] p-3 animate-in fade-in zoom-in-95 duration-200">
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

const formatDateTime = (isoString: string) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("hu-HU", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
};
const formatShortDate = (d: string) => {
  const parts = d.split('-');
  return parts.length === 3 ? `${parts[1]}. ${parts[2]}.` : d;
};
const timeToMins = (t: string) => { const [h, m] = t.split(':'); return parseInt(h) * 60 + parseInt(m); };
const minsToTime = (m: number) => { const h = Math.floor(m / 60).toString().padStart(2, '0'); const mins = (m % 60).toString().padStart(2, '0'); return `${h}:${mins}`; };

const getDailyRevenue = (dayApps: any[], deptPrices: any[]) => {
  let total = 0;
  dayApps.forEach(app => {
    if (app.is_deleted || !app.patient_name || !app.examination_type) return;
    const examText = app.examination_type.toLowerCase();
    const matchedPrice = deptPrices.find(p => examText.includes(p.name.toLowerCase()));
    if (matchedPrice) {
       const numStr = matchedPrice.price.replace(/\D/g, ''); 
       if (numStr) total += parseInt(numStr, 10);
    }
  });
  return total;
};


// --- Főoldal ---
export default function Home() {
  const searchInputRef = useRef<HTMLInputElement>(null); 

  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("");
  
  // --- ÚJ ÁLLAPOTOK A LABOR KALKULÁTORHOZ ---
  const [showLabCalculator, setShowLabCalculator] = useState(false);
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([]);
  const [labPatientName, setLabPatientName] = useState("");
  const [labPatientTaj, setLabPatientTaj] = useState("");
  const [labPatientAddress, setLabPatientAddress] = useState("");
  const [labSearchTerm, setLabSearchTerm] = useState("");
  const [includeBloodDrawFee, setIncludeBloodDrawFee] = useState(true);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [departmentSearch, setDepartmentSearch] = useState(""); 
  const [showDeleted, setShowDeleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
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

  const [printingDate, setPrintingDate] = useState<string | null>(null);
  const [printingLabQuote, setPrintingLabQuote] = useState(false); 
  const [showScrollTop, setShowScrollTop] = useState(false);

  // --- Globális Árlista & Szakrendelések Állapotok ---
  const [allPrices, setAllPrices] = useState<any[]>([]);
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [currentPrices, setCurrentPrices] = useState<{id: string, name: string, price: string}[]>([]);

  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");

  // --- Értesítések Állapotai ---
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null); 

  // --- Hibabejelentő Állapotok ---
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [bugDescription, setBugDescription] = useState("");
  const [bugFile, setBugFile] = useState<File | null>(null);
  const [isSubmittingBug, setIsSubmittingBug] = useState(false);

  // --- Modálok és Toastok ---
  const [historyModal, setHistoryModal] = useState<{isOpen: boolean, patientName: string, taj: string, data: any[]}>({
    isOpen: false, patientName: "", taj: "", data: []
  });

  const [appInfoModal, setAppInfoModal] = useState<{isOpen: boolean, data: any, logs: any[], loading: boolean}>({
    isOpen: false, data: null, logs: [], loading: false
  });

  const [modal, setModal] = useState<{isOpen: boolean, title: string, message: string, type: "alert" | "confirm", confirmText: string, confirmColor: string, onConfirm: () => void}>({
    isOpen: false, title: "", message: "", type: "alert", confirmText: "Rendben", confirmColor: "bg-slate-900 text-white", onConfirm: () => {}
  });

  const [toast, setToast] = useState<{visible: boolean, message: string, type: 'success' | 'error'}>({
    visible: false, message: "", type: 'success'
  });

  // --- Húzásos görgetés (Drag to scroll) Állapotok ---
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingTabs = useRef(false);
  const startX = useRef(0);
  const scrollLeftPos = useRef(0);
  const hasDragged = useRef(false);

  const handleTabMouseDown = (e: React.MouseEvent) => {
    isDraggingTabs.current = true;
    hasDragged.current = false;
    if (!scrollContainerRef.current) return;
    startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftPos.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.style.cursor = 'grabbing';
    scrollContainerRef.current.style.userSelect = 'none';
  };

  const handleTabMouseLeaveOrUp = () => {
    isDraggingTabs.current = false;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
      scrollContainerRef.current.style.removeProperty('user-select');
    }
  };

  const handleTabMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingTabs.current || !scrollContainerRef.current) return;
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; 
    if (Math.abs(walk) > 5) {
      hasDragged.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftPos.current - walk;
  };

  const handleTabClick = (c: string, e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged.current = false;
      return;
    }
    setActiveTab(c);
  };

  // --- LABOR KALKULÁTOR FUNKCIÓK ---
  const toggleLabTest = (id: string) => {
    setSelectedLabTests(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  };

  const getSelectedLabItemsData = () => {
    const items: any[] = [];
    LAB_DATABASE.forEach(cat => {
      cat.items.forEach(item => {
        if (selectedLabTests.includes(item.id)) items.push(item);
      });
    });
    return items;
  };

  const calculateLabTotal = () => {
    const items = getSelectedLabItemsData();
    const testsTotal = items.reduce((sum, item) => sum + item.price, 0);
    const baseFee = includeBloodDrawFee ? 3000 : 0;
    return testsTotal + baseFee;
  };

  const handlePrintLabQuote = () => {
    if (selectedLabTests.length === 0) return showAlert("Üres ajánlat", "Kérlek, válassz ki legalább egy vizsgálatot a nyomtatáshoz!");
    setPrintingLabQuote(true);
    setTimeout(() => { window.print(); }, 300);
  };


  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3500);
  };

  const logAction = async (appId: number, action: string, details: string) => {
    const modifierName = getDisplayName();
    try {
      await supabase.from('appointment_logs').insert([{ appointment_id: appId, modified_by: modifierName, action: action, details: details }]);
    } catch (e) {
      console.error("Naplózási hiba", e);
    }
  };

  const openAppInfoModal = async (app: any) => {
    setAppInfoModal({ isOpen: true, data: app, logs: [], loading: true });
    const { data } = await supabase.from('appointment_logs').select('*').eq('appointment_id', app.id).order('modified_at', { ascending: false });
    setAppInfoModal({ isOpen: true, data: app, logs: data || [], loading: false });
  };

  const openPriceModal = () => {
    const deptPrices = allPrices.filter(p => p.department === activeTab);
    setCurrentPrices(deptPrices.length > 0 ? deptPrices : []);
    setIsPriceModalOpen(true);
  };

  const handleNotificationClick = (msg: string) => {
    const parts = msg.split("módosította az árlistát: ");
    if (parts.length === 2) {
      const dept = parts[1].trim();
      if (categories.includes(dept)) setActiveTab(dept);
      const deptPrices = allPrices.filter(p => p.department === dept);
      setCurrentPrices(deptPrices.length > 0 ? deptPrices : []);
      setIsPriceModalOpen(true);
      setIsNotifOpen(false);
    }
  };

  const addPriceItem = () => setCurrentPrices([...currentPrices, { id: Date.now().toString(), name: "", price: "" }]);
  const updatePriceItem = (id: string, field: "name" | "price", value: string) => setCurrentPrices(currentPrices.map(item => item.id === id ? { ...item, [field]: value } : item));
  const removePriceItem = (id: string) => setCurrentPrices(currentPrices.filter(item => item.id !== id));

  const savePrices = async () => {
    await supabase.from("prices").delete().eq("department", activeTab);
    const validPrices = currentPrices.filter(p => p.name.trim() !== "" || p.price.trim() !== "");
    if (validPrices.length > 0) {
      const inserts = validPrices.map(p => ({ department: activeTab, name: p.name, price: p.price }));
      await supabase.from("prices").insert(inserts);
    }
    await supabase.from("notifications").insert([{ message: `${getDisplayName()} módosította az árlistát: ${activeTab}` }]);
    setIsPriceModalOpen(false);
    showToast(`${activeTab} árak sikeresen elmentve!`);
  };

  const handleAddDepartment = async () => {
    const trimmed = newDeptName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) return showAlert("Hiba", "Ez a szakrendelés már létezik!");
    
    await supabase.from("departments").insert([{ name: trimmed }]);
    setNewDeptName("");
    showToast("Szakrendelés sikeresen hozzáadva!");
  };

  const handleDeleteDepartment = (name: string) => {
    showConfirm(
      "Szakrendelés törlése",
      `Biztosan törlöd a(z) ${name} szakrendelést a listából?\n\n(A már rögzített időpontok és páciensek megmaradnak az adatbázisban, csak ez a fül tűnik el.)`,
      "Igen, törlés",
      "bg-red-600 hover:bg-red-700 text-white",
      async () => {
        await supabase.from("departments").delete().eq("name", name);
        if (activeTab === name) setActiveTab(categories[0] || "");
        showToast("Szakrendelés törölve!");
      }
    );
  };

  // --- HIBABEJELENTŐ KÜLDÉSE (E-MAIL) ---
  const handleBugSubmit = async () => {
    if (!bugDescription.trim()) return showAlert("Hiányzó adat", "Kérlek írd le röviden a problémát vagy az ötletedet!");
    setIsSubmittingBug(true);
    
    try {
      const formData = new FormData();
      formData.append("Bejelentő neve", getDisplayName() || "Ismeretlen");
      formData.append("Bejelentő email", user?.email || "Ismeretlen");
      formData.append("Leírás", bugDescription);
      if (bugFile) formData.append("Csatolmány", bugFile);
      
      formData.append("_subject", "Új hibabejelentés: Medical-Aqua");
      formData.append("_captcha", "false");

      const response = await fetch("https://formsubmit.co/ajax/TE_EMAIL_CIMED@gmail.com", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        showToast("Hibabejelentés sikeresen elküldve!");
        setIsBugModalOpen(false);
        setBugDescription("");
        setBugFile(null);
      } else {
        showAlert("Hiba", "Nem sikerült elküldeni az e-mailt. Próbáld újra később.");
      }
    } catch (error) {
      showAlert("Hálózati Hiba", "Ellenőrizd az internetkapcsolatot!");
    }
    
    setIsSubmittingBug(false);
  };

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));
  const closeHistoryModal = () => setHistoryModal(prev => ({ ...prev, isOpen: false }));
  const closeAppInfoModal = () => setAppInfoModal(prev => ({ ...prev, isOpen: false }));

  const showAlert = (title: string, message: string) => {
    setModal({ isOpen: true, title, message, type: "alert", confirmText: "Rendben", confirmColor: "bg-slate-900 text-white hover:bg-black", onConfirm: closeModal });
  };

  const showConfirm = (title: string, message: string, confirmText: string, confirmColor: string, onConfirmCallback: () => void) => {
    setModal({ isOpen: true, title, message, type: "confirm", confirmText, confirmColor, onConfirm: () => { onConfirmCallback(); closeModal(); }});
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotifOpen]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'k') { e.preventDefault(); searchInputRef.current?.focus(); }
      if (e.key === 'Escape') { 
        closeModal(); closeHistoryModal(); setIsPriceModalOpen(false); 
        closeAppInfoModal(); setIsNotifOpen(false); setIsDeptModalOpen(false);
        setIsBugModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleAfterPrint = () => { setPrintingDate(null); setPrintingLabQuote(false); };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => window.removeEventListener('afterprint', handleAfterPrint);
  }, []);

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

  const fetchCategories = async () => {
    const { data } = await supabase.from('departments').select('name').order('name');
    if (data) {
      const catList = data.map(d => d.name);
      setCategories(catList);
      setActiveTab(prev => (prev && catList.includes(prev)) ? prev : (catList[0] || ""));
    }
  };

  const fetchAllPrices = async () => {
    const { data } = await supabase.from("prices").select("*");
    if (data) setAllPrices(data);
  };

  const fetchNotifications = async () => {
    const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(20);
    if (data) {
      setNotifications(data);
      updateUnreadCount(data);
    }
  };

  const updateUnreadCount = (notifs: any[]) => {
    if (!user) return;
    const lastRead = localStorage.getItem(`medaqua_notif_${user.email}`);
    if (!lastRead) {
      setUnreadCount(notifs.length);
    } else {
      const count = notifs.filter(n => new Date(n.created_at) > new Date(lastRead)).length;
      setUnreadCount(count);
    }
  };

  const toggleNotif = () => {
    const opening = !isNotifOpen;
    setIsNotifOpen(opening);
    if (opening && user) {
      const now = new Date().toISOString();
      localStorage.setItem(`medaqua_notif_${user.email}`, now);
      setUnreadCount(0);
    }
  };

  useEffect(() => { 
    if (user && !needsProfileName) {
      fetchCategories();
      fetchAppointments();
      fetchAllPrices();
      fetchNotifications();

      const channel = supabase.channel('live-appointments')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => fetchAppointments())
        .subscribe();
      
      const pricesChannel = supabase.channel('live-prices')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'prices' }, () => fetchAllPrices())
        .subscribe();

      const notifChannel = supabase.channel('live-notifs')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () => fetchNotifications())
        .subscribe();

      const deptChannel = supabase.channel('live-departments')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'departments' }, () => fetchCategories())
        .subscribe();

      return () => { supabase.removeChannel(channel); supabase.removeChannel(pricesChannel); supabase.removeChannel(notifChannel); supabase.removeChannel(deptChannel); };
    } 
  }, [user, needsProfileName]);

  const fetchAppointments = async () => {
    const { data, error } = await supabase.from("appointments").select("*").order("appointment_date", { ascending: true }).order("time_slot", { ascending: true });
    if (!error && data) setAppointments(data);
  };

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return showAlert("Sikertelen belépés", "Hibás e-mail cím vagy jelszó.\nKérlek, ellenőrizd az adataidat és próbáld újra!");
  };

  const handleSaveProfileName = async () => {
    if (!profileNameInput.trim()) return showAlert("Hiányzó adat", "Kérlek, add meg a teljes nevedet a folytatáshoz! (Pl. Dr. Kovács)");
    const { data, error } = await supabase.auth.updateUser({ data: { display_name: profileNameInput } });
    if (error) return showAlert("Hiba", "Nem sikerült elmenteni a nevedet. Kérlek, próbáld újra!");
    else { setUser(data.user); setNeedsProfileName(false); }
  };

  const handleLogout = async () => await supabase.auth.signOut();
  const getDisplayName = () => user?.user_metadata?.display_name || user?.email;

  const updateAppointment = async (id: number, field: string, newValue: string) => {
    if (!user) return;
    
    const oldApp = appointments.find(a => a.id === id);
    const oldValue = oldApp ? oldApp[field] : "";
    
    if (oldValue !== newValue) {
      const modifierName = getDisplayName();
      const now = new Date().toISOString();
      
      const fieldNames: Record<string, string> = {
        patient_name: "Páciens neve", taj_szam: "TAJ szám", phone_number: "Telefon", 
        status: "Státusz", examination_type: "Vizsgálat", notes: "Megjegyzés"
      };
      const fieldLabel = fieldNames[field] || field;
      
      const oldDisp = oldValue ? oldValue : "(üres)";
      const newDisp = newValue ? newValue : "(üres)";
      const details = `${fieldLabel}: "${oldDisp}" ➔ "${newDisp}"`;

      setAppointments(appointments.map((app: any) => app.id === id ? { ...app, [field]: newValue, last_modified_by: modifierName, last_modified_at: now } : app));
      
      await supabase.from("appointments").update({ [field]: newValue, last_modified_by: modifierName, last_modified_at: now }).eq("id", id);
      await logAction(id, "Módosítás", details);
    }
  };

  const clearEmptySlots = async (date: string) => {
    const dayApps = groupedByDate[date] || [];
    const emptyApps = dayApps.filter((a: any) => !a.is_deleted && (!a.patient_name || a.patient_name.trim() === ""));
    
    if (emptyApps.length === 0) return showAlert("Nincs törölhető üres sor", "Ezen a napon nincsenek üres (páciens nélküli) időpontok.");

    showConfirm(
      "Üres sorok takarítása",
      `Biztosan törlöd a(z) ${emptyApps.length} db üresen maradt időpontot ezen a napon?`,
      "Igen, törlés",
      "bg-amber-500 hover:bg-amber-600 text-white",
      async () => {
        const modifierName = getDisplayName();
        const now = new Date().toISOString();
        const idsToDelete = emptyApps.map((a: any) => a.id);
        
        setAppointments(appointments.map((app: any) => 
          idsToDelete.includes(app.id) ? { ...app, is_deleted: true, deleted_by: modifierName, deleted_at: now } : app
        ));

        await supabase.from("appointments")
          .update({ is_deleted: true, deleted_by: modifierName, deleted_at: now })
          .in('id', idsToDelete);
          
        const logs = idsToDelete.map((id: number) => ({
           appointment_id: id, modified_by: modifierName, action: "Törlés", details: "Üres sor automatikus takarítása"
        }));
        await supabase.from('appointment_logs').insert(logs);
        
        showToast("Üres sorok sikeresen törölve!");
      }
    );
  };

  const confirmDeleteApp = (id: number) => {
    showConfirm(
      "Időpont törlése",
      "Biztosan törlöd ezt az időpontot?\n\nKésőbb a 'Törölt sorok mutatása' gombbal visszaállítható.",
      "Igen, törlöm",
      "bg-red-600 hover:bg-red-700 text-white",
      () => executeDeleteApp(id)
    );
  };

  const executeDeleteApp = async (id: number) => {
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    setAppointments(appointments.map((app: any) => app.id === id ? { ...app, is_deleted: true, deleted_by: modifierName, deleted_at: now } : app));
    await supabase.from("appointments").update({ is_deleted: true, deleted_by: modifierName, deleted_at: now }).eq("id", id);
    await logAction(id, "Törlés", "Időpont törölve a listából");
    showToast("Időpont törölve");
  };

  const handlePrintDay = (date: string) => {
    setPrintingDate(date);
    setTimeout(() => { window.print(); }, 300);
  };

  const deleteEntireDay = async (date: string) => {
    const dayApps = groupedByDate[date].filter((a: any) => !a.is_deleted);
    if (dayApps.length === 0) return showAlert("Üres nap", "Ezen a napon nincsenek törölhető időpontok az adott szakrendelésen.");

    showConfirm(
      "Teljes nap törlése",
      `Biztosan törlöd a teljes ${date} napot a(z) ${activeTab} szakrendelésen?\n\nFigyelem: Ezzel az összes ide beírt páciens is törlésre kerül!`,
      "Igen, teljes nap törlése",
      "bg-red-600 hover:bg-red-700 text-white",
      async () => {
        const modifierName = getDisplayName();
        const now = new Date().toISOString();
        const idsToDelete = dayApps.map((a: any) => a.id);
        
        setAppointments(appointments.map((app: any) => 
          idsToDelete.includes(app.id) ? { ...app, is_deleted: true, deleted_by: modifierName, deleted_at: now } : app
        ));

        await supabase.from("appointments")
          .update({ is_deleted: true, deleted_by: modifierName, deleted_at: now })
          .in('id', idsToDelete);
          
        const logs = idsToDelete.map((id: number) => ({
           appointment_id: id, modified_by: modifierName, action: "Törlés", details: "Teljes nap csoportos törlése"
        }));
        await supabase.from('appointment_logs').insert(logs);
        showToast("A teljes nap törlésre került.");
      }
    );
  };

  const restoreAppointment = async (id: number) => {
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    setAppointments(appointments.map((app: any) => app.id === id ? { ...app, is_deleted: false, last_modified_by: modifierName, last_modified_at: now } : app));
    await supabase.from("appointments").update({ is_deleted: false, last_modified_by: modifierName, last_modified_at: now }).eq("id", id);
    await logAction(id, "Visszaállítás", "Törölt időpont visszaállítva");
    showToast("Időpont sikeresen visszaállítva!");
  };

  const exportToCSV = (date: string) => {
    const dayApps = groupedByDate[date]?.filter((a: any) => !a.is_deleted).sort((a: any, b: any) => a.time_slot.localeCompare(b.time_slot)) || [];
    if (dayApps.length === 0) return showAlert("Üres nap", "Nincs letölthető adat ezen a napon.");

    const headers = ["Időpont", "Páciens neve", "TAJ szám", "Telefon", "Státusz", "Vizsgálat", "Megjegyzés"];
    const rows = dayApps.map((app: any) => [
      app.time_slot,
      app.patient_name || "",
      app.taj_szam || "",
      app.phone_number || "",
      app.status || "",
      app.examination_type || "",
      app.notes || ""
    ]);

    const csvContent = [
      headers.join(";"),
      ...rows.map((row: any[]) => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(";"))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `MA_elojegyzes_${activeTab}_${date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPatientHistory = (name: string, taj: string) => {
    if (!name || !taj) return showAlert("Hiányzó adat", "Az előzmények megtekintéséhez a beteg nevének és TAJ számának is kitöltve kell lennie!");
    
    let matches = appointments.filter(a => !a.is_deleted && a.taj_szam === taj && a.patient_name === name);
    matches = matches.sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime());
    
    setHistoryModal({ isOpen: true, patientName: name, taj: taj, data: matches });
  };

  const generateDailySlots = async () => {
    if (!selectedDate) return showAlert("Hiányzó adat", "Kérlek, válassz ki egy dátumot a naptárból!");
    if (!genStart || !genEnd || !genDuration) return showAlert("Hiányzó adat", "Minden generátor mezőt ki kell tölteni a művelethez!");
    
    const durationMins = parseInt(genDuration);
    if (isNaN(durationMins) || durationMins <= 0) return showAlert("Hibás érték", "A vizsgálat hossza (perc) nullánál nagyobb kell, hogy legyen!");

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

    if (slotsToCreate.length === 0) return showAlert("Sikertelen generálás", "A megadott feltételekkel (intervallum, szünetek) nem jött létre egyetlen időpont sem.");
    
    showConfirm(
      "Napi előjegyzés generálása",
      `Sikeresen kiszámoltam ${slotsToCreate.length} db új időpontot a kiválaszt napra.\n\nLétrehozhatom őket?`,
      "Lista Generálása",
      "bg-red-600 hover:bg-red-700 text-white",
      async () => {
        const modifierName = getDisplayName();
        const now = new Date().toISOString();
        const newAppointments = slotsToCreate.map((slot: string) => ({
          department: activeTab, appointment_date: selectedDate, time_slot: slot,
          patient_name: "", taj_szam: "", phone_number: "", examination_type: "", notes: "", status: "Előjegyzett",
          last_modified_by: modifierName, last_modified_at: now, is_deleted: false
        }));

        const { data } = await supabase.from("appointments").insert(newAppointments).select();
        
        if (data) {
           const logs = data.map((app: any) => ({
              appointment_id: app.id, modified_by: modifierName, action: "Létrehozás", details: "Napi lista generálással létrehozva"
           }));
           await supabase.from('appointment_logs').insert(logs);
        }
        showToast("Napi időpontok sikeresen legenerálva!");
      }
    );
  };

  const addSingleAppointment = async () => {
    if (!user || !newTimeSlot.trim() || !selectedDate) return showAlert("Hiányzó adat", "Kérlek, válassz dátumot és adj meg egy pontos időpontot is (pl. 17:00)!");
    const modifierName = getDisplayName();
    const now = new Date().toISOString();
    const { data } = await supabase.from("appointments").insert([{
      department: activeTab, appointment_date: selectedDate, time_slot: newTimeSlot,
      patient_name: "", taj_szam: "", phone_number: "", examination_type: "", notes: "", status: "Előjegyzett",
      last_modified_by: modifierName, last_modified_at: now, is_deleted: false
    }]).select();
    
    if (data && data[0]) {
       await logAction(data[0].id, "Létrehozás", "Egyedi időpont manuálisan hozzáadva");
    }
    setNewTimeSlot("");
    showToast("Új időpont sikeresen hozzáadva!");
  };

  // --- UI COMPONENTEK ---

  const customModalUI = (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 no-print transition-all duration-300 ${modal.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
      <div className={`relative bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] p-6 md:p-8 w-full max-w-sm border border-slate-100 flex flex-col transform transition-all duration-300 ${modal.isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        <div className="flex justify-center mb-5">
           {modal.type === 'alert' ? (
              <div className="bg-red-50 text-red-500 p-4 rounded-full shadow-inner"><AlertModalIcon /></div>
           ) : (
              <div className="bg-blue-50 text-blue-500 p-4 rounded-full shadow-inner"><QuestionModalIcon /></div>
           )}
        </div>
        <h3 className="text-xl font-extrabold text-center text-slate-900 mb-3">{modal.title}</h3>
        <p className="text-slate-600 text-sm font-medium text-center mb-8 whitespace-pre-line leading-relaxed">{modal.message}</p>
        
        <div className="flex flex-col gap-3 mt-auto">
           {modal.type === "confirm" && (
              <button onClick={closeModal} className="w-full py-3.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-all shadow-sm active:scale-95">Mégse</button>
           )}
           <button onClick={modal.onConfirm} className={`w-full py-3.5 rounded-xl font-bold shadow-md transition-all active:scale-95 ${modal.confirmColor}`}>{modal.confirmText}</button>
        </div>
      </div>
    </div>
  );

  const priceModalUI = (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 no-print transition-all duration-300 ${isPriceModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPriceModalOpen(false)}></div>
      <div className={`relative bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] w-full max-w-2xl border border-slate-200 flex flex-col transform transition-all duration-300 max-h-[80vh] ${isPriceModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 text-emerald-600 p-2.5 rounded-xl"><TagIcon /></div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Árlista</h3>
              <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{activeTab}</p>
            </div>
          </div>
          <button onClick={() => setIsPriceModalOpen(false)} className="p-2 bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-600 rounded-xl transition-colors font-bold text-sm">Bezár (Esc)</button>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar flex-1 bg-slate-50/50">
          {currentPrices.length === 0 ? (
            <div className="text-center text-slate-500 font-medium py-10 border-2 border-dashed border-slate-200 rounded-2xl">
              Nincsenek még árak felvéve ehhez a szakrendeléshez.<br/>Kattints az "Új tétel hozzáadása" gombra!
            </div>
          ) : (
            <div className="space-y-3">
              {currentPrices.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-200 hover:border-slate-300 transition-all items-center">
                  <div className="w-full sm:flex-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Vizsgálat megnevezése</label>
                    <input type="text" value={item.name} onChange={(e) => updatePriceItem(item.id, 'name', e.target.value)} placeholder="pl. Hasi ultrahang" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all" />
                  </div>
                  <div className="w-full sm:w-40">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-1">Ár</label>
                    <input type="text" value={item.price} onChange={(e) => updatePriceItem(item.id, 'price', e.target.value)} placeholder="pl. 15.000 Ft" className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none font-semibold text-slate-800 transition-all" />
                  </div>
                  <button onClick={() => removePriceItem(item.id)} className="w-full sm:w-auto mt-4 sm:mt-5 p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors flex justify-center" title="Tétel törlése">
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <button onClick={addPriceItem} className="mt-4 w-full border-2 border-dashed border-slate-300 text-slate-600 hover:border-emerald-500 hover:text-emerald-700 bg-white py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
            <PlusIcon /> Új tétel hozzáadása
          </button>
        </div>

        <div className="p-6 border-t border-slate-100 shrink-0 bg-white rounded-b-3xl">
           <button onClick={savePrices} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2">
             Mentés és Bezárás
           </button>
        </div>
      </div>
    </div>
  );

  const deptModalUI = (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 no-print transition-all duration-300 ${isDeptModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDeptModalOpen(false)}></div>
      <div className={`relative bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] w-full max-w-lg border border-slate-200 flex flex-col transform transition-all duration-300 max-h-[80vh] ${isDeptModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 text-slate-600 p-2.5 rounded-xl"><SettingsIcon size={20} /></div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Szakrendelések kezelése</h3>
              <p className="text-sm font-bold text-slate-500">Új hozzáadása vagy meglévő törlése</p>
            </div>
          </div>
          <button onClick={() => setIsDeptModalOpen(false)} className="p-2 bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-600 rounded-xl transition-colors font-bold text-sm">Bezár</button>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar flex-1 bg-slate-50/50">
          {categories.length === 0 ? (
            <p className="text-center text-slate-500 font-medium py-4">Nincs még szakrendelés a rendszerben.</p>
          ) : (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div key={cat} className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  <span className="font-bold text-slate-800">{cat}</span>
                  <button onClick={() => handleDeleteDepartment(cat)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Törlés">
                    <TrashIcon />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 shrink-0 bg-white rounded-b-3xl">
           <div className="flex flex-col sm:flex-row gap-3">
             <input 
               type="text" 
               placeholder="Új szakrendelés neve..." 
               value={newDeptName} 
               onChange={(e) => setNewDeptName(e.target.value)} 
               onKeyDown={(e) => e.key === "Enter" && handleAddDepartment()}
               className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-slate-200 focus:border-slate-500 outline-none font-semibold text-slate-800 transition-all"
             />
             <button onClick={handleAddDepartment} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2">
               <PlusIcon /> Hozzáadás
             </button>
           </div>
        </div>
      </div>
    </div>
  );

  const bugModalUI = (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 no-print transition-all duration-300 ${isBugModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSubmittingBug && setIsBugModalOpen(false)}></div>
      <div className={`relative bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] w-full max-w-lg border border-slate-200 flex flex-col transform transition-all duration-300 ${isBugModalOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50 rounded-t-3xl shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 text-amber-600 p-2.5 rounded-xl"><FeedbackIcon size={24} /></div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Hibabejelentő</h3>
              <p className="text-sm font-bold text-slate-500">Ötlet vagy probléma küldése a fejlesztőnek</p>
            </div>
          </div>
          <button disabled={isSubmittingBug} onClick={() => setIsBugModalOpen(false)} className="p-2 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-600 rounded-xl transition-colors font-bold text-sm shadow-sm disabled:opacity-50">Mégsem</button>
        </div>

        <div className="p-6 flex-1 bg-white">
          <div className="mb-4">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-2">Mit tapasztaltál? Milyen ötleted van?</label>
            <textarea 
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              placeholder="Írd le ide részletesen..."
              rows={4}
              disabled={isSubmittingBug}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-amber-100 focus:border-amber-500 outline-none font-medium text-slate-800 transition-all custom-scrollbar resize-none"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest block mb-2">Kép csatolása (Opcionális)</label>
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => setBugFile(e.target.files ? e.target.files[0] : null)}
              disabled={isSubmittingBug}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 transition-all cursor-pointer"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 shrink-0 bg-white rounded-b-3xl">
           <button 
             onClick={handleBugSubmit} 
             disabled={isSubmittingBug}
             className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-md hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
           >
             {isSubmittingBug ? <span className="flex items-center gap-2 animate-pulse"><RefreshIcon /> Küldés folyamatban...</span> : "E-mail küldése"}
           </button>
        </div>
      </div>
    </div>
  );

  const patientHistoryModalUI = (
    <div className={`fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-0 no-print transition-all duration-300 ${historyModal.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeHistoryModal}></div>
      <div className={`relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] w-full max-w-2xl border border-slate-200 flex flex-col transform transition-all duration-300 max-h-[80vh] ${historyModal.isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white/50 rounded-t-3xl shrink-0">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2"><HistoryIcon /> {historyModal.patientName} - Előzmények</h3>
            {historyModal.taj && <p className="text-sm font-bold text-slate-500 mt-1">TAJ: {formatTAJ(historyModal.taj)}</p>}
          </div>
          <button onClick={closeHistoryModal} className="p-2 bg-slate-100 hover:bg-red-100 hover:text-red-600 text-slate-600 rounded-xl transition-colors font-bold text-sm">Bezár (Esc)</button>
        </div>

        <div className="overflow-y-auto p-6 custom-scrollbar h-full">
          {historyModal.data.length === 0 ? (
             <p className="text-center text-slate-500 font-medium py-8">Nem található korábbi bejegyzés ehhez a TAJ számhoz.</p>
          ) : (
            <div className="space-y-4">
              {historyModal.data.map((app, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center gap-4 justify-between hover:border-slate-300 transition-colors">
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">{formatShortDate(app.appointment_date)}</span>
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-extrabold">{app.time_slot}</span>
                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider border border-blue-100">{app.department}</span>
                     </div>
                     <div className="text-sm font-medium text-slate-600 mt-2">
                        {app.examination_type ? <span>Vizsgálat: <b className="text-slate-800">{app.examination_type}</b></span> : <span className="italic opacity-60">Nincs vizsgálat rögzítve</span>}
                        {app.notes && <span className="ml-3 border-l pl-3 border-slate-300">Jegyzet: <b className="text-slate-800">{app.notes}</b></span>}
                     </div>
                   </div>
                   <div className="shrink-0">
                     <span className={`text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-lg border shadow-sm
                       ${app.status === "Megérkezett" ? "bg-amber-100 text-amber-800 border-amber-200" :
                         app.status === "Vizsgálaton" ? "bg-blue-100 text-blue-800 border-blue-200" :
                         app.status === "Befejezve" ? "bg-emerald-100 text-emerald-800 border-emerald-200" :
                         app.status === "Nem jelent meg" ? "bg-slate-800 text-white border-slate-900" :
                         "bg-slate-100 text-slate-700 border-slate-200"
                       }`}>
                       {app.status || "Előjegyzett"}
                     </span>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const infoModalUI = (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 no-print transition-all duration-300 ${appInfoModal.isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeAppInfoModal}></div>
      <div className={`relative bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)] w-full max-w-lg border border-slate-100 flex flex-col transform transition-all duration-300 max-h-[80vh] ${appInfoModal.isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>
        
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-3xl shrink-0">
           <div className="flex items-center gap-3">
             <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl"><InfoIcon /></div>
             <div>
               <h3 className="text-xl font-extrabold text-slate-900">Napló</h3>
               <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">{appInfoModal.data?.time_slot} {appInfoModal.data?.patient_name && `• ${appInfoModal.data.patient_name}`}</p>
             </div>
           </div>
           <button onClick={closeAppInfoModal} className="p-2 bg-white hover:bg-slate-200 text-slate-600 rounded-xl transition-colors font-bold shadow-sm border border-slate-200"><TrashIcon size={14}/></button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-white">
          {appInfoModal.loading ? (
             <div className="flex justify-center items-center py-10 opacity-50 animate-pulse"><RefreshIcon /></div>
          ) : appInfoModal.logs.length === 0 ? (
             <p className="text-center text-slate-500 text-sm font-medium py-6 italic">Nincs még bejegyzés erről az időpontról.</p>
          ) : (
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pb-4">
              {appInfoModal.logs.map((log, idx) => {
                 let bgColor = "bg-blue-100 border-blue-200 text-blue-600";
                 if (log.action === "Törlés") bgColor = "bg-red-100 border-red-200 text-red-600";
                 if (log.action === "Létrehozás") bgColor = "bg-emerald-100 border-emerald-200 text-emerald-600";
                 if (log.action === "Visszaállítás") bgColor = "bg-amber-100 border-amber-200 text-amber-600";
                 
                 return (
                   <div key={idx} className="relative pl-6">
                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${bgColor.split(" ")[0]}`}></div>
                      <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl shadow-sm">
                         <div className="flex justify-between items-center mb-1.5 gap-2">
                           <span className={`text-[10px] uppercase font-extrabold tracking-widest px-2 py-0.5 rounded ${bgColor}`}>{log.action}</span>
                           <span className="text-xs font-bold text-slate-400">{formatDateTime(log.modified_at)}</span>
                         </div>
                         <p className="text-sm font-bold text-slate-800 mb-1">{log.modified_by}</p>
                         <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white p-2 rounded-xl border border-slate-100">{log.details}</p>
                      </div>
                   </div>
                 );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const toastUI = (
    <div className={`fixed bottom-6 right-6 z-[999] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-slate-100 p-4 flex items-center gap-3 transform transition-all duration-500 ease-out pointer-events-none
      ${toast.visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}`}>
      <div className={`p-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
        {toast.type === 'success' ? <CheckCircleIcon /> : <XCircleIcon />}
      </div>
      <p className="font-bold text-sm text-slate-800 pr-2">{toast.message}</p>
    </div>
  );

  // Belépés ellenőrzés
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 font-sans bg-cover bg-center bg-fixed relative" style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')` }}>
        {customModalUI}
        <div className="absolute inset-0 bg-slate-100/60 backdrop-blur-2xl z-0 pointer-events-none"></div>
        <div className="relative z-10 bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-md border border-white/50">
          <div className="flex justify-center mb-8"><img src="/logo.png" alt="Medical-Aqua Logo" className="h-28 object-contain select-none pointer-events-none drop-shadow-sm" /></div>
          
          <h2 className="text-2xl font-bold mb-2 text-center text-slate-900 tracking-tight">Előjegyzés</h2>
          <p className="text-center text-slate-600 mb-8 text-sm font-medium">Jelentkezz be a folytatáshoz</p>
          
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><MailIcon /></div>
              <input type="email" placeholder="E-mail cím" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full p-3.5 pl-11 bg-white/90 border border-white/50 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-sm" />
            </div>
            
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><LockIcon /></div>
              <input type="password" placeholder="Jelszó" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full p-3.5 pl-11 bg-white/90 border border-white/50 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400 shadow-sm" />
            </div>
            
            <button onClick={handleLogin} className="w-full bg-red-600 text-white py-3.5 rounded-xl font-semibold shadow-md hover:bg-red-700 hover:shadow-lg transition-all active:scale-95 mt-2">Belépés</button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-200/60 text-center">
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Ha nincs felhasználója vagy nem tud bejelentkezni,<br/>vegye fel a kapcsolatot a <span className="font-bold text-slate-700">rendszergazdával</span>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- HA VAN FELHASZNÁLÓ, DE NINCS MÉG NEVE MEGADVA ---
  if (needsProfileName) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 font-sans bg-cover bg-center bg-fixed relative" style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')` }}>
        {customModalUI}
        <div className="absolute inset-0 bg-slate-100/60 backdrop-blur-2xl z-0 pointer-events-none"></div>
        <div className="relative z-10 bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-md border border-white/50 text-center">
          <div className="flex justify-center text-red-600 mb-6 drop-shadow-sm"><UserIcon /></div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900">Üdvözlünk a rendszerben!</h2>
          <p className="text-slate-600 mb-8 text-sm font-medium">Kérjük, add meg a teljes nevedet a naplózáshoz (pl. Dr. Kovács).</p>
          <input type="text" placeholder="Teljes neved..." value={profileNameInput} onChange={(e) => setProfileNameInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSaveProfileName()} className="w-full p-3.5 bg-white/90 border border-white/50 rounded-xl focus:bg-white focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-400 mb-4 text-center shadow-sm" />
          <button onClick={handleSaveProfileName} className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-semibold shadow-md hover:bg-black transition-all active:scale-95">Mentés és Tovább</button>
        </div>
      </div>
    );
  }

  // --- HA A LABOR KALKULÁTOR VAN NYITVA (NYOMTATÁSI NÉZET IS ITT) ---
  if (showLabCalculator) {
    const selectedItems = getSelectedLabItemsData();
    const totalPrice = calculateLabTotal();
    const formattedTotal = new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(totalPrice);

    return (
      <div className={`min-h-screen font-sans relative ${printingLabQuote ? 'bg-white print-mode' : 'bg-slate-50 overflow-hidden'}`}>
        {customModalUI}
        {toastUI}
        
        {/* FEJLÉC (csak nem nyomtatáskor) */}
        {!printingLabQuote && (
          <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-200 shadow-sm no-print h-[73px]">
            <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex justify-between items-center">
              <div className="flex items-center gap-4">
                 <img src="/logo.png" alt="Medical-Aqua" className="h-10 object-contain" />
                 <div>
                   <h1 className="text-xl font-bold tracking-tight text-slate-900">Labor kalkulátor</h1>
                   <p className="text-emerald-600 font-medium text-[11px] tracking-widest uppercase">Ajánlatkészítő</p>
                 </div>
              </div>
              <button onClick={() => setShowLabCalculator(false)} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-sm hover:bg-black transition-all active:scale-95 flex items-center gap-2">
                <ChevronLeftIcon /> Vissza az Előjegyzéshez
              </button>
            </div>
          </div>
        )}

        {/* LABOR TARTALOM */}
        <div className={`max-w-[1600px] mx-auto ${printingLabQuote ? 'p-0 pt-0 max-w-none' : 'px-4 md:px-8 py-6 h-[calc(100vh-73px)] flex flex-col'}`}>
          
          {/* NYOMTATÁSI NÉZET - KIZÁRÓLAG NYOMTATÁSKOR JELENIK MEG */}
          {printingLabQuote && (
            <div className="bg-white text-black max-w-4xl mx-auto printable-quote">
              <div className="flex justify-between items-start border-b-2 border-emerald-600 pb-3 mb-4">
                <div>
                  <img src="/logo.png" alt="Medical-Aqua" className="h-16 object-contain mb-2" />
                  <h1 className="text-2xl font-extrabold text-slate-900">Laboratóriumi ajánlat</h1>
                  <p className="text-slate-500 mt-0.5 font-medium text-sm">Dátum: {new Date().toLocaleDateString('hu-HU')}</p>
                </div>
                <div className="text-right text-xs text-slate-600 mt-1 space-y-0.5">
                  <p className="font-bold text-slate-800 text-sm">Medical-Aqua Kft.</p>
                  <p>4700 Mátészalka, Eötvös utca 21.</p>
                  <p>Tel: +36 (30) 850-6149 | +36 (30) 083-3925</p>
                  <p>Email: kapcsolat@medical-aqua.hu</p>
                </div>
              </div>

              <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200 print-bg-light">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">Páciens neve</h2>
                    <p className="text-base font-bold text-slate-900">{labPatientName || "Nincs megadva"}</p>
                  </div>
                  <div>
                    <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">TAJ Szám</h2>
                    <p className="text-sm font-bold text-slate-900">{labPatientTaj || "-"}</p>
                  </div>
                  <div className="col-span-2">
                    <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-0.5">Lakcím</h2>
                    <p className="text-sm font-bold text-slate-900">{labPatientAddress || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-1 mb-2">Kiválasztott vizsgálatok ({selectedItems.length} db)</h3>
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="border-b border-slate-300">
                      <th className="py-1 px-1 font-bold text-slate-600">Vizsgálat megnevezése</th>
                      <th className="py-1 px-1 font-bold text-slate-600">Kategória</th>
                      <th className="py-1 px-1 font-bold text-slate-600 text-right">Eredmény várható</th>
                      <th className="py-1 px-1 font-bold text-slate-600 text-right">Díj (HUF)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedItems.map(item => (
                      <tr key={item.id}>
                        <td className="py-1 px-1 font-bold text-slate-900">{item.name}</td>
                        <td className="py-1 px-1 text-slate-500">{LAB_DATABASE.find(c => c.items.some(i => i.id === item.id))?.category}</td>
                        <td className="py-1 px-1 text-slate-600 text-right">{item.time}</td>
                        <td className="py-1 px-1 font-bold text-slate-900 text-right">{item.price === 0 ? "-" : `${item.price.toLocaleString('hu-HU')} Ft`}</td>
                      </tr>
                    ))}
                    {includeBloodDrawFee && (
                      <tr className="bg-slate-50 print-bg-light border-t-2 border-slate-200">
                        <td className="py-1 px-1 font-bold text-slate-900">Vérvételi / Kezelési díj</td>
                        <td className="py-1 px-1 text-slate-500">Egyéb</td>
                        <td className="py-1 px-1 text-slate-600 text-right">-</td>
                        <td className="py-1 px-1 font-bold text-slate-900 text-right">3 000 Ft</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end border-t border-emerald-600 pt-3">
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Fizetendő végösszeg</p>
                  <p className="text-2xl font-extrabold text-emerald-700">{formattedTotal}</p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between items-end text-[10px] text-slate-500 border-t border-slate-200 pt-4">
                 <span>Kiállította: <b className="text-slate-700">{getDisplayName()}</b></span>
                 <span className="text-right">A fenti árak tájékoztató jellegűek. Az ajánlat a kiállítás napjától számított 30 napig érvényes.</span>
              </div>
            </div>
          )}

          {/* INTERAKTÍV FELÜLET (NEM NYOMTATÁSKOR) */}
          {!printingLabQuote && (
            <div className="flex flex-col lg:flex-row gap-6 items-start flex-1 min-h-0 w-full">
              
              {/* BAL OSZLOP: Vizsgálatok listája */}
              <div className="w-full lg:w-2/3 bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col min-h-0 h-full">
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ListPlusIcon /> Vizsgálatok kiválasztása</h2>
                  
                  <div className="relative w-64 group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors"><SearchIcon size={16} /></div>
                    <input 
                      type="text" 
                      placeholder="Keresés a vizsgálatok között..." 
                      value={labSearchTerm}
                      onChange={(e) => setLabSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 py-2 pl-9 pr-4 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 font-semibold text-slate-800 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-3 space-y-4">
                  {LAB_DATABASE.map(cat => {
                    const filteredItems = cat.items.filter(i => i.name.toLowerCase().includes(labSearchTerm.toLowerCase()));
                    if (filteredItems.length === 0) return null;

                    return (
                      <div key={cat.category} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                          <h3 className="font-extrabold text-slate-800 text-sm">{cat.category}</h3>
                          <span className="text-xs font-bold text-slate-400">{filteredItems.length} vizsgálat</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                          {filteredItems.map(item => {
                            const isSelected = selectedLabTests.includes(item.id);
                            return (
                              <label key={item.id} className={`flex items-start gap-3 p-3 border-b border-r border-slate-50 cursor-pointer transition-all hover:bg-slate-50 ${isSelected ? 'bg-emerald-50/50' : ''}`}>
                                <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                                  <input type="checkbox" className="sr-only" checked={isSelected} onChange={() => toggleLabTest(item.id)} />
                                  <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white text-transparent'}`}>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm font-bold leading-tight truncate ${isSelected ? 'text-emerald-900' : 'text-slate-700'}`} title={item.name}>{item.name}</p>
                                  <div className="flex gap-2 mt-1">
                                    <span className="text-[9px] font-extrabold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-100 shadow-sm">{item.price === 0 ? "Nincs ár" : `${item.price.toLocaleString('hu-HU')} Ft`}</span>
                                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 truncate"><HistoryIcon /> {item.time}</span>
                                  </div>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* JOBB OSZLOP: Kalkuláció és Nyomtatás */}
              <div className="w-full lg:w-1/3 bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full min-h-0">
                <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 shrink-0"><DocumentIcon /> Ajánlat összegzése</h2>
                
                <div className="mb-2 space-y-2 shrink-0">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Páciens neve (Opcionális)</label>
                    <input 
                      type="text" 
                      placeholder="Kovács János" 
                      value={labPatientName}
                      onChange={(e) => setLabPatientName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 text-sm font-semibold text-slate-800 transition-all outline-none shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">TAJ Szám</label>
                      <input 
                        type="text" 
                        placeholder="123 456 789" 
                        value={labPatientTaj}
                        onChange={(e) => setLabPatientTaj(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 text-sm font-semibold text-slate-800 transition-all outline-none shadow-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">Lakcím</label>
                      <input 
                        type="text" 
                        placeholder="1234 Budapest, Példa utca 1." 
                        value={labPatientAddress}
                        onChange={(e) => setLabPatientAddress(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 text-sm font-semibold text-slate-800 transition-all outline-none shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 mb-4 mt-2 flex flex-col min-h-0 flex-1">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 border-b border-slate-200 pb-1.5 shrink-0">Kiválasztott tételek ({selectedItems.length})</h3>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-1.5 min-h-0">
                    {selectedItems.length === 0 ? (
                      <p className="text-xs text-slate-400 font-medium italic text-center py-2">Nincs kiválasztott vizsgálat.</p>
                    ) : (
                      selectedItems.map(item => (
                        <div key={item.id} className="flex justify-between items-start gap-2">
                          <span className="text-xs font-bold text-slate-700 leading-tight">{item.name}</span>
                          <span className="text-xs font-extrabold text-slate-900 whitespace-nowrap">{item.price === 0 ? "-" : `${item.price.toLocaleString('hu-HU')} Ft`}</span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200 shrink-0">
                    <label className="flex items-center justify-between cursor-pointer group">
                      <div className="flex items-center gap-2">
                         <div className="relative flex items-center justify-center">
                           <input type="checkbox" className="sr-only" checked={includeBloodDrawFee} onChange={(e) => setIncludeBloodDrawFee(e.target.checked)} />
                           <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${includeBloodDrawFee ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white text-transparent'}`}>
                             <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                           </div>
                         </div>
                         <span className="text-[11px] font-bold text-slate-600 group-hover:text-slate-800 transition-colors">Vérvételi / Kezelési díj</span>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900">3 000 Ft</span>
                    </label>
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Végösszeg</span>
                    <span className="text-2xl font-extrabold text-emerald-600">{formattedTotal}</span>
                  </div>

                  <button 
                    onClick={handlePrintLabQuote} 
                    disabled={selectedItems.length === 0}
                    className="w-full py-3.5 rounded-xl font-bold shadow-md transition-all active:scale-95 flex justify-center items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <PrintIcon /> Árajánlat Nyomtatása (PDF)
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar { height: 5px; width: 5px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.03); border-radius: 10px; margin: 0 2px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.15); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0, 0, 0, 0.3); }
          
          @media print {
            @page { size: auto; margin: 0mm; } /* Ez távolítja el a böngésző fejléceit (dátum, cím, URL) */
            body, html { background: white !important; color: black !important; font-family: sans-serif; height: auto !important; overflow: visible !important; margin: 0 !important; padding: 0 !important; }
            .no-print { display: none !important; }
            
            .print-mode { background: white !important; min-height: auto !important; padding: 0 !important; }
            
            .printable-quote { padding: 1.5cm 1.5cm !important; width: 100% !important; max-width: none !important; box-sizing: border-box !important; }
            .printable-quote table { width: 100% !important; border-collapse: collapse !important; }
            .printable-quote th { border-bottom: 1px solid #ccc !important; padding: 2px 4px !important; }
            .printable-quote td { border-bottom: 1px solid #eee !important; padding: 2px 4px !important; }
            .print-bg-light { background-color: #f8fafc !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        `}} />
      </div>
    );
  }

  // --- NORMÁL ELŐJEGYZÉS NÉZET ---
  const filteredCategories = categories.filter(c => c.toLowerCase().includes(departmentSearch.toLowerCase()));

  let filteredAppointments = appointments;
  
  if (searchTerm.trim() !== "") {
    const term = searchTerm.toLowerCase();
    const termNoSpace = term.replace(/\s+/g, ''); 
    
    filteredAppointments = filteredAppointments.filter((app: any) => {
      const nameMatch = app.patient_name && app.patient_name.toLowerCase().includes(term);
      const tajMatch = app.taj_szam && app.taj_szam.replace(/\s+/g, '').includes(termNoSpace);
      const phoneMatch = app.phone_number && app.phone_number.replace(/\s+/g, '').includes(termNoSpace);
      return nameMatch || tajMatch || phoneMatch;
    });
  } else {
    filteredAppointments = filteredAppointments.filter((app: any) => app.department === activeTab);
  }

  if (!showDeleted) filteredAppointments = filteredAppointments.filter((app: any) => app.is_deleted !== true);
  
  const groupedByDate = filteredAppointments.reduce((acc: any, app: any) => {
    const d = app.appointment_date || "Dátum nélkül";
    if (!acc[d]) acc[d] = [];
    acc[d].push(app);
    return acc;
  }, {});
  const sortedDates = Object.keys(groupedByDate).sort();

  const freeSlotsSummary = sortedDates.map(date => {
    const dayAppointments = groupedByDate[date].filter((a: any) => !a.is_deleted);
    const bookedCount = dayAppointments.filter((a: any) => a.patient_name && a.patient_name.trim() !== "").length;
    const freeCount = dayAppointments.length - bookedCount;
    return { date, freeCount, total: dayAppointments.length };
  }).filter(day => day.total > 0);

  return (
    <div className={`min-h-screen font-sans pb-10 bg-cover bg-center bg-fixed relative ${printingDate ? 'bg-white print-mode' : ''}`} style={{ backgroundImage: printingDate ? 'none' : `url('${BACKGROUND_IMAGE_URL}')` }}>
      {customModalUI}
      {patientHistoryModalUI}
      {priceModalUI}
      {infoModalUI}
      {deptModalUI}
      {bugModalUI}
      {toastUI}
      {!printingDate && <div className="absolute inset-0 bg-slate-100/70 backdrop-blur-2xl z-0 pointer-events-none no-print"></div>}

      {/* --- FEJLÉC ÉS KERESŐ --- */}
      <div className="bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-white/50 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] relative no-print h-[73px]">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
             <img src="/logo.png" alt="Medical-Aqua" className="h-10 object-contain select-none pointer-events-none drop-shadow-sm" />
             <div className="hidden sm:block">
               <h1 className="text-xl font-bold tracking-tight text-slate-900">Medical-Aqua</h1>
               <p className="text-red-600 font-medium text-[11px] tracking-widest uppercase drop-shadow-sm">Előjegyzési Rendszer</p>
             </div>
          </div>
          
          <div className="flex-1 max-w-lg w-full relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors"><SearchIcon size={18} /></div>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Keresés név, TAJ vagy telefon... (Ctrl+K)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/80 border border-white/60 py-2 pl-10 pr-4 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 font-semibold text-slate-800 shadow-sm transition-all"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto justify-end">
            
            {/* --- LABOR KALKULÁTOR GOMB --- */}
            <button onClick={() => setShowLabCalculator(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer" title="Labor Árkalkulátor">
              <CalculatorIcon size={16} />
              <span className="hidden sm:inline">Labor kalkulátor</span>
            </button>

            {/* --- HIBABEJELENTŐ GOMB --- */}
            <button onClick={() => setIsBugModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-xs font-bold transition-all shadow-sm cursor-pointer" title="Hibabejelentés / Ötlet">
              <FeedbackIcon size={16} />
              <span className="hidden lg:inline">Hibabejelentő</span>
            </button>

            {/* --- ÉRTESÍTÉSEK --- */}
            <div className="relative" ref={notifRef}>
              <button onClick={toggleNotif} className="relative p-2 text-slate-500 hover:text-red-600 transition-colors ml-1 cursor-pointer">
                <BellIcon />
                {unreadCount > 0 && <span className="absolute top-0 right-0 translate-x-1 -translate-y-1 bg-red-500 text-white text-[10px] font-extrabold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">{unreadCount}</span>}
              </button>
              {isNotifOpen && (
                 <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                   <div className="p-3.5 border-b border-slate-100 bg-slate-50/80 font-bold text-sm text-slate-800 flex items-center justify-between">
                     <span>Értesítések</span>
                     {unreadCount > 0 && <span className="text-[10px] bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{unreadCount} új</span>}
                   </div>
                   <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                         <div className="p-6 text-center text-sm font-medium text-slate-400">Nincsenek még értesítések.</div>
                      ) : (
                         notifications.map(n => {
                           const isPriceMod = n.message.includes("módosította az árlistát:");
                           return (
                             <div 
                               key={n.id} 
                               onClick={() => isPriceMod ? handleNotificationClick(n.message) : null}
                               className={`p-3.5 border-b border-slate-50 transition-colors flex gap-3 items-start ${isPriceMod ? 'cursor-pointer hover:bg-slate-100' : 'hover:bg-slate-50'}`}
                               title={isPriceMod ? "Kattints a megtekintéshez" : ""}
                             >
                                <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-xl mt-0.5 shrink-0 shadow-sm"><TagIcon /></div>
                                <div className="flex-1">
                                  <p className="text-sm text-slate-800 font-medium leading-snug">{n.message}</p>
                                  <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">{formatDateTime(n.created_at)}</p>
                                </div>
                                {isPriceMod && <div className="mt-2 text-slate-400"><ChevronRightIcon /></div>}
                             </div>
                           );
                         })
                      )}
                   </div>
                 </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-slate-800 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/60 shadow-sm z-10 relative ml-1">
              <UserIcon /><span className="font-semibold text-sm hidden md:inline">{getDisplayName()}</span>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-600 transition-colors p-2 z-10 relative cursor-pointer" title="Kijelentkezés"><LogoutIcon /></button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-8 pt-8 relative z-10 min-h-[80vh]">
        
        {/* --- KONTROLL SÁV --- */}
        {!printingDate && searchTerm === "" && (
          <div className="relative z-30 bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm border border-white/60 p-6 mb-6 no-print">
            <div className="flex flex-col xl:flex-row gap-8 items-start xl:items-center justify-between">
              
              <div className="w-full xl:w-1/2 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <label className="block text-slate-500 font-semibold text-xs uppercase tracking-widest">Szakrendelés kiválasztása</label>
                    <button onClick={() => setIsDeptModalOpen(true)} className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer" title="Szakrendelések kezelése (Hozzáadás/Törlés)">
                      <SettingsIcon size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {activeTab && (
                      <button onClick={openPriceModal} className="text-xs font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer">
                        <TagIcon /> {activeTab} árak
                      </button>
                    )}
                    
                    <div className="relative w-full sm:w-40 group">
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-400"><SearchIcon size={14} /></div>
                      <input 
                        type="text" 
                        placeholder="Keresés..." 
                        value={departmentSearch} 
                        onChange={(e) => setDepartmentSearch(e.target.value)} 
                        className="w-full bg-white/90 border border-slate-200 py-1.5 pl-8 pr-3 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 font-semibold text-slate-700 transition-all shadow-sm" 
                      />
                    </div>
                  </div>
                </div>

                <div 
                  ref={scrollContainerRef}
                  onMouseDown={handleTabMouseDown}
                  onMouseLeave={handleTabMouseLeaveOrUp}
                  onMouseUp={handleTabMouseLeaveOrUp}
                  onMouseMove={handleTabMouseMove}
                  className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar scroll-smooth min-h-[46px] cursor-grab active:cursor-grabbing"
                >
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map(c => (
                      <button 
                        key={c} 
                        onClick={(e) => handleTabClick(c, e)} 
                        className={`whitespace-nowrap px-4 py-2 rounded-full font-semibold text-sm transition-all border select-none ${activeTab === c ? 'bg-red-600 border-red-600 text-white shadow-md' : 'bg-white/80 border-white text-slate-600 hover:bg-white hover:border-slate-200 shadow-sm'}`}
                      >
                        {c}
                      </button>
                    ))
                  ) : (
                    <span className="text-sm font-medium text-slate-400 italic py-2">Nincs megjeleníthető szakrendelés...</span>
                  )}
                </div>
                
                <label className="mt-3 flex items-center gap-3 cursor-pointer group w-max">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors duration-300 border ${showDeleted ? "bg-slate-800 border-slate-800" : "bg-slate-200 border-slate-300 group-hover:bg-slate-300"}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${showDeleted ? "translate-x-4" : "translate-x-0"}`}></div>
                  </div>
                  <span className={`font-semibold text-sm transition-colors duration-300 ${showDeleted ? "text-slate-800" : "text-slate-500 group-hover:text-slate-700"}`}>Törölt sorok mutatása</span>
                </label>
              </div>

              <div className="w-px h-24 bg-slate-200/60 hidden xl:block"></div>

              <div className="w-full xl:w-auto flex-1">
                 <div className="flex items-center gap-2.5 mb-4 text-slate-800 font-extrabold text-lg">
                    <div className="bg-red-100 text-red-600 p-1.5 rounded-lg shadow-sm"><ListPlusIcon /></div>
                    <span>Napi előjegyzési lista létrehozása</span>
                 </div>
                 
                 <div className="flex flex-col gap-3 w-full">
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="w-full sm:w-auto sm:flex-1 md:w-[220px] md:flex-none">
                        <div className="flex justify-between items-center mb-1.5">
                           <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Dátum</label>
                           <div className="flex gap-1">
                             <button onClick={() => setSelectedDate(getTodayDateStr())} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded transition-colors border border-slate-200 cursor-pointer">Ma</button>
                             <button onClick={() => setSelectedDate(getTomorrowDateStr())} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded transition-colors border border-slate-200 cursor-pointer">Holnap</button>
                           </div>
                        </div>
                        <ModernDatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
                      </div>

                      <div className="w-[calc(50%-0.375rem)] sm:w-20 md:w-24">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kezdés</label>
                        <input type="time" value={genStart} onChange={(e) => setGenStart(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" />
                      </div>
                      <div className="w-[calc(50%-0.375rem)] sm:w-20 md:w-24">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Befejezés</label>
                        <input type="time" value={genEnd} onChange={(e) => setGenEnd(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" />
                      </div>
                      <div className="w-full sm:w-16 md:w-20">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Perc</label>
                        <input type="number" value={genDuration} onChange={(e) => setGenDuration(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-end gap-3">
                      <div className="w-[calc(50%-0.375rem)] sm:w-28">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Szünet kezdete</label>
                        <input type="time" value={genBreakStart} onChange={(e) => setGenBreakStart(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" />
                      </div>
                      <div className="w-[calc(50%-0.375rem)] sm:w-28">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Szünet vége</label>
                        <input type="time" value={genBreakEnd} onChange={(e) => setGenBreakEnd(e.target.value)} className="w-full bg-white/80 border border-white/60 p-2.5 rounded-xl text-sm focus:ring-2 focus:ring-red-100 focus:border-red-500 outline-none font-semibold text-slate-800 transition-all shadow-sm" />
                      </div>
                      
                      <button onClick={generateDailySlots} className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-2.5 rounded-xl hover:from-red-700 hover:to-red-600 font-bold shadow-md shadow-red-500/30 transition-all sm:ml-auto active:scale-95 text-sm h-[42px] mt-2 sm:mt-0 cursor-pointer">
                        Lista Generálása
                      </button>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {!printingDate && searchTerm !== "" && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-2xl mb-6 shadow-sm flex items-center gap-3 no-print">
            <SearchIcon size={18} />
            <span className="font-bold">Keresési eredmények a következőre: "{searchTerm}"</span>
            <span className="ml-auto bg-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-extrabold">{filteredAppointments.length} találat</span>
          </div>
        )}

        {!printingDate && searchTerm === "" && freeSlotsSummary.length > 0 && (
          <div className="mb-8 no-print">
            <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold uppercase tracking-widest text-xs ml-1">
              <CalendarIcon size={16} /> <span>Naptár Áttekintés - Kattints a dátumra</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-3 custom-scrollbar scroll-smooth">
              {freeSlotsSummary.map((day) => (
                <button
                  key={day.date}
                  onClick={() => document.getElementById(`date-${day.date}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className={`flex-shrink-0 min-w-[130px] p-3 rounded-2xl border transition-all text-left group backdrop-blur-md cursor-pointer
                    ${day.freeCount > 0 ? 'bg-white/90 border-white shadow-sm hover:shadow-md hover:border-emerald-200' : 'bg-slate-100/80 border-white/50 opacity-80 hover:bg-white/90'}`}
                >
                  <div className="text-slate-800 font-extrabold text-sm mb-1">{formatShortDate(day.date)}</div>
                  <div className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-lg w-max transition-colors
                    ${day.freeCount > 0 ? 'bg-emerald-100 text-emerald-800 group-hover:bg-emerald-200' : 'bg-slate-200 text-slate-700'}`}>
                    {day.freeCount > 0 ? `${day.freeCount} szabad hely` : 'Megtelt'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {sortedDates.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-xl p-12 md:p-20 text-center rounded-3xl shadow-sm border border-white/60 flex flex-col items-center no-print">
            <div className="text-slate-300 mb-4"><CalendarIcon size={64} /></div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">{searchTerm ? "Nincs találat" : "Még nincsenek időpontok"}</h3>
            <p className="text-slate-600 text-sm font-medium">{searchTerm ? "Próbálkozz más névvel vagy TAJ számmal." : "Válassz dátumot a generátorban, és hozd létre a napot!"}</p>
          </div>
        ) : (
          sortedDates.map((date) => {
            if (printingDate && printingDate !== date) return null;

            const dayAppointments = groupedByDate[date].sort((a: any, b: any) => a.time_slot.localeCompare(b.time_slot));
            const activeSlots = dayAppointments.filter((a: any) => !a.is_deleted);
            const bookedCount = activeSlots.filter((a: any) => a.patient_name && a.patient_name.trim() !== "").length;
            const freeCount = activeSlots.length - bookedCount;
            
            // --- MINI DASHBOARD Számítások ---
            const percent = activeSlots.length > 0 ? Math.round((bookedCount / activeSlots.length) * 100) : 0;
            const deptPrices = allPrices.filter(p => p.department === (dayAppointments[0]?.department || activeTab));
            const dailyRevenue = getDailyRevenue(activeSlots, deptPrices);
            const formattedRevenue = dailyRevenue > 0 ? new Intl.NumberFormat('hu-HU', { style: 'currency', currency: 'HUF', maximumFractionDigits: 0 }).format(dailyRevenue) : "0 Ft";

            return (
              <div id={`date-${date}`} key={date} className={`mb-10 rounded-3xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] scroll-mt-[100px] print-container ${printingDate ? 'bg-white border-0 shadow-none' : 'overflow-hidden bg-white/90 backdrop-blur-xl border border-white/60'}`}>
                
                <div className={`p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 print-header ${printingDate ? 'border-b-2 border-black pb-2 mb-2 px-0' : 'bg-white/50 border-b border-slate-100'}`}>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3 text-slate-900">
                      <CalendarIcon size={20} />
                      <h2 className="text-xl font-bold">{date} {searchTerm !== "" && <span className="text-sm font-medium text-slate-500 ml-2">({dayAppointments[0].department})</span>}</h2>
                    </div>
                    
                    {!printingDate && (
                      <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl shadow-sm border border-slate-100">
                        <div className="flex flex-col gap-1 w-32 sm:w-40">
                          <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span>Telítettség</span>
                            <span className={percent === 100 ? "text-emerald-600" : ""}>{percent}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-1000 ${percent === 100 ? 'bg-emerald-500' : percent > 60 ? 'bg-amber-400' : 'bg-blue-400'}`} style={{width: `${percent}%`}}></div>
                          </div>
                        </div>
                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Várható bevétel</span>
                          <span className="text-sm font-extrabold text-slate-800">{formattedRevenue}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center flex-wrap gap-2">
                    <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200">Összes: {activeSlots.length}</span>
                    <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-200">Szabad: {freeCount}</span>
                    <span className="bg-red-100 text-red-800 px-3 py-1.5 rounded-lg text-xs font-bold border border-red-200">Foglalt: {bookedCount}</span>
                    
                    {!printingDate && (
                      <>
                        <div className="w-px h-6 bg-slate-300 mx-1 hidden md:block"></div>
                        <button onClick={() => clearEmptySlots(date)} className="bg-white hover:bg-amber-50 text-slate-700 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border border-slate-200 hover:border-amber-300 hover:text-amber-700 cursor-pointer">
                          <EraserIcon /> <span className="hidden sm:inline">Üres sorok takarítása</span><span className="sm:hidden">Takarít</span>
                        </button>
                        
                        <button onClick={() => exportToCSV(date)} className="bg-white hover:bg-blue-50 text-slate-700 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm border border-slate-200 hover:border-blue-300 hover:text-blue-700 cursor-pointer">
                          <DownloadIcon /> <span className="hidden sm:inline">Excel Export</span><span className="sm:hidden">Excel</span>
                        </button>
                        
                        <button onClick={() => handlePrintDay(date)} className="bg-slate-800 text-white px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-black transition-all flex items-center gap-1.5 shadow-sm border border-slate-800 cursor-pointer">
                          <PrintIcon /> <span className="hidden sm:inline">Nyomtatás</span>
                        </button>
                        <button onClick={() => deleteEntireDay(date)} className="bg-red-50 text-red-600 px-2 sm:px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white transition-all flex items-center gap-1.5 shadow-sm border border-red-200 hover:border-red-600 cursor-pointer">
                          <TrashIcon /> <span className="hidden sm:inline">Nap törlése</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className={`overflow-x-auto custom-scrollbar ${printingDate ? 'overflow-visible' : ''}`}>
                  <table className="min-w-full text-left border-collapse print-table">
                    <thead>
                      <tr className="border-b border-slate-200/60 print-border">
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap w-min">Időpont</th>
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest min-w-[200px]">Páciens neve</th>
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap w-min">TAJ szám</th>
                        
                        {!printingDate && <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap w-min">Telefon</th>}
                        {!printingDate && <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest whitespace-nowrap w-min">Státusz</th>}
                        
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest w-auto">Vizsgálat</th>
                        <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest w-auto">Megjegyzés</th>
                        {!printingDate && <th className="px-4 py-4 font-bold text-slate-500 text-[10px] uppercase tracking-widest text-center no-print whitespace-nowrap w-min">Művelet</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50 relative z-0">
                      {dayAppointments.map((app: any) => {
                        const isDel = app.is_deleted === true;
                        const isBooked = app.patient_name && app.patient_name.trim() !== "";
                        
                        const canShowHistory = isBooked && !isDel && app.taj_szam && app.taj_szam.trim() !== "";
                        
                        if (printingDate && isDel) return null; 

                        // Vizuális Státusz Színek a sor szélére
                        const statusBorder = printingDate || isDel || !isBooked ? "" :
                          app.status === "Megérkezett" ? "border-l-4 border-l-amber-400" :
                          app.status === "Vizsgálaton" ? "border-l-4 border-l-blue-400" :
                          app.status === "Befejezve" ? "border-l-4 border-l-emerald-500" :
                          app.status === "Nem jelent meg" ? "border-l-4 border-l-slate-800" :
                          "border-l-4 border-l-transparent";

                        const rowStyle = isDel 
                          ? "bg-slate-100/40 opacity-70 print-hidden" 
                          : isBooked 
                            ? `bg-red-50/70 hover:bg-red-100/60 ${statusBorder}`
                            : "bg-emerald-50/70 hover:bg-emerald-100/60 border-l-4 border-l-transparent";

                        return (
                          <tr key={app.id} className={`transition-colors group relative ${printingDate ? '' : rowStyle}`}>
                            
                            <td className="px-4 py-3 align-middle whitespace-nowrap">
                              <div className="flex flex-col gap-1 w-max">
                                <span className={`font-bold text-base ${printingDate ? 'text-black' : isDel ? "text-slate-500 line-through" : isBooked ? "text-red-950" : "text-emerald-950"}`}>{app.time_slot}</span>
                                {!printingDate && !isDel && <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded text-center w-max ${isBooked ? "bg-red-200/60 text-red-900" : "bg-emerald-200/60 text-emerald-900"}`}>{isBooked ? "Foglalt" : "Szabad"}</span>}
                                {!printingDate && isDel && <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded text-center w-max bg-slate-200 text-slate-700">Törölt</span>}
                              </div>
                            </td>
                            
                            <td className={`px-4 py-3 align-middle ${printingDate ? 'text-black font-bold text-sm border-l border-gray-300' : ''}`}>
                              {printingDate ? app.patient_name : (
                                <div className="relative">
                                  <EditableCell disabled={isDel} highlight={isBooked} formatter={formatName} value={app.patient_name} onSave={(val) => updateAppointment(app.id, "patient_name", val)} searchTerm={searchTerm} />
                                  {canShowHistory && (
                                    <button 
                                      onClick={() => openPatientHistory(app.patient_name, app.taj_szam)} 
                                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-white text-slate-500 hover:text-red-600 shadow-sm rounded-lg border border-slate-200 opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer" 
                                      title="Előzmények / Karton"
                                    >
                                      <HistoryIcon />
                                    </button>
                                  )}
                                </div>
                              )}
                            </td>
                            
                            <td className={`px-4 py-3 align-middle whitespace-nowrap ${printingDate ? 'text-black font-mono text-sm border-l border-gray-300' : ''}`}>
                              {printingDate ? formatTAJ(app.taj_szam) : <EditableCell disabled={isDel} highlight={isBooked} formatter={formatTAJ} value={app.taj_szam} onSave={(val) => updateAppointment(app.id, "taj_szam", val)} searchTerm={searchTerm} />}
                            </td>
                            
                            {!printingDate && (
                              <>
                                <td className="px-4 py-3 align-middle whitespace-nowrap"><EditableCell disabled={isDel} highlight={isBooked} formatter={formatPhone} value={app.phone_number} onSave={(val) => updateAppointment(app.id, "phone_number", val)} searchTerm={searchTerm} /></td>
                                
                                <td className="px-4 py-3 align-middle whitespace-nowrap"><ModernStatusSelect disabled={isDel || !isBooked} value={app.status} onChange={(val) => updateAppointment(app.id, "status", val)} /></td>
                              </>
                            )}
                            
                            <td className={`px-4 py-3 align-middle ${printingDate ? 'text-black text-sm border-l border-gray-300' : ''}`}>
                              {printingDate ? app.examination_type : <EditableCell disabled={isDel} highlight={isBooked} value={app.examination_type} onSave={(val) => updateAppointment(app.id, "examination_type", val)} searchTerm={searchTerm} />}
                            </td>
                            <td className={`px-4 py-3 align-middle ${printingDate ? 'text-black text-sm border-l border-gray-300' : ''}`}>
                              {printingDate ? app.notes : <EditableCell disabled={isDel} highlight={isBooked} value={app.notes} onSave={(val) => updateAppointment(app.id, "notes", val)} searchTerm={searchTerm} />}
                            </td>
                            
                            {!printingDate && (
                              <td className="px-4 py-3 align-middle text-center no-print whitespace-nowrap">
                                <div className="flex items-center justify-center gap-1">
                                  {isDel ? (
                                    <button onClick={() => restoreAppointment(app.id)} className="bg-white/80 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white shadow-sm border border-slate-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"><RestoreIcon /> Visszaállít</button>
                                  ) : (
                                    <button onClick={() => confirmDeleteApp(app.id)} className="text-black/30 hover:text-red-600 hover:bg-red-50 shadow-sm p-2 rounded-lg transition-all cursor-pointer" title="Törlés"><TrashIcon /></button>
                                  )}
                                  
                                  <button onClick={() => openAppInfoModal(app)} className="text-blue-400 hover:text-blue-600 hover:bg-blue-50 shadow-sm p-2 rounded-lg transition-all cursor-pointer" title="Módosítási infók">
                                    <InfoIcon />
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:hidden no-print">
                    {dayAppointments.map((app: any) => {
                      const isDel = app.is_deleted === true;
                      const isBooked = app.patient_name && app.patient_name.trim() !== "";
                      const canShowHistory = isBooked && !isDel && app.taj_szam && app.taj_szam.trim() !== "";
                      
                      const statusBorder = isDel || !isBooked ? "" :
                          app.status === "Megérkezett" ? "border-l-4 border-l-amber-400" :
                          app.status === "Vizsgálaton" ? "border-l-4 border-l-blue-400" :
                          app.status === "Befejezve" ? "border-l-4 border-l-emerald-500" :
                          app.status === "Nem jelent meg" ? "border-l-4 border-l-slate-800" :
                          "border-l-4 border-l-transparent";

                      const cardStyle = isDel 
                        ? "bg-slate-100/50 border-slate-200/50 opacity-80" 
                        : isBooked 
                          ? `bg-red-50/90 border-white shadow-sm ${statusBorder}` 
                          : "bg-emerald-50/90 border-white shadow-sm border-l-4 border-l-transparent";

                      return (
                        <div key={`mob-${app.id}`} className={`rounded-2xl p-5 border transition-all ${cardStyle}`}>
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-col gap-1">
                               <span className={`font-bold text-xl ${isDel ? "text-slate-500 line-through" : isBooked ? "text-red-950" : "text-emerald-950"}`}>{app.time_slot}</span>
                               <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded text-center w-max ${isDel ? "bg-slate-200 text-slate-700" : isBooked ? "bg-red-200/60 text-red-900" : "bg-emerald-200/60 text-emerald-900"}`}>
                                 {isDel ? "Törölt" : isBooked ? "Foglalt" : "Szabad"}
                               </span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <button onClick={() => openAppInfoModal(app)} className="text-blue-400 hover:text-blue-600 hover:bg-white/80 shadow-sm p-2 rounded-lg cursor-pointer" title="Infó"><InfoIcon /></button>
                              
                              {isDel ? (
                                <button onClick={() => restoreAppointment(app.id)} className="bg-white/80 text-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white shadow-sm border border-slate-200 flex items-center gap-1.5 cursor-pointer"><RestoreIcon /> Vissza</button>
                              ) : (
                                <button onClick={() => confirmDeleteApp(app.id)} className="text-black/40 hover:text-red-600 hover:bg-white/80 shadow-sm p-2 rounded-lg cursor-pointer"><TrashIcon /></button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-3">
                            <div className="bg-white/70 p-2.5 rounded-xl border border-white/50">
                              <div className="flex justify-between items-center mb-1 relative z-10">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Páciens neve</span>
                                <div className="flex items-center gap-2">
                                  {canShowHistory && (
                                    <button onClick={() => openPatientHistory(app.patient_name, app.taj_szam)} className="p-1.5 bg-white text-slate-600 shadow-sm rounded-lg border border-slate-200 cursor-pointer">
                                      <HistoryIcon />
                                    </button>
                                  )}
                                  <div className="w-[130px]"><ModernStatusSelect disabled={isDel || !isBooked} value={app.status} onChange={(val) => updateAppointment(app.id, "status", val)} /></div>
                                </div>
                              </div>
                              <EditableCell disabled={isDel} highlight={isBooked} formatter={formatName} value={app.patient_name} onSave={(val) => updateAppointment(app.id, "patient_name", val)} searchTerm={searchTerm} />
                            </div>
                            <div className="grid grid-cols-2 gap-3 relative z-0">
                              <div className="bg-white/70 p-2.5 rounded-xl border border-white/50">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">TAJ szám</span>
                                <EditableCell disabled={isDel} highlight={isBooked} formatter={formatTAJ} value={app.taj_szam} onSave={(val) => updateAppointment(app.id, "taj_szam", val)} searchTerm={searchTerm} />
                              </div>
                              <div className="bg-white/70 p-2.5 rounded-xl border border-white/50">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Telefon</span>
                                <EditableCell disabled={isDel} highlight={isBooked} formatter={formatPhone} value={app.phone_number} onSave={(val) => updateAppointment(app.id, "phone_number", val)} searchTerm={searchTerm} />
                              </div>
                            </div>
                            <div className="bg-white/70 p-2.5 rounded-xl border border-white/50 relative z-0">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Vizsgálat & Megjegyzés</span>
                              <EditableCell disabled={isDel} highlight={isBooked} value={app.examination_type} onSave={(val) => updateAppointment(app.id, "examination_type", val)} searchTerm={searchTerm} />
                              <div className="mt-1 border-t border-black/5 pt-1">
                                <EditableCell disabled={isDel} highlight={isBooked} value={app.notes} onSave={(val) => updateAppointment(app.id, "notes", val)} searchTerm={searchTerm} />
                              </div>
                            </div>
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

        {!printingDate && searchTerm === "" && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-end gap-3 bg-white/90 backdrop-blur-xl p-4 rounded-3xl shadow-sm border border-white/60 w-full sm:w-max sm:ml-auto no-print">
            <input type="text" placeholder="pl. 17:00 - 17:15" value={newTimeSlot} onChange={(e) => setNewTimeSlot(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSingleAppointment()} className="w-full sm:w-40 bg-white/80 border border-white p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 text-sm font-semibold text-slate-900 transition-all text-center sm:text-left shadow-sm" />
            <button onClick={addSingleAppointment} className="w-full sm:w-auto bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-black font-semibold shadow-md transition-all active:scale-95 text-sm flex items-center justify-center gap-1.5 cursor-pointer"><PlusIcon /> Új időpont</button>
          </div>
        )}
      </div>

      {/* --- LÁBLÉC (COPYRIGHT) --- */}
      {!printingDate && (
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-6 text-right text-slate-600/70 text-xs font-bold no-print relative z-10">
          &copy; 2026 Created by Zozi
        </div>
      )}

      {/* --- SCROLL TO TOP GOMB --- */}
      {!printingDate && showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 md:left-auto md:right-6 z-50 bg-slate-900/90 backdrop-blur-md text-white p-3.5 rounded-full shadow-2xl hover:bg-black transition-all hover:scale-110 active:scale-95 animate-in fade-in slide-in-from-bottom-6 border border-slate-700 cursor-pointer"
          title="Ugrás az oldal tetejére"
        >
          <ArrowUpIcon />
        </button>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.4); border-radius: 10px; margin: 0 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(203, 213, 225, 0.8); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(148, 163, 184, 1); }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @media print {
          @page { size: auto; margin: 0mm; } /* Ez távolítja el a böngésző fejléceit (dátum, cím, URL) */
          body, html { background: white !important; color: black !important; font-family: sans-serif; height: auto !important; overflow: visible !important; margin: 0 !important; padding: 0 !important; }
          .no-print { display: none !important; }
          
          .print-mode { background: white !important; min-height: auto !important; padding: 0 !important; display: block !important; position: static !important; overflow: visible !important; }
          
          .print-container { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; page-break-after: auto; overflow: visible !important; }
          .overflow-visible { overflow: visible !important; }
          
          .print-table { width: 100% !important; border-collapse: collapse !important; margin-top: 10px !important; table-layout: fixed; page-break-inside: auto; }
          .print-table thead { display: table-header-group; position: static !important; }
          .print-table tr { page-break-inside: avoid; page-break-after: auto; }
          
          .print-table th { border: 1px solid #333 !important; padding: 6px !important; color: black !important; font-size: 11px !important; font-weight: bold !important; background: #f3f4f6 !important; -webkit-print-color-adjust: exact; text-align: left; }
          .print-table td { border: 1px solid #666 !important; padding: 4px 6px !important; color: black !important; font-size: 11px !important; line-height: 1.2 !important; word-break: break-word; }
          
          .print-header { padding: 0 0 5px 0 !important; margin-bottom: 5px !important; border-bottom: 2px solid black !important; display: flex !important; justify-content: space-between !important; }
          .print-header h2 { font-size: 18px !important; margin: 0 !important; font-weight: bold !important; }
          .print-header span { border: none !important; background: none !important; padding: 0 !important; margin-right: 15px !important; color: black !important; font-size: 12px !important; font-weight: bold !important; }
          
          .print-hidden { display: none !important; }
        }
      `}} />
    </div>
  );
}