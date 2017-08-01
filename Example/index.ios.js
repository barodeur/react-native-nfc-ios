import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  AlertIOS,
} from 'react-native';
import { NFCNDEFReaderSession } from 'react-native-nfc-ios';

export default class ReactNativeNfcIosExample extends Component {
  constructor() {
    super();

    this.state = {
      messageGroups: [],
    };

    this.readerSession = null;
  }

  componentDidMount() {
    if (!NFCNDEFReaderSession.readingAvailable) {
      AlertIOS.alert(
        'CoreNFC is not available',
        "Are you running in an emulator?\nHave you correctly setup you Xcode project?"
      );
    }
  }

  appendMessageGroup = (messageGroup) => {
    this.setState({
      messageGroups: [
        ...this.state.messageGroups,
        messageGroup,
      ]
    });
  } 

  handleReadTag = async () => {
    const messages = await NFCNDEFReaderSession.readTag();
    this.appendMessageGroup({
      messages,
      receivedAt: (new Date()).toISOString(),
    });
  }

  handleStartReadTags = async () => {
    this.readerSession = this.readerSession || new NFCNDEFReaderSession();
    this.readerSession.addEventListener('NDEFMessages', (messages) => {
      this.appendMessageGroup({
        messages,
        receivedAt: (new Date()).toISOString(),
      });
    });
    this.readerSession.begin();
  }

  _renderMessageGroup = ({ receivedAt, messages }) => (
    <View key={receivedAt} style={styles.messageGroupContainer}>
      <Text style={styles.messageGroupTitle}>Messages received at {receivedAt}</Text>
      <View style={styles.messageGroupContent}>
        {messages.map((message, messageIndex) =>
          <View key={messageIndex} style={styles.messageContainer}>
            <Text style={styles.messageTitle}>Message {messageIndex}</Text>
            <View style={styles.messageContent}>
              {message.records.map((record, recordIndex) => (
                <View key={recordIndex} style={styles.recordContainer}>
                  <Text style={styles.recordTitle}>Record {recordIndex}</Text>
                  <Text style={styles.recordContent}>{JSON.stringify(record)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  )

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.records}>
          {this.state.messageGroups.map(this._renderMessageGroup)}
        </ScrollView>
        <View style={styles.actionBar}>
          {NFCNDEFReaderSession.readingAvailable &&
            <TouchableHighlight style={styles.actionButton} onPress={this.handleReadTag}>
              <Text>Read one Tag</Text>
            </TouchableHighlight>
          }
          {NFCNDEFReaderSession.readingAvailable &&
            <TouchableHighlight style={styles.actionButton} onPress={this.handleStartReadTags}>
              <Text>Read tags</Text>
            </TouchableHighlight>
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  records: {
    flex: 1,
  },
  actionBar: {
    height: 44,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'black',
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  messageGroupContainer: {
    marginVertical: 10,
  },
  messageGroupTitle: {
    fontSize: 18,
  },
  messageGroupContent: {
    paddingLeft: 10,
  },

  messageContainer: {
  },
  messageTitle: {
    fontSize: 14,
  },
  messageContent: {
    paddingLeft: 10,
  },

  recordTitle: {
  },
  recordContent: {
    paddingLeft: 10,
    fontFamily: 'courier',
  },
});

AppRegistry.registerComponent('ReactNativeNfcIosExample', () => ReactNativeNfcIosExample);
