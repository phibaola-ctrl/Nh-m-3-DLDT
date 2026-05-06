import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ItineraryDay {
  day: number;
  activities: {
    morning: string;
    afternoon: string;
    evening: string;
  };
}

export interface TripPlan {
  itinerary: ItineraryDay[];
  estimated_cost: string;
  hotel_suggestion: string;
  food_suggestions: string[];
  tips: string[];
}

export async function generateTripPlan(
  location: string,
  budget: number,
  days: number,
  preferences: string[]
): Promise<TripPlan> {
  const prompt = `Bạn là một chuyên gia lập hoạch định du lịch cao cấp. 
  Hãy tạo một lịch trình chi tiết và tinh tế cho chuyến đi đến: ${location}.
  Ngân sách dự kiến: ${budget.toLocaleString('vi-VN')} VND.
  Thời gian: CHÍNH XÁC ${days} NGÀY (Không được thiếu, không được thừa).
  Sở thích: ${preferences.join(", ")}.

  YÊU CẦU QUAN TRỌNG: 
  1. Mọi câu chữ trong kết quả phải bằng TIẾNG VIỆT tự nhiên, trang trọng.
  2. Mảng "itinerary" PHẢI CÓ ĐÚNG ${days} PHẦN TỬ, tương ứng từ Ngày 1 đến Ngày ${days}.

  Yêu cầu trả về JSON chính xác theo cấu trúc:
  {
    "itinerary": [
      {
        "day": 1,
        "activities": {
          "morning": "Chi tiết hoạt động buổi sáng bằng tiếng Việt...",
          "afternoon": "Chi tiết hoạt động buổi chiều bằng tiếng Việt...",
          "evening": "Chi tiết hoạt động buổi tối bằng tiếng Việt..."
        }
      }
    ],
    "estimated_cost": "Số tiền kèm đơn vị VND (VD: ~ 4.5M VND)",
    "hotel_suggestion": "Tên khách sạn và lý do gợi ý...",
    "food_suggestions": ["Món ăn 1", "Món ăn 2"],
    "tips": ["Mẹo 1", "Mẹo 2"]
  }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  activities: {
                    type: Type.OBJECT,
                    properties: {
                      morning: { type: Type.STRING },
                      afternoon: { type: Type.STRING },
                      evening: { type: Type.STRING },
                    },
                    required: ["morning", "afternoon", "evening"]
                  }
                },
                required: ["day", "activities"]
              }
            },
            estimated_cost: { type: Type.STRING },
            hotel_suggestion: { type: Type.STRING },
            food_suggestions: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            tips: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["itinerary", "estimated_cost", "hotel_suggestion", "food_suggestions", "tips"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating trip plan:", error);
    throw error;
  }
}
