module.exports = {
  "verbose": true,
  globals: {},
  "roots": ["<rootDir>"],
  "cache": false,
  "testRegex": "(/__tests__/.*|\\.(test|spec))\\.(ts|js)$",
  "testPathIgnorePatterns": [
    '/__tests__/__utils__'
  ],
  "transform": {
    ".ts": "ts-jest"
  },
  "testEnvironment": "jsdom",
  "moduleFileExtensions": [
    "ts",
    "js"
  ],
  "moduleNameMapper": {
    '^@better-scroll/(.*)/(.*)$': '<rootDir>/packages/$1/$2',
    '^@better-scroll/(.*)$': '<rootDir>/packages/$1/src/index',
    '^@/(.*)$': '<rootDir>/$1'
  },
  "coverageDirectory": "<rootDir>/tests/coverage",
  "coveragePathIgnorePatterns": [
    "/test/",
    "/__tests__/"
  ],
  "coverageReporters": ['json', 'text', 'lcov', 'clover']
}
