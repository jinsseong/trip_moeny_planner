# Supabase 설정 가이드

이 가이드는 여행 정산 웹앱에 Supabase를 연결하는 방법을 설명합니다.

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 계정 생성 또는 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: travel-expense-splitter (또는 원하는 이름)
   - **Database Password**: 강력한 비밀번호 설정 (저장해두세요!)
   - **Region**: 가장 가까운 지역 선택
4. 프로젝트 생성 완료까지 대기 (약 2분)

## 2. 데이터베이스 스키마 생성

1. Supabase 대시보드에서 **SQL Editor** 메뉴 클릭
2. **New Query** 클릭
3. `supabase/schema.sql` 파일의 내용을 복사하여 붙여넣기
4. **Run** 버튼 클릭하여 실행
5. 성공 메시지 확인

## 3. 환경변수 설정

1. Supabase 대시보드에서 **Settings** → **API** 메뉴로 이동
2. 다음 정보를 확인:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public** 키

3. 프로젝트 루트에 `.env.local` 파일 생성 (이미 있다면 수정):

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**중요**: `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.

## 4. 의존성 설치

```bash
npm install
```

## 5. 서버 재시작

환경변수를 변경한 후에는 서버를 재시작해야 합니다:

```bash
# 서버 중지 후
npm run start
```

## 6. 연결 확인

서버를 시작하면 콘솔에 다음 중 하나가 표시됩니다:

- ✅ `Supabase 연결 모드로 실행됩니다.` - 정상 연결
- ⚠️ `JSON 파일 모드로 실행됩니다.` - 환경변수 미설정

## 7. 데이터 마이그레이션 (선택사항)

기존 JSON 파일의 데이터를 Supabase로 마이그레이션하려면:

1. `data/data.json` 파일 확인
2. Supabase 대시보드의 **Table Editor**에서 수동으로 데이터 입력
3. 또는 마이그레이션 스크립트 실행 (별도 제공)

## 문제 해결

### 환경변수가 인식되지 않는 경우

- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 파일 이름이 정확한지 확인 (`.env.local`)
- 서버를 재시작했는지 확인
- Vite를 사용하는 경우, 환경변수는 `VITE_` 접두사가 필요합니다

### 연결 오류가 발생하는 경우

- Supabase 프로젝트 URL과 키가 정확한지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- Row Level Security (RLS) 정책이 올바르게 설정되었는지 확인

### 데이터가 보이지 않는 경우

- Supabase 대시보드의 **Table Editor**에서 데이터 확인
- RLS 정책이 모든 사용자에게 읽기 권한을 허용하는지 확인
- 브라우저 콘솔에서 에러 메시지 확인

## 보안 참고사항

- `anon` 키는 공개되어도 괜찮지만, 프로덕션에서는 Row Level Security를 적절히 설정하세요
- 민감한 데이터의 경우 서비스 역할 키를 사용하되, 서버 사이드에서만 사용하세요

