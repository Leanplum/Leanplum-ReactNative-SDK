package com.leanplum.rn;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.leanplum.Leanplum;
import com.leanplum.LeanplumInbox;
import com.leanplum.LeanplumInboxMessage;
import com.leanplum.callbacks.InboxChangedCallback;
import com.leanplum.callbacks.InboxSyncedCallback;
import com.leanplum.rn.inbox.mapper.LeanplumInboxMapper;
import com.leanplum.rn.inbox.mapper.LeanplumInboxMessageMapper;

public class LeanplumInboxModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public LeanplumInboxModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "LeanplumInbox";
    }

    @ReactMethod
    public void getInbox(Promise promise) {
        promise.resolve(getInboxValue());
    }

    private WritableMap getInboxValue() {
        com.leanplum.LeanplumInbox inbox = Leanplum.getInbox();
        LeanplumInboxMapper leanplumInboxMapper = new LeanplumInboxMapper(new LeanplumInboxMessageMapper());
        return leanplumInboxMapper.toWritableMap(inbox);
    }

    @ReactMethod
    public void getMessage(String messageId, Promise promise) {
        promise.resolve(getMessageValue(messageId));
    }

    private WritableMap getMessageValue(String messageId) {
        com.leanplum.LeanplumInbox inbox = Leanplum.getInbox();
        for (LeanplumInboxMessage lim : inbox.allMessages()) {
            if (lim.getMessageId().equals(messageId)) {
                LeanplumInboxMessageMapper leanplumInboxMessageMapper = new LeanplumInboxMessageMapper();
                return leanplumInboxMessageMapper.toWritableMap(lim);
            }
        }
        return null;
    }

    @ReactMethod
    public void onChanged(final String listener) {
        Leanplum.getInbox().addChangedHandler(new InboxChangedCallback() {
            @Override
            public void inboxChanged() {
                LeanplumInboxMapper leanplumInboxMapper = new LeanplumInboxMapper(new LeanplumInboxMessageMapper());
                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(listener,
                        leanplumInboxMapper.toWritableMap(Leanplum.getInbox()));
            }
        });
    }

    @ReactMethod()
    public void onForceContentUpdate(final String listener) {
        Leanplum.getInbox().addSyncedHandler(new InboxSyncedCallback() {

            @Override
            public void onForceContentUpdate(boolean success) {
                if (success) {
                    LeanplumInboxMapper leanplumInboxMapper = new LeanplumInboxMapper(new LeanplumInboxMessageMapper());
                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(listener,
                            leanplumInboxMapper.toWritableMap(Leanplum.getInbox()));
                }
            }
        });
    }

    @ReactMethod
    public void remove(String messageId) {
        LeanplumInbox inbox = Leanplum.getInbox();
        for (LeanplumInboxMessage lim : inbox.allMessages()) {
            if (lim.getMessageId().equals(messageId)) {
                lim.remove();
            }
        }
    }

    @ReactMethod
    public void read(String messageId) {
        LeanplumInbox inbox = Leanplum.getInbox();
        for (LeanplumInboxMessage lim : inbox.allMessages()) {
            if (lim.getMessageId().equals(messageId)) {
                lim.read();
            }
        }
    }

    @ReactMethod
    public void markAsRead(String messageId) {
        LeanplumInbox inbox = Leanplum.getInbox();
        for (LeanplumInboxMessage lim : inbox.allMessages()) {
            if (lim.getMessageId().equals(messageId)) {
                lim.markAsRead();
            }
        }
    }

    @ReactMethod
    public void addListener(String eventName) {
        // Needed to remove warning
    }

    @ReactMethod
    public void removeListeners(Integer count) {
        // Needed to remove warning
    }
}
