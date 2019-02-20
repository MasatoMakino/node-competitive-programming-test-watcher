#!/usr/bin/env node
"use strict";
const program = require("commander");

program
  .usage("-n yourname")
  .option("-i, --init <URL>", "scraping test case from <URL>", String)
  .option(
    "-e, --initEmpty <number>",
    "create empty test case as <number>",
    Number
  )
  .option("-w, --watch", "watch src and test")
  .parse(process.argv);

console.log("Hello " + program.name + "!");
