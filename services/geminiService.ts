
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiGestureResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function detectHandGesture(base64Image: string): Promise<GeminiGestureResponse> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: "Look at the image and tell me the state of the human hand. Is it 'open' (fingers spread) or 'closed' (fist)? If no hand is visible, return 'none'. Return only JSON with properties 'state' and 'confidence'."
          }
        ]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            state: {
              type: Type.STRING,
              description: "The state of the hand: 'open', 'closed', or 'none'.",
            },
            confidence: {
              type: Type.NUMBER,
              description: "Confidence level between 0 and 1.",
            }
          },
          required: ["state", "confidence"]
        }
      }
    });

    const data = JSON.parse(response.text.trim());
    return data as GeminiGestureResponse;
  } catch (error) {
    console.error("Gemini Gesture Recognition Error:", error);
    return { state: 'none', confidence: 0 };
  }
}
