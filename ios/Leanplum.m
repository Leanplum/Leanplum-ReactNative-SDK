#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(Leanplum, RNLeanplum, NSObject)
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
@end
