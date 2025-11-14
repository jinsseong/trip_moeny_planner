# 🚀 GitHub 연동 완전 초기화 가이드

## ✅ 현재 준비 상태

- ✅ Git 저장소 초기화 완료
- ✅ 모든 파일 커밋 완료
- ✅ GitHub 리모트 설정 완료
- ✅ 푸시 준비 완료

---

## 📝 다음 단계 (3단계만!)

### 1️⃣ Personal Access Token 생성 (5분)

1. **링크 클릭**: https://github.com/settings/tokens/new

2. **설정 입력**:
   - Note: `Vercel Deploy` (아무 이름)
   - Expiration: `90 days` (또는 원하는 기간)
   - **Select scopes**: ✅ **repo** 체크박스 선택

3. **토큰 생성**:
   - 맨 아래 **"Generate token"** 클릭
   - ⚠️ **생성된 토큰을 즉시 복사!** (한 번만 보여짐)
   - 예: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### 2️⃣ GitHub에 푸시

터미널에서 실행:

```bash
cd "/Users/daniel/Desktop/여행 정산 시트"
git push -u origin main
```

**인증 정보 입력:**
- **Username**: `jinsseong` (본인의 GitHub 사용자명)
- **Password**: ⚠️ **비밀번호가 아니라** 방금 복사한 **Personal Access Token** 붙여넣기!

**성공하면:**
```
Enumerating objects: X, done.
...
To https://github.com/jinsseong/trip_moeny_planner.git
 * [new branch]      main -> main
```

---

### 3️⃣ Vercel 연동

1. **Vercel 접속**: https://vercel.com
2. **GitHub로 로그인**
3. **"Add New..." → "Project"**
4. **`trip_moeny_planner`** 선택 → **"Import"**
5. **프로젝트 설정**:
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **환경변수 추가**:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
   - Production, Preview, Development 모두 체크 ✅
7. **"Deploy"** 클릭

---

## 🛠️ 문제 해결

### "fatal: could not read Username"
→ Personal Access Token을 생성하세요 (1단계)

### "remote: Invalid username or password"
→ Password에 **Personal Access Token**을 입력하세요 (비밀번호 아님!)

### "remote: Repository not found"
→ GitHub에서 저장소를 먼저 생성하세요:
- https://github.com/new
- Repository name: `trip_moeny_planner`
- **"Initialize this repository with a README"** 체크 해제
- **"Create repository"** 클릭

---

## 📋 빠른 명령어

```bash
# 리모트 확인
git remote -v

# 리모트 재설정 (필요시)
git remote remove origin
git remote add origin https://github.com/jinsseong/trip_moeny_planner.git

# 푸시
git push -u origin main

# 상태 확인
git status
```

---

## 🔗 유용한 링크

- Personal Access Tokens: https://github.com/settings/tokens/new
- GitHub 저장소: https://github.com/jinsseong/trip_moeny_planner
- Vercel 대시보드: https://vercel.com/dashboard

