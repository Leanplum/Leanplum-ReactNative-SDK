/*
  MapUtil exposes a set of helper methods for working with
  ReadableMap (by React Native), Map<String, Object>, and JSONObject.
 */

package com.leanplum.rn.utils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableMap;

import java.util.List;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class MapUtil {

    public static JSONObject toJSONObject(ReadableMap readableMap) throws JSONException {
        JSONObject jsonObject = new JSONObject();

        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();

        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            ReadableType type = readableMap.getType(key);

            switch (type) {
                case Null:
                    jsonObject.put(key, null);
                    break;
                case Boolean:
                    jsonObject.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    jsonObject.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    jsonObject.put(key, readableMap.getString(key));
                    break;
                case Map:
                    jsonObject.put(key, MapUtil.toJSONObject(readableMap.getMap(key)));
                    break;
                case Array:
                    jsonObject.put(key, ArrayUtil.toJSONArray(readableMap.getArray(key)));
                    break;
            }
        }

        return jsonObject;
    }

    public static Map<String, Object> toMap(JSONObject jsonObject) throws JSONException {
        Map<String, Object> map = new HashMap<>();
        Iterator<String> iterator = jsonObject.keys();

        while (iterator.hasNext()) {
            String key = iterator.next();
            Object value = jsonObject.get(key);

            if (value instanceof JSONObject) {
                value = MapUtil.toMap((JSONObject) value);
            }
            if (value instanceof JSONArray) {
                value = ArrayUtil.toArray((JSONArray) value);
            }

            map.put(key, value);
        }

        return map;
    }

    public static Map<String, Object> toMap(ReadableMap readableMap) {
        Map<String, Object> map = new HashMap<>();
        ReadableMapKeySetIterator iterator = readableMap.keySetIterator();

        while (iterator.hasNextKey()) {
            String key = iterator.nextKey();
            ReadableType type = readableMap.getType(key);

            switch (type) {
                case Null:
                    map.put(key, null);
                    break;
                case Boolean:
                    map.put(key, readableMap.getBoolean(key));
                    break;
                case Number:
                    map.put(key, readableMap.getDouble(key));
                    break;
                case String:
                    map.put(key, readableMap.getString(key));
                    break;
                case Map:
                    map.put(key, MapUtil.toMap(readableMap.getMap(key)));
                    break;
                case Array:
                    map.put(key, ArrayUtil.toArray(readableMap.getArray(key)));
                    break;
            }
        }

        return map;
    }

    public static WritableMap toWritableMap(Map<String, Object> map) {
        WritableMap writableMap = Arguments.createMap();
        Iterator iterator = map.entrySet().iterator();

        while (iterator.hasNext()) {
            Map.Entry pair = (Map.Entry) iterator.next();
            writableMap.merge(addValue((String) pair.getKey(), pair.getValue()));
            iterator.remove();
        }

        return writableMap;
    }

    public static WritableMap addValue(String key, Object value) {
        WritableMap writableMap = Arguments.createMap();
        if (value == null) {
            writableMap.putNull(key);
        } else if (value instanceof Boolean) {
            writableMap.putBoolean(key, (Boolean) value);
        } else if (value instanceof Double) {
            writableMap.putDouble(key, (Double) value);
        } else if (value instanceof Integer) {
            writableMap.putInt(key, (Integer) value);
        } else if (value instanceof String) {
            writableMap.putString(key, (String) value);
        } else if (value instanceof Map) {
            writableMap.putMap(key, MapUtil.toWritableMap((Map<String, Object>) value));
        } else if (value.getClass() != null && (value.getClass().isArray() || value instanceof ArrayList)) {
            writableMap.putArray(key, ArrayUtil.toWritableArray((ArrayList) value));
        } else if (value instanceof List) {
            ArrayList<Object> arrayList = new ArrayList<>((List<?>) value);
            writableMap.putArray(key, ArrayUtil.toWritableArray(arrayList));
        }
        return writableMap;
    }

    public static WritableMap jsonVariableToWritableMap(JSONObject jsonObject) throws JSONException {
        WritableMap writableMap = Arguments.createMap();
        Iterator<String> keys = jsonObject.keys();

        while(keys.hasNext()) {
            String key = keys.next();
            Object value = jsonObject.get(key);

            if (value instanceof Boolean) {
                writableMap.putBoolean(key, (Boolean) value);
            } else if (value instanceof Double) {
                writableMap.putDouble(key, (Double) value);
            } else if (value instanceof Integer) {
                writableMap.putInt(key, (Integer) value);
            } else if (value instanceof String) {
                writableMap.putString(key, (String) value);
            } else if (value instanceof JSONObject) {
                WritableMap valueMap = jsonVariableToWritableMap((JSONObject) value);
                writableMap.putMap(key, valueMap);
            } else {
                writableMap.putString(key, value.toString());
            }
        }
        return writableMap;
    }
}
