package com.reactlibrary.inbox.mapper;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import com.leanplum.LeanplumInboxMessage;
import com.reactlibrary.inbox.mapper.def.BasicMapper;

public class LeanplumInboxMessageMapper implements BasicMapper<LeanplumInboxMessage> {

    public WritableMap toWritableMap(LeanplumInboxMessage entity) {
        if (entity == null) return null;

        WritableMap writableMap = Arguments.createMap();

        writableMap.putString("messageId",entity.getMessageId());
        writableMap.putString("title",entity.getTitle());
        writableMap.putString("subtitle",entity.getSubtitle());
        writableMap.putString("imageFilePath",entity.getImageFilePath());
        //TODO we might need mapper for Uri object?
        writableMap.putString("imageUrl",entity.getImageUrl().toString());
        writableMap.putString("deliveryTimestamp",entity.getDeliveryTimestamp().toString());
        writableMap.putString("expirationTimestamp",entity.getExpirationTimestamp().toString());
        writableMap.putBoolean("isRead",entity.isRead());
        writableMap.putString("data", entity.getData().toString());

        return writableMap;
    }
}
