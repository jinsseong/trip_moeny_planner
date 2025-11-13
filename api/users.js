import { initDatabase, getDatabase } from '../database/json-db.js';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const db = getDatabase();
    
    // GET: 모든 사용자 조회
    if (req.method === 'GET') {
      const users = db.prepare('SELECT * FROM users ORDER BY name').all();
      return res.status(200).json(users);
    }
    
    // POST: 새 사용자 추가
    if (req.method === 'POST') {
      const { name } = req.body;
      
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: '이름은 필수입니다.' });
      }
      
      try {
        const result = db.prepare('INSERT INTO users (name) VALUES (?)').run(name.trim());
        const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
        return res.status(201).json(newUser);
      } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(400).json({ error: '이미 존재하는 이름입니다.' });
        }
        throw error;
      }
    }
    
    // PUT: 사용자 수정
    if (req.method === 'PUT') {
      const { id, name } = req.body;
      
      if (!id || !name || name.trim() === '') {
        return res.status(400).json({ error: 'ID와 이름은 필수입니다.' });
      }
      
      try {
        db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name.trim(), id);
        const updatedUser = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
        return res.status(200).json(updatedUser);
      } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(400).json({ error: '이미 존재하는 이름입니다.' });
        }
        throw error;
      }
    }
    
    // DELETE: 사용자 삭제
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'ID는 필수입니다.' });
      }
      
      db.prepare('DELETE FROM users WHERE id = ?').run(id);
      return res.status(200).json({ message: '사용자가 삭제되었습니다.' });
    }
    
    return res.status(405).json({ error: '지원하지 않는 메서드입니다.' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

