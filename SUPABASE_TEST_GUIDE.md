# Supabase 연결 테스트 가이드

## 🔍 문제 진단

현재 `.env.local` 파일이 없어서 Supabase 연결이 안 되고 있습니다.

## ✅ 해결 방법

### 1단계: .env.local 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하세요:

```bash
# 프로젝트 루트에서 실행
touch .env.local
```

### 2단계: Supabase 정보 가져오기

1. **Supabase 대시보드 접속**: https://supabase.com/dashboard
2. 프로젝트 선택
3. **Settings** → **API** 메뉴 클릭
4. 다음 정보 복사:
   - **Project URL** → `VITE_SUPABASE_URL`에 사용
   - **anon public** 키 → `VITE_SUPABASE_ANON_KEY`에 사용

### 3단계: .env.local 파일에 추가

`.env.local` 파일을 열고 다음 내용을 추가:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**예시:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4단계: 연결 테스트

터미널에서 다음 명령어 실행:

```bash
node test-supabase.js
```

**성공하면:**
```
✅ participants 테이블 연결 성공
✅ expenses 테이블 연결 성공
✅ trips 테이블 연결 성공
✅ 데이터 추가 성공
```

**실패하면:**
- 환경변수 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- 테이블이 생성되었는지 확인 (schema.sql 실행)

## 🗄️ 데이터베이스 테이블 확인

Supabase 대시보드에서:

1. **Table Editor** 메뉴 클릭
2. 다음 테이블들이 있는지 확인:
   - ✅ `participants`
   - ✅ `expenses`
   - ✅ `expense_participants`
   - ✅ `trips` (schema_trips.sql 실행 후)

## 🔧 로컬 서버 재시작

환경변수를 추가한 후:

```bash
# 서버 재시작
npm run dev
# 또는
node server.js
```

## 📝 Vercel 배포 시

Vercel 대시보드에서도 동일한 환경변수를 설정해야 합니다:

1. Vercel 프로젝트 → **Settings** → **Environment Variables**
2. 다음 추가:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Redeploy** 실행

## ❓ 문제 해결

### "테이블이 없습니다" 오류
→ `supabase/schema.sql` 실행 필요

### "RLS 정책 문제" 오류
→ `supabase/schema.sql`의 RLS 정책 확인

### "환경변수 누락" 오류
→ `.env.local` 파일 확인

### "연결 실패" 오류
→ Supabase 프로젝트 URL과 키 확인

