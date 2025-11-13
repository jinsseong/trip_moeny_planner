import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../LoginPage.css';

const ADMIN_ID = 'admin';
const ADMIN_PASSWORD = '관리자98';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (username === ADMIN_ID && password === ADMIN_PASSWORD) {
      // 로그인 성공 - 세션 스토리지에 저장
      sessionStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin');
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>관리자 로그인</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">아이디</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력하세요"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
        <div className="login-footer">
          <button onClick={() => navigate('/')} className="back-to-main">
            메인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

