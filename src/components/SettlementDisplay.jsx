import React from 'react';
import Avatar from './Avatar';

function SettlementDisplay({ settlement, selectedDate }) {
  if (!settlement) {
    return (
      <div className="settlement-display-empty">
        <p>정산 정보를 불러오는 중...</p>
      </div>
    );
  }

  const { totalAmount, userTotals, expenses } = settlement;

  return (
    <div className="settlement-display-container">
      <h2>{selectedDate} 정산 결과</h2>

      <div className="total-amount-card">
        <div className="total-label">하루 총 지출</div>
        <div className="total-value">{totalAmount.toLocaleString()}원</div>
      </div>

      <div className="user-totals-section">
        <h3>개인별 부담 금액</h3>
        <div className="user-totals-list">
          {userTotals.length === 0 ? (
            <p className="empty-message">참여자가 없습니다.</p>
          ) : (
            userTotals.map(user => (
              <div key={user.id} className="user-total-item">
                <div className="user-info">
                  <Avatar name={user.name} size={36} />
                  <span className="user-name">{user.name}</span>
                </div>
                <span className="user-amount">
                  {user.amount.toLocaleString()}원
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="expenses-summary-section">
        <h3>지출 내역 요약</h3>
        <div className="expenses-summary">
          {expenses.length === 0 ? (
            <p className="empty-message">지출 내역이 없습니다.</p>
          ) : (
            expenses.map(expense => {
              const participantCount = Array.isArray(expense.participant_ids) 
                ? expense.participant_ids.length 
                : (expense.participant_ids ? 1 : 0);
              const perPerson = participantCount > 0
                ? Math.floor(expense.amount / participantCount)
                : 0;
              const remainder = participantCount > 0
                ? expense.amount % participantCount
                : 0;

              return (
                <div key={expense.id} className="expense-summary-item">
                  <div className="summary-amount">{expense.amount.toLocaleString()}원</div>
                  {expense.location && (
                    <div className="summary-location">📍 {expense.location}</div>
                  )}
                  <div className="summary-participants">
                    <div className="participant-avatars">
                      {expense.participant_ids && expense.participant_ids.length > 0 ? (
                        expense.participant_ids.map((userId, idx) => {
                          const userName = Array.isArray(expense.participant_names) 
                            ? expense.participant_names[idx]
                            : (expense.participant_names || '').split(',')[idx];
                          return userName ? (
                            <Avatar key={userId} name={userName} size={24} />
                          ) : null;
                        })
                      ) : (
                        <span className="no-participants">참여자 없음</span>
                      )}
                    </div>
                  </div>
                  <div className="summary-split">
                    인당: {perPerson.toLocaleString()}원
                    {remainder > 0 && ` (+${remainder}원 나머지)`}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default SettlementDisplay;

