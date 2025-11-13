// 프로필 아바타 생성 유틸리티

// 이니셜 추출
export function getInitials(name) {
  if (!name) return '?';
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

// 이름에서 색상 생성 (일관된 색상)
export function getAvatarColor(name) {
  if (!name) return '#6c757d';
  
  const colors = [
    '#4a90e2', // 부드러운 블루
    '#50c878', // 부드러운 그린
    '#f5a623', // 따뜻한 오렌지
    '#9013fe', // 부드러운 퍼플
    '#e94b3c', // 부드러운 레드
    '#00d4aa', // 민트 그린
    '#7b68ee', // 미디엄 슬레이트 블루
    '#ff6b6b', // 코랄
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// 아바타 컴포넌트용 스타일 생성
export function getAvatarStyle(name) {
  return {
    backgroundColor: getAvatarColor(name),
    color: '#ffffff',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    flexShrink: 0,
  };
}

