import React, { useState, Fragment } from 'react';
import Avatar from './Avatar';
import '../ExpenseTable.css';

const API_BASE = '/api';

function ExpenseTable({ expenses, users, selectedDate, selectedTripId, onExpenseAdded, onExpenseUpdated, onExpenseDeleted }) {
  const [editingCell, setEditingCell] = useState(null);
  const [newRow, setNewRow] = useState({
    date: selectedDate,
    location: '',
    item_name: '',
    memo: '',
    amount: '',
    participant_ids: [],
    category: '기타'
  });

  const handleCellClick = (expenseId, field) => {
    setEditingCell({ expenseId, field });
  };

  const handleCellChange = async (expenseId, field, value) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;

    let updateData = { ...expense };
    
    if (field === 'amount') {
      updateData.amount = parseInt(value) || 0;
    } else if (field === 'participant_ids') {
      // 참여자 변경은 별도 처리
      return;
    } else {
      updateData[field] = value;
    }

    try {
      const response = await fetch(`${API_BASE}/expenses`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: expenseId,
          date: updateData.date,
          amount: updateData.amount,
          location: updateData.location || null,
          item_name: updateData.item_name || null,
          memo: updateData.memo || null,
          category: updateData.category || '기타',
          participant_ids: updateData.participant_ids || []
        }),
      });

      if (response.ok) {
        onExpenseUpdated();
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setEditingCell(null);
  };

  const handleParticipantToggle = async (expenseId, userId) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;

    const currentIds = expense.participant_ids || [];
    const newIds = currentIds.includes(userId)
      ? currentIds.filter(id => id !== userId)
      : [...currentIds, userId];

    try {
      const response = await fetch(`${API_BASE}/expenses`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: expenseId,
          date: expense.date,
          amount: expense.amount,
          location: expense.location || null,
          item_name: expense.item_name || null,
          memo: expense.memo || null,
          category: expense.category || '기타',
          participant_ids: newIds
        }),
      });

      if (response.ok) {
        onExpenseUpdated();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddRow = async () => {
    if (!newRow.amount || newRow.participant_ids.length === 0) {
      alert('금액과 참여자를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newRow.date,
          amount: parseInt(newRow.amount),
          location: newRow.location || null,
          item_name: newRow.item_name || null,
          memo: newRow.memo || null,
          category: newRow.category,
          participant_ids: newRow.participant_ids,
          trip_id: selectedTripId || null
        }),
      });

      if (response.ok) {
        setNewRow({
          date: selectedDate,
          location: '',
          item_name: '',
          memo: '',
          amount: '',
          participant_ids: [],
          category: '기타'
        });
        onExpenseAdded();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('지출 항목 추가 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteRow = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/expenses?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onExpenseDeleted();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}`;
  };

  const formatDateFull = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${year}.${month}.${day} (${weekday})`;
  };

  // expenses가 배열인지 확인
  if (!Array.isArray(expenses)) {
    console.error('expenses가 배열이 아닙니다:', expenses);
    return (
      <div className="expense-table-container">
        <div className="table-wrapper">
          <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </div>
    );
  }

  // 날짜별로 그룹핑
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => b.localeCompare(a));

  return (
    <div className="expense-table-container">
      <div className="table-wrapper">
        <table className="expense-table">
          <thead>
            <tr>
              <th className="col-date">날짜</th>
              <th className="col-location">장소</th>
              <th className="col-memo">항목</th>
              <th className="col-amount">금액</th>
              <th className="col-participants">참여자</th>
              <th className="col-note">메모</th>
              <th className="col-actions">삭제</th>
            </tr>
          </thead>
          <tbody>
            {sortedDates.map(date => {
              const dateExpenses = groupedExpenses[date];
              return (
                <Fragment key={date}>
                  {dateExpenses.map((expense, index) => (
              <tr key={expense.id} className="expense-row">
                <td className="cell-date">
                  {index === 0 ? (
                    <div className="date-header">
                      {formatDateFull(expense.date)}
                    </div>
                  ) : (
                    <div className="date-empty"></div>
                  )}
                  {editingCell?.expenseId === expense.id && editingCell?.field === 'date' ? (
                    <input
                      type="date"
                      value={expense.date}
                      onBlur={(e) => handleCellChange(expense.id, 'date', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCellChange(expense.id, 'date', e.target.value);
                        }
                      }}
                      autoFocus
                    />
                  ) : index === 0 ? null : (
                    <span onClick={() => handleCellClick(expense.id, 'date')} className="date-edit">
                      {formatDate(expense.date)}
                    </span>
                  )}
                </td>
                <td className="cell-location">
                  {editingCell?.expenseId === expense.id && editingCell?.field === 'location' ? (
                    <input
                      type="text"
                      value={expense.location || ''}
                      onBlur={(e) => handleCellChange(expense.id, 'location', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCellChange(expense.id, 'location', e.target.value);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <span onClick={() => handleCellClick(expense.id, 'location')}>
                      {expense.location || '-'}
                    </span>
                  )}
                </td>
                <td className="cell-memo">
                  {editingCell?.expenseId === expense.id && editingCell?.field === 'item_name' ? (
                    <input
                      type="text"
                      value={expense.item_name || ''}
                      onBlur={(e) => handleCellChange(expense.id, 'item_name', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCellChange(expense.id, 'item_name', e.target.value);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <span onClick={() => handleCellClick(expense.id, 'item_name')}>
                      {expense.item_name || '-'}
                    </span>
                  )}
                </td>
                <td className="cell-amount">
                  {editingCell?.expenseId === expense.id && editingCell?.field === 'amount' ? (
                    <input
                      type="number"
                      value={expense.amount}
                      onBlur={(e) => handleCellChange(expense.id, 'amount', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCellChange(expense.id, 'amount', e.target.value);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <span onClick={() => handleCellClick(expense.id, 'amount')}>
                      {expense.amount.toLocaleString()}원
                    </span>
                  )}
                </td>
                <td className="cell-participants">
                  <ParticipantCell
                    expense={expense}
                    users={users}
                    onToggle={(userId) => handleParticipantToggle(expense.id, userId)}
                  />
                </td>
                <td className="cell-note">
                  {editingCell?.expenseId === expense.id && editingCell?.field === 'memo' ? (
                    <input
                      type="text"
                      value={expense.memo || ''}
                      onBlur={(e) => handleCellChange(expense.id, 'memo', e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleCellChange(expense.id, 'memo', e.target.value);
                        }
                      }}
                      autoFocus
                    />
                  ) : (
                    <span onClick={() => handleCellClick(expense.id, 'memo')}>
                      {expense.memo || '-'}
                    </span>
                  )}
                </td>
                <td className="cell-actions">
                  <button
                    onClick={() => handleDeleteRow(expense.id)}
                    className="delete-row-button"
                    title="삭제"
                  >
                    ×
                  </button>
                </td>
              </tr>
                  ))}
                </Fragment>
              );
            })}
            {/* 새 행 추가 */}
            <tr className="new-row">
              <td className="cell-date">
                <input
                  type="date"
                  value={newRow.date}
                  onChange={(e) => setNewRow({ ...newRow, date: e.target.value })}
                />
              </td>
              <td className="cell-location">
                <input
                  type="text"
                  placeholder="장소"
                  value={newRow.location}
                  onChange={(e) => setNewRow({ ...newRow, location: e.target.value })}
                />
              </td>
              <td className="cell-memo">
                <input
                  type="text"
                  placeholder="항목명"
                  value={newRow.item_name}
                  onChange={(e) => setNewRow({ ...newRow, item_name: e.target.value })}
                />
              </td>
              <td className="cell-amount">
                <input
                  type="number"
                  placeholder="금액"
                  value={newRow.amount}
                  onChange={(e) => setNewRow({ ...newRow, amount: e.target.value })}
                />
              </td>
              <td className="cell-participants">
                <div className="participant-selector">
                  {users.map(user => (
                    <label key={user.id} className="participant-checkbox">
                      <input
                        type="checkbox"
                        checked={newRow.participant_ids.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewRow({ ...newRow, participant_ids: [...newRow.participant_ids, user.id] });
                          } else {
                            setNewRow({ ...newRow, participant_ids: newRow.participant_ids.filter(id => id !== user.id) });
                          }
                        }}
                      />
                      <Avatar name={user.name} size={20} />
                    </label>
                  ))}
                </div>
              </td>
              <td className="cell-note">
                <input
                  type="text"
                  placeholder="메모"
                  value={newRow.memo}
                  onChange={(e) => setNewRow({ ...newRow, memo: e.target.value })}
                />
              </td>
              <td className="cell-actions">
                <button
                  onClick={handleAddRow}
                  className="add-row-button"
                  title="추가"
                >
                  +
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ParticipantCell({ expense, users, onToggle }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="participant-cell">
      <div className="participant-avatars" onClick={() => setIsOpen(!isOpen)}>
        {expense.participant_ids && expense.participant_ids.length > 0 ? (
          expense.participant_ids.map(userId => {
            const user = users.find(u => u.id === userId);
            return user ? (
              <Avatar key={userId} name={user.name} size={24} />
            ) : null;
          })
        ) : (
          <span className="no-participants">선택</span>
        )}
      </div>
      {isOpen && (
        <div className="participant-dropdown">
          {users.map(user => (
            <label key={user.id} className="participant-option">
              <input
                type="checkbox"
                checked={expense.participant_ids?.includes(user.id)}
                onChange={() => onToggle(user.id)}
              />
              <Avatar name={user.name} size={24} />
              <span>{user.name}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpenseTable;

