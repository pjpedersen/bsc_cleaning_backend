module.exports = {
    rootDir: './src',
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/__tests__'],
    transform: {
      '^.+\\.tsx?$': 'ts-jest'
    },
    testMatch: ['**/*.test.ts']
  };
  