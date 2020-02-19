import { NativeModules } from 'react-native';

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

class LeanplumInboxManager {
  private readonly nativeModule: any;

  constructor(nativeModule: any) {
    this.nativeModule = nativeModule;
  }

  async inbox(): Promise<LeanplumInboxValue> {
    return await this.nativeModule.getInbox();
  }

  async messageForId(messageId: string): Promise<LeanplumMessage> {
    return await this.nativeModule.messageForId(messageId);
  }

  read(messageId: string): void {
    this.nativeModule.read(messageId);
  }
  remove(messageId: string): void {
    this.nativeModule.remove(messageId);
  }
}

export const LeanplumInbox = new LeanplumInboxManager(NativeModules.Leanplum);
