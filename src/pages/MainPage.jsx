import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ExpenseTable from '../components/ExpenseTable';
import SummaryPanel from '../components/SummaryPanel';
import '../MainPage.css';

const API_BASE = '/api';

function MainPage() {
  const [expenses, setExpenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [settlement, setSettlement] = useState(null);

  useEffect(() => {
    loadUsers();
    loadExpenses();
  }, []);

  useEffect(() => {
    if (users.length > 0) {
      loadExpenses();
      loadSettlement();
    }
  }, [selectedDate, users.length]);

  const loadUsers = async () => {
    try {
      const response = await fetch(`${API_BASE}/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('사용자 로드 오류:', error);
    }
  };

  const loadExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE}/expenses`);
      const data = await response.json();
      // 날짜순 정렬 (최신순)
      const sorted = data.sort((a, b) => {
        const dateCompare = b.date.localeCompare(a.date);
        if (dateCompare !== 0) return dateCompare;
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setExpenses(sorted);
    } catch (error) {
      console.error('지출 로드 오류:', error);
    }
  };

  const loadSettlement = async () => {
    try {
      const response = await fetch(`${API_BASE}/calculate`);
      const data = await response.json();
      setSettlement(data);
    } catch (error) {
      console.error('정산 계산 오류:', error);
    }
  };

  const handleExpenseAdded = () => {
    loadExpenses();
    loadSettlement();
  };

  const handleExpenseUpdated = () => {
    loadExpenses();
    loadSettlement();
  };

  const handleExpenseDeleted = () => {
    loadExpenses();
    loadSettlement();
  };

  const todayExpenses = expenses.filter(e => e.date === selectedDate);
  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="main-page">
      <header className="main-header">
        <div className="header-content">
          <h1>여행 정산 가계부</h1>
          <div className="header-actions">
            <div className="date-selector">
              <label htmlFor="date-input">날짜:</label>
              <input
                id="date-input"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-input"
              />
            </div>
            <Link to="/login" className="admin-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"></path>
              </svg>
              관리자
            </Link>
          </div>
        </div>
      </header>

      <main className="main-content">
        <ExpenseTable
          expenses={expenses}
          users={users}
          selectedDate={selectedDate}
          onExpenseAdded={handleExpenseAdded}
          onExpenseUpdated={handleExpenseUpdated}
          onExpenseDeleted={handleExpenseDeleted}
        />

        <SummaryPanel
          expenses={expenses}
          todayExpenses={todayExpenses}
          todayTotal={todayTotal}
          settlement={settlement}
          selectedDate={selectedDate}
        />
      </main>
    </div>
  );
}

export default MainPage;

