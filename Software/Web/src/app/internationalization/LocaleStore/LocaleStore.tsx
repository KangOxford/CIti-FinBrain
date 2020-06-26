import { LANGUAGE_CONFIG_TOKEN, Definition, KnownLanguages, Language } from "../definitions";
import { action, computed, observable, runInAction } from "mobx";
import { Inject, Injectable } from "react.di";
import React from "react";
import { GET_VALUE, Lang } from "./lang";

export interface ReplacementMap {[key: string]: React.ReactNode; }

const idSeparator = ".";

type LoadedLanguage = Language & { definitions: Definition };

@Injectable
export class LocaleStore {
  private availableLanguages: Map<string, Language> = new Map();
  private loadedLanguages: Map<string, LoadedLanguage> = new Map();

  @observable.ref currentLanguage: LoadedLanguage;

  fallbackLanguage: LoadedLanguage;

  config: Language[];

  constructor(@Inject(LANGUAGE_CONFIG_TOKEN) config: KnownLanguages) {
    this.config = config.languages; // avoid multi inject
  }

  @computed get definitions() {
    return this.currentLanguage.definitions;
  }

  @computed get allLanguages(): Language[] {
    return Array.from(this.availableLanguages.values());
  }

  async loadLanguage(id: string): Promise<LoadedLanguage> {

    if (!this.availableLanguages.has(id)) {
      return this.fallbackLanguage;
    }
    if (this.loadedLanguages.has(id)) {
      return this.loadedLanguages.get(id);
    }
    const language = this.availableLanguages.get(id);
    const definitions = ((await language.getDefinition) as any).default;

    const loaded = { ...language, definitions};
    this.loadedLanguages.set(language.id, loaded);
    return loaded;
  }

  @action async init(defaultLanguageId: string) {
    let fallbackId = null;
    for (const l of this.config) {
      this.availableLanguages.set(l.id, l);
      if (l.fallback) {
        fallbackId = l.id;
      }
    }

    this.currentLanguage = await this.loadLanguage(defaultLanguageId || fallbackId);
    this.fallbackLanguage = await this.loadLanguage(fallbackId);

  }

  get(id: string | Lang, replacements?: ReplacementMap): React.ReactNode[] | string {
    const trueId = id instanceof Lang ? id[GET_VALUE] : id;
    const definition = this.retrieveDefinition(trueId);
    return this.replace(definition, replacements);
  }

  replace(format: string, replacements?: ReplacementMap): React.ReactNode[] | string {
    const splitter = /({[0-9a-zA-Z]+})/;
    const array = format.split(splitter);
    const newArray = array as React.ReactNode[];
    let elementReplaced = false;
    if (replacements) {
      for (let i = 1; i < array.length; i += 2) {
        const tag = array[i].substr(1, array[i].length - 2);
        const replacement = replacements[tag];
        if (replacement) {
          if (React.isValidElement(replacement)) {
            elementReplaced = true;
            newArray[i] = <React.Fragment key={i}>{replacement}</React.Fragment>;
          } else {
            newArray[i] = replacement;
          }
        }
      }
    }

    if (elementReplaced) {
      return newArray;
    } else {
      return newArray.join("");
    }
  }

  private retrieveDefinition(id: string) {
    let content = this.definitions;
    let fallbackContent = this.fallbackLanguage.definitions;
    let onFallback = false;
    for (const key of id.split(idSeparator)) {
      if (typeof content === "undefined") {
        throw new RangeError(`unidentified id ${id}`);
      }
      if (key in content) {
        if (!onFallback) {
          fallbackContent = fallbackContent[key];
        }
        content = content[key];
      } else {
        // fallback occurs.
        // redirect the content to fallback
        content = fallbackContent[key];
        onFallback = true;
      }
    }
    if (typeof content !== "string") {
      throw new RangeError(`id ${id} does not refer to a string. actual value: ${content}`);
    }
    return content;
  }

  @action async changeLanguage(id: string) {
    const newLanguage = await this.loadLanguage(id);
    runInAction(`Language ${newLanguage.name} selected and loaded.`, () => {
      this.currentLanguage = newLanguage;
    });

  }
}
