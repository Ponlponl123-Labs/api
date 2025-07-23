mod v1 {
    pub mod time;
    pub mod ws;
}

use actix_web::web;

pub fn config(conf: &mut web::ServiceConfig) {
    conf.service(
        web::scope("/v1")
            .configure(v1::time::config)
            .route("/ws", web::get().to(v1::ws::echo)),
    );
}