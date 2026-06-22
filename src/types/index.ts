export type PromptType =
  | "general"
  | "writing"
  | "coding"
  | "analysis"
  | "image"
  | "data";

export type ToneType = "auto" | "professional" | "casual" | "technical";

export type TemplateCategory = "Writing" | "Coding" | "Data" | "Analysis" | "Image";

export type CopilotModel =
  | "gpt-4o-mini"
  | "gpt-4o"
  | "o3-mini"
  | "claude-3.5-sonnet";

export type ThemeMode = "dark" | "light" | "system";

export type BgAnimation = "none" | "orbs" | "particles" | "grid";

export interface PromptResult {
  optimizedPrompt: string;
  improvements: string[];
  clarityScore: number;
  originalTokens: number;
  optimizedTokens: number;
  timestamp: string;
  promptType: PromptType;
  tone: ToneType;
}

export interface HistoryItem {
  id: string;
  originalPrompt: string;
  result: PromptResult;
  createdAt: string;
}

export interface TemplateItem {
  id: string;
  label: string;
  icon: string;
  category: TemplateCategory;
  prompt: string;
  promptType: PromptType;
  tone: ToneType;
}
