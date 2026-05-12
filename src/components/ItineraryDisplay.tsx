import React, { useState, useRef, useEffect } from "react";
import { TripPlan } from "../lib/gemini";
import { motion, AnimatePresence } from "motion/react";
import { Coffee, Sun, Moon, ArrowLeft, Download, Share2, Sparkles, Loader2, Wallet, MapPin, Calendar, Edit3, Trash2, Plus, Check, Save, Search, Ticket } from "lucide-react";
import { jsPDF } from "jspdf";
import * as htmlToImage from 'html-to-image';

interface ItineraryDisplayProps {
  plan: TripPlan;
  onBack: () => void;
  location: string;
}

export default function ItineraryDisplay({ plan: initialPlan, onBack, location }: ItineraryDisplayProps) {
  const [localPlan, setLocalPlan] = useState<TripPlan>(initialPlan);
  const [isEditing, setIsEditing] = useState(false);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    guests: "2",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsBookingModalOpen(false);
        setBookingForm({ name: "", email: "", phone: "", guests: "2", notes: "" });
      }, 2000);
    }, 1500);
  };

  const handleSearchSimilarTour = () => {
    if (!location) return;
    
    const days = localPlan.itinerary.length;
    const query = days 
      ? `${location} ${days} ngày tour du lịch`
      : `${location} tour du lịch`;
      
    const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(url, "_blank");
  };


  // Sync with initialPlan if it changes (e.g. new generation)
  useEffect(() => {
    setLocalPlan(initialPlan);
  }, [initialPlan]);
  
  const metaLabel = "text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1";

  const currentDay = localPlan.itinerary[activeDayIdx];

  const handleUpdateActivity = (dayIdx: number, time: 'morning' | 'afternoon' | 'evening', value: string) => {
    const updatedItinerary = [...localPlan.itinerary];
    updatedItinerary[dayIdx].activities[time] = value;
    setLocalPlan({ ...localPlan, itinerary: updatedItinerary });
  };

  const handleAddDay = () => {
    const newDayNum = localPlan.itinerary.length + 1;
    const newDay = {
      day: newDayNum,
      theme: "Ngày mới",
      activities: {
        morning: "Hoạt động buổi sáng mới",
        afternoon: "Hoạt động buổi chiều mới",
        evening: "Hoạt động buổi tối mới"
      }
    };
    setLocalPlan({ ...localPlan, itinerary: [...localPlan.itinerary, newDay] });
    setActiveDayIdx(localPlan.itinerary.length);
  };

  const handleDeleteDay = (idx: number) => {
    if (localPlan.itinerary.length <= 1) return;
    const updatedItinerary = localPlan.itinerary
      .filter((_, i) => i !== idx)
      .map((day, i) => ({ ...day, day: i + 1 }));
    setLocalPlan({ ...localPlan, itinerary: updatedItinerary });
    if (activeDayIdx >= updatedItinerary.length) {
      setActiveDayIdx(updatedItinerary.length - 1);
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current) return;
    
    setIsExporting(true);
    try {
      const element = pdfRef.current;
      
      const dataUrl = await htmlToImage.toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#F7F5F2",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [800, element.offsetHeight]
      });

      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
      pdf.save(`hanh-trinh-${localPlan.itinerary[0].day}-ngay.pdf`);
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: "Hành trình du lịch AI của tôi",
      text: `Xem lịch trình du lịch ${localPlan.itinerary.length} ngày tuyệt vời của tôi tại đây!`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopySuccess(true);
        setTimeout(() => setShowCopySuccess(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-12 pb-20"
    >
      {/* Hidden PDF Template Source */}
      <div className="absolute left-[-9999px] top-0">
        <div 
          ref={pdfRef} 
          className="w-[800px] p-16 font-sans"
          style={{ backgroundColor: '#F7F5F2' }}
        >
          <div className="mb-12 pb-12" style={{ borderBottom: '1px solid #e4e4e7' }}>
            <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: '#18181b' }}>
              Hành trình khám phá <span className="italic" style={{ color: '#5A6E5A' }}>của bạn</span>
            </h1>
            <div className="grid grid-cols-2 gap-8 mt-10">
               <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#a1a1aa' }}>Thông tin chuyến đi</p>
                  <p className="text-sm" style={{ color: '#52525b' }}>Thời gian: {localPlan.itinerary.length} ngày</p>
                  <p className="text-sm" style={{ color: '#52525b' }}>Chi phí dự kiến: {localPlan.estimated_cost}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#a1a1aa' }}>Gợi ý khách sạn</p>
                  <p className="text-sm italic" style={{ color: '#52525b' }}>{localPlan.hotel_suggestion}</p>
               </div>
            </div>
          </div>

          <div className="space-y-16">
            {localPlan.itinerary.map((day) => (
              <div key={day.day} className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 text-white rounded-full flex items-center justify-center font-bold text-xl" style={{ backgroundColor: '#5A6E5A' }}>
                    {day.day}
                  </div>
                  <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: '#27272a' }}>Ngày {day.day}</h2>
                </div>

                <div className="grid grid-cols-3 gap-8">
                  {[
                    { label: "SÁNG 🌅", content: day.activities.morning },
                    { label: "CHIỀU ☀️", content: day.activities.afternoon },
                    { label: "TỐI 🌙", content: day.activities.evening }
                  ].map((slot, i) => (
                    <div key={i} className="space-y-3 bg-white p-6 rounded-2xl shadow-sm" style={{ border: '1px solid #f4f4f5' }}>
                      <p className="text-[9px] font-black tracking-widest" style={{ color: '#5A6E5A' }}>{slot.label}</p>
                      <h4 className="text-sm font-bold leading-snug" style={{ color: '#18181b' }}>{slot.content.split('.')[0]}</h4>
                      <p className="text-[11px] leading-relaxed" style={{ color: '#71717a' }}>{slot.content.split('.').slice(1).join('.')}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-10 flex justify-between items-center opacity-50" style={{ borderTop: '1px solid #e4e4e7' }}>
             <p className="text-[10px] font-bold" style={{ color: '#71717a' }}>© 2026 AI Travel Planner</p>
             <p className="text-[10px] italic" style={{ color: '#71717a' }}>Kiến tạo mọi hành trình cùng AI</p>
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-zinc-400 hover:text-sage transition-colors group mb-6 text-sm font-semibold"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Quay lại
          </button>
          <div className="max-w-2xl">
            <h1 className="serif text-4xl md:text-5xl text-zinc-900 mb-4 leading-tight">
              Hành trình tại <span className="italic text-sage">{location}</span>
            </h1>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-lg">
              Một chuyến đi được thiết kế riêng nhằm mang lại những trải nghiệm chân thực và đáng nhớ nhất tại {location}.
            </p>
          </div>
        </div>
      </div>

      {/* Trip Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-cream-border p-6 rounded-3xl shadow-sm text-center flex flex-col items-center justify-center"
        >
          <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
             <MapPin className="text-zinc-500" size={20} />
          </div>
          <p className={metaLabel}>Địa điểm</p>
          <p className="serif text-xl font-bold text-zinc-900">{location}</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-cream-border p-6 rounded-3xl shadow-sm text-center flex flex-col items-center justify-center"
        >
          <div className="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center mb-3">
             <Calendar className="text-zinc-500" size={20} />
          </div>
          <p className={metaLabel}>Thời gian</p>
          <p className="serif text-xl font-bold text-zinc-900">{localPlan.itinerary.length} Ngày</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-cream-border p-6 rounded-3xl shadow-sm text-center flex flex-col items-center justify-center"
        >
          <div className="w-10 h-10 bg-sage/10 rounded-full flex items-center justify-center mb-3">
            <Wallet className="text-sage" size={20} />
          </div>
          <p className={metaLabel}>Chi phí dự kiến</p>
          <p className="serif text-xl font-bold text-sage">{localPlan.estimated_cost}</p>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl p-8 border border-cream-border shadow-sm">
          <p className={metaLabel}>Khách sạn gợi ý</p>
          {isEditing ? (
            <textarea
              value={localPlan.hotel_suggestion}
              onChange={(e) => setLocalPlan({ ...localPlan, hotel_suggestion: e.target.value })}
              className="w-full text-zinc-600 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-sage/20 outline-none h-24"
            />
          ) : (
            <p className="text-zinc-600 italic">"{localPlan.hotel_suggestion}"</p>
          )}
        </div>
        <div className="bg-white rounded-3xl p-8 border border-cream-border shadow-sm flex flex-col h-full max-h-[320px]">
          <p className={metaLabel}>Ẩm thực & Mẹo địa phương</p>
          <div className="overflow-y-auto pr-2 no-scrollbar space-y-6">
            <div className="flex flex-wrap gap-2 mt-2">
              {localPlan.food_suggestions.map((food, i) => (
                <span key={i} className="px-3 py-1.5 bg-sage/5 text-sage text-[10px] font-bold uppercase tracking-wider rounded-full border border-sage/10">
                  {food}
                </span>
              ))}
            </div>
            
            <div className="space-y-3 border-t border-cream-border pt-4">
              {localPlan.tips.map((tip, i) => (
                <div key={i} className="flex gap-3 items-start group">
                  <div className="w-1.5 h-1.5 rounded-full bg-terracotta mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                  <p className="text-xs text-zinc-500 leading-relaxed italic group-hover:text-zinc-700 transition-colors">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Action Section */}
      <div className="flex justify-center py-4">
        <button 
          onClick={() => setIsBookingModalOpen(true)}
          className="flex items-center gap-3 px-10 py-5 bg-terracotta text-white rounded-full font-bold shadow-xl hover:scale-105 active:scale-95 transition-all text-lg group"
        >
          <Ticket size={24} className="group-hover:rotate-12 transition-transform" />
          Đặt tour ngay bây giờ
        </button>
      </div>

      {/* Interactive Itinerary Navigation */}
      <div className="space-y-8">
        <div className="flex flex-col items-center">
             <div className="flex bg-white/50 p-1.5 rounded-full border border-cream-border mb-10 overflow-x-auto no-scrollbar max-w-full items-center">
                {localPlan.itinerary.map((day, idx) => (
                    <div key={day.day} className="flex items-center">
                      <button
                          onClick={() => setActiveDayIdx(idx)}
                          className={`relative px-8 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                              activeDayIdx === idx ? "text-white" : "text-zinc-400 hover:text-zinc-600"
                          }`}
                      >
                          {activeDayIdx === idx && (
                              <motion.div
                                  layoutId="activeTab"
                                  className="absolute inset-0 bg-sage rounded-full shadow-lg shadow-sage/20"
                                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                          )}
                          <span className="relative z-10">Ngày {day.day}</span>
                      </button>
                      {isEditing && (
                        <button 
                          onClick={() => handleDeleteDay(idx)}
                          className="ml--8 mr-2 p-1 text-zinc-300 hover:text-terracotta transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                ))}
                {isEditing && (
                  <button 
                    onClick={handleAddDay}
                    className="ml-4 mr-2 p-2 bg-sage/5 text-sage rounded-full hover:bg-sage/10 transition-colors"
                    title="Thêm ngày"
                  >
                    <Plus size={16} />
                  </button>
                )}
             </div>

             {/* Animated Contebt Section */}
             <AnimatePresence mode="wait">
                <motion.div
                    key={activeDayIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-cream-border shadow-md relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                            <Sparkles size={200} />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                            {[
                                { key: 'morning', time: "BUỔI SÁNG 🌅 • 08:30", icon: <Coffee className="text-sage" size={24} />, activity: currentDay.activities.morning, color: 'sage' },
                                { key: 'afternoon', time: "BUỔI CHIỀU ☀️ • 13:00", icon: <Sun className="text-terracotta" size={24} />, activity: currentDay.activities.afternoon, color: 'terracotta' },
                                { key: 'evening', time: "BUỔI TỐI 🌙 • 19:30", icon: <Moon className="text-zinc-900" size={24} />, activity: currentDay.activities.evening, color: 'zinc' }
                            ].map((slot) => (
                                <div key={slot.key} className="space-y-6 group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm ${
                                            slot.color === 'sage' ? 'bg-sage/10' : slot.color === 'terracotta' ? 'bg-terracotta/10' : 'bg-zinc-100'
                                        }`}>
                                            {slot.icon}
                                        </div>
                                        <span className={`text-[10px] font-extrabold uppercase tracking-[0.2em] ${
                                            slot.color === 'sage' ? 'text-sage' : slot.color === 'terracotta' ? 'text-terracotta' : 'text-zinc-500'
                                        }`}>
                                            {slot.time}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {isEditing ? (
                                          <textarea
                                            value={slot.activity}
                                            onChange={(e) => handleUpdateActivity(activeDayIdx, slot.key as any, e.target.value)}
                                            className="w-full text-sm text-zinc-900 leading-relaxed bg-zinc-50 border border-zinc-200 rounded-xl p-4 focus:ring-2 focus:ring-sage/20 outline-none h-40 resize-none"
                                          />
                                        ) : (
                                          <>
                                            <h4 className="serif text-xl font-bold text-zinc-900 leading-tight">
                                                {slot.activity.split('.')[0]}
                                            </h4>
                                            <p className="text-sm text-zinc-500 leading-relaxed">
                                                {slot.activity.split('.').slice(1).join('.') || "Hòa mình vào không gian địa phương và tận hưởng phút giây thư giãn."}
                                            </p>
                                          </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
             </AnimatePresence>
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="glass h-14 rounded-2xl flex items-center px-8 justify-between border border-white/50 sticky bottom-6 shadow-xl z-50">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
              isEditing ? 'bg-sage text-white' : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
            }`}
          >
            {isEditing ? <Check size={14} /> : <Edit3 size={14} />}
            {isEditing ? "Hoàn tất chỉnh sửa" : "Chỉnh sửa lịch trình"}
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isEditing ? 'bg-amber-500' : 'bg-green-500 animate-pulse'}`}></div>
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
              {isEditing ? 'Đang chỉnh sửa' : 'Gợi ý AI trực tuyến'}
            </span>
          </div>
        </div>
        <div className="flex gap-6">
          <button 
            onClick={handleSearchSimilarTour}
            className="text-xs font-bold text-sage flex items-center gap-1.5 hover:opacity-70 transition-opacity border-r border-cream-border pr-6"
          >
            <Search size={14} /> Tìm tour tương tự
          </button>
          <button 
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="text-xs font-bold text-sage flex items-center gap-1.5 hover:opacity-70 transition-opacity disabled:opacity-50"
          >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} 
            {isExporting ? "Đang chuẩn bị..." : "Xuất PDF"}
          </button>
          <button 
            onClick={handleShare}
            className="text-xs font-bold text-sage flex items-center gap-1.5 hover:opacity-70 transition-opacity relative border-r border-cream-border pr-6"
          >
            <Share2 size={14} /> {showCopySuccess ? "Đã sao chép liên kết!" : "Chia sẻ"}
            <AnimatePresence>
                {showCopySuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-900 text-white text-[10px] rounded-lg whitespace-nowrap shadow-xl"
                  >
                    Đã sao chép vào bộ nhớ tạm!
                  </motion.div>
                )}
            </AnimatePresence>
          </button>
          <button 
            onClick={() => setIsBookingModalOpen(true)}
            className="text-xs font-bold text-terracotta flex items-center gap-1.5 hover:opacity-70 transition-opacity bg-terracotta/5 px-4 py-1.5 rounded-full"
          >
            <Ticket size={14} /> Đặt ngay
          </button>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingModalOpen(false)}
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="serif text-3xl text-zinc-900 mb-2">Đăng ký tư vấn</h2>
                    <p className="text-zinc-500 text-sm italic">Khởi đầu hành trình tại {location} của bạn</p>
                  </div>
                  <button 
                    onClick={() => setIsBookingModalOpen(false)}
                    className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    <ArrowLeft size={20} className="rotate-90" />
                  </button>
                </div>

                {submitSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check size={40} />
                    </div>
                    <h3 className="serif text-2xl text-zinc-900 mb-2">Yêu cầu đã được gửi!</h3>
                    <p className="text-zinc-500 text-sm">Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ tới.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Họ và tên</p>
                      <input 
                        required
                        type="text"
                        placeholder="Nguyễn Văn A"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                        className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-2 focus:ring-sage/20 outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Email</p>
                        <input 
                          required
                          type="email"
                          placeholder="example@gmail.com"
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                          className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-2 focus:ring-sage/20 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Số điện thoại</p>
                        <input 
                          required
                          type="tel"
                          placeholder="0123 456 789"
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                          className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-2 focus:ring-sage/20 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Số lượng khách</p>
                      <select 
                        value={bookingForm.guests}
                        onChange={(e) => setBookingForm({...bookingForm, guests: e.target.value})}
                        className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-2 focus:ring-sage/20 outline-none appearance-none"
                      >
                        <option value="1">1 người</option>
                        <option value="2">2 người</option>
                        <option value="3-5">3 - 5 người</option>
                        <option value="6+">Trên 5 người</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-1">Ghi chú thêm</p>
                      <textarea 
                        placeholder="Yêu cầu đặc biệt về ăn uống, di chuyển..."
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm({...bookingForm, notes: e.target.value})}
                        className="w-full px-5 py-3 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm focus:ring-2 focus:ring-sage/20 outline-none h-24 resize-none"
                      />
                    </div>
                    
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-terracotta text-white rounded-2xl font-bold shadow-lg shadow-terracotta/20 hover:scale-[0.98] active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 mt-4"
                    >
                      {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Ticket size={18} />}
                      {isSubmitting ? "Đang gửi..." : "Hoàn tất đăng ký"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
