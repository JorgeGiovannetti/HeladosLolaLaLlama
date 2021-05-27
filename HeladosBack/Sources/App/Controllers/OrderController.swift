//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 29/03/21.
//

import Vapor
import Fluent
import SendGrid
import Stripe

struct OrderController: RouteCollection {
  
    func boot(routes: RoutesBuilder) throws {
        let orderRoute = routes.grouped("api", "orders")
        orderRoute.post(use: createHandler)
        orderRoute.get(":orderID", use: getHandler)
       
        let tokenAuthMiddleware = Token.authenticator()
        let guardAuthMiddleware = Administrator.guardMiddleware()
        let tokenAuthGroup = orderRoute.grouped(tokenAuthMiddleware, guardAuthMiddleware)
        tokenAuthGroup.get(use: getAllHandler)
        tokenAuthGroup.patch(":orderID", "approved", use: approvedOrder)
        tokenAuthGroup.get("lastMonthOrders", use: getAllOrdersFromLastMonthHandler)
        tokenAuthGroup.get("lastMonthPaidOrders", use: getAllPaidOrdersFromLastMonthHandler)
        tokenAuthGroup.get("paid", use: getAllPaidOrdersHandler)
        tokenAuthGroup.get("profitsLastMonth", use: getAllProfitsFromLastMonthHandler)
        tokenAuthGroup.get("numberOrdersLastMonth", use: getNUmberOfOrdersHandler)
        tokenAuthGroup.get("numberPaidOrdersLastMonth", use: getNUmberOfPaidOrdersHandler)
    }
    
    func approvedOrder(_ req: Request) throws -> EventLoopFuture<Order> {
  
        let data = try req.content.decode(OrderApprovedData.self)

        return Order.find(req.parameters.get("orderID"), on: req.db).unwrap(or: Abort(.notFound)).map { order in
            order.paid = true
            order.$client.get(on: req.db).map { cliente  in
                do{
                    try sendEmail(req, email: cliente.email, contentHTML: emailApproved(id: order.id?.uuidString ?? "", fechaEntrega: data.fechaEntrega))
                }catch let error{
                    print(error.localizedDescription)
                }
            }
            order.update(on: req.db)
            return order
        }
    }
    
    func sendEmail(_ req: Request, email: String, contentHTML: String) throws -> EventLoopFuture<HTTPStatus> {
        let to = EmailAddress(email: email)
        let from = EmailAddress(email: "alexhl1999@hotmail.com", name: "Helados Lola La Llama")
        let personalization = Personalization(to: [to], subject: "Nuevo Pedido!")
        var emailContent: [String: String] = [:]
        emailContent["type"] = "text/html"
        emailContent["value"] = contentHTML
        let email = SendGridEmail(personalizations: [personalization], from: from, content: [emailContent])

        let sendGridClient = req.application.sendgrid.client
        do {
            return try sendGridClient.send(emails: [email], on: req.eventLoop).transform(to: HTTPStatus.ok)
        } catch {
            req.logger.error("\(error)")
            return req.eventLoop.makeFailedFuture(error)
        }
    }
    
    func getAllHandler(_ req: Request) throws -> EventLoopFuture<[Order]> {
        Order.query(on: req.db)
            .with(\.$client).with(\.$orderDetails).all()
    }
    
    
    func getHandler(_ req: Request) throws -> EventLoopFuture<Order> {
        let id = UUID.init(uuidString: req.parameters.get("orderID") ?? "") ?? UUID()
        return Order.query(on: req.db).filter(\.$id == id).with(\.$client).with(\.$orderDetails,  { details in
            details.with(\.$product)
        }).first().unwrap(or: Abort(.notFound))
    }
    
    func getAllPaidOrdersHandler(_ req: Request) throws -> EventLoopFuture<[Order]> {
        Order.query(on: req.db)
            .with(\.$client).with(\.$orderDetails, { details in
            details.with(\.$product)
            }).filter(\.$paid == true).all()
    }
    
    
    
    func getAllOrdersFromLastMonthHandler(_ req: Request) throws -> EventLoopFuture<[Order]> {
        Order.query(on: req.db).with(\.$client).with(\.$orderDetails, { details in
            details.with(\.$product)
        }).filter(\.$dateOfOrder > Date().addingTimeInterval(-15000)).all()
    }
    
    func getAllPaidOrdersFromLastMonthHandler(_ req: Request) throws -> EventLoopFuture<[Order]> {
        Order.query(on: req.db).with(\.$client).with(\.$orderDetails, { details in
            details.with(\.$product)
        }).filter(\.$paid == true).filter(\.$dateOfOrder > Date().addingTimeInterval(-15000)).all()
    }
    
    func getAllProfitsFromLastMonthHandler(_ req: Request) throws -> EventLoopFuture<ResultSumTotal> {
        return Order.query(on: req.db).filter(\.$paid == true).sum(\.$total).unwrap(or: Abort(.noContent)).map{ResultSumTotal(totalSum: $0)}
    }
    
    func getNUmberOfOrdersHandler(_ req: Request) throws -> EventLoopFuture<Int> {
        return Order.query(on: req.db).filter(\.$dateOfOrder > Date().addingTimeInterval(-15000)).count()
    }
    
    func getNUmberOfPaidOrdersHandler(_ req: Request) throws -> EventLoopFuture<Int> {
        return Order.query(on: req.db).filter(\.$paid == true).filter(\.$dateOfOrder > Date().addingTimeInterval(-15000)).count()
    }
    // P Q S
    func createHandler(_ req: Request) throws -> EventLoopFuture<Order> {
//      Preprocesar data para convertirlo a Order y un listado de Products (con su info)
        let data = try req.content.decode(OrderCreateData.self)
        let client = Client(name: data.clientName, email: data.clientEmail, phone: data.clientPhone, address: data.clientAddress)
        let c = client.save(on: req.db)

        let order = Order(dateOfOder: Date.init(), specification: data.specification, client: client.id!, shippingAddress: data.shippingAddress)

        let productsInfo = data.products.split(separator: ",").map{$0.split(separator: ":")}
        let idProducts : [UUID] = productsInfo.map({(UUID(String($0.first ?? "")) ?? UUID())})

//      Por cada producto recolectado en data, comparar la info con la db y generar el listado final de productos ordenados por el cliente
        let orderProducts = Product.query(on: req.db).filter(\.$id ~~ idProducts).all().flatMapThrowing { (productArray) -> [(Product, UInt8, String)] in
            var finalListProducts : [(Product, UInt8, String)] = []
            
            
            
            for index in 0..<idProducts.count {
                let product = productArray.first(where: {$0.id == idProducts[index]})
                if let product = product, let index = productsInfo.firstIndex(where:{UUID(String($0.first ?? "")) == product.id}) {
                    //  CHECAR ESTO
                    //   Formato de Helado : product:quantity:size, ...
                    let quantity : UInt8 = UInt8(productsInfo[index][1]) ?? 0
                    let size : String = String(productsInfo[index][2])
                    finalListProducts.append((product, quantity, size))
                }
            }
            
//          Si no se pudieron agregar productos, eran invalidos, sino regresar listado final
            if(finalListProducts.isEmpty){
                throw Abort(.badRequest, reason: "Invalid products")
            }
            return finalListProducts
        }
        
//      Si se pudo generar el listado final de la orden, intentar crearla, sino mandar error
        do{
            return  try createOrder(req: req, clientID: client.id!, order: order, orderProducts: orderProducts)
        }catch let error{
            throw error
        }
    
        
    }
    
    func createOrder(req: Request, clientID : UUID, order: Order, orderProducts: EventLoopFuture<[(Product, UInt8, String)]>) throws -> EventLoopFuture<Order> {
        var stringEmail = ""
        return  Client.query(on: req.db).filter(\.$id == clientID).first().unwrap(or: Abort(.notAcceptable)).flatMap { (user : Client) -> EventLoopFuture<Order> in
                req.db.transaction { connection in
                let promise = req.eventLoop.makePromise(of: EventLoopFuture<Order>.self)
                let _ = order.save(on: connection).flatMapThrowing { (_) -> (EventLoopFuture<Order>) in
                    orderProducts.whenComplete { (result) in
                       switch result {
                       //  Por cada producto en el listado final, generar OrderDetail y actualizar precio final de la orden
                           case .success(let myProducts):
                            var arrayPrecios : [Float] = []
                            var precioPromise = req.eventLoop.makePromise(of: [Float].self)
                            for p in myProducts {
                               
                                //   Formato de Helado : product:quantity:size, ...
                                let detail = OrderDetail(product: p.0.id!, order: order.id ?? UUID(), quantity: p.1, size: p.2)
                                let _ = detail.save(on: connection)
//                                  CHECAR ESTO: RELACIONAR PRECIO CORRECTO DE PRECIOS AL PRODUCTO
                               
                                PrecioProducto.query(on: connection).with(\.$product).all().map { (precioProducto : [PrecioProducto])  in
                                    let r = precioProducto.filter({$0.product.id == p.0.id! && $0.size == p.2}).first
                                    stringEmail += "<tr><td>\(p.0.name) - \(p.2)</td><td>\(p.1)</td><td>\(r!.price)</td></tr>"
                                    arrayPrecios.append(r!.price *  Float(p.1))
                                        if(arrayPrecios.count == myProducts.count){
                                            precioPromise.succeed(arrayPrecios)
                                        
                                        }
                                }
                                
                               

                            }
                        
                            precioPromise.futureResult.map { p -> Float in
                                return p.reduce(0.0, +)
                            }.whenComplete({ res in
                                switch res {
                                case .success(let total):
                                    stringEmail += "</table><br><h2>Total: $\(total)</h2><br><h3>ID de order: \(order.id!)</h3>"
                                    order.total = total
                                    do{
                                    try sendEmail(req, email: user.email, contentHTML: mailContentHTML + stringEmail + emailTailHTML)
                                    }catch(let error){
                                        print(error.localizedDescription)
                                    }
                                    
                                    do{
                                    try sendEmail(req, email: "alexhl1999@hotmail.com", contentHTML: mailContentHTML + stringEmail + emailTailHTML)
                                    }catch(let error){
                                        print(error.localizedDescription)
                                    }
                                    promise.succeed(order.save(on: connection).map{order})
                                    
                                case .failure(let error):
                                    promise.fail(error)
                                }
                            })
                       
                        
                           case .failure(let error):
                                print(error)
                                promise.fail(error)
                        }
                    }
//                  Finalizar guardando orden
                    return order.save(on: connection).map{order}
                }

//                                  CHECAR ESTO
//              Enviar info de orden
                return promise.futureResult.flatMap { (pro) -> EventLoopFuture<Order> in
                    return pro
                }
            }
        }
    }

}



struct OrderCreateData:  Content {
    var shippingAddress: String
    var specification: String
    var clientName: String
    var clientEmail: String
    var clientAddress: String
    var clientPhone: String
    var products: String
}

enum TransactionError: Error {
    case productsAlreadyOutOfStock
}

struct ChargeToken: Content {
    var token: String
    var orderID: UUID
}

struct ResultSumTotal: Content{
    var totalSum : Float
}


struct OrderApprovedData: Content{
    var fechaEntrega: String
}
