# react-native-leanplum

## Getting started

1. Add `"react-native-leanplum": "file:../react-native-leanplum"` to the `package.json` file inside `dependencies` property

2. `$ yarn install` or `$ npm install`

3. `$ react-native link react-native-leanplum`

4. `$ cd ios && pod install`

5. Please refer to https://docs.leanplum.com/reference#leanplum-sdk-setup for iOS or Android configuration

## Usage
```javascript
import Leanplum from 'react-native-leanplum';

// TODO: What to do with the module?
Leanplum.setAppIdForDevelopmentMode('APP_ID', 'DEVELOPMENT_KEY');
Leanplum.setAppIdForProductionMode('APP_ID', 'PRODUCTION_KEY');
Leanplum.start();
```
## API

* `setAppIdForDevelopmentMode` (appId: string, accessKey: string): void - Must call either this or `setAppIdForProductionMode`  before issuing any calls to the API, including start
* `setAppIdForProductionMode` (appId: string, accessKey: string): void - Must call either this or `setAppIdForDevelopmentMode`  before issuing any calls
* `setDeviceId` (id: string): void - Sets a custom device ID. Normally, you should use setDeviceIdMode to change the type of device ID provided
* `setUserId` (id: string): void - Updates the user ID
* `setUserAttributes` (attributes: LeanplumObject): void - Adds or modifies user attributes
* `start` (): void - Call this when your application starts. This will initiate a call to Leanplum's servers to get the values of the variables used in your app
* `track` (event: string, params: LeanplumObject): void - Logs a particular event in your application. The string can be any value of your choosing, and will show up in the dashboard.
* `trackPurchase` (value: number, currencyCode: string, purchaseParams: LeanplumObject, purchaseEvent: string): void - Manually track purchase event with currency code in your application
* `disableLocationCollection` (): void - Disable location collection
* `setDeviceLocation` (latitude: number, longitude: number, type: LocationAccuracyType): void - Set location manually. Best if used in after calling disableLocationCollection. Useful if you want to apply additional logic before sending in the location.
* `forceContentUpdate` (): void - Forces content to update from the server. If variables have changed, the appropriate callbacks will fire. Use sparingly as if the app is updated, you'll have to deal with potentially inconsistent state or user experience.

```javascript
LeanplumObject {
    [name: string]: number | string;
}
```

## Push notifications

Please refer to: https://github.com/react-native-community/react-native-push-notification-ios

