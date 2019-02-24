"use strict";
const path = require("path");
const URL = require("url").URL;
const fs = require("fs");
const IssueTypes = require("./IssueTypes");
const datefns = require("date-fns");
const colors = require("colors");

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
    const pathName = parsed.pathname;

    const type = this.getType(parsed);
    const issue = this.getIssue(type, pathName);
    const contestID = this.getContestID(type, parsed);

    return {
      type: type,
      url: url,
      issueID: issue,
      contestID: contestID,
      initDate: this.getDate()
    };
  },

  /**
   * ホストからサービス名情報を取り出す。
   * @param {URL} parsed パース済みのURLオブジェクト
   */
  getType(parsed) {
    let type = "";
    if (/atcoder\.jp/.test(parsed.host)) {
      type = IssueTypes.AT_CODER;
    } else if (/paiza\.jp/.test(parsed.host)) {
      type = IssueTypes.PAIZA;
    }
    return type;
  },

  /**
   * URLから課題番号を抽出する。
   * @param {string} type
   * @param {string} pathName パース済みのURLオブジェクトのpathnameプロパティ
   */
  getIssue(type, pathName) {
    let issue = "";
    switch (type) {
      case IssueTypes.AT_CODER:
        issue = pathName.split("/").pop();
        break;
      case IssueTypes.PAIZA:
        issue = pathName.split("/").slice(-2)[0];
        break;
    }
    return issue;
  },

  /**
   * コンテストIDを取得する。
   * @param {string} type
   * @param {URL} parsed
   */
  getContestID(type, parsed) {
    let contestID = "";
    switch (type) {
      case IssueTypes.AT_CODER:
        contestID = parsed.host.split(".")[0];
        if (contestID === "atcoder") {
          contestID = parsed.pathname.split("/")[2];
        }
        break;
    }
    return contestID;
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
    try {
      return JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
    } catch (error) {
      console.log("指定されたパスに課題ファイルがありません。".bold.red);
      console.log(resolvedPath);
      return null;
    }
  }
};
