interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  response: string;
  error?: string;
}

export async function sendMessageToAI(
  userMessage: string,
  conversationHistory: ChatMessage[]
): Promise<string> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        history: conversationHistory,
      }),
    });

    const data: ChatResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.response) {
      throw new Error("No response received from server.");
    }

    return data.response;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Network error. Please check your internet connection.");
    }
    throw error;
  }
}