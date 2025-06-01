mod routes;

use serde::Serialize;
use actix_web::{get, App, HttpResponse, HttpServer, Responder};

#[derive(Serialize)]
struct MyObj {
    hello: String,
}

#[get("/")]
async fn hello(req: actix_web::HttpRequest) -> impl Responder {
    let obj = MyObj {
        hello: req.headers().get("user-agent").unwrap().to_str().unwrap().to_string(),
    };

    HttpResponse::Ok().json(obj)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        App::new()
            .service(hello)
            .configure(routes::config)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}