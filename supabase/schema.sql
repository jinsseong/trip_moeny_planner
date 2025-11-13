-- Supabase 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요

-- 참가자 테이블
CREATE TABLE IF NOT EXISTS participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  avatar_color VARCHAR(7) DEFAULT '#4a90e2',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 지출 항목 테이블
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  location VARCHAR(200),
  item_name VARCHAR(200),
  amount INTEGER NOT NULL,
  memo TEXT,
  category VARCHAR(50) DEFAULT '기타',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 지출-참가자 연결 테이블 (다대다 관계)
CREATE TABLE IF NOT EXISTS expense_participants (
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  PRIMARY KEY (expense_id, participant_id)
);

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거 생성
CREATE TRIGGER update_participants_updated_at BEFORE UPDATE ON participants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);
CREATE INDEX IF NOT EXISTS idx_expense_participants_expense_id ON expense_participants(expense_id);
CREATE INDEX IF NOT EXISTS idx_expense_participants_participant_id ON expense_participants(participant_id);

-- Row Level Security (RLS) 정책 설정
-- 참가자 테이블: 모든 사용자가 읽기/쓰기 가능
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "모든 사용자가 참가자 조회 가능" ON participants
    FOR SELECT USING (true);

CREATE POLICY "모든 사용자가 참가자 추가 가능" ON participants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "모든 사용자가 참가자 수정 가능" ON participants
    FOR UPDATE USING (true);

CREATE POLICY "모든 사용자가 참가자 삭제 가능" ON participants
    FOR DELETE USING (true);

-- 지출 테이블: 모든 사용자가 읽기/쓰기 가능
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "모든 사용자가 지출 조회 가능" ON expenses
    FOR SELECT USING (true);

CREATE POLICY "모든 사용자가 지출 추가 가능" ON expenses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "모든 사용자가 지출 수정 가능" ON expenses
    FOR UPDATE USING (true);

CREATE POLICY "모든 사용자가 지출 삭제 가능" ON expenses
    FOR DELETE USING (true);

-- 지출-참가자 연결 테이블: 모든 사용자가 읽기/쓰기 가능
ALTER TABLE expense_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "모든 사용자가 연결 조회 가능" ON expense_participants
    FOR SELECT USING (true);

CREATE POLICY "모든 사용자가 연결 추가 가능" ON expense_participants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "모든 사용자가 연결 삭제 가능" ON expense_participants
    FOR DELETE USING (true);

