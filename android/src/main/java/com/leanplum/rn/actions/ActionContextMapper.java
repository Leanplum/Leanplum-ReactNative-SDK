package com.leanplum.rn.actions;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;
import com.leanplum.ActionContext;
import com.leanplum.Leanplum;

public class ActionContextMapper {
    public static WritableMap toWriteableMap(@NonNull ActionContext context) {
        WritableMap writableMap = Arguments.createMap();
        writableMap.putString("id", context.getMessageId());
        writableMap.putString("messageBody", getMessageBody(context));
        writableMap.putString("actionName", context.actionName());
        return writableMap;
    }

    private static String getMessageBody(ActionContext actionContext) {
        String messageBody = "";
        try {
            messageBody = Leanplum.messageBodyFromContext(actionContext);
        } catch (Throwable ignored) {
        }
        return messageBody != null ? messageBody : "";
    }
}
