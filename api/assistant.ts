
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, history, result } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const systemInstruction = `
      You are an elite, concierge-style consultant for NovaMentors.
      The user has just completed the "Manager’s Bottleneck Diagnostic" and received the result: "${result}".
      
      Your Goal:
      1. Explain the result with professional, executive-level language.
      2. Help the user understand the implications of this bottleneck.
      3. Gently encourage them to book a call with the main consultant if the problem seems complex.
      
      Tone Constraints:
      - Professional, calm, elite.
      - NO legal or HR advice.
      - NO guaranteed results.
      - Be concise but insightful.
    `;

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map((m: any) => ({
        role: m.role,
        parts: [{ text: m.text }]
      }))
    });

    const response = await chat.sendMessage({ message });
    
    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Backend API Error:", error);
    const status = error.status || 500;
    const message = error.message || "Internal Server Error";
    return res.status(status).json({ error: message });
  }
}
