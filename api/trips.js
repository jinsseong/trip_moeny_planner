import { createClient } from '@supabase/supabase-js';

// Vercel 서버리스 함수 형식
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
    console.error('Supabase 환경변수 누락:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseKey,
      envKeys: Object.keys(process.env).filter(k => k.includes('SUPABASE'))
    });
    return res.status(500).json({ 
      error: 'Supabase 환경변수가 설정되지 않았습니다.',
      details: 'Vercel 대시보드에서 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 확인하세요.'
    });
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // GET: 여행 목록 조회
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });
      
      // 테이블이 없거나 오류가 발생하면 빈 배열 반환
      if (error) {
        // 테이블이 없는 경우 (42P01: relation does not exist)
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.warn('trips 테이블이 아직 생성되지 않았습니다. schema_trips.sql을 실행하세요.');
          return res.status(200).json([]);
        }
        throw error;
      }
      
      return res.status(200).json(data || []);
    }
    
    // POST: 새 여행 추가
    if (req.method === 'POST') {
      const { name, description, start_date, end_date } = req.body;
      
      if (!name) {
        return res.status(400).json({ error: '여행 이름은 필수입니다.' });
      }
      
      const { data, error } = await supabase
        .from('trips')
        .insert([
          {
            name,
            description: description || null,
            start_date: start_date || null,
            end_date: end_date || null
          }
        ])
        .select()
        .single();
      
      if (error) throw error;
      
      return res.status(201).json(data);
    }
    
    // PUT: 여행 수정
    if (req.method === 'PUT') {
      const { id, name, description, start_date, end_date } = req.body;
      
      if (!id || !name) {
        return res.status(400).json({ error: 'ID와 여행 이름은 필수입니다.' });
      }
      
      const { data, error } = await supabase
        .from('trips')
        .update({
          name,
          description: description || null,
          start_date: start_date || null,
          end_date: end_date || null
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return res.status(200).json(data);
    }
    
    // DELETE: 여행 삭제
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'ID는 필수입니다.' });
      }
      
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return res.status(200).json({ message: '여행이 삭제되었습니다.' });
    }
    
    return res.status(405).json({ error: '지원하지 않는 메서드입니다.' });
  } catch (error) {
    console.error('Supabase Error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.', details: error.message });
  }
}

