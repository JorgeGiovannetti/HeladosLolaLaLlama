import Fluent
import Vapor

func routes(_ app: Application) throws {
    app.get { req in
        return "It works!"
    }

    app.get("hello") { req -> String in
        return "Hello, world!"
    }
    
    let adminController = AdministratorController()
    try app.register(collection: adminController)
    
    let productController = ProductController()
    try app.register(collection: productController)
    
    let categoryController = CategoryController()
    try app.register(collection: categoryController)
    
    let heladoController = HeladoController()
    try app.register(collection: heladoController)
    
    let fotoProductoController = FotoProductoController()
    try app.register(collection: fotoProductoController)
    
    let clientController = ClientController()
    try app.register(collection: clientController)
    
    let clientUserController = ClientUserController()
    try app.register(collection: clientUserController)
    
    let orderController = OrderController()
    try app.register(collection: orderController)
 

}
