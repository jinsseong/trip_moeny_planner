# Supabase 빠른 시작 가이드

## 🚀 5분 안에 Supabase 연결하기

### 1단계: Supabase 프로젝트 생성 (2분)

1. https://supabase.com 접속
2. "Start your project" 클릭 (또는 로그인)
3. "New Project" 클릭
4. 프로젝트 정보 입력:
   - **Name**: `travel-expense` (원하는 이름)
   - **Database Password**: 강력한 비밀번호 입력 (저장!)
   - **Region**: 가장 가까운 지역 선택
5. "Create new project" 클릭
6. 프로젝트 생성 완료 대기 (약 2분)

### 2단계: 데이터베이스 스키마 생성 (1분)

1. Supabase 대시보드 왼쪽 메뉴에서 **SQL Editor** 클릭
2. **New Query** 클릭
3. 프로젝트의 `supabase/schema.sql` 파일을 열어서 전체 내용 복사
4. SQL Editor에 붙여넣기
5. 우측 상단 **Run** 버튼 클릭 (또는 `Cmd/Ctrl + Enter`)
6. ✅ 성공 메시지 확인

### 3단계: 환경변수 설정 (1분)

1. Supabase 대시보드 왼쪽 메뉴에서 **Settings** → **API** 클릭
2. 다음 두 값을 복사:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public** 키 (긴 문자열)

3. 프로젝트 루트에 `.env.local` 파일 생성/수정:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**중요**: 실제 값으로 교체하세요!

### 4단계: 서버 재시작 (1분)

```bash
# 서버 중지 (Ctrl+C)
npm run start
```

콘솔에 다음 메시지가 보이면 성공:
```
✅ Supabase 연결 모드로 실행됩니다.
```

## ✅ 완료!

이제 데이터가 Supabase에 영구 저장됩니다. 새로고침해도 데이터가 사라지지 않습니다!

## 🔍 확인 방법

1. 브라우저에서 앱 접속
2. 참가자 추가
3. 지출 내역 추가
4. 페이지 새로고침
5. 데이터가 그대로 있는지 확인 ✅

## ❌ 문제 해결

### "JSON 파일 모드로 실행됩니다" 메시지가 보일 때

- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 환경변수 이름이 정확한지 확인 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- 서버를 완전히 재시작했는지 확인

### 연결 오류가 발생할 때

- Supabase 프로젝트 URL과 키가 정확한지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인
- SQL 스키마가 정상적으로 실행되었는지 확인 (Table Editor에서 테이블 확인)

### 데이터가 보이지 않을 때

- Supabase 대시보드 → **Table Editor**에서 데이터 확인
- RLS 정책이 올바르게 설정되었는지 확인
- 브라우저 콘솔(F12)에서 에러 메시지 확인

