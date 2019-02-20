"use strict";
const AtCoderModule = require("./atcoder");
const PaizaModule = require("./paiza");
const IssueTypes = require("../issue/IssueTypes");

const getScraper = issueInfo => {
  switch (issueInfo.type) {
    case IssueTypes.AT_CODER:
      return new AtCoderModule();
    case IssueTypes.PAIZA:
      return new PaizaModule();
  }
};

module.exports = getScraper;
