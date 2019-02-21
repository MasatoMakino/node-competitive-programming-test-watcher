"use strict";
const issueInfo = require("../issue/IssueInfo");
const testConfig = require("../testConfig");
const fs = require("fs");
const path = require("path");
const makeDir = require("make-dir");
const datefns = require("date-fns");
const cpx = require("cpx");
const rimraf = require("rimraf");

module.exports = {
  /**
   * 現状のソースファイル、テストケース、出力コードをバックアップする。
   * テンプレートファイルはアーカイブ対象外。
   */
  archive() {
    const dirConfig = require("../dirConfig");
    const info = issueInfo.load();
    if (info == null) return;

    let archiveDir = "./archive/";
    archiveDir += info.type + "/";
    if (info.contestID != null && info.contestID != "") {
      archiveDir += info.contestID + "/";
    }
    archiveDir += info.issueID + "/";
    archiveDir += issueInfo.getDate() + "/";
    archiveDir = path.resolve(archiveDir);
    makeDir.sync(archiveDir);

    fs.copyFileSync(
      issueInfo.JSON_PATH(),
      path.resolve(archiveDir, issueInfo.JSON_NAME)
    );
    cpx.copySync(
      `./${dirConfig.srcDirName}/**/!(_|template)*.js`,
      path.resolve(archiveDir, dirConfig.srcDirName)
    );
    cpx.copySync(
      `./${dirConfig.distDirName}/**/*.js`,
      path.resolve(archiveDir, dirConfig.distDirName)
    );
    cpx.copySync(
      `./${testConfig.testDirName}/**/*`,
      path.resolve(archiveDir, "test")
    );
  },

  /**
   * 指定されたアーカイブディレクトリからファイルを復元する。
   * @param {string} dirPath
   *   ディレクトリパス。
   *   タイムスタンプ付きのディレクトリを指定すると、そのディレクトリのファイルを復元する。
   *   issueフォルダを指定すると、そのディレクトリ内の最新のアーカイブを復元する。
   * @param {boolean} isDryRun
   */
  rollback(dirPath, isDryRun) {
    const dirConfig = require("../dirConfig");
    if (isDryRun === undefined) isDryRun = false;

    if (dirPath == null || dirPath == "") {
      console.log("復元対象を指定してください。");
      return;
    }

    const archiveDir = this.getArchiveDir(dirPath);
    if (archiveDir == null) {
      return;
    }
    console.log(("restore from " + archiveDir).green);
    if (isDryRun) {
      return;
    }

    fs.copyFileSync(
      path.resolve(archiveDir, issueInfo.JSON_NAME),
      issueInfo.JSON_PATH()
    );

    makeDir.sync(path.resolve(`./${dirConfig.srcDirName}/`));
    fs.copyFileSync(
      path.resolve(archiveDir, dirConfig.srcDirName, dirConfig.srcName),
      path.resolve(`./${dirConfig.srcDirName}/${dirConfig.srcName}`)
    );

    //既存のテストケース削除
    rimraf.sync(path.resolve(testConfig.testDirName));
    rimraf.sync(path.resolve(dirConfig.distDirName));
    cpx.copySync(
      path.resolve(archiveDir, dirConfig.distDirName) + "/**/*",
      path.resolve(dirConfig.distDirName)
    );
    cpx.copySync(
      path.resolve(archiveDir, "test") + "/**/*",
      path.resolve(testConfig.testDirName)
    );
  },
  /**
   * 指定されたディレクトリにissue_infoが存在するか確認する
   * @param {string}} dirPath
   */
  getArchiveDir(dirPath) {
    const resolvedPath = path.resolve(dirPath);

    if (!fs.existsSync(resolvedPath)) {
      console.log("指定されたディレクトリが存在しません。".red);
      return;
    }

    if (this.hasIssueJson(dirPath)) {
      return resolvedPath;
    }

    const list = fs
      .readdirSync(resolvedPath)
      .sort()
      .reverse()
      .filter(val => {
        return /^[0-9_]*$/.test(val);
      });
    const listHead = path.resolve(dirPath, list[0]);
    if (this.hasIssueJson(listHead)) {
      return listHead;
    }

    console.log(
      "ディレクトリ内にアーカイブフィイルを発見できませんでした。".red
    );
    return;
  },

  /**
   * 指定されたディレクトリに課題情報が存在するか確認する。
   * @param {string} dir
   */
  hasIssueJson(dir) {
    const archivedJsonPath = path.resolve(dir, issueInfo.JSON_NAME);
    return fs.existsSync(archivedJsonPath);
  }
};
