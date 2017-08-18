import { NativeEventEmitter,  NativeModules } from 'react-native';
const { ReactNativeNfcIos: nativeModule } = NativeModules;

import { NFCNDEFReaderSession } from '../index';

describe('NFCNDEFReaderSession', () => {
  let session;

  beforeEach(() => {
    session = new NFCNDEFReaderSession();
  });

  describe('constructor', () => {
    test('call native createNFCNDEFReaderSession method', () => {
      expect(nativeModule.createNFCNDEFReaderSession).toBeCalled()
    });
  });

  describe('#addEventListener', () => {
    test('Listener should be called when event is emitted', () => {
      const listener = jest.fn();
      session.addEventListener('NDEFMessages', listener);
      session.emit('NDEFMessages', 'NDEF_MESSAGES');
      expect(listener).toBeCalled();
    });

    test('Throw error for non suported event types', () => {
      expect(() => {
        session.addEventListener('NON_SUPORTED_EVENT_TYPE', () => {});
      }).toThrow(/not supported/);
    });
  });

  describe('#release', () => {
    test('Call native NFCNDEFReaderSession_release method', () => {
      session.release();
      expect(nativeModule.NFCNDEFReaderSession_release).toBeCalledWith(session.id);
    });
  });

  describe('#begin', () => {
    test('Call native NFCNDEFReaderSession_begin method', () => {
      session.begin();
      expect(nativeModule.NFCNDEFReaderSession_begin).toBeCalledWith(session.id);
    });
  });

  describe('#invalidate', () => {
    test('Call native NFCNDEFReaderSession_invalidate method', () => {
      session.invalidate();
      expect(nativeModule.NFCNDEFReaderSession_invalidate).toBeCalledWith(session.id);
    });
  });

  describe('#setAlertMessage', () => {
    test('Call native NFCNDEFReaderSession_setAlertMessage method', () => {
      const alertMessage = 'New alert message';
      session.setAlertMessage(alertMessage);
      expect(nativeModule.NFCNDEFReaderSession_setAlertMessage).toBeCalledWith(session.id, alertMessage);
    })
  })
});