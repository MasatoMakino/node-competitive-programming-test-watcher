const puppeteer = require("puppeteer");
const URL = require("url").URL;
const ScraperUtil = require("./ScraperUtil");
const Scraper = require("./Scraper");
const IssueTypes = require("../issue/IssueTypes");

module.exports = class PaizaScraper extends Scraper {
  constructor() {
    super();
    this.type = IssueTypes.PAIZA;
  }

  /**
   * ログインする
   * @param {string} arg.id
   * @param {string} arg.pass
   * @param {string} arg.path
   */
  async login(arg) {
    arg = super.initLoginArgs(arg, this.type);

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

    const tests = await super.evalTests(
      "div.sample-container pre.sample-content__input > code"
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
      await this.jumpToRetryPage(url);
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

      this.jumpToShowPage(selector);
      return;
    }
  }

  /**
   * retry型の問題ページに飛ぶ。
   * 固定のリファラをつけて直接遷移が可能。
   * @param {string} url
   */
  async jumpToRetryPage(url) {
    await this.page.goto(url, {
      waitUntil: "domcontentloaded",
      referer: "https://paiza.jp/career/mypage/results"
    });
    return;
  }

  /**
   * show型の問題ページに飛ぶ。
   * 課題リストページから該当するリンクボタンを指定してクリックし、遷移させる。
   * @param {string} selector aリンクセレクタ。
   */
  async jumpToShowPage(selector) {
    await Promise.all([
      this.page.waitForNavigation({
        waitUntil: "domcontentloaded"
      }),
      this.page.click(selector)
    ]);
    return;
  }
};
