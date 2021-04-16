//
//  File.swift
//
//
//  Created by Alejandro Hernández López on 29/03/21.
//

import Vapor
import Fluent

final class Order: Model {
    static let schema: String = "order"
    
    @ID
    var id: UUID?

    @Field(key: "paid")
    var paid: Bool
    
    @Field(key: "dateOfOrder")
    var dateOfOrder: Date
    
    @OptionalField(key: "shippingAddress")
    var shippingAddress: String?
    
    @Field(key: "specification")
    var specification: String
    
    @Field(key: "total")
    var total: Float
    
    @Children(for: \.$order)
    var orderDetails: [OrderDetail]
    

    @Parent(key: "client")
    var client: Client

    init() {
        
    }
    
    init(id: UUID? = nil, dateOfOder: Date, specification: String, client: Client.IDValue, shippingAddress : String? = nil) {
        self.id = id
        self.paid = false
        self.dateOfOrder = dateOfOder
        self.specification = specification
        self.total = 0.0
        self.$client.id = client
        self.shippingAddress = shippingAddress
    }
    
}

extension Order: Content {}
