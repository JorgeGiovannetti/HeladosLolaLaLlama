//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 27/03/21.
//


import Vapor
import Fluent

struct HeladoController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let heladosRoute = routes.grouped("api", "helados")
        heladosRoute.get(use: getAllHandler)
        heladosRoute.get("sortedFlavor", use: getAllSortedFlavorHandler)
        heladosRoute.get(":heladoID" ,use: getHandler)
        heladosRoute.get("searchFlavor" ,use: searchFlavorHandler)
        heladosRoute.get(":heladoID","categories", use: getCategoriesHandler)
        heladosRoute.get("flavors", use: getAllFlavorsHandler)
        let tokenAuthMiddleware = Token.authenticator()
        let guardAuthMiddleware = Administrator.guardMiddleware()
        let tokenAuthGroup = heladosRoute.grouped(tokenAuthMiddleware, guardAuthMiddleware)
        tokenAuthGroup.post(use: createHandler)
        tokenAuthGroup.put(":heladoID", "flavor", use: updateFlavorHandler)
        tokenAuthGroup.put(":heladoID", use: updateHandler)
        tokenAuthGroup.delete(":heladoID",use:deleteHandler)
        tokenAuthGroup.post(":heladoID" , "categories" , ":categoryID", use: addCategoriesHandler)
        tokenAuthGroup.delete(":heladoID", "categories", ":categoryID", use: removeCategoriesHandler)
    }
    
    func getAllHandler(_ req: Request) throws ->  EventLoopFuture<[Helado]> {
        return Helado.query(on: req.db).with(\.$product, {p in
            p.with(\.$fotos)
            p.with(\.$precios)
        }).with(\.$categories).all()
    }
    

    func getAllFlavorsHandler(_ req: Request) throws ->  EventLoopFuture<[String]> {
        return Helado.query(on: req.db).unique().all(\.$flavor).map { sabores in
            return sabores
        }
    }

    func getAllSortedFlavorHandler(_ req: Request) throws ->  EventLoopFuture<[Helado]> {
        return Helado.query(on: req.db).with(\.$product,{p in
            p.with(\.$fotos)
            p.with(\.$precios)
        }).sort(\.$flavor).all()
    }

    
    func createHandler(_ req: Request) throws -> EventLoopFuture<Helado> {
        let data = try req.content.decode(HeladoCreateData.self)
        let product = Product(name: data.name, description: data.description)
        
        let futureResponse : EventLoopFuture<Helado> = product.save(on: req.db).flatMap { p -> EventLoopFuture<Helado> in
            let helado = Helado(id: product.id, flavor: data.flavor)
            helado.$product.get(on: req.db)
            return  helado.save(on: req.db).map{helado}
        }

        return futureResponse
    }
    
    func getHandler(_ req: Request) throws -> EventLoopFuture<Helado> {
        let id = UUID.init(uuidString: req.parameters.get("heladoID") ?? "") ?? UUID()
        return Helado.query(on: req.db).filter(\.$id == id).with(\.$product, {p in
            p.with(\.$fotos)
            p.with(\.$precios)
        }).with(\.$categories).first().unwrap(or: Abort(.notFound))
    }
    
    func searchFlavorHandler(_ req: Request) throws
            -> EventLoopFuture<[Helado]> {
          guard let searchTerm = req
            .query[String.self, at: "term"] else {
              throw Abort(.badRequest)
          }
        return Helado.query(on: req.db).with(\.$product, {p in
            p.with(\.$fotos)
            p.with(\.$precios)
        }).group(.or) { or in
            or.filter(\.$flavor == searchTerm)
          }.all()
    }

    
    
    func updateFlavorHandler(_ req: Request) throws
        -> EventLoopFuture<Helado> {
        let data = try req.content.decode(HeladoUpdateFlavorData.self)
      
        return Helado.find(req.parameters.get("heladoID"), on: req.db).unwrap(or: Abort(.notFound))
        .flatMap { helado in
            helado.flavor = data.flavor
            return helado.save(on: req.db).map { helado }
        }
    }
    
    
    func updateHandler(_ req: Request) throws
        -> EventLoopFuture<Helado> {
        let data = try req.content.decode(HeladoUpdateData.self)
      
        let product = Product.find(req.parameters.get("heladoID"), on: req.db).unwrap(or: Abort(.notFound))
        .flatMap { producto -> EventLoopFuture<Product> in
            producto.name = (data.name != nil) ? data.name! : producto.name
            producto.description = (data.description != nil) ? data.description! : producto.description
            producto.available = (data.available != nil) ? data.available! : producto.available
            return producto.update(on: req.db).map { producto }
        }
        
        let helado = Helado.find(req.parameters.get("heladoID"), on: req.db).unwrap(or: Abort(.notFound)).flatMap { helado -> EventLoopFuture<Helado> in
            helado.flavor = (data.flavor != nil) ? data.flavor! : helado.flavor
            return helado.update(on: req.db).map { helado }
        }

        return product.and(helado).map { (p,h) in
            return h
        }
    }
    
    func deleteHandler(_ req: Request) throws
        -> EventLoopFuture<HTTPStatus> {

        return req.db.transaction{con in
            return Helado.find(req.parameters.get("heladoID"), on: con).unwrap(or: Abort(.noContent)).flatMap {helado in helado.delete(on: con)}.flatMap{_ in
                return Product.find(req.parameters.get("heladoID"), on: con)
                    .unwrap(or: Abort(.notFound))
                    .flatMap { product in
                      product.delete(on: con)
                    }
            }
        }.transform(to: HTTPStatus.noContent)
    }
    
    func addCategoriesHandler(_ req: Request) throws -> EventLoopFuture<HTTPStatus> {
        let heladoQuery = Helado.find(req.parameters.get("heladoID"), on: req.db).unwrap(or: Abort(.notFound))
        let categoryQuery = Category.find(req.parameters.get("categoryID"), on: req.db).unwrap(or: Abort(.notFound))
        
        return heladoQuery.and(categoryQuery).flatMap{ helado, category in
            helado.$categories.attach(category, on: req.db).transform(to: .created)
        }
    }
    
    func getCategoriesHandler(_ req: Request) throws -> EventLoopFuture<[Category]> {
        Helado.find(req.parameters.get("heladoID"), on: req.db).unwrap(or: Abort(.notFound)).flatMap{
            helado in
            helado.$categories.query(on: req.db).all()
        }
    }
    
    func removeCategoriesHandler(_ req: Request) throws -> EventLoopFuture<HTTPStatus> {
        let heladoQuery =
            Helado.find(req.parameters.get("heladoID"), on: req.db)
              .unwrap(or: Abort(.notFound))
          let categoryQuery =
            Category.find(req.parameters.get("categoryID"), on: req.db)
              .unwrap(or: Abort(.notFound))
        
        return heladoQuery.and(categoryQuery).flatMap{ helado, category in
            helado.$categories.detach(category, on: req.db).transform(to: .noContent)
        }
    }
    
}

struct HeladoCreateData:  Content {
    var flavor: String
    var name: String
    var description: String
}

struct HeladoUpdateData:  Content {
    var flavor: String?
    var name: String?
    var description: String?
    var available: Bool?
}

struct HeladoUpdateFlavorData:  Content {
    var flavor: String
}


