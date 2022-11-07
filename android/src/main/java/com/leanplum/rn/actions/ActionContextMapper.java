package com.leanplum.rn.actions;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.leanplum.ActionContext;
import com.leanplum.Leanplum;
import java.util.Date;

public class ActionContextMapper {
    public static WritableMap toWriteableMap(@NonNull ActionContext context) {
        WritableMap writableMap = Arguments.createMap();
        // field of MessageArchiveData
        writableMap.putString("messageID", context.getMessageId());
        writableMap.putString("messageBody", getMessageBody(context));
        writableMap.putString("recipientUserID", Leanplum.getUserId());
        writableMap.putString("deliveryDateTime", new Date().toString());
        // fields from ActionContext
        writableMap.putString("actionName", context.actionName());
        return writableMap;
    }

    private static String getMessageBody(ActionContext actionContext) {
        String messageBody = "";
        try {
            messageBody = Leanplum.messageBodyFromContext(actionContext);
        } catch (Throwable ignored) {
        }
        return messageBody;
    }
}
