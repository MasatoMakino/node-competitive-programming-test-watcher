"use strict";
const puppeteer = require("puppeteer");
const path = require("path");
const colors = require("colors");
/**
 * 各サイトのスクレイピング処理で、共通化可能な処理をまとめるモジュール。
 */
module.exports = {
  /**
   * 各サイトへの認証情報を取得する。
   */
  getCertificate(filePath) {
    if (filePath == null || filePath == "") {
      filePath = "./cret.json";
    }
    try {
      const cretPath = path.resolve(filePath);
      return require(cretPath);
    } catch (error) {
      console.log(
        "ID, パスワードファイルがありません。READMEを参考にパスワードファイルを設置してください。"
          .red
      );
      throw error;
    }
  },
  /**
   * ブラウザを起動する。
   */
  async getBrowser() {
    return await puppeteer.launch({
      args: ["--proxy-server='direct://'", "--proxy-bypass-list=*"]
    });
  },

  /**
   * タブを起動する。
   * この関数で取得されたタブは画像、CSS、Webフォントのダウンロードを行わない。
   * @param {Browser} browser
   */
  async getPage(browser) {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", request => {
      if (
        ["image", "stylesheet", "font"].indexOf(request.resourceType()) !== -1
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });
    return page;
  }
};
