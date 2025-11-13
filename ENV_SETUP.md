# 환경변수 설정 가이드

## 📝 환경변수 파일 생성

### 로컬 개발용 (.env.local)

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Supabase 설정
# Supabase 프로젝트 대시보드 → Settings → API에서 확인

VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# 서버 포트 (선택사항)
PORT=3001
```

**중요**: 
- `your-project-id.supabase.co`를 실제 Supabase 프로젝트 URL로 변경
- `your-anon-key-here`를 실제 anon public key로 변경
- 이 파일은 Git에 커밋되지 않습니다 (`.gitignore`에 포함됨)

### 예시 파일 (.env.example)

프로젝트에는 `.env.example` 파일이 있습니다. 이 파일을 복사하여 `.env.local`로 만들 수 있습니다:

```bash
cp .env.example .env.local
```

그 다음 `.env.local` 파일을 열어 실제 값으로 수정하세요.

## 🚀 Vercel 배포 시 환경변수 설정

Vercel에서는 파일이 아닌 대시보드에서 환경변수를 설정합니다:

### 1. Vercel 대시보드 접속

1. https://vercel.com 접속
2. 프로젝트 선택 또는 새 프로젝트 생성

### 2. 환경변수 추가

1. 프로젝트 → **Settings** → **Environment Variables** 클릭
2. "Add New" 버튼 클릭
3. 다음 환경변수들을 추가:

#### 환경변수 1: VITE_SUPABASE_URL

- **Key**: `VITE_SUPABASE_URL`
- **Value**: Supabase 프로젝트 URL (예: `https://xxxxx.supabase.co`)
- **Environment**: 
  - ✅ Production
  - ✅ Preview  
  - ✅ Development
- "Add" 클릭

#### 환경변수 2: VITE_SUPABASE_ANON_KEY

- **Key**: `VITE_SUPABASE_ANON_KEY`
- **Value**: Supabase anon public key (긴 문자열)
- **Environment**: 
  - ✅ Production
  - ✅ Preview
  - ✅ Development
- "Add" 클릭

### 3. 배포 재시작

환경변수를 추가한 후:

1. **Deployments** 탭으로 이동
2. 최신 배포의 "..." 메뉴 클릭
3. "Redeploy" 선택
4. 배포 완료 대기

## 🔍 Supabase 값 확인 방법

1. Supabase 대시보드 접속: https://supabase.com
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **Settings** → **API** 클릭
4. 다음 정보 확인:
   - **Project URL**: `VITE_SUPABASE_URL`에 사용
   - **anon public**: `VITE_SUPABASE_ANON_KEY`에 사용

## ✅ 확인 방법

### 로컬 개발

서버를 시작하면 콘솔에 다음 중 하나가 표시됩니다:

- ✅ `Supabase 연결 모드로 실행됩니다.` → 정상 연결
- ⚠️ `JSON 파일 모드로 실행됩니다.` → 환경변수 미설정

### Vercel 배포

1. 배포된 사이트 접속
2. 브라우저 개발자 도구(F12) → Console 탭
3. "Supabase 연결 모드" 메시지 확인
4. 데이터 추가 후 새로고침하여 영구 저장 확인

## 📋 체크리스트

로컬 개발:
- [ ] `.env.local` 파일 생성
- [ ] `VITE_SUPABASE_URL` 설정
- [ ] `VITE_SUPABASE_ANON_KEY` 설정
- [ ] 서버 재시작
- [ ] 연결 확인

Vercel 배포:
- [ ] Vercel 프로젝트 생성
- [ ] Environment Variables에 `VITE_SUPABASE_URL` 추가
- [ ] Environment Variables에 `VITE_SUPABASE_ANON_KEY` 추가
- [ ] Production, Preview, Development 모두 선택
- [ ] 배포 재시작
- [ ] 배포된 사이트에서 연결 확인

