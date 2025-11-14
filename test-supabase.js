// Supabase 연결 테스트 스크립트
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// 환경변수 로드
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Supabase 연결 테스트 시작...\n');

// 환경변수 확인
console.log('1. 환경변수 확인:');
console.log('   VITE_SUPABASE_URL:', supabaseUrl ? '✅ 설정됨' : '❌ 없음');
console.log('   VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅ 설정됨' : '❌ 없음');

if (!supabaseUrl || !supabaseKey) {
  console.error('\n❌ 환경변수가 설정되지 않았습니다.');
  console.error('   .env.local 파일에 다음을 추가하세요:');
  console.error('   VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('   VITE_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseKey);

// 테스트 함수
async function testConnection() {
  console.log('\n2. Supabase 연결 테스트:');
  
  try {
    // 참가자 테이블 조회
    console.log('   - participants 테이블 조회 중...');
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('*')
      .limit(5);
    
    if (participantsError) {
      console.error('   ❌ participants 테이블 오류:', participantsError.message);
      if (participantsError.code === '42P01') {
        console.error('   💡 테이블이 없습니다. schema.sql을 실행하세요.');
      }
    } else {
      console.log('   ✅ participants 테이블 연결 성공');
      console.log('   📊 데이터 개수:', participants?.length || 0);
    }
    
    // 지출 테이블 조회
    console.log('   - expenses 테이블 조회 중...');
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .limit(5);
    
    if (expensesError) {
      console.error('   ❌ expenses 테이블 오류:', expensesError.message);
      if (expensesError.code === '42P01') {
        console.error('   💡 테이블이 없습니다. schema.sql을 실행하세요.');
      }
    } else {
      console.log('   ✅ expenses 테이블 연결 성공');
      console.log('   📊 데이터 개수:', expenses?.length || 0);
    }
    
    // 여행 테이블 조회
    console.log('   - trips 테이블 조회 중...');
    const { data: trips, error: tripsError } = await supabase
      .from('trips')
      .select('*')
      .limit(5);
    
    if (tripsError) {
      console.error('   ❌ trips 테이블 오류:', tripsError.message);
      if (tripsError.code === '42P01') {
        console.error('   💡 테이블이 없습니다. schema_trips.sql을 실행하세요.');
      }
    } else {
      console.log('   ✅ trips 테이블 연결 성공');
      console.log('   📊 데이터 개수:', trips?.length || 0);
    }
    
    // 테스트 데이터 추가 (선택사항)
    console.log('\n3. 데이터 추가 테스트:');
    console.log('   - 테스트 참가자 추가 중...');
    const { data: newParticipant, error: insertError } = await supabase
      .from('participants')
      .insert([{ name: '테스트 사용자' }])
      .select()
      .single();
    
    if (insertError) {
      console.error('   ❌ 데이터 추가 실패:', insertError.message);
      if (insertError.code === '42501') {
        console.error('   💡 RLS 정책 문제입니다. schema.sql의 RLS 정책을 확인하세요.');
      }
    } else {
      console.log('   ✅ 데이터 추가 성공:', newParticipant.name);
      
      // 테스트 데이터 삭제
      await supabase
        .from('participants')
        .delete()
        .eq('id', newParticipant.id);
      console.log('   🗑️  테스트 데이터 삭제 완료');
    }
    
    console.log('\n✅ 모든 테스트 완료!');
    
  } catch (error) {
    console.error('\n❌ 테스트 중 오류 발생:', error);
    console.error('   상세:', error.message);
  }
}

testConnection();

