"use strict";
const fs = require("fs");
const path = require("path");
const testConfig = require("../testConfig");
const getTestFiles = require("../watch/getTestFiles");
const addEmptyTestSet = () => {
  const tests = getTestFiles();
  if (tests === null) {
    return;
  }

  const padNum = tests.in.length.toString().padStart(4, "0");
  fs.writeFileSync(
    path.resolve(testConfig.testDirName, testConfig.inName + padNum + ".txt"),
    ""
  );
  fs.writeFileSync(
    path.resolve(testConfig.testDirName, testConfig.outName + padNum + ".txt"),
    ""
  );
};

module.exports = addEmptyTestSet;
