use rusqlite::{Connection, Result};
use std::path::PathBuf;
use std::sync::Mutex;

const SCHEMA_VERSION: i32 = 1;

pub struct Database {
    conn: Mutex<Connection>,
}

impl Database {
    pub fn new(db_path: PathBuf) -> Result<Self> {
        let conn = Connection::open(db_path)?;
        
        conn.pragma_update(None, "journal_mode", "WAL")?;
        conn.pragma_update(None, "synchronous", "NORMAL")?;
        
        let db = Database {
            conn: Mutex::new(conn),
        };
        
        db.check_schema_version()?;
        db.init_tables()?;
        
        Ok(db)
    }
    
    fn check_schema_version(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();
        
        // Read current schema version from database
        let current_version: i32 = conn
            .pragma_query_value(None, "user_version", |row| row.get(0))
            .unwrap_or(0);
        
        if current_version == 0 {
            
            conn.pragma_update(None, "user_version", SCHEMA_VERSION)?;
            eprintln!("Initialized new database with schema version {}", SCHEMA_VERSION);
        } else if current_version > SCHEMA_VERSION {
            return Err(rusqlite::Error::InvalidQuery);
        } else if current_version < SCHEMA_VERSION {
            eprintln!(
                "Database schema version {} is older than app version {}. Migrations not yet implemented.",
                current_version, SCHEMA_VERSION
            );
            return Err(rusqlite::Error::InvalidQuery);
        }
        
        Ok(())
    }

    fn init_tables(&self) -> Result<()> {
        let conn = self.conn.lock().unwrap();

        conn.execute(
            "CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                data TEXT NOT NULL
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS categories (
                id TEXT PRIMARY KEY,
                data TEXT NOT NULL
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS subcategories (
                id TEXT PRIMARY KEY,
                data TEXT NOT NULL
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS assets (
                id TEXT PRIMARY KEY,
                data TEXT NOT NULL
            )",
            [],
        )?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS reflections (
                id TEXT PRIMARY KEY,
                data TEXT NOT NULL
            )",
            [],
        )?;

        Ok(())
    }

    pub fn load_notes(&self) -> Result<String> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT data FROM notes WHERE id = 'notes'")?;
        let result = stmt.query_row([], |row| row.get(0));
        
        match result {
            Ok(data) => Ok(data),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok("[]".to_string()),
            Err(e) => Err(e),
        }
    }

    pub fn save_notes(&self, data: String) -> Result<()> {
        let mut conn = self.conn.lock().unwrap();
        let tx = conn.transaction()?;
        tx.execute(
            "INSERT OR REPLACE INTO notes (id, data) VALUES ('notes', ?1)",
            [data],
        )?;
        tx.commit()?;
        Ok(())
    }

    pub fn load_categories(&self) -> Result<String> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT data FROM categories WHERE id = 'categories'")?;
        let result = stmt.query_row([], |row| row.get(0));
        
        match result {
            Ok(data) => Ok(data),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok("[]".to_string()),
            Err(e) => Err(e),
        }
    }

    pub fn save_categories(&self, data: String) -> Result<()> {
        let mut conn = self.conn.lock().unwrap();
        let tx = conn.transaction()?;
        tx.execute(
            "INSERT OR REPLACE INTO categories (id, data) VALUES ('categories', ?1)",
            [data],
        )?;
        tx.commit()?;
        Ok(())
    }

    pub fn load_subcategories(&self) -> Result<String> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT data FROM subcategories WHERE id = 'subcategories'")?;
        let result = stmt.query_row([], |row| row.get(0));
        
        match result {
            Ok(data) => Ok(data),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok("[]".to_string()),
            Err(e) => Err(e),
        }
    }

    pub fn save_subcategories(&self, data: String) -> Result<()> {
        let mut conn = self.conn.lock().unwrap();
        let tx = conn.transaction()?;
        tx.execute(
            "INSERT OR REPLACE INTO subcategories (id, data) VALUES ('subcategories', ?1)",
            [data],
        )?;
        tx.commit()?;
        Ok(())
    }

    pub fn load_assets(&self) -> Result<String> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT data FROM assets WHERE id = 'assets'")?;
        let result = stmt.query_row([], |row| row.get(0));
        
        match result {
            Ok(data) => Ok(data),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok("[]".to_string()),
            Err(e) => Err(e),
        }
    }

    pub fn save_assets(&self, data: String) -> Result<()> {
        let mut conn = self.conn.lock().unwrap();
        let tx = conn.transaction()?;
        tx.execute(
            "INSERT OR REPLACE INTO assets (id, data) VALUES ('assets', ?1)",
            [data],
        )?;
        tx.commit()?;
        Ok(())
    }

    pub fn load_reflections(&self) -> Result<String> {
        let conn = self.conn.lock().unwrap();
        let mut stmt = conn.prepare("SELECT data FROM reflections WHERE id = 'reflections'")?;
        let result = stmt.query_row([], |row| row.get(0));
        
        match result {
            Ok(data) => Ok(data),
            Err(rusqlite::Error::QueryReturnedNoRows) => Ok("[]".to_string()),
            Err(e) => Err(e),
        }
    }

    pub fn save_reflections(&self, data: String) -> Result<()> {
        let mut conn = self.conn.lock().unwrap();
        let tx = conn.transaction()?;
        tx.execute(
            "INSERT OR REPLACE INTO reflections (id, data) VALUES ('reflections', ?1)",
            [data],
        )?;
        tx.commit()?;
        Ok(())
    }

    pub fn get_database_size(&self, db_path: &std::path::Path) -> Result<u64> {
        match std::fs::metadata(db_path) {
            Ok(metadata) => Ok(metadata.len()),
            Err(_) => Ok(0),
        }
    }
}
