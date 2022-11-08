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
    
    var variables = [String: Var]()
    var allSupportedEvents: [String] = []
    
    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func supportedEvents() -> [String] {
        return self.allSupportedEvents
    }
    
    @objc
    func setAppVersion(_ appVersion: String) {
        Leanplum.setAppVersion(appVersion)
    }
    
    @objc
    func setAppIdForDevelopmentMode(_ appId: String, accessKey: String) {
        Leanplum.setAppId(appId, developmentKey: accessKey)
    }
    
    
    @objc
    func setAppIdForProductionMode(_ appId: String, accessKey: String) {
        Leanplum.setAppId(appId, productionKey: accessKey)
    }

    @objc
    func setApiConnectionSettings(_ hostName: String, apiPath: String, ssl: Bool) {
        Leanplum.setApiHostName(hostName, apiPath: apiPath, ssl: ssl)
    }

    @objc
    func setSocketConnectionSettings(_ hostName: String, port: Int32) {
        Leanplum.setSocketHostName(hostName, port: port)
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
    func hasStarted(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(Leanplum.hasStarted())
    }
    
    @objc
    func track(_ event: String, params: NSDictionary) {
        guard let parametersDict = params as? Dictionary<String, Any> else {
            return
        }
        Leanplum.track(event, params: parametersDict)
    }
    
    @objc
    func trackPurchase(_ purchaseEvent: String, value: Double, currencyCode: String, purchaseParams: NSDictionary) {
        guard let parametersDict = purchaseParams as? Dictionary<String, Any> else {
            return
        }
        Leanplum.track(event: purchaseEvent, value: value, currencyCode: currencyCode, params: parametersDict)
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
    func setDeviceLocation(_ latitude: Double, longitude: Double, type: UInt) {
        if let accuracyType = Leanplum.LocationAccuracyType(rawValue: type) {
            Leanplum.setDeviceLocation(latitude: latitude, longitude: longitude, type: accuracyType)
        }
    }
    
    @objc
    func forceContentUpdate() {
        Leanplum.forceContentUpdate()
    }
    
    
    @objc
    func setVariables(_ variables: NSDictionary) {
        guard let variablesDict = variables as? Dictionary<String, Any> else {
            return
        }
        for (key, value) in variablesDict {
            if let lpVar = LeanplumTypeUtils.createVar(key: key, value: value) {
                self.variables[key] = lpVar
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
        let lpVar = Var(name: name, file: filename)
        self.variables[name] = lpVar
        lpVar.onFileReady({ [weak self] in
            self?.sendEvent(withName: name, body: lpVar.fileValue())
        })
    }
    
    @objc
    func getVariableAsset(_ name: String,
                          resolver resolve: RCTPromiseResolveBlock,
                          rejecter reject: RCTPromiseRejectBlock) {
        if let lpVar = self.variables[name] {
            resolve(lpVar.fileValue())
        } else {
            resolve(nil)
        }
    }
    
    @objc
    func pauseState() {
        Leanplum.pauseState()
    }
    
    @objc
    func resumeState() {
        Leanplum.resumeState()
    }
    
    @objc
    func advanceTo(_ state: String) {
        DispatchQueue.main.async {
            Leanplum.advance(state: state)
        }
    }
    
    @objc
    func advanceToWithInfo(_ state: String, info: String) {
        DispatchQueue.main.async {
            Leanplum.advance(state: state, info: info)
        }
    }
    
    @objc
    func advanceToWithParams(_ state: String, params: NSDictionary) {
        guard let paramsDict = params as? Dictionary<String, Any> else {
            return
        }
        DispatchQueue.main.async {
            Leanplum.advance(state: state, params: paramsDict)
        }
    }
    
    
    @objc
    func advanceToWithInfoAndParams(_ state: String, info: String, params: NSDictionary) {
        guard let paramsDict = params as? Dictionary<String, Any> else {
            return
        }
        DispatchQueue.main.async {
            Leanplum.advance(state: state, info: info, params: paramsDict)
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
        ActionManager.shared.onMessageDisplayed { [weak self] actionContext in
            self?.sendEvent(withName: listener, body: actionContext.dictionary)
        }
    }

    @objc
    func onMessageDismissed(_ listener: String) {
        self.allSupportedEvents.append(listener)
        ActionManager.shared.onMessageDismissed { [weak self] actionContext in
            self?.sendEvent(withName: listener, body: actionContext.dictionary)
        }
    }

    @objc
    func onMessageAction(_ listener: String) {
        self.allSupportedEvents.append(listener)
        ActionManager.shared.onMessageAction { [weak self] actionName, context in
            self?.sendEvent(withName: listener, body: context.dictionary)
        }
    }

    @objc func registerForRemoteNotifications() {
        Leanplum.enablePushNotifications()
    }
    
    @objc func securedVars(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        guard let securedVars = Leanplum.securedVars() else {
            resolve(nil)
            return
        }

        var securedVarsDictionary: [String: Any] = [:]
        securedVarsDictionary["json"] = securedVars.varsJson()
        securedVarsDictionary["signature"] = securedVars.varsSignature()
        resolve(securedVarsDictionary)
    }

    @objc
    func isQueuePaused(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(ActionManager.shared.isPaused)
    }

    @objc
    func setQueuePaused(_ paused: Bool) {
        ActionManager.shared.isPaused = paused
    }

    @objc
    func isQueueEnabled(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(ActionManager.shared.isEnabled)
    }

    @objc
    func setQueueEnabled(_ enabled: Bool) {
        ActionManager.shared.isEnabled = enabled
    }
}

extension ActionContext {
    
    var messageBody: String? {
        let message = self.args?["Message"]
        if let message = message {
            if let messageBody = message as? String {
                return  messageBody
            }
            if let messageDict = message as? [AnyHashable: Any] {
                if let text = messageDict["Text"] as? String {
                    return text
                }
                if let textValue = messageDict["Text value"] as? String {
                    return textValue
                }
            }
        }
        return nil
    }
    
    public var dictionary: [String: Any] {
        return [
            "id": self.messageId,
            "actionName": self.action(),
            "messageBody": self.messageBody ?? ""
        ]
    }
}
