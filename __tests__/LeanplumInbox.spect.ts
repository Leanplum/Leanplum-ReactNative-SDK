import { LeanplumInbox } from '../src/LeanplumInbox';
import { NativeModules } from 'react-native';

// native LeanplumSdk with mocks as methos
const LeanplumInboxSdk = NativeModules.LeanplumInbox;

// mock the native modules of React native
// that will be imported inside Leanplum.ts
// and replace LeanplumSdk methods with mocks
jest.mock('react-native', () => {
  const ReactNative = require.requireActual('react-native');

  const NativeModules = {
    ...ReactNative.NativeModules,
    LeanplumInbox: {
      ...ReactNative.NativeModules.LeanplumInbox,
      getInbox: jest.fn().mockResolvedValue({ var1: 'val1' }),
      getMessage: jest.fn().mockResolvedValue({ var1: 'val1' }),
      remove: jest.fn(),
      read: jest.fn()
    }
  };

  return Object.setPrototypeOf(
    {
      NativeModules,
    },
    ReactNative
  );
});

describe('Leanplum SDK', () => {
  it('should getInbox', async () => {
    const value = await LeanplumInbox.inbox();
    expect(LeanplumInboxSdk.getInbox).toHaveBeenCalledTimes(1);
    expect(LeanplumInboxSdk.getInbox).toHaveBeenCalledWith();
    expect(value).toEqual({ var1: 'val1' });
  });

  it('should getMessage', async () => {
    const value = await LeanplumInbox.message('alpha');
    expect(LeanplumInboxSdk.getMessage).toHaveBeenCalledTimes(1);
    expect(LeanplumInboxSdk.getMessage).toHaveBeenCalledWith('alpha');
    expect(value).toEqual({ var1: 'val1' });
  });

  it('should remove', () => {
    LeanplumInbox.remove('alpha');
    expect(LeanplumInboxSdk.remove).toHaveBeenCalledTimes(1);
    expect(LeanplumInboxSdk.remove).toHaveBeenCalledWith('alpha');
  });

  it('should read', () => {
    LeanplumInbox.read('alpha');
    expect(LeanplumInboxSdk.read).toHaveBeenCalledTimes(1);
    expect(LeanplumInboxSdk.read).toHaveBeenCalledWith('alpha');
  });

  //TODO onChanged
});
