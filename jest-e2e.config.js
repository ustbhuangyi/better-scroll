module.exports = {
  "verbose": true,
  "roots": ["<rootDir>"],
  "cache": false,
  "preset": "jest-puppeteer",
  "testRegex": "tests/e2e/.*\.e2e\.ts$",
  "transform": {
    ".ts": "ts-jest"
  },
  "moduleFileExtensions": [
    "ts",
    "js"
  ]
}
