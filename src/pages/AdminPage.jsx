import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserManagement from '../components/UserManagement';
import SettlementDisplay from '../components/SettlementDisplay';
import '../AdminPage.css';

const API_BASE = '/api';

function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [settlement, setSettlement] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState('users');

  const handleLogout = () => {
    sessionStorage.removeItem('adminLoggedIn');
    navigate('/login');
  };

  useEffect(() => {
    loadUsers();
    loadSettlement();
  }, []);

  useEffect(() => {
    loadSettlement();
  }, [selectedDate]);

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('사용자 로드 오류:', error);
    }
  };

  const loadSettlement = async () => {
    try {
      const response = await fetch(`${API_BASE}/calculate?date=${selectedDate}`);
      const data = await response.json();
      setSettlement(data);
    } catch (error) {
      console.error('정산 계산 오류:', error);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('정말 모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      // 모든 지출 삭제
      const expensesResponse = await fetch(`${API_BASE}/expenses`);
      const expenses = await expensesResponse.json();
      
      for (const expense of expenses) {
        await fetch(`${API_BASE}/expenses?id=${expense.id}`, { method: 'DELETE' });
      }

      // 모든 사용자 삭제
      for (const user of users) {
        await fetch(`${API_BASE}/users?id=${user.id}`, { method: 'DELETE' });
      }

      alert('모든 데이터가 초기화되었습니다.');
      loadUsers();
      loadSettlement();
    } catch (error) {
      console.error('Error:', error);
      alert('데이터 초기화 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div className="header-content">
          <h1>관리자 페이지</h1>
          <div className="header-actions">
            <Link to="/" className="back-button">
              ← 메인으로
            </Link>
            <button onClick={handleLogout} className="logout-button">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="admin-tabs">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          참여자 관리
        </button>
        <button
          className={activeTab === 'settlement' ? 'active' : ''}
          onClick={() => setActiveTab('settlement')}
        >
          정산 결과
        </button>
        <button
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          설정
        </button>
      </div>

      <main className="admin-content">
        {activeTab === 'users' && (
          <UserManagement
            users={users}
            onUsersUpdated={loadUsers}
          />
        )}

        {activeTab === 'settlement' && (
          <div className="settlement-tab">
            <div className="date-selector-wrapper">
              <label htmlFor="admin-date-input">날짜 선택:</label>
              <input
                id="admin-date-input"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
            </div>
            <SettlementDisplay
              settlement={settlement}
              selectedDate={selectedDate}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-tab">
            <h2>설정</h2>
            <div className="settings-section">
              <h3>데이터 관리</h3>
              <div className="settings-item">
                <p>모든 지출 내역과 참여자 정보를 삭제합니다.</p>
                <button
                  onClick={handleResetData}
                  className="danger-button"
                >
                  전체 데이터 초기화
                </button>
              </div>
            </div>
            <div className="settings-section">
              <h3>카테고리 관리</h3>
              <p className="coming-soon">향후 업데이트 예정</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPage;

