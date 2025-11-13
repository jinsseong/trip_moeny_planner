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
    // GET: 모든 참가자 조회
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('participants')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      
      // UUID를 문자열로 변환하여 기존 코드와 호환
      const formattedData = data.map(p => ({
        id: p.id,
        name: p.name,
        avatar_color: p.avatar_color,
        created_at: p.created_at
      }));
      
      return res.status(200).json(formattedData);
    }
    
    // POST: 새 참가자 추가
    if (req.method === 'POST') {
      const { name, avatar_color } = req.body;
      
      if (!name || name.trim() === '') {
        return res.status(400).json({ error: '이름은 필수입니다.' });
      }
      
      const { data, error } = await supabase
        .from('participants')
        .insert([
          {
            name: name.trim(),
            avatar_color: avatar_color || '#4a90e2'
          }
        ])
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') { // Unique violation
          return res.status(400).json({ error: '이미 존재하는 이름입니다.' });
        }
        throw error;
      }
      
      return res.status(201).json({
        id: data.id,
        name: data.name,
        avatar_color: data.avatar_color,
        created_at: data.created_at
      });
    }
    
    // PUT: 참가자 수정
    if (req.method === 'PUT') {
      const { id, name, avatar_color } = req.body;
      
      if (!id || !name || name.trim() === '') {
        return res.status(400).json({ error: 'ID와 이름은 필수입니다.' });
      }
      
      const { data, error } = await supabase
        .from('participants')
        .update({
          name: name.trim(),
          avatar_color: avatar_color || '#4a90e2'
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        if (error.code === '23505') {
          return res.status(400).json({ error: '이미 존재하는 이름입니다.' });
        }
        throw error;
      }
      
      if (!data) {
        return res.status(404).json({ error: '참가자를 찾을 수 없습니다.' });
      }
      
      return res.status(200).json({
        id: data.id,
        name: data.name,
        avatar_color: data.avatar_color,
        created_at: data.created_at
      });
    }
    
    // DELETE: 참가자 삭제
    if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({ error: 'ID는 필수입니다.' });
      }
      
      const { error } = await supabase
        .from('participants')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return res.status(200).json({ message: '참가자가 삭제되었습니다.' });
    }
    
    return res.status(405).json({ error: '지원하지 않는 메서드입니다.' });
  } catch (error) {
    console.error('Supabase Error:', error);
    return res.status(500).json({ error: '서버 오류가 발생했습니다.', details: error.message });
  }
}

