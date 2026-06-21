import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = 3000;

  // Initialize secure backend Gemini SDK
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY env is not configured yet. Fallback to demo mode.");
    }
    return new GoogleGenAI({ apiKey: apiKey || "DEMO_KEY" });
  };

  // API Route: Clinic COPILOT
  app.post("/api/ai/copilot", async (req, res) => {
    try {
      const { prompt, clinicContext } = req.body;
      const ai = getAiClient();
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          text: `### [Demo Mode Mode Active]
**Aura Intelligence is initialized successfully!** 
To enable live clinical reasoning and real-time analysis, please add your your \`GEMINI_API_KEY\` in the **Secrets System panel** in AI Studio settings.

**Preview response for prompt:** *"_ ${prompt} _"*
*   Aura OS provides automated clinic operations.
*   Total patients simulated in cache: \`${clinicContext?.patientsCount || 0}\`.
*   Active queue length: \`${clinicContext?.queueCount || 0}\`.`
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `You are Aura AI, the advanced clinical intelligence engine built into Aura Clinic OS.
            
            Current Clinic Dashboard context status:
            - Total Patients Registered: ${clinicContext?.patientsCount || 0}
            - Queue Waiting: ${clinicContext?.queueCount || 0}
            - Dynamic Metrics: Patients, Doctors, Appointments status active.

            User/Operator Prompt:
            "${prompt}"

            Provide a highly professional, modern, precise, medical-grade executive response. Use Markdown format with bullet points if helpful. Sign off as 'Aura Clinic AI Brain'.` }]
          }
        ]
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || "Failed to generate AI insights." });
    }
  });

  // API Route: Smart Diagnosis & Risk assessment
  app.post("/api/ai/patient-analysis", async (req, res) => {
    try {
      const { patientData } = req.body;
      const ai = getAiClient();
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          text: `### [Demo Mode] AI Risk Prognosis for ${patientData?.name || 'Patient'}
**Clinical Alert status: Normal** 
*   **Observations**: Age is \`${patientData?.age || 'N/A'}\` | Condition listed: \`${patientData?.condition || 'N/A'}\`.
*   **Proactive Care**: Maintain regular monitoring. Advise typical physical rehabilitation guidelines of 30 minutes daily.
*   **Note**: Configure your \`GEMINI_API_KEY\` to enable high-fidelity automated predictive risk-flags run via \`gemini-3.1-pro-preview\`.`
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: [
          {
            role: 'user',
            parts: [{ text: `Act as a senior clinical advisor AI inside Aura Clinic OS.
            Analyze the following patient profile information:
            ${JSON.stringify(patientData)}

            Return a structured, clinical analysis containing:
            1. ADVANCED DIAGNOSTIC PROGNOSIS (Evaluating cardiovascular risk, age profile, potential clinical alerts)
            2. PERSONALIZED RECOMMENDATIONS (Custom medical monitoring schedules, clinical precautions)
            3. CRITICAL SUGGESTIONS OR PROTOCOLS
            
            Format clearly in Markdown, keep sentences concise and medical-grade.` }]
          }
        ]
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message || "Failed to analyze patient risk." });
    }
  });

  // API Route: Rapid Auto-Fill Prescriptions
  app.post("/api/ai/quick-prescription", async (req, res) => {
    try {
      const { symptoms } = req.body;
      const ai = getAiClient();
      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          text: `1. Tab. Paracetamol 650mg (SOS) - Once state of fever/ache arises
2. Tab. Cetirizine 10mg (once daily at bedtime) - For systemic allergic response`
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [
          {
            role: 'user',
            parts: [{ text: `Generate a simplified, precise medical prescription draft based on the clinician notes / symptoms.
            Input notes: "${symptoms || ''}"
            
            Return ONLY the numbered drug prescription block with instructions (no outer introductions).` }]
          }
        ]
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });

  // Vite development integration or static files serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Aura Clinic OS Server] Listening on http://localhost:${PORT}`);
  });
}

startServer();
