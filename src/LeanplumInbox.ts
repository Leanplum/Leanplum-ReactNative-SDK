import { NativeModules, NativeEventEmitter } from "react-native";

class LeanplumMessage {
  messageId: string;
  title: string;
  subtitle: string;
  imageFilePath: string;
  imageUrl: string;
  data: any;
  deliveryTimestamp: Date;
  expirationTimestamp: Date;
  isRead: boolean;
}

class LeanplumInboxValue {
  count: number;
  unreadCount: number;
  messagesIds: string[];
  allMessages: LeanplumMessage[];
  unreadMessages: LeanplumMessage[];
}

class LeanplumInboxManager extends NativeEventEmitter {
  private readonly nativeModule: any;
  private static readonly ON_CHANGED_LISTENER: string = "onChanged";
  private static readonly ON_FORCE_CONTENT_UPDATE_LISTENER: string =
    "onForceContentUpdate";

  constructor(nativeModule: any) {
    super(nativeModule);
    this.nativeModule = nativeModule;
  }

  async inbox(): Promise<LeanplumInboxValue> {
    return await this.nativeModule.getInbox();
  }

  async messageForId(messageId: string): Promise<LeanplumMessage> {
    return await this.nativeModule.getMessage(messageId);
  }

  read(messageId: string): void {
    this.nativeModule.read(messageId);
  }
  remove(messageId: string): void {
    this.nativeModule.remove(messageId);
  }

  onChanged(callback: (leanplumMessage: LeanplumMessage) => void) {
    this.nativeModule.onChanged(LeanplumInboxManager.ON_CHANGED_LISTENER);
    this.addListener(LeanplumInboxManager.ON_CHANGED_LISTENER, callback);
  }

  onForceContentUpdate(callback: (leanplumMessage: LeanplumMessage) => void) {
    this.nativeModule.onForceContentUpdate(
      LeanplumInboxManager.ON_FORCE_CONTENT_UPDATE_LISTENER
    );
    this.addListener(
      LeanplumInboxManager.ON_FORCE_CONTENT_UPDATE_LISTENER,
      callback
    );
  }
}

export const LeanplumInbox = new LeanplumInboxManager(
  NativeModules.LeanplumInbox
);
