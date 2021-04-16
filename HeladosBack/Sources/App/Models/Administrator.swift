//
//  File.swift
//
//
//  Created by Alejandro Hernández López on 27/03/21.
//

import Vapor
import Fluent


final class Administrator: Model, Content {
    
    static let schema : String = "administrator"
    
    @ID
    var id : UUID?
    
    @Field(key: "name")
    var name : String
    
    @Field(key: "email")
    var email : String
    
    @Field(key: "username")
    var username : String
    
    @Field(key: "password")
    var password: String
    
    init() {
        
    }
    
    init(id: UUID? = nil, name: String, email: String, username: String, password: String) {
        self.name = name
        self.email = email
        self.password = password
        self.username = username
    }
    
    final class Public: Codable {
        var id: UUID?
        var name: String
        var username: String
        var email: String

        
        init(id: UUID?, name: String, username:String, email: String) {
            self.id = id
            self.name = name
            self.username = username
            self.email = email
        }
    }
}


extension Administrator.Public: Content {}

extension Administrator {
    func convertToPublic() -> Administrator.Public {
        return Administrator.Public(id: id, name: name, username: username, email: email)
    }
}

extension EventLoopFuture where Value : Administrator {
    func convertToPublic() -> EventLoopFuture<Administrator.Public> {
        return self.map { admin in
            return admin.convertToPublic()
        }
    }
}

extension Collection where Element: Administrator {
  func convertToPublic() -> [Administrator.Public] {
    return self.map { $0.convertToPublic() }
  }
}

extension EventLoopFuture where Value == Array<Administrator> {
  func convertToPublic() -> EventLoopFuture<[Administrator.Public]> {
    return self.map { $0.convertToPublic() }
  }
}

extension Administrator: ModelAuthenticatable {
  
    static let usernameKey  = \Administrator.$username
    static let passwordHashKey = \Administrator.$password
    
    func verify(password: String) throws -> Bool {
       try Bcrypt.verify(password, created: self.password)
     }
}

extension Administrator: ModelSessionAuthenticatable {}
extension Administrator: ModelCredentialsAuthenticatable {}
