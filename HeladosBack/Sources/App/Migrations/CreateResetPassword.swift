//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 28/05/21.
//

import Foundation
import Fluent

struct CreateResetPasswordToken: Migration {
  func prepare(on database: Database) -> EventLoopFuture<Void> {
    database.schema("resetPassword")
      .id()
      .field("token", .string, .required)
      .field("userID", .uuid, .required, .references("administrator", "id", onDelete: .cascade))
      .create()
  }

  func revert(on database: Database) -> EventLoopFuture<Void> {
    database.schema("resetPassword").delete()
  }
}

