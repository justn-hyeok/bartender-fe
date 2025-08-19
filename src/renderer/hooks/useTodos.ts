import { useState, useEffect } from 'react';
import type { TodoItem } from '../types/todo';
import { todoService } from '../services/todoService';

export function useTodos() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await todoService.getAllTodos();
      
      if (response.success) {
        setTodos(response.data);
      } else {
        setError('할 일 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      setError('서버와 연결할 수 없습니다.');
      console.error('Failed to fetch todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const completeTodo = async (id: string) => {
    try {
      const response = await todoService.completeTodo(id);
      if (response.success) {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, completed: true } : todo
        ));
      }
    } catch (err) {
      console.error('Failed to complete todo:', err);
      setError('할 일 완료에 실패했습니다.');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
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