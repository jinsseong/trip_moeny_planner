# Vercel 500 오류 해결 가이드

## 🔍 문제 진단

Vercel에서 `/api/trips`가 500 오류를 반환하고 있습니다.

## ✅ 확인 사항

### 1. Vercel 환경변수 확인

Vercel 대시보드에서:
1. 프로젝트 → **Settings** → **Environment Variables**
2. 다음 환경변수가 있는지 확인:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. **Production, Preview, Development 모두 체크**되어 있는지 확인

### 2. Vercel 배포 로그 확인

1. Vercel 대시보드 → **Deployments**
2. 최신 배포 클릭
3. **Functions** 탭 클릭
4. `/api/trips` 함수 클릭
5. **Logs** 탭에서 오류 메시지 확인

**확인할 오류:**
- `Supabase 환경변수 누락` → 환경변수 설정 필요
- `relation "trips" does not exist` → trips 테이블 생성 필요
- `permission denied` → RLS 정책 확인 필요

### 3. Supabase 테이블 확인

Supabase 대시보드에서:
1. **Table Editor** 메뉴 클릭
2. `trips` 테이블이 있는지 확인
3. 없으면 **SQL Editor**에서 `schema_trips.sql` 실행

## 🔧 해결 방법

### 방법 1: 환경변수 설정

1. Vercel 대시보드 → Settings → Environment Variables
2. 다음 추가:
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key
   ```
3. **Redeploy** 실행

### 방법 2: trips 테이블 생성

1. Supabase 대시보드 → **SQL Editor**
2. `supabase/schema_trips.sql` 파일 내용 복사
3. 실행
4. Vercel에서 다시 테스트

### 방법 3: 코드 재배포

1. GitHub에 최신 코드 푸시
2. Vercel 자동 배포 확인
3. 배포 완료 후 테스트

## 📝 Vercel 로그 확인 방법

### 웹 대시보드
1. Vercel → 프로젝트 → Deployments
2. 최신 배포 → Functions → `/api/trips` → Logs

### Vercel CLI (선택사항)
```bash
npm i -g vercel
vercel logs trip-moeny-planner
```

## 🧪 테스트 방법

배포 후 브라우저 콘솔에서:

```javascript
fetch('https://trip-moeny-planner.vercel.app/api/trips')
  .then(r => r.json())
  .then(data => console.log('성공:', data))
  .catch(err => console.error('오류:', err));
```

**성공하면:**
```json
[]
```

**실패하면:**
오류 메시지 확인

## ⚠️ 일반적인 오류

### "Supabase 환경변수 누락"
→ Vercel 환경변수 설정 필요

### "relation does not exist"
→ Supabase에서 테이블 생성 필요

### "permission denied"
→ RLS 정책 확인 필요

### "Module not found"
→ `package.json`에 `@supabase/supabase-js` 확인

## 🔗 유용한 링크

- Vercel 대시보드: https://vercel.com/dashboard
- Supabase 대시보드: https://supabase.com/dashboard
- Vercel Functions 문서: https://vercel.com/docs/functions

