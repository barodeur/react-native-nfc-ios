// jest.mock('react-native', () => ({

// }));

jest.mock('NativeModules', () => ({
  ReactNativeNfcIos: {
    NFCNDEFReaderSession_readingAvailable: true,
    createNFCNDEFReaderSession: jest.fn(),
    NFCNDEFReaderSession_release: jest.fn(),
    NFCNDEFReaderSession_begin: jest.fn(),
    NFCNDEFReaderSession_invalidate: jest.fn(),
    NFCNDEFReaderSession_setAlertMessage: jest.fn(),
  },
}));
jest.mock('NativeEventEmitter', () => () => ({
  addListener: jest.fn(),
}));