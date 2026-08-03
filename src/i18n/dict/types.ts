export type Language = "id" | "en" | "zh" | "ru";
export type TranslationMap = Record<string, string>;
export type Dictionary = Record<Language, TranslationMap>;