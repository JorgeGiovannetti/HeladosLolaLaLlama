//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 18/04/21.
//

import Vapor
import Fluent

final class PrecioProducto: Model, Content {
    static let schema: String = "priceProduct"
    
    @ID
    var id: UUID?

    @Field(key: "price")
    var price: Float
    
    @OptionalField(key: "size")
    var size: String?
    
    @Parent(key: "product")
    var product: Product
    
    init() {
        
    }
    
    init(id: UUID? = nil, size: String? = nil, price: Float, product: Product.IDValue) {
        self.id = id
        self.size = size
        self.price = price
        self.$product.id = product
    }
    
}

