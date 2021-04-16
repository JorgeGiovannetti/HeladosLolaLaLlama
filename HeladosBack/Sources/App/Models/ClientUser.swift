//
//  File.swift
//
//
//  Created by Alejandro Hernández López on 29/03/21.
//

import Vapor
import Fluent

final class ClientUser: Model, Content {
    
    static let schema : String = "clientUser"
    
    @ID
    var id : UUID?
    
    @Field(key: "username")
    var username : String
  
    @Field(key: "password")
    var password: String
    
    @Parent(key: "id")
    var client: Client
    
    init() {
        
    }
    
    init(id: UUID, username: String, password: String) {
        self.id = id
        self.password = password
        self.username = username
        self.$client.id = id
    }
    
    final class Public: Codable {
        var id: UUID?
        var username: String
 
        
        init(id: UUID?, username:String) {
            self.id = id
            self.username = username
        }
    }
}


extension ClientUser.Public: Content {}

extension ClientUser {
    func convertToPublic() -> ClientUser.Public {
        return ClientUser.Public(id: id, username: username)
    }
}

extension EventLoopFuture where Value : ClientUser {
    func convertToPublic() -> EventLoopFuture<ClientUser.Public> {
        return self.map { client in
            return client.convertToPublic()
        }
    }
}

extension Collection where Element: ClientUser {
  func convertToPublic() -> [ClientUser.Public] {
    return self.map { $0.convertToPublic() }
  }
}

extension EventLoopFuture where Value == Array<ClientUser> {
  func convertToPublic() -> EventLoopFuture<[ClientUser.Public]> {
    return self.map { $0.convertToPublic() }
  }
}

extension ClientUser: ModelAuthenticatable {
  
    static let usernameKey  = \ClientUser.$username
    static let passwordHashKey = \ClientUser.$password
    
    func verify(password: String) throws -> Bool {
       try Bcrypt.verify(password, created: self.password)
     }
}

extension ClientUser: ModelSessionAuthenticatable {}
extension ClientUser: ModelCredentialsAuthenticatable {}
