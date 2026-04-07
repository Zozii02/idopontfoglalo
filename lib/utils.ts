export const formatTAJ = (val: string) => {
  if (!val) return "";
  const cleaned = val.replace(/\D/g, '').substring(0, 9);
  return cleaned.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
};

export const formatPhone = (val: string) => {
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

export const formatName = (val: string) => {
  if (!val) return "";
  return val.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

export const getTodayDateStr = () => new Date().toISOString().split('T')[0];
export const getTomorrowDateStr = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
};

export const formatDateTime = (isoString: string) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleString("hu-HU", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
};

export const formatShortDate = (d: string) => {
  const parts = d.split('-');
  return parts.length === 3 ? `${parts[1]}. ${parts[2]}.` : d;
};

export const timeToMins = (t: string) => { 
  const [h, m] = t.split(':'); 
  return parseInt(h) * 60 + parseInt(m); 
};

export const minsToTime = (m: number) => { 
  const h = Math.floor(m / 60).toString().padStart(2, '0'); 
  const mins = (m % 60).toString().padStart(2, '0'); 
  return `${h}:${mins}`; 
};

export const getDailyRevenue = (dayApps: any[], deptPrices: any[]) => {
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