import { LocaleStore } from "./LocaleStore/LocaleStore";
import { LANGUAGE_CONFIG_TOKEN, languageConfig } from "./definitions";

export default [
  {provide: LocaleStore, useClass: LocaleStore },
  {provide: LANGUAGE_CONFIG_TOKEN, useValue: languageConfig},
];
