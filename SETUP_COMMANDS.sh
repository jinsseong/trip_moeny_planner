#!/bin/bash

# GitHub 연동 처음부터 설정 스크립트
# 이 스크립트를 실행하거나 아래 명령어를 하나씩 실행하세요

echo "🚀 GitHub 연동 설정 시작..."

# 1. 리모트 확인
echo ""
echo "📋 현재 리모트 상태:"
git remote -v

# 2. 기존 리모트 제거 (있는 경우)
echo ""
echo "🗑️  기존 리모트 제거 중..."
git remote remove origin 2>/dev/null || echo "리모트가 없습니다 (건너뜀)"

# 3. 새 리모트 추가
echo ""
echo "➕ 새 리모트 추가 중..."
git remote add origin https://github.com/jinsseong/trip_moeny_planner.git

# 4. 리모트 확인
echo ""
echo "✅ 리모트 설정 완료:"
git remote -v

# 5. 현재 브랜치 확인
echo ""
echo "🌿 현재 브랜치:"
git branch

# 6. 커밋 상태 확인
echo ""
echo "📦 커밋 상태:"
git status --short

echo ""
echo "✅ 준비 완료!"
echo ""
echo "다음 단계:"
echo "1. Personal Access Token 생성: https://github.com/settings/tokens/new"
echo "2. 토큰 생성 후 'repo' 권한 체크"
echo "3. 생성된 토큰 복사"
echo "4. 다음 명령어 실행:"
echo "   git push -u origin main"
echo "   (Username: GitHub 사용자명, Password: Personal Access Token)"
echo ""

