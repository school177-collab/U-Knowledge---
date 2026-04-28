import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export async function getAIFeedback(questionContent: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an educational assistant for a school's question culture platform.
      A student has asked the following question: "${questionContent}"
      
      Please provide:
      1. Positive feedback on the question.
      2. 3 expanded or deeper follow-up questions to encourage exploration.
      3. A brief tip on how to explore this question further.
      
      Respond in Korean. Keep it encouraging and educational.`,
      config: {
        systemInstruction: "You are a helpful and inspiring school AI mentor called 'U-Bot'.",
        temperature: 0.7,
      }
    });

    return response.text;
  } catch (error) {
    console.error("AI Feedback Error:", error);
    return "AI 상담원 'U-Bot'이 현재 질문을 분석하는 데 어려움을 겪고 있습니다. 잠시 후 다시 시도해주세요.";
  }
}

export async function improveQuestion(questionContent: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `학생이 작성한 질문입니다: "${questionContent}"
      이 질문을 더 명확하고 탐구 가치가 있는 질문으로 다듬어주세요.
      원래 의도를 유지하되, 더 구체적이고 깊이 있는 질문 하나만 제안해주세요.`,
      config: {
        systemInstruction: "질문 다듬기 도우미입니다.",
      }
    });
    return response.text || questionContent;
  } catch {
    return questionContent;
  }
}
