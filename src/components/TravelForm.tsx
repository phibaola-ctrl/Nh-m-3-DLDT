import React, { useState } from "react";
import { Search, MapPin, DollarSign, Calendar, Heart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TravelFormProps {
  onSubmit: (data: {
    location: string;
    budget: number;
    days: number;
    preferences: string[];
  }) => void;
  isLoading: boolean;
}

const PREFERENCES = [
  { id: "food", label: "Ẩm thực", icon: "🍴" },
  { id: "checkin", label: "Check-in", icon: "📸" },
  { id: "exploration", label: "Khám phá", icon: "🧭" },
  { id: "relaxation", label: "Nghỉ dưỡng", icon: "💆" },
];

export default function TravelForm({ onSubmit, isLoading }: TravelFormProps) {
  const [location, setLocation] = useState("Đà Lạt");
  const [budget, setBudget] = useState(5000000);
  const [days, setDays] = useState("3");
  const [preferences, setPreferences] = useState<string[]>(["food", "checkin"]);

  const formatVNCurrency = (val: number | string) => {
    if (!val && val !== 0) return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseCurrencyValue = (val: string) => {
    const raw = val.replace(/\./g, "");
    const numeric = parseInt(raw, 10);
    return isNaN(numeric) ? 0 : numeric;
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\./g, "");
    // Prevent non-numeric characters and leading zeros
    if (value !== "" && !/^\d+$/.test(value)) return;
    
    // Remove leading zeros
    const cleanValue = value.replace(/^0+/, "");
    const numericValue = cleanValue === "" ? 0 : parseInt(cleanValue, 10);
    
    setBudget(numericValue);
  };

  const handlePreferenceToggle = (id: string) => {
    setPreferences((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*$/.test(value)) {
      setDays(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;
    const numDays = parseInt(days, 10);
    if (isNaN(numDays) || numDays <= 0) return;
    onSubmit({ location, budget, days: numDays, preferences });
  };

  const labelClass = "text-[10px] uppercase tracking-widest font-bold text-zinc-400 block mb-1.5 ml-1";
  const inputClass = "w-full px-5 py-4 bg-white border border-cream-border rounded-2xl text-sm focus:ring-4 focus:ring-sage/5 focus:border-sage outline-none transition-all placeholder:text-zinc-300 text-zinc-800";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/40 border border-cream-border rounded-[2.5rem] p-8 md:p-12 w-full max-w-2xl mx-auto shadow-sm"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-1">
          <label className={labelClass}>Điểm đến</label>
          <div className="relative">
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ví dụ: Đà Nẵng, Phú Quốc, Sapa..."
              className={inputClass}
            />
            <MapPin className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClass}>Ngân sách (VND)</label>
            <div className="relative">
              <input
                type="text"
                required
                value={formatVNCurrency(budget)}
                onChange={handleBudgetChange}
                className={inputClass}
              />
              <DollarSign className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Số ngày</label>
            <div className="relative">
              <input
                type="text"
                required
                value={days}
                onChange={handleDaysChange}
                placeholder="Nhập số ngày"
                className={inputClass}
              />
              <Calendar className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className={labelClass}>Sở thích</label>
          <div className="flex flex-wrap gap-2">
            {PREFERENCES.map((pref) => (
              <button
                key={pref.id}
                type="button"
                onClick={() => handlePreferenceToggle(pref.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-xs font-semibold transition-all ${
                  preferences.includes(pref.id)
                    ? "bg-sage text-white border-sage shadow-md shadow-sage/10"
                    : "bg-white border-cream-border text-zinc-500 hover:border-sage/30"
                }`}
              >
                <span>{pref.icon}</span>
                <span>{pref.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-5 bg-terracotta text-white rounded-[2rem] font-bold shadow-xl shadow-terracotta/20 hover:scale-[0.99] active:scale-[0.97] disabled:scale-100 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 text-lg overflow-hidden relative"
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-3"
              >
                <Loader2 className="animate-spin" size={20} />
                <span className="tracking-tight">Đang chuẩn bị hành trình...</span>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex items-center gap-3"
              >
                <Search size={22} className="text-white/80" />
                <span>Khởi tạo hành trình</span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </form>
    </motion.div>
  );
}
