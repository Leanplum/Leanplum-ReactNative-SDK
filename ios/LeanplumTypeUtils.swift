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
}
