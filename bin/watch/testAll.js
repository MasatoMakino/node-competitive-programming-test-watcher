/**
 * テストディレクトリ内にある全てのテストを実行し、結果を出力する。
 */

"use strict";
const fs = require("fs");
const execSync = require("child_process").execSync;
const path = require("path");
const glob = require("glob");
const colors = require("colors");
const testConfig = require("../testConfig");
const dirConfig = require("../dirConfig");

module.exports = function() {
  const testDir = path.resolve(testConfig.testDirName);
  const inFiles = glob.sync(testDir + "/" + testConfig.inName + "*.txt");
  const outFiles = glob.sync(testDir + "/" + testConfig.outName + "*.txt");

  if (inFiles.length === 0) {
    console.log("ERROR : Test case files not found.".magenta);
    return;
  }

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
 * @param {string}} val
 * @param {string} result
 * @param {string} out
 */
function logFailsInfo(val, result, out) {
  console.log(("FAILS  : " + path.basename(val)).bold.magenta);
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
 * @param {Array<String>} inFiles
 * @param {Number} passCount
 * @param {Number} failsCount
 * @param {Number} errorCount
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
 * @param {Array[String]} inFiles
 * @param {Number} passCount
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
