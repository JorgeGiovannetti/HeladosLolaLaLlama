//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 18/04/21.
//

import Fluent

struct CreatePrecioProducto: Migration {
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        database.schema("priceProduct")
            .id()
            .field("price", .float , .required)
            .field("size", .string)
            .field("product", .uuid, .required, .references("product", "id", onDelete: .cascade))
            .create()
    }
    
    func revert(on database: Database) -> EventLoopFuture<Void> {
        database.schema("priceProduct").delete()
    }
    
}
