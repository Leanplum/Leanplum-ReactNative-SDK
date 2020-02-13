import {NativeModules, Platform, NativeEventEmitter} from 'react-native';
import {LocationAccuracyType} from './location-accuracy-type';

export type VariableValue = string | boolean | number | Array<any> | object;

export interface AllVariablesValue {
  [name: string]: VariableValue;
}

class LeanplumSdkModule extends NativeEventEmitter {
  private readonly nativeModule: any;
  private static readonly PURCHASE_EVENT_NAME: string = 'Purchase';
  private static readonly ON_VARIABLE_CHANGE_LISTENER: string =
    'onVariableChanged';
  private static readonly ON_VARIABLES_CHANGE_LISTENER: string =
    'onVariablesChanged';

  constructor(nativeModule: any) {
    super(nativeModule);
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      this.nativeModule = nativeModule;
    } else {
      this.throwUnsupportedPlatform();
    }

    this.setListenersNames();
  }

  setListenersNames(): void {
    this.nativeModule.setListenersNames(
      LeanplumSdkModule.ON_VARIABLE_CHANGE_LISTENER,
      LeanplumSdkModule.ON_VARIABLES_CHANGE_LISTENER,
    );
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

  setDeviceId(id: string) {
    this.nativeModule.setDeviceId(id);
  }

  parseVariables() {
    this.nativeModule.parseVariables();
  }

  setUserId(id: string) {
    this.nativeModule.setUserId(id);
  }

  setUserAttributes(attributes: any) {
    this.nativeModule.setUserAttributes(attributes);
  }

  /**
   * Define/Set multiple primitive variables using JSON object, we can use this method if we want to define multiple variables at once
   *
   * @param object object with multiple variables
   */
  setVariables(variablesObject: AllVariablesValue): void {
    this.nativeModule.setVariables(variablesObject);
  }

  /**
   * Get value for specific variable, if we want to be sure that the method will return latest variable value
   * we need to invoke forceContentUpdate() before invoking getVariable
   *
   * @param name name of the variable
   * @returns a Promise with variable value
   */
  async getVariable(name: String): Promise<VariableValue> {
    return await this.nativeModule.getVariable(name);
  }

  /**
   * Get value for specific variable, if we want to be sure that the method will return latest variable value
   * we need to invoke forceContentUpdate() before invoking getVariable
   *
   * @param name name of the variable
   * @param defaultValue default value of the variable
   */
  async getVariables(): Promise<AllVariablesValue> {
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
    onAssetReadyCallback: (path: string) => void,
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
    callback: (value: VariableValue) => void,
  ): void {
    this.nativeModule.onValueChanged(variableName);
    this.addListener(
      `${LeanplumSdkModule.ON_VARIABLE_CHANGE_LISTENER}.${variableName}`,
      callback,
    );
  }

  /**
   * add callback when all variables are ready
   *
   * @param handler callback that is going to be invoked when all variables are ready
   */
  onVariablesChanged(callback: (value: AllVariablesValue) => void): void {
    this.nativeModule.onVariablesChanged();
    this.addListener(LeanplumSdkModule.ON_VARIABLES_CHANGE_LISTENER, callback);
  }

  start(): void {
    this.nativeModule.start();
  }

  forceContentUpdate(): void {
    this.nativeModule.forceContentUpdate();
  }

  track(event: string, params: any = {}): void {
    this.nativeModule.track(event, params);
  }

  trackPurchase(
    value: number,
    currencyCode: string,
    purchaseParams: any,
    purchaseEvent: string = LeanplumSdkModule.PURCHASE_EVENT_NAME,
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
    latitude: number,
    longitude: number,
    type: LocationAccuracyType = LocationAccuracyType.CELL,
  ) {
    this.nativeModule.setDeviceLocation(latitude, longitude, type);
  }
}

const Leanplum = new LeanplumSdkModule(NativeModules.LeanplumSdk);
export {Leanplum};
