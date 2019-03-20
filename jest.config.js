const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

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
  // replace with the path from your tsconfig.json file
  "moduleNameMapper": pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  "coverageDirectory": "<rootDir>/test/coverage",
  "coveragePathIgnorePatterns": [
    "/node_modules/",
    "/test/"
  ],
  "coverageReporters": ["text-summary", "lcov"],
  "coverageThreshold": {
  },
  "collectCoverageFrom": [
    "src/**/*.{js,ts}"
  ]
}
