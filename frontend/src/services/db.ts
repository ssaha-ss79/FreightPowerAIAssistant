import initSqlJs, { Database } from 'sql.js';

// sql.js needs to fetch a .wasm file, so we configure the path here.
// This file needs to be in the `public` folder of your Vite project.
const SQL_WASM_PATH = '/sql-wasm.wasm';

let dbInstance: Database | null = null;

export const initDb = async (): Promise<Database> => {
  if (dbInstance) {
    return dbInstance;
  }

  const SQL = await initSqlJs({ locateFile: () => SQL_WASM_PATH });
  const db = new SQL.Database();

  // Fetch and execute schema and seed SQL files
  const schemaRes = await fetch('/schema.sql');
  const schemaSql = await schemaRes.text();
  db.exec(schemaSql);

  const seedRes = await fetch('/seed.sql');
  const seedSql = await seedRes.text();
  db.exec(seedSql);

  dbInstance = db;
  return db;
};

