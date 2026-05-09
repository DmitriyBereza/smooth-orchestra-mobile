/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFiles: [
    './jest.pre-setup.js',
    '<rootDir>/node_modules/react-native/jest/setup.js',
    '<rootDir>/node_modules/jest-expo/src/preset/setup.js',
    './jest.setup.js',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/(?!next-adapter)|@expo-google-fonts|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|react-native-markdown-display)',
  ],
  moduleNameMapper: {
    '^expo-secure-store$': '<rootDir>/__mocks__/expo-secure-store.ts',
    '^react-native/Libraries/BatchedBridge/NativeModules$': '<rootDir>/__mocks__/native-modules.js',
  },
  testEnvironment: './jest-environment.js',
  testTimeout: 15000,
};
