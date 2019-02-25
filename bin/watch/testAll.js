/**
 * テストディレクトリ内にある全てのテストを実行し、結果を出力する。
 */

"use strict";
const fs = require("fs");
const execSync = require("child_process").execSync;
const path = require("path");
const colors = require("colors");
const dirConfig = require("../dirConfig");
const getTestFiles = require("./getTestFiles");

module.exports = function() {
  const tests = getTestFiles();
  if (tests === null) {
    console.log("cancel");
    return;
  }

  const inFiles = tests.in;
  const outFiles = tests.out;

  const count = {
    total: inFiles.length,
    pass: 0,
    fails: 0,
    error: 0
  };

  inFiles.forEach((val, index) => {
    const result = runTest(val, count);
    if (result == null) return;

    compare(outFiles[index], result, count);
  });

  logTotalCounts(count);
  logResult(count);
};

/**
 * テストを実行する
 * @param {string} inFilePath
 * @param {Object} count
 * @param {number} count.total
 * @param {number} count.pass
 * @param {number} count.fails
 * @param {number} count.error
 * @returns {string|null} 実行結果
 */
function runTest(inFilePath, count) {
  try {
    const result = execSync(
      "cat " +
        inFilePath +
        ` | node ${dirConfig.distDirName}/${dirConfig.srcName}`
    ).toString();
    return result;
  } catch (error) {
    count.error++;
    logErrorInfo(inFilePath);
    return null;
  }
}

/**
 * テスト結果と期待値を比較し、結果を出力する。
 * @param {string} outFilePath
 * @param {string} result
 * @param {Object} count
 * @param {number} count.total
 * @param {number} count.pass
 * @param {number} count.fails
 * @param {number} count.error
 */
function compare(outFilePath, result, count) {
  const out = fs.readFileSync(outFilePath, { encoding: "utf-8" });
  const isPass = result === out;
  if (isPass) {
    count.pass++;
    console.log(("PASSED : " + path.basename(outFilePath)).green);
  } else {
    count.fails++;
    logFailsInfo(outFilePath, result, out);
  }
}

/**
 * テスト失敗時の出力を行う。
 * @param {string} outFilePath テストケースファイルのパス
 * @param {string} result 実行した結果
 * @param {string} out テストケースファイルの内容
 */
function logFailsInfo(outFilePath, result, out) {
  console.log(("FAILS  : " + path.basename(outFilePath)).bold.magenta);
  console.log("Result : ".bold.magenta);
  console.log(result.magenta);
  console.log("Expectation : ".bold.magenta);
  console.log(out.magenta);
}

/**
 * ランタイムエラー発生時の出力。
 * @param {string}} val テストファイルのパス。
 */
function logErrorInfo(val) {
  console.log(("ERROR  : " + path.basename(val)).bold.red);
  console.log();
  return;
}
/**
 * トータルの成績を出力する。
 * @param {Object} count
 * @param {number} count.total
 * @param {number} count.pass
 * @param {number} count.fails
 * @param {number} count.error
 */
function logTotalCounts(count) {
  const failsCountString = count.fails.toString();
  const styledFailsCount =
    count.fails === 0 ? failsCountString.gray : failsCountString.red;

  console.log(
    "TOTAL : ",
    count.total.toString().green,
    " PASSED : ",
    count.pass.toString().green,
    " FAILS : ",
    styledFailsCount,
    " ERROR : ",
    count.error.toString().red
  );
}

/**
 * 最終結果を発表する。
 * @param {Object} count
 * @param {number} count.total
 * @param {number} count.pass
 * @param {number} count.fails
 * @param {number} count.error
 */
function logResult(count) {
  if (count.total !== count.pass) {
    console.log("Fails an exam".bold.magenta);
    return;
  }
  console.log("Passing all exam".bold.green);
  fs.readFile(
    `./${dirConfig.distDirName}/${dirConfig.srcName}`,
    "utf-8",
    (err, data) => {
      require("clipboardy").write(data);
    }
  );
}
