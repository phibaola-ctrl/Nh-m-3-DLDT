
export interface TourActivity {
  time: "morning" | "afternoon" | "evening";
  name: string;
  cost: number;
}

export interface DayItinerary {
  day: number;
  activities: TourActivity[];
}

export interface TourResult {
  location: string;
  days: number;
  hotel_type: string;
  total_cost: number;
  itinerary: DayItinerary[];
  optimization_notes: string[];
  status: "success" | "adjusted" | "insufficient_budget";
}

// Bảng giá tham chiếu (Đơn vị: VNĐ)
const PRICE_DATABASE = {
  hotel: {
    "4_star": 1500000,
    "3_star": 800000,
    "homestay": 350000,
  },
  food_per_day: 400000, // Ăn 3 bữa
  transport_per_day: 200000, // Thuê xe + xăng
  activities: [
    { name: "Tham quan bảo tàng", cost: 100000 },
    { name: "Vé cáp treo/khu du lịch", cost: 750000 },
    { name: "Đi dạo phố cổ", cost: 0 },
    { name: "Ngắm hoàng hôn trên biển", cost: 0 },
    { name: "Show nghệ thuật", cost: 500000 },
  ]
};

/**
 * Tính toán tổng chi phí dựa trên các tham số
 */
function calculateTotalCost(days: number, hotelType: string, activitiesPerDay: number) {
  const hotelCost = (days - 1) * (PRICE_DATABASE.hotel[hotelType as keyof typeof PRICE_DATABASE.hotel] || 0);
  const foodCost = days * PRICE_DATABASE.food_per_day;
  const transportCost = days * PRICE_DATABASE.transport_per_day;
  
  // Giả định mỗi ngày có n hoạt động tốn phí vừa phải
  const activityCost = days * activitiesPerDay;

  return hotelCost + foodCost + transportCost + activityCost;
}

/**
 * Hàm chính: Tạo tour có tối ưu theo ngân sách
 */
export function generateTour({ 
  location, 
  days, 
  budget, 
  preferences 
}: { 
  location: string, 
  days: number, 
  budget: number, 
  preferences: string[] 
}): TourResult {
  
  let currentDays = days;
  let currentHotelType = "4_star";
  let avgActivityCostPerDay = 300000; // Mặc định các hoạt động trung bình
  let notes: string[] = [];
  
  // BƯỚC 1: Kiểm tra ban đầu với tiêu chuẩn cao (4 sao)
  let totalCost = calculateTotalCost(currentDays, currentHotelType, avgActivityCostPerDay);

  // BƯỚC 2: Tối ưu khách sạn (4 -> 3 -> Homestay)
  if (totalCost > budget) {
    currentHotelType = "3_star";
    notes.push("Đã chuyển từ khách sạn 4★ sang 3★ để tiết kiệm chi phí.");
    totalCost = calculateTotalCost(currentDays, currentHotelType, avgActivityCostPerDay);
  }

  if (totalCost > budget) {
    currentHotelType = "homestay";
    notes.push("Đã chuyển sang Homestay để phù hợp với ngân sách.");
    totalCost = calculateTotalCost(currentDays, currentHotelType, avgActivityCostPerDay);
  }

  // BƯỚC 3: Giảm số ngày (Nếu khách sạn thấp nhất vẫn không đủ)
  if (totalCost > budget && currentDays > 1) {
    while (totalCost > budget && currentDays > 1) {
      currentDays--;
      notes.push(`Giảm thời gian chuyến đi xuống còn ${currentDays} ngày.`);
      totalCost = calculateTotalCost(currentDays, currentHotelType, avgActivityCostPerDay);
    }
  }

  // BƯỚC 4: Giảm hoạt động tốn phí
  if (totalCost > budget) {
    avgActivityCostPerDay = 50000; // Chỉ tham quan các điểm miễn phí
    notes.push("Ưu tiên các địa điểm tham quan miễn phí và đi dạo tự do.");
    totalCost = calculateTotalCost(currentDays, currentHotelType, avgActivityCostPerDay);
  }

  // KIỂM TRA CUỐI CÙNG
  if (totalCost > budget) {
    return {
      location,
      days: currentDays,
      hotel_type: currentHotelType,
      total_cost: totalCost,
      itinerary: [],
      optimization_notes: ["Ngân sách quá thấp. Đề xuất: Tăng ngân sách hoặc chọn địa điểm gần hơn."],
      status: "insufficient_budget"
    };
  }

  // TẠO LỊCH TRÌNH GIẢ LẬP (MOCK)
  const itinerary: DayItinerary[] = Array.from({ length: currentDays }, (_, i) => ({
    day: i + 1,
    activities: [
      { time: "morning", name: "Khám phá trung tâm " + location, cost: 0 },
      { time: "afternoon", name: i === 0 && avgActivityCostPerDay > 100000 ? "Tham quan điểm nổi tiếng (có phí)" : "Đi dạo và chụp ảnh", cost: 50000 },
      { time: "evening", name: "Thưởng thức ẩm thực địa phương", cost: 150000 }
    ]
  }));

  return {
    location,
    days: currentDays,
    hotel_type: currentHotelType,
    total_cost: totalCost,
    itinerary,
    optimization_notes: notes,
    status: notes.length > 0 ? "adjusted" : "success"
  };
}
