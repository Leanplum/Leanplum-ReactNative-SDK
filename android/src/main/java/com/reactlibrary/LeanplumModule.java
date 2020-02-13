package com.reactlibrary;

import android.location.Location;

import com.facebook.react.bridge.Arguments;
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
import com.leanplum.callbacks.VariableCallback;
import com.leanplum.internal.Constants;
import com.reactlibrary.utils.ArrayUtil;
import com.reactlibrary.utils.MapUtil;

import org.json.JSONException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class LeanplumModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    public static Map<String, Object> variables = new HashMap<String, Object>();
    private static String onVariableChangedListenerName;
    private static String onVariablesChangedListenerName;

    public LeanplumModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "Leanplum";
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
    public void track(String event, ReadableMap params) {
        Leanplum.track(event, params.toHashMap());
    }

    @ReactMethod
    public void trackPurchase(String purchaseEvent, Double value, String currencyCode, ReadableMap purchaseParams) {
        Leanplum.trackPurchase(purchaseEvent, value, currencyCode, purchaseParams.toHashMap());
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

    @ReactMethod
    public void setListenersNames(String onVariableChangedListenerName, String onVariablesChangedListenerName) {
        LeanplumModule.onVariableChangedListenerName = onVariableChangedListenerName;
        LeanplumModule.onVariablesChangedListenerName = onVariablesChangedListenerName;
    }

    /**
     * Define/Set variables using JSON object, we can use this method if we want to define multiple variables at once
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
                reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit(name, getRnAssetPath(var.fileValue()));
            }
        });
    }

    @ReactMethod
    public void getVariableAsset(String name, Promise promise) {
        Var<?> variable = (Var<?>) variables.get(name);
        promise.resolve(getRnAssetPath(variable.fileValue()));
    }


}
