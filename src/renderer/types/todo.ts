export interface TodoResponse {
  success: boolean;
  data: TodoItem;
}

export interface TodoListResponse {
  success: boolean;
  data: TodoItem[];
}

export interface TodoItem {
  id: string;
  title: string;
  content: string;
  priority: number;
  category: string;
  startDate: string;
  dueDate: string;
  completed: boolean;
}

export interface CreateTodoRequest {
  title: string;
  content: string;
  priority: number;
  category: string;
  startDate: string;
  dueDate: string;
}

export interface UpdateTodoRequest extends Partial<CreateTodoRequest> {
  completed?: boolean;
}