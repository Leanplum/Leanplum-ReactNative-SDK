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
    static func createVar(key: String, value: Any) -> Var? {
        var lpVar: Var
        switch value.self {
        case is NSNumber:
            let tmp = value as? NSNumber ?? 0
            if isBoolNumber(num: tmp) {
                lpVar = Var(name: key, boolean: value as? Bool ?? false)
            } else {
                lpVar = Var(name: key, double: value as? Double ?? 0.0)
            }
        case is Bool:
            lpVar = Var(name: key, boolean: value as? Bool ?? false)
        case is Int, is Double, is Float:
            lpVar = Var(name: key, double: value as? Double ?? 0.0)
        case is String:
            lpVar = Var(name: key, string: value as? String)
        case is Array<Any>:
            lpVar = Var(name: key, array: value as? Array)
        case is Dictionary<String, Any>:
            lpVar = Var(name: key, dictionary: value as? Dictionary)
        default:
            return nil
        }
        return lpVar
    }
    
    static func leanplumMessagesToArray(_ messages: [LeanplumInbox.Message]) -> [Dictionary<String, Any>] {
        var array: [Dictionary<String, Any>] = []
        for message in messages {
            array.append(leanplumMessageToDict(message))
        }
        return array
    }
    
    
    static func leanplumMessageToDict(_ leanplumMessage: LeanplumInbox.Message) -> Dictionary<String, Any> {
        var messageDict = [String: Any]()
        messageDict["messageId"] = leanplumMessage.messageId
        messageDict["title"] = leanplumMessage.title
        messageDict["subtitle"] = leanplumMessage.subtitle
        messageDict["imageFilePath"] = leanplumMessage.imageFilePath
        messageDict["imageUrl"] = leanplumMessage.imageURL?.absoluteString
        messageDict["deliveryTimestamp"] = stringFromDate(leanplumMessage.deliveryTimestamp ?? Date())
        if let expirationTimestamp = leanplumMessage.expirationTimestamp {
            messageDict["expirationTimestamp"] = stringFromDate(expirationTimestamp)
        }
        messageDict["isRead"] = leanplumMessage.isRead
        messageDict["data"] = leanplumMessage.data
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
        messageDataDict["messageID"] = lPMessageArchiveData.messageID
        messageDataDict["messageBody"] = lPMessageArchiveData.messageBody
        messageDataDict["recipientUserID"] = lPMessageArchiveData.recipientUserID
        messageDataDict["deliveryDateTime"] = stringFromDate(lPMessageArchiveData.deliveryDateTime)
        return messageDataDict
       }

    private static func isBoolNumber(num: NSNumber) -> Bool {
        let boolID = CFBooleanGetTypeID()
        let numID = CFGetTypeID(num)
        return numID == boolID
    }
}
