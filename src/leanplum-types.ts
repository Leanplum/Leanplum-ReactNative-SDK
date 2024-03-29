export type Primitive = string | boolean | number;
export type Variable =
  | string
  | boolean
  | number
  | Primitive[]
  | Parameters;

export interface Parameters {
  [name: string]: Primitive | Date;
}

export interface Variables {
  [name: string]: Variable;
}

export class SecuredVars {
  json: string;
  signature: string;
}

export class ActionContextData {
  id: string;
  messageBody: string;
  actionName: string;
}

export class MigrationConfig {
  state: string;
  accountId: string;
  accountToken: string;
  accountRegion: string;
  attributeMappings: {[key:string]: string};
  identityKeys: string[];
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
