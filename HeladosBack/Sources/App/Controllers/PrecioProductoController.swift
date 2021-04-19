//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 18/04/21.
//

import Vapor
import Fluent
struct PrecioProductoController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let precioProductoRoute = routes.grouped("api", "precioProducto")
        precioProductoRoute.get(use: getAllHandler)
        precioProductoRoute.get(":priceID", use: getHandler)
        
        let tokenAuthMiddleware = Token.authenticator()
        let guardAuthMiddleware = Administrator.guardMiddleware()
        let tokenAuthGroup = precioProductoRoute.grouped(tokenAuthMiddleware, guardAuthMiddleware)
        tokenAuthGroup.post(use: createHandler)
    }
    
    func getAllHandler(_ req: Request) throws -> EventLoopFuture<[PrecioProducto]> {
        PrecioProducto.query(on: req.db).with(\.$product).all()
    }
    
    func getHandler(_ req: Request) throws -> EventLoopFuture<PrecioProducto> {
        let id = UUID.init(uuidString: req.parameters.get("priceID") ?? "") ?? UUID()
        return PrecioProducto.query(on: req.db).filter(\.$id == id).with(\.$product).first().unwrap(or: Abort(.notFound))
    }
    
    func createHandler(_ req: Request) throws -> EventLoopFuture<PrecioProducto> {
        let precioProducto = try req.content.decode(PrecioProductoCreate.self)
        let productQuery = Product.find(precioProducto.product, on: req.db).unwrap(or: Abort(.notFound))
        
        return productQuery.flatMap{ p in
            
            let myNewPrice = PrecioProducto(size: precioProducto.size, price: precioProducto.price, product: p.id!)
            return myNewPrice.save(on: req.db).map{myNewPrice}
        }
    }
    
}

struct PrecioProductoCreate: Content{
    var price: Float
    var size: String?
    var product: UUID
}
