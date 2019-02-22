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

  let passCount = 0;
  let failsCount = 0;
  let errorCount = 0;

  inFiles.forEach((val, index) => {
    let resultObj;
    //ランタイムエラーが発生していないか確認
    try {
      resultObj = execSync(
        "cat " + val + ` | node ${dirConfig.distDirName}/${dirConfig.srcName}`
      );
    } catch (error) {
      errorCount++;
      console.log(("ERROR  : " + path.basename(val)).bold.red);
      console.log();
      return;
    }

    const result = resultObj.toString();
    const out = fs.readFileSync(outFiles[index], { encoding: "utf-8" });
    const isPass = result === out;
    if (isPass) passCount++;
    else failsCount++;

    if (isPass) {
      console.log(("PASSED : " + path.basename(val)).green);
    } else {
      logFailsInfo(val, result, out);
    }
  });

  logTotalCounts(inFiles, passCount, failsCount, errorCount);

  if (inFiles.length !== passCount) {
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
};

function logFailsInfo(val, result, out) {
  console.log(("FAILS  : " + path.basename(val)).bold.magenta);
  console.log("Result : ".bold.magenta);
  console.log(result.magenta);
  console.log("Expectation : ".bold.magenta);
  console.log(out.magenta);
}
/**
 * トータルの成績を出力する。
 * @param {Array<String>} inFiles
 * @param {Number} passCount
 * @param {Number} failsCount
 * @param {Number} errorCount
 */
function logTotalCounts(inFiles, passCount, failsCount, errorCount) {
  const failsCountString = failsCount.toString();
  const styledFailsCount =
    failsCount === 0 ? failsCountString.gray : failsCountString.red;

  console.log(
    "TOTAL : ",
    inFiles.length.toString().green,
    " PASSED : ",
    passCount.toString().green,
    " FAILS : ",
    styledFailsCount,
    " ERROR : ",
    errorCount.toString().red
  );
}
