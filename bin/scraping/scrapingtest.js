const paiza = require("./paiza");
const atcoder = require("./atcoder");

async function testModule(loader, url) {
  await loader.login();
  const tests = await loader.getTest(url);
  await loader.browser.close();
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
