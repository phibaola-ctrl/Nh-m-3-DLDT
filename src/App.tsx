import { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router";
import { Sparkles, Compass, Map, Heart, AlertCircle, Scale } from "lucide-react";
import TravelForm from "./components/TravelForm";
import ItineraryDisplay from "./components/ItineraryDisplay";
import PlaceList from "./components/PlaceList";
import PlaceDetail from "./components/PlaceDetail";
import FloatingActions from "./components/FloatingActions";
import { generateTripPlan, TripPlan } from "./lib/gemini";
import { generateTour } from "./services/tourService";
import { motion, AnimatePresence } from "motion/react";

function MainLayout() {
  const [isLoading, setIsLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [optimizationNotes, setOptimizationNotes] = useState<string[]>([]);
  const [lastRequest, setLastRequest] = useState<{ location: string, days: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const currentPath = useLocation().pathname;

  const handleGenerate = async (data: {
    location: string;
    budget: number;
    days: number;
    preferences: string[];
  }) => {
    setIsLoading(true);
    setError(null);
    setOptimizationNotes([]);
    
    try {
      setLastRequest({ location: data.location, days: data.days });
      
      // ÁP DỤNG LOGIC TỐI ƯU CƠ BẢN
      const optimized = generateTour({
        location: data.location,
        days: data.days,
        budget: data.budget,
        preferences: data.preferences
      });

      if (optimized.status === "insufficient_budget") {
        setError(optimized.optimization_notes[0]);
        setIsLoading(false);
        return;
      }

      if (optimized.optimization_notes.length > 0) {
        setOptimizationNotes(optimized.optimization_notes);
      }

      const plan = await generateTripPlan(
        optimized.location,
        data.budget,
        optimized.days,
        data.preferences
      );
      
      setTripPlan(plan);
    } catch (err) {
      console.error(err);
      setError("Rất tiếc, đã có lỗi xảy ra khi lên lịch trình. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-bg text-zinc-900 selection:bg-sage/20">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-cream-bg/80 backdrop-blur-md border-b border-cream-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-sage rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Map className="text-white" size={18} />
            </div>
            <span className="serif text-lg font-bold tracking-tight">NextStep AI</span>
          </Link>

          <div className="flex gap-4 md:gap-8 bg-zinc-100 p-1 rounded-2xl">
            <Link 
              to="/" 
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${currentPath === "/" || currentPath.startsWith("/place") ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
            >
              <Compass size={14} /> Khám phá
            </Link>
            <Link 
              to="/ai-planner" 
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${currentPath === "/ai-planner" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500 hover:text-zinc-700"}`}
            >
              <Sparkles size={14} /> Kế hoạch AI
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2 text-zinc-400 font-mono text-[9px] uppercase tracking-widest">
            <Heart size={14} className="text-terracotta" fill="currentColor" />
            <span>Nhóm 3</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<PlaceList />} />
          <Route path="/place/:id" element={<PlaceDetail />} />
          <Route path="/ai-planner" element={
            <div className="px-6 py-12">
              <AnimatePresence mode="wait">
                {!tripPlan ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="max-w-2xl mx-auto"
                  >
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center justify-center p-3 bg-sage/10 rounded-3xl mb-6">
                        <Sparkles className="text-sage" size={32} />
                      </div>
                      <h2 className="serif text-4xl md:text-5xl text-zinc-900 mb-4 font-bold tracking-tight">Hành trình riêng <span className="italic">cho bạn</span></h2>
                      <p className="text-zinc-500 text-sm max-w-sm mx-auto">Sử dụng trí tuệ nhân tạo để thiết kế lịch trình du lịch tối ưu nhất.</p>
                    </div>
                    
                    {error && (
                      <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-500 text-sm rounded-2xl flex items-center gap-3">
                        <AlertCircle size={18} />
                        {error}
                      </div>
                    )}

                    {optimizationNotes.length > 0 && (
                      <div className="mb-8 p-5 bg-amber-50 border border-amber-100 rounded-3xl">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                          <Scale size={14} /> Đã tối ưu hóa lịch trình
                        </p>
                        <ul className="space-y-1">
                          {optimizationNotes.map((note, i) => (
                            <li key={i} className="text-xs text-amber-700 italic">• {note}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <TravelForm onSubmit={handleGenerate} isLoading={isLoading} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="itinerary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full"
                  >
                    <ItineraryDisplay 
                      plan={tripPlan} 
                      onBack={() => setTripPlan(null)} 
                      location={lastRequest?.location || ""}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          } />
        </Routes>
      </main>

      <footer className="py-20 border-t border-cream-border text-center">
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">NEXTSTEP AI PLANNER & EXPLORER</p>
        <p className="text-zinc-400 text-[9px] italic">Web Tạo Bởi Nhóm 3 Phục Vụ Môn Du Lịch Điện Tử</p>
      </footer>

      <FloatingActions />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout />
    </BrowserRouter>
  );
}
