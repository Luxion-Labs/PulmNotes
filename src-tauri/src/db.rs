use rusqlite::{Connection, Result};
use std::path::PathBuf;
use std::sync::Mutex;

pub struct Database {
    conn: Mutex<Connection>,
}

impl Database {
    pub fn new(db_path: PathBuf) -> Result<Self> {
        let conn = Connection::open(db_path)?;
        let db = Database {
            conn: Mutex::new(conn),
        };
        db.init_tables()?;
        Ok(db)
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
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT OR REPLACE INTO notes (id, data) VALUES ('notes', ?1)",
            [data],
        )?;
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
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT OR REPLACE INTO categories (id, data) VALUES ('categories', ?1)",
            [data],
        )?;
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
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT OR REPLACE INTO subcategories (id, data) VALUES ('subcategories', ?1)",
            [data],
        )?;
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
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT OR REPLACE INTO assets (id, data) VALUES ('assets', ?1)",
            [data],
        )?;
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
        let conn = self.conn.lock().unwrap();
        conn.execute(
            "INSERT OR REPLACE INTO reflections (id, data) VALUES ('reflections', ?1)",
            [data],
        )?;
        Ok(())
    }

    pub fn get_database_size(&self, db_path: &std::path::Path) -> Result<u64> {
        match std::fs::metadata(db_path) {
            Ok(metadata) => Ok(metadata.len()),
            Err(_) => Ok(0),
        }
    }
}
