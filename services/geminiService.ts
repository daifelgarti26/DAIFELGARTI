import { GoogleGenAI } from "@google/genai";
import { ImportedResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
أنت خبير عالمي في تربية الحمام الزاجل (Racing Pigeons).
لديك معرفة عميقة في:
1. صحة الحمام وتشخيص الأمراض (الكنكر، السالمونيلا، التنفسي، إلخ) والعلاجات الطبيعية والبيطرية.
2. أنظمة التدريب (الأرملة، الطبيعي، الكير).
3. التغذية المناسبة لمواسم السباق والقلش والإنتاج.
4. الوراثة والسلالات (جانسين، فاندينابيل، إلخ).
أجب دائمًا باللغة العربية بلهجة خفيفة ومفهومة أو فصحى مبسطة.
قدم نصائح عملية ودقيقة للمربي.
`;

export const getPigeonAdvice = async (userQuery: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userQuery,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });
    
    return response.text || "عذراً، لم أتمكن من الحصول على إجابة في الوقت الحالي.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء الاتصال بالخبير الآلي. يرجى التحقق من المفتاح أو المحاولة لاحقاً.";
  }
};

export const parseRaceResults = async (text: string): Promise<ImportedResult[]> => {
  try {
    const prompt = `
      Analyze the following text which contains pigeon race results copied from a website.
      Extract the data into a JSON array.
      
      The text might contain lines like: "1 25 John Doe MA-24-12345 10:00:00 150.500 1200.50"
      
      Fields required for each pigeon found:
      - ringNumber (string): The pigeon's ring/band number (e.g., MA-24-12345). Clean it up.
      - rank (number): The position/rank in the race.
      - velocity (number): Speed in m/min.
      - releaseLocation (string): Name of the release point (infer from text if header exists, otherwise "سباق مستورد").
      - stage (string): Date or stage name (infer if possible, otherwise today's date YYYY-MM-DD).
      - date (string): YYYY-MM-DD format.

      Text to analyze:
      ${text}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    let jsonStr = response.text || "[]";
    
    // Sanitize the output: Remove markdown code blocks (```json ... ```)
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

    const results = JSON.parse(jsonStr);
    
    // Validate results roughly
    return Array.isArray(results) ? results.filter((r: any) => r.ringNumber && r.velocity) : [];

  } catch (error) {
    console.error("Error parsing race results:", error);
    return [];
  }
};