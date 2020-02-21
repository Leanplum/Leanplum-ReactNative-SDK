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
class RNLeanplum: RCTEventEmitter {
    
    var variables = [String: LPVar]()
    var allSupportedEvents: [String] = []
    
    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func supportedEvents() -> [String]! {
        return self.allSupportedEvents
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
    
    @objc
    func forceContentUpdate() -> Void {
        Leanplum.forceContentUpdate();
    }
    
    
    @objc
    func setVariables(_ variables: NSDictionary) -> Void {
        guard let variablesDict = variables as? Dictionary<String, Any> else {
            return
        }
        for (key, value) in variablesDict {
            if let lpVar = LeanplumTypeUtils.createVar(key: key, value: value) {
                self.variables[key] = lpVar;
            }
        }
    }
    
    @objc
    func getVariable(_ variableName: String, resolver resolve: RCTPromiseResolveBlock,
                     rejecter reject: RCTPromiseRejectBlock
    ) {
        if let lpVar = self.variables[variableName] {
            resolve(lpVar.value)
        } else {
            resolve(nil)
        }
    }
    
    @objc
    func getVariables(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(self.getVariablesValues())
    }
    
    
    func getVariablesValues() -> [String: Any] {
        var allVariables = [String: Any]()
        for (key, value) in self.variables {
            if(value.kind == "file") {
                continue
            }
            allVariables[key] = value.value
        }
        return allVariables
    }
    
    @objc
    func onStartResponse(_ callback: @escaping RCTResponseSenderBlock) {
        Leanplum.onStartResponse { (success:Bool) in
            callback([success])
        }
    }
    
    @objc
    func onValueChanged(_ variableName: String) {
        if let lpVar = self.variables[variableName] {
            self.allSupportedEvents.append(variableName)
            lpVar.onValueChanged {
                self.sendEvent(withName: variableName, body: lpVar.value)
            }
        }
    }
    
    @objc
    func onVariablesChanged(_ listener: String) {
        self.allSupportedEvents.append(listener)
        Leanplum.onVariablesChanged {
            self.sendEvent(withName: listener, body: self.getVariablesValues())
        }
    }
    
    @objc
    func setVariableAsset(_ name: String, filename: String) -> Void {
        self.allSupportedEvents.append(name)
        let lpVar = LPVar.define(name, withFile: filename)
        self.variables[name] = lpVar
        lpVar?.onFileReady({
            self.sendEvent(withName: name, body: lpVar?.fileValue())
        })
    }
    
    @objc
    func getVariableAsset(_ name: String, resolver resolve: RCTPromiseResolveBlock,
                          rejecter reject: RCTPromiseRejectBlock
    ) {
        if let lpVar = self.variables[name] {
            resolve(lpVar.fileValue())
        } else {
            resolve(nil)
        }
    }

    @objc
    func pauseState() {
        Leanplum.pauseState();
    }

    @objc
    func resumeState() {
        Leanplum.resumeState();
    }

    @objc
    func trackAllAppScreens() {
        Leanplum.trackAllAppScreens();
    }
    
    @objc
    func advanceTo(_ state: String) {
        Leanplum.advance(to: state)
    }
    
    @objc
    func advanceToWithInfo(_ state: String, info: String) {
        Leanplum.advance(to: state, withInfo: info)
    }
    
    @objc
    func advanceToWithParams(_ state: String, params: NSDictionary) {
        guard let paramsDict = params as? Dictionary<String, Any> else {
            return
        }
        Leanplum.advance(to: state, withParameters: paramsDict)
    }
    
    
    @objc
    func advanceToWithInfoAndParams(_ state: String, info: String, params: NSDictionary) {
        guard let paramsDict = params as? Dictionary<String, Any> else {
            return
        }
        Leanplum.advance(to: state, withInfo: info, andParameters: paramsDict)
    }
}
