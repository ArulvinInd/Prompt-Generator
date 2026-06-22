/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_COPILOT_API_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
