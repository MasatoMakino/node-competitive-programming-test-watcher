const paiza = require("./paiza");
const atcoder = require("./atcoder");

async function testModule(loader, url) {
  console.time("gettests");
  await loader.login();
  const tests = await loader.getTest(url);
  console.timeEnd("gettests");
  console.time("closeBrowser");
  loader.browser.close();
  console.timeEnd("closeBrowser");
}
async function testPaiza() {
  await testModule(new paiza(), "https://paiza.jp/career/challenges/293/retry");
}
async function testAtCoder() {
  await testModule(
    new atcoder(),
    "https://atcoder.jp/contests/abs/tasks/abc086_a"
  );
}

async function test() {
  await testPaiza();
  await testAtCoder();
}

test();
