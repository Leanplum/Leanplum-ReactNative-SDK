#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_REMAP_MODULE(Leanplum, RNLeanplum, RCTEventEmitter)
RCT_EXTERN_METHOD(setAppVersion: (NSString *)appVersion)
RCT_EXTERN_METHOD(setAppIdForDevelopmentMode: (NSString *)appId accessKey:(NSString *)accessKey)
RCT_EXTERN_METHOD(setAppIdForProductionMode: (NSString *)appId accessKey:(NSString *)accessKey)
RCT_EXTERN_METHOD(setApiConnectionSettings: (NSString *)hostName servletName:(NSString *)servletName ssl:(BOOL)ssl)
RCT_EXTERN_METHOD(setSocketConnectionSettings: (NSString *)hostName port:(NSInteger *)port)
RCT_EXTERN_METHOD(setDeviceId: (NSString *)id)
RCT_EXTERN_METHOD(setUserId: (NSString *)id)
RCT_EXTERN_METHOD(setUserAttributes: (NSDictionary *)attributes)
RCT_EXTERN_METHOD(userId: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(deviceId: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(start)
RCT_EXTERN_METHOD(hasStarted: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(track: (NSString *)event params:(NSDictionary *)params)
RCT_EXTERN_METHOD(trackPurchase: (NSString *)purchaseEvent value:(double *)value currencyCode:(NSString *)currencyCode purchaseParams:(NSDictionary *)purchaseParams)
RCT_EXTERN_METHOD(trackInAppPurchases)
RCT_EXTERN_METHOD(disableLocationCollection)
RCT_EXTERN_METHOD(setDeviceLocation: (double *)latitude longitude:(double *)longitude type:(NSInteger *)type)
RCT_EXTERN_METHOD(forceContentUpdate)
RCT_EXTERN_METHOD(setVariables: (NSDictionary *)variables)
RCT_EXTERN_METHOD(getVariable: (NSString *)variableName resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getVariables: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(onStartResponse: (RCTResponseSenderBlock)callback)
RCT_EXTERN_METHOD(onValueChanged: (NSString *)variableName)
RCT_EXTERN_METHOD(onVariablesChanged: (NSString *)listener)
RCT_EXTERN_METHOD(setVariableAsset: (NSString *)name filename:(NSString *)filename)
RCT_EXTERN_METHOD(getVariableAsset: (NSString *)name resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(pauseState)
RCT_EXTERN_METHOD(resumeState)
RCT_EXTERN_METHOD(trackAllAppScreens)
RCT_EXTERN_METHOD(advanceTo: (NSString *)state)
RCT_EXTERN_METHOD(advanceToWithInfo: (NSString *)state info:(NSString *)info)
RCT_EXTERN_METHOD(advanceToWithParams: (NSString *)state params:(NSDictionary *)params)
RCT_EXTERN_METHOD(advanceToWithInfoAndParams: (NSString *)state info:(NSString *)info params:(NSDictionary *)params)
RCT_EXTERN_METHOD(onVariablesChangedAndNoDownloadsPending: (NSString *)listener)
RCT_EXTERN_METHOD(onceVariablesChangedAndNoDownloadsPending: (NSString *)listener)
RCT_EXTERN_METHOD(onMessageDisplayed: (NSString *)listener)
RCT_EXTERN_METHOD(registerForRemoteNotifications)
@end

@interface RCT_EXTERN_REMAP_MODULE(LeanplumInbox, RNLeanplumInbox, RCTEventEmitter)
RCT_EXTERN_METHOD(getInbox: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(getMessage: (NSString *)messageId resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(read: (NSString *)messageId)
RCT_EXTERN_METHOD(markAsRead: (NSString *)messageId)
RCT_EXTERN_METHOD(remove: (NSString *)messageId)
RCT_EXTERN_METHOD(onChanged: (NSString *)listener)
RCT_EXTERN_METHOD(onForceContentUpdate: (NSString *)listener)
@end
