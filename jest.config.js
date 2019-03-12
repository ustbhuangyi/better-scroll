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
