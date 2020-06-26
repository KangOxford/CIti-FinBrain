import config from "../../../assets/i18n/index.json";

export type DeepPartial<T> = {
  [key in keyof T]: DeepPartial<T[key]>
};

export const LANGUAGE_CONFIG_TOKEN = Symbol("LanguageConfig");

export interface Language<T = Definition> {
  id: string;
  name: string;
  acceptedNavigatorLanguages: string[];
  getDefinition: Promise<T>;
  fallback?: boolean;
}

export interface KnownLanguages { languages: Language[]; }

export const languageConfig = {
  languages: config.map((x) => ({
    ...x,
    getDefinition: import(`../../../assets/i18n/${x.definitionFileName}`),
  })) as Language[],
} as KnownLanguages;

export type Definition = typeof import ("../../../assets/i18n/cn").default;
