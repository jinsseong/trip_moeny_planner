import { supabase } from '../supabase/client.js';

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
    const { date } = req.query;
    
    // 모든 참가자 조회
    const { data: users, error: usersError } = await supabase
      .from('participants')
      .select('*')
      .order('name', { ascending: true });
    
    if (usersError) throw usersError;
    
    // 날짜별 지출 조회
    let expensesQuery = supabase
      .from('expenses')
      .select(`
        *,
        expense_participants (
          participant_id,
          participants (
            id,
            name
          )
        )
      `)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });
    
    if (date) {
      expensesQuery = expensesQuery.eq('date', date);
    }
    
    const { data: expenses, error: expensesError } = await expensesQuery;
    
    if (expensesError) throw expensesError;
    
    // 데이터 포맷팅
    const formattedExpenses = expenses.map(expense => {
      const participantIds = expense.expense_participants
        ? expense.expense_participants.map(ep => ep.participant_id)
        : [];
      
      const participantNames = expense.expense_participants
        ? expense.expense_participants
            .map(ep => ep.participants?.name)
            .filter(Boolean)
        : [];
      
      return {
        id: expense.id,
        date: expense.date,
        amount: expense.amount,
        location: expense.location,
        item_name: expense.item_name || '',
        memo: expense.memo || '',
        category: expense.category || '기타',
        created_at: expense.created_at,
        participant_ids: participantIds,
        participant_names: participantNames
      };
    });
    
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
      
      if (expense.participant_ids && expense.participant_ids.length > 0) {
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
    console.error('Supabase Error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.', details: error.message });
  }
}

