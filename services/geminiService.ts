
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateServiceDescription = async (title: string, category: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a professional and compelling service description for a service titled "${title}" in the category of "${category}". The tone should be welcoming, professional, and optimized for the Nigerian market. Keep it under 150 words.`,
    });

    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "An error occurred while generating the description.";
  }
};
