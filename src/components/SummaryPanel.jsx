import React, { useState } from 'react';
import Avatar from './Avatar';
import '../SummaryPanel.css';

function SummaryPanel({ expenses, todayExpenses, todayTotal, settlement, selectedDate }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="summary-panel">
      <div className="summary-main">
        <div className="summary-item">
          <span className="summary-label">오늘 총 지출</span>
          <span className="summary-value today">{todayTotal.toLocaleString()}원</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">전체 총 지출</span>
          <span className="summary-value total">{totalAmount.toLocaleString()}원</span>
        </div>
        <button
          className="expand-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '접기' : '개인별 부담금 보기'}
        </button>
      </div>

      {isExpanded && settlement && settlement.userTotals && settlement.userTotals.length > 0 && (
        <div className="summary-details">
          <h3>개인별 부담금</h3>
          <div className="user-summary-list">
            {settlement.userTotals.map(user => (
              <div key={user.id} className="user-summary-item">
                <div className="user-info">
                  {user.name && <Avatar name={user.name} size={32} />}
                  <span className="user-name">{user.name || '이름 없음'}</span>
                </div>
                <span className="user-amount">{user.amount.toLocaleString()}원</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SummaryPanel;

