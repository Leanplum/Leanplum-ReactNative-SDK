# react-native-leanplum

If you have already installed Node on your system, make sure it is Node 8.3 or newer.

## Getting started using npm registry

### Inside the React Native App
1. `$ yarn add react-native-leanplum` or `$ npm install react-native-leanplum`

2. `$ npx react-native link react-native-leanplum`

3. For iOS only `$ cd ios && pod install`

4. Please refer to https://docs.leanplum.com/reference#leanplum-sdk-setup for iOS or Android configuration and more usages

## Push notifications

Please refer to: https://github.com/react-native-community/react-native-push-notification-ios

## Usage
```javascript
import {Leanplum, LeanplumInbox} from 'react-native-leanplum';



// enable the below line only for development
// Leanplum.setAppIdForDevelopmentMode('APP_ID', 'DEVELOPMENT_KEY');

// use this in production
Leanplum.setAppIdForProductionMode('APP_ID', 'PRODUCTION_KEY');

Leanplum.start();
const inbox = await LeanplumInbox.inbox();
```

## Local development
1. Install yarn global `$ npm install -g yarn`

2. Install dependencies for generating builds `$ yarn install`

3. Build the sdk and publish it for local development purposes `$ yarn local-publish`

### Inside the React Native App repository

1. Add this sdk build to the app: `$ npx yalc add react-native-leanplum`
2. `$ npx react-native link react-native-leanplum`