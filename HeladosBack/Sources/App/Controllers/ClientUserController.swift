//
//  File.swift
//
//
//  Created by Alejandro Hernández López on 29/03/21.
//

import Vapor
import Fluent

struct ClientUserController: RouteCollection{
    func boot(routes: RoutesBuilder) throws {
        let clientRoute = routes.grouped("api", "user")
        clientRoute.post(use: createHandler)
        
        let basicAuthMiddleware = ClientUser.authenticator()
        let basicAuthGroup = clientRoute.grouped(basicAuthMiddleware)
        basicAuthGroup.post("login", use: loginHandler)
        
        let tokenAuthMiddleware = Token.authenticator()
        let guardAuthMiddleware = ClientUser.guardMiddleware()
        let tokenAuthGroup = clientRoute.grouped(tokenAuthMiddleware, guardAuthMiddleware)
        tokenAuthGroup.get(use: getAllHandler)
        tokenAuthGroup.get(":userID", use: getHandler)
        tokenAuthGroup.get(":userID", "orders", use: getOrdersHandler)
        tokenAuthGroup.get(":userID", "ordersLastMonth", use: getOrdersLastMonthHandler)
        tokenAuthGroup.get(":userID", "ordersNotPaidLastMonth", use: getNotPaidOrdersLastMonthHandler)
        tokenAuthGroup.get(":userID", "ordersPaidLastMonth", use: getPaidOrdersLastMonthHandler)
        tokenAuthGroup.put(":userID", use: updateHandler)
    }
    
    func createHandler(_ req: Request) throws -> EventLoopFuture<ClientUser.Public> {
        let data = try req.content.decode(ClientUserCreateData.self)
        let client = ClientUser(id: data.id, username: data.username, password: data.password)
        client.password = try Bcrypt.hash(client.password)
        return client.save(on: req.db).map{client}.convertToPublic()
    }
    
    func getAllHandler(_ req: Request) throws -> EventLoopFuture<[ClientUser.Public]> {
        ClientUser.query(on: req.db).with(\.$client, {
            c in
            c.with(\.$orders)
        }).all().convertToPublic()
    }
    
    func getHandler(_ req: Request) throws -> EventLoopFuture<ClientUser.Public> {
        ClientUser.find(req.parameters.get("userID"), on: req.db)
            .unwrap(or: Abort(.notFound)).convertToPublic()
    }
    
    func getOrdersHandler(_ req: Request) throws -> EventLoopFuture<[Order]> {
        let id = UUID.init(uuidString: req.parameters.get("userID") ?? "") ?? UUID()
        return Order.query(on: req.db).filter(\.$client.$id == id).all()
    }
    
    func getPaidOrdersHandler(_ req: Request) throws -> EventLoopFuture<[Order]> {
        let id = UUID.init(uuidString: req.parameters.get("userID") ?? "") ?? UUID()
        return Order.query(on: req.db).filter(\.$client.$id == id).all()
    }
    
    func getOrdersLastMonthHandler(_ req: Request) throws -> EventLoopFuture<[Order]> {
        let id = UUID.init(uuidString: req.parameters.get("userID") ?? "") ?? UUID()
        return Order.query(on: req.db).filter(\.$client.$id == id).filter(\.$dateOfOrder > Date().addingTimeInterval(-15000)).all()
    }
    
    func getNotPaidOrdersLastMonthHandler(_ req: Request) throws -> EventLoopFuture<[Order]> {
        let id = UUID.init(uuidString: req.parameters.get("userID") ?? "") ?? UUID()
        return Order.query(on: req.db).filter(\.$client.$id == id).filter(\.$dateOfOrder > Date().addingTimeInterval(-15000)).filter(\.$paid == false).all()
    }
    
    func getPaidOrdersLastMonthHandler(_ req: Request) throws -> EventLoopFuture<[Order]> {
        let id = UUID.init(uuidString: req.parameters.get("userID") ?? "") ?? UUID()
        return Order.query(on: req.db).filter(\.$client.$id == id).filter(\.$dateOfOrder > Date().addingTimeInterval(-15000)).filter(\.$paid == true).all()
    }
    
    func updateHandler(_ req: Request) throws
    -> EventLoopFuture<ClientUser.Public> {
        let data = try req.content.decode(ClientUser.Public.self)
      
        return ClientUser.find(req.parameters.get("userID"), on: req.db).unwrap(or: Abort(.notFound))
        .flatMap { user in
            user.username = data.username ?? ""
            return user.save(on: req.db).map { user.convertToPublic() }
        }
    }
    
    func loginHandler(_ req: Request) throws -> EventLoopFuture<TokenClient> {
      let user = try req.auth.require(ClientUser.self)
      let token = try TokenClient.generate(for: user)
      return token.save(on: req.db).map { token }
    }
    
}

struct ClientUserCreateData:  Content {
    var password: String
    var username: String
    var id: UUID
}
