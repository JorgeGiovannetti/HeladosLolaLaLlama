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
       // orderRoute.post(use: createHandler)
       // orderRoute.post("withBox", use: createWithBoxHandler)
        orderRoute.get(":orderID", use: getHandler)
        orderRoute.post("pay", use: chargeCustomer)
       
        let tokenAuthMiddleware = Token.authenticator()
        let guardAuthMiddleware = Administrator.guardMiddleware()
        let tokenAuthGroup = orderRoute.grouped(tokenAuthMiddleware, guardAuthMiddleware)
        tokenAuthGroup.get(use: getAllHandler)
        tokenAuthGroup.get("lastMonthOrders", use: getAllOrdersFromLastMonthHandler)
        tokenAuthGroup.get("lastMonthPaidOrders", use: getAllPaidOrdersFromLastMonthHandler)
        tokenAuthGroup.get("paid", use: getAllPaidOrdersHandler)
        tokenAuthGroup.get("profitsLastMonth", use: getAllProfitsFromLastMonthHandler)
        tokenAuthGroup.get("numberOrderLastMonth", use: getNUmberOfOrdersHandler)
        tokenAuthGroup.get("numberPaidOrderLastMonth", use: getNUmberOfPaidOrdersHandler)
    }
    
    func sendEmail(_ req: Request, email: String, contentHTML: String) throws -> EventLoopFuture<HTTPStatus> {
        let to = EmailAddress(email: email)
        let from = EmailAddress(email: "a01197108@itesm.mx", name: "Cecy Ponce Cakes")
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
//
//    func createHandler(_ req: Request) throws -> EventLoopFuture<Order> {
//        let data = try req.content.decode(OrderCreateData.self)
//        let order = Order(dateOfOder: Date.init(), specification: data.specification, client: data.client, shippingAddress: data.shippingAddress)
//
//        let productsInfo = data.products.split(separator: ",").map{$0.split(separator: ":")}
//        let idProducts : [UUID] = productsInfo.map({(UUID(String($0.first ?? "")) ?? UUID())})
//
//        let myOrder = Product.query(on: req.db).filter(\.$id ~~ idProducts).all().flatMapThrowing { (productArray) -> [(Product, UInt8, Bool)] in
//            var productos: [(Product, UInt8, Bool)] = []
//            for product in productArray{
//                if let index = productsInfo.firstIndex(where: { UUID(String($0.first ?? "")) == product.id }) {
//                    let quantity : UInt8 = UInt8(productsInfo[index].last ?? "0") ?? 0
//                    let id: UUID = UUID(String(productsInfo[index].first ?? "")) ?? UUID()
//                    productos.append((product,quantity, false))
//                }
//            }
//
//            if(productos.isEmpty){
//                throw Abort(.badRequest, reason: "Invalid products")
//            }
//            return productos
//        }
//
//        do{
//            return  try createOrder(req: req, withBox: false, clientID: data.client, order: order, dataBox: nil, myOrder: myOrder)
//        }catch let error{
//            throw error
//        }
//    }
    
//    func createWithBoxHandler(_ req: Request) throws -> EventLoopFuture<Order> {
//        let data = try req.content.decode(OrderWithBoxCreateData.self)
//        let order = Order(dateOfOder: Date.init(), specification: data.specification, client: data.client, shippingAddress: data.shippingAddress)
//        let productsInfo = data.products.split(separator: ",").map{$0.split(separator: ":")}
//
//        let productsIDInBox : [UUID] = data.productsInBox.split(separator: ",").map({(UUID(uuidString: String($0)) ?? UUID())})
//        let idProducts : [UUID] = productsInfo.map({(UUID(String($0.first ?? "")) ?? UUID())})
//
//        let myOrder = Product.query(on: req.db).filter(\.$id ~~ idProducts).all().flatMapThrowing { (productArray) -> [(Product, UInt8, Bool)] in
//            var productos: [(Product, UInt8, Bool)] = []
//            for product in productArray{
//                if let index = productsInfo.firstIndex(where: { UUID(String($0.first ?? "")) == product.id }) {
//                    let quantity : UInt8 = UInt8(productsInfo[index].last ?? "0") ?? 0
//                    let id :UUID = UUID(String(productsInfo[index].first ?? "")) ?? UUID()
//                    productos.append((product,quantity, productsIDInBox.contains(id)))
//                }
//            }
//
//            if(productos.isEmpty){
//                throw Abort(.badRequest, reason: "Invalid products")
//            }
//            return productos
//        }
//
//        do{
//            return  try createOrder(req: req, withBox: true, clientID: data.client, order: order, dataBox: data, myOrder: myOrder)
//        }catch let error{
//            throw error
//        }
//
//    }

    func chargeCustomer(_ req: Request) throws -> EventLoopFuture<HTTPStatus> {
        let data = try req.content.decode(ChargeToken.self)
        
        return Order.find(data.orderID, on: req.db).unwrap(or: Abort(.notFound)).flatMap { (order) -> EventLoopFuture<HTTPStatus> in
            return Client.find(order.$client.id, on: req.db).unwrap(or: Abort(.notFound)).flatMap { (client : Client) -> (EventLoopFuture<HTTPStatus>) in
                return req.stripe.charges.create(amount: Int(order.total * 100.0), currency: .mxn, customer: client.id?.uuidString, description: "Pago por CecyPonceCakes", metadata: nil, onBehalfOf: "Cecilia Ponce", receiptEmail: client.email, shipping: nil, source: data.token, statementDescriptor: nil, statementDescriptorSuffix: nil, transferData: nil, transferGroup: nil, expand: nil).map { (stripeCharge : StripeCharge) -> HTTPStatus  in
                    if stripeCharge.status == StripeChargeStatus.succeeded {
                        order.paid = true
                        let _ = order.update(on: req.db)
                        
                        order.$orderDetails.get(on: req.db).map { (orderDetails : [OrderDetail]) -> Void in
                            var stringEmail = ""
                            for detail in orderDetails{
                                detail.$product.get(on: req.db).map { (product) -> (Void) in
                                    stringEmail += "<tr><td>\(product.$name)</td><td>\(detail.quantity)</td><td>\(product.$price)</td></tr>"
                                }
                            }
                            stringEmail += "</table></td></tr></table><h3>ID de order: \(String(describing: order.id?.uuidString))</h3><br><h2>Total: \(order.total)</h2>"
                            do{
                                try sendEmail(req, email: client.email, contentHTML: emailContentHTML + stringEmail + emailTailHTML)
                            }catch let error{
                                
                            }
                        }
                       
                       return .ok
                    } else {
                        order.paid = true
                        print("Stripe charge status: \(stripeCharge.status?.rawValue)")
                        return .badRequest
                    }
                }
            }
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
    
    
//    func createOrder(req: Request, withBox: Bool, clientID : UUID, order: Order, dataBox: OrderWithBoxCreateData?, myOrder: EventLoopFuture<[(Product, UInt8, Bool)]>) throws -> EventLoopFuture<Order> {
//        var suma : Float = 0.0
//        let idBox: UUID = UUID()
//        return  Client
//            .query(on: req.db)
//            .filter(\.$id == clientID)
//            .first()
//            .unwrap(or: Abort(.notAcceptable)).flatMap { (user : Client) -> EventLoopFuture<Order> in
//                req.db.transaction { connection in
//                let promise = req.eventLoop.makePromise(of: EventLoopFuture<Order>.self)
//                let _ = order.save(on: connection).flatMapThrowing { (_) -> (EventLoopFuture<Order>) in
//
//
//                    myOrder.whenComplete { (result) in
//                       switch result {
//                           case .success(let myProducts):
//                               for p in myProducts{
//                                    let detail = OrderDetail(product: p.0.id!, order: order.id ?? UUID(), quantity: p.1, idBox: (p.2) ? idBox : nil)
//                                    let _ = detail.save(on: connection)
//                                    suma += p.0.price*Float(p.1)
//
//                                    let _ = p.0.save(on: req.db)
//                                }
//                                suma *= 1.036
//                                suma += 3
//                                order.total = suma
//                                promise.succeed(order.save(on: connection).map{order})
//                           case .failure(let error):
//                                print(error)
//                                promise.fail(error)
//                        }
//                    }
//                    return order.save(on: connection).map{order}
//                }
//
//                return promise.futureResult.flatMap { (pro) -> EventLoopFuture<Order> in
//                    let _ = order.$box.get(on: req.db)
//                    return pro
//                }
//            }
//        }
//    }
//
}



struct OrderCreateData:  Content {
    var shippingAddress: String?
    var specification: String
    var client: UUID
    var products: String
}

struct OrderWithBoxCreateData:  Content {
    var shippingAddress: String?
    var specification: String
    var client: UUID
    var products: String
    var productsInBox: String
    var addresse: String?
    var dedication: String?
}


enum TransactionError: Error {
    case productsAlreadyOuOfStock
}

struct ChargeToken: Content {
    var token: String
    var orderID: UUID
}

struct ResultSumTotal: Content{
    var totalSum : Float
}

let emailContentHTML = """
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title></title>
    <style type="text/css" rel="stylesheet" media="all">
    /* Base ------------------------------ */
    
    @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
    body {
      width: 100% !important;
      height: 100%;
      margin: 0;
      -webkit-text-size-adjust: none;
    }
    
    a {
      color: #3869D4;
    }
    
    a img {
      border: none;
    }
    
    td {
      word-break: break-word;
      text-align: left;
      vertical-align: middle;
    }
    
    .preheader {
      display: none !important;
      visibility: hidden;
      mso-hide: all;
      font-size: 1px;
      line-height: 1px;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
    }
    /* Type ------------------------------ */
    
    body,
    td,
    th {
      font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
    }
    
    h1 {
      margin-top: 0;
      color: #333333;
      font-size: 22px;
      font-weight: bold;
      text-align: left;
    }
    
    h2 {
      margin-top: 0;
      color: #333333;
      font-size: 16px;
      font-weight: bold;
      text-align: left;
    }
    
    h3 {
      margin-top: 0;
      color: #333333;
      font-size: 14px;
      font-weight: bold;
      text-align: left;
    }
    
    td,
    th {
      font-size: 16px;
    }
    
    p,
    ul,
    ol,
    blockquote {
      margin: .4em 0 1.1875em;
      font-size: 16px;
      line-height: 1.625;
    }
    
    p.sub {
      font-size: 13px;
    }
    /* Utilities ------------------------------ */
    
    .align-right {
      text-align: right;
    }
    
    .align-left {
      text-align: left;
    }
    
    .align-center {
      text-align: center;
    }
    /* Buttons ------------------------------ */
    
    .button {
      background-color: #3869D4;
      border-top: 10px solid #3869D4;
      border-right: 18px solid #3869D4;
      border-bottom: 10px solid #3869D4;
      border-left: 18px solid #3869D4;
      display: inline-block;
      color: #FFF;
      text-decoration: none;
      border-radius: 3px;
      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
      -webkit-text-size-adjust: none;
      box-sizing: border-box;
    }
    
    .button--green {
      background-color: #22BC66;
      border-top: 10px solid #22BC66;
      border-right: 18px solid #22BC66;
      border-bottom: 10px solid #22BC66;
      border-left: 18px solid #22BC66;
    }
    
    .button--red {
      background-color: #FF6136;
      border-top: 10px solid #FF6136;
      border-right: 18px solid #FF6136;
      border-bottom: 10px solid #FF6136;
      border-left: 18px solid #FF6136;
    }
    
    @media only screen and (max-width: 500px) {
      .button {
        width: 100% !important;
        text-align: center !important;
      }
    }
    /* Attribute list ------------------------------ */
    
    .attributes {
      margin: 0 0 21px;
    }
    
    .attributes_content {
      background-color: #F4F4F7;
      padding: 16px;
    }
    
    .attributes_item {
      padding: 0;
    }
    /* Related Items ------------------------------ */
    
    .related {
      width: 100%;
      margin: 0;
      padding: 25px 0 0 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }
    
    .related_item {
      padding: 10px 0;
      color: #CBCCCF;
      font-size: 15px;
      line-height: 18px;
    }
    
    .related_item-title {
      display: block;
      margin: .5em 0 0;
    }
    
    .related_item-thumb {
      display: block;
      padding-bottom: 10px;
    }
    
    .related_heading {
      border-top: 1px solid #CBCCCF;
      text-align: center;
      padding: 25px 0 10px;
    }
    /* Discount Code ------------------------------ */
    
    .discount {
      width: 100%;
      margin: 0;
      padding: 24px;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      background-color: #F4F4F7;
      border: 2px dashed #CBCCCF;
    }
    
    .discount_heading {
      text-align: center;
    }
    
    .discount_body {
      text-align: center;
      font-size: 15px;
    }
    /* Social Icons ------------------------------ */
    
    .social {
      width: auto;
    }
    
    .social td {
      padding: 0;
      width: auto;
    }
    
    .social_icon {
      height: 20px;
      margin: 0 8px 10px 8px;
      padding: 0;
    }
    /* Data table ------------------------------ */
    
    .purchase {
      width: 100%;
      margin: 0;
      padding: 35px 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }
    
    .purchase_content {
      width: 100%;
      margin: 0;
      padding: 25px 0 0 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }
    
    .purchase_item {
      padding: 10px 0;
      color: #51545E;
      font-size: 15px;
      line-height: 18px;
    }
    
    .purchase_heading {
      padding-bottom: 8px;
      border-bottom: 1px solid #EAEAEC;
    }
    
    .purchase_heading p {
      margin: 0;
      color: #85878E;
      font-size: 12px;
    }
    
    .purchase_footer {
      padding-top: 15px;
      border-top: 1px solid #EAEAEC;
    }
    
    .purchase_total {
      margin: 0;
      text-align: right;
      font-weight: bold;
      color: #333333;
    }
    
    .purchase_total--label {
      padding: 0 15px 0 0;
    }
    
    body {
      background-color: #F4F4F7;
      color: #51545E;
    }
    
    p {
      color: #51545E;
    }
    
    p.sub {
      color: #6B6E76;
    }
    
    .email-wrapper {
      width: 100%;
      margin: 0;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      background-color: #F4F4F7;
    }
    
    .email-content {
      width: 100%;
      margin: 0;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
    }
    /* Masthead ----------------------- */
    
    .email-masthead {
      padding: 25px 0;
      text-align: center;
    }
    
    .email-masthead_logo {
      width: 94px;
    }
    
    .email-masthead_name {
      font-size: 16px;
      font-weight: bold;
      color: #A8AAAF;
      text-decoration: none;
      text-shadow: 0 1px 0 white;
    }
    /* Body ------------------------------ */
    
    .email-body {
      width: 100%;
      margin: 0;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      background-color: #FFFFFF;
    }
    
    .email-body_inner {
      width: 570px;
      margin: 0 auto;
      padding: 0;
      -premailer-width: 570px;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      background-color: #FFFFFF;
    }
    
    .email-footer {
      width: 570px;
      margin: 0 auto;
      padding: 0;
      -premailer-width: 570px;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      text-align: center;
    }
    
    .email-footer p {
      color: #6B6E76;
    }
    
    .body-action {
      width: 100%;
      margin: 30px auto;
      padding: 0;
      -premailer-width: 100%;
      -premailer-cellpadding: 0;
      -premailer-cellspacing: 0;
      text-align: center;
    }
    
    .body-sub {
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #EAEAEC;
    }
    
    .content-cell {
      padding: 35px;
    }
    /*Media Queries ------------------------------ */
    
    @media only screen and (max-width: 600px) {
      .email-body_inner,
      .email-footer {
        width: 100% !important;
      }
    }
    
    @media (prefers-color-scheme: dark) {
      body,
      .email-body,
      .email-body_inner,
      .email-content,
      .email-wrapper,
      .email-masthead,
      .email-footer {
        background-color: #333333 !important;
        color: #FFF !important;
      }
      p,
      ul,
      ol,
      blockquote,
      h1,
      h2,
      h3,
      span,
      .purchase_item {
        color: #FFF !important;
      }
      .attributes_content,
      .discount {
        background-color: #222 !important;
      }
      .email-masthead_name {
        text-shadow: none !important;
      }
    }
    
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    </style>
    <!--[if mso]>
    <style type="text/css">
      .f-fallback  {
        font-family: Arial, sans-serif;
      }
    </style>
  <![endif]-->
  </head>
  <body>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="email-masthead">
                <a href="https://cecyponcecakes.com.mx" class="f-fallback email-masthead_name">
                Cecy Ponce Cakes
              </a>
              </td>
            </tr>
            <!-- Email Body -->
            <tr>
              <td class="email-body" width="100%" cellpadding="0" cellspacing="0">
                <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                  <!-- Body content -->
                  <tr>
                    <td class="content-cell">
                      <div class="f-fallback">
                        Se ha realizado una orden de compra
                        <br>
                        <br> Detalles de compra
                        <table class="attributes" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td class="attributes_content">
                              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                                <h2>Productos</h2>
                                <tr>
                                  <th class="attributes_item"><span>Nombre</span></th>
                                  <th class="attributes_item"><span>Cantidad</span></th>
                                  <th class="attributes_item"><span>Precio por unidad</span></th>
                                </tr>
                                <tr>
                                    <td>Pastel de chocolate</td>
                                    <td>4</td>
                                    <td>$5.00</td>
                                </tr>
         
"""

let emailTailHTML = """
                        Detalles
                        <!-- <p>By {{commenter_name}} at {{timestamp}}</p> -->
                        <p class="sub"><a href="{{action_url}}">Ver más productos</a></p>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="content-cell" align="center">
                     <!--  <p class="f-fallback sub align-center">&copy; 2021 [Product Name]. All rights reserved.</p>-->
                      <p class="f-fallback sub align-center">
                        Cecy Ponce Cakes
                        <br>Monterrey, Nuevo León
                        <br>Suite 1234
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

"""
