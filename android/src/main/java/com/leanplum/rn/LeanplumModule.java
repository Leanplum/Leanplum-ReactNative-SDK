package com.leanplum.rn;

import android.location.Location;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.leanplum.Leanplum;
import com.leanplum.LeanplumLocationAccuracyType;
import com.leanplum.Var;
import com.leanplum.SecuredVars;
import com.leanplum.callbacks.MessageDisplayedCallback;
import com.leanplum.callbacks.StartCallback;
import com.leanplum.callbacks.VariableCallback;
import com.leanplum.callbacks.VariablesChangedCallback;
import com.leanplum.internal.Constants;
import com.leanplum.models.MessageArchiveData;
import com.leanplum.rn.utils.ArrayUtil;
import com.leanplum.rn.utils.MapUtil;
import com.leanplum.rn.utils.MessageArchiveDataUtil;

import org.json.JSONException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class LeanplumModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    public static Map<String, Object> variables = new HashMap<String, Object>();

    public LeanplumModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Leanplum";
    }

    @ReactMethod
    public void setAppVersion(String appVersion) {
        Leanplum.setAppVersion(appVersion);
    }

    @ReactMethod
    public void setAppIdForDevelopmentMode(String appId, String accessKey) {
        Leanplum.setAppIdForDevelopmentMode(appId, accessKey);
    }

    @ReactMethod
    public void setAppIdForProductionMode(String appId, String accessKey) {
        Leanplum.setAppIdForProductionMode(appId, accessKey);
    }

    @ReactMethod
    public void setApiConnectionSettings(String hostName, String servletName, Boolean ssl) {
        Leanplum.setApiConnectionSettings(hostName, servletName, ssl);
    }

    @ReactMethod
    public void setSocketConnectionSettings(String hostName, Integer port) {
        Leanplum.setSocketConnectionSettings(hostName, port);
    }


    @ReactMethod
    public void setDeviceId(String id) {
        Leanplum.setDeviceId(id);
    }

    @ReactMethod
    public void setUserId(String id) {
        Leanplum.setUserId(id);
    }

    @ReactMethod
    public void setUserAttributes(ReadableMap attributes) {
        Leanplum.setUserAttributes(attributes.toHashMap());
    }

    @ReactMethod
    public void start() {
        Leanplum.start(Leanplum.getContext());
    }

    @ReactMethod
    public void hasStarted(Promise promise) {
        promise.resolve(Leanplum.hasStarted());
    }

    @ReactMethod
    public void track(String event, ReadableMap params) {
        Leanplum.track(event, params.toHashMap());
    }

    @ReactMethod
    public void trackPurchase(String purchaseEvent, Double value, String currencyCode, ReadableMap purchaseParams) {
        Leanplum.trackPurchase(purchaseEvent, value, currencyCode, purchaseParams.toHashMap());

    }

    @ReactMethod
    public void trackGooglePlayPurchase(String item, Integer priceMicros, String currencyCode,
                                        String purchaseData, String dataSignature) {
        Leanplum.trackGooglePlayPurchase(item, priceMicros, currencyCode, purchaseData, dataSignature);
    }

    @ReactMethod
    public void trackGooglePlayPurchaseWithParams(String item, Integer priceMicros, String currencyCode,
                                                  String purchaseData, String dataSignature, ReadableMap params) {
        Leanplum.trackGooglePlayPurchase(item, priceMicros, currencyCode, purchaseData, dataSignature, params.toHashMap());

    }

    @ReactMethod
    public void trackGooglePlayPurchaseWithEvent(String eventName, String item, Integer priceMicros, String currencyCode,
                                                 String purchaseData, String dataSignature, ReadableMap params) {
        Leanplum.trackGooglePlayPurchase(eventName, item, priceMicros, currencyCode, purchaseData, dataSignature, params.toHashMap());

    }

    @ReactMethod
    public void disableLocationCollection() {
        Leanplum.disableLocationCollection();
    }

    @ReactMethod
    public void setDeviceLocation(Double latitude, Double longitude, Integer type) {
        Location location = new Location("");
        location.setLatitude(latitude);
        location.setLongitude(longitude);
        LeanplumLocationAccuracyType accuracyType = LeanplumLocationAccuracyType.values()[type];
        Leanplum.setDeviceLocation(location, accuracyType);
    }

    @ReactMethod
    public void forceContentUpdate() {
        Leanplum.forceContentUpdate();
    }

    /**
     * Define/Set variables using JSON object, we can use this method if we want to
     * define multiple variables at once
     *
     * @param object RN object
     */
    @ReactMethod
    public void setVariables(ReadableMap object) throws JSONException {
        for (Map.Entry<String, Object> entry : object.toHashMap().entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            variables.put(key, Var.define(key, value));
        }
    }


    @ReactMethod
    public void getVariable(String name, Promise promise) {
        promise.resolve(getVariableValue(name));
    }

    @ReactMethod
    public void userId(Promise promise) {
        promise.resolve(Leanplum.getUserId());
    }

    @ReactMethod
    public void deviceId(Promise promise) {
        promise.resolve(Leanplum.getDeviceId());
    }

    private Object getVariableValue(String name) {
        if (variables.containsKey(name)) {
            Var<?> variable = (Var<?>) variables.get(name);
            Object variableValue = variable.value();
            Object value;
            switch (variable.kind()) {
                case Constants.Kinds.DICTIONARY:
                    value = MapUtil.toWritableMap((Map<String, Object>) variableValue);
                    break;
                case Constants.Kinds.ARRAY:
                    value = ArrayUtil.toWritableArray((ArrayList) variableValue);
                    break;
                default:
                    value = variableValue;
            }
            return value;
        }
        // TODO throw an Error
        return new Object();
    }

    @ReactMethod
    public void getVariables(Promise promise) {
        promise.resolve(getVariablesValues());
    }

    private WritableMap getVariablesValues() {
        WritableMap writableMap = Arguments.createMap();
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            String key = entry.getKey();
            Var<?> variable = (Var<?>) entry.getValue();
            if (variable.kind() == Constants.Kinds.FILE) {
                continue;
            } else {
                WritableMap variableWritableMap = MapUtil.addValue(key, variable.value());
                writableMap.merge(variableWritableMap);
            }
        }
        return writableMap;
    }

    private String getRnAssetPath(String path) {
        return path.replace("/data/user/0", "file:///data/data");
    }

    /**
     * Define/Set asset, we can use this method if we want to define asset
     *
     * @param name         name of the variable
     * @param defaultValue default value of the variable
     */
    @ReactMethod
    public void setVariableAsset(final String name, String defaultValue) {
        Var<String> var = Var.defineAsset(name, defaultValue);
        variables.put(name, var);
        var.addFileReadyHandler(new VariableCallback<String>() {
            @Override
            public void handle(Var<String> var) {
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(name,
                        getRnAssetPath(var.fileValue()));
            }
        });
    }

    @ReactMethod
    public void getVariableAsset(String name, Promise promise) {
        Var<?> variable = (Var<?>) variables.get(name);
        promise.resolve(getRnAssetPath(variable.fileValue()));
    }

    /**
     * add value change callback for specific variable
     *
     * @param name name of the variable on which we will register the handler
     */
    @ReactMethod
    public void onValueChanged(final String name) {
        Var<Object> var = (Var<Object>) variables.get(name);
        var.addValueChangedHandler(new VariableCallback<Object>() {
            @Override
            public void handle(Var<Object> var) {
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(name,
                        getVariableValue(name));
            }
        });
    }

    /**
     * add callback when start finishes
     *
     * @param successCallback Success Callback
     */
    @ReactMethod
    public void onStartResponse(final Callback successCallback) {
        Leanplum.addStartResponseHandler(new StartCallback() {
            @Override
            public void onResponse(boolean success) {
                successCallback.invoke(success);
            }
        });
    }

    /**
     * add callback when all variables are ready
     */
    @ReactMethod
    public void onVariablesChanged(final String listener) {
        Leanplum.addVariablesChangedHandler(new VariablesChangedCallback() {
            @Override
            public void variablesChanged() {
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(listener,
                        getVariablesValues());
            }
        });
    }

    @ReactMethod
    public void pauseState() {
        Leanplum.pauseState();
    }

    @ReactMethod
    public void resumeState() {
        Leanplum.resumeState();
    }

    @ReactMethod
    public void trackAllAppScreens() {
        Leanplum.trackAllAppScreens();
    }

    @ReactMethod
    public void advanceTo(String state) {
        Leanplum.advanceTo(state);
    }

    @ReactMethod
    public void advanceToWithInfo(String state, String info) {
        Leanplum.advanceTo(state, info);
    }

    @ReactMethod
    public void advanceToWithParams(String state, ReadableMap params) {
        Leanplum.advanceTo(state, params.toHashMap());
    }

    @ReactMethod
    public void advanceToWithInfoAndParams(String state, String info, ReadableMap params) {
        Leanplum.advanceTo(state, info, params.toHashMap());
    }

    @ReactMethod
    public void onVariablesChangedAndNoDownloadsPending(final String listener) {
        Leanplum.addVariablesChangedAndNoDownloadsPendingHandler(
                new VariablesChangedCallback() {
                    @Override
                    public void variablesChanged() {
                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(listener,
                                null);
                    }
                }
        );
    }

    @ReactMethod
    public void onceVariablesChangedAndNoDownloadsPending(final String listener) {
        Leanplum.addOnceVariablesChangedAndNoDownloadsPendingHandler(
                new VariablesChangedCallback() {
                    @Override
                    public void variablesChanged() {
                        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(listener,
                                null);
                    }
                }
        );
    }

    @ReactMethod
    public void onMessageDisplayed(final String listener) {
        Leanplum.addMessageDisplayedHandler(new MessageDisplayedCallback() {
            @Override
            public void messageDisplayed(MessageArchiveData messageArchiveData) {

                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(listener,
                        MessageArchiveDataUtil.toWriteableMap(messageArchiveData));
            }
        });
    }


    @ReactMethod
    public void registerForRemoteNotifications() {
        // do nothing on Android
    }

    @ReactMethod
    public securedVars(Promise promise) {
        SecuredVars sVars = Leanplum.securedVars();
        if (sVars != null) {
            Map<String, Object> map = new HashMap();
            map.put("json", sVars.getJson());
            map.put("signature", sVars.getSignature());
            promise.resolve(MapUtil.toWritableMap(map));
            return;
        }
        promise.resolve(null);
    } 
}
