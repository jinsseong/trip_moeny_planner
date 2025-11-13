import { getDatabase } from '../database/json-db.js';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: '지원하지 않는 메서드입니다.' });
  }
  
  try {
    const db = getDatabase();
    const { date } = req.query;
    
    // 모든 사용자 조회
    const users = db.prepare('SELECT * FROM users ORDER BY name').all();
    
    // 날짜별 지출 조회
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
    
    // 사용자별 부담 금액 계산
    const userTotals = {};
    let totalAmount = 0;
    
    users.forEach(user => {
      userTotals[user.id] = {
        id: user.id,
        name: user.name,
        amount: 0
      };
    });
    
    formattedExpenses.forEach(expense => {
      totalAmount += expense.amount;
      
      if (expense.participant_ids.length > 0) {
        const perPerson = Math.floor(expense.amount / expense.participant_ids.length);
        const remainder = expense.amount % expense.participant_ids.length;
        
        // 나머지는 첫 번째 참여자에게 추가
        expense.participant_ids.forEach((userId, index) => {
          if (userTotals[userId]) {
            userTotals[userId].amount += perPerson + (index === 0 ? remainder : 0);
          }
        });
      }
    });
    
    const userTotalsArray = Object.values(userTotals);
    
    return res.status(200).json({
      date: date || '전체',
      totalAmount,
      userTotals: userTotalsArray,
      expenses: formattedExpenses
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
}

