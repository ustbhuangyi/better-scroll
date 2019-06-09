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
  "testMatch": ["**/tests/e2e/**/*.ts"],
  "transform": {
    ".ts": "ts-jest"
  },
  "moduleFileExtensions": [
    "ts",
    "js"
  ]
}
