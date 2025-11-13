import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { mkdirSync } from 'fs';

// JSON 파일 기반 데이터베이스 (로컬 테스트용)
const isVercel = process.env.VERCEL === '1';
const dbDir = isVercel ? '/tmp' : join(process.cwd(), 'data');
const dbPath = join(dbDir, 'data.json');

// 데이터 디렉토리 생성
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// 초기 데이터 구조
const initialData = {
  users: [],
  expenses: [],
  expenseParticipants: []
};

function loadData() {
  if (existsSync(dbPath)) {
    try {
      const data = readFileSync(dbPath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('데이터 로드 오류:', error);
      return initialData;
    }
  }
  return initialData;
}

function saveData(data) {
  try {
    writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('데이터 저장 오류:', error);
    throw error;
  }
}

export function initDatabase() {
  const data = loadData();
  saveData(data);
  return {
    prepare: (query) => {
      return {
        all: (params) => {
          if (query.includes('SELECT * FROM users')) {
            return [...data.users].sort((a, b) => a.name.localeCompare(b.name));
          }
          
          // GROUP_CONCAT이 포함된 쿼리 (expenses with participants)
          if (query.includes('GROUP_CONCAT')) {
            let expenses = data.expenses;
            
            // 날짜 필터링
            if (params && params.length > 0) {
              const date = params[0];
              expenses = expenses.filter(e => e.date === date);
            }
            
            // 참여자 정보 추가
            const result = expenses.map(expense => {
              const participants = data.expenseParticipants
                .filter(ep => ep.expense_id === expense.id)
                .map(ep => {
                  const user = data.users.find(u => u.id === ep.user_id);
                  return user ? { id: user.id, name: user.name } : null;
                })
                .filter(Boolean);
              
              return {
                ...expense,
                participant_ids: participants.map(p => p.id).join(','),
                participant_names: participants.map(p => p.name).join(',')
              };
            });
            
            // 정렬
            if (query.includes('ORDER BY e.created_at DESC')) {
              result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            } else if (query.includes('ORDER BY e.date DESC')) {
              result.sort((a, b) => {
                const dateCompare = b.date.localeCompare(a.date);
                if (dateCompare !== 0) return dateCompare;
                return new Date(b.created_at) - new Date(a.created_at);
              });
            }
            
            return result;
          }
          
          if (query.includes('SELECT * FROM expenses')) {
            return data.expenses;
          }
          
          if (query.includes('SELECT') && query.includes('FROM expenses')) {
            // 날짜 필터링
            if (params && params.length > 0) {
              const date = params[0];
              return data.expenses.filter(e => e.date === date);
            }
            return data.expenses;
          }
          
          return [];
        },
        get: (params) => {
          if (query.includes('SELECT * FROM users WHERE id')) {
            return data.users.find(u => u.id === params);
          }
          if (query.includes('SELECT * FROM expenses WHERE id')) {
            return data.expenses.find(e => e.id === params);
          }
          // GROUP_CONCAT이 포함된 쿼리 (단일 항목 조회)
          if (query.includes('GROUP_CONCAT') && query.includes('WHERE e.id')) {
            const expense = data.expenses.find(e => e.id === params);
            if (!expense) return null;
            
            const participants = data.expenseParticipants
              .filter(ep => ep.expense_id === expense.id)
              .map(ep => {
                const user = data.users.find(u => u.id === ep.user_id);
                return user ? { id: user.id, name: user.name } : null;
              })
              .filter(Boolean);
            
            return {
              ...expense,
              participant_ids: participants.map(p => p.id).join(','),
              participant_names: participants.map(p => p.name).join(',')
            };
          }
          return null;
        },
        run: (...args) => {
          // 파라미터를 배열로 변환 (여러 인자 또는 배열)
          const params = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
          
          if (query.includes('INSERT INTO users')) {
            const newId = data.users.length > 0 
              ? Math.max(...data.users.map(u => u.id)) + 1 
              : 1;
            const newUser = {
              id: newId,
              name: params[0],
              created_at: new Date().toISOString()
            };
            data.users.push(newUser);
            saveData(data);
            return { lastInsertRowid: newId };
          }
          if (query.includes('INSERT INTO expenses')) {
            const newId = data.expenses.length > 0 
              ? Math.max(...data.expenses.map(e => e.id)) + 1 
              : 1;
            const newExpense = {
              id: newId,
              date: params[0],
              amount: params[1],
              location: params[2] || null,
              memo: params[3] || null,
              category: params[4] || '기타',
              created_at: new Date().toISOString()
            };
            data.expenses.push(newExpense);
            saveData(data);
            return { lastInsertRowid: newId };
          }
          if (query.includes('INSERT INTO expense_participants')) {
            const newId = data.expenseParticipants.length > 0 
              ? Math.max(...data.expenseParticipants.map(ep => ep.id)) + 1 
              : 1;
            data.expenseParticipants.push({
              id: newId,
              expense_id: params[0],
              user_id: params[1]
            });
            saveData(data);
            return { lastInsertRowid: newId };
          }
          if (query.includes('UPDATE users')) {
            const id = params[1];
            const user = data.users.find(u => u.id === id);
            if (user) {
              user.name = params[0];
              saveData(data);
            }
            return {};
          }
          if (query.includes('UPDATE expenses')) {
            const id = params[5];
            const expense = data.expenses.find(e => e.id === id);
            if (expense) {
              expense.date = params[0];
              expense.amount = params[1];
              expense.location = params[2] || null;
              expense.memo = params[3] || null;
              expense.category = params[4] || '기타';
              saveData(data);
            }
            return {};
          }
          if (query.includes('DELETE FROM users')) {
            const id = params[0];
            data.users = data.users.filter(u => u.id !== id);
            data.expenseParticipants = data.expenseParticipants.filter(ep => ep.user_id !== id);
            saveData(data);
            return {};
          }
          if (query.includes('DELETE FROM expenses')) {
            const id = params[0];
            data.expenses = data.expenses.filter(e => e.id !== id);
            data.expenseParticipants = data.expenseParticipants.filter(ep => ep.expense_id !== id);
            saveData(data);
            return {};
          }
          if (query.includes('DELETE FROM expense_participants')) {
            const expenseId = params[0];
            data.expenseParticipants = data.expenseParticipants.filter(ep => ep.expense_id !== expenseId);
            saveData(data);
            return {};
          }
          return {};
        }
      };
    },
    transaction: (fn) => {
      // JSON에서는 단순히 함수 실행 (원자성 보장을 위해 동기 실행)
      return fn();
    },
    exec: (query) => {
      // 테이블 생성은 무시 (JSON에서는 필요 없음)
    }
  };
}

export function getDatabase() {
  const data = loadData();
  const db = {
    prepare: (query) => {
      return {
        all: (params) => {
          if (query.includes('SELECT * FROM users')) {
            return [...data.users].sort((a, b) => a.name.localeCompare(b.name));
          }
          
          // GROUP_CONCAT이 포함된 쿼리 (expenses with participants)
          if (query.includes('GROUP_CONCAT')) {
            let expenses = data.expenses;
            
            // 날짜 필터링
            if (params && params.length > 0) {
              const date = params[0];
              expenses = expenses.filter(e => e.date === date);
            }
            
            // 참여자 정보 추가
            const result = expenses.map(expense => {
              const participants = data.expenseParticipants
                .filter(ep => ep.expense_id === expense.id)
                .map(ep => {
                  const user = data.users.find(u => u.id === ep.user_id);
                  return user ? { id: user.id, name: user.name } : null;
                })
                .filter(Boolean);
              
              return {
                ...expense,
                participant_ids: participants.map(p => p.id).join(','),
                participant_names: participants.map(p => p.name).join(',')
              };
            });
            
            // 정렬
            if (query.includes('ORDER BY e.created_at DESC')) {
              result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            } else if (query.includes('ORDER BY e.date DESC')) {
              result.sort((a, b) => {
                const dateCompare = b.date.localeCompare(a.date);
                if (dateCompare !== 0) return dateCompare;
                return new Date(b.created_at) - new Date(a.created_at);
              });
            }
            
            return result;
          }
          
          if (query.includes('SELECT * FROM expenses')) {
            return data.expenses;
          }
          
          if (query.includes('SELECT') && query.includes('FROM expenses')) {
            // 날짜 필터링
            if (params && params.length > 0) {
              const date = params[0];
              return data.expenses.filter(e => e.date === date);
            }
            return data.expenses;
          }
          
          return [];
        },
        get: (params) => {
          if (query.includes('SELECT * FROM users WHERE id')) {
            return data.users.find(u => u.id === params);
          }
          if (query.includes('SELECT * FROM expenses WHERE id')) {
            return data.expenses.find(e => e.id === params);
          }
          // GROUP_CONCAT이 포함된 쿼리 (단일 항목 조회)
          if (query.includes('GROUP_CONCAT') && query.includes('WHERE e.id')) {
            const expense = data.expenses.find(e => e.id === params);
            if (!expense) return null;
            
            const participants = data.expenseParticipants
              .filter(ep => ep.expense_id === expense.id)
              .map(ep => {
                const user = data.users.find(u => u.id === ep.user_id);
                return user ? { id: user.id, name: user.name } : null;
              })
              .filter(Boolean);
            
            return {
              ...expense,
              participant_ids: participants.map(p => p.id).join(','),
              participant_names: participants.map(p => p.name).join(',')
            };
          }
          return null;
        },
        run: (...args) => {
          // 파라미터를 배열로 변환 (여러 인자 또는 배열)
          const params = args.length === 1 && Array.isArray(args[0]) ? args[0] : args;
          
          if (query.includes('INSERT INTO users')) {
            const newId = data.users.length > 0 
              ? Math.max(...data.users.map(u => u.id)) + 1 
              : 1;
            const newUser = {
              id: newId,
              name: params[0],
              created_at: new Date().toISOString()
            };
            data.users.push(newUser);
            saveData(data);
            return { lastInsertRowid: newId };
          }
          if (query.includes('INSERT INTO expenses')) {
            const newId = data.expenses.length > 0 
              ? Math.max(...data.expenses.map(e => e.id)) + 1 
              : 1;
            const newExpense = {
              id: newId,
              date: params[0],
              amount: params[1],
              location: params[2] || null,
              memo: params[3] || null,
              category: params[4] || '기타',
              created_at: new Date().toISOString()
            };
            data.expenses.push(newExpense);
            saveData(data);
            return { lastInsertRowid: newId };
          }
          if (query.includes('INSERT INTO expense_participants')) {
            const newId = data.expenseParticipants.length > 0 
              ? Math.max(...data.expenseParticipants.map(ep => ep.id)) + 1 
              : 1;
            data.expenseParticipants.push({
              id: newId,
              expense_id: params[0],
              user_id: params[1]
            });
            saveData(data);
            return { lastInsertRowid: newId };
          }
          if (query.includes('UPDATE users')) {
            const id = params[1];
            const user = data.users.find(u => u.id === id);
            if (user) {
              user.name = params[0];
              saveData(data);
            }
            return {};
          }
          if (query.includes('UPDATE expenses')) {
            const id = params[5];
            const expense = data.expenses.find(e => e.id === id);
            if (expense) {
              expense.date = params[0];
              expense.amount = params[1];
              expense.location = params[2] || null;
              expense.memo = params[3] || null;
              expense.category = params[4] || '기타';
              saveData(data);
            }
            return {};
          }
          if (query.includes('DELETE FROM users')) {
            const id = params[0];
            data.users = data.users.filter(u => u.id !== id);
            data.expenseParticipants = data.expenseParticipants.filter(ep => ep.user_id !== id);
            saveData(data);
            return {};
          }
          if (query.includes('DELETE FROM expenses')) {
            const id = params[0];
            data.expenses = data.expenses.filter(e => e.id !== id);
            data.expenseParticipants = data.expenseParticipants.filter(ep => ep.expense_id !== id);
            saveData(data);
            return {};
          }
          if (query.includes('DELETE FROM expense_participants')) {
            const expenseId = params[0];
            data.expenseParticipants = data.expenseParticipants.filter(ep => ep.expense_id !== expenseId);
            saveData(data);
            return {};
          }
          return {};
        }
      };
    },
    transaction: (fn) => {
      // JSON에서는 단순히 함수 실행 (원자성 보장을 위해 동기 실행)
      return fn();
    }
  };
  return db;
}

