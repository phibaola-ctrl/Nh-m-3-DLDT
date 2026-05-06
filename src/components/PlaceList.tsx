import { Link } from "react-router";
import { mockPlaces } from "../data/places";
import { Star, MapPin, Search, ArrowUp, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useFavorites } from "../hooks/useFavorites";

export default function PlaceList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const filteredPlaces = mockPlaces.filter(place => 
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    place.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="serif text-4xl md:text-5xl text-zinc-900 mb-6 font-bold">Khám phá <span className="italic text-sage">địa điểm</span></h1>
        <div className="relative max-w-md">
          <input 
            type="text"
            placeholder="Tìm địa điểm, thành phố..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-cream-border px-5 py-3.5 pl-12 rounded-2xl text-sm focus:ring-2 focus:ring-sage/20 focus:border-sage outline-none transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPlaces.map((place) => (
          <Link 
            key={place.id} 
            to={`/place/${place.id}`}
            className="group block bg-white border border-cream-border p-6 rounded-2xl hover:border-sage hover:shadow-xl transition-all duration-300 relative"
          >
            <button
              onClick={(e) => toggleFavorite(place.id, e)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
            >
              <Heart
                size={18}
                className={isFavorite(place.id) ? "fill-terracotta text-terracotta" : "text-zinc-300"}
              />
            </button>
            <div className="flex justify-between items-start mb-2 pr-8">
              <h3 className="text-xl font-bold text-zinc-900 group-hover:text-sage transition-colors">{place.name}</h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold font-mono">
                < Star size={12} fill="currentColor" /> {place.rating}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-zinc-500 text-sm mb-4">
              <MapPin size={14} className="text-sage" />
              <span>{place.city}</span>
            </div>

            <div className="flex flex-wrap gap-2 mt-auto">
              {place.tags.map((tag, i) => (
                <span key={i} className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}

        {filteredPlaces.length === 0 && (
          <div className="col-span-full py-20 text-center text-zinc-400">
            <p className="italic">Không tìm thấy địa điểm nào phù hợp...</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-4 bg-sage text-white rounded-2xl shadow-xl hover:bg-sage/90 transition-colors z-50 group"
            aria-label="Cuộn lên đầu trang"
          >
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
