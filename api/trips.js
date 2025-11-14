import { supabase } from '../supabase/client.js';

export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // GET: 여행 목록 조회
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
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

