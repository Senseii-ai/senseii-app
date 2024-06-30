/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testEnvironment: "node",
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts", // Exclude TypeScript declaration files
    "!src/**/index.ts", // Exclude index files if you have any
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  // moduleNameMapper: {
  //   "^@controllers/(.*)$": "<rootDir>/src/controllers/$1",
  //   "^@models/(.*)$": "<rootDir>/src/models/$1",
  //   "^@services/(.*)$": "<rootDir>/src/services/$1",
  //   "^@utils/(.*)$": "<rootDir>/src/utils/$1",
  // },
};
