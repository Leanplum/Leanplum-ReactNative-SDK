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
    
    override func supportedEvents() -> [String] {
        return self.allSupportedEvents
    }
    
    @objc
    func setAppIdForDevelopmentMode(_ appId: String, accessKey: String) {
        Leanplum.setAppId(appId, withDevelopmentKey: accessKey)
    }
    
    
    @objc
    func setAppIdForProductionMode(_ appId: String, accessKey: String) {
        Leanplum.setAppId(appId, withProductionKey: accessKey)
    }

    @objc
    func setApiConnectionSettings(_ hostName: String, servletName: String, ssl: Bool) {
        Leanplum.setApiHostName(hostName, withServletName: servletName, usingSsl: ssl)
    }

    @objc
    func setSocketConnectionSettings(_ hostName: String, port: Int32) {
        Leanplum.setSocketHostName(hostName, withPortNumber: port)
    }
    
    @objc
    func setDeviceId(_ id: String) {
        Leanplum.setDeviceId(id)
    }
    
    @objc
    func setUserId(_ id: String) {
        Leanplum.setUserId(id)
    }
    
    @objc
    func setUserAttributes(_ attributes: NSDictionary) {
        guard let attributesDict = attributes as? Dictionary<String, Any> else {
            return
        }
        DispatchQueue.main.async {
            Leanplum.setUserAttributes(attributesDict)
        }
    }

    @objc
    func userId(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(Leanplum.userId())
    }

    @objc
    func deviceId(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(Leanplum.deviceId())
    }


    
    @objc
    func start() {
        Leanplum.start()
    }
    
    @objc
    func track(_ event: String, params: NSDictionary) {
        guard let parametersDict = params as? Dictionary<String, Any> else {
            return
        }
        Leanplum.track(event, withParameters: parametersDict)
    }
    
    @objc
    func trackPurchase(_ purchaseEvent: String, value: Double, currencyCode: String, purchaseParams: NSDictionary) {
        guard let parametersDict = purchaseParams as? Dictionary<String, Any> else {
            return
        }
        Leanplum.trackPurchase(purchaseEvent, withValue: value, andCurrencyCode: currencyCode, andParameters: parametersDict)
    }
    
    @objc
    func trackInAppPurchases() {
        Leanplum.trackInAppPurchases()
    }
    
    
    @objc
    func disableLocationCollection() {
        Leanplum.disableLocationCollection()
    }
    
    @objc
    func setDeviceLocation(_ latitude: Double, longitude: Double, type: UInt32) {
        let accuracyType = LPLocationAccuracyType(rawValue: type)
        Leanplum.setDeviceLocationWithLatitude(latitude, longitude: longitude, type: accuracyType)
    }
    
    @objc
    func forceContentUpdate() {
        Leanplum.forceContentUpdate();
    }
    
    
    @objc
    func setVariables(_ variables: NSDictionary) {
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
            lpVar.onValueChanged { [weak self] in
                self?.sendEvent(withName: variableName, body: lpVar.value)
            }
        }
    }
    
    @objc
    func onVariablesChanged(_ listener: String) {
        self.allSupportedEvents.append(listener)
        Leanplum.onVariablesChanged { [weak self] in
            self?.sendEvent(withName: listener, body: self?.getVariablesValues())
        }
    }
    
    @objc
    func setVariableAsset(_ name: String, filename: String) {
        self.allSupportedEvents.append(name)
        let lpVar = LPVar.define(name, withFile: filename)
        self.variables[name] = lpVar
        lpVar.onFileReady({ [weak self] in
            self?.sendEvent(withName: name, body: lpVar.fileValue())
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
        DispatchQueue.main.async {
            Leanplum.advance(to: state)
        }
    }
    
    @objc
    func advanceToWithInfo(_ state: String, info: String) {
        DispatchQueue.main.async {
            Leanplum.advance(to: state, withInfo: info)
        }
    }
    
    @objc
    func advanceToWithParams(_ state: String, params: NSDictionary) {
        guard let paramsDict = params as? Dictionary<String, Any> else {
            return
        }
        DispatchQueue.main.async {
            Leanplum.advance(to: state, withParameters: paramsDict)
        }
    }
    
    
    @objc
    func advanceToWithInfoAndParams(_ state: String, info: String, params: NSDictionary) {
        guard let paramsDict = params as? Dictionary<String, Any> else {
            return
        }
        DispatchQueue.main.async {
            Leanplum.advance(to: state, withInfo: info, andParameters: paramsDict)
        }
    }

    @objc
    func onVariablesChangedAndNoDownloadsPending(_ listener: String) {
        self.allSupportedEvents.append(listener)
        Leanplum.onVariablesChangedAndNoDownloadsPending { [weak self] in
            self?.sendEvent(withName: listener, body: nil)
        }
    }

    @objc
    func onceVariablesChangedAndNoDownloadsPending(_ listener: String) {
        self.allSupportedEvents.append(listener)
        Leanplum.onceVariablesChangedAndNoDownloadsPending { [weak self] in
            self?.sendEvent(withName: listener, body: nil)
        }
    }

    @objc
    func onMessageDisplayed(_ listener: String) {
        self.allSupportedEvents.append(listener)
         Leanplum.onMessageDisplayed { [weak self] (lPMessageArchiveData: LPMessageArchiveData?) in
                        self?.sendEvent(withName: listener, body: LeanplumTypeUtils.LPMessageArchiveDataToDict(lPMessageArchiveData!))
            
        }
    }
}
