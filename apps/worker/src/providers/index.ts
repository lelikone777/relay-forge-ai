import { groqProvider } from "./groq";
import { mockProvider } from "./mock";
import { openRouterProvider } from "./openrouter";

export const providers = {
  groq: groqProvider,
  openrouter: openRouterProvider,
  mock: mockProvider
};
