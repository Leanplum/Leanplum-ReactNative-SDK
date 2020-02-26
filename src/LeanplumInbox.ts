import { NativeModules, NativeEventEmitter } from 'react-native';

export class Message {
  messageId: string;
  title: string;
  subtitle: string;
  imageFilePath: string;
  imageUrl: string;
  data: any;
  deliveryTimestamp: string;
  expirationTimestamp: string;
  isRead: boolean;
}

export class Inbox {
  count: number;
  unreadCount: number;
  messagesIds: string[];
  allMessages: Message[];
  unreadMessages: Message[];
}

class LeanplumInboxManager extends NativeEventEmitter {
  private readonly nativeModule: any;
  private static readonly ON_CHANGED_LISTENER: string = 'onChanged';
  private static readonly ON_FORCE_CONTENT_UPDATE_LISTENER: string =
    'onForceContentUpdate';

  constructor(nativeModule: any) {
    super(nativeModule);
    this.nativeModule = nativeModule;
  }

  async inbox(): Promise<Inbox> {
    return await this.nativeModule.getInbox();
  }

  async message(messageId: string): Promise<Message> {
    return await this.nativeModule.getMessage(messageId);
  }

  read(messageId: string): void {
    this.nativeModule.read(messageId);
  }
  remove(messageId: string): void {
    this.nativeModule.remove(messageId);
  }

  onChanged(callback: (leanplumMessage: Message) => void) {
    this.nativeModule.onChanged(LeanplumInboxManager.ON_CHANGED_LISTENER);
    this.addListener(LeanplumInboxManager.ON_CHANGED_LISTENER, callback);
  }

  onForceContentUpdate(callback: (leanplumMessage: Message) => void) {
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
