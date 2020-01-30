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
    GPS = 2,
}
  

declare class Leanplum {
    setAppIdForDevelopmentMode(appId: string, accessKey: string): void;
    setAppIdForProductionMode(appId: string, accessKey: string): void;
    setDeviceId(id: string): void;
    setUserId(id: string): void;
    setUserAttributes(attributes: any): void;
    start(): void;
    track(event: string, params: any): void;
    trackPurchase(value: number, currencyCode: string, purchaseParams: any, purchaseEvent: string): void;
    disableLocationCollection() : void;
    setDeviceLocation(latitude: number, longitude: number, type: LocationAccuracyType): void;
}
declare const leanplum: Leanplum;
export default leanplum;