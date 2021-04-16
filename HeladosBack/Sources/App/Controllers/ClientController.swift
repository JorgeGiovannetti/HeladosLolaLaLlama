//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 29/03/21.
//

import Vapor
import Fluent

struct ClientController: RouteCollection{
    func boot(routes: RoutesBuilder) throws {
        
        let clientRoute = routes.grouped("api", "client")
        clientRoute.post(use: createHandler)
        clientRoute.put(use: updateHandler)
        
        let tokenAuthMiddleware = Token.authenticator()
        let guardAuthMiddleware = Administrator.guardMiddleware()
        let tokenAuthGroup = clientRoute.grouped(tokenAuthMiddleware, guardAuthMiddleware)
        tokenAuthGroup.get(use: getAllHandler)
        tokenAuthGroup.get("withOrders", use: getClientsWithOrdersHandler)
        tokenAuthGroup.get(":userID", use: getHandler)
    }
    
    func createHandler(_ req: Request) throws -> EventLoopFuture<Client> {
        let client = try req.content.decode(Client.self)
        return client.save(on: req.db).map{client}
    }
    
    func getAllHandler(_ req: Request) throws -> EventLoopFuture<[Client]> {
        Client.query(on: req.db).all()
    }
    
    func getHandler(_ req: Request) throws -> EventLoopFuture<Client> {
        Client.find(req.parameters.get("userID"), on: req.db)
            .unwrap(or: Abort(.notFound))
    }
    
    func getClientsWithOrdersHandler(_ req: Request) throws -> EventLoopFuture<[Client]> {
        Client.query(on: req.db).with(\.$orders).all()
    }

    
    func updateHandler(_ req: Request) throws
    -> EventLoopFuture<Client> {
        let data = try req.content.decode(UpdateAdminData.self)
      
        return Client.find(req.parameters.get("userID"), on: req.db).unwrap(or: Abort(.notFound))
        .flatMap { client in
            client.email = data.email
            client.name = data.name
            return client.save(on: req.db).map { client}
        }
    }
    
    
    
}

