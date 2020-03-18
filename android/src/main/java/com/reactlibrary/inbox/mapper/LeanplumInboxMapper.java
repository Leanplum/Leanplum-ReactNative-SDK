package com.reactlibrary.inbox.mapper;

import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.Arguments;

import com.leanplum.LeanplumInbox;
import com.leanplum.LeanplumInboxMessage;
import com.reactlibrary.inbox.mapper.def.BasicMapper;


public class LeanplumInboxMapper implements BasicMapper<LeanplumInbox> {

    private LeanplumInboxMessageMapper leanplumInboxMessageMapper;

    public LeanplumInboxMapper (LeanplumInboxMessageMapper leanplumInboxMessageMapper) {
        this.leanplumInboxMessageMapper = leanplumInboxMessageMapper;
    }

    public WritableMap toWritableMap(LeanplumInbox entity) {
        if (entity == null) return null;
        WritableMap writableMap = Arguments.createMap();

        writableMap.putInt("count", entity.count());

        WritableArray messageIdsArray = Arguments.createArray();
        for (String messageId : entity.messagesIds()){
            messageIdsArray.pushString(messageId);
        }
        writableMap.putArray("messagesIds", messageIdsArray);

        writableMap.putInt("unreadCount", entity.unreadCount());

        WritableArray allMessagesArray = Arguments.createArray();
        for (LeanplumInboxMessage lim : entity.allMessages()) {
            allMessagesArray.pushMap(leanplumInboxMessageMapper.toWritableMap(lim));
        }
        writableMap.putArray("allMessages", allMessagesArray);

        WritableArray unreadMessagesArray = Arguments.createArray();
        for (LeanplumInboxMessage lim : entity.unreadMessages()) {
            unreadMessagesArray.pushMap(leanplumInboxMessageMapper.toWritableMap(lim));
        }
        writableMap.putArray("unreadMessages", unreadMessagesArray);

        return writableMap;
    }
}