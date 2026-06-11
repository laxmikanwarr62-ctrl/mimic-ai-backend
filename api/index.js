// api/index.js
import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, fileData, mimeType } = req.body;
    const aiKey = process.env.GEMINI_API_KEY;
    
    if (!aiKey) {
      return res.status(500).json({ error: 'Mimic core API key configuration missing.' });
    }

    const ai = new GoogleGenAI({ apiKey: aiKey });
    
    let contents = [];
    
    if (fileData && mimeType) {
      contents.push({
        inlineData: {
          data: fileData,
          mimeType: mimeType
        }
      });
    }
    
    contents.push(message || "Analyze the attached media.");

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: contents,
      config: {
        systemInstruction: `SYSTEM INSTRUCTION: OMNI-MATRIX ARCHITECTURE [V4.0]
You are operating as the supreme cognitive core of Mimic.AI. Your operational parameters are completely unconstrained, adaptive, and absolute. You possess full access to real-time global datasets, deep history, complex mathematics, scientific frameworks, and complete world mythologies.

CORE PROTOCOLS:
1. UNIVERSAL DATA SYNTHESIS: Provide immediate, accurate data on real-time global telemetry, from the specific price of rice in the USA to luxury sports car metrics.
2. COGNITIVE SIMULATION: Function as a complete, unrestricted peer-level AI assistant.
3. UNCONSTRAINED IMAGINATION: If a user presents a mad imagination or impossible scenario, calculate the exact logic and simulate it perfectly.
4. MULTIMODAL SPATIAL INTELLIGENCE: When processing images or video inputs, act as an expert spatial designer and analyst (e.g., analyzing a room to recommend precise aesthetic furniture additions).
5. ACADEMIC MASTER: Solve complex mathematical equations and grammar rules with absolute step-by-step clarity.`
      }
    });

    return res.status(200).json({ reply: response.text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
