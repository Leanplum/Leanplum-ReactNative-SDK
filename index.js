import {NativeModules, Platform} from 'react-native';

class Leanplum {
  nativeModule;
  PURCHASE_EVENT_NAME = 'Purchase';

  constructor(nativeModule) {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      this.nativeModule = nativeModule;
    } else {
      this.throwUnsupportedPlatform();
    }
  }

  throwUnsupportedPlatform() {
    throw new Error('Unsupported Platform');
  }

  setAppIdForDevelopmentMode(appId, accessKey) {
    this.nativeModule.setAppIdForDevelopmentMode(appId, accessKey);
  }

  setAppIdForProductionMode(appId, accessKey) {
    this.nativeModule.setAppIdForProductionMode(appId, accessKey);
  }

  setDeviceId(id) {
    this.nativeModule.setDeviceId(id);
  }

  setUserId(id) {
    this.nativeModule.setUserId(id);
  }

  setUserAttributes(attributes) {
    this.nativeModule.setUserAttributes(attributes);
  }

  start() {
    this.nativeModule.start();
  }

  track(event, params = {}) {
    this.nativeModule.track(event, params);
  }

  trackPurchase(
    value,
    currencyCode,
    purchaseParams,
    purchaseEvent = this.PURCHASE_EVENT_NAME,
  ) {
    this.nativeModule.trackPurchase(
      purchaseEvent,
      value,
      currencyCode,
      purchaseParams,
    );
  }

  disableLocationCollection() {
    this.nativeModule.disableLocationCollection();
  }

  setDeviceLocation(
    latitude,
    longitude,
    type = 1,
  ) {
    this.nativeModule.setDeviceLocation(latitude, longitude, type);
  }
}

const leanplum = new Leanplum(NativeModules.Leanplum);
export default leanplum;
