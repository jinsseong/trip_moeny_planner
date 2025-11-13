import { createClient } from '@supabase/supabase-js';

// 서버 사이드와 클라이언트 사이드 모두에서 동작하도록
const getEnvVar = (name) => {
  // Node.js 환경 (서버)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }
  // 브라우저 환경 (클라이언트)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[name];
  }
  return undefined;
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase 환경변수가 설정되지 않았습니다.');
  console.warn('   .env.local 파일에 VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 설정하세요.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

