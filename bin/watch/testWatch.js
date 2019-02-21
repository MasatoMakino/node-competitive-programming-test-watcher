"use strict";
const chokidar = require("chokidar");
const testAll = require("./testAll");
const dirConfig = require("../dirConfig");
const testConfig = require("../testConfig");

module.exports = function() {
  chokidar
    .watch(
      [
        `./${dirConfig.distDirName}/**/*.js`,
        `./${testConfig.testDirName}/**/*`
      ],
      {
        ignoreInitial: true
      }
    )
    .on("all", (event, path) => {
      testAll();
    });
};
