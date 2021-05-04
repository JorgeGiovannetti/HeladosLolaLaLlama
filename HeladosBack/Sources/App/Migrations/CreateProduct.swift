//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 27/03/21.
//

import Fluent

struct CreateProduct: Migration {
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        database.schema("product")
            .id()
            .field("name", .string, .required)
            .field("description", .string)
            .field("available", .bool, .required)
            .unique(on: "name")
            .create()
    }
    
    func revert(on database: Database) -> EventLoopFuture<Void> {
        database.schema("product").delete()
    }
}
