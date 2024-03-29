# @leanplum/react-native-sdk

If you have already installed Node on your system, make sure it is Node 8.3 or newer.

## Getting started using npm registry

### Inside the React Native App
1. `$ yarn add @leanplum/react-native-sdk` or `$ npm install @leanplum/react-native-sdk`

#### Autolinking
If you are using ReactNative 0.60 or greater, autolinking is supported by default.
On Android gradle will take care of dependencies, for iOS only one command needs to be run to pull dependencies

`$ cd ios && pod install`

#### Manual linking
If you are using ReactNative without support for autolinking (versions before 0.60) than you'll have to link manually by 
executing:

`$ npx react-native link @leanplum/react-native-sdk`

and running  `pod install` for iOS

`$ cd ios && pod install`

### Documentation
Please refer to https://docs.leanplum.com/reference#leanplum-sdk-setup for iOS or Android configuration and more usages

## Usage
```javascript
import {Leanplum, LeanplumInbox} from '@leanplum/react-native-sdk';



// enable the below line only for development
// Leanplum.setAppIdForDevelopmentMode('APP_ID', 'DEVELOPMENT_KEY');

// use this in production
Leanplum.setAppIdForProductionMode('APP_ID', 'PRODUCTION_KEY');

Leanplum.start();
const inbox = await LeanplumInbox.inbox();
```

## Expo installation
This package cannot be used in the "Expo Go" app because it requires custom native code.

First install the package with yarn, npm, or expo install.

expo install @leanplum/react-native-sdk
After installing this npm package, add the config plugin to the plugins array of your app.json or app.config.js:

{
  "expo": {
    "plugins": ["@leanplum/react-native-sdk"]
  }
}
Next, rebuild your app as described in the "Adding custom native code" guide.

## Local development
1. Install yarn global: `$ npm install -g yarn`

2. Install dependencies for generating builds: `$ yarn install`

3. Change `version` string from package.json to your `<custom-version>`

4. Build the sdk and publish it for local development purposes: `$ yarn local-publish`

5. Add your custom build to your app repository: `$ npx yalc add @leanplum/react-native-sdk@<custom-version>`

Do not forget to change `<custom-version>` to your desired version.

## Support
Reach out directly to Leanplum support team if you have any usage questions or feature requests. [Open an issue](../../issues) if you want to report a bug or need code-level support.
