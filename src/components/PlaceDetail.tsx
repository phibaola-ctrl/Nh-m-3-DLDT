import { useParams, useNavigate } from "react-router";
import { mockPlaces } from "../data/places";
import { ArrowLeft, MapPin, Star, ExternalLink, ImageIcon, Youtube, Navigation, Heart, Hotel, Users } from "lucide-react";
import { motion } from "motion/react";
import { useFavorites } from "../hooks/useFavorites";

export default function PlaceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const place = mockPlaces.find(p => p.id === id);

  if (!place) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <p className="text-zinc-500 italic">Không tìm thấy địa điểm này...</p>
        <button onClick={() => navigate("/")} className="text-sage font-bold flex items-center gap-2">
          <ArrowLeft size={16} /> Quay lại danh sách
        </button>
      </div>
    );
  }

  const handleDirections = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;
    window.open(url, "_blank");
  };

  const handleSearchImages = () => {
    const url = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(place.name + " " + place.city)}`;
    window.open(url, "_blank");
  };

  const handleSearchVideos = () => {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(place.name + " du lịch")}`;
    window.open(url, "_blank");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pb-32">
      <button 
        onClick={() => navigate("/")}
        className="mb-8 text-zinc-400 hover:text-sage flex items-center gap-2 text-sm font-bold transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> QUAY LẠI DANH SÁCH
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-cream-border rounded-[40px] p-8 md:p-12 shadow-xl shadow-sage/5"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-black">
                  <Star size={14} fill="currentColor" /> {place.rating}
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">ĐÁNH GIÁ TỐT NHẤT</span>
              </div>
              <button
                onClick={() => toggleFavorite(place.id)}
                className="p-3 bg-zinc-50 rounded-2xl hover:scale-110 transition-transform shadow-sm border border-cream-border"
              >
                <Heart
                  size={20}
                  className={isFavorite(place.id) ? "fill-terracotta text-terracotta" : "text-zinc-300"}
                />
              </button>
            </div>
            <h1 className="serif text-5xl md:text-6xl text-zinc-900 leading-tight font-bold">{place.name}</h1>
            <div className="flex items-center gap-2 text-zinc-500 font-medium">
              <MapPin className="text-sage" size={18} />
              <span>{place.location}</span>
            </div>
          </div>
        </div>

        <div className="space-y-8 mb-12">
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 mb-4">THÔNG TIN CHI TIẾT</h3>
            <p className="text-lg text-zinc-600 leading-relaxed max-w-2xl font-light italic">
              "{place.description}"
            </p>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            {place.tags.map((tag, i) => (
              <span key={i} className="px-4 py-2 bg-zinc-50 text-zinc-500 text-xs font-bold rounded-full border border-zinc-100">
                {tag}
              </span>
            ))}
          </div>

          {place.hotelName && (
            <div className="pt-8 border-t border-zinc-100">
              <div className="flex items-center gap-2 mb-4">
                <Hotel size={18} className="text-sage" />
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">THÔNG TIN KHÁCH SẠN</h3>
              </div>
              <div className="bg-sage/5 border border-sage/10 rounded-3xl p-6 md:p-8">
                <h4 className="text-xl font-bold text-zinc-900 mb-2">{place.hotelName}</h4>
                <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                  {place.hotelDescription}
                </p>
                <button 
                  onClick={() => window.open(place.hotelUrl, "_blank")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-sage/20 text-sage text-sm font-bold rounded-xl hover:bg-sage hover:text-white transition-all shadow-sm"
                >
                  Đặt phòng ngay <ExternalLink size={14} />
                </button>
              </div>
            </div>
          )}

          {place.guideName && (
            <div className="pt-8 border-t border-zinc-100">
              <div className="flex items-center gap-2 mb-4">
                <Users size={18} className="text-terracotta" />
                <h3 className="text-[10px] uppercase tracking-widest font-bold text-zinc-400">THÔNG TIN HƯỚNG DẪN VIÊN</h3>
              </div>
              <div className="bg-terracotta/5 border border-terracotta/10 rounded-3xl p-6 md:p-8">
                <h4 className="text-xl font-bold text-zinc-900 mb-2">{place.guideName}</h4>
                <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                  {place.guideDescription}
                </p>
                <button 
                  onClick={() => window.open(place.guideUrl, "_blank")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-terracotta/20 text-terracotta text-sm font-bold rounded-xl hover:bg-terracotta hover:text-white transition-all shadow-sm"
                >
                  Đặt ngay <ExternalLink size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12 border-t border-cream-border">
          <button 
            onClick={handleDirections}
            className="flex items-center justify-center gap-3 bg-zinc-900 text-white p-5 rounded-2xl hover:bg-zinc-800 transition-all font-bold group"
          >
            <Navigation size={20} className="group-hover:rotate-12 transition-transform" />
            <span>Chỉ đường</span>
          </button>
          
          <button 
            onClick={handleSearchImages}
            className="flex items-center justify-center gap-3 bg-sage text-white p-5 rounded-2xl hover:opacity-90 transition-all font-bold group"
          >
            <ImageIcon size={20} className="group-hover:scale-110 transition-transform" />
            <span>Xem hình ảnh</span>
          </button>

          <button 
            onClick={handleSearchVideos}
            className="flex items-center justify-center gap-3 border-2 border-sage text-sage p-5 rounded-2xl hover:bg-sage/5 transition-all font-bold group"
          >
            <Youtube size={20} className="group-hover:scale-110 transition-transform" />
            <span>Xem video</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
