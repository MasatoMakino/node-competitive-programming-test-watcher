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
      filePath = "./auth.json";
    }
    try {
      const authPath = path.resolve(filePath);
      return require(authPath);
    } catch (error) {
      console.log(
        "ID, パスワードファイルがありません。READMEを参考にパスワードファイルを設置してください。"
          .bold.red
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
    let page;

    //既存のタブがある場合は再利用。
    const pages = await browser.pages();
    if (pages.length !== 0) {
      page = pages[0];
    } else {
      page = await browser.newPage();
    }

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
