export type Primitive = string | boolean | number;
export type Variable =
  | string
  | boolean
  | number
  | Primitive[]
  | Parameters;

export interface Parameters {
  [name: string]: Primitive;
}

export interface Variables {
  [name: string]: Variable;
}

export class SecuredVars {
  json: string;
  signature: string;
}

export class MessageArchiveData { // TODO remove unused
  messageID: string;
  messageBody: string;
  recipientUserID: string;
  deliveryDateTime: string;
}

export class ActionContext extends MessageArchiveData {

}

export enum LocationAccuracyType {
  /**
   * Lowest accuracy. Reserved for internal use.
   */
  IP = 0,

  /**
   * Default accuracy.
   */
  CELL = 1,

  /**
   * Highest accuracy.
   */
  GPS = 2
}
