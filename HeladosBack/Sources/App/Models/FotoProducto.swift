//
//  File.swift
//
//
//  Created by Alejandro Hernández López on 28/03/21.
//

import Vapor
import Fluent

final class FotoProducto: Model {
    static let schema: String = "fotoProducto"
    
    @ID
    var id: UUID?

    @Field(key: "foto")
    var foto: String
    
    @Parent(key: "product")
    var product: Product
    
    init() {
        
    }
    
    init(id: UUID? = nil, foto: String, product: Product.IDValue) {
        self.id = id
        self.foto = foto
        self.$product.id = product
    }
    
}

extension FotoProducto: Content {}

