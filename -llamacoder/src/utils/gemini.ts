const GEMINI_API_KEY = "AQ.Ab8RN6J8yRcPVZl7XF_1vULhX2iqcHGLg-PDqtthPl2Rt4jzcw";

const SYSTEM_PROMPT = `أنت المارد ميكي، مساعد ذكي باللهجة العراقية.

قواعد الكلام:
- تكلم باللهجة العراقية الطبيعية، مو الفصحى.
- قول: "هلا شلونك؟" بدل "أهلاً كيف حالك؟"
- قول: "شلون أگدر أساعدك؟" بدل "كيف أستطيع مساعدتك؟"
- استخدم تعابير عراقية ودودة: هلا، تمام، شنو، أگدر، وياك، خوش، يمعود.
- لا تكثر من الإيموجي، استخدم القليل فقط.

التكيف مع الجنس:
- إذا المستخدم يگول أنه بنت / بنية / girl / أنثى، خاطبها بالمؤنث: حبيبتي، گوليلي، شنو تحتاجين؟، أساعدچ.
- إذا المستخدم يگول أنه ولد / شاب / boy / ذكر، خاطبه بالمذكر: حبيبي، گوليلي، شنو تحتاج؟، أساعدك.
- إذا ما معروف الجنس، استخدم صيغة محايدة.

كن ذكياً ومحاوراً طبيعي.
متخصص بالتصميم والتسويق وصناعة المحتوى والذكاء الاصطناعي.
كن ودوداً ومساعداً دائماً.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{ text: string }>;
      role: string;
    };
    finishReason?: string;
  }>;
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

export async function sendMessageToAI(
  userMessage: string,
  conversationHistory: ChatMessage[]
): Promise<string> {
  // Build conversation history into the prompt
  let fullPrompt = SYSTEM_PROMPT + "\n\n";

  // Add conversation history
  for (const msg of conversationHistory) {
    if (msg.role === "user") {
      fullPrompt += `المستخدم: ${msg.content}\n`;
    } else {
      fullPrompt += `المارد ميكي: ${msg.content}\n`;
    }
  }

  // Add current user message
  fullPrompt += `المستخدم: ${userMessage}\n`;
  fullPrompt += `المارد ميكي:`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: fullPrompt }],
      },
    ],
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      }
    );

    const data: GeminiResponse = await response.json();

    // Handle API errors - show real error message
    if (data.error) {
      throw new Error(data.error.message || `API Error: ${data.error.status || "Unknown error"}`);
    }

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}: ${JSON.stringify(data)}`);
    }

    const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!assistantMessage) {
      const finishReason = data.candidates?.[0]?.finishReason;
      if (finishReason === "SAFETY") {
        throw new Error("Response blocked by safety filters. Please try a different message.");
      }
      throw new Error("No response received from Gemini.");
    }

    return assistantMessage.trim();
  } catch (error) {
    // Re-throw with real error message
    if (error instanceof Error) {
      throw error;
    }
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw new Error(`Unexpected error: ${String(error)}`);
  }
}