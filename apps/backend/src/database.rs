use sqlx::{postgres::PgPoolOptions, PgPool};
use std::time::Duration;

/// データベース接続プールを作成
pub async fn create_pool() -> Result<PgPool, sqlx::Error> {
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "postgresql://blog_user:blog_password@localhost:5432/blog_dev".to_string());

    let pool = PgPoolOptions::new()
        .max_connections(10)
        .min_connections(1)
        .acquire_timeout(Duration::from_secs(3))
        .idle_timeout(Duration::from_secs(300))
        .max_lifetime(Duration::from_secs(1800))
        .connect(&database_url)
        .await?;

    tracing::info!("✅ Database connection pool created successfully");
    tracing::info!("📊 Database URL: {}", mask_password(&database_url));

    Ok(pool)
}

/// データベース接続をテスト
pub async fn test_connection(pool: &PgPool) -> Result<(), sqlx::Error> {
    let result: (i32,) = sqlx::query_as("SELECT 1")
        .fetch_one(pool)
        .await?;

    tracing::info!("✅ Database connection test passed: {}", result.0);
    Ok(())
}

/// パスワードをマスクする（ログ用）
fn mask_password(url: &str) -> String {
    if let Some(start) = url.find("://") {
        if let Some(end) = url[start + 3..].find('@') {
            let prefix = &url[..start + 3];
            let user_part = &url[start + 3..start + 3 + end];
            let suffix = &url[start + 3 + end..];
            
            if let Some(colon_pos) = user_part.find(':') {
                let user = &user_part[..colon_pos];
                return format!("{}{}:****{}", prefix, user, suffix);
            }
        }
    }
    url.to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_mask_password() {
        let url = "postgresql://blog_user:blog_password@localhost:5432/blog_dev";
        let masked = mask_password(url);
        assert_eq!(masked, "postgresql://blog_user:****@localhost:5432/blog_dev");
    }
}

