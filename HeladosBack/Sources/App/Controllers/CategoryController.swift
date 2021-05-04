//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 28/03/21.
//

import Vapor
import Fluent

struct CategoryController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let categoriesRoute = routes.grouped("api", "category")
        categoriesRoute.get(use: getAllHandler)
        categoriesRoute.get(":categoryID", use: getHandler)
        categoriesRoute.get(":categoryID","helados", use: getHeladosHandler)
        let tokenAuthMiddleware = Token.authenticator()
        let guardAuthMiddleware = Administrator.guardMiddleware()
        let tokenAuthGroup = categoriesRoute.grouped(tokenAuthMiddleware, guardAuthMiddleware)
        tokenAuthGroup.post(use: createHandler)
        tokenAuthGroup.put(use: updateHandler)
        tokenAuthGroup.delete(use: deleteHandler)
    }
    
    func getAllHandler(_ req: Request) throws -> EventLoopFuture<[Category]> {
        Category.query(on: req.db).with(\.$helados).all()
    }
    
    func getHandler(_ req: Request) throws -> EventLoopFuture<Category> {
        Category.query(on: req.db).filter(\.$id == UUID(req.parameters.get("categoryID") ?? "") ?? UUID()).with(\.$helados).first()
            .unwrap(or: Abort(.notFound))
    }
    
    func createHandler(_ req: Request) throws -> EventLoopFuture<Category> {
        let category = try req.content.decode(Category.self)
        return category.save(on: req.db).map{category}
    }
    
    
    func updateHandler(_ req: Request) throws -> EventLoopFuture<Category> {
        let data = try req.content.decode(Category.self)
      
        return Category.find(req.parameters.get("categoryID"), on: req.db).unwrap(or: Abort(.notFound))
        .flatMap { category in
            category.name = data.name
            category.description = data.description
            return category.save(on: req.db).map { category }
        }
    }
    
    func deleteHandler(_ req: Request) throws -> EventLoopFuture<HTTPStatus> {
        Category.find(req.parameters.get("categoryID"), on: req.db)
          .unwrap(or: Abort(.notFound))
          .flatMap { category in
            category.delete(on: req.db)
            .transform(to: .noContent)
          }
    }
    
    func getHeladosHandler(_ req: Request) throws -> EventLoopFuture<[Helado]> {
        Category.find(req.parameters.get("categoryID"), on: req.db).unwrap(or: Abort(.notFound)).flatMap{
            category in
            category.$helados.get(on: req.db)
        }
    }
    
}



