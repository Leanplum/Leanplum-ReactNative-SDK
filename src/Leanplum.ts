import {NativeModules, Platform, NativeEventEmitter, EmitterSubscription} from 'react-native';
import CleverTap from 'clevertap-react-native';
import {
  Variables,
  Variable,
  Parameters,
  LocationAccuracyType,
  ActionContextData,
  SecuredVars,
  MigrationConfig
} from './leanplum-types';

/**
 * Leanplum React Native Sdk
 */
class LeanplumSdkModule extends NativeEventEmitter {
  /** NativeModule of react-native. */
  private readonly nativeModule: any;

  /** Flag showing whether CleverTap instance is created */
  private cleverTapReady: boolean = false;

  /** Listener name used to notify when CleverTap instance is created. */
  private static readonly CLEVERTAP_READY_INTERNAL_EVENT = 'ctReadyEvent';

  /** Default value for the name of the Purchase event. */
  private static readonly PURCHASE_EVENT_NAME: string = 'Purchase';

  /** Listener name used when the variables receive new values from the server. */
  private static readonly ON_VARIABLES_CHANGE_LISTENER: string =
    'onVariablesChanged';

  /** Listener name used when no more file downloads are pending. */
  private static readonly ON_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING =
    'onVariablesChangedAndNoDownloadsPending';

  /** Listener name used once when no more file downloads are pending. */
  private static readonly ONCE_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING =
    'onceVariablesChangedAndNoDownloadsPending';

  /** Listener name used when a message is displayed. */
  private static readonly ON_MESSAGE_DISPLAYED = 'onMessageDisplayed';

  /** Listener name used when a message is dismissed. */
  private static readonly ON_MESSAGE_DISMISSED = 'onMessageDismissed';

  /** Listener name used when message action is executed. */
  private static readonly ON_MESSAGE_ACTION = 'onMessageAction';

  /** Listener name used when CleverTap instance is initialized. */
  private static readonly ON_CT_INSTANCE = 'onCleverTapInstance';

  /**
   * Creates an instance of LeanplumSdkModule.
   * @param nativeModule the NativeModule of react-native
   */
  constructor(nativeModule: any) {
    super(nativeModule);
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      this.nativeModule = nativeModule;
      this.registerCleverTapInstanceListener();
    } else {
      this.throwUnsupportedPlatform();
    }
  }

  private registerCleverTapInstanceListener(): void {
    this.nativeModule.onCleverTapInstance(LeanplumSdkModule.ON_CT_INSTANCE);
    this.addListener(LeanplumSdkModule.ON_CT_INSTANCE, accountId => {
      if (CleverTap != undefined) {
        console.log(`[Leanplum] Setting CleverTap instance with: ${accountId}`);
        CleverTap.setInstanceWithAccountId(accountId);
        this.cleverTapReady = true;
        this.emit(LeanplumSdkModule.CLEVERTAP_READY_INTERNAL_EVENT);
        this.removeAllListeners(LeanplumSdkModule.CLEVERTAP_READY_INTERNAL_EVENT);
      } else {
        console.log('[Leanplum] CleverTap dependency is missing!');
      }
    });
  }

  /**
   * Registers a callback to be invoked once CleverTap instance is created using Leanplum data. If
   * CleverTap instance is already created, the callback will be invoked immediately.
   *
   * @param callback Callback to be invoked once CleverTap instance is ready.
   *
   * @returns Returns null if CleveTap is already created or EmitterSubscription object. You can use
   *          the EmitterSubscription to cancel the subscription.
   */
  onCleverTapReady(callback: () => void): (EmitterSubscription | null) {
    if (this.cleverTapReady) {
      // CleverTap was already created before invoking this method.
      callback();
      return null;
    } else {
      return this.addListener(LeanplumSdkModule.CLEVERTAP_READY_INTERNAL_EVENT, callback);
    }
  }

  /** Throw an exception with unsupported platform message. */
  throwUnsupportedPlatform() {
    throw new Error('Unsupported Platform');
  }
  
  /**
   * Must call before issuing any calls to the API, including start.
   *
   * @param appVersion Your app version.
   */
  setAppVersion(appVersion: string): void {
    this.nativeModule.setAppVersion(appVersion);
  }

  /**
   * Must call either this or [[LeanplumSdkModule.setAppIdForProductionMode]] before issuing any calls to
   * the API, including start.
   *
   * @param appId Your app ID.
   * @param accessKey Your development key.
   */
  setAppIdForDevelopmentMode(appId: string, accessKey: string): void {
    this.nativeModule.setAppIdForDevelopmentMode(appId, accessKey);
  }

  /**
   * Must call either this or [[LeanplumSdkModule.setAppIdForDevelopmentMode]] before issuing any calls
   * to the API, including start.
   *
   * @param appId Your app ID.
   * @param accessKey Your production key.
   */
  setAppIdForProductionMode(appId: string, accessKey: string): void {
    this.nativeModule.setAppIdForProductionMode(appId, accessKey);
  }
  /**
   * Sets a custom device ID.
   * @param id.
   */
  setDeviceId(id: string): void {
    this.nativeModule.setDeviceId(id);
  }
  /**
   * Updates the user ID.
   * @param id.
   */
  setUserId(id: string): void {
    this.nativeModule.setUserId(id);
  }
  /**
   * Adds or modifies user attributes.
   * @param attributes.
   */
  setUserAttributes(attributes: Parameters): void {
    const keys = Object.keys(attributes);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = attributes[key];
      if (value instanceof Date) {
        const tsValue = `lp_date_${value.getTime()}`;
        attributes[key] = tsValue;
      }
    }
    this.nativeModule.setUserAttributes(attributes);
  }

  /**
   * Returns the userId in the current Leanplum session. This should only be called after [[LeanplumSdkModule.start]].
   * @returns userId in the current Leanplum session.
   */
  async userId(): Promise<string> {
    return await this.nativeModule.userId();
  }
  /**
   * Gets the deviceId in the current Leanplum session. This should only be called after [[LeanplumSdkModule.start]].
   * @returns deviceId in the current Leanplum session.
   */
  async deviceId(): Promise<string> {
    return await this.nativeModule.deviceId();
  }
  /**
   * Define/Set new variables with default values. This should only be called after [[LeanplumSdkModule.start]].
   * @param variables with default values.
   */
  setVariables(variables: Variables): void {
    this.nativeModule.setVariables(variables);
  }
  /**
   * Optional. Sets the API server. The API path is of the form http[s]://hostname/apiPath
   *
   * @param hostName The name of the API host, such as www.leanplum.com
   * @param apiPath The name of the API servlet, such as api
   * @param ssl Whether to use SSL
   */
  setApiConnectionSettings(
    hostName: string,
    apiPath: string,
    ssl: boolean
  ): void {
    this.nativeModule.setApiConnectionSettings(hostName, apiPath, ssl);
  }

  /**
   * Optional. Sets the socket server path for Development mode. Path is of the form hostName:port
   *
   * @param hostName The host name of the socket server.
   * @param port The port to connect to.
   */
  setSocketConnectionSettings(hostName: string, port: number): void {
    this.nativeModule.setSocketConnectionSettings(hostName, port);
  }

  /**
   * Get value for specific variable previously defined.
   *
   * @param name of the variable.
   * @returns a Promise with the variable value.
   */
  async getVariable(name: String): Promise<Variable> {
    return await this.nativeModule.getVariable(name);
  }

  /**
   * Get the values for all the variables previously defined.
   *
   * @returns a Promise with the values of the variables.
   */
  async getVariables(): Promise<Variables> {
    return await this.nativeModule.getVariables();
  }

  /**
   * Define/Set asset with the default filename value. This should only be called after [[LeanplumSdkModule.start]].
   *
   * @param name of the variable.
   * @param defaultValue default filename of the asset.
   * @param onAssetReadyCallback callback with the path of the asset as a parameter that will be invoked when the asset is already downloaded.
   */
  setVariableAsset(
    name: string,
    filename: string,
    onAssetReadyCallback: (path: string) => void
  ): void {
    this.nativeModule.setVariableAsset(name, filename);
    this.addListener(name, onAssetReadyCallback);
  }
  /**
   * Gets variable asset path previously defined.
   * @param name.
   * @returns variable asset.
   */
  async getVariableAsset(name: string): Promise<string> {
    return await this.nativeModule.getVariableAsset(name);
  }

  /**
   * Add callback when start finishes. This should only be called after [[LeanplumSdkModule.start]].
   *
   * @param callback to be invoked with a boolean value as parameter when start finishes.
   */
  onStartResponse(callback: (success: boolean) => void) {
    this.nativeModule.onStartResponse(callback);
  }

  /**
   * Register a callback when a specific variable receive new value from the server.
   *
   * @param name of the variable previously defined.
   * @param callback to be invoked with the value of the variable as parameter.
   */
  onValueChanged(
    variableName: string,
    callback: (value: Variable) => void
  ): void {
    this.nativeModule.onValueChanged(variableName);
    this.addListener(variableName, callback);
  }

  /**
   * Register a callback when the variables receive new values from the server.
   *
   * @param callback to be invoked with the values of the variables as parameter.
   */
  onVariablesChanged(callback: (value: Variables) => void): void {
    this.nativeModule.onVariablesChanged(
      LeanplumSdkModule.ON_VARIABLES_CHANGE_LISTENER
    );
    this.addListener(LeanplumSdkModule.ON_VARIABLES_CHANGE_LISTENER, callback);
  }
  /**
   * Call this when your application starts. This will initiate a call to Leanplum's servers to get
   * the values of the variables used in your app.
   */
  start(): void {
    this.nativeModule.start();
  }

  /**
   * Returns whether or not Leanplum has finished starting.
   *
   * @returns a Promise with the value of hasStarted.
   */
  async hasStarted(): Promise<boolean> {
    return await this.nativeModule.hasStarted();
  }

  /**
   * Forces content to update from the server. If variables have changed, the appropriate callbacks
   * will fire. Use sparingly as if the app is updated, you'll have to deal with potentially
   * inconsistent state or user experience.
   */
  forceContentUpdate(): void {
    this.nativeModule.forceContentUpdate();
  }
  /**
   * Logs a particular event in your application. The string can be any value of your choosing, and
   * will show up in the dashboard.
   * @param event Name of the event.
   * @param [params] Key-value pairs with metrics or data associated with the event. Parameters can be
   * strings or numbers. You can use up to 200 different parameter names in your app.
   */
  track(event: string, params: Parameters = {}): void {
    this.nativeModule.track(event, params);
  }

  /**
   * Manually track purchase event with currency code in your application.
   *
   * @param value The value of the event. Can be price.
   * @param currencyCode The currency code corresponding to the price.
   * @param purchaseParams Key-value pairs with metrics or data associated with the event. Parameters can be
   * strings or numbers. You can use up to 200 different parameter names in your app.
   * @param purchaseEvent Name of the event.
   */
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
  /**
   * Automatically tracks in app purchases ios. Only for iOS.
   */
  trackInAppPurchasesIos(): void {
    if (Platform.OS === 'ios') {
      this.nativeModule.trackInAppPurchases();
    } else {
      this.throwUnsupportedPlatform();
    }
  }
  /**
   * Tracks an in-app purchase as a Purchase event. Only for Android.
   * @param item The name of the item that was purchased.
   * @param priceMicros The price in micros in the user's local currency.
   * @param currencyCode The currency code corresponding to the price.
   * @param purchaseData Purchase data from purchase.
   * @param dataSignature Signature from purchase.
   * @param [params] Any additional parameters to track with the event.
   * @param [eventName] The name of the event to record the purchase under.
   */
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
  /**
   * Disable automatically location collection
   */
  disableLocationCollection(): void {
    this.nativeModule.disableLocationCollection();
  }

  /**
   * Set location manually. Best if used in after calling [[LeanplumSdkModule.disableLocationCollection]]. Useful if you
   * want to apply additional logic before sending in the location.
   *
   * @param latitude Device latitude.
   * @param longitude Device longitude.
   * @param type of the location.
   */
  setDeviceLocation(
    latitude: number,
    longitude: number,
    type: LocationAccuracyType = LocationAccuracyType.CELL
  ): void {
    this.nativeModule.setDeviceLocation(latitude, longitude, type);
  }
  /**
   * Pauses the current state. You can use this if your game has a "pause" mode. You shouldn't call
   * it when someone switches out of your app because that's done automatically.
   */
  pauseState(): void {
    this.nativeModule.pauseState();
  }
  /**
   * Resumes the current state.
   */
  resumeState(): void {
    this.nativeModule.resumeState();
  }
  /**
   * Enable screen tracking.
   */
  trackAllAppScreens(): void {
    this.nativeModule.trackAllAppScreens();
  }
  /**
   * Advances to a particular state in your application. The string can be any value of your
   * choosing, and will show up in the dashboard. A state is a section of your app that the user is
   * currently in.
   * @param name of the state. State may be empty for message impression events.
   * @param [info] Basic context associated with the state, such as the item purchased. info is
   * treated like a default parameter.
   * @param [params] Key-value pairs with metrics or data associated with the state. Parameters can be
   * strings or numbers. You can use up to 200 different parameter names in your app.
   */
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
  /**
   * Register a callback for when no more file downloads are pending (either when no files needed to be
   * downloaded or all downloads have been completed).
   * @param callback to be invoked
   */
  onVariablesChangedAndNoDownloadsPending(callback: () => void): void {
    this.nativeModule.onVariablesChangedAndNoDownloadsPending(
      LeanplumSdkModule.ON_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING
    );
    this.addListener(
      LeanplumSdkModule.ON_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING,
      callback
    );
  }
  /**
   * Register a callback to call ONCE when no more file downloads are pending (either when no files
   * needed to be downloaded or all downloads have been completed).
   * @param callback to be invoked
   */
  onceVariablesChangedAndNoDownloadsPending(callback: () => void): void {
    this.nativeModule.onVariablesChangedAndNoDownloadsPending(
      LeanplumSdkModule.ONCE_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING
    );
    this.addListener(
      LeanplumSdkModule.ONCE_VARIABLES_CHANGED_AND_NO_DOWNLOADS_PENDING,
      callback
    );
  }
  /**
   * Register a callback for when a message is displayed.
   * @param callback Callback to be invoked with the message data as parameter, use null value
   * to reset.
   */
  onMessageDisplayed(callback: ((data: ActionContextData) => void) | null): void {
    if (callback != null) {
      this.nativeModule.onMessageDisplayed(LeanplumSdkModule.ON_MESSAGE_DISPLAYED);
      this.addListener(LeanplumSdkModule.ON_MESSAGE_DISPLAYED, callback);
    } else {
      this.nativeModule.onMessageDisplayed(null);
      this.removeAllListeners(LeanplumSdkModule.ON_MESSAGE_DISPLAYED);
    }
  }

  /**
   * Register a callback for when a message is dismissed.
   * @param callback Callback to be invoked with the message data as parameter, use null value
   * to reset.
   */
  onMessageDismissed(callback: ((data: ActionContextData) => void) | null): void {
    if (callback != null) {
      this.nativeModule.onMessageDismissed(LeanplumSdkModule.ON_MESSAGE_DISMISSED);
      this.addListener(LeanplumSdkModule.ON_MESSAGE_DISMISSED, callback);
    } else {
      this.nativeModule.onMessageDismissed(null);
      this.removeAllListeners(LeanplumSdkModule.ON_MESSAGE_DISMISSED);
    }
  }

  /**
   * Register a callback for when a message action is executed.
   * @param callback Callback to be invoked with the message data as parameter, use null value
   * to reset.
   */
  onMessageAction(callback: ((data: ActionContextData) => void) | null): void {
    if (callback != null) {
      this.nativeModule.onMessageAction(LeanplumSdkModule.ON_MESSAGE_ACTION);
      this.addListener(LeanplumSdkModule.ON_MESSAGE_ACTION, callback);
    } else {
      this.nativeModule.onMessageAction(null);
      this.removeAllListeners(LeanplumSdkModule.ON_MESSAGE_ACTION);
    }
  }

  registerForRemoteNotifications(): void {
    this.nativeModule.registerForRemoteNotifications();
  }

  async securedVars(): Promise<SecuredVars> {
    return await this.nativeModule.securedVars();
  }

  async isQueuePaused(): Promise<boolean> {
    return await this.nativeModule.isQueuePaused();
  }

  setQueuePaused(paused: boolean): void {
    this.nativeModule.setQueuePaused(paused);
  }

  async isQueueEnabled(): Promise<boolean> {
    return await this.nativeModule.isQueueEnabled();
  }

  setQueueEnabled(enabled: boolean): void {
    this.nativeModule.setQueueEnabled(enabled);
  }

  async migrationConfig(): Promise<MigrationConfig> {
    return await this.nativeModule.migrationConfig();
  }

  /**
   * Use only for debug purposes.
   * Disables FCM forwarding to CT.
   */
  disableAndroidFcmForwarding(): void {
    if (Platform.OS === 'android') {
      this.nativeModule.disableAndroidFcmForwarding();
    }
  }

  /**
   * Use only for debug purposes.
   */
  forceNewDeviceId(deviceId: string): void {
    if (Platform.OS === 'android') {
      this.nativeModule.forceNewDeviceId(deviceId);
    } else {
      // TODO iOS ?
    }
  }

}
export const Leanplum = new LeanplumSdkModule(NativeModules.Leanplum);
