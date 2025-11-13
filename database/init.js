import Database from 'better-sqlite3';
import { existsSync } from 'fs';
import { join } from 'path';
import { mkdirSync } from 'fs';

// Vercel serverless 환경에서는 /tmp 디렉토리 사용
// 로컬 개발 환경에서는 data 디렉토리 사용
const isVercel = process.env.VERCEL === '1';
const dbDir = isVercel ? '/tmp' : join(process.cwd(), 'data');
const dbPath = join(dbDir, 'expenses.db');

// 데이터 디렉토리 생성 (로컬 환경에서만)
if (!isVercel) {
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true });
  }
}

export function initDatabase() {
  const db = new Database(dbPath);
  
  // 사용자 테이블
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // 지출 항목 테이블
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      amount INTEGER NOT NULL,
      location TEXT,
      memo TEXT,
      category TEXT DEFAULT '기타',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // 지출-사용자 연결 테이블 (다대다 관계)
  db.exec(`
    CREATE TABLE IF NOT EXISTS expense_participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      expense_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (expense_id) REFERENCES expenses(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(expense_id, user_id)
    )
  `);
  
  return db;
}

export function getDatabase() {
  return new Database(dbPath);
}

