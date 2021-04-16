//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 29/03/21.
//

import Fluent

struct CreateTokenClient: Migration {
  func prepare(on database: Database) -> EventLoopFuture<Void> {
    database.schema("tokensClient")
      .id()
      .field("value", .string, .required)
      .field("userID", .uuid, .required, .references("clientUser", "id", onDelete: .cascade))
      .create()
  }

  func revert(on database: Database) -> EventLoopFuture<Void> {
    database.schema("tokensClient").delete()
  }
}
