# node-competitive-programming-watcher

> Competitive programming helper for Node.js.

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)
[![Maintainability](https://api.codeclimate.com/v1/badges/c8be8fee297b343bc446/maintainability)](https://codeclimate.com/github/MasatoMakino/node-competitive-programming-watcher/maintainability)
[![Build Status](https://travis-ci.org/MasatoMakino/node-competitive-programming-watcher.svg?branch=master)](https://travis-ci.org/MasatoMakino/node-competitive-programming-watcher)

## setup

### Install

```bash
$ yarn add https://github.com/MasatoMakino/node-competitive-programming-watcher.git -D
```

### auth.json

Please set your authentication in `./auth.json`.

```auth.json
{
  "atcoder": {
    "id": "...",
    "pass": "..."
  },
  "paiza": {
    "id": "...",
    "pass": "..."
  }
}
```

### .babelrc

Please set up the `./.babelrc`.

```.babelrc
{
  "presets": [
    [
      "@babel/preset-env",{
        "modules": false
      }
    ]
  ]
}
```

## Usage

Call functions with the `ctw` command.

```
  npx ctw -t
```

### init

Scrape the test case from < URL >.

```
  -i, --init <URL>          scraping test case from <URL>.
  --initFromClipboard       scraping test case on clipboard URL.
```

### watch

Monitors your file updates and runs tests.
If passing all the tests, save the code on your clipboard.

```
-w, --watch watch src and test directory.
```

For other uses, refer to the `--help` command.

## package.json

If you use [NPM-Scripts](https://marketplace.visualstudio.com/items?itemName=traBpUkciP.vscode-npm-scripts), you can use this package from `package.json`.

```package.json
  "scripts": {
    "watch": "ctw -w",
    "testAll": "ctw -t",
    "init": "ctw --initFromClipboard",
    "add": "ctw -a"
  }
```

## License

[MIT licensed](LICENSE).
