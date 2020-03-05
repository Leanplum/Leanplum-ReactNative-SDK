import { NativeModules, Platform, NativeEventEmitter } from 'react-native';
import { Variables, Variable, Parameters, LocationAccuracyType, MessageArchiveData } from './leanplum-types';

class LeanplumSdkModule extends NativeEventEmitter {
  private readonly nativeModule: any;
  private static readonly PURCHASE_EVENT_NAME: string = 'Purchase';
  private static readonly ON_VARIABLES_CHANGE_LISTENER: string =
    'onVariablesChanged';
  private static readonly ON_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING =
    'onVariablesChangedAndNoDownloadsPending';

  private static readonly ONCE_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING =
    'onceVariablesChangedAndNoDownloadsPending';

  private static readonly ON_MESSAGE_DISPLAYED = 'onMessageDisplayed';

  constructor(nativeModule: any) {
    super(nativeModule);
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      this.nativeModule = nativeModule;
    } else {
      this.throwUnsupportedPlatform();
    }
  }

  throwUnsupportedPlatform() {
    throw new Error('Unsupported Platform');
  }

  setAppIdForDevelopmentMode(appId: string, accessKey: string): void {
    this.nativeModule.setAppIdForDevelopmentMode(appId, accessKey);
  }

  setAppIdForProductionMode(appId: string, accessKey: string): void {
    this.nativeModule.setAppIdForProductionMode(appId, accessKey);
  }

  setDeviceId(id: string): void {
    this.nativeModule.setDeviceId(id);
  }

  parseVariables(): void {
    this.nativeModule.parseVariables();
  }

  setUserId(id: string): void {
    this.nativeModule.setUserId(id);
  }

  setUserAttributes(attributes: Parameters): void {
    this.nativeModule.setUserAttributes(attributes);
  }

  async userId(): Promise<string> {
    return await this.nativeModule.userId();
  }

  async deviceId(): Promise<string> {
    return await this.nativeModule.deviceId();
  }

  /**
   * Define/Set multiple primitive variables using JSON object, we can use this method if we want to define multiple variables at once
   *
   * @param object object with multiple variables
   */
  setVariables(variables: Variables): void {
    this.nativeModule.setVariables(variables);
  }

  /**
   * Get value for specific variable, if we want to be sure that the method will return latest variable value
   * we need to invoke forceContentUpdate() before invoking getVariable
   *
   * @param name name of the variable
   * @returns a Promise with variable value
   */
  async getVariable(name: String): Promise<Variable> {
    return await this.nativeModule.getVariable(name);
  }

  /**
   * Get value for specific variable, if we want to be sure that the method will return latest variable value
   * we need to invoke forceContentUpdate() before invoking getVariable
   *
   * @param name name of the variable
   * @param defaultValue default value of the variable
   */
  async getVariables(): Promise<Variables> {
    return await this.nativeModule.getVariables();
  }

  /**
   * Define/Set asset, we can use this method if we want to define asset
   *
   * @param name name of the variable
   * @param defaultValue default filename of the asset
   */
  setVariableAsset(
    name: string,
    filename: string,
    onAssetReadyCallback: (path: string) => void
  ): void {
    this.nativeModule.setVariableAsset(name, filename);
    this.addListener(name, onAssetReadyCallback);
  }

  async getVariableAsset(name: string): Promise<string> {
    return await this.nativeModule.getVariableAsset(name);
  }

  /**
   * add callback when start finishes
   *
   * @param handler callback that is going to be invoked when start finishes
   */
  onStartResponse(callback: (success: boolean) => void) {
    this.nativeModule.onStartResponse(callback);
  }

  /**
   * add value change handler for specific variable
   *
   * @param name name of the variable on which we will register the handler
   * @param handler function that is going to be invoked when value is changed
   */
  onValueChanged(
    variableName: string,
    callback: (value: Variable) => void
  ): void {
    this.nativeModule.onValueChanged(variableName);
    this.addListener(variableName, callback);
  }

  /**
   * add callback when all variables are ready
   *
   * @param handler callback that is going to be invoked when all variables are ready
   */
  onVariablesChanged(callback: (value: Variables) => void): void {
    this.nativeModule.onVariablesChanged(
      LeanplumSdkModule.ON_VARIABLES_CHANGE_LISTENER
    );
    this.addListener(LeanplumSdkModule.ON_VARIABLES_CHANGE_LISTENER, callback);
  }

  start(): void {
    this.nativeModule.start();
  }

  forceContentUpdate(): void {
    this.nativeModule.forceContentUpdate();
  }

  track(event: string, params: Parameters = {}): void {
    this.nativeModule.track(event, params);
  }

  trackPurchase(
    value: number,
    currencyCode: string,
    purchaseParams: Parameters,
    purchaseEvent: string = LeanplumSdkModule.PURCHASE_EVENT_NAME
  ): void {
    this.nativeModule.trackPurchase(
      purchaseEvent,
      value,
      currencyCode,
      purchaseParams
    );
  }

  trackInAppPurchasesIos(): void {
    if (Platform.OS === 'ios') {
      this.nativeModule.trackInAppPurchases();
    } else {
      this.throwUnsupportedPlatform();
    }
  }

  trackGooglePlayPurchase(
    item: string,
    priceMicros: number,
    currencyCode: string,
    purchaseData: string,
    dataSignature: string,
    params?: Parameters,
    eventName?: string
  ): void {
    if (Platform.OS === 'android') {
      if (!params && !eventName) {
        this.nativeModule.trackGooglePlayPurchase(
          item,
          priceMicros,
          currencyCode,
          purchaseData,
          dataSignature
        );
      } else if (params && !eventName) {
        this.nativeModule.trackGooglePlayPurchaseWithParams(
          item,
          priceMicros,
          currencyCode,
          purchaseData,
          dataSignature,
          params
        );
      } else if (eventName && params) {
        this.nativeModule.trackGooglePlayPurchaseWithEvent(
          eventName,
          item,
          priceMicros,
          currencyCode,
          purchaseData,
          dataSignature,
          params
        );
      }
    } else {
      this.throwUnsupportedPlatform();
    }
  }

  disableLocationCollection(): void {
    this.nativeModule.disableLocationCollection();
  }

  setDeviceLocation(
    latitude: number,
    longitude: number,
    type: LocationAccuracyType = LocationAccuracyType.CELL
  ): void {
    this.nativeModule.setDeviceLocation(latitude, longitude, type);
  }

  pauseState(): void {
    this.nativeModule.pauseState();
  }

  resumeState(): void {
    this.nativeModule.resumeState();
  }

  trackAllAppScreens(): void {
    this.nativeModule.trackAllAppScreens();
  }
  advanceTo(name: string | null, info?: string, params?: Parameters): void {
    if (!info && !params) {
      this.nativeModule.advanceTo(name);
    } else if (info && !params) {
      this.nativeModule.advanceToWithInfo(name, info);
    } else if (!info && params) {
      this.nativeModule.advanceToWithParams(name, params);
    } else {
      this.nativeModule.advanceToWithInfoAndParams(name, info, params);
    }
  }

  onVariablesChangedAndNoDownloadsPending(callback: () => void): void {
    this.nativeModule.onVariablesChangedAndNoDownloadsPending(
      LeanplumSdkModule.ON_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING
    );
    this.addListener(
      LeanplumSdkModule.ON_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING,
      callback
    );
  }

  onceVariablesChangedAndNoDownloadsPending(callback: () => void): void {
    this.nativeModule.onVariablesChangedAndNoDownloadsPending(
      LeanplumSdkModule.ONCE_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING
    );
    this.addListener(
      LeanplumSdkModule.ONCE_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING,
      callback
    );
  }

  onMessageDisplayed(callback: (data: MessageArchiveData) => void): void {
    this.nativeModule.onMessageDisplayed(
      LeanplumSdkModule.ON_MESSAGE_DISPLAYED
    );
    this.addListener(LeanplumSdkModule.ON_MESSAGE_DISPLAYED, callback);
  }
}
export const Leanplum = new LeanplumSdkModule(NativeModules.Leanplum);
