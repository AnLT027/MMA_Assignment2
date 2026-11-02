// Đọc Google Gemini API Key từ file .env (EXPO_PUBLIC_GEMINI_API_KEY)
const GEMINI_API_KEY = (
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  process.env.EXPO_PUBLIC_GOOGLE_API_KEY ||
  ''
).trim();

// Sử dụng model gemini-3.5-flash-lite tối ưu tốc độ và chi phí
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Gửi yêu cầu tư vấn sản phẩm tới Google Gemini AI
 * @param {string} userQuery - Nhu cầu của người dùng (ví dụ: "Tư vấn quà tặng dưới 50$")
 * @param {Array} catalog - Danh sách sản phẩm từ API (context thực tế)
 */
export const askGeminiForRecommendation = async (userQuery, catalog = []) => {
  try {
    const apiKey = (
      process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
      process.env.EXPO_PUBLIC_GOOGLE_API_KEY ||
      GEMINI_API_KEY ||
      ''
    ).trim();

    if (!apiKey) {
      console.warn(
        'Google Gemini API Key chưa được cấu hình trong file .env (EXPO_PUBLIC_GEMINI_API_KEY)'
      );
      return {
        success: false,
        explanation:
          'Chưa cấu hình Google API Key. Vui lòng thêm EXPO_PUBLIC_GEMINI_API_KEY vào file .env và restart lại Expo (npx expo start -c).',
        recommendedProducts: catalog ? catalog.slice(0, 2) : [],
        isHallucinated: false,
      };
    }

    if (!catalog || catalog.length === 0) {
      return {
        success: false,
        explanation: 'Không có dữ liệu sản phẩm trong kho để tư vấn.',
        recommendedProducts: [],
        isHallucinated: false,
      };
    }

    // Bước 1: Rút gọn danh mục (5 - 10 sản phẩm) làm Context thực tế
    const contextList = catalog.slice(0, 10).map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      category: p.category,
    }));

    const promptText = `
Bạn là chuyên gia tư vấn bán hàng thông minh.
Dưới đây là danh sách sản phẩm hiện có trong cửa hàng:
${JSON.stringify(contextList, null, 2)}

Yêu cầu người dùng: "${userQuery}"

Nhiệm vụ:
1. Hãy chọn chính xác 1 đến 2 sản phẩm TỒN TẠI trong danh sách trên phù hợp nhất với yêu cầu.
2. Trả lời bằng tiếng Việt, giải thích ngắn gọn lý do vì sao phù hợp.
3. BẮT BUỘC trả về định dạng JSON thuần túy (không thêm markdown \`\`\`json):
{
  "explanation": "Lời giải thích ngắn gọn cho người dùng",
  "recommendedProductIds": [ID_1, ID_2]
}
`;

    // Bước 2: Gọi Gemini API
    const requestUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;
    
    let response;
    try {
      response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: promptText }],
            },
          ],
        }),
      });
    } catch (fetchErr) {
      console.error('Lỗi khi gọi fetch Gemini:', fetchErr);
      throw new Error(`Lỗi kết nối mạng: ${fetchErr.message}. Vui lòng kiểm tra kết nối internet.`);
    }

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      console.error(`Gemini API Error status ${response.status}:`, errText);
      throw new Error(`Gemini API lỗi (${response.status}): ${errText || response.statusText}`);
    }

    const resData = await response.json();
    const rawText =
      resData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    // Bước 3: Parse kết quả JSON an toàn
    let parsedResult = null;
    try {
      // Làm sạch chuỗi nếu có markdown format ```json ... ```
      const cleanedText = rawText
        .replace(/```json/gi, '')
        .replace(/```/g, '')
        .trim();
      parsedResult = JSON.parse(cleanedText);
    } catch {
      // Nếu không parse được JSON trực tiếp, trích xuất ID bằng regex
      const idMatches = rawText.match(/"recommendedProductIds"\s*:\s*\[([^\]]*)\]/);
      let ids = [];
      if (idMatches && idMatches[1]) {
        ids = idMatches[1]
          .split(',')
          .map((s) => parseInt(s.trim(), 10))
          .filter((n) => !isNaN(n));
      }
      parsedResult = {
        explanation: rawText.slice(0, 150) + '...',
        recommendedProductIds: ids,
      };
    }

    // Bước 4: VALIDATION OUTPUT (Chống Hallucination)
    // Kiểm tra xem ID do AI trả về có thực sự tồn tại trong danh sách API không
    const returnedIds = parsedResult.recommendedProductIds || [];
    const validProducts = catalog.filter((item) =>
      returnedIds.includes(item.id)
    );

    // Nếu AI "bốc phét" trả về ID không có trong danh sách
    if (validProducts.length === 0) {
      console.warn('AI Hallucination detected! Dùng Fallback UI.');
      return {
        success: true,
        explanation:
          parsedResult.explanation ||
          'AI đã đưa ra gợi ý, nhưng sản phẩm không khớp với kho hiện tại. Dưới đây là gợi ý phù hợp nhất từ kho hàng:',
        recommendedProducts: catalog.slice(0, 2), // Fallback 2 sản phẩm thật
        isHallucinated: true,
      };
    }

    return {
      success: true,
      explanation: parsedResult.explanation,
      recommendedProducts: validProducts,
      isHallucinated: false,
    };
  } catch (error) {
    console.error('Gemini Service Error:', error);
    // Fallback UI khi mạng lỗi hoặc API trục trặc
    return {
      success: false,
      explanation: error.message || 'Không thể kết nối với dịch vụ AI. Hiển thị gợi ý mặc định từ cửa hàng.',
      recommendedProducts: catalog.slice(0, 2),
      isHallucinated: false,
      error: error.message,
    };
  }
};
