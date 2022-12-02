package com.leanplum.rn.actions;


import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.leanplum.ActionContext;
import com.leanplum.actions.MessageDisplayListener;
import java.lang.ref.WeakReference;

public class RnMessageDisplayListener implements MessageDisplayListener {

  private static MessageDisplayListener clientListener;

  /**
   * Provides easy way to use MessageDisplayListener object from native Android code.
   */
  public static void setClientListener(MessageDisplayListener listener) {
    clientListener = listener;
  }

  private WeakReference<ReactApplicationContext> contextRef;

  private String executeEventListener;
  private String dismissEventListener;
  private String displayEventListener;

  public RnMessageDisplayListener(ReactApplicationContext context) {
    contextRef = new WeakReference<>(context);
  }

  public void listenDismissEvents(String listener) {
    dismissEventListener = listener;
  }

  public void listenDisplayEvents(String listener) {
    displayEventListener = listener;
  }

  public void listenExecuteEvents(String listener) {
    executeEventListener = listener;
  }

  @Override
  public void onActionExecuted(@NonNull String actionName, @NonNull ActionContext actionContext) {
    ReactApplicationContext context = contextRef.get();
    if (executeEventListener != null) {
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(executeEventListener, ActionContextMapper.toWriteableMap(actionContext)); // actionName can be obtained from context
    }

    if (clientListener != null) {
      clientListener.onActionExecuted(actionName, actionContext);
    }
  }

  @Override
  public void onMessageDismissed(@NonNull ActionContext actionContext) {
    ReactApplicationContext context = contextRef.get();
    if (dismissEventListener != null) {
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(dismissEventListener, ActionContextMapper.toWriteableMap(actionContext));
    }

    if (clientListener != null) {
      clientListener.onMessageDismissed(actionContext);
    }
  }

  @Override
  public void onMessageDisplayed(@NonNull ActionContext actionContext) {
    ReactApplicationContext context = contextRef.get();
    if (displayEventListener != null && context != null) {
      context
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
          .emit(displayEventListener, ActionContextMapper.toWriteableMap(actionContext));
    }

    if (clientListener != null) {
      clientListener.onMessageDisplayed(actionContext);
    }
  }
}
