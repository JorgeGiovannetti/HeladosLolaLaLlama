//
//  File.swift
//  
//
//  Created by Alejandro Hernández López on 27/03/21.
//

import Vapor
import Fluent
import SendGrid

struct AdministratorController: RouteCollection{
    func boot(routes: RoutesBuilder) throws {
        let administratorsRoute = routes.grouped("api", "admin")
        administratorsRoute.post(use: createHandler)
        administratorsRoute.post("forgotPassword", use: forgottenPasswordPostHandler)
        administratorsRoute.get("resetPassword",":token", use: resetPasswordHandler)
        administratorsRoute.post("newPassword", use: resetPasswordPostHandler)
        let basicAuthMiddleware = Administrator.authenticator()
        let basicAuthGroup = administratorsRoute.grouped(basicAuthMiddleware)
        basicAuthGroup.post("login", use: loginHandler)
        
        let tokenAuthMiddleware = Token.authenticator()
        let guardAuthMiddleware = Administrator.guardMiddleware()
        let tokenAuthGroup = administratorsRoute.grouped(tokenAuthMiddleware, guardAuthMiddleware)
        tokenAuthGroup.get(use: getAllHandler)
        tokenAuthGroup.get(":userID", use: getHandler)
        tokenAuthGroup.put(":userID", use: updateHandler)
    }
    
    // 1
    func resetPasswordPostHandler(_ req: Request) throws -> EventLoopFuture<HTTPStatus> {
        let data = try req.content.decode(ResetPasswordData.self)
        guard data.password == data.confirmPassword else {
            Abort(.badRequest)
            return req.eventLoop.makeFailedFuture(Abort(.badRequest))
        }
        
        return ResetPasswordToken.find(data.token, on: req.db).unwrap(or: Abort(.noContent)).map { token in
            
            token.$user.get(on: req.db).flatMapThrowing { admin in
                admin.password = try Bcrypt.hash(data.password)
                admin.update(on: req.db).map{admin}
                token.delete(on: req.db)
            }
        }.transform(to: HTTPStatus.ok)
    }
    
    func forgottenPasswordPostHandler(_ req: Request) throws -> EventLoopFuture<HTTPStatus> {
        
         let email = try req.content.get(String.self, at: "email")
        let promise = req.eventLoop.makePromise(of: HTTPStatus.self)

        Administrator.query(on: req.db).filter(\.$email == email).first().unwrap(or: Abort(.notFound)).flatMapThrowing { admin in
            var resetTokenString = [UInt8].random(count: 32).base64
            resetTokenString.removeAll(where: {!$0.isLetter})
            let resetToken = try ResetPasswordToken(token: resetTokenString, userID: admin.requireID())
            let emailContent = """
            <p>Has pedido cambiar tu contraseña. <a
            href="https://lolalallama.herokuapp.com/api/admin/resetPassword/\(resetTokenString)">
            Dale click aqui </a> para cambiar tu contraseña.</p>
            """
            // 6
              do{
              try sendEmail(req, email: admin.email , contentHTML: emailContent)
                resetToken.save(on: req.db).map { _ in
                    promise.succeed(.ok)
                }
              }catch let error{
                  print(error.localizedDescription)
                promise.succeed(.badRequest)
              }
            
           
        }
        
        return promise.futureResult
    }
    
    func resetPasswordHandler(_ req: Request) throws -> EventLoopFuture<HTTPStatus> {
        guard let token = try req.parameters.get("token") else {return req.eventLoop.makeFailedFuture(Abort(.badRequest))}
           
        let response = req.eventLoop.makePromise(of: HTTPStatus.self)
        ResetPasswordToken.query(on: req.db)
          .filter(\.$token == token)
            .first().unwrap(or: Abort(.notFound))
            .flatMapThrowing({ token in
                token.$user.get(on: req.db).map { admin in
                    response.fail(Abort.redirect(to: "http://localhost:3000/resetPassword?token=\(token.id?.uuidString ?? "")"))
                    //token.delete(on: req.db)
                }
            })
        
        return response.futureResult
        
}
    

    
    func sendEmail(_ req: Request, email: String, contentHTML: String) throws -> EventLoopFuture<HTTPStatus> {
        let to = EmailAddress(email: email)
        let from = EmailAddress(email: "alexhl1999@hotmail.com", name: "Helados Lola La Llama")
        let personalization = Personalization(to: [to], subject: "Olvide mi contraseña!")
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
    
    func createHandler(_ req: Request) throws -> EventLoopFuture<Administrator.Public> {
        let admin = try req.content.decode(Administrator.self)
        admin.password = try Bcrypt.hash(admin.password)
        return admin.save(on: req.db).map{admin}.convertToPublic()
    }
    
    func getAllHandler(_ req: Request) throws -> EventLoopFuture<[Administrator.Public]> {
        Administrator.query(on: req.db).all().convertToPublic()
    }
    
    func getHandler(_ req: Request) throws -> EventLoopFuture<Administrator.Public> {
        Administrator.find(req.parameters.get("userID"), on: req.db)
            .unwrap(or: Abort(.notFound)).convertToPublic()
    }
    
    func updateHandler(_ req: Request) throws
    -> EventLoopFuture<Administrator.Public> {
        let data = try req.content.decode(UpdateAdminData.self)
      
        return Administrator.find(req.parameters.get("userID"), on: req.db).unwrap(or: Abort(.notFound))
        .flatMap { admin in
            admin.email = data.email
            admin.name = data.name
            return admin.save(on: req.db).map { admin.convertToPublic() }
        }
    }
    
    func loginHandler(_ req: Request) throws -> EventLoopFuture<Token> {
      let user = try req.auth.require(Administrator.self)
      let token = try Token.generate(for: user)
      return token.save(on: req.db).map { token }
    }
    
}

struct UpdateAdminData: Content {
    var id: UUID
    var email: String
    var name: String
}

struct ResetPasswordData: Content {
  let password: String
  let confirmPassword: String
let token : UUID
}
