import { GoogleGenAI } from "@google/genai";
import { config } from ".";

export const ai = new GoogleGenAI({ apiKey: config.GOOGLE_AI_KEY });