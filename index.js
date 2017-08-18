import { NativeEventEmitter,  NativeModules } from 'react-native';

const { ReactNativeNfcIos: nativeModule } = NativeModules;

const _nfcNDEFReaderSessions = {};
const listeners = {};

export const EMPTY_RECORD = 'EMPTY_RECORD';
export const WELL_KNOWN_RECORD = 'WELL_KNOWN_RECORD';
export const MIME_MEDIA_RECORD = 'MIME_MEDIA_RECORD';
export const ABSOLUTE_URI_RECORD = 'ABSOLUTE_URI_RECORD';
export const EXTERNAL_RECORD = 'EXTERNAL_RECORD';
export const UNKNOWN_RECORD = 'UNKNOWN_RECORD';
export const UNCHANGED_RECORD = 'UNCHANGED_RECORD';

const recordTypes = {
  0: EMPTY_RECORD,
  1: WELL_KNOWN_RECORD,
  2: MIME_MEDIA_RECORD,
  3: ABSOLUTE_URI_RECORD,
  4: EXTERNAL_RECORD,
  5: UNKNOWN_RECORD,
  6: UNCHANGED_RECORD,
};

let nextInstanceId = 0;
function genInstanceId() {
  const id = nextInstanceId;
  nextInstanceId += 1;
  return id;
}

function decode(base64Data) {
  if (base64Data !== "") {
    return base64.decode(base64Data);
  }

  return base64Data;
}

function formatRecord(record) {
  return {
    type: record.type || null,
    typeNameFormat: recordTypes[record.typeNameFormat],
    identifier: record.identifier || null,
    payload: record.payload || null,
  };
}

function formatMessage(message) {
  return {
    records: message.records.map(formatRecord),
  };
}

const eventEmitter = new NativeEventEmitter(nativeModule);
eventEmitter.addListener('NDEFMessages', (event) => {
  console.log({ event });
  _nfcNDEFReaderSessions[event.sessionId].emit('NDEFMessages', event.messages.map(formatMessage));
});

export class NFCNDEFReaderSession {
  constructor({ alertMessage = null, invalidateAfterFirstRead = false } = {}) {
    // ID generated to multiplex session messages over native event emitter
    this.id = genInstanceId();

    // iOS NFCNDEFReaderSession options
    this.alertMessage = alertMessage
    this.invalidateAfterFirstRead = invalidateAfterFirstRead;

    // Event listeners for this session
    this.listenersForType = {
      NDEFMessages: [],
    };

    _nfcNDEFReaderSessions[this.id] = this;
    nativeModule.createNFCNDEFReaderSession(this.id, this.invalidateAfterFirstRead, this.alertMessage);
  }

  static readingAvailable = nativeModule.NFCNDEFReaderSession_readingAvailable;

  static readTag({ alertMessage } = {}) {
    const session = new NFCNDEFReaderSession({ alertMessage, invalidateAfterFirstRead: true });

    let listener;
    return new Promise((resolve, reject) => {
      const listener = (messages) => {
        session.removeEventListener('NDEFMessages', listener);
        resolve(messages);
        session.release();
      }
      session.addEventListener('NDEFMessages', listener);
      session.begin();
    });
  }

  ensureExists() {
    if (!_nfcNDEFReaderSessions[this.id]) {
      throw new Error('Session does not exists anymore.')
    }
  }

  release() {
    nativeModule.NFCNDEFReaderSession_release(this.id);
    delete _nfcNDEFReaderSessions[this.id];
  }

  begin() {
    this.ensureExists();
    nativeModule.NFCNDEFReaderSession_begin(this.id);
  }

  invalidate() {
    this.ensureExists();
    nativeModule.NFCNDEFReaderSession_invalidate(this.id);
  }

  setAlertMessage(alertMessage) {
    this.ensureExists();
    this.alertMessage = alertMessage;
    nativeModule.NFCNDEFReaderSession_setAlertMessage(this.id, this.alertMessage);
  }

  addEventListener(eventType, listener) {
    const listeners = this.listenersForType[eventType];
    if (!Array.isArray(listeners)) {
      throw new Error(`Event type ${eventType} is not supported`);
    }

    this.listenersForType[eventType].push(listener);

    return true;
  }

  removeEventListener(eventType, listener) {
    const listeners = this.listenersForType[eventType];
    if (!Array.isArray(listeners)) {
      throw new Error(`Event type ${eventType} is not supported`);
    }

    const listenerIndex = listeners.indexOf(listener);
    if (listenerIndex === -1) {
      throw new Error('Cannot find event listener');
    }

    listeners.splice(listenerIndex, 1);

    return true;
  }

  removeAllListeners(eventType) {
    this.listenersForType[eventType] = [];
    return true;
  }

  emit(eventType, event) {
    for (const listener of this.listenersForType[eventType]) {
      listener(event);
    }
  }
}
