#import <Foundation/Foundation.h>
#if __has_include(<React/RCTBridgeModule.h>)
    #import <React/RCTBridgeModule.h>
    #import <React/RCTEventEmitter.h>
#else
    #import "RCTBridgeModule.h"
    #import "RCTEventEmitter.h"
#endif

@interface ReactNativeNfcIos : RCTEventEmitter <RCTBridgeModule>

@end
