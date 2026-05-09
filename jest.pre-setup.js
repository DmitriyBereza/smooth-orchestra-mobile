// Pre-setup: mock NativeModules before jest-expo's setup.js runs
// This fixes a compatibility issue between jest-expo 53 and react-native 0.76
// where NativeModules.js uses ES module syntax that can't be directly required.

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
  },
  NativeUnimoduleProxy: {
    modulesConstants: {
      mockDefinition: {
        ExponentConstants: {
          experienceUrl: {
            mock: 'exp://192.168.1.200:8081',
          },
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
  },
  DeviceInfo: {
    getConstants() {
      return {
        Dimensions: {
          window: { fontScale: 2, height: 1334, scale: 2, width: 750 },
          screen: { fontScale: 2, height: 1334, scale: 2, width: 750 },
        },
      };
    },
  },
  DevSettings: {
    addMenuItem: jest.fn(),
    reload: jest.fn(),
  },
  PlatformConstants: {
    getConstants() {
      return {
        forceTouchAvailable: false,
        interfaceIdiom: 'phone',
        isTesting: true,
        osVersion: '13.0',
        reactNativeVersion: { major: 0, minor: 76, patch: 0, prerelease: null },
        systemName: 'iOS',
      };
    },
  },
  AlertManager: {
    alertWithArgs: jest.fn(),
  },
  Networking: {
    sendRequest: jest.fn(),
    abortRequest: jest.fn(),
    clearCookies: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
  WebSocketModule: {
    connect: jest.fn(),
    send: jest.fn(),
    sendBinary: jest.fn(),
    ping: jest.fn(),
    close: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
  StatusBarManager: {
    HEIGHT: 42,
    setStyle: jest.fn(),
    setHidden: jest.fn(),
    setNetworkActivityIndicatorVisible: jest.fn(),
    getHeight: jest.fn(),
  },
  KeyboardObserver: {
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
  AppState: {
    getCurrentAppState: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
  Vibration: {
    vibrate: jest.fn(),
    cancel: jest.fn(),
  },
  BlobModule: {
    addNetworkingHandler: jest.fn(),
    enableBlobSupport: jest.fn(),
    disableBlobSupport: jest.fn(),
    createFromParts: jest.fn(),
    release: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
  FileReaderModule: {
    readAsText: jest.fn(),
    readAsDataURL: jest.fn(),
  },
  ExponentFileSystem: {
    downloadAsync: jest.fn(),
    getInfoAsync: jest.fn(),
    readAsStringAsync: jest.fn(),
    writeAsStringAsync: jest.fn(),
    deleteAsync: jest.fn(),
    moveAsync: jest.fn(),
    copyAsync: jest.fn(),
    makeDirectoryAsync: jest.fn(),
    readDirectoryAsync: jest.fn(),
    createDownloadResumable: jest.fn(),
    getFreeDiskStorageAsync: jest.fn(),
    getTotalDiskCapacityAsync: jest.fn(),
    addListener: jest.fn(),
    removeListeners: jest.fn(),
  },
  ExponentSecureStore: {
    getValueWithKeyAsync: jest.fn(),
    setValueWithKeyAsync: jest.fn(),
    deleteValueWithKeyAsync: jest.fn(),
  },
  ExponentConstants: {
    getConstants() {
      return {
        expoVersion: '53.0.0',
        installationId: 'test-installation-id',
        sessionId: 'test-session-id',
        platform: { ios: { userInterfaceIdiom: 'phone' } },
        isDevice: false,
        appOwnership: null,
        experienceUrl: 'exp://192.168.1.200:8081',
      };
    },
  },
};

jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => ({
  __esModule: true,
  default: mockNativeModules,
}));
