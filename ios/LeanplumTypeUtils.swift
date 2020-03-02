//
//  LeanplumTypeUtils.swift
//  Leanplum
//
//  Created by Alik . Risco on 13.02.20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import Leanplum

class LeanplumTypeUtils {
    static func createVar(key: String, value: Any) -> LPVar? {
        var lpVar: LPVar;
        switch value.self {
        case is Int, is Double, is Float:
            lpVar = LPVar.define(key, with: value as? Double ?? 0.0)
        case is Bool:
            lpVar = LPVar.define(key, with: value as? Bool ?? false)
        case is String:
            lpVar = LPVar.define(key, with: value as? String)
        case is Array<Any>:
            lpVar = LPVar.define(key, with: value as? Array)
        case is Dictionary<String, Any>:
            lpVar = LPVar.define(key, with: value as? Dictionary)
        default:
            return nil
        }
        return lpVar;
    }
    
    static func leanplumMessagesToArray(_ messages: [LPInboxMessage]) -> [Dictionary<String, Any>] {
        var array: [Dictionary<String, Any>] = []
        for message in messages {
            array.append(leanplumMessageToDict(message))
        }
        return array
    }
    
    
    static func leanplumMessageToDict(_ leanplumMessage: LPInboxMessage) -> Dictionary<String, Any> {
        var messageDict = [String: Any]()
        messageDict["messageId"] = leanplumMessage.messageId
        messageDict["title"] = leanplumMessage.title()
        messageDict["subtitle"] = leanplumMessage.subtitle()
        messageDict["imageFilePath"] = leanplumMessage.imageFilePath()
        messageDict["imageUrl"] = leanplumMessage.imageURL()?.absoluteString
        messageDict["deliveryTimestamp"] = stringFromDate(leanplumMessage.deliveryTimestamp)
        if let expirationTimestamp = leanplumMessage.expirationTimestamp {
            messageDict["expirationTimestamp"] = stringFromDate(expirationTimestamp)
        }
        messageDict["isRead"] = leanplumMessage.isRead
        messageDict["data"] = leanplumMessage.data()
        return messageDict
    }
    
    static func stringFromDate(_ date: Date) -> String {
        let dateFormatter = DateFormatter()
        let enUSPosixLocale = Locale(identifier: "en_US_POSIX")
        dateFormatter.locale = enUSPosixLocale
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ssZZZZZ"
        dateFormatter.calendar = Calendar(identifier: .gregorian)
        return dateFormatter.string(from: date)
    }

    static func LPMessageArchiveDataToDict(_ lPMessageArchiveData: LPMessageArchiveData) -> [String: Any] {
        var messageDataDict = [String: Any]()
        messageDataDict["messageID"] = lPMessageArchiveData.messageID;
        messageDataDict["messageBody"] = lPMessageArchiveData.messageBody;
        messageDataDict["recipientUserID"] = lPMessageArchiveData.recipientUserID;
        messageDataDict["deliveryDateTime"] = stringFromDate(lPMessageArchiveData.deliveryDateTime)
        return messageDataDict;
       }

}
