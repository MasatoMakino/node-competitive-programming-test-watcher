#!/usr/bin/env node
"use strict";
const init = require("./init/init");
const program = require("commander");

program
  .usage("-i [url]")
  .option("-i, --init <URL>", "scraping test case from <URL>", String)
  .option(
    "-e, --initEmpty <number>",
    "create empty test case as <number>",
    Number
  )
  .option("-w, --watch", "watch src and test")
  .option("-r, --rollback <path>", "rollback from archive <path>", String)
  .parse(process.argv);

if (program.init) {
  console.log(program.init);
  init.initWithURL(program.init);
}
if (program.initEmpty) {
  console.log(program.initEmpty);
  init.initWithNumber(program.initEmpty);
}
