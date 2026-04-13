export const locales = ["ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ru";

export const localeStorageKey = "relayforge-locale";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function pickLocale<T>(locale: Locale, value: { ru: T; en: T }) {
  return value[locale];
}

