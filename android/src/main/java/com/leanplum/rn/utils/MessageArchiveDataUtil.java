package com.leanplum.rn.utils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.leanplum.models.MessageArchiveData;

public class MessageArchiveDataUtil {
    public static WritableMap toWriteableMap(MessageArchiveData messageArchiveData) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString("messageID", messageArchiveData.messageID);
        writableMap.putString("messageBody", messageArchiveData.messageBody);
        writableMap.putString("recipientUserID", messageArchiveData.recipientUserID);
        writableMap.putString("deliveryDateTime", messageArchiveData.deliveryDateTime.toString());
        return writableMap;
    }
}
