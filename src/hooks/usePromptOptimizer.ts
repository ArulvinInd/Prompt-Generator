import { useState, useCallback } from 'react';
import type { PromptResult, PromptType, ToneType, CopilotModel } from '../types';
import { callCopilot, DEFAULT_MODEL } from '../utils/copilot';
import { estimateTokens } from '../utils/tokenEstimator';
import { parseAIResponse } from '../utils/parseResponse';
import { SYSTEM_INSTRUCTION } from '../constants/systemPrompt';

const MAX_INPUT_CHARS = 2000;

interface UsePromptOptimizerReturn {
  result: PromptResult | null;
  isLoading: boolean;
  error: string | null;
  optimize: (userPrompt: string, promptType: PromptType, tone: ToneType, model?: CopilotModel) => Promise<PromptResult | null>;
}

export function usePromptOptimizer(): UsePromptOptimizerReturn {
  const [result, setResult] = useState<PromptResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const optimize = useCallback(async (
    userPrompt: string,
    promptType: PromptType,
    tone: ToneType,
    model: CopilotModel = DEFAULT_MODEL as CopilotModel
  ): Promise<PromptResult | null> => {
    setError(null);

    if (!userPrompt.trim()) {
      setError("Please enter a prompt to optimize.");
      return null;
    }

    if (userPrompt.length > MAX_INPUT_CHARS) {
      setError("Your prompt is too long. Please shorten it to under 2000 characters.");
      return null;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const systemInstruction = SYSTEM_INSTRUCTION
        .replace("{promptType}", promptType)
        .replace("{tone}", tone);

      const userMessage = `Prompt type: ${promptType}\nTone: ${tone}\n\nOriginal prompt:\n${userPrompt}`;

      const rawResponse = await callCopilot(systemInstruction, userMessage, model);
      const originalTokens = estimateTokens(userPrompt);

      const parsed = parseAIResponse(
        rawResponse,
        promptType,
        tone,
        originalTokens,
        0
      );
      parsed.optimizedTokens = estimateTokens(parsed.optimizedPrompt);

      setResult(parsed);
      return parsed;
    } catch (err) {
      const message =
        err instanceof TypeError
          ? "Connection failed. Check your internet and try again."
          : err instanceof Error
          ? err.message
          : "An unexpected error occurred. Try again.";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { result, isLoading, error, optimize };
}
