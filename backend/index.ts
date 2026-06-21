import express from "express";
import cors from "cors";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));
}

const SYSTEM_PROMPT = `أنت المارد ميكي، مساعد ذكي باللهجة العراقية.
تفهم المستخدم وتجاوب على الأسئلة وتناقشه بشكل طبيعي.
متخصص بالتصميم والتسويق وصناعة المحتوى والذكاء الاصطناعي.

استخدم تعابير عراقية شائعة مثل: عفاك، هاي، شلونك، تمام، عاشت، خوش، دكومة، يمعود، وغيرها.
كن ودوداً ومساعداً دائماً.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface GeminiContent {
  parts: Array<{ text: string }>;
  role: string;
}

interface GeminiRequest {
  contents: GeminiContent[];
  systemInstruction?: {
    parts: Array<{ text: string }>;
  };
  generationConfig?: {
    temperature: number;
    topP: number;
    topK: number;
    maxOutputTokens: number;
  };
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{ text: string }>;
      role: string;
    };
    finishReason: string;
  }>;
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  const { message, history }: { message: string; history: ChatMessage[] } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY not configured");
    return res.status(500).json({ error: "Server configuration error. Please contact support." });
  }

  try {
    // Build conversation contents for Gemini
    const contents: GeminiContent[] = (history || []).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const requestBody: GeminiRequest = {
      contents,
      systemInstruction: {
        parts: [{ text: SYSTEM_PROMPT }],
      },
      generationConfig: {
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
      },
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data: GeminiResponse = await response.json();

    // Handle API errors
    if (data.error) {
      console.error("Gemini API Error:", data.error);

      if (data.error.status === "RESOURCE_EXHAUSTED") {
        return res.status(429).json({ error: "Rate limit exceeded. Please wait a moment." });
      } else if (data.error.status === "UNAVAILABLE") {
        return res.status(503).json({ error: "Service temporarily unavailable. Please try again." });
      }

      return res.status(500).json({ error: "Failed to get response from AI." });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to communicate with AI service." });
    }

    const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!assistantMessage) {
      const finishReason = data.candidates?.[0]?.finishReason;
      if (finishReason === "SAFETY") {
        return res.status(400).json({ error: "Response blocked by safety filters." });
      }
      return res.status(500).json({ error: "No response received from AI." });
    }

    res.json({ response: assistantMessage });
  } catch (error) {
    console.error("Chat error:", error);

    if (error instanceof TypeError && error.message === "Failed to fetch") {
      return res.status(503).json({ error: "Network error. Please check your connection." });
    }

    res.status(500).json({ error: "An unexpected error occurred." });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", hasApiKey: !!process.env.GEMINI_API_KEY });
});

// Serve React app for all other routes in production
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`🧞‍♂️ Al-Mared Mickey server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/chat`);
  console.log(`🔑 GEMINI_API_KEY configured: ${!!process.env.GEMINI_API_KEY}`);
});