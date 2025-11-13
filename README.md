# 여행 정산 시트

여행 중 발생한 지출을 날짜별로 관리하고 참여자별로 자동 정산하는 웹 애플리케이션입니다.

## 주요 기능

- 📅 **일별 정산 시스템**: 날짜별로 지출 항목을 관리하고 실시간으로 정산 결과를 확인
- 👥 **참여자 관리**: 참여자 추가/수정/삭제 기능
- 💰 **자동 분할 계산**: 선택된 참여자들끼리 자동으로 n분의 1 계산
- 📊 **실시간 정산**: 개인별 총 부담 금액을 실시간으로 계산 및 표시
- 📱 **모바일 친화적**: 반응형 디자인으로 모바일에서도 편리하게 사용

## 기술 스택

- **Frontend**: React, Vite
- **Backend**: Node.js (Vercel Serverless Functions)
- **Database**: SQLite (better-sqlite3)
- **Deployment**: Vercel

## 로컬 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 개발 서버 실행

로컬 개발을 위해서는 두 개의 터미널이 필요합니다:

**터미널 1 - Express 서버 (API):**
```bash
npm run start
```

**터미널 2 - Vite 개발 서버 (프론트엔드):**
```bash
npm run dev
```

프론트엔드 개발 서버가 `http://localhost:3000`에서 실행되고, API 서버가 `http://localhost:3001`에서 실행됩니다.

### 3. 빌드

```bash
npm run build
```

빌드된 파일은 `dist` 디렉토리에 생성됩니다.

## Vercel 배포

### 1. 환경변수 설정 (필수)

Vercel 대시보드에서 다음 환경변수를 설정해야 합니다:

1. Vercel 프로젝트 → **Settings** → **Environment Variables**
2. 다음 환경변수 추가:

```
VITE_SUPABASE_URL = https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY = your-anon-key-here
```

**중요**: 
- Supabase 프로젝트의 Settings → API에서 값 확인
- Production, Preview, Development 모두에 설정

### 2. 배포 방법

#### 방법 1: GitHub 연동 (권장)

1. GitHub에 코드 푸시
2. Vercel 대시보드에서 "Add New Project"
3. GitHub 저장소 선택
4. 환경변수 설정 (위 1단계)
5. "Deploy" 클릭

#### 방법 2: Vercel CLI

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel
```

### 3. 배포 후 확인

- 배포된 URL 접속
- 브라우저 콘솔에서 "Supabase 연결 모드" 메시지 확인
- 데이터 추가 후 새로고침하여 영구 저장 확인

자세한 내용은 `VERCEL_DEPLOY.md` 파일을 참고하세요.

## 프로젝트 구조

```
여행 정산 시트/
├── api/                    # Vercel Serverless Functions
│   ├── users.js           # 사용자 관리 API
│   ├── expenses.js        # 지출 관리 API
│   ├── calculate.js       # 정산 계산 API
│   └── init-db.js         # 데이터베이스 초기화 API
├── src/
│   ├── components/        # React 컴포넌트
│   │   ├── ExpenseForm.jsx
│   │   ├── ExpenseList.jsx
│   │   ├── UserManagement.jsx
│   │   └── SettlementDisplay.jsx
│   ├── App.jsx           # 메인 앱 컴포넌트
│   ├── App.css           # 앱 스타일
│   ├── index.js          # React 엔트리 포인트
│   └── index.css         # 전역 스타일
├── database/
│   └── init.js           # 데이터베이스 초기화 로직
├── package.json
├── vercel.json           # Vercel 배포 설정
└── vite.config.js        # Vite 설정
```

## 사용 방법

1. **참여자 추가**: "참여자 관리" 탭에서 여행 참여자들을 추가합니다.
2. **지출 입력**: "지출 관리" 탭에서 날짜를 선택하고 지출 항목을 추가합니다.
   - 금액, 위치, 비고를 입력하고 참여자를 선택합니다.
   - 참여자 선택 시 자동으로 인당 금액이 계산됩니다.
3. **정산 확인**: "정산 결과" 탭에서 날짜별 총 지출과 개인별 부담 금액을 확인합니다.

## 주의사항

- Vercel의 serverless 환경에서는 데이터베이스가 `/tmp` 디렉토리에 저장되며, 함수가 재시작되면 데이터가 초기화될 수 있습니다.
- 프로덕션 환경에서는 영구 저장소(예: Vercel KV, PostgreSQL 등)를 사용하는 것을 권장합니다.

## 향후 확장 계획

- 카테고리 기능 확장
- 통화 변환 기능
- 지출 내역 내보내기 (CSV, PDF)
- 다중 여행 관리

