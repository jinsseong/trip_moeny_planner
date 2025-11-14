# 🚀 빠른 GitHub 푸시 가이드

## 1️⃣ Personal Access Token 생성 (5분)

1. **GitHub 웹사이트 접속**
   - https://github.com/settings/tokens 접속
   - 또는: GitHub → 프로필 아이콘 → Settings → Developer settings → Personal access tokens → Tokens (classic)

2. **토큰 생성**
   - "Generate new token" → "Generate new token (classic)" 클릭
   - **Note**: `Vercel Deploy` 입력
   - **Expiration**: 90 days (또는 원하는 기간)
   - **Select scopes**: `repo` 체크박스 ✅
   - 맨 아래 **"Generate token"** 클릭

3. **토큰 복사**
   - 생성된 토큰을 **즉시 복사**하세요!
   - 예: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ 이 페이지를 벗어나면 다시 볼 수 없습니다!

## 2️⃣ 터미널에서 푸시

터미널에서 다음 명령어 실행:

```bash
git push -u origin main
```

**인증 정보 입력:**
- **Username**: `jinsseong` (또는 본인의 GitHub 사용자명)
- **Password**: ⚠️ **비밀번호가 아니라** 방금 복사한 **Personal Access Token**을 붙여넣기!

## 3️⃣ 성공 확인

다음과 같은 메시지가 나오면 성공입니다:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
To https://github.com/jinsseong/trip_moeny_planner.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

## 4️⃣ Vercel 연동

푸시가 성공하면:

1. **Vercel 접속**: https://vercel.com
2. **GitHub로 로그인**
3. **"Add New..." → "Project"** 클릭
4. 저장소 목록에서 **`trip_moeny_planner`** 선택
5. **"Import"** 클릭
6. **프로젝트 설정**:
   - Framework Preset: **Other**
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. **환경변수 추가** (중요!):
   - "Environment Variables" 클릭
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
   - Production, Preview, Development 모두 체크 ✅
8. **"Deploy"** 클릭

---

## ❓ 문제 해결

**"fatal: could not read Username"**
→ Personal Access Token을 사용하세요 (위 1단계 참고)

**"remote: Invalid username or password"**
→ Password 필드에 **Personal Access Token**을 입력하세요 (비밀번호 아님!)

**토큰을 잃어버렸다면**
→ GitHub → Settings → Developer settings → Personal access tokens에서 새로 생성

---

## 📱 대안: GitHub Desktop 사용

터미널이 어렵다면:

1. **GitHub Desktop 설치**: https://desktop.github.com
2. **File → Add Local Repository**
3. 프로젝트 폴더 선택: `/Users/daniel/Desktop/여행 정산 시트`
4. **"Publish repository"** 클릭

