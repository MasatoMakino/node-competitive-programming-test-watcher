const puppeteer = require("puppeteer");
const ScraperUtil = require("./ScraperUtil");
const IssueTypes = require("../issue/IssueTypes");

module.exports = class Scraper {
  constructor() {
    this.browser = null;
    this.page = null;
    this.type = IssueTypes.UNKNOWN;
  }

  initLoginArgs(arg, type) {
    if (arg == null) {
      arg = {};
    }
    if (arg.id == null || arg.pass == null) {
      const config = ScraperUtil.getCertificate(arg.path);
      arg.id = arg.id || config[type].id;
      arg.pass = arg.pass || config[type].pass;
    }
    return arg;
  }

  async evalTests(selector) {
    const tests = await this.page.$$eval(selector, list => {
      return list.map(data => {
        return data.textContent;
      });
    });
    return tests;
  }
};
