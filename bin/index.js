#!/usr/bin/env node
"use strict";
const init = require("./init/init");
const rollup = require("./watch/rollup");
const test = require("./watch/testAll");
const testWatch = require("./watch/testWatch");
const program = require("commander");

program
  .usage("-i [url]")
  .option("-i, --init <URL>", "scraping test case from <URL>", String)
  .option(
    "-e, --initEmpty <number>",
    "create empty test case as <number>",
    Number
  )
  .option("-w, --watch", "watch src and test directory")
  .option("-r, --rollback <path>", "rollback from archive <path>", String)
  .option("-t, --test", "test dist file")
  .parse(process.argv);

if (program.init) {
  init.initWithURL(program.init);
}
if (program.initEmpty) {
  init.initWithNumber(program.initEmpty);
}
if (program.watch) {
  rollup(true);
  testWatch();
}
if (program.test) {
  test();
}
