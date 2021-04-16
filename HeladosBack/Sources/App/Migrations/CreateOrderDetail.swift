//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 29/03/21.
//

import Fluent

struct CreateOrderDetail: Migration {
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        database.schema("orderDetail")
            .id()
            .field("order", .uuid , .required, .references("order", "id", onDelete: .cascade))
            .field("product", .uuid , .required, .references("product", "id", onDelete: .cascade))
            .field("quantity", .uint8 , .required)
            .field("size", .string , .required)
            .create()
    }
    
    func revert(on database: Database) -> EventLoopFuture<Void> {
        database.schema("orderDetail").delete()
    }
    
}
