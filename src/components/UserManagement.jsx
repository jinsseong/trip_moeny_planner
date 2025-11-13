import React, { useState } from 'react';
import Avatar from './Avatar';

const API_BASE = '/api';

function UserManagement({ users, onUsersUpdated }) {
  const [newUserName, setNewUserName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddUser = async (e) => {
    e.preventDefault();

    if (!newUserName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newUserName.trim() }),
      });

      if (response.ok) {
        setNewUserName('');
        onUsersUpdated();
      } else {
        const error = await response.json();
        alert(error.error || '사용자 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('사용자 추가 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditName(user.name);
  };

  const handleEditSubmit = async (id) => {
    if (!editName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name: editName.trim() }),
      });

      if (response.ok) {
        setEditingId(null);
        setEditName('');
        onUsersUpdated();
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
    if (!window.confirm('정말 삭제하시겠습니까? 관련된 지출 항목의 참여자 정보도 함께 삭제됩니다.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/users?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUsersUpdated();
      } else {
        const error = await response.json();
        alert(error.error || '삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="user-management-container">
      <h2>참여자 관리</h2>

      <div className="add-user-form">
        <form onSubmit={handleAddUser}>
          <div className="form-group">
            <input
              type="text"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              placeholder="참여자 이름 입력"
              required
            />
            <button
              type="submit"
              className="add-button"
              disabled={isSubmitting || !newUserName.trim()}
            >
              {isSubmitting ? '추가 중...' : '추가'}
            </button>
          </div>
        </form>
      </div>

      <div className="user-list">
        {users.length === 0 ? (
          <p className="empty-message">등록된 참여자가 없습니다.</p>
        ) : (
          users.map(user => (
            <div key={user.id} className="user-item">
              {editingId === user.id ? (
                <div className="user-edit-form">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="edit-input"
                  />
                  <button
                    onClick={() => handleEditSubmit(user.id)}
                    className="save-button"
                    disabled={!editName.trim()}
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditName('');
                    }}
                    className="cancel-button"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <>
                  <div className="user-info">
                    <Avatar name={user.name} size={32} />
                    <span className="user-name">{user.name}</span>
                  </div>
                  <div className="user-actions">
                    <button
                      onClick={() => handleEdit(user)}
                      className="edit-button"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="delete-button"
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserManagement;

