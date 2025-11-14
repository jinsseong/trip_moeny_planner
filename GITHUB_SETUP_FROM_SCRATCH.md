# 🚀 GitHub 연동 처음부터 설정하기

## 현재 상태
✅ Git 저장소 초기화 완료
✅ 모든 파일 커밋 완료
✅ 리모트 제거 완료 (새로 설정할 준비됨)

---

## 📋 단계별 설정 가이드

### 1단계: GitHub 저장소 확인/생성

#### 저장소가 이미 있다면
- 저장소 URL 확인: https://github.com/jinsseong/trip_moeny_planner

#### 저장소가 없다면
1. GitHub 접속: https://github.com
2. 우측 상단 **"+"** → **"New repository"** 클릭
3. 설정:
   - **Repository name**: `trip_moeny_planner`
   - **Description**: `여행 정산 웹앱`
   - **Public** 또는 **Private** 선택
   - ⚠️ **"Initialize this repository with a README"** 체크 해제
   - ⚠️ **"Add .gitignore"** 체크 해제 (이미 있음)
   - ⚠️ **"Choose a license"** 선택 안 함
4. **"Create repository"** 클릭

---

### 2단계: Git 리모트 추가

터미널에서 다음 명령어 실행:

```bash
cd "/Users/daniel/Desktop/여행 정산 시트"
git remote add origin https://github.com/jinsseong/trip_moeny_planner.git
```

확인:
```bash
git remote -v
```

다음과 같이 표시되어야 합니다:
```
origin	https://github.com/jinsseong/trip_moeny_planner.git (fetch)
origin	https://github.com/jinsseong/trip_moeny_planner.git (push)
```

---

### 3단계: Personal Access Token 생성

GitHub에 푸시하려면 인증이 필요합니다.

1. **GitHub 토큰 생성 페이지 접속**
   - 직접 링크: https://github.com/settings/tokens/new
   - 또는: GitHub → 프로필 아이콘 → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic)

2. **토큰 설정**
   - **Note**: `Vercel Deploy` (아무 이름이나 가능)
   - **Expiration**: 원하는 기간 선택 (예: 90 days)
   - **Select scopes**: 
     - ✅ **repo** (전체 체크)
       - repo:status
       - repo_deployment
       - public_repo
       - repo:invite
       - security_events

3. **토큰 생성**
   - 맨 아래 **"Generate token"** 클릭
   - ⚠️ **생성된 토큰을 즉시 복사하세요!**
   - 예: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - 이 페이지를 벗어나면 다시 볼 수 없습니다!

---

### 4단계: GitHub에 푸시

터미널에서 다음 명령어 실행:

```bash
git push -u origin main
```

**인증 정보 입력:**
- **Username**: `jinsseong` (본인의 GitHub 사용자명)
- **Password**: ⚠️ **비밀번호가 아니라** 방금 복사한 **Personal Access Token**을 붙여넣기!

**성공 메시지:**
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Delta compression using up to X threads
Compressing objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
Total X (delta X), reused 0 (delta 0), pack-reused 0 (from 0)
remote: Resolving deltas: 100% (X/X), done.
To https://github.com/jinsseong/trip_moeny_planner.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

### 5단계: 푸시 확인

GitHub 웹사이트에서 확인:
1. https://github.com/jinsseong/trip_moeny_planner 접속
2. 파일 목록이 보이면 성공!

---

## 🔄 다음 단계: Vercel 연동

GitHub 푸시가 성공하면:

1. **Vercel 접속**: https://vercel.com
2. **GitHub로 로그인**
3. **"Add New..." → "Project"** 클릭
4. 저장소 목록에서 **`trip_moeny_planner`** 선택
5. **"Import"** 클릭
6. **프로젝트 설정**:
   - Framework Preset: **Other**
   - Root Directory: `./` (기본값)
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
7. **환경변수 설정** (중요!):
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
8. **"Deploy"** 클릭
9. 배포 완료 대기 (약 2-3분)

---

## ❓ 문제 해결

### "fatal: remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/jinsseong/trip_moeny_planner.git
```

### "fatal: could not read Username"
→ Personal Access Token을 생성하세요 (3단계 참고)

### "remote: Invalid username or password"
→ Password 필드에 **Personal Access Token**을 입력하세요 (비밀번호 아님!)

### "remote: Repository not found"
→ 저장소 이름이 정확한지 확인하거나, 저장소를 먼저 생성하세요

### "error: failed to push some refs"
→ GitHub 저장소에 이미 내용이 있다면:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## 📝 빠른 명령어 모음

```bash
# 리모트 추가
git remote add origin https://github.com/jinsseong/trip_moeny_planner.git

# 리모트 확인
git remote -v

# 리모트 제거 (재설정 시)
git remote remove origin

# 푸시
git push -u origin main

# 상태 확인
git status

# 커밋 이력 확인
git log --oneline -5
```

---

## 🎯 체크리스트

- [ ] GitHub 저장소 생성/확인
- [ ] Git 리모트 추가 완료
- [ ] Personal Access Token 생성 완료
- [ ] GitHub에 푸시 성공
- [ ] GitHub 웹사이트에서 파일 확인
- [ ] Vercel 프로젝트 생성
- [ ] Vercel 환경변수 설정
- [ ] Vercel 배포 성공

---

## 🔗 유용한 링크

- GitHub 저장소: https://github.com/jinsseong/trip_moeny_planner
- Personal Access Tokens: https://github.com/settings/tokens
- Vercel 대시보드: https://vercel.com/dashboard
- Supabase 대시보드: https://supabase.com/dashboard

