//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 28/03/21.
//

import Vapor
import Fluent
struct FotoProductoController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let fotoProductoRoute = routes.grouped("api", "fotoProducto")
        fotoProductoRoute.get(use: getAllHandler)
        fotoProductoRoute.get(":fotoID", use: getHandler)
        
        let tokenAuthMiddleware = Token.authenticator()
        let guardAuthMiddleware = Administrator.guardMiddleware()
        let tokenAuthGroup = fotoProductoRoute.grouped(tokenAuthMiddleware, guardAuthMiddleware)
        tokenAuthGroup.post(use: createHandler)
    }
    
    func getAllHandler(_ req: Request) throws -> EventLoopFuture<[FotoProducto]> {
        FotoProducto.query(on: req.db).with(\.$product).all()
    }
    
    func getHandler(_ req: Request) throws -> EventLoopFuture<FotoProducto> {
        let id = UUID.init(uuidString: req.parameters.get("fotoID") ?? "") ?? UUID()
        return FotoProducto.query(on: req.db).filter(\.$id == id).with(\.$product).first().unwrap(or: Abort(.notFound))
    }
    
    func createHandler(_ req: Request) throws -> EventLoopFuture<FotoProducto> {
        let fotoProducto = try req.content.decode(FotoProducto.self)
        return fotoProducto.save(on: req.db).map{fotoProducto}
    }
    
}
