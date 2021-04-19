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
        let fotoProducto = try req.content.decode(FotoProductoCreate.self)
        let productQuery = Product.find(fotoProducto.product, on: req.db).unwrap(or: Abort(.notFound))
        
        return productQuery.flatMap{ p in
            let myNewPhoto = FotoProducto(foto: fotoProducto.foto, product: p.id!)
            return myNewPhoto.save(on: req.db).map{myNewPhoto}
        }
    }
    
}
struct FotoProductoCreate: Content{
    var foto: String
    var product: UUID
}
