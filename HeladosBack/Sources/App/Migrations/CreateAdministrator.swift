//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 27/03/21.
//

import Fluent

struct CreateAdministrator: Migration {
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        database.schema("administrator")
            .id()
            .field("name", .string, .required)
            .field("username", .string, .required)
            .field("email", .string, .required)
            .field("password", .string, .required)
            .unique(on: "username")
            .create()
    }
    
    func revert(on database: Database) -> EventLoopFuture<Void> {
        database.schema("administrator").delete()
    }
}
