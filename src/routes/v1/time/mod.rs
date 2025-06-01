use std::time::{SystemTime, UNIX_EPOCH};

use actix_web::{
    get, web, HttpResponse
};

#[get("/time")]
pub async fn get_current_time() -> HttpResponse {
    let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap();
    HttpResponse::Ok().body(format!("{}", now.as_secs()))
}

pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(get_current_time);
}