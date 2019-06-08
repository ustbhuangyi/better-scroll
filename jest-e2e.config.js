module.exports = {
  "verbose": true,
  "roots": ["<rootDir>"],
  "cache": false,
  "globals": {
    "ts-jest": {
      "diagnostics": false
    }
  },
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
