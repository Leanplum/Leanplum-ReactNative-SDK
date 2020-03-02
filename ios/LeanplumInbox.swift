//
//  LeanplumInbox.swift
//  Leanplum
//
//  Created by Alik . Risco on 21.02.20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import Leanplum

@objc(RNLeanplumInbox)
class RNLeanplumInbox: RCTEventEmitter {
    
    var allSupportedEvents: [String] = []
    
    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    override func supportedEvents() -> [String] {
        return self.allSupportedEvents
    }
    
    @objc
    func getInbox(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) {
        resolve(self.getInboxValue())
    }
    
    func getInboxValue() -> [String: Any] {
        var inbox = [String: Any]()
        let leanplumInbox = Leanplum.inbox()
        inbox["count"] = leanplumInbox?.count()
        inbox["unreadCount"] = leanplumInbox?.unreadCount
        inbox["messagesIds"] = leanplumInbox?.messagesIds()
        inbox["allMessages"] = LeanplumTypeUtils.leanplumMessagesToArray(leanplumInbox?.allMessages() as! [LPInboxMessage])
        inbox["unreadMessages"] = LeanplumTypeUtils.leanplumMessagesToArray(leanplumInbox?.unreadMessages() as! [LPInboxMessage])
        return inbox
    }
    
    @objc
    func getMessage(_ messageId: String, resolver resolve: RCTPromiseResolveBlock,
                      rejecter reject: RCTPromiseRejectBlock
    ) {
        if let message = Leanplum.inbox()?.message(forId: messageId) {
            resolve(LeanplumTypeUtils.leanplumMessageToDict(message))
        } else {
            resolve(nil)
        }
    }
    
    @objc
    func read(_ messageId: String) {
        let message = Leanplum.inbox()?.message(forId: messageId)
        message?.read()
    }
    
    
    @objc
    func remove(_ messageId: String) {
        let message = Leanplum.inbox()?.message(forId: messageId)
        message?.remove()
    }
    
    @objc
    func onChanged(_ listener: String) {
        self.allSupportedEvents.append(listener)
        Leanplum.inbox()?.onChanged({ [weak self] in
            self?.sendEvent(withName: listener, body: self?.getInboxValue())
        })
    }

    @objc
    func onForceContentUpdate(_ listener: String) {
        self.allSupportedEvents.append(listener)
        Leanplum.inbox()?.onForceContentUpdate({ (Bool) in
            self.sendEvent(withName: listener, body: self.getInboxValue())
        })
    }
}
