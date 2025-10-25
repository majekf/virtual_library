import { GoogleGenAI, Modality } from "@google/genai";

export async function generateAICover(prompt: string): Promise<string> {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    console.warn("Gemini API key not found. Cover generation will fail.");
    throw new Error("Gemini API key not found. Please ensure the API_KEY environment variable is set.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    throw new Error("No image data found in Gemini response.");
  } catch (error) {
    console.error("Error generating AI cover:", error);
    throw new Error("Failed to generate image with Gemini API.");
  }
}
