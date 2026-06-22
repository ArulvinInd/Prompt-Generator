export function estimateTokens(text: string): number {
  if (!text.trim()) return 0;
  const words = text.trim().split(/\s+/).length;
  return Math.round(words * 1.3);
}
