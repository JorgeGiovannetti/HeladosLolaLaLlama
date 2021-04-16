//
//  File.swift
//
//
//  Created by Alejandro Hernández López on 28/03/21.
//

import Fluent
import Vapor

final class Category: Model, Content {
    static let schema: String = "category"
    
    @ID
    var id: UUID?
    
    @Field(key: "name")
    var name : String
    
    @Field(key: "description")
    var description : String
    
    @Siblings(through: HeladoCategoryPivot.self, from: \.$category, to: \.$helado)
    var helados: [Helado]
    
    init(){}
    
    init(id: UUID? = nil, name: String, description: String) {
        self.id = id
        self.name = name
        self.description = description
    }
}
