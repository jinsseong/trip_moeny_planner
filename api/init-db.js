import { initDatabase } from '../database/json-db.js';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '지원하지 않는 메서드입니다.' });
  }
  
  try {
    initDatabase();
    return res.status(200).json({ message: '데이터베이스가 초기화되었습니다.' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: '데이터베이스 초기화 중 오류가 발생했습니다.' });
  }
}

