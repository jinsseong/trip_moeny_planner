-- 여행 프로젝트 테이블 추가
-- 기존 schema.sql 실행 후 이 파일을 실행하세요

-- 여행 테이블 추가
CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- expenses 테이블에 trip_id 추가
ALTER TABLE expenses 
ADD COLUMN IF NOT EXISTS trip_id UUID REFERENCES trips(id) ON DELETE SET NULL;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_trips_created_at ON trips(created_at);

-- updated_at 트리거
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS 정책 설정
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "모든 사용자가 여행 조회 가능" ON trips
    FOR SELECT USING (true);

CREATE POLICY "모든 사용자가 여행 추가 가능" ON trips
    FOR INSERT WITH CHECK (true);

CREATE POLICY "모든 사용자가 여행 수정 가능" ON trips
    FOR UPDATE USING (true);

CREATE POLICY "모든 사용자가 여행 삭제 가능" ON trips
    FOR DELETE USING (true);

