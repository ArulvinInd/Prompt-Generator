export const LANGUAGE_GROUPS = [
  {
    group: 'South Indian',
    languages: [
      { code: 'ta', label: '🇮🇳 Tamil' },
      { code: 'te', label: '🇮🇳 Telugu' },
      { code: 'kn', label: '🇮🇳 Kannada' },
      { code: 'ml', label: '🇮🇳 Malayalam' },
    ],
  },
  {
    group: 'Indian',
    languages: [
      { code: 'hi', label: '🇮🇳 Hindi' },
    ],
  },
  {
    group: 'European',
    languages: [
      { code: 'es', label: '🇪🇸 Spanish' },
      { code: 'fr', label: '🇫🇷 French' },
      { code: 'de', label: '🇩🇪 German' },
      { code: 'it', label: '🇮🇹 Italian' },
      { code: 'nl', label: '🇳🇱 Dutch' },
      { code: 'pt', label: '🇧🇷 Portuguese' },
      { code: 'ru', label: '🇷🇺 Russian' },
      { code: 'pl', label: '🇵🇱 Polish' },
      { code: 'sv', label: '🇸🇪 Swedish' },
      { code: 'tr', label: '🇹🇷 Turkish' },
    ],
  },
  {
    group: 'East Asian',
    languages: [
      { code: 'zh', label: '🇨🇳 Chinese (Simplified)' },
      { code: 'ja', label: '🇯🇵 Japanese' },
      { code: 'ko', label: '🇰🇷 Korean' },
    ],
  },
  {
    group: 'Middle Eastern',
    languages: [
      { code: 'ar', label: '🇸🇦 Arabic' },
    ],
  },
] as const;

export type LanguageCode = typeof LANGUAGE_GROUPS[number]['languages'][number]['code'];

export type LangEntry = { code: LanguageCode; label: string };

export const TRANSLATE_LANGUAGES: ReadonlyArray<LangEntry> = LANGUAGE_GROUPS.flatMap(
  (g) => g.languages as ReadonlyArray<LangEntry>
);
