//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 16/04/21.
//


import Vapor
import Fluent

final class OrderDetail: Model {
    static let schema: String = "orderDetail"
    
    @ID
    var id: UUID?

    @Parent(key: "product")
    var product: Product
    
    @Parent(key: "order")
    var order: Order
    
    @Field(key: "quantity")
    var quantity: UInt8

    @Field(key: "size")
    var size: String
    
    init() {
        
    }
    
    init(id: UUID? = nil, product: Product.IDValue, order: Order.IDValue, quantity: UInt8, idBox: UUID? = nil) {
        self.id = id
        self.$product.id = product
        self.$order.id = order
        self.quantity = quantity
    }
    
}

extension OrderDetail: Content {}
