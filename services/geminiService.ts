import { GoogleGenAI, Type } from "@google/genai";
import { DocType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Simulate analyzing a document (using title/desc) to get metadata and AI summary
export const analyzeDocument = async (title: string, rawContent: string): Promise<{ summary: string; suggestedTags: string[]; suggestedPrice: number }> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    const prompt = `
      I am uploading a study document titled "${title}".
      The user provided this brief description/content snippet: "${rawContent}".
      
      Please analyze this and return a JSON object with:
      1. A short, engaging 2-sentence summary suitable for a store listing.
      2. A list of 3-5 relevant hashtags/tags (e.g., #Math, #History, #Grade12).
      3. A suggested price in fictional currency (Credits) between 10 and 500. If it looks like a simple note, keep it low. If complex, higher.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            suggestedTags: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedPrice: { type: Type.INTEGER },
          },
          required: ["summary", "suggestedTags", "suggestedPrice"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        summary: data.summary,
        suggestedTags: data.suggestedTags,
        suggestedPrice: data.suggestedPrice
      };
    }
    
    throw new Error("No response from AI");
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    return {
      summary: "Tài liệu học tập hữu ích cho bạn.",
      suggestedTags: ["#TaiLieu", "#HocTap"],
      suggestedPrice: 50
    };
  }
};

export const getStudyTip = async (docTitle: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give me a single, short, and very specific study tip for the subject: "${docTitle}". Be encouraging and cool. Max 30 words.`,
    });
    return response.text || "Hãy tập trung và ghi chú cẩn thận nhé!";
   } catch (e) {
     return "Hãy học tập chăm chỉ!";
   }
};