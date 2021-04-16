//
//  File.swift
//
//
//  Created by Alejandro Hernández López on 29/03/21.
//
import Vapor
import Fluent


final class Client: Model, Content {
    
    static let schema : String = "client"
    
    @ID
    var id : UUID?
    
    @Field(key: "name")
    var name : String
    
    @Field(key: "email")
    var email : String
    
    @Field(key: "phone")
    var phone: String
    
    @OptionalField(key: "address")
    var address: String?

    @OptionalChild(for: \.$client)
    var user: ClientUser?
    
    @Children(for: \.$client)
    var orders: [Order]
    
    init() {
        
    }
    
    init(id: UUID? = nil, name: String, email: String, phone: String, address: String) {
        self.name = name
        self.email = email
        self.phone = phone
        self.address = address
    }
    
}
