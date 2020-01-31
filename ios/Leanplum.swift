//
//  Leanplum.swift
//  Leanplum
//
//  Created by Alik . Risco on 30.01.20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import Leanplum

@objc(RNLeanplum)
class RNLeanplum: NSObject {

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  @objc
  func setAppIdForDevelopmentMode(_ appId: String, accessKey: String) -> Void {
    Leanplum.setAppId(appId, withDevelopmentKey: accessKey)
  }
  
  @objc
  func setAppIdForProductionMode(_ appId: String, accessKey: String) -> Void {
    Leanplum.setAppId(appId, withProductionKey: accessKey)
  }
  
  @objc
  func setDeviceId(_ id: String) -> Void {
    Leanplum.setDeviceId(id)
  }
  
  @objc
  func setUserId(_ id: String) -> Void {
    Leanplum.setUserId(id)
  }
  
  @objc
  func setUserAttributes(_ attributes: NSDictionary) -> Void {
    let attributesDict = attributes as! Dictionary<String,Any>
    Leanplum.setUserAttributes(attributesDict)
  }
  
  @objc
  func start() -> Void {
    Leanplum.start()
  }

  @objc
  func track(_ event: String, params: NSDictionary) -> Void {
    let withParameters = params as! Dictionary<String,Any>
    Leanplum.track(event, withParameters: withParameters)
  }
  
  @objc
  func trackPurchase(_ purchaseEvent: String, value: Double, currencyCode: String, purchaseParams: NSDictionary) -> Void {
    let parameters = purchaseParams as! Dictionary<String,Any>
    Leanplum.trackPurchase(purchaseEvent, withValue: value, andCurrencyCode: currencyCode, andParameters: parameters)
  }
  
  @objc
  func disableLocationCollection() -> Void {
    Leanplum.disableLocationCollection()
  }
  
  @objc
  func setDeviceLocation(_ latitude: Double, longitude: Double, type: Int) -> Void {
    let accuracyType = LPLocationAccuracyType(rawValue: UInt32(type))
    Leanplum.setDeviceLocationWithLatitude(latitude, longitude: longitude, type: accuracyType)
  }
  
}
