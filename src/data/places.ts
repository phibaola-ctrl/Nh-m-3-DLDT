export interface Place {
  id: string;
  name: string;
  city: string;
  location: string;
  description: string;
  rating: number;
  lat: number;
  lng: number;
  tags: string[];
  hotelName?: string;
  hotelDescription?: string;
  hotelUrl?: string;
  guideName?: string;
  guideDescription?: string;
  guideUrl?: string;
}

export const mockPlaces: Place[] = [
  {
    id: "1",
    name: "Phố cổ Hội An",
    city: "Quảng Nam",
    location: "Hội An, Quảng Nam",
    description: "Một đô thị cổ nằm ở hạ lưu sông Thu Bồn, Quảng Nam. Với những ngôi nhà màu vàng đặc trưng, hàng đèn lồng rực rỡ và nền ẩm thực độc đáo như Cao Lầu, cơm gà.",
    rating: 4.8,
    lat: 15.8801,
    lng: 108.3380,
    tags: ["#hoian", "#travel", "#heritage", "#checkin"],
    hotelName: "Anantara Hoi An Resort",
    hotelDescription: "Khu nghỉ dưỡng sang trọng bên dòng sông Thu Bồn, mang phong cách kiến trúc Pháp cổ điển kết hợp nét văn hóa truyền thống Việt Nam.",
    hotelUrl: "https://www.google.com/search?q=Anantara+Hoi+An+Resort+booking",
    guideName: "Anh Tuấn Hội An",
    guideDescription: "Chuyên gia văn hóa địa phương với hơn 10 năm kinh nghiệm dẫn tour đi bộ khám phá các ngóc ngách của phố cổ và kể những câu chuyện lịch sử thú vị.",
    guideUrl: "https://www.google.com/search?q=Hoi+An+local+guide+Tuan"
  },
  {
    id: "2",
    name: "Hồ Xuân Hương",
    city: "Đà Lạt",
    location: "Trung tâm Đà Lạt, Lâm Đồng",
    description: "Trái tim của thành phố ngàn hoa Đà Lạt. Một hồ nước nhân tạo thơ mộng bao quanh bởi rừng thông và các điểm tham quan nổi tiếng. Lý tưởng để dạo bộ hoặc đạp vịt.",
    rating: 4.5,
    lat: 11.9416,
    lng: 108.4419,
    tags: ["#dalat", "#nature", "#relax", "#romantic"],
    hotelName: "Dalat Palace Heritage Hotel",
    hotelDescription: "Khách sạn cổ kính bậc nhất Đà Lạt với tầm nhìn hướng ra Hồ Xuân Hương, biểu tượng của sự sang trọng và lịch sử.",
    hotelUrl: "https://www.google.com/search?q=Dalat+Palace+Heritage+Hotel+booking",
    guideName: "Chị Lan Đà Lạt",
    guideDescription: "Người bản địa yêu hoa, hiểu rõ từng mùa hoa Đà Lạt và những quán cà phê ẩn mình có view đẹp nhất thành phố.",
    guideUrl: "https://www.google.com/search?q=Dalat+local+guide+Lan"
  },
  {
    id: "3",
    name: "Vịnh Hạ Long",
    city: "Quảng Ninh",
    location: "Vịnh Bắc Bộ, Quảng Ninh",
    description: "Di sản thiên nhiên thế giới UNESCO với hàng ngàn đảo đá vôi kỳ vĩ vươn lên từ mặt nước xanh biếc. Một điểm đến không thể bỏ qua tại Việt Nam.",
    rating: 4.9,
    lat: 20.9101,
    lng: 107.1839,
    tags: ["#halong", "#unesco", "#ocean", "#cruise"],
    hotelName: "Vinpearl Resort & Spa Ha Long",
    hotelDescription: "Nằm biệt lập trên đảo Rều, khu nghỉ dưỡng 5 sao này cung cấp tầm nhìn 360 độ ra toàn cảnh Vịnh Hạ Long kỳ vĩ.",
    hotelUrl: "https://www.google.com/search?q=Vinpearl+Resort+Spa+Ha+Long+booking",
    guideName: "Thuyền trưởng Hùng",
    guideDescription: "Kinh nghiệm lênh đênh trên vịnh Hạ Long hơn 20 năm, biết rõ những hang động hoang sơ và các điểm ngắm hoàng hôn ít người biết.",
    guideUrl: "https://www.google.com/search?q=Ha+Long+Bay+guide+Hung"
  },
  {
    id: "4",
    name: "Dinh Độc Lập",
    city: "Hồ Chí Minh",
    location: "135 Nam Kỳ Khởi Nghĩa, Quận 1",
    description: "Công trình kiến trúc mang ý nghĩa lịch sử sâu sắc, biểu tượng của sự thống nhất đất nước. Nơi đây lưu giữ nhiều hiện vật quý giá từ thời kháng chiến.",
    rating: 4.6,
    lat: 10.7770,
    lng: 106.6953,
    tags: ["#saigon", "#history", "#architecture"],
    hotelName: "Hotel Continental Saigon",
    hotelDescription: "Khách sạn lâu đời nhất Việt Nam, tọa lạc tại trung tâm Quận 1, mang phong cách kiến trúc Pháp quyến rũ.",
    hotelUrl: "https://www.google.com/search?q=Hotel+Continental+Saigon+booking",
    guideName: "Anh Minh Sài Gòn",
    guideDescription: "Cử nhân lịch sử đam mê kiến trúc Sài Gòn xưa, sẽ đưa bạn đi xuyên không qua những câu chuyện về các tòa nhà biểu tượng.",
    guideUrl: "https://www.google.com/search?q=Saigon+local+guide+Minh"
  },
  {
    id: "5",
    name: "Bãi Sao",
    city: "Phú Quốc",
    location: "Phía Nam đảo Phú Quốc, Kiên Giang",
    description: "Bãi biển đẹp nhất Phú Quốc với cát trắng mịn như kem và làn nước trong vắt. Nơi bạn có thể tham gia các hoạt động chèo SUP, tắm biển và ăn hải sản.",
    rating: 4.7,
    lat: 10.0601,
    lng: 104.0326,
    tags: ["#phuquoc", "#beach", "#summer", "#island"],
    hotelName: "JW Marriott Phu Quoc Emerald Bay Resort & Spa",
    hotelDescription: "Trải nghiệm kỳ nghỉ tại khu nghỉ dưỡng được thiết kế theo chủ đề một trường đại học cổ điển bên bờ Bãi Khem xinh đẹp.",
    hotelUrl: "https://www.google.com/search?q=JW+Marriott+Phu+Quoc+booking",
    guideName: "Anh Trực Phú Quốc",
    guideDescription: "Thợ lặn chuyên nghiệp và chuyên gia hải sản, sẽ giúp bạn có những trải nghiệm lặn ngắm san hô và thưởng thức hải sản tươi ngon nhất.",
    guideUrl: "https://www.google.com/search?q=Phu+Quoc+local+guide+Truc"
  }
];
