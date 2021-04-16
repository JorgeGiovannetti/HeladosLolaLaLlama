//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 29/03/21.
//

import Fluent

struct CreateOrder: Migration {
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        database.schema("order")
            .id()
            .field("paid", .bool , .required)
            .field("dateOfOrder", .datetime , .required)
            .field("shippingAddress", .string )
            .field("specification", .string)
            .field("total", .float)
            .field("client", .uuid, .required, .references("client", "id", onDelete: .cascade))
            .create()
    }
    
    func revert(on database: Database) -> EventLoopFuture<Void> {
        database.schema("order").delete()
    }
    
}

