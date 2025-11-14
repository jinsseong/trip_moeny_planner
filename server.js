import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import { resolve } from 'path';
import { initDatabase } from './database/json-db.js';

// API 라우트 import
import usersHandler from './api/users.js';
import expensesHandler from './api/expenses.js';
import calculateHandler from './api/calculate.js';
import initDbHandler from './api/init-db.js';
import participantsHandler from './api/participants.js';
import expensesSupabaseHandler from './api/expenses-supabase.js';
import calculateSupabaseHandler from './api/calculate-supabase.js';
import tripsHandler from './api/trips.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// 환경변수 로드 (dotenv 사용)
// .env.local 파일 로드
config({ path: resolve(process.cwd(), '.env.local') });

// Supabase 연결 확인
const useSupabase = process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY;

if (!useSupabase) {
  initDatabase();
}

if (useSupabase) {
  console.log('✅ Supabase 연결 모드로 실행됩니다.');
  app.use('/api/users', (req, res) => participantsHandler(req, res));
  app.use('/api/participants', (req, res) => participantsHandler(req, res));
  app.use('/api/expenses', (req, res) => expensesSupabaseHandler(req, res));
  app.use('/api/calculate', (req, res) => calculateSupabaseHandler(req, res));
  app.use('/api/trips', (req, res) => tripsHandler(req, res));
} else {
  console.log('⚠️ JSON 파일 모드로 실행됩니다. Supabase 환경변수를 설정하세요.');
  app.use('/api/users', (req, res) => usersHandler(req, res));
  app.use('/api/expenses', (req, res) => expensesHandler(req, res));
  app.use('/api/calculate', (req, res) => calculateHandler(req, res));
  app.use('/api/init-db', (req, res) => initDbHandler(req, res));
}

// SPA 라우팅
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
});

