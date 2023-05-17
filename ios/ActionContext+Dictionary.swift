//
//  ActionContext+Dictionary.swift
//  Leanplum
//
//  Created by Nikola Zagorchev on 9.11.22.
//  Copyright © 2023 Leanplum. All rights reserved.
//

import Foundation
import Leanplum

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
