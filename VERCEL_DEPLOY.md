# Vercel 배포 가이드

## 🚀 Vercel에 배포하기

### 1단계: Vercel 프로젝트 생성

1. [Vercel](https://vercel.com)에 접속하여 계정 생성 또는 로그인
2. "Add New..." → "Project" 클릭
3. GitHub 저장소 연결 (또는 직접 업로드)

### 2단계: 환경변수 설정

Vercel 대시보드에서 환경변수를 설정해야 합니다:

1. 프로젝트 설정 → **Environment Variables** 메뉴로 이동
2. 다음 환경변수들을 추가:

#### 필수 환경변수

```
VITE_SUPABASE_URL = https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key-here
```

**설정 방법:**
- **Key**: `VITE_SUPABASE_URL`
- **Value**: Supabase 프로젝트 URL (예: `https://xxxxx.supabase.co`)
- **Environment**: Production, Preview, Development 모두 선택
- "Add" 클릭

- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Supabase anon public key
- **Environment**: Production, Preview, Development 모두 선택
- "Add" 클릭

### 3단계: Build 설정 확인

Vercel이 자동으로 감지하지만, 필요시 수동 설정:

1. **Build Command**: `npm run build`
2. **Output Directory**: `dist`
3. **Install Command**: `npm install`

### 4단계: 배포

1. "Deploy" 버튼 클릭
2. 배포 완료 대기
3. 배포된 URL에서 앱 확인

## 📝 환경변수 확인 방법

### Supabase에서 값 가져오기

1. Supabase 대시보드 접속
2. 왼쪽 메뉴에서 **Settings** → **API** 클릭
3. 다음 정보 확인:
   - **Project URL**: `VITE_SUPABASE_URL`에 입력
   - **anon public**: `VITE_SUPABASE_ANON_KEY`에 입력

## 🔍 배포 후 확인사항

1. 배포된 사이트 접속
2. 브라우저 콘솔(F12) 확인
3. "Supabase 연결 모드로 실행됩니다" 메시지 확인
4. 참가자 추가 후 새로고침하여 데이터 유지 확인

## ⚠️ 문제 해결

### 환경변수가 적용되지 않을 때

- Vercel 대시보드에서 환경변수가 올바르게 설정되었는지 확인
- 환경변수 이름이 정확한지 확인 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- 배포를 다시 트리거 (Redeploy)

### 빌드 오류가 발생할 때

- `package.json`의 빌드 스크립트 확인
- Vercel 빌드 로그 확인
- 로컬에서 `npm run build` 테스트

### 데이터가 저장되지 않을 때

- Supabase RLS 정책 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- 브라우저 콘솔에서 에러 메시지 확인

## 🔐 보안 참고사항

- `anon` 키는 공개되어도 안전하지만, RLS 정책을 올바르게 설정해야 합니다
- 프로덕션 환경에서는 추가 보안 설정을 권장합니다

