import type { PromptType, ToneType, CopilotModel } from '../types';

export const PROMPT_TYPE_LABELS: Record<PromptType, string> = {
  general: "General",
  writing: "Writing",
  coding: "Coding",
  analysis: "Analysis",
  image: "Image Generation",
  data: "Data",
};

export const TONE_LABELS: Record<ToneType, string> = {
  auto: "Auto-detect",
  professional: "Professional",
  casual: "Casual",
  technical: "Technical",
};

export const MODEL_LABELS: Record<CopilotModel, string> = {
  "gpt-4o-mini": "GPT-4o mini — Fast",
  "gpt-4o": "GPT-4o — Accurate",
  "o3-mini": "o3-mini — Reasoning",
  "claude-3.5-sonnet": "Claude 3.5 Sonnet",
};
