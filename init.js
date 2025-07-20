import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const DB_FILE = './db/logistics.db';
const SCHEMA_FILE = '../../database/schema.sql';
const SEED_FILE = '../../database/seed.sql';

export function initDb() {
  const dbDir = path.dirname(DB_FILE);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new Database(DB_FILE);
  console.log('Connected to the SQLite database.');

  // Check if tables exist to prevent re-seeding
  const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();

  if (!tableCheck) {
    console.log('Database is empty. Initializing schema and seeding data...');
    const schema = fs.readFileSync(path.resolve(import.meta.dirname, SCHEMA_FILE), 'utf8');
    db.exec(schema);
    const seed = fs.readFileSync(path.resolve(import.meta.dirname, SEED_FILE), 'utf8');
    db.exec(seed);
    console.log('Database initialized successfully.');
  }

  return db;
}

