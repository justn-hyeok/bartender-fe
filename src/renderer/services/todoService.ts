import type { TodoListResponse, TodoResponse, CreateTodoRequest, UpdateTodoRequest } from '../types/todo';

class TodoService {
  private baseUrl = 'http://localhost:3000/api/todos'; // 백엔드 API 엔드포인트

  async getAllTodos(): Promise<TodoListResponse> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch todos:', error);
      return {
        success: false,
        data: []
      };
    }
  }

  async getTodoById(id: string): Promise<TodoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch todo ${id}:`, error);
      throw error;
    }
  }

  async createTodo(todo: CreateTodoRequest): Promise<TodoResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todo),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to create todo:', error);
      throw error;
    }
  }

  async updateTodo(id: string, updates: UpdateTodoRequest): Promise<TodoResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to update todo ${id}:`, error);
      throw error;
    }
  }

  async deleteTodo(id: string): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return { success: true };
    } catch (error) {
      console.error(`Failed to delete todo ${id}:`, error);
      throw error;
    }
  }

  async completeTodo(id: string): Promise<TodoResponse> {
    return this.updateTodo(id, { completed: true });
  }
}

export const todoService = new TodoService();