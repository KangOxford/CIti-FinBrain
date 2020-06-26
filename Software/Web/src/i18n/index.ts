const source = require("../assets/i18n/cn.json5");
const filesystem = require("fs");

const pri_translate = require("./translate");

function translate(content: string[], to: string[]) {
  return new Promise((resolve, reject) => {
    pri_translate(content, to, (res) => {
      resolve(res);
    }, (error) => {
      reject(error);
    });
  });
}

async function main(ori, target, targetLanguage: string) {
  for (const key in ori) {
    if (typeof ori[key] === "object") {
      target[key] = {};
      await main(ori[key], target[key], targetLanguage);
    } else {

      const oriText = ori[key];
      const splittedText = oriText.split(/({[0-9a-zA-Z]+})/);

      const needTranslate = splittedText.filter((x, i) => i % 2 == 0);

      console.log("translating ", needTranslate, "to", targetLanguage);
      let result = "//TODO";
      try {
        const res = await translate(needTranslate, [targetLanguage]);

        for (let i = 0; i < splittedText.length; i += 2) {
          splittedText[i] = res[Math.floor(i / 2)][0].text;
        }
        result = splittedText.join("");
      } catch (e) {
        console.log(e);
      }
      target[key] = result;

    }
  }
}

const result = {};

async function go() {
  const target = ["en", "fr", "ru"];
  for (const language of target) {
    console.log("translating", language);
    const result = {};
    await main(source, result, language);
    filesystem.writeFile(`./${language}.json`, JSON.stringify(result));
    console.log("translated", language);
  }
}

go().then(() => {
  console.log("completed");
});
