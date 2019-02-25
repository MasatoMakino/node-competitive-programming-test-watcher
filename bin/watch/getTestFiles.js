"use strict";
const path = require("path");
const glob = require("glob");
const colors = require("colors");
const testConfig = require("../testConfig");

function getTestFiles() {
  const testDir = path.resolve(testConfig.testDirName);
  const inFiles = glob.sync(testDir + "/" + testConfig.inName + "*.txt");
  const outFiles = glob.sync(testDir + "/" + testConfig.outName + "*.txt");

  if (inFiles.length === 0) {
    console.log("ERROR : Test case files not found.".bold.magenta);
    return null;
  }
  if (inFiles.length !== outFiles.length) {
    console.log("ERROR : Number of test case files do not match.".bold.magenta);
    return null;
  }
  return {
    in: inFiles,
    out: outFiles
  };
}
module.exports = getTestFiles;
