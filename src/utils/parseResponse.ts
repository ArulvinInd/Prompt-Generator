import type { PromptResult, PromptType, ToneType } from '../types';

interface AIResponsePayload {
  optimizedPrompt: string;
  improvements: string[];
  clarityScore: number;
}

export function parseAIResponse(
  raw: string,
  promptType: PromptType,
  tone: ToneType,
  originalTokens: number,
  optimizedTokens: number
): PromptResult {
  const clean = raw.replace(/```json|```/g, "").trim();
  let parsed: AIResponsePayload;

  try {
    parsed = JSON.parse(clean) as AIResponsePayload;
  } catch {
    throw new Error("Something went wrong parsing the response. Try again.");
  }

  if (!parsed.optimizedPrompt || typeof parsed.optimizedPrompt !== "string") {
    throw new Error("Something went wrong parsing the response. Try again.");
  }

  return {
    optimizedPrompt: parsed.optimizedPrompt,
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    clarityScore: Math.min(100, Math.max(0, Math.round(parsed.clarityScore ?? 0))),
    originalTokens,
    optimizedTokens,
    timestamp: new Date().toISOString(),
    promptType,
    tone,
  };
}
