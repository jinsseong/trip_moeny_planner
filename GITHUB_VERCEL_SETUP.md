# GitHub + Vercel 연동 가이드

## 🚀 전체 프로세스

### 1단계: GitHub에 코드 푸시

#### 방법 A: GitHub Personal Access Token 사용 (권장)

1. **Personal Access Token 생성**
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - "Generate new token (classic)" 클릭
   - Note: `Vercel Deploy` 입력
   - Expiration: 원하는 기간 선택
   - Scopes: `repo` 체크
   - "Generate token" 클릭
   - **토큰 복사** (한 번만 보여집니다!)

2. **터미널에서 푸시**
   ```bash
   git push -u origin main
   ```
   - Username: GitHub 사용자명 입력
   - Password: **Personal Access Token** 입력 (비밀번호가 아님!)

#### 방법 B: GitHub Desktop 사용

1. GitHub Desktop 앱 설치
2. File → Add Local Repository
3. 프로젝트 폴더 선택
4. "Publish repository" 클릭

#### 방법 C: VSCode Git 기능 사용

1. VSCode에서 Source Control 탭
2. 변경사항 스테이징
3. 커밋 메시지 입력
4. "Sync Changes" 클릭

### 2단계: Vercel 프로젝트 생성 및 연동

1. **Vercel 대시보드 접속**
   - https://vercel.com 접속
   - GitHub 계정으로 로그인

2. **새 프로젝트 생성**
   - "Add New..." → "Project" 클릭
   - GitHub 저장소 목록에서 `trip_moeny_planner` 선택
   - "Import" 클릭

3. **프로젝트 설정**
   - **Framework Preset**: Other (또는 Vite)
   - **Root Directory**: `./` (기본값)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **환경변수 설정** (중요!)
   - "Environment Variables" 섹션 클릭
   - 다음 환경변수 추가:

   ```
   VITE_SUPABASE_URL = https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key-here
   ```

   - 각 환경변수에 대해:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
     모두 체크

5. **배포 시작**
   - "Deploy" 버튼 클릭
   - 배포 완료 대기 (약 2-3분)

### 3단계: 배포 확인

1. 배포 완료 후 제공되는 URL 접속
2. 브라우저 개발자 도구(F12) → Console 확인
3. "Supabase 연결 모드로 실행됩니다" 메시지 확인
4. 데이터 추가 후 새로고침하여 영구 저장 확인

## 🔄 자동 배포 설정

Vercel은 GitHub와 연동되면 자동으로 배포됩니다:

- **main 브랜치에 푸시** → Production 배포
- **다른 브랜치에 푸시** → Preview 배포
- **Pull Request 생성** → Preview 배포

## 📝 환경변수 관리

### Vercel 대시보드에서 설정

1. 프로젝트 → **Settings** → **Environment Variables**
2. 환경변수 추가/수정/삭제
3. 변경 후 "Redeploy" 필요

### 여러 환경별 설정

- **Production**: 실제 운영 환경
- **Preview**: 브랜치/PR별 미리보기
- **Development**: 로컬 개발 (거의 사용 안 함)

## 🛠️ 문제 해결

### 푸시가 안 될 때

1. **인증 오류**
   - Personal Access Token 사용 확인
   - SSH 키 설정 확인

2. **권한 오류**
   - GitHub 저장소 접근 권한 확인
   - Personal Access Token에 `repo` 권한 확인

### Vercel 배포 실패

1. **빌드 오류**
   - Vercel 빌드 로그 확인
   - 로컬에서 `npm run build` 테스트

2. **환경변수 오류**
   - 환경변수가 올바르게 설정되었는지 확인
   - Supabase 값이 정확한지 확인

3. **API 오류**
   - Supabase 프로젝트가 활성화되어 있는지 확인
   - RLS 정책이 올바르게 설정되었는지 확인

## 📋 체크리스트

GitHub 연동:
- [ ] Git 리모트 설정 확인
- [ ] 변경사항 커밋
- [ ] GitHub에 푸시 성공

Vercel 연동:
- [ ] Vercel 계정 생성/로그인
- [ ] GitHub 저장소 연동
- [ ] 프로젝트 설정 완료
- [ ] 환경변수 설정 완료
- [ ] 배포 성공
- [ ] 배포된 사이트 정상 작동 확인

## 🔗 유용한 링크

- Vercel 대시보드: https://vercel.com/dashboard
- GitHub 저장소: https://github.com/jinsseong/trip_moeny_planner
- Supabase 대시보드: https://supabase.com/dashboard

