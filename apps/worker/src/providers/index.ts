import { cerebrasProvider } from "./cerebras";
import { geminiProvider } from "./gemini";
import { groqProvider } from "./groq";
import { mockProvider } from "./mock";
import { openRouterProvider } from "./openrouter";
import { sambaNovaProvider } from "./sambanova";

export const providers = {
  groq: groqProvider,
  sambanova: sambaNovaProvider,
  cerebras: cerebrasProvider,
  gemini: geminiProvider,
  openrouter: openRouterProvider,
  mock: mockProvider
};
