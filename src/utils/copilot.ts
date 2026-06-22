const API_TOKEN = import.meta.env.VITE_COPILOT_API_TOKEN as string | undefined;
const BASE_URL = "https://api.githubcopilot.com/chat/completions";
export const DEFAULT_MODEL = "gpt-4o-mini";

export async function callCopilot(
  systemPrompt: string,
  userMessage: string,
  model = DEFAULT_MODEL,
  jsonMode = true
): Promise<string> {
  if (!API_TOKEN) {
    throw new Error("API token not configured. Check your .env file.");
  }

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_TOKEN}`,
      "Copilot-Integration-Id": "vscode-chat",
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      temperature: 0.4,
      max_tokens: 4096,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const status = res.status;
    if (status === 429) {
      throw new Error("Too many requests. Please wait a moment and try again.");
    }
    throw new Error(
      (err as { error?: { message?: string } }).error?.message || "Copilot API error"
    );
  }

  const data = await res.json();
  const choice = data.choices?.[0];

  if (choice?.finish_reason === "length") {
    throw new Error("The model response was cut off. Please try again with a shorter prompt.");
  }

  const text = choice?.message?.content as string | undefined;
  if (!text) {
    throw new Error("Something went wrong parsing the response. Try again.");
  }

  return text;
}
