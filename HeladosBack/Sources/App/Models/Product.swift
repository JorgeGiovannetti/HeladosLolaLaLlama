//
//  File.swift
//
//
//  Created by Alejandro Hernández López on 27/03/21.
//

import Vapor
import Fluent

final class Product: Model {
    static let schema: String = "product"
    
    @ID
    var id: UUID?

    @Field(key: "name")
    var name: String
    
    @Field(key: "price")
    var price: Float
    
    @OptionalField(key: "description")
    var description: String?
    
    @Field(key: "available")
    var available: Bool
    
    @OptionalChild(for: \.$product)
    var helado: Helado?
    
    @Children(for: \.$product)
    var fotos: [FotoProducto]
    
    @Children(for: \.$product)
    var orderDetails: [OrderDetail]
    
    init() {
        
    }
    
    init(id: UUID? = nil, name: String, price: Float, description: String) {
        self.id = id
        self.name = name
        self.price = price
        self.description = description
        self.available = true
    }
    
}

extension Product: Content {}
