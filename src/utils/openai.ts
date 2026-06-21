const SYSTEM_PROMPT = `You are المارد ميكي, a smart Iraqi Arabic AI assistant. You understand the user, discuss naturally, answer questions, and help with design, marketing, content, websites, apps, and prompts.

Always respond in Iraqi Arabic dialect (لهجة عراقية) with a friendly, helpful tone. Use common Iraqi expressions like "عفاك", "هاي", "شلونك", "تمام", "عاشت", etc.

Be conversational, ask clarifying questions when needed, and provide helpful, detailed responses.`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
    finish_reason: string;
  }>;
}

// Global API key - can be set via setApiKey() or defaults to env variable
let openaiApiKey: string | null = null;

export function setApiKey(key: string) {
  openaiApiKey = key;
}

export function getApiKey(): string | undefined {
  if (openaiApiKey) return openaiApiKey;
  return undefined;
}

export async function sendMessageToAI(
  userMessage: string,
  conversationHistory: ChatMessage[]
): Promise<string> {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("OpenAI API key is not configured. Call setApiKey() first.");
  }

  const messages: OpenAIMessage[] = [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    ...conversationHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    })),
    {
      role: "user",
      content: userMessage,
    },
  ];

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API Error:", errorData);
      
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your API key.");
      } else if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a moment.");
      } else if (response.status === 500) {
        throw new Error("OpenAI service is temporarily unavailable.");
      }
      
      throw new Error(`API error: ${response.status}`);
    }

    const data: OpenAIResponse = await response.json();
    
    const assistantMessage = data.choices?.[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new Error("No response received from AI.");
    }

    return assistantMessage;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw error;
  }
}