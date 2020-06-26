class FakeLocalStorage implements Storage {
  [key: string]: any;
  [index: number]: string;

  length: number;

  clear(): void {
  }

  getItem(key: string): string | null {
    return null;
  }

  key(index: number): string | null {
    return null;
  }

  removeItem(key: string): void {
  }

  setItem(key: string, data: string): void {
  }

}

export const isBrowser = typeof window !== "undefined";
const fakeLocalStorage = new FakeLocalStorage();

export const localStorage = isBrowser ? window.localStorage : fakeLocalStorage;

export function setDocumentTitle(title: string) {
  if (isBrowser) {
    document.title = title;
  }
}
