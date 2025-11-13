import React, { useState } from 'react';
import Avatar from './Avatar';

const API_BASE = '/api';

function ExpenseList({ expenses, users, onExpenseUpdated, onExpenseDeleted }) {
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEdit = (expense) => {
    setEditingId(expense.id);
    setEditForm({
      amount: expense.amount,
      location: expense.location || '',
      memo: expense.memo || '',
      category: expense.category || '기타',
      participant_ids: expense.participant_ids || [],
    });
  };

  const handleEditSubmit = async (id) => {
    try {
      const expense = expenses.find(e => e.id === id);
      const response = await fetch(`${API_BASE}/expenses`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          date: expense.date,
          ...editForm,
        }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditForm({});
        onExpenseUpdated();
      } else {
        const error = await response.json();
        alert(error.error || '수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/expenses?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onExpenseDeleted();
      } else {
        const error = await response.json();
        alert(error.error || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleParticipantToggle = (userId) => {
    setEditForm(prev => ({
      ...prev,
      participant_ids: prev.participant_ids.includes(userId)
        ? prev.participant_ids.filter(id => id !== userId)
        : [...prev.participant_ids, userId]
    }));
  };

  if (expenses.length === 0) {
    return (
      <div className="expense-list-empty">
        <p>등록된 지출 항목이 없습니다.</p>
      </div>
    );
  }

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="expense-list-container">
      <div className="expense-list-header">
        <h2>지출 목록</h2>
        <div className="total-amount">
          총 지출: <strong>{totalAmount.toLocaleString()}원</strong>
        </div>
      </div>

      <div className="expense-list">
        {expenses.map(expense => (
          <div key={expense.id} className="expense-item">
            {editingId === expense.id ? (
              <div className="expense-edit-form">
                <div className="form-group">
                  <label>금액</label>
                  <input
                    type="number"
                    value={editForm.amount}
                    onChange={(e) => setEditForm({ ...editForm, amount: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>위치</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>비고</label>
                  <textarea
                    value={editForm.memo}
                    onChange={(e) => setEditForm({ ...editForm, memo: e.target.value })}
                    rows="2"
                  />
                </div>
                <div className="form-group">
                  <label>참여자</label>
                  <div className="participants-checkbox">
                    {users.map(user => (
                      <label key={user.id} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={editForm.participant_ids.includes(user.id)}
                          onChange={() => handleParticipantToggle(user.id)}
                        />
                        <Avatar name={user.name} size={28} />
                        <span>{user.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="edit-actions">
                  <button
                    onClick={() => handleEditSubmit(expense.id)}
                    className="save-button"
                    disabled={editForm.participant_ids.length === 0}
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditForm({});
                    }}
                    className="cancel-button"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="expense-info">
                  <div className="expense-amount">{expense.amount.toLocaleString()}원</div>
                  {expense.location && (
                    <div className="expense-location">📍 {expense.location}</div>
                  )}
                  {expense.memo && (
                    <div className="expense-memo">{expense.memo}</div>
                  )}
                  <div className="expense-participants">
                    <div className="participant-avatars">
                      {expense.participant_ids && expense.participant_ids.length > 0 ? (
                        expense.participant_ids.map(userId => {
                          const user = users.find(u => u.id === userId);
                          return user ? (
                            <Avatar key={userId} name={user.name} size={24} />
                          ) : null;
                        })
                      ) : (
                        <span className="no-participants">참여자 없음</span>
                      )}
                    </div>
                    {expense.participant_ids && expense.participant_ids.length > 0 && (
                      <span className="split-info">
                        인당: {Math.floor(expense.amount / expense.participant_ids.length).toLocaleString()}원
                      </span>
                    )}
                  </div>
                </div>
                <div className="expense-actions">
                  <button
                    onClick={() => handleEdit(expense)}
                    className="edit-button"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="delete-button"
                  >
                    삭제
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExpenseList;

