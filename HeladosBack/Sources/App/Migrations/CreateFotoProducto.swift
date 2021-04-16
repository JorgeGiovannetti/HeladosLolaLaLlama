//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 27/03/21.
//

import Fluent

struct CreateFotoProducto: Migration {
    func revert(on database: Database) -> EventLoopFuture<Void> {
        database.schema("fotoProducto").delete()
    }
    
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        database.schema("fotoProducto")
            .id()
            .field("foto",.string,.required)
            .field("product", .uuid, .required, .references("product", "id", onDelete: .cascade))
            .create()
    }
}
