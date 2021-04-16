//
//  File.swift
//
//
//  Created by Alejandro Hernández López on 29/03/21.
//

import Vapor
import Fluent

final class TokenClient: Model, Content {

  static let schema = "tokensClient"

  @ID
  var id: UUID?

  @Field(key: "value")
  var value: String

  @Parent(key: "userID")
  var user: ClientUser

  init() {}

  init(id: UUID? = nil, value: String, userID: ClientUser.IDValue) {
    self.id = id
    self.value = value
    self.$user.id = userID
  }
}

extension TokenClient {
  static func generate(for user: ClientUser) throws -> TokenClient {
    let random = [UInt8].random(count: 16).base64
    return try TokenClient(value: random, userID: user.requireID())
  }
}

extension TokenClient: ModelTokenAuthenticatable {
    typealias User = App.ClientUser
    static let valueKey = \TokenClient.$value
    static let userKey = \TokenClient.$user
   
    var isValid: Bool {
        true
    }
}

