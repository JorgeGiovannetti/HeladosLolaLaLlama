//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 27/03/21.
//

import Vapor
import Fluent

struct ProductController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let productsRoute = routes.grouped("api", "product")
        productsRoute.get(use: getAllHandler)
        productsRoute.get(":productID", use: getHandler)
        productsRoute.get("available", use: getAllAvailableHandler)
        productsRoute.get("availableHelados", use: getAllAvailableHeladosHandler)
        let tokenAuthMiddleware = Token.authenticator()
        let guardAuthMiddleware = Administrator.guardMiddleware()
        let tokenAuthGroup = productsRoute.grouped(tokenAuthMiddleware, guardAuthMiddleware)
        tokenAuthGroup.post("changeAvailable",":productID", use: changeAvailable)
    }
    
    func getAllHandler(_ req: Request) throws -> EventLoopFuture<[Product]> {
        Product.query(on: req.db).with(\.$helado).with(\.$fotos).with(\.$precios).all()
    }

    func getHandler(_ req: Request) throws -> EventLoopFuture<Product> {
        return Product.find(req.parameters.get("productID"), on: req.db).unwrap(or: Abort(.notFound))
    }
    
    func getAllAvailableHandler(_ req: Request) throws -> EventLoopFuture<[Product]> {
        Product.query(on: req.db).with(\.$helado).with(\.$fotos).with(\.$precios).filter(\.$available == true).all()
    }
    
    func getAllAvailableHeladosHandler(_ req: Request) throws -> EventLoopFuture<[Product]> {
        Product.query(on: req.db).with(\.$helado).with(\.$fotos).with(\.$precios).filter(\.$available == true).all()
    }
    
    func changeAvailable(_ req: Request) throws -> EventLoopFuture<HTTPStatus> {
        Product.find(req.parameters.get("productID"), on: req.db).unwrap(or: Abort(.notFound)).flatMap { product in
            product.available = !product.available
            return product.save(on: req.db).transform(to: .ok)
        }
    }
    
    
}
