# Supabase 연동 완료 가이드

## 🎉 Supabase 연동이 완료되었습니다!

이제 데이터가 영구적으로 저장되어 새로고침해도 사라지지 않습니다.

## 📋 설정 단계

### 1단계: Supabase 프로젝트 생성

1. https://supabase.com 접속
2. "New Project" 클릭
3. 프로젝트 정보 입력 후 생성

### 2단계: 데이터베이스 스키마 생성

1. Supabase 대시보드 → **SQL Editor**
2. `supabase/schema.sql` 파일 내용 복사
3. SQL Editor에 붙여넣고 **Run** 실행

### 3단계: 환경변수 설정

1. Supabase 대시보드 → **Settings** → **API**
2. **Project URL**과 **anon public** 키 복사
3. 프로젝트 루트에 `.env.local` 파일 생성:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4단계: 의존성 설치 및 서버 재시작

```bash
npm install
npm run start
```

서버 시작 시 다음 메시지가 보이면 성공:
```
✅ Supabase 연결 모드로 실행됩니다.
```

## 🔄 데이터 모드 전환

앱은 자동으로 Supabase 연결 여부를 확인합니다:

- **환경변수 설정됨** → Supabase PostgreSQL 사용
- **환경변수 미설정** → JSON 파일 사용 (기존 방식)

## 📊 API 엔드포인트

모든 API는 기존과 동일하게 작동합니다:

- `GET /api/users` → 참가자 조회
- `POST /api/users` → 참가자 추가
- `PUT /api/users` → 참가자 수정
- `DELETE /api/users` → 참가자 삭제
- `GET /api/expenses` → 지출 조회
- `POST /api/expenses` → 지출 추가
- `PUT /api/expenses` → 지출 수정
- `DELETE /api/expenses` → 지출 삭제
- `GET /api/calculate` → 정산 계산

## 🛠️ 문제 해결

### 환경변수가 인식되지 않을 때

1. `.env.local` 파일이 프로젝트 루트에 있는지 확인
2. 파일 이름이 정확한지 확인 (`.env.local`)
3. 서버를 완전히 재시작

### 연결 오류가 발생할 때

1. Supabase 프로젝트가 활성화되어 있는지 확인
2. URL과 키가 정확한지 확인
3. RLS 정책이 올바르게 설정되었는지 확인

## 📝 참고사항

- 기존 JSON 파일 데이터는 수동으로 Supabase로 마이그레이션해야 합니다
- Supabase는 무료 플랜에서도 충분한 용량을 제공합니다
- 데이터는 클라우드에 저장되어 어디서나 접근 가능합니다

