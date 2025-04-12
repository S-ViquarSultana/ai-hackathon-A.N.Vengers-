/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
} 
interface ImportMetaEnv {
  VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  env: ImportMetaEnv;
}

declare const importMeta: ImportMeta; 