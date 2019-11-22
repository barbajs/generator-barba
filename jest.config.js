module.exports = {
  // collectCoverageFrom: ['src/**/*.ts'],
  // coverageThreshold: {
  //   global: {
  //     statements: 100,
  //     branches: 100,
  //     functions: 100,
  //     lines: 100,
  //   },
  // },
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json',
    },
  },
  resetMocks: true,
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  verbose: true,
  // DEV
  // testEnvironment: 'jest-environment-jsdom-global',
  // watchPathIgnorePatterns: ['/entries/', '/data/', '/locales/'],
};
