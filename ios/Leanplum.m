#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_REMAP_MODULE(Leanplum, RNLeanplum, RCTEventEmitter)
RCT_EXTERN_METHOD(setAppIdForDevelopmentMode: (NSString *)appId accessKey:(NSString *)accessKey)
RCT_EXTERN_METHOD(setAppIdForProductionMode: (NSString *)appId accessKey:(NSString *)accessKey)
RCT_EXTERN_METHOD(setDeviceId: (NSString *)id)
RCT_EXTERN_METHOD(setUserId: (NSString *)id)
RCT_EXTERN_METHOD(setUserAttributes: (NSDictionary *)attributes)
RCT_EXTERN_METHOD(start)
RCT_EXTERN_METHOD(track: (NSString *)event params:(NSDictionary *)params)
RCT_EXTERN_METHOD(trackPurchase: (NSString *)purchaseEvent value:(double *)value currencyCode:(NSString *)currencyCode purchaseParams:(NSDictionary *)purchaseParams)
RCT_EXTERN_METHOD(disableLocationCollection)
RCT_EXTERN_METHOD(setDeviceLocation: (double *)latitude longitude:(double *)longitude type:(NSInteger *)type)
RCT_EXTERN_METHOD(forceContentUpdate)
RCT_EXTERN_METHOD(setListenersNames: (NSString *)onVariableChangedListenerName onVariablesChangedListenerName:(NSString *)onVariablesChangedListenerName)
RCT_EXTERN_METHOD(setVariables: (NSDictionary *)variables)
RCT_EXTERN_METHOD(getVariable: (NSString *)variableName resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getVariables: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(onStartResponse: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(onValueChanged: (NSString *)variableName)
RCT_EXTERN_METHOD(onVariablesChanged)
RCT_EXTERN_METHOD(setVariableAsset: (NSString *)name filename:(NSString *)filename)
RCT_EXTERN_METHOD(getVariableAsset: (NSString *)name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(pauseState)
RCT_EXTERN_METHOD(resumeState)
RCT_EXTERN_METHOD(trackAllAppScreens)
RCT_EXTERN_METHOD(advanceTo: (NSString *)state)
RCT_EXTERN_METHOD(advanceToWithInfo: (NSString *)state info:(NSString *)info)
RCT_EXTERN_METHOD(advanceToWithParams: (NSString *)state params:(NSDictionary *)params)
RCT_EXTERN_METHOD(advanceToWithInfoAndParams: (NSString *)state info:(NSString *)info params:(NSDictionary *)params)
RCT_EXTERN_METHOD(getInbox: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(messageForId: (NSString *)messageId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(read: (NSString *)messageId)
RCT_EXTERN_METHOD(remove: (NSString *)messageId)
RCT_EXTERN_METHOD(onInboxChanged: (NSString *)listener)
@end
