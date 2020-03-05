import { LeanplumVariables } from './leanplum-types';

export class Message {
  messageId: string;
  title: string;
  subtitle: string;
  imageFilePath?: string;
  imageUrl?: string;
  data?: LeanplumVariables;
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
