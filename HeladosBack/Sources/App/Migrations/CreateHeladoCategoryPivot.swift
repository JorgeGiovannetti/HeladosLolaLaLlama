//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 28/03/21.
//

import Fluent

struct CreateHeladoCategoryPivot: Migration {
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        database.schema("heladoCategory")
            .id()
            .field("heladoID", .uuid, .required, .references("helado", "id", onDelete: .cascade))
            .field("categoryID", .uuid, .required, .references("category", "id", onDelete: .cascade))
            .create()
    }
    
    func revert(on database: Database) -> EventLoopFuture<Void> {
        database.schema("heladoCategory").delete()
    }
}
