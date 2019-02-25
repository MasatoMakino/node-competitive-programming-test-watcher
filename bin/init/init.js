"use strict";
const makeDir = require("make-dir");
const fs = require("fs");
const path = require("path");
const URL = require("url").URL;
const rimraf = require("rimraf");
const testConfig = require("../testConfig");
const IssueInfo = require("../issue/IssueInfo");
const getScraper = require("../scraping/getScraper");
const archiver = require("../archive/IssueArchiver");

const colors = require("colors");

module.exports = {
  initWithNumber(num) {
    console.log("init empty test case ...");

    //バックアップを作成。
    archiver.archive();

    const info = IssueInfo.get();
    IssueInfo.save(info);
    overrideIndex();
    const tests = new Array(num * 2).fill("");
    writeTests(tests);
  },

  async initWithURL(opt) {
    const label = "Get test cases";
    console.time(label);
    const info = IssueInfo.get(opt);
    const scraper = getScraper(info);
    await scraper.login();
    const tests = await scraper.getTest(opt);
    await scraper.browser.close();
    console.timeEnd(label);

    if (tests.length === 0) {
      console.log("テストケースの取得に失敗しました。".bold.red);
      return;
    }
    if (tests.length % 2 !== 0) {
      console.log(
        "取得されたテストの入出力数が合致していません。取得に失敗した可能性があります。"
          .bold.red
      );
    }

    //テスト読み込みに成功したらバックアップを作成。
    archiver.archive();

    //上書き処理
    overrideIndex();
    IssueInfo.save(info);
    writeTests(tests);

    console.log(("Complete : init Test case form " + opt).bold.green);
    return;
  },
  async initFromClipboard() {
    let url;
    let copied;

    try {
      copied = require("clipboardy").readSync();
      url = new URL(copied);
    } catch (error) {
      console.error(
        "クリップボードの内容がURLではありません。処理を中断します。".bold.red
      );
      return;
    }

    if (url == null) return;
    await this.initWithURL(copied);
  }
};

/**
 * index.jsファイルを上書きする
 */
async function overrideIndex() {
  const dirConfig = require("../dirConfig");
  makeDir.sync(`./${dirConfig.srcDirName}/`);
  fs.copyFileSync(
    path.resolve(__dirname, "../template.js"),
    path.resolve(`./${dirConfig.srcDirName}/${dirConfig.srcName}`)
  );
}

/**
 * 配列分のテストをファイル書き込み
 * @param {Array} tests in,outの順で並んだテストケースの配列。
 */
const writeTests = tests => {
  //既存のテストケース削除
  rimraf.sync(path.resolve(testConfig.testDirName));
  //テストケース作成
  makeDir.sync(path.resolve(testConfig.testDirName));
  const n = tests.length / 2;
  for (let i = 0; i < n; i++) {
    const padNum = i.toString().padStart(4, "0");
    fs.writeFileSync(
      path.resolve(testConfig.testDirName, testConfig.inName + padNum + ".txt"),
      tests[i * 2]
    );
    fs.writeFileSync(
      path.resolve(
        testConfig.testDirName,
        testConfig.outName + padNum + ".txt"
      ),
      tests[i * 2 + 1]
    );
  }
};
