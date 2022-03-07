package com.leanplum.rn.inbox.mapper;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import com.leanplum.LeanplumInboxMessage;
import com.leanplum.internal.Log;
import com.leanplum.rn.inbox.mapper.def.BasicMapper;
import com.leanplum.rn.utils.MapUtil;
import org.json.JSONException;

public class LeanplumInboxMessageMapper implements BasicMapper<LeanplumInboxMessage> {

    public WritableMap toWritableMap(LeanplumInboxMessage entity) {
        if (entity == null)
            return null;

        WritableMap writableMap = Arguments.createMap();

        writableMap.putString("messageId", entity.getMessageId());
        writableMap.putString("title", entity.getTitle());
        writableMap.putString("subtitle", entity.getSubtitle());
        writableMap.putString("imageFilePath", entity.getImageFilePath());
        // TODO we might need mapper for Uri object?
        if (entity.getImageUrl() != null) {
            writableMap.putString("imageUrl", entity.getImageUrl().toString());
        }
        if (entity.getDeliveryTimestamp() != null) {
            writableMap.putString("deliveryTimestamp", entity.getDeliveryTimestamp().toString());
        }
        if (entity.getExpirationTimestamp() != null) {
            writableMap.putString("expirationTimestamp", entity.getExpirationTimestamp().toString());
        }
        writableMap.putBoolean("isRead", entity.isRead());
        if (entity.getData() != null) {
            try {
                writableMap.putMap("data", MapUtil.jsonVariableToWritableMap(entity.getData()));
            } catch (JSONException e) {
                Log.e("Error parsing LeanplumInboxMessage.data: " + entity.getData().toString(), e);
            }
        }

        return writableMap;
    }
}
