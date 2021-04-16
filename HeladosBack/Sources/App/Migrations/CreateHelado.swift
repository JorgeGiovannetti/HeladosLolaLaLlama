//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 27/03/21.
//

import Fluent

struct CreateHelado: Migration {
    func prepare(on database: Database) -> EventLoopFuture<Void> {
        database.schema("helado")
            .id()
            .field("flavor", .string , .required)
            .foreignKey("id", references: "product", "id")
            .create()
    }
    
    func revert(on database: Database) -> EventLoopFuture<Void> {
        database.schema("helado").delete()
    }
    
}
