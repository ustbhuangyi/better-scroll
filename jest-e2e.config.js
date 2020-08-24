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
  "testMatch": ["**/tests/e2e/pulldown/*.e2e.ts"],
  // "testMatch": ["**/tests/e2e/compose-plugins/*.e2e.ts"],
  "transform": {
    ".ts": "ts-jest"
  },
  "moduleFileExtensions": [
    "ts",
    "js"
  ]
}
