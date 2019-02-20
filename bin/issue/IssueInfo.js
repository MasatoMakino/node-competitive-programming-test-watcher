"use strict";
const path = require("path");
const URL = require("url").URL;
const fs = require("fs");
const IssueTypes = require("./IssueTypes");
const datefns = require("date-fns");

/**
 * 課題の情報を保存、読み込みを行うモジュールです。
 * どのコンテストのどの課題を実行中かを記録します。
 */
module.exports = {
  JSON_NAME: "issue_info.json",
  JSON_PATH() {
    return path.resolve("./" + this.JSON_NAME);
  },

  /**
   * urlから課題情報を保存したjsonオブジェクトを生成する。
   * @param {string} url
   */
  get(url) {
    if (url == null || url === "") {
      return this.getEmptyInfo();
    }
    const parsed = new URL(url);

    //タイプ判定
    let type = "";
    if (/atcoder\.jp/.test(parsed.host)) {
      type = IssueTypes.AT_CODER;
    } else if (/paiza\.jp/.test(parsed.host)) {
      type = IssueTypes.PAIZA;
    }

    //課題判定
    const pathName = parsed.pathname;
    console.log(pathName);
    let issue = "";
    switch (type) {
      case IssueTypes.AT_CODER:
        issue = pathName.split("/").pop();
        break;
      case IssueTypes.PAIZA:
        issue = pathName.split("/").slice(-2)[0];
        break;
    }

    //コンテストID
    let contestID = "";
    switch (type) {
      case IssueTypes.AT_CODER:
        contestID = parsed.host.split(".")[0];
        if (contestID === "atcoder") {
          contestID = pathName.split("/")[2];
        }
        break;
    }

    return {
      type: type,
      url: url,
      issueID: issue,
      contestID: contestID,
      initDate: this.getDate()
    };
  },

  /**
   * URL未指定の場合のjsonオブジェクトを生成する。
   */
  getEmptyInfo() {
    const dateString = this.getDate();
    return {
      type: IssueTypes.UNKNOWN,
      url: "",
      issueID: dateString,
      contestID: "",
      initDate: dateString
    };
  },

  /**
   * JSON用のフォーマット済みDateを取得する。
   */
  getDate() {
    return datefns.format(new Date(), "YYYYMMDD_HHmmss");
  },

  /**
   * JSONオブジェクトをファイルに保存する。
   * @param {JSON} info
   */
  save(info) {
    const filePath = this.JSON_PATH();
    fs.writeFileSync(filePath, JSON.stringify(info));
  },
  /**
   * ファイルからjsonオブジェクトを復元する。
   * @param {string} [filePath]
   */
  load(filePath) {
    let resolvedPath;
    if (filePath == null || filePath === "") {
      resolvedPath = this.JSON_PATH();
    } else {
      resolvedPath = path.resolve(filePath);
    }
    return require(resolvedPath);
  }
};
