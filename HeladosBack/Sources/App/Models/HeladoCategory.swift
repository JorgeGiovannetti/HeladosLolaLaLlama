//
//  File.swift
//
//
//  Created by Alejandro Hernández López on 28/03/21.
//

import Fluent
import Foundation

final class HeladoCategoryPivot: Model {
    static let schema: String = "heladoCategory"
    
    @ID
    var id: UUID?
    
    @Parent(key: "heladoID")
    var helado: Helado
    
    @Parent(key: "categoryID")
    var category: Category
    
    init() {
    }
    
    init(id: UUID? = nil, helado: Helado, category: Category) throws {
        self.id = id
        self.$helado.id = try helado.requireID()
        self.$category.id = try category.requireID()
    }
}
