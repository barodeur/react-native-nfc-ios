[![Build Status](https://travis-ci.org/barodeur/react-native-nfc-ios.svg?branch=master)](https://travis-ci.org/barodeur/react-native-nfc-ios)
[![npm version](https://badge.fury.io/js/react-native-nfc-ios.svg)](https://badge.fury.io/js/react-native-nfc-ios)

# React Native NFC for iOS

> ⚠️ Apple CoreNFC is only available for iOS11 on iPhone 7 and iPhone 7 Plus devices.
> It does not seems to be available on simulator at the moment, but it should be available later.

> ⚠️ iOS11 is currently available as beta 9, you should use Xcode 9 beta 6 to build your project.
> This project is updated and tested frequetly against new beta releases.

## Demo

![DEMO](https://user-images.githubusercontent.com/303170/29473145-9b93f8b4-8424-11e7-93f8-e286580df1e6.gif)

## How to use

## Installation

Install the module
```
npm install --save react-native-nfc-ios
```

Link the native module to your project
```
react-native link react-native-nfc-ios
```

### Prepare your Xcode project

Add the NFC capability key to your `.entitlements` file
```xml
<key>com.apple.developer.nfc.readersession.formats</key>
<array>
    <string>NDEF</string>
</array>
```

Add the `NFCReaderUsageDescription` key to your project's `Info.plist`
```xml
<key>NFCReaderUsageDescription</key>
<string>Ready to use NFC 🚀</string>
```

### Lean about NDEF Messages Structure (NFC Data Exchange Format)

As CoreNFC, the API will return arrays of messages, each message containing an array of records.

```javascript
[
  {
    "records": [
      {
        "type": "VQ==", // base64 encoded for 55, URI record
        "payload": "UmVhY3QgTmF0aXZlIE5GQyBpT1M=", // base64 encoded for "React Native NFC iOS"
        "identifier": null,  // No identifier in the tag
        "typeNameFormat": "WELL_KNOWN_RECORD",
      }
    ]
  }
]
```

Every record will have a Base64 encoded `type`, `payload` and `identifier`.

The `typeFormatName` will be one of the following constant :

- `EMPTY_RECORD`
- `WELL_KNOWN_RECORD`
- `MIME_MEDIA_RECORD`
- `ABSOLUTE_URI_RECORD`
- `EXTERNAL_RECORD`
- `UNKNOWN_RECORD`
- `UNCHANGED_RECORD`

You can import those constants form the module.

```javascript
import { EMPTY_RECORD } from 'react-native-nfc-ios';
```

## API

### Promise API - One tag at a time

```javascript
import base64 from 'base-64';
import { NFCNDEFReaderSession } from 'react-native-nfc-ios';

const messages = await NFCNDEFReaderSession.readTag();
const payloadB64 = messages[0].records[0].payload;
const payload = base64.decode(payloadB64);

console.log(payload);
// "React Native NFC iOS"
```

### CoreNFC binding API - Aka Event API

This API is designed to stay as close as possible to CoreNFC.

```javascript
import { NFCNDEFReaderSession } from 'react-native-nfc-ios';

const readerSession = new NFCNDEFReaderSession();
const listener = readerSession.addEventListener('NDEFMessages', (messages) => {
  console.log(messages);
});

// Show the NFC reader
readerSession.begin();

// Close the NFC reader
readerSession.invalidate();

// Remove the event listener
readerSession.removeEventListener('NDEFMessages', listener);

// Or Remove all events listeners
readerSession.removeAllEventListeners('NDEFMessages');

// ⚠️ Release the native instance to free memory
readerSession.release();
```

### Set the Alert Message

As with the native CoreNFC API you can set the alert message 

```javascript
// With the Simple API
const messages = await NFCNDEFReaderSession.readTag({
  alertMessage: 'Please put your NFC Tag',
});

// As you instantiate a new NFCNDEFReaderSession
const readerSession = new NFCNDEFReaderSession({
  alertMessage: 'Please put your NFC Tag',
});

// Change reader session alert message
readerSession.setAlertMessage('New alert message');
```
