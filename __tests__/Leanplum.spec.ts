import { Leanplum } from '../src/Leanplum';
import { NativeModules } from 'react-native';
import { LocationAccuracyType } from '../src/leanplum-types';

// native LeanplumSdk with mocks as methos
const LeanplumSdk = NativeModules.Leanplum;

// mock the native modules of React native
// that will be imported inside Leanplum.ts
// and replace LeanplumSdk methods with mocks
jest.mock('react-native', () => {
  const ReactNative = require.requireActual('react-native');

  const NativeModules = {
    ...ReactNative.NativeModules,
    Leanplum: {
      ...ReactNative.NativeModules.Leanplum,
      setDeviceId: jest.fn(),
      start: jest.fn(),
      setAppIdForDevelopmentMode: jest.fn(),
      setAppIdForProductionMode: jest.fn(),
      parseVariables: jest.fn(),
      setUserId: jest.fn(),
      setUserAttributes: jest.fn(),
      setVariables: jest.fn(),
      setVariable: jest.fn(),
      setAsset: jest.fn(),
      setListenersNames: jest.fn(),
      getVariable: jest.fn().mockResolvedValue('var1'),
      getVariables: jest.fn().mockResolvedValue({ var1: 'val1' }),
      getVariableAsset: jest.fn().mockResolvedValue('var1'),
      onStartResponse: jest.fn(),
      onValueChanged: jest.fn().mockResolvedValue('var1'),
      onVariablesChanged: jest.fn(),
      forceContentUpdate: jest.fn(),
      track: jest.fn(),
      trackPurchase: jest.fn(),
      disableLocationCollection: jest.fn(),
      setDeviceLocation: jest.fn()
      //onStartResponse: jest.fn(),
    }
  };

  return Object.setPrototypeOf(
    {
      NativeModules
    },
    ReactNative
  );
});

describe('Leanplum', () => {
  // beforeEach(() => {
  //   jest.resetAllMocks()
  // })

  it('should setDeviceId', () => {
    Leanplum.setDeviceId('alpha');
    expect(LeanplumSdk.setDeviceId).toHaveBeenCalledTimes(1);
    expect(LeanplumSdk.setDeviceId).toHaveBeenCalledWith('alpha');
  });

  it('should start', () => {
    Leanplum.start();
    expect(LeanplumSdk.start).toHaveBeenCalledTimes(1);
  });

  it('should setAppIdForDevelopmentMode', () => {
    Leanplum.setAppIdForDevelopmentMode('alpha', 'alpha-key');
    expect(LeanplumSdk.setAppIdForDevelopmentMode).toHaveBeenCalledTimes(1);
    expect(LeanplumSdk.setAppIdForDevelopmentMode).toHaveBeenCalledWith(
      'alpha',
      'alpha-key'
    );
  });

  it('should setAppIdForProductionMode', () => {
    Leanplum.setAppIdForProductionMode('alpha', 'alpha-key');
    expect(LeanplumSdk.setAppIdForProductionMode).toHaveBeenCalledTimes(1);
    expect(LeanplumSdk.setAppIdForProductionMode).toHaveBeenCalledWith(
      'alpha',
      'alpha-key'
    );
  });

  it('should setUserId', () => {
    Leanplum.setUserId('alpha');
    expect(LeanplumSdk.setUserId).toHaveBeenCalledTimes(1);
    expect(LeanplumSdk.setUserId).toHaveBeenCalledWith('alpha');
  });

  it('should setUserAttributes', () => {
    Leanplum.setUserAttributes('alpha');
    expect(LeanplumSdk.setUserAttributes).toHaveBeenCalledTimes(1);
    expect(LeanplumSdk.setUserAttributes).toHaveBeenCalledWith('alpha');
  });

  it('should setVariables', () => {
    Leanplum.setVariables({ key: 'alpha' });
    expect(LeanplumSdk.setVariables).toHaveBeenCalledTimes(1);
    expect(LeanplumSdk.setVariables).toHaveBeenCalledWith({ key: 'alpha' });
  });

  it('should getVariable', async () => {
    const value = await Leanplum.getVariable('alpha');
    expect(LeanplumSdk.getVariable).toHaveBeenCalledTimes(1);
    expect(LeanplumSdk.getVariable).toHaveBeenCalledWith('alpha');
    expect(value).toEqual('var1');
  });

  it('should getVariables', async () => {
    const value = await Leanplum.getVariables();
    expect(LeanplumSdk.getVariables).toHaveBeenCalledTimes(1);
    expect(value).toEqual({ var1: 'val1' });
  });

  //TODO setVariableAsset
  // it("should setVariableAsset", () => {
  //   Leanplum.setVariableAsset("alpha", "/data/user/0/test", () => {
  //     path => console.log(path);
  //   });
  //   expect(LeanplumSdk.setVariableAsset).toHaveBeenCalledTimes(1);
  //   //expect(LeanplumSdk.setVariableAsset).toHaveBeenCalledWith({ key: "alpha" });
  // });

  it('should getVariableAsset', async () => {
    const value = await Leanplum.getVariableAsset('alpha');
    expect(LeanplumSdk.getVariableAsset).toHaveBeenCalledTimes(1);
    expect(LeanplumSdk.getVariableAsset).toHaveBeenCalledWith('alpha');
    expect(value).toEqual('var1');
  });

  it('should register a callback onStartResponse', () => {
    const func = () => {};
    Leanplum.onStartResponse(func);
    expect(LeanplumSdk.onStartResponse).toHaveBeenCalledTimes(1);
    expect(LeanplumSdk.onStartResponse).toHaveBeenCalledWith(func);
  });

  //TODO onValueChanged
  // it("should onValueChanged", async () => {
  //   const func = () => {};
  //   const value = await Leanplum.onValueChanged("alpha", func);
  //   expect(LeanplumSdk.onValueChanged).toHaveBeenCalledTimes(1);
  //   expect(value).toEqual("var1");
  // });

  //TODO  onVariablesChanged
  // it("should register a callback onVariablesChanged", () => {
  //   const func = () => {};
  //   Leanplum.onVariablesChanged(func);
  //   expect(LeanplumSdk.onVariablesChanged).toHaveBeenCalledTimes(1);
  //   expect(LeanplumSdk.onVariablesChanged).toHaveBeenCalledWith(func);
  // });

  it('should forceContentUpdate', () => {
    Leanplum.forceContentUpdate();
    expect(LeanplumSdk.forceContentUpdate).toHaveBeenCalledTimes(1);
  });

  it('should track', () => {
    Leanplum.track('alpha', { 'alpha-key': 'alpha-value' });
    expect(LeanplumSdk.track).toHaveBeenCalledTimes(1);
    expect(LeanplumSdk.track).toHaveBeenCalledWith('alpha', {
      'alpha-key': 'alpha-value'
    });
  });

  it('should trackPurchase', () => {
    Leanplum.trackPurchase(
      1,
      'alpha-code',
      { 'alpha-key': 'alpha-value' },
      'alpha-event'
    );
    expect(LeanplumSdk.trackPurchase).toHaveBeenCalledTimes(1);
    expect(LeanplumSdk.trackPurchase).toHaveBeenCalledWith(
      'alpha-event',
      1,
      'alpha-code',
      { 'alpha-key': 'alpha-value' }
    );
  });

  it('should disableLocationCollection', () => {
    Leanplum.disableLocationCollection();
    expect(LeanplumSdk.disableLocationCollection).toHaveBeenCalledTimes(1);
    expect(LeanplumSdk.disableLocationCollection).toHaveBeenCalledWith();
  });

  it('should setDeviceLocation with default value', () => {
    Leanplum.setDeviceLocation(1, 1);
    expect(LeanplumSdk.setDeviceLocation).toHaveBeenCalledTimes(1);
    expect(LeanplumSdk.setDeviceLocation).toHaveBeenCalledWith(
      1,
      1,
      LocationAccuracyType.CELL
    );
  });

  it('should setDeviceLocation', () => {
    Leanplum.setDeviceLocation(1, 1, LocationAccuracyType.GPS);
    expect(LeanplumSdk.setDeviceLocation).toHaveBeenCalledTimes(2);
    expect(LeanplumSdk.setDeviceLocation).toHaveBeenCalledWith(
      1,
      1,
      LocationAccuracyType.GPS
    );
  });
});
