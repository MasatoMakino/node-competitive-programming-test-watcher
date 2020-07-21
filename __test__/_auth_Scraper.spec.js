"use strict";
const paiza = require("../bin/scraping/paiza");
const atcoder = require("../bin/scraping/atcoder");

const spyLog = jest.spyOn(console, "log").mockImplementation(x => x);
const spyWarn = jest.spyOn(console, "warn").mockImplementation(x => x);
const spyError = jest.spyOn(console, "error").mockImplementation(x => x);
jest.setTimeout(30 * 1000); //スクレイピングテストはタイムアウト30秒。

describe("Scraper", () => {
  async function testModule(loader, url) {
    await loader.login();
    const tests = await loader.getTest(url);
    loader.browser.close();
    return tests;
  }

  test("AtCoder.jp", async () => {

    const tests = await testModule(
      new atcoder(),
      "https://atcoder.jp/contests/abs/tasks/abc086_a"
    );
    expect(tests).toEqual(["3 4\n", "Even\n", "1 21\n", "Odd\n"]);
  });
  test("paiza.jp", async () => {
    const tests = await testModule(
      new paiza(),
      "https://paiza.jp/career/challenges/293/retry"
    );
    expect(tests).toEqual(["6\n4 5 2 3 6 1\n", "21\n", "1\n4\n", "4\n"]);
  });
});
