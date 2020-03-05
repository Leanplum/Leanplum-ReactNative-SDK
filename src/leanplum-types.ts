export type Primitive = string | boolean | number;
export type LeanplumVariable =
  | string
  | boolean
  | number
  | Primitive[]
  | LeanplumParams;

export interface LeanplumParams {
  [name: string]: Primitive;
}

export interface LeanplumVariables {
  [name: string]: LeanplumVariable;
}

export class MessageArchiveData {
  messageID: string;
  messageBody: string;
  recipientUserID: string;
  deliveryDateTime: string;
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
