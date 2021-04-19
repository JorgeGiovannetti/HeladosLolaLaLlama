//
//  File.swift
//
//
//  Created by Alejandro Hernández López on 27/03/21.
//

import Vapor
import Fluent

final class Helado: Model, Content {
    static let schema: String = "helado"
    
    @ID
    var id: UUID?

    @Field(key: "flavor")
    var flavor: String
    
    @Parent(key: "id")
    var product: Product
   
    @Siblings(through: HeladoCategoryPivot.self, from: \.$helado, to: \.$category)
    var categories: [Category]
    
    init() {
        
    }
    
    init(id: UUID? = nil, flavor: String) {
        self.id = id
        self.flavor = flavor
        self.$product.id = id!
    }
    
}

