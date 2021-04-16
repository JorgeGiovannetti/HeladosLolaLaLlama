//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 29/03/21.
//

import Foundation
import Fluent

struct CreateClientUser: Migration {
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        database.schema("clientUser")
            .id()
            .field("username", .string)
            .field("password", .string)
            .unique(on: "username")
            .foreignKey("id", references: "client", "id")
            .create()
    }
    
    func revert(on database: Database) -> EventLoopFuture<Void> {
        database.schema("clientUser").delete()
    }
    
}
