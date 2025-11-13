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
    
    // GET: 지출 항목 조회 (날짜 필터링 가능)
    if (req.method === 'GET') {
      const { date } = req.query;
      
      let expenses;
      if (date) {
        expenses = db.prepare(`
          SELECT e.*, 
                 GROUP_CONCAT(u.id) as participant_ids,
                 GROUP_CONCAT(u.name) as participant_names
          FROM expenses e
          LEFT JOIN expense_participants ep ON e.id = ep.expense_id
          LEFT JOIN users u ON ep.user_id = u.id
          WHERE e.date = ?
          GROUP BY e.id
          ORDER BY e.created_at DESC
        `).all(date);
      } else {
        expenses = db.prepare(`
          SELECT e.*, 
                 GROUP_CONCAT(u.id) as participant_ids,
                 GROUP_CONCAT(u.name) as participant_names
          FROM expenses e
          LEFT JOIN expense_participants ep ON e.id = ep.expense_id
          LEFT JOIN users u ON ep.user_id = u.id
          GROUP BY e.id
          ORDER BY e.date DESC, e.created_at DESC
        `).all();
      }
      
      // participant_ids와 participant_names를 배열로 변환
      const formattedExpenses = expenses.map(expense => ({
        ...expense,
        participant_ids: expense.participant_ids 
          ? expense.participant_ids.split(',').map(Number)
          : [],
        participant_names: expense.participant_names 
          ? expense.participant_names.split(',')
          : []
      }));
      
      return res.status(200).json(formattedExpenses);
    }
    
    // POST: 새 지출 항목 추가
    if (req.method === 'POST') {
      const { date, amount, location, memo, category, participant_ids } = req.body;
      
      if (!date || !amount || !participant_ids || participant_ids.length === 0) {
        return res.status(400).json({ error: '날짜, 금액, 참여자는 필수입니다.' });
      }
      
      const insertExpense = db.prepare(`
        INSERT INTO expenses (date, amount, location, memo, category)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      const insertParticipant = db.prepare(`
        INSERT INTO expense_participants (expense_id, user_id)
        VALUES (?, ?)
      `);
      
      const expenseId = db.transaction(() => {
        const result = insertExpense.run(
          date,
          amount,
          location || null,
          memo || null,
          category || '기타'
        );
        
        const expenseId = result.lastInsertRowid;
        
        for (const userId of participant_ids) {
          insertParticipant.run(expenseId, userId);
        }
        
        return expenseId;
      });
      
      // 생성된 지출 항목 조회
      const expense = db.prepare(`
        SELECT e.*, 
               GROUP_CONCAT(u.id) as participant_ids,
               GROUP_CONCAT(u.name) as participant_names
        FROM expenses e
        LEFT JOIN expense_participants ep ON e.id = ep.expense_id
        LEFT JOIN users u ON ep.user_id = u.id
        WHERE e.id = ?
        GROUP BY e.id
      `).get(expenseId);
      
      if (!expense) {
        return res.status(500).json({ error: '지출 항목을 찾을 수 없습니다.' });
      }
      
      const formattedExpense = {
        ...expense,
        participant_ids: expense.participant_ids 
          ? expense.participant_ids.split(',').map(Number)
          : [],
        participant_names: expense.participant_names 
          ? expense.participant_names.split(',')
          : []
      };
      
      return res.status(201).json(formattedExpense);
    }
    
    // PUT: 지출 항목 수정
    if (req.method === 'PUT') {
      const { id, date, amount, location, memo, category, participant_ids } = req.body;
      
      if (!id || !date || !amount || !participant_ids || participant_ids.length === 0) {
        return res.status(400).json({ error: 'ID, 날짜, 금액, 참여자는 필수입니다.' });
      }
      
      const updateExpense = db.prepare(`
        UPDATE expenses 
        SET date = ?, amount = ?, location = ?, memo = ?, category = ?
        WHERE id = ?
      `);
      
      const deleteParticipants = db.prepare('DELETE FROM expense_participants WHERE expense_id = ?');
      const insertParticipant = db.prepare(`
        INSERT INTO expense_participants (expense_id, user_id)
        VALUES (?, ?)
      `);
      
      db.transaction(() => {
        updateExpense.run(date, amount, location || null, memo || null, category || '기타', id);
        deleteParticipants.run(id);
        
        for (const userId of participant_ids) {
          insertParticipant.run(id, userId);
        }
      });
      
      // 수정된 지출 항목 조회
      const expense = db.prepare(`
        SELECT e.*, 
               GROUP_CONCAT(u.id) as participant_ids,
               GROUP_CONCAT(u.name) as participant_names
        FROM expenses e
        LEFT JOIN expense_participants ep ON e.id = ep.expense_id
        LEFT JOIN users u ON ep.user_id = u.id
        WHERE e.id = ?
        GROUP BY e.id
      `).get(id);
      
      const formattedExpense = {
        ...expense,
        participant_ids: expense.participant_ids 
          ? expense.participant_ids.split(',').map(Number)
          : [],
        participant_names: expense.participant_names 
          ? expense.participant_names.split(',')
          : []
      };
      
      return res.status(200).json(formattedExpense);
    }
    
    // DELETE: 지출 항목 삭제
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'ID는 필수입니다.' });
      }
      
      db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
      return res.status(200).json({ message: '지출 항목이 삭제되었습니다.' });
    }
    
    return res.status(405).json({ error: '지원하지 않는 메서드입니다.' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

