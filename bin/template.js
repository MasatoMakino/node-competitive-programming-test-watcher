/**
 * 標準入力を受け取り行単位の配列にして返す処理。
 * 同期処理。
 */
function readDevStdIn() {
  let input = require("fs")
    .readFileSync("/dev/stdin", "utf8")
    .split("\n");

  //行末が空行の場合は削除
  if (input[input.length - 1] === "") {
    input.pop();
  }
  return input;
}
function main() {
  const inputs = readDevStdIn();
  console.log(inputs[0]);
}
main();
