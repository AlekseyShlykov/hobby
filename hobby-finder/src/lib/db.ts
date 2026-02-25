import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'results.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    // Ensure data directory exists
    const fs = require('fs');
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    db = new Database(dbPath);
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS test_results (
      id TEXT PRIMARY KEY,
      ocean_o REAL NOT NULL,
      ocean_c REAL NOT NULL,
      ocean_e REAL NOT NULL,
      ocean_a REAL NOT NULL,
      ocean_n REAL NOT NULL,
      riasec_r REAL NOT NULL,
      riasec_i REAL NOT NULL,
      riasec_art REAL NOT NULL,
      riasec_s REAL NOT NULL,
      riasec_ent REAL NOT NULL,
      riasec_con REAL NOT NULL,
      context_time TEXT,
      context_budget TEXT,
      context_activity TEXT,
      recommended_hobbies TEXT NOT NULL,
      answers TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `);
}

export interface DbTestResult {
  id: string;
  ocean_o: number;
  ocean_c: number;
  ocean_e: number;
  ocean_a: number;
  ocean_n: number;
  riasec_r: number;
  riasec_i: number;
  riasec_art: number;
  riasec_s: number;
  riasec_ent: number;
  riasec_con: number;
  context_time: string;
  context_budget: string;
  context_activity: string;
  recommended_hobbies: string;
  answers: string;
  created_at: string;
}

export function saveResult(result: DbTestResult): void {
  const db = getDb();
  const stmt = db.prepare(`
    INSERT INTO test_results (
      id, ocean_o, ocean_c, ocean_e, ocean_a, ocean_n,
      riasec_r, riasec_i, riasec_art, riasec_s, riasec_ent, riasec_con,
      context_time, context_budget, context_activity,
      recommended_hobbies, answers, created_at
    ) VALUES (
      @id, @ocean_o, @ocean_c, @ocean_e, @ocean_a, @ocean_n,
      @riasec_r, @riasec_i, @riasec_art, @riasec_s, @riasec_ent, @riasec_con,
      @context_time, @context_budget, @context_activity,
      @recommended_hobbies, @answers, @created_at
    )
  `);
  stmt.run(result);
}

export function getResult(id: string): DbTestResult | undefined {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM test_results WHERE id = ?');
  return stmt.get(id) as DbTestResult | undefined;
}

export function getAllResults(): DbTestResult[] {
  const db = getDb();
  const stmt = db.prepare('SELECT * FROM test_results ORDER BY created_at DESC');
  return stmt.all() as DbTestResult[];
}
