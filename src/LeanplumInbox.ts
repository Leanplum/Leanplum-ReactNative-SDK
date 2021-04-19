import { NativeModules, NativeEventEmitter } from 'react-native';
import { Inbox, Message } from './leanplum-inbox-types';
/**
 * Leanplum Inbox Manager
 */
class LeanplumInboxManager extends NativeEventEmitter {
  /** NativeModule of react-native. */
  private readonly nativeModule: any;
  /** Listener name used when inbox receive new messages from the server.*/
  private static readonly ON_CHANGED_LISTENER: string = 'onChanged';
  /** Listener name used when forceContentUpdate was called.*/
  private static readonly ON_FORCE_CONTENT_UPDATE_LISTENER: string =
    'onForceContentUpdate';
  /**
   * Creates an instance of LeanplumInboxManager.
   * @param nativeModule the NativeModule of react-native
   */
  constructor(nativeModule: any) {
    super(nativeModule);
    this.nativeModule = nativeModule;
  }
  /**
   * Returns an instance of Inbox object
   * @returns inbox.
   */
  async inbox(): Promise<Inbox> {
    return await this.nativeModule.getInbox();
  }
  /**
   * Returns the message identifier of the newsfeed message.
   * @param messageId.
   * @returns message.
   */
  async message(messageId: string): Promise<Message> {
    return await this.nativeModule.getMessage(messageId);
  }
  /**
   * Read the inbox message, marking it as read and invoking its open action.
   * @param messageId
   */
  read(messageId: string): void {
    this.nativeModule.read(messageId);
  }
  /**
   * Read the inbox message, marking it as read without invoking open action.
   * @param messageId
   */
  markAsRead(messageId: string): void {
    this.nativeModule.markAsRead(messageId);
  }
  /**
   * Remove the inbox message from the inbox.
   * @param messageId
   */
  remove(messageId: string): void {
    this.nativeModule.remove(messageId);
  }
  /**
   * Register a callback for when the inbox receives new values from the server.
   * @param callback to be invoked with a message as parameter
   */
  onChanged(callback: (leanplumMessage: Message) => void) {
    this.nativeModule.onChanged(LeanplumInboxManager.ON_CHANGED_LISTENER);
    this.addListener(LeanplumInboxManager.ON_CHANGED_LISTENER, callback);
  }
  /**
   * Register a callback for when the forceContentUpdate was called.
   * @param callback to be invoked with a message as parameter
   */
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
