# 🚨 Supabase 연결 문제 빠른 해결

## 현재 문제
`.env.local` 파일이 없어서 Supabase 연결이 안 되고 있습니다.

## ✅ 즉시 해결 방법

### 1단계: .env.local 파일 생성

터미널에서 실행:
```bash
cd "/Users/daniel/Desktop/여행 정산 시트"
cp env.example.txt .env.local
```

또는 직접 생성:
```bash
touch .env.local
```

### 2단계: Supabase 정보 가져오기

1. **Supabase 대시보드**: https://supabase.com/dashboard
2. 프로젝트 선택
3. **Settings** → **API** 클릭
4. 다음 정보 복사:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public** 키 (긴 문자열)

### 3단계: .env.local 파일 수정

`.env.local` 파일을 열고 실제 값으로 수정:

```env
VITE_SUPABASE_URL=https://실제-프로젝트-id.supabase.co
VITE_SUPABASE_ANON_KEY=실제-anon-key-여기에-붙여넣기
```

### 4단계: 연결 테스트

```bash
node test-supabase.js
```

**성공 예시:**
```
✅ participants 테이블 연결 성공
✅ expenses 테이블 연결 성공
✅ trips 테이블 연결 성공
```

### 5단계: 서버 재시작

```bash
# 개발 서버 재시작
npm run dev

# 또는 프로덕션 서버
node server.js
```

서버 시작 시 다음 메시지가 보여야 합니다:
```
✅ Supabase 연결 모드로 실행됩니다.
```

## 🔍 문제 진단

테스트 스크립트 실행 결과에 따라:

### "환경변수 없음"
→ `.env.local` 파일이 없거나 값이 비어있음

### "테이블이 없습니다 (42P01)"
→ Supabase SQL Editor에서 `schema.sql` 실행 필요

### "RLS 정책 문제 (42501)"
→ `schema.sql`의 RLS 정책 확인

### "연결 실패"
→ Supabase 프로젝트 URL과 키 확인

## 📝 참고

- `.env.local` 파일은 Git에 커밋되지 않습니다 (안전)
- Vercel 배포 시에는 대시보드에서 환경변수 설정 필요
- 자세한 내용은 `SUPABASE_TEST_GUIDE.md` 참고

