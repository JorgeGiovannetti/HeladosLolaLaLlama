//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 28/05/21.
//

import Foundation
import Vapor
import Fluent

final class ResetPasswordToken: Model, Content {

  static let schema = "resetPassword"

  @ID
  var id: UUID?

  @Field(key: "token")
  var token: String

  @Parent(key: "userID")
  var user: Administrator

  init() {}

  init(id: UUID? = nil, token: String, userID: Administrator.IDValue) {
    self.id = id
    self.token = token
    self.$user.id = userID
  }
}

