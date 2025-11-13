import React, { useState } from 'react';
import Avatar from './Avatar';

const API_BASE = '/api';

function ExpenseForm({ users, selectedDate, onExpenseAdded }) {
  const [amount, setAmount] = useState('');
  const [location, setLocation] = useState('');
  const [memo, setMemo] = useState('');
  const [category, setCategory] = useState('기타');
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleParticipantToggle = (userId) => {
    setSelectedParticipants(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || selectedParticipants.length === 0) {
      alert('금액과 참여자를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          amount: parseInt(amount),
          location: location.trim() || null,
          memo: memo.trim() || null,
          category: category,
          participant_ids: selectedParticipants,
        }),
      });

      if (response.ok) {
        // 폼 초기화
        setAmount('');
        setLocation('');
        setMemo('');
        setCategory('기타');
        setSelectedParticipants([]);
        onExpenseAdded();
      } else {
        const error = await response.json();
        alert(error.error || '지출 항목 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('지출 항목 추가 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (users.length === 0) {
    return (
      <div className="expense-form-empty">
        <p>먼저 참여자를 추가해주세요.</p>
      </div>
    );
  }

  return (
    <div className="expense-form-container">
      <h2>새 지출 항목 추가</h2>
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-group">
          <label htmlFor="amount">금액 *</label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="예: 50000"
            required
            min="1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">사용 위치/장소</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="예: 식당, 호텔, 교통비 등"
          />
        </div>

        <div className="form-group">
          <label htmlFor="memo">비고/메모</label>
          <textarea
            id="memo"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="추가 정보를 입력하세요"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">카테고리</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="기타">기타</option>
          </select>
        </div>

        <div className="form-group">
          <label>참여자 선택 *</label>
          <div className="participants-checkbox">
            {users.map(user => (
              <label key={user.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedParticipants.includes(user.id)}
                  onChange={() => handleParticipantToggle(user.id)}
                />
                <Avatar name={user.name} size={28} />
                <span>{user.name}</span>
              </label>
            ))}
          </div>
          {selectedParticipants.length > 0 && (
            <div className="split-info">
              {amount && (
                <span className="split-amount">
                  인당: {Math.floor(parseInt(amount) / selectedParticipants.length).toLocaleString()}원
                  {parseInt(amount) % selectedParticipants.length > 0 && (
                    <span className="remainder">
                      {' '}(나머지 {parseInt(amount) % selectedParticipants.length}원)
                    </span>
                  )}
                </span>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={isSubmitting || !amount || selectedParticipants.length === 0}
        >
          {isSubmitting ? '추가 중...' : '지출 항목 추가'}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;

