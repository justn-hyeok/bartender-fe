import { useState, useEffect } from 'react';
import type { TodoItem } from '../types/todo';
import { todoService } from '../services/todoService';

const mockTodos: TodoItem[] = [
  {
    id: '1',
    title: '코딩 공부하기',
    content: 'React와 TypeScript를 이용한 Todo 앱 개발하기. 컴포넌트 구조를 잘 설계하고 재사용 가능한 코드 작성하기',
    priority: 1,
    category: '노가다',
    startDate: '2025-08-19',
    dueDate: '2025-08-25',
    completed: false
  },
  {
    id: '2',
    title: '운동하기',
    content: '매일 30분씩 운동하기. 헬스장에서 근력운동과 유산소 운동을 병행하여 건강 관리하기',
    priority: 2,
    category: '잡일',
    startDate: '2025-08-19',
    dueDate: '2025-08-20',
    completed: false
  },
  {
    id: '3',
    title: '프로젝트 문서 작성',
    content: 'API 명세서와 사용자 매뉴얼 작성하기. 개발자와 사용자 모두가 이해하기 쉽도록 상세히 작성',
    priority: 3,
    category: '노가다',
    startDate: '2025-08-18',
    dueDate: '2025-08-19',
    completed: false
  },
  {
    id: '4',
    title: '장보기',
    content: '냉장고에 있는 식재료 확인하고 부족한 것들 마트에서 구매하기. 일주일치 식료품 준비',
    priority: 2,
    category: '잡일',
    startDate: '2025-08-19',
    dueDate: '2025-08-21',
    completed: false
  },
  {
    id: '5',
    title: '책 읽기',
    content: '클린 코드 책 3장까지 읽기. 중요한 내용들은 노트에 정리하고 실제 코딩에 적용해보기',
    priority: 1,
    category: '개발',
    startDate: '2025-08-19',
    dueDate: '2025-08-22',
    completed: false
  }
];

export function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // API가 없을 때는 목 데이터 사용
      setTimeout(() => {
        setTodos(mockTodos);
        setLoading(false);
      }, 500);
      
      // 실제 API 호출 (현재는 주석 처리)
      // const response = await todoService.getAllTodos();
      // if (response.success) {
      //   setTodos(response.data);
      // } else {
      //   setError('할 일 목록을 불러오는데 실패했습니다.');
      // }
    } catch (err) {
      setError('서버와 연결할 수 없습니다.');
      console.error('Failed to fetch todos:', err);
      setLoading(false);
    }
  };

  const completeTodo = async (id: string) => {
    try {
      // 목 데이터 사용 시 로컬 상태만 업데이트
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: true } : todo
      ));
      
      // 실제 API 호출 (현재는 주석 처리)
      // const response = await todoService.completeTodo(id);
      // if (response.success) {
      //   setTodos(todos.map(todo => 
      //     todo.id === id ? { ...todo, completed: true } : todo
      //   ));
      // }
    } catch (err) {
      console.error('Failed to complete todo:', err);
      setError('할 일 완료에 실패했습니다.');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      // 목 데이터 사용 시 로컬 상태만 업데이트
      setTodos(todos.filter(todo => todo.id !== id));
      
      // 실제 API 호출 (현재는 주석 처리)
      // await todoService.deleteTodo(id);
      // setTodos(todos.filter(todo => todo.id !== id));
    } catch (err) {
      console.error('Failed to delete todo:', err);
      setError('할 일 삭제에 실패했습니다.');
    }
  };

  const refreshTodos = () => {
    fetchTodos();
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return {
    todos,
    loading,
    error,
    completeTodo,
    deleteTodo,
    refreshTodos
  };
}