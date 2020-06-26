
import { expect } from "chai";
import * as React from "react";
import { LocaleStore } from "./LocaleStore";
import { Language } from "../definitions";

const dummyLanguages = { languages: [
  { id: "LA", name: "", acceptedNavigatorLanguages: ["zh-CN"], fallback: true,
    getDefinition: (async () => (
      {
        a: {
          b: "AB",
          c: "AC{placeholder1}",
        },
        b: {
          complex: "{a}ABC{a}{b}cc",
        },
      }))(),
  }, {
    id: "LB", name: "", acceptedNavigatorLanguages: ["zh-CN"], fallback: false,
    getDefinition: (async () => (
      {
        a: {
          c: "AC{placeholder1}",
        },
        b: {
          complex: "{a}ABC{a}{b}cc",
        },
      }))(),
  },
] as Array<Language<any>>,
};

describe("LocaleStore Test Replace", async () => {
  const store = new LocaleStore(dummyLanguages);
  await store.init("zh-CN");
  it("should replace only string", () => {
    const format = "123{name}456";
    const replacements = { name: "156"};
    const result = store.replace(format, replacements);
    expect(result).eq("123156456");
  });
  it("should replace string with react element", () => {
    const format = "123{element}456{text}";
    const replacements = { element: <span>1</span>, text: "156"};
    const result = store.replace(format, replacements);
    expect(result[0]).eq("123");
    expect(result.slice(2)).deep.eq(["456", "156", ""]);
    expect(React.isValidElement(result[1])).eq(true);
  });
  // it("should replace multiple elements with repeated tags", () => {
  //   const format = "123{e1}456{e2}789{e1}";
  //   const replacements = { e1: <a/>,e2: <span/>};
  //   const result = store.replace(format, replacements);
  //   expect(result).eq(["123",<a key={1}/>,"456",<span key={3}/>,"789",<a key={5}/>,""]);
  // });
});
//
// describe("Locale Store Test",async  () => {
//   const store = new LocaleStore(dummyLanguages);
//
//   await store.init();
//
// });
