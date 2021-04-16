//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 29/03/21.
//

import Fluent

struct CreateClient: Migration {
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        database.schema("client")
            .id()
            .field("name", .string , .required)
            .field("email", .string , .required)
            .field("phone", .string , .required)
            .field("address", .string)
            .create()
    }
    
    func revert(on database: Database) -> EventLoopFuture<Void> {
        database.schema("client").delete()
    }
    
}

