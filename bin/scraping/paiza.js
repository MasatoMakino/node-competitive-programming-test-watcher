const puppeteer = require("puppeteer");
const URL = require("url").URL;
const ScraperUtil = require("./ScraperUtil");

module.exports = class PaizaScraper {
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

    await this.page.goto("https://paiza.jp/user_sessions/new_cbox", {
      waitUntil: "domcontentloaded"
    });

    console.log("logging in...");

    await this.page.type('input[id="user_email"]', arg.id);
    await this.page.type('input[id="user_password"]', arg.pass);

    await Promise.all([
      this.page.waitForNavigation({
        waitUntil: "domcontentloaded"
      }),
      this.page.click("input.btn_login")
    ]);

    console.log("login");

    return;
  }

  /**
   * 問題ページを取得する。
   * @param {string} url
   */
  async getTest(url) {
    await this.jump(url);

    const tests = await this.page.$$eval(
      "div.sample-container pre.sample-content__input > code",
      list => {
        return list.map(data => {
          return data.textContent;
        });
      }
    );

    console.log(tests);
    return tests;
  }

  /**
   * 問題画面に遷移する
   * @param {string} url
   */
  async jump(url) {
    const parsedURL = new URL(url);
    const pathName = parsedURL.pathname;
    const type = pathName.split("/").pop();

    //再挑戦タイプのページは単一のリファラで繊維可能。
    if (type === "retry") {
      await this.page.goto(url, {
        waitUntil: "domcontentloaded",
        referer: "https://paiza.jp/career/mypage/results"
      });
      return;
    }

    const selector = 'a[href="' + pathName + '"]';

    const ranks = ["d", "c", "b", "a", "s"];
    for (let i = 0; i < ranks.length; i++) {
      const rankURL = "https://paiza.jp/challenges/ranks/" + ranks[i];
      console.log("searching issue form " + rankURL + " ...");
      await this.page.goto(rankURL, {
        waitUntil: "domcontentloaded"
      });

      const linkButtons = await this.page.$$(selector);
      if (linkButtons.length === 0) continue;

      await Promise.all([
        this.page.waitForNavigation({
          waitUntil: "domcontentloaded"
        }),
        this.page.click(selector)
      ]);

      return;
    }
  }
};
