import Fluent
import FluentPostgresDriver
import Vapor

// configures your application
public func configure(_ app: Application) throws {
    // uncomment to serve files from /Public folder
    // app.middleware.use(FileMiddleware(publicDirectory: app.directory.publicDirectory))

    app.middleware.use(CORSMiddleware(configuration: .init(
        allowedOrigin: .all,
        allowedMethods: [.GET, .POST, .PUT, .OPTIONS, .DELETE, .PATCH],
        allowedHeaders: [.accept, .authorization, .contentType, .origin, .xRequestedWith, .accessControlAllowOrigin, .acceptPost, .accessControl, .accessControlAllowHeaders ]
    )))
    
    let databaseName : String
    let databasePort : Int
    
    if app.environment == .testing{
        databaseName = "heladosDBTest"
        databasePort = 5433
    }else{
        databaseName = "heladosDB"
        databasePort = 5432
    }
    
    if let url = Environment.get("DATABASE_URL"), var postgresConfig = PostgresConfiguration(url: url) {
        postgresConfig.tlsConfiguration = .forClient(certificateVerification: .none)
        app.databases.use(.postgres(
            configuration: postgresConfig
        ), as: .psql)
    }else{
        app.databases.use(.postgres(
          hostname: Environment.get("DATABASE_HOST")
            ?? "localhost",
          port: databasePort,
          username: Environment.get("DATABASE_USERNAME")
            ?? "admin",
          password: Environment.get("DATABASE_PASSWORD")
            ?? "root",
          database: Environment.get("DATABASE_NAME")
            ?? databaseName
        ), as: .psql)
        
    }
    
    app.logger.logLevel = .debug

    app.migrations.add(CreateAdministrator())
    app.migrations.add(CreateToken())
    app.migrations.add(CreateProduct())
    app.migrations.add(CreateCategory())
    app.migrations.add(CreateHelado())
    app.migrations.add(CreateHeladoCategoryPivot())
    app.migrations.add(CreateFotoProducto())
    app.migrations.add(CreatePrecioProducto())
    app.migrations.add(CreateClient())
    app.migrations.add(CreateClientUser())
    app.migrations.add(CreateTokenClient())
    app.migrations.add(CreateOrder())
    app.migrations.add(CreateOrderDetail())
    app.migrations.add(CreateResetPasswordToken())
    try app.autoMigrate().wait()
        
    app.sendgrid.initialize()


    // register routes
    try routes(app)
}

/**
 docker run --name heladosDB -e POSTGRES_DB=heladosDB \
   -e POSTGRES_USER=admin \
   -e POSTGRES_PASSWORD=root \
   -p 5432:5432 -d postgres
 */
