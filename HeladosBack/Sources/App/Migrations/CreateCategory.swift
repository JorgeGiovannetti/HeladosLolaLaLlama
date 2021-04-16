//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 28/03/21.
//

import Fluent

struct CreateCategory: Migration {
    func revert(on database: Database) -> EventLoopFuture<Void> {
        database.schema("category").delete()
    }
    
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        database.schema("category")
            .id()
            .field("name", .string, .required)
            .field("description", .string, .required)
            .create()
    }
}
