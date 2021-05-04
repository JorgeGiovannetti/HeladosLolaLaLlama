//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 27/03/21.
//

import Vapor

struct AdministratorController: RouteCollection{
    func boot(routes: RoutesBuilder) throws {
        let administratorsRoute = routes.grouped("api", "admin")
        administratorsRoute.post(use: createHandler)
        
        let basicAuthMiddleware = Administrator.authenticator()
        let basicAuthGroup = administratorsRoute.grouped(basicAuthMiddleware)
        basicAuthGroup.post("login", use: loginHandler)
        
        let tokenAuthMiddleware = Token.authenticator()
        let guardAuthMiddleware = Administrator.guardMiddleware()
        let tokenAuthGroup = administratorsRoute.grouped(tokenAuthMiddleware, guardAuthMiddleware)
        tokenAuthGroup.get(use: getAllHandler)
        tokenAuthGroup.get(":userID", use: getHandler)
        tokenAuthGroup.put(":userID", use: updateHandler)
    }
    
    func createHandler(_ req: Request) throws -> EventLoopFuture<Administrator.Public> {
        let admin = try req.content.decode(Administrator.self)
        admin.password = try Bcrypt.hash(admin.password)
        return admin.save(on: req.db).map{admin}.convertToPublic()
    }
    
    func getAllHandler(_ req: Request) throws -> EventLoopFuture<[Administrator.Public]> {
        Administrator.query(on: req.db).all().convertToPublic()
    }
    
    func getHandler(_ req: Request) throws -> EventLoopFuture<Administrator.Public> {
        Administrator.find(req.parameters.get("userID"), on: req.db)
            .unwrap(or: Abort(.notFound)).convertToPublic()
    }
    
    func updateHandler(_ req: Request) throws
    -> EventLoopFuture<Administrator.Public> {
        let data = try req.content.decode(UpdateAdminData.self)
      
        return Administrator.find(req.parameters.get("userID"), on: req.db).unwrap(or: Abort(.notFound))
        .flatMap { admin in
            admin.email = data.email
            admin.name = data.name
            return admin.save(on: req.db).map { admin.convertToPublic() }
        }
    }
    
    func loginHandler(_ req: Request) throws -> EventLoopFuture<Token> {
      let user = try req.auth.require(Administrator.self)
      let token = try Token.generate(for: user)
      return token.save(on: req.db).map { token }
    }
    
}

struct UpdateAdminData: Content {
    var id: UUID
    var email: String
    var name: String
}
