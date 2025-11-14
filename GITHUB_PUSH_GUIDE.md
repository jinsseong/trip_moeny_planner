# GitHub 푸시 가이드

## 🔐 인증 방법 선택

GitHub에 푸시하려면 인증이 필요합니다. 두 가지 방법 중 하나를 선택하세요:

---

## 방법 1: Personal Access Token 사용 (간단, 권장)

### 1단계: Personal Access Token 생성

1. GitHub 웹사이트 접속: https://github.com
2. 우측 상단 프로필 아이콘 클릭 → **Settings**
3. 좌측 메뉴에서 **Developer settings** 클릭
4. **Personal access tokens** → **Tokens (classic)** 클릭
5. **Generate new token** → **Generate new token (classic)** 클릭
6. 설정:
   - **Note**: `Vercel Deploy` (아무 이름이나 가능)
   - **Expiration**: 원하는 기간 선택 (90일, 1년 등)
   - **Select scopes**: `repo` 체크박스 선택
7. 맨 아래 **Generate token** 클릭
8. **⚠️ 중요**: 생성된 토큰을 복사하세요! (한 번만 보여집니다)
   - 예: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2단계: 터미널에서 푸시

터미널에서 다음 명령어 실행:

```bash
git push -u origin main
```

인증 정보 입력:
- **Username**: GitHub 사용자명 입력 (예: `jinsseong`)
- **Password**: ⚠️ 비밀번호가 아니라 **방금 복사한 Personal Access Token**을 붙여넣기!

### 3단계: 성공 확인

푸시가 성공하면:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
...
To https://github.com/jinsseong/trip_moeny_planner.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 방법 2: SSH 키 사용 (고급)

### 1단계: SSH 키 생성 (아직 없다면)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

- 파일 위치: 엔터 (기본값 사용)
- 비밀번호: 엔터 (없어도 됨) 또는 원하는 비밀번호 입력

### 2단계: SSH 키를 GitHub에 등록

1. 공개 키 복사:
```bash
cat ~/.ssh/id_ed25519.pub
```

2. GitHub → Settings → SSH and GPG keys → New SSH key
3. 복사한 키 붙여넣기 → Add SSH key

### 3단계: Git 리모트를 SSH로 변경

```bash
git remote set-url origin git@github.com:jinsseong/trip_moeny_planner.git
```

### 4단계: 푸시

```bash
git push -u origin main
```

---

## 🚀 푸시 후 Vercel 연동

GitHub 푸시가 성공하면:

1. **Vercel 대시보드 접속**: https://vercel.com
2. **GitHub로 로그인**
3. **New Project** 클릭
4. 저장소 목록에서 `trip_moeny_planner` 선택
5. **Import** 클릭
6. **프로젝트 설정**:
   - Framework Preset: **Other** 또는 **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. **환경변수 설정** (중요!):
   - Environment Variables 섹션에서:
     - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
   - Production, Preview, Development 모두 체크
8. **Deploy** 클릭

---

## ❓ 문제 해결

### "fatal: could not read Username"
- Personal Access Token을 사용하세요 (방법 1)

### "Permission denied"
- Personal Access Token에 `repo` 권한이 있는지 확인
- SSH 키가 GitHub에 등록되었는지 확인

### "remote: Invalid username or password"
- Username은 GitHub 사용자명
- Password는 **Personal Access Token** (비밀번호 아님!)

### 토큰을 잃어버렸다면
- GitHub → Settings → Developer settings → Personal access tokens
- 기존 토큰 삭제 후 새로 생성

---

## 📝 빠른 참조

**Personal Access Token 사용 시:**
```bash
git push -u origin main
# Username: jinsseong
# Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (토큰!)
```

**SSH 사용 시:**
```bash
git remote set-url origin git@github.com:jinsseong/trip_moeny_planner.git
git push -u origin main
```

