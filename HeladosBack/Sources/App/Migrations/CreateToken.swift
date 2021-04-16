//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 27/03/21.
//

import Fluent

struct CreateToken: Migration {
  func prepare(on database: Database) -> EventLoopFuture<Void> {
    database.schema("tokens")
      .id()
      .field("value", .string, .required)
      .field("userID", .uuid, .required, .references("administrator", "id", onDelete: .cascade))
      .create()
  }

  func revert(on database: Database) -> EventLoopFuture<Void> {
    database.schema("tokens").delete()
  }
}
