#import "ReactNativeNfcIos.h"
#import <CoreNFC/CoreNFC.h>

@implementation ReactNativeNfcIos
{
    NSMapTable<NSNumber *, NFCNDEFReaderSession *> *nfcNDEFReaderSessionsFromId;
    NSMapTable<NFCNDEFReaderSession *, NSNumber *> *nfcNDEFReaderSessionsToId;
    bool hasListeners;
}

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (instancetype)init
{
    self = [super init];
    
    if (self == nil) {
        return self;
    }
    
    nfcNDEFReaderSessionsToId = [[NSMapTable alloc] init];
    nfcNDEFReaderSessionsFromId = [[NSMapTable alloc] init];
    
    return self;
}

- (NSDictionary *)constantsToExport
{
    return @{ @"NFCNDEFReaderSession_readingAvailable": [NSNumber numberWithBool:[NFCNDEFReaderSession readingAvailable]]};
}

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"NDEFMessages"];
}

- (void)readerSession:(NFCNDEFReaderSession *)session
       didDetectNDEFs:(NSArray<NFCNDEFMessage *> *)messages {
    if (!hasListeners) {
        return;
    }
    
    NSMutableArray *mutableMessages = [[NSMutableArray alloc] init];
    for (NFCNDEFMessage *message in messages) {
        NSMutableArray *mutableRecords = [[NSMutableArray alloc] init];
        for (NFCNDEFPayload *payload in message.records) {
            [mutableRecords addObject:@{
                                        @"identifier": [payload.identifier base64EncodedStringWithOptions:nil],
                                        @"payload": [payload.payload base64EncodedStringWithOptions:nil],
                                        @"type": [payload.type base64EncodedStringWithOptions:nil],
                                        @"typeNameFormat": [NSNumber numberWithInteger:payload.typeNameFormat]
                                        }];
        }
        [mutableMessages addObject:@{@"records": [mutableRecords copy]}];
    }
    
    [self sendEventWithName:@"NDEFMessages"
                       body: @{
                               @"sessionId": [nfcNDEFReaderSessionsToId objectForKey:session],
                               @"messages": [mutableMessages copy]
                               }
     ];
}

-(void)startObserving {
    hasListeners = YES;
}

- (void)readerSession:(NFCNDEFReaderSession *)session
didInvalidateWithError:(NSError *)error {
}

// Will be called when this module's last listener is removed, or on dealloc.
-(void)stopObserving {
    hasListeners = NO;
}

RCT_EXPORT_METHOD(createNFCNDEFReaderSession:(nonnull NSNumber*)sessionId invalidateAfterFirstRead:(nonnull NSNumber *)invalidateAfterFirstRead alertMessage:(NSString*)alertMessage)
{
    NFCNDEFReaderSession* session = [[NFCNDEFReaderSession alloc] initWithDelegate:self queue:nil invalidateAfterFirstRead:[invalidateAfterFirstRead boolValue]];
    session.alertMessage = @"TEST";
    
    if (alertMessage) {
        session.alertMessage = alertMessage;
    }
    
    [nfcNDEFReaderSessionsFromId setObject:session forKey:sessionId];
    [nfcNDEFReaderSessionsToId setObject:sessionId forKey:session];
}

RCT_EXPORT_METHOD(NFCNDEFReaderSession_begin:(nonnull NSNumber*)sessionId)
{
    NFCNDEFReaderSession *session = [nfcNDEFReaderSessionsFromId objectForKey:sessionId];
    NSLog(@"session ready ? %d", [session isReady]);
    [session beginSession];
}

RCT_EXPORT_METHOD(NFCNDEFReaderSession_invalidate:(nonnull NSNumber*)sessionId)
{
    NFCNDEFReaderSession *session = [nfcNDEFReaderSessionsFromId objectForKey:sessionId];
    [session invalidateSession];
}

RCT_EXPORT_METHOD(NFCNDEFReaderSession_setAlertMessage:(nonnull NSNumber*)sessionId alertMessage:(NSString *)alertMessage)
{
    NFCNDEFReaderSession *session = [nfcNDEFReaderSessionsFromId objectForKey:sessionId];
    session.alertMessage = alertMessage;
}

RCT_EXPORT_METHOD(NFCNDEFReaderSession_release:(nonnull NSNumber*)sessionId)
{
    NFCNDEFReaderSession *session = [nfcNDEFReaderSessionsFromId objectForKey:sessionId];
    [nfcNDEFReaderSessionsFromId removeObjectForKey:sessionId];
    [nfcNDEFReaderSessionsToId removeObjectForKey:session];
}

@end
