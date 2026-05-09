'use strict';

const mockNativeModules = {
  ImageLoader: {
    prefetchImage: jest.fn(),
    getSize: jest.fn((uri, success) => process.nextTick(() => success(320, 240))),
  },
  ImageViewManager: {
    prefetchImage: jest.fn(),
    getSize: jest.fn((uri, success) => process.nextTick(() => success(320, 240))),
  },
  Linking: {
    openURL: jest.fn(),
    canOpenURL: jest.fn(),
    getInitialURL: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    getConstants: () => ({ initialURL: null, supportedURLs: [] }),
  },
  NativeUnimoduleProxy: {
    modulesConstants: {
      mockDefinition: {
        ExponentConstants: {
          experienceUrl: { mock: 'exp://192.168.1.200:8081' },
        },
      },
    },
    viewManagersMetadata: {},
    callMethod: jest.fn(),
  },
  UIManager: {
    measure: jest.fn(),
    measureInWindow: jest.fn(),
    measureLayout: jest.fn(),
    dispatchViewManagerCommand: jest.fn(),
    setJSResponder: jest.fn(),
    clearJSResponder: jest.fn(),
    configureNextLayoutAnimation: jest.fn(),
    createView: jest.fn(),
    updateView: jest.fn(),
    manageChildren: jest.fn(),
    blur: jest.fn(),
    focus: jest.fn(),
    customBubblingEventTypes: {},
    customDirectEventTypes: {},
    getViewManagerConfig: jest.fn(() => ({})),
  },
  DeviceInfo: {
    getConstants: () => ({
      Dimensions: {
        window: { fontScale: 2, height: 1334, scale: 2, width: 750 },
        screen: { fontScale: 2, height: 1334, scale: 2, width: 750 },
      },
    }),
  },
  DevSettings: {
    addMenuItem: jest.fn(),
    reload: jest.fn(),
  },
  PlatformConstants: {
    getConstants: () => ({
      forceTouchAvailable: false,
      interfaceIdiom: 'phone',
      isTesting: true,
      osVersion: '13.0',
      reactNativeVersion: { major: 0, minor: 76, patch: 0, prerelease: null },
      systemName: 'iOS',
    }),
  },
  AlertManager: { alertWithArgs: jest.fn() },
  StatusBarManager: {
    HEIGHT: 42,
    setStyle: jest.fn(),
    setHidden: jest.fn(),
    setNetworkActivityIndicatorVisible: jest.fn(),
    getHeight: jest.fn(),
    getConstants: jest.fn(() => ({ HEIGHT: 42 })),
  },
  KeyboardObserver: {
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
  AppState: {
    getCurrentAppState: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
    getConstants: jest.fn(() => ({ initialAppState: 'active' })),
  },
  Vibration: { vibrate: jest.fn(), cancel: jest.fn() },
  ExponentConstants: {
    getConstants: () => ({
      expoVersion: '53.0.0',
      installationId: 'test-installation-id',
      sessionId: 'test-session-id',
      platform: { ios: { userInterfaceIdiom: 'phone' } },
      isDevice: false,
      appOwnership: null,
      experienceUrl: 'exp://192.168.1.200:8081',
    }),
  },
  ExponentSecureStore: {
    getValueWithKeyAsync: jest.fn(),
    setValueWithKeyAsync: jest.fn(),
    deleteValueWithKeyAsync: jest.fn(),
  },
  PermissionsExponent: {
    getAsync: jest.fn(),
    askAsync: jest.fn(),
  },
  RNCNetInfo: {
    getCurrentState: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
  ExponentFileSystem: {
    documentDirectory: 'file:///test/',
    cacheDirectory: 'file:///test-cache/',
    bundleDirectory: 'file:///test-bundle/',
    downloadAsync: jest.fn(),
    getInfoAsync: jest.fn(),
    readAsStringAsync: jest.fn(),
    writeAsStringAsync: jest.fn(),
    deleteAsync: jest.fn(),
    moveAsync: jest.fn(),
    copyAsync: jest.fn(),
    makeDirectoryAsync: jest.fn(),
    readDirectoryAsync: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
};

module.exports = {
  __esModule: true,
  default: mockNativeModules,
};
