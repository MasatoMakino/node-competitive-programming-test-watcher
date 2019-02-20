const info = require("./IssueInfo");
const type = require("./IssueTypes");

const atcoder1 = info.get(
  "https://atcoder.jp/contests/practice/tasks/practice_1"
);
const atcoder2 = info.get(
  "http://contest_id.contest.atcoder.jp/tasks/problem_id"
);
const paiza1 = info.get("https://paiza.jp/career/challenges/293/retry");
const empty = info.get("");

console.log(atcoder1);
console.log(atcoder2);
console.log(paiza1);
console.log(empty);

info.save(atcoder1);
const loaded = info.load();
console.log(loaded);
