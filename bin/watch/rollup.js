"use strict";
const path = require("path");
const rollup = require("rollup");
const babel = require("rollup-plugin-babel");
const dirConfig = require("../dirConfig");

const inputOptions = {
  input: path.resolve(dirConfig.srcDirName, dirConfig.srcName),
  plugins: [babel()]
};
const outputOptions = {
  format: "cjs",
  file: path.resolve(dirConfig.distDirName, dirConfig.srcName)
};
const watchOption = Object.assign({}, inputOptions);
watchOption.output = outputOptions;

async function build(inputOptions, outputOptions) {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.write(outputOptions);
}

module.exports = function(isWatch) {
  if (!isWatch) {
    build(inputOptions, outputOptions);
  } else {
    console.log("watching rollup.js...");
    const watcher = rollup.watch(watchOption);
  }
};
