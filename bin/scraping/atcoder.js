const puppeteer = require("puppeteer");
const ScraperUtil = require("./ScraperUtil");

module.exports = class AtCoderScraper {
  constructor() {
    this.browser = null;
    this.page = null;
  }

  /**
   * ログインする
   * @param {string} arg.id
   * @param {string} arg.pass
   * @param {string} arg.path
   */
  async login(arg) {
    if (arg == null) {
      arg = {};
    }
    if (arg.id == null || arg.pass == null) {
      const config = ScraperUtil.getCertificate(arg.path);
      arg.id = arg.id || config.paiza.id;
      arg.pass = arg.pass || config.paiza.pass;
    }

    this.browser = await ScraperUtil.getBrowser();
    this.page = await ScraperUtil.getPage(this.browser);

    await this.page.goto("https://atcoder.jp/login", {
      waitUntil: "networkidle2"
    });

    const isLogin = await this.page.evaluate(() => {
      const node = document.querySelectorAll(
        '[href="javascript:form_logout.submit()"]'
      );
      return node.length ? true : false;
    });

    if (!isLogin) {
      console.log("logging in...");
      await this.page.type('input[id="username"]', arg.id);
      await this.page.type('input[id="password"]', arg.pass);
      //clickナビゲーションはawaitしない。
      this.page.click("#submit");
      await this.page.waitForNavigation({
        waitUntil: "domcontentloaded"
      });
    }
    console.log("login");

    return;
  }

  /**
   * 問題ページを取得する。
   * @param {string} url
   */
  async getTest(url) {
    await this.page.goto(url, {
      waitUntil: "networkidle2"
    });

    const tests = await this.page.$$eval(
      ":scope span.lang-ja div.div-btn-copy + pre",
      list => {
        return list.map(data => {
          return data.textContent;
        });
      }
    );

    console.log(tests);
    return tests;
  }
};
