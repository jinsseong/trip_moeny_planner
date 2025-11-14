import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Supabase 클라이언트 초기화 (Vercel 환경변수 사용)
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase 환경변수 누락');
    return res.status(500).json({ 
      error: 'Supabase 환경변수가 설정되지 않았습니다.',
      details: 'Vercel 대시보드에서 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 확인하세요.'
    });
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // GET: 지출 항목 조회 (날짜, trip_id 필터링 가능)
    if (req.method === 'GET') {
      const { date, trip_id } = req.query;
      
      let query = supabase
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
        query = query.eq('date', date);
      }
      
      if (trip_id) {
        query = query.eq('trip_id', trip_id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // 데이터 포맷팅 (기존 API 형식과 호환)
      const formattedExpenses = data.map(expense => {
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
          item_name: expense.item_name || '', // 항목명 (별도 필드)
          memo: expense.memo || '', // 메모 (별도 필드)
          category: expense.category || '기타',
          trip_id: expense.trip_id || null,
          created_at: expense.created_at,
          participant_ids: participantIds,
          participant_names: participantNames
        };
      });
      
      return res.status(200).json(formattedExpenses);
    }
    
    // POST: 새 지출 항목 추가
    if (req.method === 'POST') {
      const { date, amount, location, item_name, memo, category, participant_ids, trip_id } = req.body;
      
      if (!date || !amount || !participant_ids || participant_ids.length === 0) {
        return res.status(400).json({ error: '날짜, 금액, 참여자는 필수입니다.' });
      }
      
      // 지출 항목 추가
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .insert([
          {
            date,
            amount: parseInt(amount),
            location: location || null,
            item_name: item_name || null,
            memo: memo || null,
            category: category || '기타',
            trip_id: trip_id || null
          }
        ])
        .select()
        .single();
      
      if (expenseError) throw expenseError;
      
      // 참가자 연결 추가
      if (participant_ids.length > 0) {
        const expenseParticipants = participant_ids.map(participantId => ({
          expense_id: expenseData.id,
          participant_id: participantId
        }));
        
        const { error: participantError } = await supabase
          .from('expense_participants')
          .insert(expenseParticipants);
        
        if (participantError) throw participantError;
      }
      
      // 생성된 지출 항목 조회 (참가자 정보 포함)
      const { data: fullExpense, error: fetchError } = await supabase
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
        .eq('id', expenseData.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      const participantIds = fullExpense.expense_participants
        ? fullExpense.expense_participants.map(ep => ep.participant_id)
        : [];
      
      const participantNames = fullExpense.expense_participants
        ? fullExpense.expense_participants
            .map(ep => ep.participants?.name)
            .filter(Boolean)
        : [];
      
      return res.status(201).json({
        id: fullExpense.id,
        date: fullExpense.date,
        amount: fullExpense.amount,
        location: fullExpense.location,
        item_name: fullExpense.item_name || '',
        memo: fullExpense.memo || '',
        category: fullExpense.category || '기타',
        trip_id: fullExpense.trip_id || null,
        created_at: fullExpense.created_at,
        participant_ids: participantIds,
        participant_names: participantNames
      });
    }
    
    // PUT: 지출 항목 수정
    if (req.method === 'PUT') {
      const { id, date, amount, location, item_name, memo, category, participant_ids, trip_id } = req.body;
      
      if (!id || !date || !amount || !participant_ids || participant_ids.length === 0) {
        return res.status(400).json({ error: 'ID, 날짜, 금액, 참여자는 필수입니다.' });
      }
      
      // 지출 항목 수정
      const updateData = {
        date,
        amount: parseInt(amount),
        location: location || null,
        item_name: item_name || null,
        memo: memo || null,
        category: category || '기타'
      };
      
      if (trip_id !== undefined) {
        updateData.trip_id = trip_id || null;
      }
      
      const { error: updateError } = await supabase
        .from('expenses')
        .update(updateData)
        .eq('id', id);
      
      if (updateError) throw updateError;
      
      // 기존 참가자 연결 삭제
      const { error: deleteError } = await supabase
        .from('expense_participants')
        .delete()
        .eq('expense_id', id);
      
      if (deleteError) throw deleteError;
      
      // 새로운 참가자 연결 추가
      if (participant_ids.length > 0) {
        const expenseParticipants = participant_ids.map(participantId => ({
          expense_id: id,
          participant_id: participantId
        }));
        
        const { error: insertError } = await supabase
          .from('expense_participants')
          .insert(expenseParticipants);
        
        if (insertError) throw insertError;
      }
      
      // 수정된 지출 항목 조회
      const { data: fullExpense, error: fetchError } = await supabase
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
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('Fetch error:', fetchError);
        // expense가 null일 수 있으므로 안전하게 처리
        return res.status(500).json({ 
          error: '지출 항목을 조회할 수 없습니다.',
          details: fetchError.message 
        });
      }
      
      // fullExpense가 null인 경우 처리
      if (!fullExpense) {
        return res.status(500).json({ 
          error: '지출 항목을 찾을 수 없습니다.' 
        });
      }
      
      const participantIds = fullExpense.expense_participants
        ? fullExpense.expense_participants.map(ep => ep.participant_id)
        : [];
      
      const participantNames = fullExpense.expense_participants
        ? fullExpense.expense_participants
            .map(ep => ep.participants?.name)
            .filter(Boolean)
        : [];
      
      return res.status(200).json({
        id: fullExpense.id,
        date: fullExpense.date,
        amount: fullExpense.amount,
        location: fullExpense.location,
        item_name: fullExpense.item_name || '',
        memo: fullExpense.memo || '',
        category: fullExpense.category || '기타',
        trip_id: fullExpense.trip_id || null,
        created_at: fullExpense.created_at,
        participant_ids: participantIds,
        participant_names: participantNames
      });
    }
    
    // DELETE: 지출 항목 삭제
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'ID는 필수입니다.' });
      }
      
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return res.status(200).json({ message: '지출 항목이 삭제되었습니다.' });
    }
    
    return res.status(405).json({ error: '지원하지 않는 메서드입니다.' });
  } catch (error) {
    console.error('Supabase Error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    });
    return res.status(500).json({ 
      error: '서버 오류가 발생했습니다.', 
      details: error.message,
      code: error.code,
      hint: error.hint || 'Vercel 로그를 확인하세요.'
    });
  }
}
