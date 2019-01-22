module.exports = {
  "verbose": true,
  "roots": ["<rootDir>/test/unit"],
  "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|js)$",
  "transform": {
    ".ts": "ts-jest"
  },
  "testEnvironment": "jsdom",
  "moduleFileExtensions": [
    "ts",
    "js"
  ],
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/test/"
  ],
  "coverageThreshold": {
    "global": {
      "branches": 90,
      "functions": 95,
      "lines": 95,
      "statements": 95
    }
  },
  "collectCoverageFrom": [
    "src/*.{js,ts}"
  ]
}
