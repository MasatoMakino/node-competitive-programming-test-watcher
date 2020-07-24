const {defaults} = require('jest-config');
const baseConfig = require("./jest.config");

baseConfig.testPathIgnorePatterns = [...defaults.testPathIgnorePatterns];
module.exports = baseConfig;
